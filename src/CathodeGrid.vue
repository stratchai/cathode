<script setup lang="ts">
import {
  ref, reactive, computed, watch, onMounted, onUnmounted, nextTick,
} from 'vue'
import type { CSSProperties } from 'vue'
import * as THREE from 'three'
import type { ColDef, ColState, GridApi, ResolvedCol } from './types'
import {
  drawGrid, screenToCanvas, hitTest,
  isOnFilterIcon, isOnResizeHandle, colLeft,
  HEADER_H, THEME_COLORS, applyBarrel,
} from './CanvasGrid'
import './cathode.css'

// ── Props ─────────────────────────────────────────────────────────────────────

const props = withDefaults(defineProps<{
  columnDefs:           ColDef[]
  rowData?:             any[]
  rowHeight?:           number
  defaultColDef?:       Partial<ColDef>
  getRowStyle?:         (p: { data: any, node: any }) => CSSProperties | undefined
  pinnedBottomRowData?: any[]

  pagination?:         boolean
  paginationPageSize?: number   // maximum rows/page; actual count auto-fitted to height

  /** 'none' inherits parent CSS vars; 'phosphor' | 'amber' | 'paper' are built-in */
  theme?:     'none' | 'phosphor' | 'amber' | 'paper'
  /**
   * 0–45  barrel-distortion strength.
   * Higher = more panoramic CRT curve; edge columns compress so more fits.
   */
  curvature?: number
  scanlines?: boolean
  glow?:      boolean
}>(), {
  rowData:            () => [],
  rowHeight:          28,
  theme:              'none',
  curvature:          25,
  scanlines:          true,
  glow:               true,
  pagination:         true,
  paginationPageSize: 200,   // effectively unlimited; auto-fit drives page size
})

// ── Emits ─────────────────────────────────────────────────────────────────────

const emit = defineEmits<{
  'grid-ready':       [{ api: GridApi }]
  'row-clicked':      [{ data: any, event: MouseEvent }]
  'cell-selected':    [{ data: any, row: number, col: number, colId: string }]
  'column-resized':   []
  'sort-changed':     []
  'filter-changed':   []
}>()

// ── Grid data state ───────────────────────────────────────────────────────────

const localRowData  = ref<any[]>(props.rowData ?? [])
const localPinned   = ref<any[]>(props.pinnedBottomRowData ?? [])
const quickFilter   = ref('')
const sortState     = ref<{ colId: string, dir: 'asc' | 'desc' } | null>(null)
const colFilters    = reactive<Record<string, string>>({})
const colWidths     = reactive<Record<string, number>>({})   // hint-space overrides
const hiddenCols    = reactive(new Set<string>())
const currentPage   = ref(0)
const refreshKey    = ref(0)

// ── Canvas dimensions (set by sizeToContainer) ────────────────────────────────

const canvasW = ref(0)
const canvasH = ref(0)

// ── Interaction state ─────────────────────────────────────────────────────────

const scrollY       = ref(0)   // vertical offset (px) — 0 when pagination fills exactly
const hoveredRow    = ref(-1)
const selectedCell  = ref<{ row: number, col: number } | null>(null)
const activeFilter  = ref<string | null>(null)

// Filter popup
const filterPopupPos   = ref({ x: 0, y: HEADER_H })
const filterPopupValue = ref('')

// ── Column ID helper ──────────────────────────────────────────────────────────

function colIdOf(def: ColDef): string {
  return (
    def.colId
    ?? def.field
    ?? (def.headerName ? def.headerName.toLowerCase().replace(/\s+/g, '_') : undefined)
    ?? `col_${Math.random().toString(36).slice(2, 7)}`
  )
}

// ── resolvedCols — applies user-set width overrides (hint-space) ───────────────

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

/**
 * displayCols — columns scaled so they EXACTLY fill canvasW.
 *
 * This is the core of the "fill the space" philosophy: regardless of how many
 * columns there are, they always fill the viewport.  Curvature then compresses
 * the edge columns, effectively giving a panoramic / more-data-per-pixel view.
 */
const displayCols = computed<ResolvedCol[]>(() => {
  const W = canvasW.value
  if (!W) return resolvedCols.value

  const totalHint = resolvedCols.value.reduce((s, c) => s + c.width, 0)
  if (!totalHint) return resolvedCols.value

  const scale = W / totalHint
  // Distribute any rounding remainder to the last column
  let used = 0
  return resolvedCols.value.map((c, i) => {
    const isLast = i === resolvedCols.value.length - 1
    const w = isLast ? W - used : Math.max(8, Math.round(c.width * scale))
    used += w
    return { ...c, width: w }
  })
})

// ── autoPageSize — fills available height exactly (no vertical scroll needed) ──

const autoPageSize = computed(() => {
  const H = canvasH.value
  if (!H) return props.paginationPageSize
  const pinnedH = localPinned.value.length * props.rowHeight
  const bodyH   = H - HEADER_H - pinnedH
  const fit     = Math.max(1, Math.floor(bodyH / props.rowHeight))
  return Math.min(fit, props.paginationPageSize)
})

// ── Cell value / format helpers ───────────────────────────────────────────────

function getCellValue(row: any, col: ResolvedCol): any {
  if (col.colDef.valueGetter) return col.colDef.valueGetter({ data: row, colDef: col.colDef })
  if (col.colDef.field)       return row[col.colDef.field]
  return undefined
}

function formatCell(col: ResolvedCol, row: any): string {
  const value = getCellValue(row, col)
  if (col.colDef.valueFormatter)
    return col.colDef.valueFormatter({ value, data: row, colDef: col.colDef }) ?? ''
  if (col.colDef.cellRenderer) {
    const html = col.colDef.cellRenderer({ value, data: row, colDef: col.colDef }) ?? ''
    return html.replace(/<[^>]+>/g, '')        // strip HTML → plain text for canvas
  }
  return value == null ? '' : String(value)
}

function getCellStyle(col: ResolvedCol, row: any): CSSProperties {
  if (!col.colDef.cellStyle) return {}
  if (typeof col.colDef.cellStyle === 'function')
    return col.colDef.cellStyle({ value: getCellValue(row, col), data: row, colDef: col.colDef }) ?? {}
  return col.colDef.cellStyle
}

// ── Filter + sort + paging ────────────────────────────────────────────────────

const filteredRows = computed<any[]>(() => {
  void refreshKey.value
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
        if (col.colDef.comparator)                               cmp = col.colDef.comparator(av, bv)
        else if (typeof av === 'number' && typeof bv === 'number') cmp = av - bv
        else cmp = String(av ?? '').localeCompare(String(bv ?? ''), undefined, { numeric: true })
        return dir === 'asc' ? cmp : -cmp
      })
    }
  }

  return rows
})

const totalPages = computed(() =>
  Math.max(1, Math.ceil(filteredRows.value.length / autoPageSize.value))
)

const pagedRows = computed<any[]>(() =>
  props.pagination
    ? filteredRows.value.slice(
        currentPage.value * autoPageSize.value,
        (currentPage.value + 1) * autoPageSize.value,
      )
    : filteredRows.value
)

watch(filteredRows, () => { currentPage.value = 0; selectedCell.value = null })
watch(autoPageSize, () => { currentPage.value = 0 })

// ── Column resize ─────────────────────────────────────────────────────────────
// Resize adjusts the PROPORTIONAL width of a column while keeping all columns
// filling the container.  We convert from display-pixel drag delta to hint-space
// so that displayCols re-scales correctly.

let resizeActive      = false
let resizeColId       = ''
let resizeStartX      = 0
let resizeStartDispW  = 0   // display width at resize start
let wasDragging       = false

function startColResize(colId: string, startClientX: number) {
  resizeActive     = true
  resizeColId      = colId
  resizeStartX     = startClientX
  resizeStartDispW = displayCols.value.find(c => c.colId === colId)?.width ?? 100
  wasDragging      = false
}

function onGlobalMouseMove(e: MouseEvent) {
  if (!resizeActive) return

  const W               = canvasW.value
  const desiredDispW    = Math.max(30, resizeStartDispW + (e.clientX - resizeStartX))
  const otherHints      = resolvedCols.value
    .filter(c => c.colId !== resizeColId)
    .reduce((s, c) => s + c.width, 0)

  // Solve: desiredDispW * scale = hint, where scale = W / (hint + otherHints)
  // → hint = (desiredDispW * otherHints) / (W - desiredDispW)
  const denom = W - desiredDispW
  if (denom > 10) {
    colWidths[resizeColId] = Math.max(10, Math.round((desiredDispW * otherHints) / denom))
  }

  redraw()
}

function onGlobalMouseUp() {
  if (resizeActive) {
    resizeActive = false
    wasDragging  = true
    emit('column-resized')
  }
}

// ── DOM refs ──────────────────────────────────────────────────────────────────

const wrapEl   = ref<HTMLDivElement | null>(null)
const canvasEl = ref<HTMLCanvasElement | null>(null)

// ── Three.js ───────────────────────────────────────────────────────────────────

let renderer:  THREE.WebGLRenderer | null = null
let scene:     THREE.Scene
let camera:    THREE.OrthographicCamera
let material:  THREE.ShaderMaterial
let texture:   THREE.CanvasTexture
let offCanvas: HTMLCanvasElement

const VERT = `
  varying vec2 vUv;
  void main() {
    vUv         = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`

const FRAG = `
  uniform sampler2D uTex;
  uniform float     uStrength;   // barrel strength 0..~0.55
  uniform float     uScanlines;  // 1.0 = on
  uniform float     uVignette;   // 1.0 = on  (off for paper theme)
  uniform vec3      uBezel;      // bezel / outside-screen colour

  varying vec2 vUv;

  vec2 barrel(vec2 uv) {
    vec2  cc   = uv - 0.5;
    float dist = dot(cc, cc) * uStrength;
    return uv + cc * (1.0 + dist) * dist;
  }

  void main() {
    vec2 uv = barrel(vUv);

    // Outside the curved screen → theme-coloured bezel
    if (uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0 || uv.y > 1.0) {
      gl_FragColor = vec4(uBezel, 1.0);
      return;
    }

    // Three.js CanvasTexture flipY=true flips the canvas before GPU upload,
    // placing canvas row 0 (header/top) at UV y=1 and bottom at UV y=0.
    // vUv.y=1 is screen-top, so sampling at (uv.x, uv.y) gives correct orientation.
    vec4 color = texture2D(uTex, uv);

    // Scanlines
    if (uScanlines > 0.5) {
      if (mod(gl_FragCoord.y, 2.0) < 1.0) color.rgb *= 0.87;
    }

    // Vignette — CRT phosphor edge falloff (skip for light/paper theme)
    if (uVignette > 0.5) {
      vec2  vc   = uv - 0.5;
      float vign = 1.0 - dot(vc, vc) * 1.5;
      color.rgb  *= clamp(vign, 0.0, 1.0);
    }

    gl_FragColor = color;
  }
`

function initThree() {
  if (!canvasEl.value || !wrapEl.value) return

  offCanvas = document.createElement('canvas')

  renderer = new THREE.WebGLRenderer({ canvas: canvasEl.value, antialias: false })
  renderer.setPixelRatio(1)

  scene  = new THREE.Scene()
  camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)

  texture = new THREE.CanvasTexture(offCanvas)
  texture.minFilter = THREE.LinearFilter
  texture.magFilter = THREE.LinearFilter
  // flipY=true (default): canvas row 0 (top) → texture UV y=1 ✓

  material = new THREE.ShaderMaterial({
    uniforms: {
      uTex:      { value: texture },
      uStrength:  { value: 0.0 },
      uScanlines: { value: 1.0 },
      uVignette:  { value: 1.0 },
      uBezel:     { value: new THREE.Color(0x000000) },
    },
    vertexShader:   VERT,
    fragmentShader: FRAG,
  })

  scene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material))

  sizeToContainer()
}

const PAGINATION_H = 28

function sizeToContainer() {
  if (!renderer || !wrapEl.value) return
  const W = wrapEl.value.clientWidth
  const H = wrapEl.value.clientHeight - (props.pagination ? PAGINATION_H : 0)
  if (!W || !H) return

  // Update the WebGL pixel buffer AND the canvas CSS size together.
  // Passing true (default) means Three.js sets canvas.style.width/height explicitly,
  // so the browser never has a chance to CSS-stretch the old buffer during resize.
  renderer.setSize(W, H)
  offCanvas.width  = W
  offCanvas.height = H
  canvasW.value    = W
  canvasH.value    = H

  redraw()
}

// ── Redraw ────────────────────────────────────────────────────────────────────

function redraw() {
  if (!renderer || !material || !texture || !offCanvas.width) return

  const themeColors = THEME_COLORS[props.theme] ?? THEME_COLORS['none']
  const isPaper     = props.theme === 'paper'

  material.uniforms.uStrength.value  = (props.curvature / 45) * 0.55
  material.uniforms.uScanlines.value = (props.scanlines && !isPaper) ? 1.0 : 0.0
  material.uniforms.uVignette.value  = isPaper ? 0.0 : 1.0
  // Bezel colour matches the theme background so the "CRT surround" looks natural
  ;(material.uniforms.uBezel.value as THREE.Color).set(themeColors.bg)

  drawGrid(offCanvas, {
    cols:        displayCols.value,
    rows:        pagedRows.value,
    pinnedRows:  localPinned.value,
    rowHeight:   props.rowHeight,
    scrollY:     scrollY.value,
    theme:       props.theme,
    glow:        props.glow,
    sortColId:   sortState.value?.colId ?? null,
    sortDir:     sortState.value?.dir   ?? null,
    colFilters,
    hoveredRow:  hoveredRow.value,
    selectedRow: selectedCell.value?.row ?? -1,
    selectedCol: selectedCell.value?.col ?? -1,
    formatCell,
    getCellStyle,
  })

  texture.needsUpdate = true
  renderer.render(scene, camera)
}

// ── Barrel strength (shared by hit-test and shader) ───────────────────────────

function barrelStrength(): number {
  return (props.curvature / 45) * 0.55
}

// ── Canvas coordinate mapping ─────────────────────────────────────────────────

function canvasCoords(e: MouseEvent): [number, number] {
  if (!canvasEl.value) return [-1, -1]
  const rect = canvasEl.value.getBoundingClientRect()
  return screenToCanvas(
    e.clientX - rect.left,
    e.clientY - rect.top,
    canvasEl.value.width,
    canvasEl.value.height,
    barrelStrength(),
  )
}

// ── Mouse wheel ───────────────────────────────────────────────────────────────
// When pagination is active (autoPageSize fills the canvas exactly) there is no
// intra-page overflow, so wheel navigates between pages.
// When pagination is off, wheel scrolls within the continuous row list.

let wheelDebounce = 0   // timestamp of last page-flip to avoid trackpad over-firing

function onCanvasWheel(e: WheelEvent) {
  activeFilter.value = null

  if (props.pagination) {
    // Throttle page flips — trackpads fire dozens of small events per swipe
    const now = Date.now()
    if (now - wheelDebounce < 120) return
    wheelDebounce = now

    if (e.deltaY > 0 && currentPage.value < totalPages.value - 1) {
      currentPage.value++
      selectedCell.value = null
    } else if (e.deltaY < 0 && currentPage.value > 0) {
      currentPage.value--
      selectedCell.value = null
    }
    redraw()
  } else {
    // Continuous scroll — rows may overflow the canvas
    const pinnedH = localPinned.value.length * props.rowHeight
    const bodyH   = canvasH.value - HEADER_H - pinnedH
    const maxY    = Math.max(0, filteredRows.value.length * props.rowHeight - bodyH)
    scrollY.value = Math.max(0, Math.min(maxY, scrollY.value + e.deltaY))
    redraw()
  }
}

function onCanvasMouseMove(e: MouseEvent) {
  if (resizeActive) return
  const [cx, cy] = canvasCoords(e)
  if (cx < 0) { hoveredRow.value = -1; redraw(); return }

  const hit = hitTest(
    cx, cy, displayCols.value,
    pagedRows.value.length, props.rowHeight,
    scrollY.value, offCanvas.height, localPinned.value.length,
  )

  hoveredRow.value = hit.area === 'body' ? hit.rowIdx : -1

  // Cursor
  if (hit.area === 'header' && hit.colIdx >= 0) {
    const col  = displayCols.value[hit.colIdx]
    const clx  = colLeft(hit.colIdx, displayCols.value)
    canvasEl.value!.style.cursor =
      col && isOnResizeHandle(cx, clx, col.width) ? 'col-resize' : 'pointer'
  } else if (hit.area === 'body') {
    canvasEl.value!.style.cursor = 'pointer'
  } else {
    canvasEl.value!.style.cursor = 'default'
  }

  redraw()
}

function onCanvasMouseLeave() {
  hoveredRow.value = -1
  redraw()
}

function onCanvasMouseDown(e: MouseEvent) {
  const [cx, cy] = canvasCoords(e)
  if (cx < 0 || cy >= HEADER_H) return

  for (let ci = 0; ci < displayCols.value.length; ci++) {
    const col = displayCols.value[ci]
    const clx = colLeft(ci, displayCols.value)
    if (col.colDef.resizable !== false && isOnResizeHandle(cx, clx, col.width)) {
      startColResize(col.colId, e.clientX)
      return
    }
  }
}

function onCanvasClick(e: MouseEvent) {
  if (wasDragging) { wasDragging = false; return }
  if (resizeActive) return

  const [cx, cy] = canvasCoords(e)
  if (cx < 0) { activeFilter.value = null; return }

  const hit = hitTest(
    cx, cy, displayCols.value,
    pagedRows.value.length, props.rowHeight,
    scrollY.value, offCanvas.height, localPinned.value.length,
  )

  // ── Header click — sort or filter ──────────────────────────────────────────
  if (hit.area === 'header' && hit.colIdx >= 0) {
    const col = displayCols.value[hit.colIdx]
    const clx = colLeft(hit.colIdx, displayCols.value)

    if (col.colDef.filter && isOnFilterIcon(cx, clx, col.width)) {
      // Toggle filter popup
      if (activeFilter.value === col.colId) {
        activeFilter.value = null
      } else {
        activeFilter.value     = col.colId
        filterPopupValue.value = colFilters[col.colId]?.startsWith('__eq__')
          ? colFilters[col.colId].slice(6)
          : (colFilters[col.colId] ?? '')
        filterPopupPos.value   = { x: Math.max(0, clx), y: HEADER_H }
      }
    } else if (col.colDef.sortable !== false) {
      activeFilter.value = null
      sortState.value = sortState.value?.colId === col.colId
        ? sortState.value.dir === 'asc' ? { colId: col.colId, dir: 'desc' } : null
        : { colId: col.colId, dir: 'asc' }
      emit('sort-changed')
    }
    return
  }

  activeFilter.value = null

  // ── Body click — select cell ───────────────────────────────────────────────
  if (hit.area === 'body' && hit.rowIdx >= 0 && hit.colIdx >= 0) {
    selectedCell.value = { row: hit.rowIdx, col: hit.colIdx }
    canvasEl.value?.focus()

    const row = pagedRows.value[hit.rowIdx]
    const col = displayCols.value[hit.colIdx]
    if (row && col) {
      emit('row-clicked',   { data: row, event: e })
      emit('cell-selected', { data: row, row: hit.rowIdx, col: hit.colIdx, colId: col.colId })
    }
  }
}

function onDocClick(e: MouseEvent) {
  if (!activeFilter.value) return
  if (!(e.target as HTMLElement).closest?.('.cathode-filter-popup'))
    activeFilter.value = null
}

// ── Keyboard navigation ───────────────────────────────────────────────────────

function onKeyDown(e: KeyboardEvent) {
  const cols    = displayCols.value
  const rows    = pagedRows.value
  const maxCol  = cols.length - 1
  const maxRow  = rows.length - 1

  // If nothing selected, start at (0,0) on any nav key
  if (!selectedCell.value) {
    if (['ArrowDown','ArrowUp','ArrowLeft','ArrowRight','Tab','Enter'].includes(e.key)) {
      e.preventDefault()
      selectedCell.value = { row: 0, col: 0 }
    }
    return
  }

  let { row, col } = selectedCell.value

  const goTo = (r: number, c: number) => {
    row = Math.max(0, Math.min(maxRow, r))
    col = Math.max(0, Math.min(maxCol, c))
    selectedCell.value = { row, col }
  }

  const prevPage = () => {
    if (currentPage.value > 0) { currentPage.value--; goTo(autoPageSize.value - 1, col) }
  }
  const nextPage = () => {
    if (currentPage.value < totalPages.value - 1) { currentPage.value++; goTo(0, col) }
  }

  switch (e.key) {
    case 'ArrowDown':
      e.preventDefault()
      row < maxRow ? goTo(row + 1, col) : nextPage()
      break

    case 'ArrowUp':
      e.preventDefault()
      row > 0 ? goTo(row - 1, col) : prevPage()
      break

    case 'ArrowRight':
      e.preventDefault()
      if (col < maxCol) goTo(row, col + 1)
      else if (row < maxRow) goTo(row + 1, 0)
      else nextPage()
      break

    case 'ArrowLeft':
      e.preventDefault()
      if (col > 0) goTo(row, col - 1)
      else if (row > 0) goTo(row - 1, maxCol)
      else prevPage()
      break

    case 'Tab':
      e.preventDefault()
      if (!e.shiftKey) {
        if (col < maxCol) goTo(row, col + 1)
        else if (row < maxRow) goTo(row + 1, 0)
        else nextPage()
      } else {
        if (col > 0) goTo(row, col - 1)
        else if (row > 0) goTo(row - 1, maxCol)
        else prevPage()
      }
      break

    case 'Enter':
      e.preventDefault()
      e.shiftKey ? (row > 0 ? goTo(row - 1, col) : prevPage())
                 : (row < maxRow ? goTo(row + 1, col) : nextPage())
      break

    case 'Home':
      e.preventDefault()
      if (e.ctrlKey || e.metaKey) { currentPage.value = 0; goTo(0, 0) }
      else goTo(row, 0)
      break

    case 'End':
      e.preventDefault()
      if (e.ctrlKey || e.metaKey) {
        currentPage.value = totalPages.value - 1
        nextTick(() => goTo(pagedRows.value.length - 1, maxCol))
      } else {
        goTo(row, maxCol)
      }
      break

    case 'PageDown':
      e.preventDefault()
      nextPage()
      break

    case 'PageUp':
      e.preventDefault()
      prevPage()
      break

    case 'Escape':
      selectedCell.value = null
      break

    case 'c':
    case 'C':
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault()
        const selRow = rows[row]
        const selCol = cols[col]
        if (selRow && selCol) {
          const text = formatCell(selCol, selRow)
          navigator.clipboard?.writeText(text).catch(() => {})
        }
      }
      break
  }
}

// ── Filter popup ──────────────────────────────────────────────────────────────

function onFilterInput(e: Event) {
  const val = (e.target as HTMLInputElement).value
  filterPopupValue.value = val
  if (val) colFilters[activeFilter.value!] = val
  else     delete colFilters[activeFilter.value!]
  currentPage.value = 0
  emit('filter-changed')
}

function clearFilter() {
  if (activeFilter.value) delete colFilters[activeFilter.value]
  filterPopupValue.value = ''
  activeFilter.value     = null
  currentPage.value      = 0
  emit('filter-changed')
}

// ── Grid API ──────────────────────────────────────────────────────────────────

const gridApi: GridApi = {
  setGridOption(key: string, value: any) {
    if      (key === 'rowData')             localRowData.value = value
    else if (key === 'pinnedBottomRowData') localPinned.value  = value
    else if (key === 'quickFilterText')     quickFilter.value  = value
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
      model[colId] = raw.startsWith('__eq__')
        ? { type: 'equals',   filter: raw.slice(6) }
        : { type: 'contains', filter: raw }
    }
    return model
  },

  async setColumnFilterModel(colId: string, model: any) {
    if (!model)                       delete colFilters[colId]
    else if (model.type === 'equals') colFilters[colId] = `__eq__${model.filter}`
    else                              colFilters[colId] = model.filter ?? ''
  },

  onFilterChanged() { /* reactive */ },
  refreshCells()    { refreshKey.value++ },

  exportDataAsCsv({ fileName = 'export.csv' } = {}) {
    const cols   = resolvedCols.value
    const header = cols.map(c => c.colDef.headerName ?? c.colId).join(',')
    const lines  = filteredRows.value.map(row =>
      cols.map(col => `"${String(formatCell(col, row)).replace(/"/g, '""')}"`).join(',')
    )
    const blob = new Blob([[header, ...lines].join('\n')], { type: 'text/csv' })
    const url  = URL.createObjectURL(blob)
    Object.assign(document.createElement('a'), { href: url, download: fileName }).click()
    URL.revokeObjectURL(url)
  },

  resetColumnState() {
    hiddenCols.clear()
    for (const def of props.columnDefs) {
      if (def.hide) hiddenCols.add(colIdOf(def))
    }
    const init = props.columnDefs.find(d => d.sort)
    sortState.value    = init ? { colId: colIdOf(init), dir: init.sort! } : null
    for (const k of Object.keys(colWidths))  delete colWidths[k]
    for (const k of Object.keys(colFilters)) delete colFilters[k]
    quickFilter.value  = ''
    scrollY.value      = 0
    currentPage.value  = 0
    selectedCell.value = null
    activeFilter.value = null
  },
}

// ── Watchers → redraw ─────────────────────────────────────────────────────────
// Separate watchers per concern — a single combined array watcher can miss
// changes to primitive prop getters when the computed refs haven't changed.

// Data changes
watch([pagedRows, () => localPinned.value, displayCols, scrollY, hoveredRow, selectedCell],
  () => nextTick(redraw))

// Visual prop changes — each gets its own watcher so Vue definitely fires
watch(() => props.theme,     () => redraw())
watch(() => props.curvature, () => redraw())
watch(() => props.scanlines, () => redraw())
watch(() => props.glow,      () => redraw())

// Emit cell-selected when selection changes via keyboard
watch(selectedCell, (sc) => {
  if (!sc) return
  const row = pagedRows.value[sc.row]
  const col = displayCols.value[sc.col]
  if (row && col) emit('cell-selected', { data: row, row: sc.row, col: sc.col, colId: col.colId })
})

// ── ResizeObserver ────────────────────────────────────────────────────────────

let resizeObserver: ResizeObserver | null = null
let resizeRaf      = 0   // requestAnimationFrame handle for resize batching

// ── Lifecycle ─────────────────────────────────────────────────────────────────

onMounted(() => {
  for (const def of props.columnDefs) {
    if (def.hide) hiddenCols.add(colIdOf(def))
    if (def.sort && !sortState.value)
      sortState.value = { colId: colIdOf(def), dir: def.sort }
  }
  localRowData.value = props.rowData ?? []
  localPinned.value  = props.pinnedBottomRowData ?? []

  document.addEventListener('click',     onDocClick,       true)
  document.addEventListener('mousemove', onGlobalMouseMove)
  document.addEventListener('mouseup',   onGlobalMouseUp)

  nextTick(() => {
    initThree()
    if (wrapEl.value) {
      resizeObserver = new ResizeObserver(() => {
        cancelAnimationFrame(resizeRaf)
        resizeRaf = requestAnimationFrame(sizeToContainer)
      })
      resizeObserver.observe(wrapEl.value)
    }
    emit('grid-ready', { api: gridApi })
  })
})

onUnmounted(() => {
  document.removeEventListener('click',     onDocClick,       true)
  document.removeEventListener('mousemove', onGlobalMouseMove)
  document.removeEventListener('mouseup',   onGlobalMouseUp)
  resizeObserver?.disconnect()
  cancelAnimationFrame(resizeRaf)
  renderer?.dispose()
})

// ── Computed styles ───────────────────────────────────────────────────────────

const themeC = computed(() => THEME_COLORS[props.theme] ?? THEME_COLORS['none'])

const filterPopupStyle = computed<CSSProperties>(() => ({
  position:   'absolute',
  left:       `${filterPopupPos.value.x}px`,
  top:        `${filterPopupPos.value.y}px`,
  zIndex:     100,
  background: themeC.value.headerBg,
  border:     `1px solid ${themeC.value.accent}`,
  color:      themeC.value.text,
  boxShadow:  '0 4px 14px rgba(0,0,0,0.55)',
  borderRadius: '3px',
  display:    'flex',
  alignItems: 'center',
  gap:        '4px',
  padding:    '5px',
  minWidth:   '160px',
}))

const filterInputStyle = computed<CSSProperties>(() => ({
  background:  themeC.value.bg,
  border:      `1px solid ${themeC.value.border}`,
  color:       themeC.value.text,
  fontFamily:  "'Courier New', Courier, monospace",
  fontSize:    '11px',
  padding:     '3px 7px',
  borderRadius: '2px',
  outline:     'none',
  flex:        '1',
}))

const paginStyle = computed<CSSProperties>(() => ({
  background: themeC.value.headerBg,
  borderTop:  `1px solid ${themeC.value.border}`,
  color:      themeC.value.text,
}))

const wrapStyle = computed<CSSProperties>(() => ({
  background: themeC.value.bg,
}))

const accentColor = computed(() => themeC.value.accent)
</script>

<template>
  <div ref="wrapEl" class="cathode-wrap" :style="wrapStyle">

    <!-- WebGL canvas — receives focus for keyboard nav -->
    <canvas
      ref="canvasEl"
      class="cathode-canvas"
      tabindex="0"
      @wheel.prevent="onCanvasWheel"
      @mousemove="onCanvasMouseMove"
      @mouseleave="onCanvasMouseLeave"
      @mousedown="onCanvasMouseDown"
      @click="onCanvasClick"
      @keydown="onKeyDown"
    />

    <!-- Filter popup DOM overlay — fully theme-coloured -->
    <div
      v-if="activeFilter"
      :style="filterPopupStyle"
      @click.stop
    >
      <input
        :style="filterInputStyle"
        :value="filterPopupValue"
        placeholder="Filter…"
        autofocus
        @input="onFilterInput"
        @keydown.escape="clearFilter"
      />
      <button
        v-if="filterPopupValue"
        :style="{ background: 'none', border: 'none', color: themeC.text,
                  opacity: '0.55', cursor: 'pointer', fontSize: '11px', padding: '0 4px' }"
        @click="clearFilter"
      >✕</button>
    </div>

    <!-- Pagination bar -->
    <div v-if="pagination" class="cathode-pagination" :style="paginStyle">
      <button :disabled="currentPage === 0"
              @click="currentPage--; selectedCell = null; redraw()">◀</button>

      <span>{{ currentPage + 1 }} / {{ totalPages }}</span>

      <button :disabled="currentPage >= totalPages - 1"
              @click="currentPage++; selectedCell = null; redraw()">▶</button>

      <span class="cathode-page-info" :style="{ color: accentColor }">
        {{ filteredRows.length.toLocaleString() }} rows
        · {{ autoPageSize }} per page
      </span>

      <!-- Selection readout -->
      <span v-if="selectedCell" class="cathode-sel-readout" :style="{ color: accentColor }">
        {{ displayCols[selectedCell.col]?.colDef.headerName ?? displayCols[selectedCell.col]?.colId }}
        :
        {{ formatCell(displayCols[selectedCell.col], pagedRows[selectedCell.row]) }}
      </span>
    </div>

  </div>
</template>

<style scoped>
.cathode-wrap {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: #000;
}

.cathode-canvas {
  flex: 1;
  width: 100%;
  min-height: 0;
  display: block;
  outline: none;
}

/* Filter popup — all colours applied inline from themeC computed */

/* Pagination */
.cathode-pagination {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 3px 12px;
  font-size: 11px;
  font-family: 'Courier New', Courier, monospace;
  flex-shrink: 0;
}
.cathode-pagination button {
  background: none;
  border: 1px solid rgba(255,255,255,0.15);
  color: inherit;
  cursor: pointer;
  padding: 1px 8px;
  border-radius: 2px;
  font-family: inherit;
  font-size: 11px;
}
.cathode-pagination button:disabled { opacity: 0.3; cursor: default; }
.cathode-pagination button:not(:disabled):hover { border-color: #40a0f0; }

.cathode-page-info   { margin-left: auto; font-size: 10px; opacity: 0.75; }
.cathode-sel-readout {
  font-size: 10px;
  font-family: 'Courier New', Courier, monospace;
  opacity: 0.85;
  max-width: 260px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  padding: 1px 6px;
  border: 1px solid currentColor;
  border-radius: 2px;
  opacity: 0.7;
}
</style>
