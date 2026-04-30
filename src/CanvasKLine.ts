/**
 * CanvasKLine.ts — canvas2d OHLCV candlestick renderer for cathode
 *
 * Draws candles + wicks + volume bars to an HTMLCanvasElement. The canvas
 * is fed to the same THREE.CanvasTexture + barrel-distortion shader as
 * CanvasGrid / CanvasLog so the visual style stays consistent.
 *
 * Pure render — viewport bounds (visible index range, price range) are
 * computed by the Vue wrapper from props + interaction state and passed
 * in. This function stays cheap on every frame.
 *
 * PR 1 scope: candles, wicks, volume. Crosshair, axes, zoom/pan are
 * deferred to PR 2.
 */

// ── Types ─────────────────────────────────────────────────────────────────────

/**
 * OHLCV candle — same shape as the dashboard's `Candle` interface.
 * `start` is ms epoch (or any monotonic key — we don't decode it here).
 */
export interface OHLCVCandle {
  start:  number
  open:   number
  high:   number
  low:    number
  close:  number
  volume: number
}

// ── Theme palettes ────────────────────────────────────────────────────────────

export interface KLineColors {
  bg:           string
  /** Body fill for bullish candles (close ≥ open). */
  candleBull:   string
  /** Body fill for bearish candles (close < open). */
  candleBear:   string
  /** Wick / outline for bullish candles. */
  wickBull:     string
  wickBear:     string
  /** Volume bar fill (semi-transparent). */
  volumeBull:   string
  volumeBear:   string
  /** Subtle gridline / axis colour for future use (PR 2). */
  gridline:     string
  /** Default text colour. */
  text:         string
  /** Highlight (e.g. crosshair, selected candle). */
  accent:       string
}

export const KLINE_THEME_COLORS: Record<string, KLineColors> = {
  none: {
    // bg fully transparent so the parent (glass CathodeContainer) shows
    // through. Same propagation pattern as CanvasGrid / CanvasLog `none`.
    bg:         'rgba(0,0,0,0)',
    candleBull: '#26a69a',
    candleBear: '#ef5350',
    wickBull:   '#26a69a',
    wickBear:   '#ef5350',
    volumeBull: 'rgba(38,166,154,0.45)',
    volumeBear: 'rgba(239,83,80,0.45)',
    gridline:   'rgba(255,255,255,0.06)',
    text:       '#c0d0e0',
    accent:     '#40a0f0',
  },
  paper: {
    bg:         'rgba(0,0,0,0)',
    candleBull: '#1a8038',
    candleBear: '#c0392b',
    wickBull:   '#1a8038',
    wickBear:   '#c0392b',
    volumeBull: 'rgba(26,128,56,0.30)',
    volumeBear: 'rgba(192,57,43,0.30)',
    gridline:   'rgba(0,0,0,0.06)',
    text:       '#222222',
    accent:     '#158cba',
  },
  phosphor: {
    bg:         '#060d06',
    candleBull: '#33ff33',
    candleBear: '#ff5050',
    wickBull:   '#33ff33',
    wickBear:   '#ff5050',
    volumeBull: 'rgba(51,255,51,0.35)',
    volumeBear: 'rgba(255,80,80,0.35)',
    gridline:   'rgba(51,255,51,0.10)',
    text:       '#33ff33',
    accent:     '#80ff80',
  },
  amber: {
    bg:         '#0a0700',
    candleBull: '#ffd060',
    candleBear: '#ff5000',
    wickBull:   '#ffd060',
    wickBear:   '#ff5000',
    volumeBull: 'rgba(255,208,96,0.35)',
    volumeBear: 'rgba(255,80,0,0.35)',
    gridline:   'rgba(255,176,0,0.10)',
    text:       '#ffb000',
    accent:     '#ffd060',
  },
}

// ── Layout constants ──────────────────────────────────────────────────────────

/** Default split — top portion is price, bottom is volume. 0..1. */
export const DEFAULT_VOLUME_FRACTION = 0.18

/** Pixel padding around the chart inside the canvas. */
export const PADDING_TOP    = 8
export const PADDING_BOTTOM = 8
export const PADDING_LEFT   = 8
export const PADDING_RIGHT  = 8

/** Pixel gap between the price pane and the volume pane. */
export const PANE_GAP = 4

/** Minimum candle body width (px). Candles narrower than this are 1px lines. */
export const MIN_CANDLE_WIDTH = 1

/** Wick stroke width (px). */
export const WICK_WIDTH = 1

// ── Visible window + price bounds ─────────────────────────────────────────────

/**
 * Compute the visible candle range for a given canvas width and slot count.
 * `firstIdx` is the leftmost visible candle index. Negative slots are clamped.
 */
export interface VisibleWindow {
  firstIdx: number
  count:    number
  /** px reserved per candle slot (body + spacing). */
  slotW:    number
}

export function computeVisibleWindow(
  totalCandles: number,
  canvasW:      number,
  slotW:        number,
  scrollX = 0,
): VisibleWindow {
  const usableW   = Math.max(0, canvasW - PADDING_LEFT - PADDING_RIGHT)
  const maxSlots  = Math.max(1, Math.floor(usableW / slotW))
  const count     = Math.min(maxSlots, totalCandles)
  // Default: stick to the right edge (most recent candle visible).
  const firstIdx  = Math.max(0, totalCandles - count - Math.floor(scrollX / slotW))
  return { firstIdx, count, slotW }
}

/**
 * Compute the price min/max across the visible candles. Used to scale the
 * price axis so all visible wicks fit. Adds a small head/tail-room so candles
 * don't touch the pane edges.
 */
export interface PriceBounds {
  min:    number
  max:    number
  /** Whichever the largest volume in the visible window is — drives volume scaling. */
  maxVol: number
}

export function computePriceBounds(
  candles: OHLCVCandle[],
  firstIdx: number,
  count:    number,
): PriceBounds {
  if (!candles.length || count <= 0) {
    return { min: 0, max: 1, maxVol: 1 }
  }
  let lo = Infinity, hi = -Infinity, mv = 0
  const last = Math.min(candles.length, firstIdx + count)
  for (let i = firstIdx; i < last; i++) {
    const c = candles[i]
    if (!c) continue
    if (c.low  < lo) lo = c.low
    if (c.high > hi) hi = c.high
    if (c.volume > mv) mv = c.volume
  }
  if (!isFinite(lo) || !isFinite(hi) || lo === hi) {
    // Degenerate — emit a tiny synthetic range so divisions don't blow up.
    const mid = isFinite(lo) ? lo : 0
    return { min: mid - 1, max: mid + 1, maxVol: Math.max(1, mv) }
  }
  // 4% head/tail room
  const pad = (hi - lo) * 0.04
  return { min: lo - pad, max: hi + pad, maxVol: Math.max(1, mv) }
}

// ── Pane geometry ─────────────────────────────────────────────────────────────

/**
 * Resolve the price + volume pane rectangles from the canvas height and a
 * volume fraction. Each pane is { y0, y1 } in canvas coords (y grows down).
 */
export interface PaneLayout {
  priceY0:  number
  priceY1:  number
  volumeY0: number
  volumeY1: number
}

export function computePaneLayout(canvasH: number, volumeFraction: number): PaneLayout {
  const usableH = Math.max(1, canvasH - PADDING_TOP - PADDING_BOTTOM - PANE_GAP)
  const volH    = Math.max(0, Math.round(usableH * volumeFraction))
  const priceH  = usableH - volH
  return {
    priceY0:  PADDING_TOP,
    priceY1:  PADDING_TOP + priceH,
    volumeY0: PADDING_TOP + priceH + PANE_GAP,
    volumeY1: PADDING_TOP + priceH + PANE_GAP + volH,
  }
}

// ── Coord helpers ─────────────────────────────────────────────────────────────

/** Map a price to a y-pixel within `[y0, y1]` given price bounds. */
export function priceToY(price: number, bounds: PriceBounds, y0: number, y1: number): number {
  const range = bounds.max - bounds.min
  if (range <= 0) return (y0 + y1) / 2
  // y grows down; high price → low y
  return y0 + (1 - (price - bounds.min) / range) * (y1 - y0)
}

/** Map a candle index to the centre x-pixel of its slot. */
export function indexToX(idx: number, firstIdx: number, slotW: number): number {
  return PADDING_LEFT + (idx - firstIdx + 0.5) * slotW
}

// ── Main draw ─────────────────────────────────────────────────────────────────

export interface DrawKLineOpts {
  candles:        OHLCVCandle[]
  /** Pixel width per candle slot (body + spacing). Driven by zoom level. */
  slotW:          number
  scrollX:        number
  theme:          string
  glow:           boolean
  showVolume:     boolean
  /** 0..1, fraction of pane reserved for the volume bars. */
  volumeFraction: number
}

export function drawKLine(canvas: HTMLCanvasElement, opts: DrawKLineOpts): void {
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const W = canvas.width
  const H = canvas.height
  const c = KLINE_THEME_COLORS[opts.theme] ?? KLINE_THEME_COLORS['none']

  // Background
  ctx.clearRect(0, 0, W, H)
  ctx.fillStyle = c.bg
  ctx.fillRect(0, 0, W, H)

  if (!opts.candles.length) return

  ctx.save()
  ctx.beginPath()
  ctx.rect(0, 0, W, H)
  ctx.clip()

  // Visible window
  const win    = computeVisibleWindow(opts.candles.length, W, opts.slotW, opts.scrollX)
  const bounds = computePriceBounds(opts.candles, win.firstIdx, win.count)
  const panes  = computePaneLayout(H, opts.showVolume ? opts.volumeFraction : 0)

  // Candle body width — leave 30% of slot as gap, capped at min 1px.
  const bodyW = Math.max(MIN_CANDLE_WIDTH, Math.floor(opts.slotW * 0.7))

  const last = Math.min(opts.candles.length, win.firstIdx + win.count)
  for (let i = win.firstIdx; i < last; i++) {
    const k = opts.candles[i]
    if (!k) continue

    const x  = indexToX(i, win.firstIdx, opts.slotW)
    const yO = priceToY(k.open,  bounds, panes.priceY0, panes.priceY1)
    const yC = priceToY(k.close, bounds, panes.priceY0, panes.priceY1)
    const yH = priceToY(k.high,  bounds, panes.priceY0, panes.priceY1)
    const yL = priceToY(k.low,   bounds, panes.priceY0, panes.priceY1)

    const bullish = k.close >= k.open
    const wickColor = bullish ? c.wickBull   : c.wickBear
    const bodyColor = bullish ? c.candleBull : c.candleBear

    if (opts.glow) { ctx.shadowBlur = 4; ctx.shadowColor = bodyColor }

    // Wick — single vertical line from high to low
    ctx.strokeStyle = wickColor
    ctx.lineWidth   = WICK_WIDTH
    ctx.beginPath()
    ctx.moveTo(Math.round(x) + 0.5, yH)
    ctx.lineTo(Math.round(x) + 0.5, yL)
    ctx.stroke()

    // Body — rect from yOpen to yClose, centred on x
    ctx.fillStyle = bodyColor
    const bodyTop    = Math.min(yO, yC)
    const bodyHeight = Math.max(1, Math.abs(yC - yO))
    ctx.fillRect(
      Math.round(x - bodyW / 2),
      Math.round(bodyTop),
      bodyW,
      Math.round(bodyHeight),
    )

    ctx.shadowBlur = 0

    // Volume bar — proportional to k.volume / bounds.maxVol
    if (opts.showVolume && bounds.maxVol > 0) {
      const volH = Math.round((k.volume / bounds.maxVol) * (panes.volumeY1 - panes.volumeY0))
      if (volH > 0) {
        ctx.fillStyle = bullish ? c.volumeBull : c.volumeBear
        ctx.fillRect(
          Math.round(x - bodyW / 2),
          panes.volumeY1 - volH,
          bodyW,
          volH,
        )
      }
    }
  }

  ctx.restore()
}
