/**
 * CanvasLog.ts — canvas2d log/terminal renderer for cathode
 *
 * Draws a scrolling log feed (entries with optional timestamps + levels) to an
 * HTMLCanvasElement. The canvas is fed to the same THREE.CanvasTexture +
 * barrel-distortion shader as CanvasGrid for visual consistency.
 *
 * Pure render — wrapping & layout are computed by the Vue wrapper and passed
 * in as `visualLines`, so this function stays cheap on every frame.
 */

// ── Types ─────────────────────────────────────────────────────────────────────

export type LogLevel = 'info' | 'warn' | 'error' | 'debug' | 'success'

export interface LogEntry {
  /** Optional timestamp — number = ms epoch, string = pre-formatted or ISO. */
  ts?:    number | string
  /** The line text. May contain \n (treated as hard line break). */
  text:   string
  /** Drives text colour. Defaults to 'info'. */
  level?: LogLevel
}

/**
 * One visible row after wrapping. Multi-line entries produce N visual lines;
 * only the first carries the timestamp string (others align under it).
 */
export interface VisualLine {
  entryIdx:    number
  text:        string
  level:       LogLevel
  timestamp:   string    // empty on continuation lines
  isFirstFrag: boolean   // true on the first wrapped fragment of an entry
  widthPx:     number    // measured text width — drives horizontal scroll bound
}

// ── Theme palettes ────────────────────────────────────────────────────────────

export interface LogColors {
  bg:           string
  text:         string
  border:       string
  accent:       string
  rowAlt:       string
  levelInfo:    string
  levelWarn:    string
  levelError:   string
  levelDebug:   string
  levelSuccess: string
  timestamp:    string
  /** Optional override for the selection-row tint. Default if missing. */
  selection?:   string
}

export const LOG_THEME_COLORS: Record<string, LogColors> = {
  none: {
    // bg fully transparent so the parent (glass CathodeContainer) shows
    // through. Same propagation pattern as CanvasGrid's `none` theme.
    // Brightened 2026-05-01: levelInfo, levelDebug, timestamp were too
    // muted — read as washed-out under barrel + vignette.
    bg: 'rgba(0,0,0,0)',
    text:         '#f0f8ff',
    border:       '#2a3a50',
    accent:       '#60c0ff',
    rowAlt:       'rgba(255,255,255,0.018)',
    levelInfo:    '#e0eaf4',
    levelWarn:    '#ffd890',
    levelError:   '#ff9a9a',
    levelDebug:   '#a0b8d0',
    levelSuccess: '#a0e8c0',
    timestamp:    '#90b8d8',
  },
  paper: {
    // bg fully transparent for day-mode glass propagation.
    bg: 'rgba(0,0,0,0)',
    text:         '#222222',
    border:       '#dee2e6',
    accent:       '#158cba',
    // Black at 2% — invisible on dark bg, barely-there shading on light.
    // The previous accent-blue at 4% read as harsh bands across each
    // entry on a paper-light surface (visible above ~3% alpha on white).
    rowAlt:       'rgba(0,0,0,0.020)',
    levelInfo:    '#444444',
    levelWarn:    '#a06000',
    levelError:   '#c0392b',
    levelDebug:   '#888888',
    levelSuccess: '#1a8038',
    timestamp:    '#888888',
  },
  phosphor: {
    // Mixed-with-white phosphor — pure #33ff33 reads as muted green
    // under shader vignette. Lifting to a slightly off-white green
    // gives the proper "burn through the screen" CRT phosphor look.
    bg:           '#060d06',
    text:         '#80ff80',
    border:       '#0a250a',
    accent:       '#a0ffa0',
    rowAlt:       'rgba(51,255,51,0.025)',
    levelInfo:    '#80ff80',
    levelWarn:    '#d0ff60',
    levelError:   '#ff8080',
    levelDebug:   '#5fcc5f',
    levelSuccess: '#80ffa0',
    timestamp:    '#60dd60',
  },
  amber: {
    bg:           '#0a0700',
    text:         '#ffd060',
    border:       '#2a1500',
    accent:       '#ffe080',
    rowAlt:       'rgba(255,176,0,0.025)',
    levelInfo:    '#ffd060',
    levelWarn:    '#ffe040',
    levelError:   '#ff7030',
    levelDebug:   '#cc9030',
    levelSuccess: '#ffe890',
    timestamp:    '#ffe080',
  },
}

export function levelColor(c: LogColors, level: LogLevel): string {
  switch (level) {
    case 'warn':    return c.levelWarn
    case 'error':   return c.levelError
    case 'debug':   return c.levelDebug
    case 'success': return c.levelSuccess
    case 'info':
    default:        return c.levelInfo
  }
}

// ── Layout constants ──────────────────────────────────────────────────────────

export const FONT_SIZE   = 12
export const LINE_HEIGHT = 18      // px per visual line
export const PADDING_X   = 10
export const PADDING_Y   = 6

/** Monospace font for terminal aesthetic. */
export const FONT = `${FONT_SIZE}px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace`

// ── Word wrapping ─────────────────────────────────────────────────────────────

/**
 * Wrap a single string to fit within `maxWidth` (px) using `ctx` for measurement.
 * Hard \n breaks are honoured. Long unbroken tokens are sliced character-wise.
 */
export function wrapText(
  ctx:      CanvasRenderingContext2D,
  text:     string,
  maxWidth: number,
): string[] {
  if (maxWidth <= 0 || !text) return [text]
  const out: string[] = []

  for (const hardLine of text.split('\n')) {
    if (!hardLine) { out.push(''); continue }
    if (ctx.measureText(hardLine).width <= maxWidth) {
      out.push(hardLine)
      continue
    }

    const words = hardLine.split(/(\s+)/)   // keep whitespace tokens
    let current = ''
    for (const tok of words) {
      const candidate = current + tok
      if (ctx.measureText(candidate).width <= maxWidth) {
        current = candidate
      } else {
        if (current) {
          out.push(current.replace(/\s+$/, ''))
          current = ''
        }
        // Token alone exceeds maxWidth — slice character-wise
        if (ctx.measureText(tok).width > maxWidth) {
          let frag = ''
          for (const ch of tok) {
            if (ctx.measureText(frag + ch).width > maxWidth) {
              if (frag) out.push(frag)
              frag = ch
            } else {
              frag += ch
            }
          }
          current = frag
        } else {
          current = tok.replace(/^\s+/, '')   // drop leading whitespace on new line
        }
      }
    }
    if (current) out.push(current.replace(/\s+$/, ''))
  }

  return out.length ? out : ['']
}

// ── Timestamp formatting ──────────────────────────────────────────────────────

/** Default formatter — HH:mm:ss for numeric ms epoch, raw string otherwise. */
export function defaultFormatTs(ts: number | string): string {
  if (typeof ts === 'number') {
    const d = new Date(ts)
    const hh = String(d.getHours()).padStart(2, '0')
    const mm = String(d.getMinutes()).padStart(2, '0')
    const ss = String(d.getSeconds()).padStart(2, '0')
    return `${hh}:${mm}:${ss}`
  }
  return ts
}

/**
 * Compute pixel width of the widest formatted timestamp + a small gap.
 * Used by the Vue wrapper to reserve a column on the left when timestamps
 * are enabled.
 */
export function measureTimestampWidth(
  ctx:    CanvasRenderingContext2D,
  sample: string,
): number {
  return Math.ceil(ctx.measureText(sample).width) + 12
}

// ── Build visual lines (called by the Vue wrapper) ────────────────────────────

export interface BuildVisualLinesOpts {
  entries:        LogEntry[]
  ctx:            CanvasRenderingContext2D
  textMaxWidth:   number   // px available for the text column (after timestamp prefix)
  showTimestamps: boolean
  formatTs?:      (ts: number | string) => string
  wordWrap:       boolean
}

export function buildVisualLines(opts: BuildVisualLinesOpts): VisualLine[] {
  const { entries, ctx, textMaxWidth, showTimestamps, wordWrap } = opts
  const fmt = opts.formatTs ?? defaultFormatTs

  // Use the monospace font we'll render with so wrap math is accurate
  ctx.font = FONT

  const out: VisualLine[] = []

  for (let i = 0; i < entries.length; i++) {
    const e = entries[i]
    const lvl: LogLevel = e.level ?? 'info'
    const ts = showTimestamps && e.ts != null ? fmt(e.ts) : ''

    const frags = wordWrap
      ? wrapText(ctx, e.text, textMaxWidth)
      : e.text.split('\n')

    for (let f = 0; f < frags.length; f++) {
      out.push({
        entryIdx:    i,
        text:        frags[f],
        level:       lvl,
        timestamp:   f === 0 ? ts : '',
        isFirstFrag: f === 0,
        widthPx:     ctx.measureText(frags[f]).width,
      })
    }
  }

  return out
}

// ── Main draw ─────────────────────────────────────────────────────────────────

export interface DrawLogOpts {
  visualLines:    VisualLine[]
  scrollY:        number       // px offset from top of content
  scrollX:        number       // px offset; non-zero only when wordWrap is off
  theme:          string
  glow:           boolean
  showTimestamps: boolean
  timestampWidth: number       // px reserved on the left for the timestamp column
  hoveredLine:    number       // index in visualLines, -1 = none
  /**
   * Inclusive selection range in visualLines indices. Both -1 = no selection.
   * Selected lines render with a stronger highlight (brand-tinted) than hover.
   */
  selectionStart: number
  selectionEnd:   number
}

export function drawLog(canvas: HTMLCanvasElement, opts: DrawLogOpts): void {
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const W = canvas.width
  const H = canvas.height
  const c = LOG_THEME_COLORS[opts.theme] ?? LOG_THEME_COLORS['none']

  // Background
  ctx.clearRect(0, 0, W, H)
  ctx.fillStyle = c.bg
  ctx.fillRect(0, 0, W, H)

  ctx.save()
  ctx.beginPath()
  ctx.rect(0, 0, W, H)
  ctx.clip()

  ctx.font         = FONT
  ctx.textBaseline = 'middle'

  const lines     = opts.visualLines
  // Horizontal scroll: shift the entire content row by -scrollX. Timestamps
  // and body text both move so the timestamp column stays aligned with the
  // text it labels (otherwise wide entries with long text would have their
  // timestamps still pinned at the left edge).
  const tsX       = PADDING_X - opts.scrollX
  const textX     = (opts.showTimestamps ? PADDING_X + opts.timestampWidth : PADDING_X) - opts.scrollX
  const startLine = Math.max(0, Math.floor((opts.scrollY - PADDING_Y) / LINE_HEIGHT))
  const endLine   = Math.min(lines.length, Math.ceil((opts.scrollY + H - PADDING_Y) / LINE_HEIGHT) + 1)

  for (let li = startLine; li < endLine; li++) {
    const line = lines[li]
    const y    = PADDING_Y + li * LINE_HEIGHT - opts.scrollY + LINE_HEIGHT / 2

    // Alternating-entry tint (subtle band per entry, not per visual line)
    if (line.entryIdx % 2 === 1 && line.isFirstFrag) {
      ctx.fillStyle = c.rowAlt
      // Fill all visual lines belonging to this entry — find the run length
      let run = 1
      while (li + run < endLine && lines[li + run].entryIdx === line.entryIdx) run++
      ctx.fillRect(0, y - LINE_HEIGHT / 2, W, LINE_HEIGHT * run)
    }

    // Selection highlight (drawn before hover so hover can layer on top
    // of an already-selected line). Selection uses a stronger fill so it
    // reads as "picked" rather than just "passing under cursor."
    if (opts.selectionStart >= 0 && li >= opts.selectionStart && li <= opts.selectionEnd) {
      ctx.fillStyle = c.selection ?? 'rgba(110, 231, 167, 0.16)'
      ctx.fillRect(0, y - LINE_HEIGHT / 2, W, LINE_HEIGHT)
    }

    // Hover highlight
    if (li === opts.hoveredLine) {
      ctx.fillStyle = 'rgba(255,255,255,0.045)'
      ctx.fillRect(0, y - LINE_HEIGHT / 2, W, LINE_HEIGHT)
    }

    // Timestamp column (only on first fragment of an entry)
    if (opts.showTimestamps && line.timestamp) {
      ctx.fillStyle = c.timestamp
      ctx.textAlign = 'left'
      // Bumped from 3 → 6: stronger phosphor halation makes timestamps
    // read as luminous rather than just tinted, especially under the
    // shader's barrel + vignette which otherwise eats apparent brightness.
    if (opts.glow) { ctx.shadowBlur = 6; ctx.shadowColor = c.timestamp }
      ctx.fillText(line.timestamp, tsX, y)
      ctx.shadowBlur = 0
    }

    // Body text — coloured by level
    const color = levelColor(c, line.level)
    ctx.fillStyle = color
    ctx.textAlign = 'left'
    if (opts.glow) {
      // Three-pass glow — wide halation, mid bloom, then sharp text on
      // top. Each pass deposits more light into the halo around the
      // glyph; the final pass restores edge definition. Effect: text
      // reads as luminous CRT phosphor, not just tinted.
      ctx.shadowColor = color
      ctx.shadowBlur  = 14
      ctx.fillText(line.text, textX, y)
      ctx.shadowBlur  = 7
      ctx.fillText(line.text, textX, y)
      ctx.shadowBlur  = 3
      ctx.fillText(line.text, textX, y)
      ctx.shadowBlur = 0
    } else {
      ctx.fillText(line.text, textX, y)
    }
  }

  ctx.restore()
}

// ── Hit-testing ───────────────────────────────────────────────────────────────

/**
 * Map a canvas-space y-coordinate to the visual-line index. Returns -1 when
 * outside the rendered range.
 */
export function lineHitTest(
  cy:          number,
  scrollY:     number,
  visibleLen:  number,
): number {
  if (cy < 0) return -1
  const li = Math.floor((cy + scrollY - PADDING_Y) / LINE_HEIGHT)
  if (li < 0 || li >= visibleLen) return -1
  return li
}

// ── Geometry helpers ──────────────────────────────────────────────────────────

export function totalContentHeight(visualLineCount: number): number {
  return PADDING_Y * 2 + visualLineCount * LINE_HEIGHT
}
