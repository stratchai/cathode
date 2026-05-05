<script setup lang="ts">
/**
 * CathodeTerminal — CathodeLog scrollback with the prompt + draft rendered
 * INLINE as the last visible entry, like a real terminal. The prompt walks
 * down with the output; sparse content keeps the prompt right under the
 * last entry instead of pinned to the bottom of the panel.
 *
 * Implementation: a hidden HTML input captures keystrokes; the visible
 * "input" is the last "phantom" entry passed to the inner CathodeLog, so
 * the prompt + draft + cursor get the same barrel / scanline / glow
 * treatment as the rest of the scrollback. Click anywhere on the wrap
 * focuses the hidden input.
 *
 * The consumer still owns command handling: when the user presses Enter,
 * `submit` fires with the entered string. The consumer is responsible for
 * pushing the user line + response back into `entries` (or not).
 */
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'
import CathodeLog from './CathodeLog.vue'
import { type LogEntry } from './CanvasLog'
import './cathode.css'

// ── Props ─────────────────────────────────────────────────────────────────────

const props = withDefaults(defineProps<{
  /** Scrollback entries — same shape as CathodeLog. Consumer-owned. */
  entries:        LogEntry[]
  /** 'none' inherits parent CSS vars; built-ins: phosphor | amber | paper. */
  theme?:         'none' | 'phosphor' | 'amber' | 'paper'
  curvature?:     number
  scanlines?:     boolean
  glow?:          boolean
  /** Show/hide the timestamp column on scrollback entries (the prompt row
   *  never carries a timestamp regardless). */
  showTimestamps?: boolean
  formatTs?:      (ts: number | string) => string
  wordWrap?:      boolean
  autoscroll?:    boolean
  maxLines?:      number

  // Terminal-specific
  /** Prefix shown before the input (e.g. "→ ", "$ ", "> "). */
  prompt?:        string
  /** When true, the input is read-only and submit is disabled. */
  disabled?:      boolean
  /** When true, the cursor stops blinking and shows a steady block —
   *  useful while awaiting a response. */
  busy?:          boolean
  /** Max number of submitted commands kept for ↑/↓ history. */
  historyLimit?:  number
  /**
   * Hover-lens magnify. Forwarded straight to the underlying CathodeLog
   * since the terminal renders through it — no separate implementation
   * needed. Same circle, same shader pipeline.
   */
  magnify?:       boolean
}>(), {
  theme:          'none',
  curvature:      25,
  scanlines:      true,
  glow:           true,
  showTimestamps: true,
  wordWrap:       true,
  autoscroll:     true,
  maxLines:       0,
  prompt:         '→ ',
  disabled:       false,
  busy:           false,
  historyLimit:   100,
  magnify:        false,
})

const emit = defineEmits<{
  submit: [command: string]
}>()

// ── Input state ──────────────────────────────────────────────────────────────

const wrapEl  = ref<HTMLDivElement | null>(null)
const inputEl = ref<HTMLInputElement | null>(null)
const draft   = ref('')

const history     = ref<string[]>([])
const historyIdx  = ref(-1)
let draftSnapshot = ''

function pushHistory(cmd: string) {
  if (!cmd.trim()) return
  if (history.value.length && history.value[history.value.length - 1] === cmd) return
  history.value.push(cmd)
  if (history.value.length > props.historyLimit) {
    history.value.splice(0, history.value.length - props.historyLimit)
  }
}

function onKey(e: KeyboardEvent) {
  if (props.disabled) return
  if (e.key === 'Enter') {
    e.preventDefault()
    const cmd = draft.value
    // Always emit, even on empty — real terminals drop a fresh prompt
    // line when you press Enter alone. Consumer decides what to do
    // with the empty command (most just echo the prompt and move on).
    // Skip pushing empties to history though — recalling an empty
    // command via ↑ is useless.
    if (cmd.trim()) pushHistory(cmd)
    historyIdx.value = -1
    draft.value      = ''
    emit('submit', cmd)
    return
  }
  if (e.key === 'ArrowUp') {
    if (!history.value.length) return
    e.preventDefault()
    if (historyIdx.value === -1) {
      draftSnapshot    = draft.value
      historyIdx.value = history.value.length - 1
    } else if (historyIdx.value > 0) {
      historyIdx.value--
    }
    draft.value = history.value[historyIdx.value]
    return
  }
  if (e.key === 'ArrowDown') {
    if (historyIdx.value === -1) return
    e.preventDefault()
    if (historyIdx.value < history.value.length - 1) {
      historyIdx.value++
      draft.value = history.value[historyIdx.value]
    } else {
      historyIdx.value = -1
      draft.value      = draftSnapshot
      draftSnapshot    = ''
    }
    return
  }
}

// ── Cursor blink — toggled via interval, included in the phantom entry ──────

const cursorVisible = ref(true)
let blinkTimer: ReturnType<typeof setInterval> | null = null

function startBlink() {
  if (blinkTimer) return
  blinkTimer = setInterval(() => { cursorVisible.value = !cursorVisible.value }, 530)
}
function stopBlink() {
  if (blinkTimer) { clearInterval(blinkTimer); blinkTimer = null }
  cursorVisible.value = true   // ensure block is rendered while idle
}

// ── Phantom entry — the prompt + draft + cursor as the last "log entry" ─────

const promptEntry = computed<LogEntry>(() => {
  // Full block (U+2588) — same width as a monospace character cell, so the
  // cursor looks the right size at any zoom. Earlier U+25AE rendered narrow.
  // Steady block while busy (no blink) so the spinner-like state is obvious;
  // empty space while disabled (no editable input).
  let cursor: string
  if (props.disabled)      cursor = ' '
  else if (props.busy)     cursor = '█'
  else                     cursor = cursorVisible.value ? '█' : ' '
  return { level: 'info', text: `${props.prompt}${draft.value}${cursor}` }
})

const displayEntries = computed<LogEntry[]>(() =>
  [...props.entries, promptEntry.value],
)

// ── Click-anywhere focuses the hidden input ─────────────────────────────────

function onWrapClick() {
  if (props.disabled) return
  inputEl.value?.focus()
}

// Restore focus when `busy` falls back to false. Toggling the input's
// `disabled` attribute (when busy goes true) kicks focus off the element;
// without this watcher the user has to click again to keep typing — not
// how a real terminal works (Enter alone, repeatedly, should keep going).
watch(() => props.busy, (busy, prev) => {
  if (prev && !busy && !props.disabled) {
    nextTick(() => inputEl.value?.focus())
  }
})

// ── Public API ──────────────────────────────────────────────────────────────

function focus() {
  inputEl.value?.focus()
}

defineExpose({ focus })

onMounted(() => {
  startBlink()
  if (!props.disabled) requestAnimationFrame(() => inputEl.value?.focus())
})

onUnmounted(() => {
  stopBlink()
})
</script>

<template>
  <div
    ref="wrapEl"
    class="cathode-terminal-wrap"
    @click="onWrapClick"
  >
    <CathodeLog
      :entries="displayEntries"
      :theme="theme"
      :curvature="curvature"
      :scanlines="scanlines"
      :glow="glow"
      :magnify="magnify"
      :show-timestamps="showTimestamps"
      :format-ts="formatTs"
      :word-wrap="wordWrap"
      :autoscroll="autoscroll"
      :max-lines="maxLines"
    />

    <!-- Hidden input — captures keystrokes, never shown. The visible
         "input" is the last entry on the canvas above. We size it so it
         still receives focus reliably (zero-size inputs are flaky in
         some browsers) but render it transparent and out of the layout
         flow's hit region. -->
    <input
      ref="inputEl"
      v-model="draft"
      :disabled="disabled || busy"
      class="cathode-terminal-input-hidden"
      spellcheck="false"
      autocomplete="off"
      autocorrect="off"
      autocapitalize="off"
      type="text"
      data-testid="ct-input"
      @keydown="onKey"
    />
  </div>
</template>

<style scoped>
.cathode-terminal-wrap {
  position: relative;
  display: flex;
  flex-direction: column;
  width:  100%;
  height: 100%;
  overflow: hidden;
  cursor: text;   /* hint: clicking anywhere will focus the input */
}

/* Hidden input — out of layout, transparent, but still focusable. We avoid
   `display:none`/`visibility:hidden` since both prevent focus + caret. */
.cathode-terminal-input-hidden {
  position: absolute;
  left: 0;
  bottom: 0;
  width:  1px;
  height: 1px;
  padding: 0;
  margin:  0;
  border:  0;
  outline: 0;
  background: transparent;
  color:      transparent;
  caret-color: transparent;
  /* Behind the canvas — clicks on the wrap go to onWrapClick which focuses
     this. Keystrokes still land here once focused. */
  z-index: 0;
  /* iOS/Safari sometimes scroll into view aggressively on focus — pin it
     so the panel can't get nudged. */
  pointer-events: none;
}
</style>
