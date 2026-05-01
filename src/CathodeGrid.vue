<script setup lang="ts">
import {
  ref, reactive, computed, watch, inject, onMounted, onUnmounted, nextTick,
} from 'vue'
import type { CSSProperties, Ref } from 'vue'
import * as THREE from 'three'
import type { ColDef, ColState, GridApi, ResolvedCol } from './types'
import {
  drawGrid, hitTest,
  isOnFilterIcon, isOnResizeHandle, colLeft,
  HEADER_H, THEME_COLORS,
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
const refreshKey    = ref(0)

// ── Canvas dimensions (set by sizeToContainer) ────────────────────────────────

const canvasW = ref(0)
const canvasH = ref(0)

// ── Interaction state ─────────────────────────────────────────────────────────

const scrollY       = ref(0)   // vertical offset (px)
const scrollX       = ref(0)   // horizontal offset (px)
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
 * Only scales UP when columns are narrower than the canvas.
 * When columns exceed canvas width, natural widths are used and horizontal
 * scroll handles navigation.
 */
const displayCols = computed<ResolvedCol[]>(() => {
  const W = canvasW.value
  if (!W) return resolvedCols.value

  const totalHint = resolvedCols.value.reduce((s, c) => s + c.width, 0)
  if (!totalHint) return resolvedCols.value

  if (totalHint >= W) return resolvedCols.value

  const scale = W / totalHint
  let used = 0
  return resolvedCols.value.map((c, i) => {
    const isLast = i === resolvedCols.value.length - 1
    const w = isLast ? W - used : Math.max(8, Math.round(c.width * scale))
    used += w
    return { ...c, width: w }
  })
})

const maxScrollX = computed(() => {
  const totalW = displayCols.value.reduce((s, c) => s + c.width, 0)
  return Math.max(0, totalW - canvasW.value)
})

// ── Viewport geometry ─────────────────────────────────────────────────────────

const bodyH = computed(() => {
  const pinnedH = localPinned.value.length * props.rowHeight
  return Math.max(0, canvasH.value - HEADER_H - pinnedH)
})

const maxScrollY = computed(() =>
  Math.max(0, filteredRows.value.length * props.rowHeight - bodyH.value)
)

const visibleRowCount = computed(() =>
  Math.max(1, Math.floor(bodyH.value / props.rowHeight))
)

const firstVisibleRow = computed(() =>
  filteredRows.value.length === 0
    ? 0
    : Math.min(filteredRows.value.length - 1, Math.floor(scrollY.value / props.rowHeight))
)

const lastVisibleRow = computed(() =>
  Math.min(filteredRows.value.length - 1, firstVisibleRow.value + visibleRowCount.value - 1)
)

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

watch(filteredRows, () => { scrollY.value = 0; selectedCell.value = null })
watch(maxScrollX,  () => { scrollX.value = Math.min(scrollX.value, maxScrollX.value) })
watch(maxScrollY,  () => { scrollY.value = Math.min(scrollY.value, maxScrollY.value) })

// Scroll the absolute row index into the visible viewport.
function ensureRowVisible(absRow: number) {
  const rowTop    = absRow * props.rowHeight
  const rowBottom = rowTop + props.rowHeight
  if (rowTop < scrollY.value) {
    scrollY.value = rowTop
  } else if (rowBottom > scrollY.value + bodyH.value) {
    scrollY.value = Math.min(maxScrollY.value, rowBottom - bodyH.value)
  }
}

function pageUp() {
  scrollY.value = Math.max(0, scrollY.value - bodyH.value)
  redraw()
}

function pageDown() {
  scrollY.value = Math.min(maxScrollY.value, scrollY.value + bodyH.value)
  redraw()
}

// ── Column resize ─────────────────────────────────────────────────────────────
// Resize adjusts the PROPORTIONAL width of a column while keeping all columns
// filling the container.  We convert from display-pixel drag delta to hint-space
// so that displayCols re-scales correctly.

let resizeActive      = false
let resizeColId       = ''
let resizeStartX      = 0
let resizeStartDispW  = 0   // display width at resize start
let wasDragging       = false

// Pan-to-scroll (click+drag in body)
let panActive       = false
let panStartX       = 0
let panStartY       = 0
let panStartScrollX = 0
let panStartScrollY = 0
let panMoved        = false

function startColResize(colId: string, startClientX: number) {
  resizeActive     = true
  resizeColId      = colId
  resizeStartX     = startClientX
  resizeStartDispW = displayCols.value.find(c => c.colId === colId)?.width ?? 100
  wasDragging      = false
}

function onGlobalMouseMove(e: MouseEvent) {
  if (panActive) {
    const dx = panStartX - e.clientX
    const dy = panStartY - e.clientY
    if (Math.abs(dx) > 4 || Math.abs(dy) > 4) panMoved = true

    scrollX.value = Math.max(0, Math.min(maxScrollX.value, panStartScrollX + dx))
    scrollY.value = Math.max(0, Math.min(maxScrollY.value, panStartScrollY + dy))
    redraw()
    return
  }

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
  if (panActive) {
    if (panMoved) wasDragging = true
    panActive = false
  }
  if (resizeActive) {
    resizeActive = false
    wasDragging  = true
    emit('column-resized')
  }
}

// ── DOM refs ──────────────────────────────────────────────────────────────────

const wrapEl   = ref<HTMLDivElement | null>(null)
const canvasEl = ref<HTMLCanvasElement | null>(null)

// Injected by CathodeWorkspace — increments whenever reset() is called
const resetTick = inject<Ref<number>>('cathodeResetTick', ref(0))
watch(resetTick, () => scheduleResize())

// ── Three.js ───────────────────────────────────────────────────────────────────

let renderer:    THREE.WebGLRenderer | null = null
let webglFailed  = false   // true when GPU/sandbox prevents WebGL
let scene:       THREE.Scene
let camera:      THREE.OrthographicCamera
let material:    THREE.ShaderMaterial
let texture:     THREE.CanvasTexture
let offCanvas:   HTMLCanvasElement

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
    vec2  d    = cc * (1.0 + dist) * dist;
    return uv + d;
  }

  void main() {
    vec2 uv = barrel(vUv);

    if (uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0 || uv.y > 1.0) {
      gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);
      return;
    }

    vec4 color = texture2D(uTex, uv);

    if (uScanlines > 0.5) {
      if (mod(gl_FragCoord.y, 2.0) < 1.0) color.rgb *= 0.87;
    }

    if (uVignette > 0.5) {
      vec2  vc   = uv - 0.5;
      float vign = 1.0 - dot(vc, vc) * 0.6;   // softened falloff — see CathodeLog for rationale
      color.rgb  *= clamp(vign, 0.0, 1.0);
    }

    gl_FragColor = color;
  }
`

function initThree() {
  if (!canvasEl.value || !wrapEl.value) return

  offCanvas = document.createElement('canvas')

  try {
    renderer = new THREE.WebGLRenderer({ canvas: canvasEl.value, antialias: false, alpha: true })
  } catch {
    webglFailed = true
  }
  if (!webglFailed && !renderer!.getContext()) {
    renderer!.dispose()
    renderer = null
    webglFailed = true
  }
  if (webglFailed) {
    // No WebGL — fall back to direct 2D blit; still set up offCanvas dimensions
    sizeToContainer()
    return
  }
  renderer!.setPixelRatio(1)
  renderer!.setClearColor(0x000000, 0)

  scene  = new THREE.Scene()
  camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)

  texture = new THREE.CanvasTexture(offCanvas)
  texture.minFilter = THREE.LinearFilter
  texture.magFilter = THREE.LinearFilter
  // flipY=true (default): canvas row 0 (top) → texture UV y=1 ✓

  material = new THREE.ShaderMaterial({
    uniforms: {
      uTex:       { value: texture },
      uStrength:  { value: 0.0 },
      uScanlines: { value: 1.0 },
      uVignette:  { value: 1.0 },
      uBezel:     { value: new THREE.Color(0x000000) },
    },
    vertexShader:   VERT,
    fragmentShader: FRAG,
    transparent:    true,
  })

  scene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material))

  sizeToContainer()
}

const PAGINATION_H = 28

function sizeToContainer() {
  if (!wrapEl.value) return
  if (!renderer && !webglFailed) return
  const W = wrapEl.value.clientWidth
  const H = wrapEl.value.clientHeight - (props.pagination ? PAGINATION_H : 0)
  if (!W || !H) return

  // If offCanvas dimensions change, the CanvasTexture's GPU storage is stale —
  // Three.js will try to texSubImage2D into the old (smaller) allocation and
  // the driver throws GL_INVALID_VALUE: 'Offset overflows texture dimensions',
  // producing garbled pixel output. Dispose the texture so Three.js
  // reallocates GPU storage on the next render.
  const sizeChanged = offCanvas.width !== W || offCanvas.height !== H
  offCanvas.width  = W
  offCanvas.height = H
  canvasW.value    = W
  canvasH.value    = H
  scrollX.value    = Math.max(0, Math.min(maxScrollX.value, scrollX.value))
  scrollY.value    = Math.max(0, Math.min(maxScrollY.value, scrollY.value))

  if (renderer) {
    if (sizeChanged && texture) {
      texture.dispose()
      // Re-create so Three.js allocates fresh GPU storage at the new size
      texture = new THREE.CanvasTexture(offCanvas)
      texture.minFilter = THREE.LinearFilter
      texture.magFilter = THREE.LinearFilter
      if (material) material.uniforms.uTex.value = texture
    }
    // Track DPR so zooming the browser page keeps the canvas crisp.
    renderer.setPixelRatio(window.devicePixelRatio || 1)
    // Update the WebGL pixel buffer AND the canvas CSS size together.
    renderer.setSize(W, H)
  } else if (canvasEl.value) {
    // WebGL fallback: size the canvas element directly
    canvasEl.value.width  = W
    canvasEl.value.height = H
    canvasEl.value.style.width  = W + 'px'
    canvasEl.value.style.height = H + 'px'
  }

  redraw()
}

// ── Redraw ────────────────────────────────────────────────────────────────────

function redraw() {
  if (!offCanvas?.width) return

  // WebGL fallback: draw offCanvas directly to the visible canvas via 2D blit
  if (webglFailed) {
    if (!canvasEl.value) return
    drawGrid(offCanvas, {
      cols:        displayCols.value,
      rows:        filteredRows.value,
      pinnedRows:  localPinned.value,
      rowHeight:   props.rowHeight,
      scrollY:     scrollY.value,
      scrollX:     scrollX.value,
      theme:       props.theme,
      glow:        false,
      sortColId:   sortState.value?.colId ?? null,
      sortDir:     sortState.value?.dir   ?? null,
      colFilters,
      hoveredRow:  hoveredRow.value,
      selectedRow: selectedCell.value?.row ?? -1,
      selectedCol: selectedCell.value?.col ?? -1,
      formatCell,
      getCellStyle,
    })
    const ctx2d = canvasEl.value.getContext('2d')
    if (ctx2d) ctx2d.drawImage(offCanvas, 0, 0)
    return
  }

  if (!renderer || !material || !texture) return

  const themeColors = THEME_COLORS[props.theme] ?? THEME_COLORS['none']
  const isPaper     = props.theme === 'paper'

  material.uniforms.uStrength.value  = (props.curvature / 45) * 0.55
  material.uniforms.uScanlines.value = (props.scanlines && !isPaper) ? 1.0 : 0.0
  material.uniforms.uVignette.value  = isPaper ? 0.0 : 1.0
  ;(material.uniforms.uBezel.value as THREE.Color).set(themeColors.bg)

  drawGrid(offCanvas, {
    cols:        displayCols.value,
    rows:        filteredRows.value,
    pinnedRows:  localPinned.value,
    rowHeight:   props.rowHeight,
    scrollY:     scrollY.value,
    scrollX:     scrollX.value,
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

// ── Canvas coordinate mapping ─────────────────────────────────────────────────

function canvasCoords(e: MouseEvent): [number, number] {
  if (!canvasEl.value) return [-1, -1]
  const rect = canvasEl.value.getBoundingClientRect()
  // No UV remapping in shader — screen pixel maps 1:1 to canvas pixel
  return [e.clientX - rect.left, e.clientY - rect.top]
}

// ── Mouse wheel ───────────────────────────────────────────────────────────────

let lastHScrollTime = 0   // timestamp of last horizontal scroll event
const H_SCROLL_LOCK_MS = 600   // suppress vertical scroll for this long after horizontal gesture

function onCanvasWheel(e: WheelEvent) {
  activeFilter.value = null
  const now = Date.now()

  // Horizontal scroll — any deltaX means the gesture is horizontal.
  // Lock out vertical scroll for H_SCROLL_LOCK_MS to suppress stray deltaX=0
  // events that trackpads emit at gesture start/end.
  if (e.deltaX !== 0) {
    lastHScrollTime = now
    scrollX.value = Math.max(0, Math.min(maxScrollX.value, scrollX.value + e.deltaX))
    redraw()
    return
  }
  if (e.shiftKey && e.deltaY !== 0) {
    lastHScrollTime = now
    scrollX.value = Math.max(0, Math.min(maxScrollX.value, scrollX.value + e.deltaY))
    redraw()
    return
  }

  // Still within the horizontal scroll lock window — drop this event entirely
  if (now - lastHScrollTime < H_SCROLL_LOCK_MS) return

  // Vertical — always smooth pixel scroll regardless of pagination prop
  scrollY.value = Math.max(0, Math.min(maxScrollY.value, scrollY.value + e.deltaY))
  redraw()
}

function onCanvasMouseMove(e: MouseEvent) {
  if (resizeActive) return
  const [cx, cy] = canvasCoords(e)
  if (cx < 0) { hoveredRow.value = -1; redraw(); return }

  const hit = hitTest(
    cx, cy, displayCols.value,
    filteredRows.value.length, props.rowHeight,
    scrollY.value, offCanvas.height, localPinned.value.length, scrollX.value,
  )

  hoveredRow.value = hit.area === 'body' ? hit.rowIdx : -1

  // Cursor
  if (hit.area === 'header' && hit.colIdx >= 0) {
    const col     = displayCols.value[hit.colIdx]
    const clx     = colLeft(hit.colIdx, displayCols.value)
    const contentCx = cx + scrollX.value
    canvasEl.value!.style.cursor =
      col && isOnResizeHandle(contentCx, clx, col.width) ? 'col-resize' : 'pointer'
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
  if (cx < 0) return

  if (cy >= HEADER_H) {
    // Body click — start pan. Allow event to bubble so CathodeContainer can
    // call bringToFront; drag only starts from the title bar so there's no conflict.
    panActive       = true
    panMoved        = false
    panStartX       = e.clientX
    panStartY       = e.clientY
    panStartScrollX = scrollX.value
    panStartScrollY = scrollY.value
    return
  }

  const contentCx = cx + scrollX.value
  for (let ci = 0; ci < displayCols.value.length; ci++) {
    const col = displayCols.value[ci]
    const clx = colLeft(ci, displayCols.value)
    if (col.colDef.resizable !== false && isOnResizeHandle(contentCx, clx, col.width)) {
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
    filteredRows.value.length, props.rowHeight,
    scrollY.value, offCanvas.height, localPinned.value.length, scrollX.value,
  )

  // ── Header click — sort or filter ──────────────────────────────────────────
  if (hit.area === 'header' && hit.colIdx >= 0) {
    const col       = displayCols.value[hit.colIdx]
    const clx       = colLeft(hit.colIdx, displayCols.value)
    const contentCx = cx + scrollX.value

    if (col.colDef.filter && isOnFilterIcon(contentCx, clx, col.width)) {
      e.stopPropagation()
      if (activeFilter.value === col.colId) {
        activeFilter.value = null
      } else {
        activeFilter.value     = col.colId
        filterPopupValue.value = colFilters[col.colId]?.startsWith('__eq__')
          ? colFilters[col.colId].slice(6)
          : (colFilters[col.colId] ?? '')
        // Position popup at screen x (content x minus current scroll)
        filterPopupPos.value   = { x: Math.max(0, clx - scrollX.value), y: HEADER_H }
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
    const absRow = hit.rowIdx
    selectedCell.value = { row: absRow, col: hit.colIdx }
    canvasEl.value?.focus()

    const row = filteredRows.value[absRow]
    const col = displayCols.value[hit.colIdx]
    if (row && col) {
      emit('row-clicked',   { data: row, event: e })
      emit('cell-selected', { data: row, row: absRow, col: hit.colIdx, colId: col.colId })
    }
  }
}

function onDocClick(e: MouseEvent) {
  if (!activeFilter.value) return
  if (!(e.target as HTMLElement).closest?.('.cathode-filter-popup'))
    activeFilter.value = null
}

// ── Scroll selected column into view ─────────────────────────────────────────
function ensureColVisible(colIdx: number) {
  if (!canvasW.value) return
  let colX = 0
  for (let i = 0; i < colIdx; i++) colX += displayCols.value[i].width
  const colW      = displayCols.value[colIdx]?.width ?? 0
  const canvasX   = colX - scrollX.value
  if (canvasX < 0) {
    scrollX.value = Math.max(0, colX)
  } else if (canvasX + colW > canvasW.value) {
    scrollX.value = Math.min(maxScrollX.value, colX + colW - canvasW.value)
  }
}

// ── Keyboard navigation ───────────────────────────────────────────────────────

function onKeyDown(e: KeyboardEvent) {
  const cols   = displayCols.value
  const maxCol = cols.length - 1
  const maxRow = filteredRows.value.length - 1   // absolute

  if (!selectedCell.value) {
    if (['ArrowDown','ArrowUp','ArrowLeft','ArrowRight','Tab','Enter'].includes(e.key)) {
      e.preventDefault()
      selectedCell.value = { row: firstVisibleRow.value, col: 0 }
    }
    return
  }

  let { row, col } = selectedCell.value   // row is absolute

  const goTo = (r: number, c: number) => {
    row = Math.max(0, Math.min(maxRow, r))
    col = Math.max(0, Math.min(maxCol, c))
    selectedCell.value = { row, col }
    ensureRowVisible(row)
    ensureColVisible(col)
  }

  switch (e.key) {
    case 'ArrowDown':  e.preventDefault(); goTo(row + 1, col); break
    case 'ArrowUp':    e.preventDefault(); goTo(row - 1, col); break

    case 'ArrowRight':
      e.preventDefault()
      col < maxCol ? goTo(row, col + 1) : goTo(row + 1, 0)
      break

    case 'ArrowLeft':
      e.preventDefault()
      col > 0 ? goTo(row, col - 1) : goTo(row - 1, maxCol)
      break

    case 'Tab':
      e.preventDefault()
      if (!e.shiftKey) { col < maxCol ? goTo(row, col + 1) : goTo(row + 1, 0) }
      else             { col > 0      ? goTo(row, col - 1) : goTo(row - 1, maxCol) }
      break

    case 'Enter':
      e.preventDefault()
      e.shiftKey ? goTo(row - 1, col) : goTo(row + 1, col)
      break

    case 'Home':
      e.preventDefault()
      e.ctrlKey || e.metaKey ? goTo(0, 0) : goTo(row, 0)
      break

    case 'End':
      e.preventDefault()
      e.ctrlKey || e.metaKey ? goTo(maxRow, maxCol) : goTo(row, maxCol)
      break

    case 'PageDown':
      e.preventDefault()
      goTo(Math.min(maxRow, row + visibleRowCount.value), col)
      break

    case 'PageUp':
      e.preventDefault()
      goTo(Math.max(0, row - visibleRowCount.value), col)
      break

    case 'Escape':
      selectedCell.value = null
      break

    case 'c':
    case 'C':
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault()
        const selRow = filteredRows.value[row]
        const selCol = cols[col]
        if (selRow && selCol) navigator.clipboard?.writeText(formatCell(selCol, selRow)).catch(() => {})
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
  emit('filter-changed')
}

function clearFilter() {
  if (activeFilter.value) delete colFilters[activeFilter.value]
  filterPopupValue.value = ''
  activeFilter.value     = null
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

  resize() { sizeToContainer() },

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
    selectedCell.value = null
    activeFilter.value = null
  },
}

// ── Watchers → redraw ─────────────────────────────────────────────────────────
// Separate watchers per concern — a single combined array watcher can miss
// changes to primitive prop getters when the computed refs haven't changed.

// Data changes
watch([filteredRows, () => localPinned.value, displayCols, scrollY, hoveredRow, selectedCell],
  () => nextTick(redraw))

// Visual prop changes — each gets its own watcher so Vue definitely fires
watch(() => props.theme,     () => redraw())
// Curvature changes the container padding (via --curvature CSS var), which shrinks
// the canvas area. sizeToContainer must run after Vue patches the DOM so clientWidth
// reflects the new padding before we redraw.
watch(() => props.curvature, () => nextTick(sizeToContainer))
watch(() => props.scanlines, () => redraw())
watch(() => props.glow,      () => redraw())

// Emit cell-selected when selection changes via keyboard
watch(selectedCell, (sc) => {
  if (!sc) return
  const row = filteredRows.value[sc.row]   // sc.row is absolute
  const col = displayCols.value[sc.col]
  if (row && col) emit('cell-selected', { data: row, row: sc.row, col: sc.col, colId: col.colId })
})

// ── ResizeObserver + IntersectionObserver + window/zoom listeners ─────────────

let resizeObserver:       ResizeObserver | null = null
let intersectionObserver: IntersectionObserver | null = null
let resizeRaf = 0   // requestAnimationFrame handle for resize batching

function scheduleResize() {
  cancelAnimationFrame(resizeRaf)
  resizeRaf = requestAnimationFrame(sizeToContainer)
}

// ── WebGL context loss recovery ───────────────────────────────────────────────

function onContextLost(e: Event) {
  e.preventDefault()   // required to allow context restoration
}

function onContextRestored() {
  // Dispose the dead renderer and rebuild from scratch on the same canvas
  renderer?.dispose()
  renderer   = null
  webglFailed = false
  initThree()
}

// ── Lifecycle ─────────────────────────────────────────────────────────────────

onMounted(() => {
  for (const def of props.columnDefs) {
    if (def.hide) hiddenCols.add(colIdOf(def))
    if (def.sort && !sortState.value)
      sortState.value = { colId: colIdOf(def), dir: def.sort }
  }
  localRowData.value = props.rowData ?? []
  localPinned.value  = props.pinnedBottomRowData ?? []

  document.addEventListener('click',     onDocClick)
  document.addEventListener('mousemove', onGlobalMouseMove)
  document.addEventListener('mouseup',   onGlobalMouseUp)

  nextTick(() => {
    initThree()
    if (canvasEl.value) {
      canvasEl.value.addEventListener('webglcontextlost',     onContextLost)
      canvasEl.value.addEventListener('webglcontextrestored', onContextRestored)
    }
    if (wrapEl.value) {
      // Call sizeToContainer synchronously — rAF batching adds a full frame of lag
      // during drag resize, causing the old bitmap to visibly stretch before correction.
      resizeObserver = new ResizeObserver(() => sizeToContainer())
      resizeObserver.observe(wrapEl.value)

      // IntersectionObserver fires when the element becomes visible after an
      // ancestor v-show / display:none toggle — ResizeObserver alone misses this.
      intersectionObserver = new IntersectionObserver((entries) => {
        if (entries.some(e => e.isIntersecting)) scheduleResize()
      })
      intersectionObserver.observe(wrapEl.value)
    }
    // Window resize (e.g. dragging the browser window edge)
    window.addEventListener('resize', scheduleResize)
    // visualViewport fires on both window resize and browser zoom (ctrl+/-)
    window.visualViewport?.addEventListener('resize', scheduleResize)
    emit('grid-ready', { api: gridApi })
  })
})

onUnmounted(() => {
  document.removeEventListener('click',     onDocClick,       true)
  document.removeEventListener('mousemove', onGlobalMouseMove)
  document.removeEventListener('mouseup',   onGlobalMouseUp)
  canvasEl.value?.removeEventListener('webglcontextlost',     onContextLost)
  canvasEl.value?.removeEventListener('webglcontextrestored', onContextRestored)
  resizeObserver?.disconnect()
  intersectionObserver?.disconnect()
  window.removeEventListener('resize', scheduleResize)
  window.visualViewport?.removeEventListener('resize', scheduleResize)
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
  fontFamily:  "system-ui, -apple-system, sans-serif",
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
      class="cathode-filter-popup"
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

    <!-- Scroll info bar -->
    <div v-if="pagination" class="cathode-pagination" :style="paginStyle">
      <button :disabled="scrollY <= 0"       @click="pageUp()">◀</button>

      <span>
        {{ (firstVisibleRow + 1).toLocaleString() }}–{{ Math.min(filteredRows.length, lastVisibleRow + 1).toLocaleString() }}
        / {{ filteredRows.length.toLocaleString() }}
      </span>

      <button :disabled="scrollY >= maxScrollY" @click="pageDown()">▶</button>

      <span class="cathode-page-info" :style="{ color: accentColor }">
        {{ filteredRows.length.toLocaleString() }} rows
      </span>

      <!-- Selection readout — absolute row index into filteredRows -->
      <span v-if="selectedCell" class="cathode-sel-readout" :style="{ color: accentColor }">
        {{ displayCols[selectedCell.col]?.colDef.headerName ?? displayCols[selectedCell.col]?.colId }}
        :
        {{ formatCell(displayCols[selectedCell.col], filteredRows[selectedCell.row]) }}
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
  /* Do NOT set width/height here — renderer.setSize() owns the canvas dimensions
     via inline styles. CSS-based sizing causes the old pixel buffer to stretch
     visibly between the container resize and the ResizeObserver correction. */
  display: block;
  outline: none;
  flex-shrink: 0;
}

/* Filter popup — all colours applied inline from themeC computed */

/* Pagination */
.cathode-pagination {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 3px 12px;
  font-size: 11px;
  font-family: system-ui, -apple-system, sans-serif;
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
  font-family: system-ui, -apple-system, sans-serif;
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
