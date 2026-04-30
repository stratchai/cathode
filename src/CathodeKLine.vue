<script setup lang="ts">
import {
  ref, computed, watch, inject, onMounted, onUnmounted, nextTick,
} from 'vue'
import type { CSSProperties, Ref } from 'vue'
import * as THREE from 'three'
import {
  drawKLine, KLINE_THEME_COLORS, DEFAULT_VOLUME_FRACTION,
  type OHLCVCandle,
} from './CanvasKLine'
import './cathode.css'

// ── Props ─────────────────────────────────────────────────────────────────────

const props = withDefaults(defineProps<{
  candles:        OHLCVCandle[]
  /** 'none' inherits parent CSS vars; built-ins: phosphor | amber | paper. */
  theme?:         'none' | 'phosphor' | 'amber' | 'paper'
  /** 0–45 barrel-distortion strength, same scale as CathodeGrid/Log. */
  curvature?:     number
  scanlines?:     boolean
  glow?:          boolean
  /** Show/hide the volume pane at the bottom. Defaults to true. */
  showVolume?:    boolean
  /** 0..1, fraction of pane reserved for volume bars (default 0.18). */
  volumeFraction?: number
  /** px slot width per candle (driver of "zoom"). Higher = wider candles. */
  slotW?:         number
}>(), {
  theme:          'none',
  curvature:      25,
  scanlines:      true,
  glow:           true,
  showVolume:     true,
  volumeFraction: DEFAULT_VOLUME_FRACTION,
  slotW:          8,
})

// ── DOM refs ──────────────────────────────────────────────────────────────────

const wrapEl   = ref<HTMLDivElement | null>(null)
const canvasEl = ref<HTMLCanvasElement | null>(null)

// ── Canvas dimensions (set by sizeToContainer) ────────────────────────────────

const canvasW = ref(0)
const canvasH = ref(0)

// ── Interaction state ─────────────────────────────────────────────────────────
//
// scrollX  — px offset, positive = scrolled back in time (older candles).
//            Anchored to the right edge by computeVisibleWindow.
// zoomLevel — multiplier on props.slotW; wheel adjusts it. 1.0 = base zoom.
// hover    — { x, y } in canvas coords, null when not over the chart.
//            Drives the crosshair overlay drawn in drawKLine.

const scrollX   = ref(0)
const zoomLevel = ref(1)
const hover     = ref<{ x: number; y: number } | null>(null)

const ZOOM_MIN = 0.25
const ZOOM_MAX = 6.0

const effectiveSlotW = computed(() => Math.max(1, props.slotW * zoomLevel.value))

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

  // Same defensive guard as CathodeLog: skip when nothing actually changed,
  // since setting offCanvas.width/height clears the canvas state — and
  // ResizeObserver can fire spuriously during prop updates.
  const sizeChanged = offCanvas.width !== W || offCanvas.height !== H
  if (!sizeChanged) return

  offCanvas.width  = W
  offCanvas.height = H
  canvasW.value    = W
  canvasH.value    = H

  if (renderer) {
    if (texture) {
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

  redraw()
}

// ── Redraw ────────────────────────────────────────────────────────────────────

function redraw() {
  if (!offCanvas?.width) return

  if (webglFailed) {
    if (!canvasEl.value) return
    drawKLine(offCanvas, {
      candles:        props.candles,
      slotW:          effectiveSlotW.value,
      scrollX:        scrollX.value,
      theme:          props.theme,
      glow:           false,
      showVolume:     props.showVolume,
      volumeFraction: props.volumeFraction,
      hover:          hover.value,
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

  drawKLine(offCanvas, {
    candles:        props.candles,
    slotW:          effectiveSlotW.value,
    scrollX:        scrollX.value,
    theme:          props.theme,
    glow:           props.glow,
    showVolume:     props.showVolume,
    volumeFraction: props.volumeFraction,
    hover:          hover.value,
  })

  texture.needsUpdate = true
  renderer.render(scene, camera)
}

// ── Prop watchers — uniform-only updates avoid the canvas-clear cycle ─────────

watch(() => props.theme,          () => redraw())
watch(() => props.curvature,      () => redraw())
watch(() => props.scanlines,      () => redraw())
watch(() => props.glow,           () => redraw())
watch(() => props.showVolume,     () => redraw())
watch(() => props.volumeFraction, () => redraw())
watch(() => props.slotW,          () => redraw())
watch(() => props.candles,        () => redraw(), { deep: false })
watch(scrollX,                    () => redraw())
watch(zoomLevel,                  () => redraw())
watch(hover,                      () => redraw())
watch(effectiveSlotW,             () => redraw())

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

// ── Mouse / wheel interaction ─────────────────────────────────────────────────

function canvasCoords(e: MouseEvent): [number, number] {
  if (!canvasEl.value) return [-1, -1]
  const rect = canvasEl.value.getBoundingClientRect()
  return [e.clientX - rect.left, e.clientY - rect.top]
}

/**
 * Clamp scrollX to [0, maxScrollX] where max keeps at least one candle
 * visible at the right edge. Without this clamp, fast pan can run scrollX
 * past the available range and present a blank chart.
 */
function clampScroll(s: number): number {
  const sw = effectiveSlotW.value
  if (sw <= 0) return 0
  const total = props.candles?.length ?? 0
  // Right edge anchored: scrollX 0 = newest candle on right. Max scroll is
  // when the OLDEST candle is on the left. Total slots minus visible slots.
  const visible = Math.max(1, Math.floor((canvasW.value || 1) / sw))
  const maxScrollSlots = Math.max(0, total - visible)
  return Math.max(0, Math.min(s, maxScrollSlots * sw))
}

function onCanvasWheel(e: WheelEvent) {
  // Trackpad: deltaX is horizontal scroll, deltaY is zoom.
  // Mouse wheel: shift+deltaY scrolls horizontally, plain deltaY zooms.
  if (e.deltaX !== 0 || (e.shiftKey && e.deltaY !== 0)) {
    const dx = e.deltaX !== 0 ? e.deltaX : e.deltaY
    scrollX.value = clampScroll(scrollX.value + dx)
    return
  }
  if (e.deltaY === 0) return
  // Zoom — anchor on the candle at the cursor so the user's focus stays
  // under the cursor as the chart scales. (Otherwise zoom feels detached.)
  const [cx] = canvasCoords(e)
  const sw     = effectiveSlotW.value
  if (cx >= 0 && sw > 0 && props.candles?.length) {
    // Candle index under cursor before zoom
    const visible    = Math.max(1, Math.floor((canvasW.value || 1) / sw))
    const firstIdx   = Math.max(0, props.candles.length - visible - Math.floor(scrollX.value / sw))
    const idxAtCursor = firstIdx + (cx - 8 /* PADDING_LEFT */) / sw
    // Apply zoom (negative deltaY = wheel up = zoom in)
    const factor   = Math.exp(-e.deltaY * 0.0015)
    const newZoom  = Math.max(ZOOM_MIN, Math.min(ZOOM_MAX, zoomLevel.value * factor))
    zoomLevel.value = newZoom
    const newSw      = props.slotW * newZoom
    const newVisible = Math.max(1, Math.floor((canvasW.value || 1) / newSw))
    // Solve for scrollX such that the same candle stays under the cursor:
    // idxAtCursor = (props.candles.length - newVisible - Math.floor(scrollX / newSw)) + (cx - 8) / newSw
    const desiredFirst = idxAtCursor - (cx - 8) / newSw
    const slotsScrolled = Math.max(0, props.candles.length - newVisible - desiredFirst)
    scrollX.value = clampScroll(slotsScrolled * newSw)
  } else {
    const factor = Math.exp(-e.deltaY * 0.0015)
    zoomLevel.value = Math.max(ZOOM_MIN, Math.min(ZOOM_MAX, zoomLevel.value * factor))
  }
}

// Click-drag pan
let panActive       = false
let panStartX       = 0
let panStartScrollX = 0

function onCanvasMouseDown(e: MouseEvent) {
  if (e.button !== 0) return   // only left-click
  panActive       = true
  panStartX       = e.clientX
  panStartScrollX = scrollX.value
  // Hide crosshair while panning — it's distracting and the readout would lag
  hover.value = null
}

function onGlobalMouseMove(e: MouseEvent) {
  if (panActive) {
    // Direct-manipulation feel: grab and drag the chart. Drag RIGHT exposes
    // older candles on the left (scrollX increases). Drag LEFT pulls newer
    // candles into view (scrollX decreases — already clamped to 0 at the
    // right edge so a leftward drag from "newest visible" does nothing).
    const dx = e.clientX - panStartX
    scrollX.value = clampScroll(panStartScrollX + dx)
    return
  }
}

function onGlobalMouseUp() {
  panActive = false
}

function onCanvasMouseMove(e: MouseEvent) {
  if (panActive) return
  const [cx, cy] = canvasCoords(e)
  if (cx < 0 || cy < 0) { hover.value = null; return }
  hover.value = { x: cx, y: cy }
}

function onCanvasMouseLeave() {
  hover.value = null
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

const themeC = computed(() => KLINE_THEME_COLORS[props.theme] ?? KLINE_THEME_COLORS['none'])

const wrapStyle = computed<CSSProperties>(() => ({
  background: themeC.value.bg,
}))
</script>

<template>
  <div ref="wrapEl" class="cathode-kline-wrap" :style="wrapStyle">
    <canvas
      ref="canvasEl"
      class="cathode-kline-canvas"
      @wheel.prevent="onCanvasWheel"
      @mousedown="onCanvasMouseDown"
      @mousemove="onCanvasMouseMove"
      @mouseleave="onCanvasMouseLeave"
    />
  </div>
</template>

<style scoped>
.cathode-kline-wrap {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  overflow: hidden;
}
.cathode-kline-canvas {
  /* Renderer.setSize() owns inline width/height. */
  display: block;
  outline: none;
  flex-shrink: 0;
}
</style>
