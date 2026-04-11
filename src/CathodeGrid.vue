<script setup lang="ts">
import { ref, reactive, computed, watch, onMounted, onUnmounted } from 'vue'
import type { CSSProperties } from 'vue'
import type { ColDef, ColState, GridApi, ResolvedCol } from './types'
import './cathode.css'

// ── Props ─────────────────────────────────────────────────────────────────────

const props = withDefaults(defineProps<{
  columnDefs:          ColDef[]
  rowData?:            any[]
  rowHeight?:          number
  defaultColDef?:      Partial<ColDef>
  getRowStyle?:        (p: { data: any, node: any }) => CSSProperties | undefined
  pinnedBottomRowData?: any[]

  pagination?:         boolean
  paginationPageSize?: number

  /** 'none' = inherit parent CSS vars  |  'phosphor' | 'amber' | 'paper' */
  theme?:       'none' | 'phosphor' | 'amber' | 'paper'
  /** Max rotateY angle in degrees for edge columns — 0 disables curve */
  curvature?:   number
  /** CSS perspective distance in px — higher = subtler vanishing point */
  perspective?: number
  scanlines?:   boolean
  glow?:        boolean
}>(), {
  rowData:            () => [],
  rowHeight:          28,
  theme:              'none',
  curvature:          10,
  perspective:        1400,
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
const activeFilter  = ref<string | null>(null)  // colId with open filter popup

// DOM refs
const bodyEl         = ref<HTMLElement | null>(null)
const headerWrapperEl = ref<HTMLElement | null>(null)

// ── Column ID helpers ─────────────────────────────────────────────────────────

function colIdOf(def: ColDef): string {
  return (
    def.colId
    ?? def.field
    ?? (def.headerName ? def.headerName.toLowerCase().replace(/\s+/g, '_') : undefined)
    ?? `col_${Math.random().toString(36).slice(2, 7)}`
  )
}

// ── Resolved columns (visible, with merged defaults + widths) ─────────────────

const resolvedCols = computed<ResolvedCol[]>(() => {
  const defaults = props.defaultColDef ?? {}
  return props.columnDefs
    .filter(def => !hiddenCols.has(colIdOf(def)))
    .map(def => {
      const colId  = colIdOf(def)
      const merged = { ...defaults, ...def } as ColDef
      return {
        colId,
        colDef: merged,
        width:  colWidths[colId] ?? merged.width ?? 100,
      }
    })
})

const gridTotalWidth = computed(() =>
  resolvedCols.value.reduce((s, c) => s + c.width, 0)
)

// ── CRT curve math ────────────────────────────────────────────────────────────
// Left-most column: positive rotateY (right face tips toward viewer).
// Right-most column: negative rotateY (left face tips toward viewer).
// Centre column: 0°  → looks as if the screen bulges toward you.

function colAngle(colIdx: number, total: number): number {
  if (total <= 1 || props.curvature === 0) return 0
  const centre     = (total - 1) / 2
  const normalised = (colIdx - centre) / centre   // [-1, 1]
  return -normalised * props.curvature             // negative = right cols tilt left
}

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
  const def = col.colDef
  if (!def.cellStyle) return {}
  if (typeof def.cellStyle === 'function') {
    return def.cellStyle({ value: getCellValue(row, col), data: row, colDef: def }) ?? {}
  }
  return def.cellStyle
}

// ── Inline style builders ─────────────────────────────────────────────────────

function cellTransformStyle(colIdx: number, total: number): CSSProperties {
  const angle = colAngle(colIdx, total)
  return {
    transform:  `perspective(${props.perspective}px) rotateY(${angle}deg)`,
  }
}

function headerCellInlineStyle(col: ResolvedCol, colIdx: number): CSSProperties {
  return {
    width:    col.width + 'px',
    minWidth: col.width + 'px',
    ...cellTransformStyle(colIdx, resolvedCols.value.length),
  }
}

function dataCellInlineStyle(col: ResolvedCol, colIdx: number, row: any): CSSProperties {
  const height = props.rowHeight + 'px'
  return {
    width:    col.width + 'px',
    minWidth: col.width + 'px',
    height,
    ...cellTransformStyle(colIdx, resolvedCols.value.length),
    ...getCellStyle(col, row),
  }
}

function rowInlineStyle(row: any, pinned = false): CSSProperties {
  if (!props.getRowStyle) return {}
  return props.getRowStyle({ data: row, node: { rowPinned: pinned } }) ?? {}
}

// ── Sort ──────────────────────────────────────────────────────────────────────

function onSortHeader(colId: string) {
  const col = resolvedCols.value.find(c => c.colId === colId)
  if (!col || col.colDef.sortable === false) return

  if (sortState.value?.colId === colId) {
    sortState.value = sortState.value.dir === 'asc'
      ? { colId, dir: 'desc' }
      : null
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

// Close popups on outside click
function onDocClick(e: MouseEvent) {
  if (!activeFilter.value) return
  const target = e.target as HTMLElement
  if (!target.closest?.('.cathode-filter-popup') && !target.closest?.('.cathode-filter-icon')) {
    activeFilter.value = null
  }
}

// ── Column resize ─────────────────────────────────────────────────────────────

let resizeColId   = ''
let resizeStartX  = 0
let resizeStartW  = 0

function onResizeStart(colId: string, e: MouseEvent) {
  e.preventDefault()
  e.stopPropagation()
  resizeColId  = colId
  resizeStartX = e.clientX
  const col    = resolvedCols.value.find(c => c.colId === colId)
  resizeStartW = col?.width ?? 100
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

// ── Sync horizontal scroll ────────────────────────────────────────────────────

function onBodyScroll(e: Event) {
  if (headerWrapperEl.value) {
    headerWrapperEl.value.scrollLeft = (e.target as HTMLElement).scrollLeft
  }
}

// ── Filter + sort logic ───────────────────────────────────────────────────────

const filteredRows = computed<any[]>(() => {
  void refreshKey.value                         // dependency for refreshCells()
  let rows = localRowData.value

  // Quick filter
  const q = quickFilter.value.trim().toLowerCase()
  if (q) {
    rows = rows.filter(row =>
      resolvedCols.value.some(col => {
        const v = String(getCellValue(row, col) ?? '').toLowerCase()
        return v.includes(q)
      })
    )
  }

  // Column filters
  for (const [colId, raw] of Object.entries(colFilters)) {
    if (!raw) continue
    const col = resolvedCols.value.find(c => c.colId === colId)
    if (!col) continue
    if (raw.startsWith('__eq__')) {
      const target = raw.slice(6).toLowerCase()
      rows = rows.filter(r => String(getCellValue(r, col) ?? '').toLowerCase() === target)
    } else {
      const target = raw.toLowerCase()
      rows = rows.filter(r => String(getCellValue(r, col) ?? '').toLowerCase().includes(target))
    }
  }

  // Sort
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

// Pagination
const totalPages = computed(() =>
  Math.max(1, Math.ceil(filteredRows.value.length / props.paginationPageSize))
)
const pagedRows = computed<any[]>(() => {
  if (!props.pagination) return filteredRows.value
  const start = currentPage.value * props.paginationPageSize
  return filteredRows.value.slice(start, start + props.paginationPageSize)
})

watch(filteredRows, () => { currentPage.value = 0 })

// ── Grid API object ───────────────────────────────────────────────────────────

const gridApi: GridApi = {
  setGridOption(key: string, value: any) {
    if (key === 'rowData')            localRowData.value = value
    else if (key === 'pinnedBottomRowData') localPinned.value = value
    else if (key === 'quickFilterText')    quickFilter.value = value
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
    // Clear existing column filters
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
      if (raw.startsWith('__eq__')) model[colId] = { type: 'equals', filter: raw.slice(6) }
      else                          model[colId] = { type: 'contains', filter: raw }
    }
    return model
  },

  async setColumnFilterModel(colId: string, model: any) {
    if (!model) {
      delete colFilters[colId]
    } else if (model.type === 'equals') {
      colFilters[colId] = `__eq__${model.filter}`
    } else {
      colFilters[colId] = model.filter ?? ''
    }
  },

  onFilterChanged() { /* no-op — Vue reactivity propagates automatically */ },

  refreshCells() { refreshKey.value++ },

  exportDataAsCsv({ fileName = 'export.csv' } = {}) {
    const cols   = resolvedCols.value
    const header = cols.map(c => c.colDef.headerName ?? c.colId).join(',')
    const rowLines = filteredRows.value.map(row =>
      cols.map(col => `"${String(formatCell(col, row)).replace(/"/g, '""')}"`).join(',')
    )
    const csv  = [header, ...rowLines].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement('a')
    a.href = url; a.download = fileName; a.click()
    URL.revokeObjectURL(url)
  },

  resetColumnState() {
    hiddenCols.clear()
    for (const def of props.columnDefs) {
      if (def.hide) hiddenCols.add(colIdOf(def))
    }
    const initial = props.columnDefs.find(d => d.sort)
    sortState.value = initial
      ? { colId: colIdOf(initial), dir: initial.sort! }
      : null
    for (const k of Object.keys(colWidths))  delete colWidths[k]
    for (const k of Object.keys(colFilters)) delete colFilters[k]
    quickFilter.value = ''
  },
}

// ── Lifecycle ─────────────────────────────────────────────────────────────────

onMounted(() => {
  // Initialise hidden + sort from columnDefs
  for (const def of props.columnDefs) {
    if (def.hide) hiddenCols.add(colIdOf(def))
    if (def.sort && !sortState.value) {
      sortState.value = { colId: colIdOf(def), dir: def.sort }
    }
  }
  localRowData.value = props.rowData ?? []
  localPinned.value  = props.pinnedBottomRowData ?? []
  document.addEventListener('click', onDocClick, true)
  emit('grid-ready', { api: gridApi })
})

onUnmounted(() => {
  document.removeEventListener('click', onDocClick, true)
  document.removeEventListener('mousemove', onResizeMove)
  document.removeEventListener('mouseup',   onResizeUp)
})

// ── CSS class string for the root element ────────────────────────────────────

const rootClass = computed(() => {
  const parts = ['cathode-grid']
  if (props.theme !== 'none')   parts.push(`cathode-theme-${props.theme}`)
  if (props.scanlines)          parts.push('cathode-scanlines')
  if (props.glow)               parts.push('cathode-glow')
  return parts.join(' ')
})
</script>

<template>
  <div :class="rootClass">

    <!-- ── Column header ──────────────────────────────────────────────────── -->
    <div ref="headerWrapperEl" class="cathode-header-wrapper">
      <div class="cathode-header-row" :style="{ width: gridTotalWidth + 'px' }">
        <div
          v-for="(col, ci) in resolvedCols"
          :key="col.colId"
          class="cathode-header-cell"
          :style="headerCellInlineStyle(col, ci)"
          @click="onSortHeader(col.colId)"
        >
          <span class="cathode-header-text">{{ col.colDef.headerName ?? col.colId }}</span>

          <!-- Sort indicator -->
          <span
            v-if="sortState?.colId === col.colId"
            class="cathode-sort-icon"
          >{{ sortState.dir === 'asc' ? '▲' : '▼' }}</span>

          <!-- Filter toggle icon -->
          <span
            v-if="col.colDef.filter"
            :class="['cathode-filter-icon', { active: !!colFilters[col.colId] }]"
            :title="colFilters[col.colId] ? 'Filtered' : 'Filter'"
            @click.stop="toggleFilterPopup(col.colId)"
          >⌕</span>

          <!-- Filter popup -->
          <div
            v-if="activeFilter === col.colId"
            class="cathode-filter-popup"
            @click.stop
          >
            <input
              class="cathode-filter-input"
              :value="colFilters[col.colId] ?? ''"
              placeholder="Filter..."
              autofocus
              @input="onColFilterInput(col.colId, ($event.target as HTMLInputElement).value)"
            />
          </div>

          <!-- Resize handle -->
          <div
            v-if="col.colDef.resizable !== false"
            class="cathode-resize-handle"
            @mousedown.stop="onResizeStart(col.colId, $event)"
          />
        </div>
      </div>
    </div>

    <!-- ── Scrollable body ────────────────────────────────────────────────── -->
    <div ref="bodyEl" class="cathode-body" @scroll="onBodyScroll">
      <div :style="{ width: gridTotalWidth + 'px' }">

        <!-- Data rows -->
        <div
          v-for="(row, ri) in pagedRows"
          :key="ri"
          class="cathode-data-row"
          :style="rowInlineStyle(row, false)"
          @click="emit('row-clicked', { data: row, event: $event })"
        >
          <div
            v-for="(col, ci) in resolvedCols"
            :key="col.colId"
            class="cathode-cell"
            :style="dataCellInlineStyle(col, ci, row)"
          >
            <!-- cellRenderer returns HTML string → v-html -->
            <span
              v-if="col.colDef.cellRenderer"
              v-html="renderCell(col, row)"
            />
            <!-- plain value -->
            <span v-else>{{ formatCell(col, row) }}</span>
          </div>
        </div>

        <!-- Pinned bottom rows -->
        <div
          v-for="(row, ri) in localPinned"
          :key="`pinned-${ri}`"
          class="cathode-data-row cathode-row-pinned"
          :style="rowInlineStyle(row, true)"
          @click="emit('row-clicked', { data: row, event: $event })"
        >
          <div
            v-for="(col, ci) in resolvedCols"
            :key="col.colId"
            class="cathode-cell"
            :style="dataCellInlineStyle(col, ci, row)"
          >
            <span v-if="col.colDef.cellRenderer" v-html="renderCell(col, row)" />
            <span v-else>{{ formatCell(col, row) }}</span>
          </div>
        </div>

      </div>
    </div>

    <!-- ── Pagination bar ─────────────────────────────────────────────────── -->
    <div v-if="pagination" class="cathode-pagination">
      <button :disabled="currentPage === 0"              @click="currentPage--">◀</button>
      <span>{{ currentPage + 1 }} / {{ totalPages }}</span>
      <button :disabled="currentPage >= totalPages - 1"  @click="currentPage++">▶</button>
      <span class="cathode-page-count">{{ filteredRows.length }} rows</span>
    </div>

  </div>
</template>
