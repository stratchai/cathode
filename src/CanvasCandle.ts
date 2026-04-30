/**
 * CanvasCandle.ts — canvas2d OHLCV candlestick renderer for cathode
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

// ── Price-pane overlays ──────────────────────────────────────────────────────
//
// Generic rendering primitives for indicator series drawn over the candle
// chart. Cathode does NOT compute indicators — consumers (e.g. dashboard)
// pass precomputed series in `data` arrays aligned to `candles` by index.
// Use NaN for points where the indicator is undefined (e.g. the first 19
// values of a 20-period SMA).

/** Single-line overlay (e.g. fast EMA, slow EMA, SMA50, midline). */
export interface PriceOverlayLine {
  kind:       'line'
  /** y-values aligned to candles[] by index. NaN = gap. */
  data:       number[]
  color:      string
  lineWidth?: number
  /** Dashed line if true (e.g. for indicator midline). */
  dashed?:    boolean
  /** Optional label — used for legend / hover (PR3+). */
  label?:     string
}

/** Two-line band overlay (e.g. Bollinger Bands, Donchian Channel, Keltner). */
export interface PriceOverlayBand {
  kind:           'band'
  /** Upper edge values, aligned to candles[]. NaN = gap. */
  upper:          number[]
  lower:          number[]
  /** Optional middle line (e.g. Bollinger SMA20). */
  middle?:        number[]
  color:          string
  /** 0..1 fill alpha for the band area. Default 0.08. */
  fillAlpha?:     number
  /** Render the middle line as dashed (default true). */
  middleDashed?:  boolean
  label?:         string
}

export type PriceOverlay = PriceOverlayLine | PriceOverlayBand

// ── Trade markers ────────────────────────────────────────────────────────────

/**
 * Triangle annotation at a (timestamp, price) point on the price pane.
 * Resolved to the nearest candle by start timestamp; if no candle within
 * one slot duration matches, the marker is dropped silently.
 */
export interface TradeMarker {
  timestamp: number
  price:     number
  kind:      'entry' | 'exit'
  /** Optional override colour; defaults to theme entry/exit colours. */
  color?:    string
  /** Optional label — drawn next to the marker (PR3+). */
  label?:    string
}

// ── Theme palettes ────────────────────────────────────────────────────────────

export interface CandleColors {
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
  /** Default trade-marker colours when not overridden by the marker itself. */
  markerEntry:  string
  markerExit:   string
}

export const CANDLE_THEME_COLORS: Record<string, CandleColors> = {
  none: {
    // bg fully transparent so the parent (glass CathodeContainer) shows
    // through. Same propagation pattern as CanvasGrid / CanvasLog `none`.
    bg:          'rgba(0,0,0,0)',
    candleBull:  '#26a69a',
    candleBear:  '#ef5350',
    wickBull:    '#26a69a',
    wickBear:    '#ef5350',
    volumeBull:  'rgba(38,166,154,0.45)',
    volumeBear:  'rgba(239,83,80,0.45)',
    gridline:    'rgba(255,255,255,0.06)',
    text:        '#c0d0e0',
    accent:      '#40a0f0',
    markerEntry: '#00cc55',
    markerExit:  '#e74c3c',
  },
  paper: {
    bg:          'rgba(0,0,0,0)',
    candleBull:  '#1a8038',
    candleBear:  '#c0392b',
    wickBull:    '#1a8038',
    wickBear:    '#c0392b',
    volumeBull:  'rgba(26,128,56,0.30)',
    volumeBear:  'rgba(192,57,43,0.30)',
    gridline:    'rgba(0,0,0,0.06)',
    text:        '#222222',
    accent:      '#158cba',
    markerEntry: '#1a9e3f',
    markerExit:  '#d93025',
  },
  phosphor: {
    bg:          '#060d06',
    candleBull:  '#33ff33',
    candleBear:  '#ff5050',
    wickBull:    '#33ff33',
    wickBear:    '#ff5050',
    volumeBull:  'rgba(51,255,51,0.35)',
    volumeBear:  'rgba(255,80,80,0.35)',
    gridline:    'rgba(51,255,51,0.10)',
    text:        '#33ff33',
    accent:      '#80ff80',
    markerEntry: '#80ff80',
    markerExit:  '#ff8080',
  },
  amber: {
    bg:          '#0a0700',
    candleBull:  '#ffd060',
    candleBear:  '#ff5000',
    wickBull:    '#ffd060',
    wickBear:    '#ff5000',
    volumeBull:  'rgba(255,208,96,0.35)',
    volumeBear:  'rgba(255,80,0,0.35)',
    gridline:    'rgba(255,176,0,0.10)',
    text:        '#ffb000',
    accent:      '#ffd060',
    markerEntry: '#ffe080',
    markerExit:  '#ff7030',
  },
}

// ── Layout constants ──────────────────────────────────────────────────────────

/** Default split — top portion is price, bottom is volume. 0..1. */
export const DEFAULT_VOLUME_FRACTION = 0.18

/** Pixel padding around the chart inside the canvas. */
export const PADDING_TOP    = 8
export const PADDING_BOTTOM = 22  // room for time-axis labels
export const PADDING_LEFT   = 8
export const PADDING_RIGHT  = 56  // room for price-axis labels

/** Font for axis + crosshair labels. */
const AXIS_FONT = '10px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace'

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

export interface DrawCandleOpts {
  candles:        OHLCVCandle[]
  /** Pixel width per candle slot (body + spacing). Driven by zoom level. */
  slotW:          number
  scrollX:        number
  theme:          string
  glow:           boolean
  showVolume:     boolean
  /** 0..1, fraction of pane reserved for the volume bars. */
  volumeFraction: number
  /** Mouse position in canvas coords; null = no crosshair. */
  hover:          { x: number; y: number } | null
}

/** Format a price for the right-axis label — fewer decimals at higher prices. */
function fmtPrice(p: number): string {
  if (p >= 10000) return p.toFixed(0)
  if (p >= 100)   return p.toFixed(1)
  if (p >= 1)     return p.toFixed(2)
  if (p >= 0.01)  return p.toFixed(4)
  return p.toFixed(6)
}

/** Format a ms-epoch timestamp for the bottom axis. Strips date if all
 *  visible labels share it; falls back to MM-DD HH:mm otherwise. */
function fmtTime(ts: number): string {
  const d = new Date(ts)
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  const hh = String(d.getHours()).padStart(2, '0')
  const mi = String(d.getMinutes()).padStart(2, '0')
  return `${mm}-${dd} ${hh}:${mi}`
}

/** Pick a "nice" step that puts ~5-7 labels in the given range. Steps follow
 *  a 1/2/5 cadence (..., 0.1, 0.2, 0.5, 1, 2, 5, 10, ...) for human-readable
 *  axis labels. Returns the price step. */
function niceStep(range: number, targetCount: number): number {
  if (range <= 0 || !isFinite(range)) return 1
  const rough = range / Math.max(1, targetCount)
  const pow10 = Math.pow(10, Math.floor(Math.log10(rough)))
  const norm  = rough / pow10
  let mult: number
  if      (norm < 1.5) mult = 1
  else if (norm < 3)   mult = 2
  else if (norm < 7)   mult = 5
  else                 mult = 10
  return mult * pow10
}

export function drawCandle(canvas: HTMLCanvasElement, opts: DrawCandleOpts): void {
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const W = canvas.width
  const H = canvas.height
  const c = CANDLE_THEME_COLORS[opts.theme] ?? CANDLE_THEME_COLORS['none']

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

  // ── Price axis (right edge) ─────────────────────────────────────────────────
  drawPriceAxis(ctx, c, bounds, panes, W)

  // ── Time axis (bottom edge) ─────────────────────────────────────────────────
  drawTimeAxis(ctx, c, opts.candles, win, opts.slotW, H)

  // ── Crosshair (only when hovering inside the chart area) ────────────────────
  if (opts.hover) {
    drawCrosshair(ctx, c, opts.candles, win, bounds, panes, opts.slotW, opts.hover, W)
  }

  ctx.restore()
}

// ── Axis drawing ──────────────────────────────────────────────────────────────

function drawPriceAxis(
  ctx:    CanvasRenderingContext2D,
  c:      CandleColors,
  bounds: PriceBounds,
  panes:  PaneLayout,
  W:      number,
): void {
  const range = bounds.max - bounds.min
  if (range <= 0) return
  const step      = niceStep(range, 6)
  const startTick = Math.ceil(bounds.min / step) * step

  ctx.font         = AXIS_FONT
  ctx.fillStyle    = c.text
  ctx.strokeStyle  = c.gridline
  ctx.textBaseline = 'middle'
  ctx.textAlign    = 'left'
  ctx.lineWidth    = 1
  ctx.globalAlpha  = 0.7

  for (let v = startTick; v <= bounds.max; v += step) {
    const y = priceToY(v, bounds, panes.priceY0, panes.priceY1)
    if (y < panes.priceY0 || y > panes.priceY1) continue
    // Subtle horizontal gridline across the price pane
    ctx.beginPath()
    ctx.moveTo(PADDING_LEFT, Math.round(y) + 0.5)
    ctx.lineTo(W - PADDING_RIGHT, Math.round(y) + 0.5)
    ctx.stroke()
    // Label flush to the right edge
    ctx.fillText(fmtPrice(v), W - PADDING_RIGHT + 4, y)
  }

  ctx.globalAlpha = 1
}

function drawTimeAxis(
  ctx:     CanvasRenderingContext2D,
  c:       CandleColors,
  candles: OHLCVCandle[],
  win:     VisibleWindow,
  slotW:   number,
  H:       number,
): void {
  if (win.count <= 0 || !candles.length) return
  // Aim for ~6 labels across the visible window
  const labelsTarget = 6
  const stepSlots    = Math.max(1, Math.floor(win.count / labelsTarget))

  ctx.font         = AXIS_FONT
  ctx.fillStyle    = c.text
  ctx.textBaseline = 'top'
  ctx.textAlign    = 'center'
  ctx.globalAlpha  = 0.7

  const last = Math.min(candles.length, win.firstIdx + win.count)
  for (let i = win.firstIdx; i < last; i += stepSlots) {
    const k = candles[i]
    if (!k) continue
    const x = indexToX(i, win.firstIdx, slotW)
    ctx.fillText(fmtTime(k.start), x, H - PADDING_BOTTOM + 4)
  }

  ctx.globalAlpha = 1
}

// ── Crosshair ─────────────────────────────────────────────────────────────────

function drawCrosshair(
  ctx:     CanvasRenderingContext2D,
  c:       CandleColors,
  candles: OHLCVCandle[],
  win:     VisibleWindow,
  bounds:  PriceBounds,
  panes:   PaneLayout,
  slotW:   number,
  hover:   { x: number; y: number },
  W:       number,
): void {
  // Snap horizontal line to the nearest candle centre. Vertical follows mouse.
  const slotIdx = Math.floor((hover.x - PADDING_LEFT) / slotW)
  const idx     = Math.max(0, Math.min(candles.length - 1, win.firstIdx + slotIdx))
  const k       = candles[idx]
  if (!k) return
  const xSnap = indexToX(idx, win.firstIdx, slotW)

  ctx.save()
  ctx.strokeStyle = c.accent
  ctx.lineWidth   = 1
  ctx.setLineDash([3, 3])
  ctx.globalAlpha = 0.6

  // Vertical line at snapped candle x
  ctx.beginPath()
  ctx.moveTo(Math.round(xSnap) + 0.5, panes.priceY0)
  ctx.lineTo(Math.round(xSnap) + 0.5, panes.volumeY1 || panes.priceY1)
  ctx.stroke()

  // Horizontal line at mouse y (clamped to price pane)
  const yClamped = Math.max(panes.priceY0, Math.min(panes.priceY1, hover.y))
  ctx.beginPath()
  ctx.moveTo(PADDING_LEFT,     Math.round(yClamped) + 0.5)
  ctx.lineTo(W - PADDING_RIGHT, Math.round(yClamped) + 0.5)
  ctx.stroke()

  ctx.setLineDash([])
  ctx.globalAlpha = 1

  // Right-edge price readout — coloured pill
  const range = bounds.max - bounds.min
  if (range > 0) {
    const priceAtY = bounds.max - (yClamped - panes.priceY0) / (panes.priceY1 - panes.priceY0) * range
    const label    = fmtPrice(priceAtY)
    ctx.font         = AXIS_FONT
    ctx.textBaseline = 'middle'
    ctx.textAlign    = 'left'
    const textW = ctx.measureText(label).width
    const padX  = 4, padY = 2
    ctx.fillStyle = c.accent
    ctx.fillRect(W - PADDING_RIGHT + 2, yClamped - 7 - padY, textW + padX * 2, 14 + padY * 2)
    ctx.fillStyle = c.bg.startsWith('rgba(0,0,0,0)') ? '#0d1520' : c.bg
    ctx.fillText(label, W - PADDING_RIGHT + 2 + padX, yClamped)
  }

  // Bottom-edge time readout
  ctx.font         = AXIS_FONT
  ctx.textBaseline = 'top'
  ctx.textAlign    = 'center'
  const tlabel = fmtTime(k.start)
  const tw = ctx.measureText(tlabel).width
  ctx.fillStyle = c.accent
  ctx.fillRect(xSnap - tw / 2 - 4, panes.volumeY1 + 2, tw + 8, 14)
  ctx.fillStyle = c.bg.startsWith('rgba(0,0,0,0)') ? '#0d1520' : c.bg
  ctx.fillText(tlabel, xSnap, panes.volumeY1 + 4)

  ctx.restore()
}
