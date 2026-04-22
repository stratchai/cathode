<script setup lang="ts">
import { provide, ref, onMounted, onUnmounted } from 'vue'
import { useCathodeLayout, resetTick } from './useCathodeLayout'

const props = defineProps<{
  storageKey?: string
  initialLayout?: Record<string, import('./useCathodeLayout').ContainerState>
  containerTitles?: Record<string, string>
}>()

const { containers, load, reset, setVisible } = useCathodeLayout()

const workspaceEl = ref<HTMLElement | null>(null)
provide('cathodeWorkspace', workspaceEl)
provide('cathodeResetTick', resetTick)

onMounted(() => {
  if (!workspaceEl.value) return
  const { clientWidth, clientHeight } = workspaceEl.value
  const initial = props.initialLayout ?? {}
  load(initial, props.storageKey ?? 'cathode.layout')
  // Bring the first visible container to focus
  const first = Object.keys(containers.value)[0]
  if (first) bringFirstToFront(first)
})

function bringFirstToFront(id: string) {
  document.querySelectorAll('.cc').forEach(el => el.classList.remove('cc-focused'))
  const el = workspaceEl.value?.querySelector(`#cc-${id}`)
  if (el) el.classList.add('cc-focused')
}

function onReset() {
  if (!workspaceEl.value || !props.initialLayout) return
  reset(props.initialLayout)
}

// ── Focus management (click-to-front glow) ────────────────────────────────────
function onWorkspaceMousedown(e: MouseEvent) {
  const cc = (e.target as HTMLElement).closest('.cc') as HTMLElement | null
  if (!cc) return
  document.querySelectorAll('.cc').forEach(el => el.classList.remove('cc-focused'))
  cc.classList.add('cc-focused')
}

// ── Restore menu ──────────────────────────────────────────────────────────────
const showRestoreMenu = ref(false)

const closedContainers = () =>
  Object.entries(containers.value)
    .filter(([, s]) => !s.visible)
    .map(([id]) => id)

function restoreContainer(id: string) {
  setVisible(id, true)
  showRestoreMenu.value = false
}

function onClickOutside(e: MouseEvent) {
  if (!showRestoreMenu.value) return
  const target = e.target as HTMLElement
  if (!target.closest('.ws-restore-menu') && !target.closest('.ws-btn-restore')) {
    showRestoreMenu.value = false
  }
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') showRestoreMenu.value = false
}

onMounted(() => {
  document.addEventListener('click',   onClickOutside)
  document.addEventListener('keydown', onKeydown)
})
onUnmounted(() => {
  document.removeEventListener('click',   onClickOutside)
  document.removeEventListener('keydown', onKeydown)
})

function titleFor(id: string): string {
  return props.containerTitles?.[id] ?? id
}
</script>

<template>
  <div
    ref="workspaceEl"
    class="cathode-workspace"
    @mousedown="onWorkspaceMousedown"
  >
    <slot />

    <!-- Focused overlay (e.g. FocusedOverlay from consumer app) -->
    <slot name="overlay" />

    <!-- Workspace toolbar -->
    <div class="ws-toolbar">
      <button
        v-if="initialLayout"
        class="ws-btn"
        title="Reset all panels to default layout"
        @click="onReset"
      >
        ↺ Reset Layout
      </button>
      <div class="ws-sep" />
      <button
        class="ws-btn ws-btn-restore"
        title="Restore a closed panel"
        @click="showRestoreMenu = !showRestoreMenu"
      >
        ⊞ Restore Panel
      </button>
    </div>

    <!-- Restore menu -->
    <Transition name="menu">
      <div v-if="showRestoreMenu" class="ws-restore-menu">
        <div class="ws-restore-title">Closed Panels</div>
        <div v-if="!closedContainers().length" class="ws-restore-empty">
          No closed panels
        </div>
        <div
          v-for="id in closedContainers()"
          :key="id"
          class="ws-restore-item"
          @click="restoreContainer(id)"
        >
          <span class="ws-restore-icon">⊞</span>
          {{ titleFor(id) }}
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.cathode-workspace {
  flex: 1;
  position: relative;
  overflow: hidden;
  background: var(--cc-base, #0a1020);
  background-image:
    radial-gradient(circle at 20% 80%, rgba(55,90,127,0.04) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(0,188,140,0.03) 0%, transparent 50%);
}

/* dot grid */
.cathode-workspace::before {
  content: '';
  position: absolute; inset: 0;
  background-image:
    linear-gradient(var(--cc-grid-line, rgba(30,42,58,0.9)) 1px, transparent 1px),
    linear-gradient(90deg, var(--cc-grid-line, rgba(30,42,58,0.9)) 1px, transparent 1px);
  background-size: 40px 40px;
  opacity: 0.18;
  pointer-events: none;
}

.cathode-workspace-light::before { opacity: 0.06; }

/* ── Workspace toolbar ──────────────────────────────────────── */
.ws-toolbar {
  position: absolute;
  bottom: 12px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 5px 14px;
  background: var(--cc-header, #12122a);
  border: 1px solid var(--cc-border-2, #2a3a50);
  border-radius: 6px;
  z-index: 100;
  box-shadow: 0 4px 20px rgba(0,0,0,0.5);
}

.ws-btn {
  background: none;
  border: 1px solid var(--cc-border-2, #2a3a50);
  color: var(--cc-tx2, #7a90a8);
  font-family: monospace;
  font-size: 10px;
  letter-spacing: 0.06em;
  padding: 3px 10px;
  border-radius: 3px;
  cursor: pointer;
  text-transform: uppercase;
  white-space: nowrap;
}
.ws-btn:hover { border-color: var(--cc-accent-text, #40a0f0); color: var(--cc-accent-text, #40a0f0); }
.ws-btn-restore {
  background: rgba(64,160,240,0.07);
  border-color: rgba(64,160,240,0.35);
  color: var(--cc-accent-text, #40a0f0);
}

.ws-sep { width: 1px; height: 16px; background: var(--cc-border, #1e2a3a); }

/* ── Restore menu ───────────────────────────────────────────── */
.ws-restore-menu {
  position: absolute;
  bottom: 54px;
  left: 50%;
  transform: translateX(-50%);
  background: var(--cc-header, #12122a);
  border: 1px solid var(--cc-border-2, #2a3a50);
  border-radius: 4px;
  padding: 8px;
  min-width: 180px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.5);
  z-index: 101;
}

.ws-restore-title {
  font-size: 9px;
  font-family: monospace;
  font-weight: bold;
  letter-spacing: 0.1em;
  color: var(--cc-tx3, #4a6a88);
  text-transform: uppercase;
  border-bottom: 1px solid var(--cc-border, #1e2a3a);
  padding-bottom: 5px;
  margin-bottom: 5px;
}

.ws-restore-empty {
  font-size: 10px;
  font-family: monospace;
  color: var(--cc-tx3, #4a6a88);
  padding: 4px 6px;
}

.ws-restore-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 5px 6px;
  border-radius: 2px;
  cursor: pointer;
  font-family: monospace;
  font-size: 11px;
  color: var(--cc-tx2, #7a90a8);
}
.ws-restore-item:hover { background: rgba(255,255,255,0.05); color: var(--cc-tx1, #c0d0e0); }
.ws-restore-icon { color: var(--cc-accent-text, #40a0f0); font-size: 11px; }

/* menu transition */
.menu-enter-active, .menu-leave-active { transition: opacity 0.15s, transform 0.15s; }
.menu-enter-from, .menu-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(6px);
}
</style>
