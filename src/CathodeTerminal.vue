<script setup lang="ts">
/**
 * CathodeTerminal — CathodeLog scrollback + a command-prompt input row.
 *
 * Pure UI component. The consumer owns the command-handling: when the user
 * submits, this emits `submit` with the entered string; the consumer is
 * responsible for echoing the command into `entries` (or not) and for
 * pushing the response back as a new entry.
 *
 * History navigation: ↑ / ↓ cycle through prior submitted commands. The
 * history is internal (capped at `historyLimit`) — it is NOT derived from
 * `entries`, since the consumer might choose not to echo every submit.
 *
 * Designed as a sibling to CathodeLog, not a fork — the scrollback IS a
 * `<CathodeLog>` instance that handles all the canvas / barrel / wrap
 * rendering. We just stack an input row underneath.
 */
import { ref, computed, onMounted } from 'vue'
import type { CSSProperties } from 'vue'
import CathodeLog from './CathodeLog.vue'
import { LOG_THEME_COLORS, type LogEntry } from './CanvasLog'
import './cathode.css'

// ── Props ─────────────────────────────────────────────────────────────────────

const props = withDefaults(defineProps<{
  /** Scrollback entries — same shape as CathodeLog. Consumer-owned. */
  entries:        LogEntry[]
  /** 'none' inherits parent CSS vars; built-ins: phosphor | amber | paper. */
  theme?:         'none' | 'phosphor' | 'amber' | 'paper'
  /** 0–45 barrel-distortion strength (forwarded to CathodeLog). */
  curvature?:     number
  scanlines?:     boolean
  glow?:          boolean
  /** Show/hide the timestamp column on scrollback entries. */
  showTimestamps?: boolean
  formatTs?:      (ts: number | string) => string
  wordWrap?:      boolean
  /** Stick to bottom on new entries unless the user has scrolled up. */
  autoscroll?:    boolean
  /** Ring-buffer cap on rendered entries (forwarded to CathodeLog). 0 = no cap. */
  maxLines?:      number

  // Terminal-specific
  /** Prefix shown before the input (e.g. "→ ", "$ ", "> "). */
  prompt?:        string
  /** Placeholder text in the empty input. */
  placeholder?:   string
  /** When true, the input is read-only and submit is disabled. */
  disabled?:      boolean
  /** When true, render a spinner/dim state — useful while awaiting a response. */
  busy?:          boolean
  /** Max number of submitted commands kept for ↑/↓ history. */
  historyLimit?:  number
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
  placeholder:    'type a command…',
  disabled:       false,
  busy:           false,
  historyLimit:   100,
})

const emit = defineEmits<{
  /** Fired when the user presses Enter. The consumer decides what to do
   *  with the command (echo it, send it to a backend, etc.). */
  submit: [command: string]
}>()

// ── Input state ──────────────────────────────────────────────────────────────

const inputEl  = ref<HTMLInputElement | null>(null)
const draft    = ref('')

// History — simple ring buffer of submitted commands. `historyIdx` is -1
// when not browsing; ≥0 when the user has pressed ↑.
const history     = ref<string[]>([])
const historyIdx  = ref(-1)
/** Snapshot of the in-progress draft when the user starts browsing history,
 *  so ↓ past the most recent entry restores what they were typing. */
let draftSnapshot = ''

function pushHistory(cmd: string) {
  // Skip empties + dedupe consecutive
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
    if (!cmd.trim()) return
    pushHistory(cmd)
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
      // Past the last history entry — restore the in-progress draft
      historyIdx.value = -1
      draft.value      = draftSnapshot
      draftSnapshot    = ''
    }
    return
  }
}

// ── Theme bridge: borrow the log palette so the input matches the scrollback ──

const themeC = computed(() => LOG_THEME_COLORS[props.theme] ?? LOG_THEME_COLORS['none'])

const inputStyle = computed<CSSProperties>(() => ({
  color:        themeC.value.text,
  caretColor:   themeC.value.text,
  // Subtle bottom border in the theme's accent (gridline) colour
  borderColor:  themeC.value.border,
  background:   'transparent',
}))

const promptStyle = computed<CSSProperties>(() => ({
  color: themeC.value.text,
  opacity: props.disabled || props.busy ? 0.5 : 1,
}))

// ── Public API ────────────────────────────────────────────────────────────────

function focus() {
  inputEl.value?.focus()
}

defineExpose({ focus })

onMounted(() => {
  // Auto-focus on mount when not disabled — feels like a real terminal
  if (!props.disabled) requestAnimationFrame(() => inputEl.value?.focus())
})
</script>

<template>
  <div class="cathode-terminal-wrap">
    <!-- Scrollback fills remaining space -->
    <div class="cathode-terminal-scrollback">
      <CathodeLog
        :entries="entries"
        :theme="theme"
        :curvature="curvature"
        :scanlines="scanlines"
        :glow="glow"
        :show-timestamps="showTimestamps"
        :format-ts="formatTs"
        :word-wrap="wordWrap"
        :autoscroll="autoscroll"
        :max-lines="maxLines"
      />
    </div>

    <!-- Input row pinned to bottom -->
    <div class="cathode-terminal-inputrow" :style="{ borderTopColor: themeC.border }">
      <span class="cathode-terminal-prompt" :style="promptStyle" data-testid="ct-prompt">{{ prompt }}</span>
      <input
        ref="inputEl"
        v-model="draft"
        :placeholder="busy ? '…' : placeholder"
        :disabled="disabled || busy"
        :style="inputStyle"
        class="cathode-terminal-input"
        spellcheck="false"
        autocomplete="off"
        autocorrect="off"
        autocapitalize="off"
        type="text"
        data-testid="ct-input"
        @keydown="onKey"
      />
      <span v-if="busy" class="cathode-terminal-spinner" :style="{ color: themeC.text }">▮</span>
    </div>
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
}

.cathode-terminal-scrollback {
  flex: 1;
  min-height: 0;   /* lets the inner CathodeLog actually shrink */
  display: flex;
  flex-direction: column;
}

.cathode-terminal-inputrow {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  border-top: 1px solid;
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  font-size: 13px;
  flex-shrink: 0;
  /* Give a touch of vertical breathing room without overpowering the scrollback */
  min-height: 26px;
}

.cathode-terminal-prompt {
  flex-shrink: 0;
  white-space: pre;
  user-select: none;
}

.cathode-terminal-input {
  flex: 1;
  background: transparent;
  border: 0;
  outline: none;
  font: inherit;
  color: inherit;
  padding: 0;
  /* keep the input visually flush with the prompt; no platform default styling */
  appearance: none;
}

.cathode-terminal-input::placeholder {
  opacity: 0.4;
}

.cathode-terminal-input:disabled {
  opacity: 0.5;
  cursor: progress;
}

.cathode-terminal-spinner {
  flex-shrink: 0;
  animation: ct-blink 1.1s steps(2, end) infinite;
}

@keyframes ct-blink {
  0%, 100% { opacity: 1; }
  50%      { opacity: 0; }
}
</style>
