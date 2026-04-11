<script setup lang="ts">
import { ref, reactive, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'
import type { CSSProperties } from 'vue'
import type { ColDef, ColState, GridApi, ResolvedCol } from './types'
import './cathode.css'

// ── Props ─────────────────────────────────────────────────────────────────────

const props = withDefaults(defineProps<{
  columnDefs:           ColDef[]
  rowData?:             any[]
  rowHeight?:           number
  defaultColDef?:       Partial<ColDef>
  getRowStyle?:         (p: { data: any, node: any }) => CSSProperties | undefined
  pinnedBottomRowData?: any[]

  pagination?:          boolean
  paginationPageSize?:  number

  /** 'none' = inherit parent CSS vars  |  'phosphor' | 'amber' | 'paper' */
  theme?:       'none' | 'phosphor' | 'amber' | 'paper'
  /**
   * Barrel-distortion strength 0-45.
   * Drives a canvas-generated SVG displacement map applied to the whole grid,
   * so every row arcs like a CRT phosphor line.  0 = flat.
   */
  curvature?:   number
  scanlines?:   boolean
  glow?:        boolean
}>(), {
  rowData:            () => [],
  rowHeight:          28,
  theme:              'none',
  curvature:          25,
  scanlines:          true,
  glow:               true,
  pagination:         false,
  paginationPageSize: 50,
})

// ── Emits ─────────────────────────────────────────────────────────────────────

const emit = defineEmits<{
  'grid-ready':     [{ api: GridApi }]
  'row-clicked':    [{ data: any, event: MouseEvent }]
  'column-moved':   []
  'column-resized': []
  'sort-changed':   []
  'filter-changed': []
}>()

// ── Internal state ────────────────────────────────────────────────────────────

const localRowData  = ref<any[]>(props.rowData ?? [])
const localPinned   = ref<any[]>(props.pinnedBottomRowData ?? [])
const quickFilter   = ref('')
const sortState     = ref<{ colId: string, dir: 'asc' | 'desc' } | null>(null)
const colFilters    = reactive<Record<string, string>>({})
const colWidths     = reactive<Record<string, number>>({})
const hiddenCols    = reactive(new Set<string>())
const currentPage   = ref(0)
const refreshKey    = ref(0)
const activeFilter  = ref<string | null>(null)

// DOM refs
const gridEl          = ref<HTMLElement | null>(null)
const bodyEl          = ref<HTMLElement | null>(null)
const headerWrapperEl = ref<HTMLElement | null>(null)

// ── Barrel-distortion filter ──────────────────────────────────────────────────
//
// Instead of per-cell CSS rotateY (which only tilts flat column panels),
// we generate a canvas displacement-map and apply it as an SVG feDisplacementMap
// to the ENTIRE grid.  This is the same technique cool-retro-term uses in GLSL:
//
//   vec2 cc = coords - 0.5;
//   float dist = dot(cc, cc) * screenCurvature;
//   return coords + cc * (1 + dist) * dist;
//
// Result: every row arcs like a real CRT phosphor line; columns curve inward
// at both edges.

const filterId      = `cathode-${Math.random().toString(36).slice(2, 8)}`
const mapDataUrl    = ref('')
const displaceScale = ref(0)

let resizeObserver: ResizeObserver | null = null

function generateBarrelMap() {
  if (props.curvature === 0) { mapDataUrl.value = ''; return }
  if (!gridEl.value)          return

  const W = gridEl.value.clientWidth
  const H = gridEl.value.clientHeight
  if (!W || !H) return

  // Map curvature (0–45 user range) to screenCurvature (0–0.7 cool-retro-term range)
  const strength = (props.curvature / 45) * 0.55

  // 256×256 is plenty — the distortion field is smooth
  const MAP = 256
  const canvas = document.createElement('canvas')
  canvas.width = MAP; canvas.height = MAP
  const ctx = canvas.getContext('2d')!
  const img = ctx.createImageData(MAP, MAP)
  const d   = img.data

  // Pre-pass: find maximum displacement so we can calibrate the scale param
  let maxDisp = 0
  const dispBuf = new Float32Array(MAP * MAP * 2)

  for (let py = 0; py < MAP; py++) {
    for (let px = 0; px < MAP; px++) {
      const nx  = px / (MAP - 1) - 0.5   // [-0.5, 0.5]
      const ny  = py / (MAP - 1) - 0.5
      const r2  = nx * nx + ny * ny
      const dist = r2 * strength
      // Displacement in output-pixel coordinates (cool-retro-term formula)
      const dx  = nx * (1 + dist) * dist * W
      const dy  = ny * (1 + dist) * dist * H
      const i   = (py * MAP + px) * 2
      dispBuf[i]     = dx
      dispBuf[i + 1] = dy
      if (Math.abs(dx) > maxDisp) maxDisp = Math.abs(dx)
      if (Math.abs(dy) > maxDisp) maxDisp = Math.abs(dy)
    }
  }

  // feDisplacementMap: sourceXY = outXY + scale * (channel/255 - 0.5)
  // so  channel/255 = disp/scale + 0.5
  const scale = maxDisp * 2.2   // headroom to avoid clamping
  displaceScale.value = scale

  for (let py = 0; py < MAP; py++) {
    for (let px = 0; px < MAP; px++) {
      const i  = (py * MAP + px) * 2
      const dx = dispBuf[i]
      const dy = dispBuf[i + 1]
      const pi = (py * MAP + px) * 4
      d[pi]     = Math.min(255, Math.max(0, Math.round((dx / scale + 0.5) * 255)))
      d[pi + 1] = Math.min(255, Math.max(0, Math.round((dy / scale + 0.5) * 255)))
      d[pi + 2] = 0
      d[pi + 3] = 255
    }
  }

  ctx.putImageData(img, 0, 0)
  mapDataUrl.value = canvas.toDataURL()
}

// ── Column ID helpers ─────────────────────────────────────────────────────────

function colIdOf(def: ColDef): string {
  return (
    def.colId
    ?? def.field
    ?? (def.headerName ? def.headerName.toLowerCase().replace(/\s+/g, '_') : undefined)
    ?? `col_${Math.random().toString(36).slice(2, 7)}`
  )
}

// ── Resolved columns ──────────────────────────────────────────────────────────

const resolvedCols = computed<ResolvedCol[]>(() => {
  const defaults = props.defaultColDef ?? {}
  return props.columnDefs
    .filter(def => !hiddenCols.has(colIdOf(def)))
    .map(def => {
      const colId  = colIdOf(def)
      const merged = { ...defaults, ...def } as ColDef
      return { colId, colDef: merged, width: colWidths[colId] ?? merged.width ?? 100 }
    })
})

const gridTotalWidth = computed(() =>
  resolvedCols.value.reduce((s, c) => s + c.width, 0)
)

// ── Cell value / format helpers ───────────────────────────────────────────────

function getCellValue(row: any, col: ResolvedCol): any {
  if (col.colDef.valueGetter) return col.colDef.valueGetter({ data: row, colDef: col.colDef })
  if (col.colDef.field)       return row[col.colDef.field]
  return undefined
}

function formatCell(col: ResolvedCol, row: any): string {
  const value = getCellValue(row, col)
  if (col.colDef.valueFormatter) {
    return col.colDef.valueFormatter({ value, data: row, colDef: col.colDef }) ?? ''
  }
  return value == null ? '' : String(value)
}

function renderCell(col: ResolvedCol, row: any): string {
  if (!col.colDef.cellRenderer) return formatCell(col, row)
  const value  = getCellValue(row, col)
  const result = col.colDef.cellRenderer({ value, data: row, colDef: col.colDef })
  return result ?? formatCell(col, row)
}

function getCellStyle(col: ResolvedCol, row: any): CSSProperties {
  if (!col.colDef.cellStyle) return {}
  if (typeof col.colDef.cellStyle === 'function') {
    return col.colDef.cellStyle({ value: getCellValue(row, col), data: row, colDef: col.colDef }) ?? {}
  }
  return col.colDef.cellStyle
}

// ── Cell inline styles (no transforms — barrel filter handles curvature) ───────

function headerCellStyle(col: ResolvedCol): CSSProperties {
  return { width: col.width + 'px', minWidth: col.width + 'px' }
}

function dataCellStyle(col: ResolvedCol, row: any): CSSProperties {
  return {
    width:    col.width + 'px',
    minWidth: col.width + 'px',
    height:   props.rowHeight + 'px',
    ...getCellStyle(col, row),
  }
}

function rowStyle(row: any, pinned = false): CSSProperties {
  return props.getRowStyle?.({ data: row, node: { rowPinned: pinned } }) ?? {}
}

// ── Sort ──────────────────────────────────────────────────────────────────────

function onSortHeader(colId: string) {
  const col = resolvedCols.value.find(c => c.colId === colId)
  if (!col || col.colDef.sortable === false) return
  if (sortState.value?.colId === colId) {
    sortState.value = sortState.value.dir === 'asc' ? { colId, dir: 'desc' } : null
  } else {
    sortState.value = { colId, dir: 'asc' }
  }
  emit('sort-changed')
}

// ── Column filter popup ───────────────────────────────────────────────────────

function toggleFilterPopup(colId: string) {
  activeFilter.value = activeFilter.value === colId ? null : colId
}

function onColFilterInput(colId: string, val: string) {
  if (val) colFilters[colId] = val
  else     delete colFilters[colId]
  currentPage.value = 0
  emit('filter-changed')
}

function onDocClick(e: MouseEvent) {
  if (!activeFilter.value) return
  const t = e.target as HTMLElement
  if (!t.closest?.('.cathode-filter-popup') && !t.closest?.('.cathode-filter-icon')) {
    activeFilter.value = null
  }
}

// ── Column resize ─────────────────────────────────────────────────────────────

let resizeColId  = ''
let resizeStartX = 0
let resizeStartW = 0

function onResizeStart(colId: string, e: MouseEvent) {
  e.preventDefault(); e.stopPropagation()
  resizeColId  = colId
  resizeStartX = e.clientX
  resizeStartW = resolvedCols.value.find(c => c.colId === colId)?.width ?? 100
  document.addEventListener('mousemove', onResizeMove)
  document.addEventListener('mouseup',   onResizeUp)
}
function onResizeMove(e: MouseEvent) {
  const min = resolvedCols.value.find(c => c.colId === resizeColId)?.colDef.minWidth ?? 40
  colWidths[resizeColId] = Math.max(min, resizeStartW + (e.clientX - resizeStartX))
}
function onResizeUp() {
  document.removeEventListener('mousemove', onResizeMove)
  document.removeEventListener('mouseup',   onResizeUp)
  emit('column-resized')
}

// ── Sync horizontal scroll header ↔ body ──────────────────────────────────────

function onBodyScroll(e: Event) {
  if (headerWrapperEl.value)
    headerWrapperEl.value.scrollLeft = (e.target as HTMLElement).scrollLeft
}

// ── Filter + sort ─────────────────────────────────────────────────────────────

const filteredRows = computed<any[]>(() => {
  void refreshKey.value          // reactive dependency for refreshCells()
  let rows = localRowData.value

  const q = quickFilter.value.trim().toLowerCase()
  if (q) {
    rows = rows.filter(row =>
      resolvedCols.value.some(col =>
        String(getCellValue(row, col) ?? '').toLowerCase().includes(q)
      )
    )
  }

  for (const [colId, raw] of Object.entries(colFilters)) {
    if (!raw) continue
    const col = resolvedCols.value.find(c => c.colId === colId)
    if (!col) continue
    if (raw.startsWith('__eq__')) {
      const t = raw.slice(6).toLowerCase()
      rows = rows.filter(r => String(getCellValue(r, col) ?? '').toLowerCase() === t)
    } else {
      const t = raw.toLowerCase()
      rows = rows.filter(r => String(getCellValue(r, col) ?? '').toLowerCase().includes(t))
    }
  }

  if (sortState.value) {
    const { colId, dir } = sortState.value
    const col = resolvedCols.value.find(c => c.colId === colId)
    if (col) {
      rows = [...rows].sort((a, b) => {
        const av = getCellValue(a, col)
        const bv = getCellValue(b, col)
        let cmp = 0
        if (col.colDef.comparator) {
          cmp = col.colDef.comparator(av, bv)
        } else if (typeof av === 'number' && typeof bv === 'number') {
          cmp = av - bv
        } else {
          cmp = String(av ?? '').localeCompare(String(bv ?? ''), undefined, { numeric: true })
        }
        return dir === 'asc' ? cmp : -cmp
      })
    }
  }

  return rows
})

const totalPages = computed(() =>
  Math.max(1, Math.ceil(filteredRows.value.length / props.paginationPageSize))
)
const pagedRows = computed<any[]>(() =>
  props.pagination
    ? filteredRows.value.slice(
        currentPage.value * props.paginationPageSize,
        (currentPage.value + 1) * props.paginationPageSize
      )
    : filteredRows.value
)

watch(filteredRows, () => { currentPage.value = 0 })

// ── Grid API ──────────────────────────────────────────────────────────────────

const gridApi: GridApi = {
  setGridOption(key: string, value: any) {
    if (key === 'rowData')             localRowData.value = value
    else if (key === 'pinnedBottomRowData') localPinned.value = value
    else if (key === 'quickFilterText')     quickFilter.value = value
  },

  getColumnState(): ColState[] {
    return props.columnDefs.map(def => {
      const colId = colIdOf(def)
      return {
        colId,
        hide:      hiddenCols.has(colId),
        sort:      sortState.value?.colId === colId ? sortState.value.dir : null,
        sortIndex: sortState.value?.colId === colId ? 0 : null,
        width:     colWidths[colId] ?? def.width,
      }
    })
  },

  applyColumnState({ state }) {
    for (const s of state) {
      if (s.hide === true)  hiddenCols.add(s.colId)
      if (s.hide === false) hiddenCols.delete(s.colId)
      if (s.sort)           sortState.value = { colId: s.colId, dir: s.sort }
      if (s.width)          colWidths[s.colId] = s.width
    }
  },

  setFilterModel(model) {
    for (const k of Object.keys(colFilters)) delete colFilters[k]
    if (!model) return
    for (const [colId, filter] of Object.entries(model)) {
      if (filter?.type === 'equals') colFilters[colId] = `__eq__${filter.filter}`
      else if (filter?.filter)       colFilters[colId] = filter.filter
    }
  },

  getFilterModel() {
    const model: Record<string, any> = {}
    for (const [colId, raw] of Object.entries(colFilters)) {
      if (!raw) continue
      if (raw.startsWith('__eq__')) model[colId] = { type: 'equals',   filter: raw.slice(6) }
      else                          model[colId] = { type: 'contains', filter: raw }
    }
    return model
  },

  async setColumnFilterModel(colId: string, model: any) {
    if (!model)                    delete colFilters[colId]
    else if (model.type === 'equals') colFilters[colId] = `__eq__${model.filter}`
    else                              colFilters[colId] = model.filter ?? ''
  },

  onFilterChanged() { /* Vue reactivity propagates automatically */ },
  refreshCells()    { refreshKey.value++ },

  exportDataAsCsv({ fileName = 'export.csv' } = {}) {
    const cols   = resolvedCols.value
    const header = cols.map(c => c.colDef.headerName ?? c.colId).join(',')
    const lines  = filteredRows.value.map(row =>
      cols.map(col => `"${String(formatCell(col, row)).replace(/"/g, '""')}"`).join(',')
    )
    const blob = new Blob([[header, ...lines].join('\n')], { type: 'text/csv' })
    const url  = URL.createObjectURL(blob)
    const a    = Object.assign(document.createElement('a'), { href: url, download: fileName })
    a.click(); URL.revokeObjectURL(url)
  },

  resetColumnState() {
    hiddenCols.clear()
    for (const def of props.columnDefs) {
      if (def.hide) hiddenCols.add(colIdOf(def))
    }
    const init = props.columnDefs.find(d => d.sort)
    sortState.value = init ? { colId: colIdOf(init), dir: init.sort! } : null
    for (const k of Object.keys(colWidths))  delete colWidths[k]
    for (const k of Object.keys(colFilters)) delete colFilters[k]
    quickFilter.value = ''
  },
}

// ── Lifecycle ─────────────────────────────────────────────────────────────────

onMounted(() => {
  for (const def of props.columnDefs) {
    if (def.hide)  hiddenCols.add(colIdOf(def))
    if (def.sort && !sortState.value)
      sortState.value = { colId: colIdOf(def), dir: def.sort }
  }
  localRowData.value = props.rowData ?? []
  localPinned.value  = props.pinnedBottomRowData ?? []
  document.addEventListener('click', onDocClick, true)

  nextTick(() => {
    generateBarrelMap()
    if (gridEl.value) {
      resizeObserver = new ResizeObserver(() => generateBarrelMap())
      resizeObserver.observe(gridEl.value)
    }
  })

  emit('grid-ready', { api: gridApi })
})

onUnmounted(() => {
  document.removeEventListener('click', onDocClick, true)
  document.removeEventListener('mousemove', onResizeMove)
  document.removeEventListener('mouseup',   onResizeUp)
  resizeObserver?.disconnect()
})

watch(() => props.curvature, () => nextTick(() => generateBarrelMap()))

// ── Root CSS class ────────────────────────────────────────────────────────────

const rootClass = computed(() => [
  'cathode-grid',
  props.theme !== 'none' ? `cathode-theme-${props.theme}` : '',
  props.scanlines ? 'cathode-scanlines' : '',
  props.glow      ? 'cathode-glow'      : '',
].filter(Boolean).join(' '))

const screenFilter = computed(() =>
  props.curvature > 0 && mapDataUrl.value
    ? { filter: `url(#${filterId})` }
    : {}
)
</script>

<template>
  <div ref="gridEl" :class="rootClass">

    <!--
      ── Barrel distortion SVG filter ──────────────────────────────────────────
      Hidden 0×0 SVG that defines the filter.  The canvas-generated displacement
      map encodes the cool-retro-term barrel formula so every row curves like a
      real CRT phosphor line.  Applied to .cathode-screen below.
    -->
    <svg
      v-if="curvature > 0 && mapDataUrl"
      style="position:absolute;width:0;height:0;overflow:hidden"
      aria-hidden="true"
    >
      <defs>
        <filter
          :id="filterId"
          color-interpolation-filters="sRGB"
          x="-15%" y="-15%" width="130%" height="130%"
        >
          <!--
            feImage loads the displacement map (data URL from canvas).
            R channel → X displacement, G channel → Y displacement.
            preserveAspectRatio="none" stretches map to fit exactly.
          -->
          <feImage
            :href="mapDataUrl"
            result="dispmap"
            x="-15%" y="-15%" width="130%" height="130%"
            preserveAspectRatio="none"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="dispmap"
            :scale="displaceScale"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </defs>
    </svg>

    <!--
      ── Distorted screen area ──────────────────────────────────────────────────
      The filter is applied here so header + body + pagination ALL curve together,
      just like a CRT screen where every element is on the same curved surface.
    -->
    <div class="cathode-screen" :style="screenFilter">

      <!-- Column headers -->
      <div ref="headerWrapperEl" class="cathode-header-wrapper">
        <div class="cathode-header-row" :style="{ width: gridTotalWidth + 'px' }">
          <div
            v-for="col in resolvedCols"
            :key="col.colId"
            class="cathode-header-cell"
            :style="headerCellStyle(col)"
            @click="onSortHeader(col.colId)"
          >
            <span class="cathode-header-text">{{ col.colDef.headerName ?? col.colId }}</span>

            <span v-if="sortState?.colId === col.colId" class="cathode-sort-icon">
              {{ sortState.dir === 'asc' ? '▲' : '▼' }}
            </span>

            <span
              v-if="col.colDef.filter"
              :class="['cathode-filter-icon', { active: !!colFilters[col.colId] }]"
              :title="colFilters[col.colId] ? 'Filtered' : 'Filter'"
              @click.stop="toggleFilterPopup(col.colId)"
            >⌕</span>

            <div
              v-if="activeFilter === col.colId"
              class="cathode-filter-popup"
              @click.stop
            >
              <input
                class="cathode-filter-input"
                :value="colFilters[col.colId] ?? ''"
                placeholder="Filter…"
                autofocus
                @input="onColFilterInput(col.colId, ($event.target as HTMLInputElement).value)"
              />
            </div>

            <div
              v-if="col.colDef.resizable !== false"
              class="cathode-resize-handle"
              @mousedown.stop="onResizeStart(col.colId, $event)"
            />
          </div>
        </div>
      </div>

      <!-- Scrollable body -->
      <div ref="bodyEl" class="cathode-body" @scroll="onBodyScroll">
        <div :style="{ width: gridTotalWidth + 'px' }">

          <!-- Data rows -->
          <div
            v-for="(row, ri) in pagedRows"
            :key="ri"
            class="cathode-data-row"
            :style="rowStyle(row, false)"
            @click="emit('row-clicked', { data: row, event: $event })"
          >
            <div
              v-for="col in resolvedCols"
              :key="col.colId"
              class="cathode-cell"
              :style="dataCellStyle(col, row)"
            >
              <span v-if="col.colDef.cellRenderer" v-html="renderCell(col, row)" />
              <span v-else>{{ formatCell(col, row) }}</span>
            </div>
          </div>

          <!-- Pinned bottom rows -->
          <div
            v-for="(row, ri) in localPinned"
            :key="`p${ri}`"
            class="cathode-data-row cathode-row-pinned"
            :style="rowStyle(row, true)"
            @click="emit('row-clicked', { data: row, event: $event })"
          >
            <div
              v-for="col in resolvedCols"
              :key="col.colId"
              class="cathode-cell"
              :style="dataCellStyle(col, row)"
            >
              <span v-if="col.colDef.cellRenderer" v-html="renderCell(col, row)" />
              <span v-else>{{ formatCell(col, row) }}</span>
            </div>
          </div>

        </div>
      </div>

      <!-- Pagination -->
      <div v-if="pagination" class="cathode-pagination">
        <button :disabled="currentPage === 0"             @click="currentPage--">◀</button>
        <span>{{ currentPage + 1 }} / {{ totalPages }}</span>
        <button :disabled="currentPage >= totalPages - 1" @click="currentPage++">▶</button>
        <span class="cathode-page-count">{{ filteredRows.length }} rows</span>
      </div>

    </div><!-- .cathode-screen -->

  </div><!-- .cathode-grid -->
</template>
