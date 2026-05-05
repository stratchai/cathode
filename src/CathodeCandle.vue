<script setup lang="ts">
import {
  ref, computed, watch, inject, onMounted, onUnmounted, nextTick,
} from 'vue'
import type { CSSProperties, Ref } from 'vue'
import * as THREE from 'three'
import {
  drawCandle, CANDLE_THEME_COLORS, DEFAULT_VOLUME_FRACTION,
  type OHLCVCandle, type PriceOverlay, type TradeMarker, type CandleColors,
} from './CanvasCandle'
import {
  LENS_FRAG_UNIFORMS, LENS_FRAG_FN, LENS_FRAG_RING,
  createLensUniforms, writeLensUniforms, eventToLensUV,
  LENS_INACTIVE, type MouseLensUV,
} from './lensShader'
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
  /** Indicator series drawn on the price pane (BB, EMA, SMA, etc.). */
  overlays?:      PriceOverlay[]
  /** Trade entry/exit annotations at (timestamp, price) points. */
  markers?:       TradeMarker[]
  /**
   * Force the 2D-canvas fallback path — skip Three.js + barrel shader
   * entirely. Use for mini-charts: dashboards rendering many cards at
   * once exceed Chrome's ~16 WebGL-context cap, evicting visible charts.
   * The barrel effect is also barely legible at small sizes.
   */
  flat?:          boolean
  /**
   * Thumbnail mode — drops the time axis + interval badge, narrows the
   * right-edge gutter, sparser & smaller price-axis labels. Use for
   * mini-charts (~120–180px tall) where the full chrome doesn't fit.
   */
  compact?:       boolean
  /**
   * Per-instance colour overrides merged onto the active theme. Lets the
   * consumer match its own brand palette (e.g. dashboard's #00bc8c) without
   * having to register a new theme upstream.
   */
  colors?:        Partial<CandleColors>
  /**
   * Lens-on-hover mode. When true, mousing over the chart magnifies a
   * circular region under the cursor at ~1.6× with a flat field and a
   * subtle glass curl at the rim. Independent of the mouse-wheel zoom
   * (which is chart-internal and rescales the candle slot width).
   */
  magnify?:       boolean
}>(), {
  theme:          'none',
  curvature:      25,
  scanlines:      true,
  glow:           true,
  showVolume:     true,
  volumeFraction: DEFAULT_VOLUME_FRACTION,
  slotW:          8,
  flat:           false,
  compact:        false,
  magnify:        false,
})

// ── DOM refs ──────────────────────────────────────────────────────────────────

const wrapEl   = ref<HTMLDivElement | null>(null)
const canvasEl = ref<HTMLCanvasElement | null>(null)

// ── Lens state (mouse position in shader UV; (-999,-999) = inactive) ─────────

const mouseLensUV: MouseLensUV = { ...LENS_INACTIVE }

// ── Canvas dimensions (set by sizeToContainer) ────────────────────────────────

const canvasW = ref(0)
const canvasH = ref(0)

// ── Interaction state ─────────────────────────────────────────────────────────
//
// scrollX  — px offset, positive = scrolled back in time (older candles).
//            Anchored to the right edge by computeVisibleWindow.
// zoomLevel — multiplier on props.slotW; wheel adjusts it. 1.0 = base zoom.
// hover    — { x, y } in canvas coords, null when not over the chart.
//            Drives the crosshair overlay drawn in drawCandle.

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
  ${LENS_FRAG_UNIFORMS}

  varying vec2 vUv;

  vec2 barrel(vec2 uv) {
    vec2  cc   = uv - 0.5;
    float dist = dot(cc, cc) * uStrength;
    vec2  d    = cc * (1.0 + dist) * dist;
    return uv + d;
  }

  ${LENS_FRAG_FN}

  void main() {
    vec2 lensUV = applyLens(vUv);
    vec2 uv     = barrel(lensUV);

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

    ${LENS_FRAG_RING}

    gl_FragColor = color;
  }
`

function initThree() {
  if (!canvasEl.value || !wrapEl.value) return

  offCanvas = document.createElement('canvas')

  // `flat` opts out of WebGL entirely — same render path as the WebGL
  // fallback, intentionally chosen to avoid context-cap eviction when
  // many small charts mount at once.
  if (props.flat) {
    webglFailed = true
    sizeToContainer()
    return
  }

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
      ...createLensUniforms(),
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
    drawCandle(offCanvas, {
      candles:        props.candles,
      slotW:          effectiveSlotW.value,
      scrollX:        scrollX.value,
      theme:          props.theme,
      glow:           false,
      showVolume:     props.showVolume,
      volumeFraction: props.volumeFraction,
      hover:          hover.value,
      overlays:       props.overlays,
      markers:        props.markers,
      compact:        props.compact,
      colors:         props.colors,
    })
    const ctx2d = canvasEl.value.getContext('2d')
    if (ctx2d) {
      // Clear before composite — `none`/`paper` themes have a transparent
      // background, so drawImage would layer on top of the previous frame.
      // Without this, translucent overlays (BB band fillAlpha) accumulate
      // into solid colour after ~13 frames and axis/OHLCV labels smear.
      ctx2d.clearRect(0, 0, canvasEl.value.width, canvasEl.value.height)
      ctx2d.drawImage(offCanvas, 0, 0)
    }
    return
  }

  if (!renderer || !material || !texture) return

  const isPaper = props.theme === 'paper'

  material.uniforms.uStrength.value  = (props.curvature / 45) * 0.55
  material.uniforms.uScanlines.value = (props.scanlines && !isPaper) ? 1.0 : 0.0
  material.uniforms.uVignette.value  = isPaper ? 0.0 : 1.0
  writeLensUniforms(material, props.magnify, mouseLensUV, offCanvas.width, offCanvas.height)

  drawCandle(offCanvas, {
    candles:        props.candles,
    slotW:          effectiveSlotW.value,
    scrollX:        scrollX.value,
    theme:          props.theme,
    glow:           props.glow,
    showVolume:     props.showVolume,
    volumeFraction: props.volumeFraction,
    hover:          hover.value,
    overlays:       props.overlays,
    markers:        props.markers,
    compact:        props.compact,
    colors:         props.colors,
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
watch(() => props.overlays,       () => redraw(), { deep: false })
watch(() => props.markers,        () => redraw(), { deep: false })
watch(() => props.compact,        () => redraw())
watch(() => props.magnify,        (on) => {
  if (!on) { mouseLensUV.x = LENS_INACTIVE.x; mouseLensUV.y = LENS_INACTIVE.y }
  redraw()
})
watch(() => props.colors,         () => redraw(), { deep: true })

// `flat` is a mount-time decision — once a canvas element has been used
// for WebGL the browser locks it (getContext('2d') returns null), so a
// pipeline swap requires remounting the component (via :key from the
// consumer). The watcher exists only to surface the constraint clearly.
watch(() => props.flat, () => {
  console.warn('[CathodeCandle] `flat` is mount-time only; remount the component (e.g. with :key) to switch pipelines.')
})
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
  // Grab focus so arrow / shift-arrow keys route to the chart.
  if (wrapEl.value) wrapEl.value.focus()
}

// ── Keyboard navigation ────────────────────────────────────────────────────
// ←/→ pan one candle (Shift = ten); ↑/↓ zoom in/out (same path as wheel).
function applyZoom(direction: 1 | -1) {
  const factor = Math.exp(direction * 0.18)
  zoomLevel.value = Math.max(ZOOM_MIN, Math.min(ZOOM_MAX, zoomLevel.value * factor))
  scrollX.value   = clampScroll(scrollX.value)
}

function onKeyDown(e: KeyboardEvent) {
  // Pan step in candle-slots. Default of 3 (vs 1) makes each key press
  // visibly move the chart even after zoom-in; shift jumps a screenful.
  const sw   = effectiveSlotW.value
  const step = e.shiftKey ? 20 : 3
  switch (e.key) {
    case 'ArrowLeft':  e.preventDefault(); scrollX.value = clampScroll(scrollX.value + sw * step); break
    case 'ArrowRight': e.preventDefault(); scrollX.value = clampScroll(scrollX.value - sw * step); break
    case 'ArrowUp':    e.preventDefault(); applyZoom(1); break
    case 'ArrowDown':  e.preventDefault(); applyZoom(-1); break
    case 'Home':       e.preventDefault(); scrollX.value = clampScroll(Number.MAX_SAFE_INTEGER); break
    case 'End':        e.preventDefault(); scrollX.value = 0; break
  }
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

// ── Touch handlers ─────────────────────────────────────────────────────────
// Mobile browsers don't fire wheel events. Without these, swipe-pan inside
// the chart canvas does nothing on phones/tablets. Mirrors the mouse-drag
// pan model with the same sign convention (drag right → see older candles
// on the left → scrollX increases).
function onTouchStart(e: TouchEvent) {
  if (e.touches.length !== 1) return
  const t = e.touches[0]
  panActive       = true
  panStartX       = t.clientX
  panStartScrollX = scrollX.value
  hover.value     = null
}

function onTouchMove(e: TouchEvent) {
  if (!panActive || e.touches.length !== 1) return
  e.preventDefault()
  const t  = e.touches[0]
  const dx = t.clientX - panStartX
  scrollX.value = clampScroll(panStartScrollX + dx)
}

function onTouchEnd() { panActive = false }

function onCanvasMouseMove(e: MouseEvent) {
  if (props.magnify && canvasEl.value) {
    const uv = eventToLensUV(e, canvasEl.value)
    mouseLensUV.x = uv.x
    mouseLensUV.y = uv.y
    redraw()
  }
  if (panActive) return
  const [cx, cy] = canvasCoords(e)
  if (cx < 0 || cy < 0) { hover.value = null; return }
  hover.value = { x: cx, y: cy }
}

function onCanvasMouseLeave() {
  hover.value = null
  mouseLensUV.x = LENS_INACTIVE.x
  mouseLensUV.y = LENS_INACTIVE.y
  redraw()
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

const themeC = computed(() => CANDLE_THEME_COLORS[props.theme] ?? CANDLE_THEME_COLORS['none'])

const wrapStyle = computed<CSSProperties>(() => ({
  background: themeC.value.bg,
}))
</script>

<template>
  <div
    ref="wrapEl"
    class="cathode-candle-wrap"
    :style="wrapStyle"
    tabindex="0"
    @keydown="onKeyDown"
  >
    <canvas
      ref="canvasEl"
      class="cathode-candle-canvas"
      @wheel.prevent="onCanvasWheel"
      @mousedown="onCanvasMouseDown"
      @mousemove="onCanvasMouseMove"
      @mouseleave="onCanvasMouseLeave"
      @touchstart.passive="onTouchStart"
      @touchmove="onTouchMove"
      @touchend="onTouchEnd"
      @touchcancel="onTouchEnd"
    />
  </div>
</template>

<style scoped>
.cathode-candle-wrap {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  overflow: hidden;
  /* Focusable for keyboard nav (arrow keys); suppress the default outline
     since the CRT bezel signals the active surface. */
  outline: none;
}
.cathode-candle-canvas {
  /* Renderer.setSize() owns inline width/height. */
  display: block;
  outline: none;
  flex-shrink: 0;
  /* Tell mobile browsers not to handle touches on this canvas — JS touch
     handlers drive horizontal pan. Without this, the page scrolls under
     the finger instead of the chart panning. */
  touch-action: none;
}
</style>
