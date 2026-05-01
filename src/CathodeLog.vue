<script setup lang="ts">
import {
  ref, computed, watch, inject, onMounted, onUnmounted, nextTick,
} from 'vue'
import type { CSSProperties, Ref } from 'vue'
import * as THREE from 'three'
import {
  drawLog, lineHitTest, buildVisualLines, measureTimestampWidth, defaultFormatTs,
  totalContentHeight, LOG_THEME_COLORS,
  LINE_HEIGHT, PADDING_X, PADDING_Y, FONT,
  type LogEntry, type VisualLine,
} from './CanvasLog'
import './cathode.css'

// ── Props ─────────────────────────────────────────────────────────────────────

const props = withDefaults(defineProps<{
  entries:        LogEntry[]
  /** 'none' inherits parent CSS vars; built-ins: phosphor | amber | paper. */
  theme?:         'none' | 'phosphor' | 'amber' | 'paper'
  /** 0–45 barrel-distortion strength. */
  curvature?:     number
  scanlines?:     boolean
  glow?:          boolean
  /** Show/hide the timestamp column (left of the text). Defaults to true. */
  showTimestamps?: boolean
  /** Per-entry timestamp formatter. Defaults to HH:mm:ss for ms epoch. */
  formatTs?:      (ts: number | string) => string
  /** Wrap long lines to fit the canvas width (default true). */
  wordWrap?:      boolean
  /** Stick to bottom on new entries unless the user has scrolled up (default true). */
  autoscroll?:    boolean
  /** Ring-buffer cap on rendered entries — older entries scroll off. 0 = no cap. */
  maxLines?:      number
}>(), {
  theme:          'none',
  curvature:      25,
  scanlines:      true,
  glow:           true,
  showTimestamps: true,
  wordWrap:       true,
  autoscroll:     true,
  maxLines:       0,
})

// ── DOM refs ──────────────────────────────────────────────────────────────────

const wrapEl   = ref<HTMLDivElement | null>(null)
const canvasEl = ref<HTMLCanvasElement | null>(null)

// ── Canvas dimensions (set by sizeToContainer) ────────────────────────────────

const canvasW = ref(0)
const canvasH = ref(0)

// ── Scroll state ──────────────────────────────────────────────────────────────

const scrollY     = ref(0)
const hoveredLine = ref(-1)
/** True when the user has scrolled away from the bottom — autoscroll pauses. */
const stuckToBottom = ref(true)

// ── Visual lines (wrapped) — recomputed when entries / width / theme change ───

const trimmedEntries = computed(() => {
  const entries = props.entries ?? []
  if (props.maxLines > 0 && entries.length > props.maxLines) {
    return entries.slice(entries.length - props.maxLines)
  }
  return entries
})

/**
 * Sample timestamp used to size the timestamp column. We pick the longest
 * formatted ts in the buffer; if the buffer is empty we use a placeholder.
 */
const timestampSample = computed(() => {
  if (!props.showTimestamps) return ''
  const fmt = props.formatTs ?? defaultFormatTs
  let widest = '00:00:00'
  for (const e of trimmedEntries.value) {
    if (e.ts == null) continue
    const s = fmt(e.ts)
    if (s.length > widest.length) widest = s
  }
  return widest
})

const tsWidth = ref(0)
const visualLines = ref<VisualLine[]>([])

function recomputeVisualLines() {
  if (!offCanvas) return
  const ctx = offCanvas.getContext('2d')
  if (!ctx) return
  ctx.font = FONT

  const wWidth = props.showTimestamps
    ? measureTimestampWidth(ctx, timestampSample.value)
    : 0
  tsWidth.value = wWidth

  const textMaxWidth = Math.max(
    1,
    canvasW.value - PADDING_X * 2 - wWidth,
  )

  visualLines.value = buildVisualLines({
    entries:        trimmedEntries.value,
    ctx,
    textMaxWidth,
    showTimestamps: props.showTimestamps,
    formatTs:       props.formatTs,
    wordWrap:       props.wordWrap,
  })
}

const contentH = computed(() => totalContentHeight(visualLines.value.length))
const maxScrollY = computed(() => Math.max(0, contentH.value - canvasH.value))

watch(maxScrollY, () => {
  if (stuckToBottom.value) scrollY.value = maxScrollY.value
  else scrollY.value = Math.min(scrollY.value, maxScrollY.value)
})

// Recompute visual lines when entries or relevant props change
watch(
  [trimmedEntries, canvasW, () => props.showTimestamps, () => props.wordWrap, timestampSample],
  () => { recomputeVisualLines(); nextTick(redraw) },
  { deep: false },
)

// ── Three.js ──────────────────────────────────────────────────────────────────

let renderer:    THREE.WebGLRenderer | null = null
let webglFailed  = false
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
  uniform float     uStrength;
  uniform float     uScanlines;
  uniform float     uVignette;

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
      // Falloff coefficient was 1.5 — corners darkened to ~25% of centre,
      // which crushed text brightness. Dropped to 0.6: corners now hold
      // ~70%+ luminance so text reads bright across the whole screen.
      vec2  vc   = uv - 0.5;
      float vign = 1.0 - dot(vc, vc) * 0.6;
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

  material = new THREE.ShaderMaterial({
    uniforms: {
      uTex:       { value: texture },
      uStrength:  { value: 0.0 },
      uScanlines: { value: 1.0 },
      uVignette:  { value: 1.0 },
    },
    vertexShader:   VERT,
    fragmentShader: FRAG,
    transparent:    true,
  })

  scene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material))

  sizeToContainer()
}

function sizeToContainer() {
  if (!wrapEl.value) return
  if (!renderer && !webglFailed) return
  const W = wrapEl.value.clientWidth
  const H = wrapEl.value.clientHeight
  if (!W || !H) return

  const sizeChanged = offCanvas.width !== W || offCanvas.height !== H
  // Critical: setting `offCanvas.width = W` clears the canvas state even when
  // the value is unchanged. ResizeObserver / IntersectionObserver can fire
  // spuriously (e.g. on Vue prop updates that re-render unrelated DOM in the
  // ancestor flex layout), so we MUST early-return when nothing changed —
  // otherwise the visible canvas blanks until the next redraw lands.
  if (!sizeChanged) return

  offCanvas.width  = W
  offCanvas.height = H
  canvasW.value    = W
  canvasH.value    = H

  // Recompute wrapping for the new width
  recomputeVisualLines()

  if (renderer) {
    if (sizeChanged && texture) {
      texture.dispose()
      texture = new THREE.CanvasTexture(offCanvas)
      texture.minFilter = THREE.LinearFilter
      texture.magFilter = THREE.LinearFilter
      if (material) material.uniforms.uTex.value = texture
    }
    renderer.setPixelRatio(window.devicePixelRatio || 1)
    renderer.setSize(W, H)
  } else if (canvasEl.value) {
    canvasEl.value.width  = W
    canvasEl.value.height = H
    canvasEl.value.style.width  = W + 'px'
    canvasEl.value.style.height = H + 'px'
  }

  // Maintain stuck-to-bottom invariant after a resize
  if (stuckToBottom.value) scrollY.value = Math.max(0, contentH.value - canvasH.value)

  redraw()
}

// ── Redraw ────────────────────────────────────────────────────────────────────

function redraw() {
  if (!offCanvas?.width) return

  if (webglFailed) {
    if (!canvasEl.value) return
    drawLog(offCanvas, {
      visualLines:    visualLines.value,
      scrollY:        scrollY.value,
      theme:          props.theme,
      glow:           false,
      showTimestamps: props.showTimestamps,
      timestampWidth: tsWidth.value,
      hoveredLine:    hoveredLine.value,
    })
    const ctx2d = canvasEl.value.getContext('2d')
    if (ctx2d) ctx2d.drawImage(offCanvas, 0, 0)
    return
  }

  if (!renderer || !material || !texture) return

  const isPaper = props.theme === 'paper'

  material.uniforms.uStrength.value  = (props.curvature / 45) * 0.55
  material.uniforms.uScanlines.value = (props.scanlines && !isPaper) ? 1.0 : 0.0
  material.uniforms.uVignette.value  = isPaper ? 0.0 : 1.0

  drawLog(offCanvas, {
    visualLines:    visualLines.value,
    scrollY:        scrollY.value,
    theme:          props.theme,
    glow:           props.glow,
    showTimestamps: props.showTimestamps,
    timestampWidth: tsWidth.value,
    hoveredLine:    hoveredLine.value,
  })

  texture.needsUpdate = true
  renderer.render(scene, camera)
}

// ── Theme prop redraws ────────────────────────────────────────────────────────

watch(() => props.theme,     () => redraw())
// Curvature only changes the barrel-shader uStrength uniform — no layout
// or texture impact. redraw() picks up the new uStrength + re-renders.
// (The blanking-on-slider bug was traced to spurious ResizeObserver fires
// during slider drag, which is fixed by the !sizeChanged guard in
// sizeToContainer above.)
watch(() => props.curvature, () => redraw())
watch(() => props.scanlines, () => redraw())
watch(() => props.glow,      () => redraw())
watch(scrollY,               () => redraw())
watch(hoveredLine,           () => redraw())

// ── Mouse / wheel interaction ─────────────────────────────────────────────────

function canvasCoords(e: MouseEvent): [number, number] {
  if (!canvasEl.value) return [-1, -1]
  const rect = canvasEl.value.getBoundingClientRect()
  return [e.clientX - rect.left, e.clientY - rect.top]
}

function setScroll(y: number) {
  scrollY.value = Math.max(0, Math.min(maxScrollY.value, y))
  // Threshold for "at bottom" — within 4px counts as stuck (handles fractional)
  stuckToBottom.value = scrollY.value >= maxScrollY.value - 4
}

function onCanvasWheel(e: WheelEvent) {
  setScroll(scrollY.value + e.deltaY)
}

// Pan-to-scroll
let panActive       = false
let panStartY       = 0
let panStartScrollY = 0
let panMoved        = false

function onCanvasMouseDown(e: MouseEvent) {
  panActive       = true
  panMoved        = false
  panStartY       = e.clientY
  panStartScrollY = scrollY.value
}

function onGlobalMouseMove(e: MouseEvent) {
  if (panActive) {
    const dy = panStartY - e.clientY
    if (Math.abs(dy) > 4) panMoved = true
    setScroll(panStartScrollY + dy)
  }
}

function onGlobalMouseUp() {
  if (panActive) {
    panActive = false
    if (panMoved) panMoved = false
  }
}

function onCanvasMouseMove(e: MouseEvent) {
  const [, cy] = canvasCoords(e)
  if (cy < 0) { hoveredLine.value = -1; return }
  hoveredLine.value = lineHitTest(cy, scrollY.value, visualLines.value.length)
}

function onCanvasMouseLeave() {
  hoveredLine.value = -1
}

// ── Public API: jump to bottom ────────────────────────────────────────────────

defineExpose({
  /** Force-scroll to the latest entry. Resumes autoscroll. */
  scrollToBottom() {
    stuckToBottom.value = true
    scrollY.value = maxScrollY.value
  },
  /** Programmatic scroll to a given line index (visual lines, not entry idx). */
  scrollToLine(li: number) {
    setScroll(PADDING_Y + li * LINE_HEIGHT)
  },
})

// ── ResizeObserver / IntersectionObserver / window listeners ──────────────────

let resizeObserver:       ResizeObserver | null = null
let intersectionObserver: IntersectionObserver | null = null
let resizeRaf = 0

const resetTick = inject<Ref<number>>('cathodeResetTick', ref(0))
watch(resetTick, () => scheduleResize())

function scheduleResize() {
  cancelAnimationFrame(resizeRaf)
  resizeRaf = requestAnimationFrame(sizeToContainer)
}

function onContextLost(e: Event) { e.preventDefault() }
function onContextRestored() {
  renderer?.dispose()
  renderer    = null
  webglFailed = false
  initThree()
}

onMounted(() => {
  document.addEventListener('mousemove', onGlobalMouseMove)
  document.addEventListener('mouseup',   onGlobalMouseUp)

  nextTick(() => {
    initThree()
    if (canvasEl.value) {
      canvasEl.value.addEventListener('webglcontextlost',     onContextLost)
      canvasEl.value.addEventListener('webglcontextrestored', onContextRestored)
    }
    if (wrapEl.value) {
      resizeObserver = new ResizeObserver(() => sizeToContainer())
      resizeObserver.observe(wrapEl.value)

      intersectionObserver = new IntersectionObserver((entries) => {
        if (entries.some(e => e.isIntersecting)) scheduleResize()
      })
      intersectionObserver.observe(wrapEl.value)
    }
    window.addEventListener('resize', scheduleResize)
    window.visualViewport?.addEventListener('resize', scheduleResize)

    // Start at bottom on mount (typical for log views)
    scrollY.value = maxScrollY.value
  })
})

onUnmounted(() => {
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

const themeC = computed(() => LOG_THEME_COLORS[props.theme] ?? LOG_THEME_COLORS['none'])

const wrapStyle = computed<CSSProperties>(() => ({
  background: themeC.value.bg,
}))
</script>

<template>
  <div ref="wrapEl" class="cathode-log-wrap" :style="wrapStyle">
    <canvas
      ref="canvasEl"
      class="cathode-log-canvas"
      @wheel.prevent="onCanvasWheel"
      @mousemove="onCanvasMouseMove"
      @mouseleave="onCanvasMouseLeave"
      @mousedown="onCanvasMouseDown"
    />
  </div>
</template>

<style scoped>
.cathode-log-wrap {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.cathode-log-canvas {
  /* Renderer.setSize() owns inline width/height. Don't override here. */
  display: block;
  outline: none;
  flex-shrink: 0;
}
</style>
