<script setup lang="ts">
import { computed, inject, onUnmounted, ref } from 'vue'
import type { Ref } from 'vue'
import { useCathodeLayout, TITLEBAR_H } from './useCathodeLayout'

const props = defineProps<{
  id:    string
  title: string
}>()

const { containers, bringToFront, setVisible, setMinimized, setMaximized, updatePos, updateSize } = useCathodeLayout()

const workspaceEl = inject<Ref<HTMLElement | null>>('cathodeWorkspace', ref(null))

const s = computed(() => containers.value[props.id])

const MIN_W = 200
const MIN_H = 80
const KEEP  = 60

const containerStyle = computed(() => {
  const c = s.value
  if (!c) return {}
  if (c.maximized) {
    return { left: '0px', top: '0px', width: '100%', height: '100%', zIndex: c.zIndex }
  }
  return {
    left:    c.x + 'px',
    top:     c.y + 'px',
    width:   c.w + 'px',
    height:  c.minimized ? TITLEBAR_H + 'px' : c.h + 'px',
    zIndex:  c.zIndex,
    display: c.visible ? 'flex' : 'none',
  }
})

// ── Drag ──────────────────────────────────────────────────────────────────────
let dragging = false
let dragOffX = 0, dragOffY = 0

function onTitleMousedown(e: MouseEvent) {
  if ((e.target as HTMLElement).closest('.cc-btn')) return
  if (s.value.maximized) return
  bringToFront(props.id)
  dragging = true
  const el = workspaceEl.value?.querySelector(`#cc-${props.id}`) as HTMLElement
  if (!el) return
  const rect = el.getBoundingClientRect()
  dragOffX = e.clientX - rect.left
  dragOffY = e.clientY - rect.top
  document.addEventListener('mousemove', onDragMove)
  document.addEventListener('mouseup',   onDragUp)
  e.preventDefault()
}

function onDragMove(e: MouseEvent) {
  if (!dragging || !workspaceEl.value) return
  const wsRect = workspaceEl.value.getBoundingClientRect()
  const elW    = s.value?.w ?? 300
  let x = e.clientX - wsRect.left - dragOffX
  let y = e.clientY - wsRect.top  - dragOffY
  x = Math.max(KEEP - elW, Math.min(wsRect.width  - KEEP, x))
  y = Math.max(0,           Math.min(wsRect.height - TITLEBAR_H, y))
  updatePos(props.id, x, y)
}

function onDragUp() {
  dragging = false
  document.removeEventListener('mousemove', onDragMove)
  document.removeEventListener('mouseup',   onDragUp)
}

// ── Resize ────────────────────────────────────────────────────────────────────
let resizing = false
let resizeStartX = 0, resizeStartY = 0, resizeStartW = 0, resizeStartH = 0
const sizeBadge = ref('')

function onResizeMousedown(e: MouseEvent) {
  if (s.value.maximized) return
  bringToFront(props.id)
  resizing = true
  resizeStartX = e.clientX
  resizeStartY = e.clientY
  resizeStartW = s.value.w
  resizeStartH = s.value.h
  document.addEventListener('mousemove', onResizeMove)
  document.addEventListener('mouseup',   onResizeUp)
  e.preventDefault()
  e.stopPropagation()
}

function onResizeMove(e: MouseEvent) {
  if (!resizing) return
  const w = Math.max(MIN_W, resizeStartW + (e.clientX - resizeStartX))
  const h = Math.max(MIN_H, resizeStartH + (e.clientY - resizeStartY))
  updateSize(props.id, w, h)
  sizeBadge.value = `${Math.round(w)}×${Math.round(h)}`
}

function onResizeUp() {
  resizing = false
  sizeBadge.value = ''
  document.removeEventListener('mousemove', onResizeMove)
  document.removeEventListener('mouseup',   onResizeUp)
}

onUnmounted(() => {
  document.removeEventListener('mousemove', onDragMove)
  document.removeEventListener('mouseup',   onDragUp)
  document.removeEventListener('mousemove', onResizeMove)
  document.removeEventListener('mouseup',   onResizeUp)
})

// ── Controls ──────────────────────────────────────────────────────────────────
function onMinimize() { setMinimized(props.id, !s.value.minimized) }
function onMaximize() { setMaximized(props.id, !s.value.maximized) }
function onClose()    { setVisible(props.id, false) }
function onFocus()    { bringToFront(props.id) }
</script>

<template>
  <div
    v-if="s && s.visible"
    :id="`cc-${id}`"
    class="cc"
    :class="{ 'cc-minimized': s.minimized, 'cc-maximized': s.maximized }"
    :style="containerStyle"
    @mousedown="onFocus"
  >
    <!-- Title bar -->
    <div class="cc-titlebar" @mousedown="onTitleMousedown">
      <span class="cc-status-dot" />
      <span class="cc-title">{{ title }}</span>
      <span v-if="sizeBadge" class="cc-size-badge">{{ sizeBadge }}</span>
      <div class="cc-controls">
        <button class="cc-btn" title="Minimize" @click.stop="onMinimize">─</button>
        <button class="cc-btn cc-btn-max" :title="s.maximized ? 'Restore' : 'Maximize'" @click.stop="onMaximize">
          {{ s.maximized ? '⤡' : '⤢' }}
        </button>
        <button class="cc-btn cc-btn-close" title="Close" @click.stop="onClose">✕</button>
      </div>
    </div>

    <!-- Content slot -->
    <div v-show="!s.minimized" class="cc-body">
      <slot />
    </div>

    <!-- Resize handle -->
    <div
      v-if="!s.minimized && !s.maximized"
      class="cc-resize"
      @mousedown.stop="onResizeMousedown"
    />
  </div>
</template>

<style scoped>
.cc {
  position: absolute;
  display: flex;
  flex-direction: column;
  border: 1px solid var(--cc-border, #2a3a50);
  border-radius: 3px;
  background: var(--cc-surface, #0d1520);
  box-shadow:
    0 0 0 1px rgba(64,160,240,0.05),
    0 0 16px rgba(64,160,240,0.06),
    0 8px 32px rgba(0,0,0,0.55);
  overflow: hidden;
  transition: border-color 0.12s, box-shadow 0.12s;
}

.cc:focus-within,
.cc:has(.cc-titlebar:active) { outline: none; }

/* focused state — set by parent workspace via JS */
.cc.cc-focused {
  border-color: rgba(64,160,240,0.60);
  box-shadow:
    0 0 0 1px rgba(64,160,240,0.28),
    0 0 28px rgba(64,160,240,0.24),
    0 0 60px rgba(64,160,240,0.10),
    0 8px 40px rgba(0,0,0,0.75);
}

/* scanlines */
.cc::after {
  content: '';
  position: absolute; inset: 0;
  background: repeating-linear-gradient(
    to bottom,
    transparent, transparent 1px,
    rgba(0,0,0,0.13) 1px, rgba(0,0,0,0.13) 2px
  );
  pointer-events: none;
  z-index: 40;
}

/* vignette */
.cc::before {
  content: '';
  position: absolute; inset: 0;
  background: radial-gradient(ellipse at 50% 50%, transparent 55%, rgba(0,0,0,0.22) 100%);
  pointer-events: none;
  z-index: 39;
}

/* suppress effects in light/paper theme */
:global(:root.cathode-light) .cc::after  { display: none; }
:global(:root.cathode-light) .cc::before { display: none; }

.cc-maximized { border-radius: 0; box-shadow: none; }

/* ── Title bar ──────────────────────────────────────────────── */
.cc-titlebar {
  display: flex;
  align-items: center;
  height: 28px;
  padding: 0 8px 0 10px;
  background: var(--cc-header, #12122a);
  border-bottom: 1px solid var(--cc-border, #1e2a3a);
  cursor: grab;
  flex-shrink: 0;
  position: relative;
  z-index: 41;
  user-select: none;
}
.cc-titlebar:active { cursor: grabbing; }

.cc-status-dot {
  width: 5px; height: 5px;
  border-radius: 50%;
  background: var(--cc-accent, #00bc8c);
  box-shadow: 0 0 4px var(--cc-accent, #00bc8c);
  margin-right: 8px;
  flex-shrink: 0;
}

.cc-title {
  font-size: 9px;
  font-family: monospace;
  font-weight: bold;
  letter-spacing: 0.14em;
  color: var(--cc-accent-text, #40a0f0);
  text-transform: uppercase;
  flex: 1;
}

.cc-size-badge {
  font-size: 8px;
  font-family: monospace;
  color: var(--cc-tx3, #4a6a88);
  margin-right: 8px;
  letter-spacing: 0.04em;
}

.cc-controls {
  display: flex;
  align-items: center;
  gap: 3px;
}

.cc-btn {
  width: 18px; height: 18px;
  border-radius: 2px;
  border: 1px solid var(--cc-border, #1e2a3a);
  background: none;
  color: var(--cc-tx3, #4a6a88);
  font-size: 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
  padding: 0;
  transition: color 0.15s, border-color 0.15s;
}
.cc-btn:hover       { color: var(--cc-tx1, #c0d0e0); border-color: var(--cc-tx2, #7a90a8); }
.cc-btn-max:hover   { color: var(--cc-accent-text, #40a0f0); border-color: var(--cc-accent-text, #40a0f0); }
.cc-btn-close:hover { color: #e74c3c; border-color: #e74c3c; }

/* ── Body ───────────────────────────────────────────────────── */
.cc-body {
  flex: 1;
  min-height: 0;
  overflow: hidden;
  position: relative;
  z-index: 1;
}

/* ── Resize handle ──────────────────────────────────────────── */
.cc-resize {
  position: absolute;
  bottom: 0; right: 0;
  width: 16px; height: 16px;
  cursor: se-resize;
  z-index: 42;
}
.cc-resize::before {
  content: '';
  position: absolute;
  bottom: 3px; right: 3px;
  width: 8px; height: 8px;
  border-bottom: 2px solid var(--cc-border-2, #2a3a50);
  border-right:  2px solid var(--cc-border-2, #2a3a50);
}
</style>
