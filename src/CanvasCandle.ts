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
  /** Subtle gridline / axis colour. */
  gridline:     string
  /** Default text colour. */
  text:         string
  /** Highlight (e.g. crosshair, selected candle). */
  accent:       string
  /** Default trade-marker colours when not overridden by the marker itself. */
  markerEntry:  string
  markerExit:   string
  /** Translucent backdrop for non-blocking floating panels (legend, OHLCV
   *  readout). Light-themes use light backdrops, dark themes use dark. */
  panelBg:      string
  /** Near-opaque backdrop for panels that need solid readability (marker
   *  tooltip). Same hue as panelBg, higher alpha. Also used as the marker
   *  triangle's stroke colour to give a thin contrasting outline. */
  panelBgSolid: string
}

export const CANDLE_THEME_COLORS: Record<string, CandleColors> = {
  none: {
    // bg fully transparent so the parent (glass CathodeContainer) shows
    // through. Same propagation pattern as CanvasGrid / CanvasLog `none`.
    bg:           'rgba(0,0,0,0)',
    candleBull:   '#26a69a',
    candleBear:   '#ef5350',
    wickBull:     '#26a69a',
    wickBear:     '#ef5350',
    volumeBull:   'rgba(38,166,154,0.45)',
    volumeBear:   'rgba(239,83,80,0.45)',
    gridline:     'rgba(255,255,255,0.06)',
    text:         '#c0d0e0',
    accent:       '#40a0f0',
    markerEntry:  '#00cc55',
    markerExit:   '#e74c3c',
    panelBg:      'rgba(13,21,32,0.55)',
    panelBgSolid: 'rgba(13,21,32,0.92)',
  },
  paper: {
    bg:           'rgba(0,0,0,0)',
    candleBull:   '#1a8038',
    candleBear:   '#c0392b',
    wickBull:     '#1a8038',
    wickBear:     '#c0392b',
    volumeBull:   'rgba(26,128,56,0.30)',
    volumeBear:   'rgba(192,57,43,0.30)',
    gridline:     'rgba(0,0,0,0.06)',
    text:         '#222222',
    accent:       '#158cba',
    markerEntry:  '#1a9e3f',
    markerExit:   '#d93025',
    // Light backdrops for paper mode — dark fallbacks would be illegible on
    // the white parent background.
    panelBg:      'rgba(255,255,255,0.78)',
    panelBgSolid: 'rgba(255,255,255,0.96)',
  },
  phosphor: {
    bg:           '#060d06',
    candleBull:   '#33ff33',
    candleBear:   '#ff5050',
    wickBull:     '#33ff33',
    wickBear:     '#ff5050',
    volumeBull:   'rgba(51,255,51,0.35)',
    volumeBear:   'rgba(255,80,80,0.35)',
    gridline:     'rgba(51,255,51,0.10)',
    text:         '#33ff33',
    accent:       '#80ff80',
    markerEntry:  '#80ff80',
    markerExit:   '#ff8080',
    panelBg:      'rgba(6,13,6,0.85)',
    panelBgSolid: 'rgba(6,13,6,0.96)',
  },
  amber: {
    bg:           '#0a0700',
    candleBull:   '#ffd060',
    candleBear:   '#ff5000',
    wickBull:     '#ffd060',
    wickBear:     '#ff5000',
    volumeBull:   'rgba(255,208,96,0.35)',
    volumeBear:   'rgba(255,80,0,0.35)',
    gridline:     'rgba(255,176,0,0.10)',
    text:         '#ffb000',
    accent:       '#ffd060',
    markerEntry:  '#ffe080',
    markerExit:   '#ff7030',
    panelBg:      'rgba(10,7,0,0.85)',
    panelBgSolid: 'rgba(10,7,0,0.96)',
  },
}

// ── Layout constants ──────────────────────────────────────────────────────────

/** Default split — top portion is price, bottom is volume. 0..1. */
export const DEFAULT_VOLUME_FRACTION = 0.18

/** Pixel padding around the chart inside the canvas. */
export const PADDING_TOP            = 8
export const PADDING_BOTTOM         = 22  // room for time-axis labels
export const PADDING_BOTTOM_COMPACT = 4   // no time axis in compact (mini-chart) mode
export const PADDING_LEFT           = 8
export const PADDING_RIGHT          = 56  // room for price-axis labels
export const PADDING_RIGHT_COMPACT  = 42  // narrower mini-chart axis labels

/** Font for axis + crosshair labels. */
const AXIS_FONT         = '10px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace'
const AXIS_FONT_COMPACT = '9px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace'

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
  compact = false,
): VisibleWindow {
  const padR      = compact ? PADDING_RIGHT_COMPACT : PADDING_RIGHT
  const usableW   = Math.max(0, canvasW - PADDING_LEFT - padR)
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

export function computePaneLayout(canvasH: number, volumeFraction: number, compact = false): PaneLayout {
  const padBottom = compact ? PADDING_BOTTOM_COMPACT : PADDING_BOTTOM
  const usableH   = Math.max(1, canvasH - PADDING_TOP - padBottom - PANE_GAP)
  const volH      = Math.max(0, Math.round(usableH * volumeFraction))
  const priceH    = usableH - volH
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
  /** Indicator series drawn over the price pane (BB, EMA, SMA, etc.). */
  overlays?:      PriceOverlay[]
  /** Trade entry / exit annotations at (timestamp, price) points. */
  markers?:       TradeMarker[]
  /**
   * Thumbnail mode — drops the time axis, the interval badge, and reduces
   * the price-axis label density / font size. Use for mini-charts where
   * full axis chrome doesn't fit in the available pixels.
   */
  compact?:       boolean
  /**
   * Per-call colour overrides merged onto the active theme. Lets a
   * consumer match its own brand palette without registering a new theme.
   */
  colors?:        Partial<CandleColors>
}

/** Format a price as a financial number — thousands separators, decimal scale
 *  by magnitude (fewer decimals at higher prices). */
function fmtPrice(p: number): string {
  const a = Math.abs(p)
  const opts: Intl.NumberFormatOptions =
    a >= 10000 ? { minimumFractionDigits: 0, maximumFractionDigits: 0 } :
    a >= 100   ? { minimumFractionDigits: 1, maximumFractionDigits: 1 } :
    a >= 1     ? { minimumFractionDigits: 2, maximumFractionDigits: 2 } :
    a >= 0.01  ? { minimumFractionDigits: 4, maximumFractionDigits: 4 } :
                 { minimumFractionDigits: 6, maximumFractionDigits: 6 }
  return p.toLocaleString('en-US', opts)
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
  const baseTheme = CANDLE_THEME_COLORS[opts.theme] ?? CANDLE_THEME_COLORS['none']
  const c: CandleColors = opts.colors ? { ...baseTheme, ...opts.colors } : baseTheme
  const compact = !!opts.compact

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
  const win    = computeVisibleWindow(opts.candles.length, W, opts.slotW, opts.scrollX, compact)
  const bounds = computePriceBounds(opts.candles, win.firstIdx, win.count)
  const panes  = computePaneLayout(H, opts.showVolume ? opts.volumeFraction : 0, compact)

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

  // ── Indicator overlays (lines + bands, drawn over candles) ──────────────────
  if (opts.overlays?.length) {
    for (const ov of opts.overlays) drawOverlay(ctx, ov, win, bounds, panes, opts.slotW)
  }

  // ── Trade markers (entry / exit triangles) ──────────────────────────────────
  if (opts.markers?.length) {
    drawMarkers(ctx, c, opts.markers, opts.candles, win, bounds, panes, opts.slotW)
  }

  // ── Price axis (right edge) ─────────────────────────────────────────────────
  drawPriceAxis(ctx, c, bounds, panes, W, compact)

  // ── Time axis + interval badge — full-size charts only. Compact mode
  //    skips both because at thumbnail width they collapse into smears.
  if (!compact) {
    drawTimeAxis(ctx, c, opts.candles, win, opts.slotW, H)
    drawIntervalBadge(ctx, c, opts.candles, W, H)
  }

  // ── Indicator legend (top-left of price pane) ──────────────────────────────
  if (opts.overlays?.length) {
    drawLegend(ctx, c, opts.overlays, panes)
  }

  // ── Crosshair + OHLCV readout + marker tooltip (only when hovering) ────────
  if (opts.hover) {
    drawCrosshair(ctx, c, opts.candles, win, bounds, panes, opts.slotW, opts.hover, W)
    drawOhlcvReadout(ctx, c, opts.candles, win, opts.slotW, opts.hover, panes, opts.overlays?.length ?? 0)
    if (opts.markers?.length) {
      drawMarkerTooltip(ctx, c, opts.markers, opts.candles, win, bounds, panes, opts.slotW, opts.hover, W)
    }
  }

  ctx.restore()
}

// ── Overlay drawing ───────────────────────────────────────────────────────────

function drawOverlay(
  ctx:     CanvasRenderingContext2D,
  ov:      PriceOverlay,
  win:     VisibleWindow,
  bounds:  PriceBounds,
  panes:   PaneLayout,
  slotW:   number,
): void {
  const last = win.firstIdx + win.count
  ctx.save()
  // Clip to the price pane so overlays don't bleed into the volume area
  // or the time-axis label band.
  ctx.beginPath()
  ctx.rect(PADDING_LEFT, panes.priceY0, /* width: */ 999999, panes.priceY1 - panes.priceY0)
  ctx.clip()

  if (ov.kind === 'line') {
    drawSeriesLine(ctx, ov.data, win.firstIdx, last, slotW, bounds, panes, ov.color, ov.lineWidth ?? 1, ov.dashed === true)
  } else {
    // Band: filled area between upper and lower, with stroked edges + optional middle.
    const fillColor = applyAlpha(ov.color, ov.fillAlpha ?? 0.08)
    drawSeriesBand(ctx, ov.upper, ov.lower, win.firstIdx, last, slotW, bounds, panes, fillColor)
    drawSeriesLine(ctx, ov.upper, win.firstIdx, last, slotW, bounds, panes, ov.color, 1, false)
    drawSeriesLine(ctx, ov.lower, win.firstIdx, last, slotW, bounds, panes, ov.color, 1, false)
    if (ov.middle?.length) {
      drawSeriesLine(ctx, ov.middle, win.firstIdx, last, slotW, bounds, panes, ov.color, 1, ov.middleDashed !== false)
    }
  }

  ctx.restore()
}

/** Stroke a polyline through the data series, breaking on NaN. */
function drawSeriesLine(
  ctx:    CanvasRenderingContext2D,
  data:   number[],
  first:  number,
  last:   number,
  slotW:  number,
  bounds: PriceBounds,
  panes:  PaneLayout,
  color:  string,
  width:  number,
  dashed: boolean,
): void {
  if (!data || !data.length) return
  ctx.strokeStyle = color
  ctx.lineWidth   = width
  ctx.setLineDash(dashed ? [4, 3] : [])
  ctx.beginPath()
  let started = false
  for (let i = first; i < last; i++) {
    const v = data[i]
    if (typeof v !== 'number' || !isFinite(v)) {
      if (started) { ctx.stroke(); ctx.beginPath(); started = false }
      continue
    }
    const x = indexToX(i, first, slotW)
    const y = priceToY(v, bounds, panes.priceY0, panes.priceY1)
    if (!started) { ctx.moveTo(x, y); started = true }
    else          ctx.lineTo(x, y)
  }
  if (started) ctx.stroke()
  ctx.setLineDash([])
}

/** Fill a band between two series. NaN in either edge is treated as a gap. */
function drawSeriesBand(
  ctx:    CanvasRenderingContext2D,
  upper:  number[],
  lower:  number[],
  first:  number,
  last:   number,
  slotW:  number,
  bounds: PriceBounds,
  panes:  PaneLayout,
  fill:   string,
): void {
  if (!upper?.length || !lower?.length) return
  ctx.fillStyle = fill

  // Walk forward along upper, then backward along lower, building closed
  // polygons that break on any NaN gap.
  let inSegment = false
  let segStart  = -1
  for (let i = first; i <= last; i++) {
    const u = upper[i]
    const l = lower[i]
    const valid = i < last && typeof u === 'number' && typeof l === 'number' && isFinite(u) && isFinite(l)
    if (valid && !inSegment) { segStart = i; inSegment = true }
    if ((!valid && inSegment) || (i === last && inSegment)) {
      const segEnd = valid ? i + 1 : i
      ctx.beginPath()
      // Forward along upper
      for (let j = segStart; j < segEnd; j++) {
        const x = indexToX(j, first, slotW)
        const y = priceToY(upper[j], bounds, panes.priceY0, panes.priceY1)
        if (j === segStart) ctx.moveTo(x, y); else ctx.lineTo(x, y)
      }
      // Backward along lower
      for (let j = segEnd - 1; j >= segStart; j--) {
        const x = indexToX(j, first, slotW)
        const y = priceToY(lower[j], bounds, panes.priceY0, panes.priceY1)
        ctx.lineTo(x, y)
      }
      ctx.closePath()
      ctx.fill()
      inSegment = false
    }
  }
}

/** Apply an alpha to a CSS colour. Returns the input unchanged for unknown
 *  formats — callers should pass solid hex / rgb / rgba. */
function applyAlpha(color: string, alpha: number): string {
  const a = Math.max(0, Math.min(1, alpha))
  if (color.startsWith('#') && color.length === 7) {
    const r = parseInt(color.slice(1, 3), 16)
    const g = parseInt(color.slice(3, 5), 16)
    const b = parseInt(color.slice(5, 7), 16)
    return `rgba(${r},${g},${b},${a})`
  }
  if (color.startsWith('rgba')) return color.replace(/[\d.]+\)$/, `${a})`)
  if (color.startsWith('rgb('))  return color.replace(/^rgb\(/, 'rgba(').replace(/\)$/, `,${a})`)
  return color
}

// ── Indicator legend (top-left of price pane) ────────────────────────────────

function drawLegend(
  ctx:      CanvasRenderingContext2D,
  c:        CandleColors,
  overlays: PriceOverlay[],
  panes:    PaneLayout,
): void {
  // Filter to just labelled overlays — unlabelled ones are presumed
  // background context (e.g. a calc-only series the consumer doesn't want
  // listed in the legend).
  const labelled = overlays.filter(o => !!o.label)
  if (!labelled.length) return

  ctx.save()
  ctx.font = AXIS_FONT

  // Compute box dimensions to fit the widest label
  const PAD_X = 8
  const PAD_Y = 5
  const SWATCH_W = 12
  const SWATCH_GAP = 6
  const ROW_H = 14
  let maxLabelW = 0
  for (const o of labelled) {
    const w = ctx.measureText(o.label!).width
    if (w > maxLabelW) maxLabelW = w
  }
  const boxW = PAD_X * 2 + SWATCH_W + SWATCH_GAP + maxLabelW
  const boxH = PAD_Y * 2 + ROW_H * labelled.length

  const boxX = PADDING_LEFT + 4
  const boxY = panes.priceY0 + 4

  // Translucent backdrop so text reads over candles.
  ctx.fillStyle = c.panelBg
  ctx.fillRect(boxX, boxY, boxW, boxH)

  // Each row
  ctx.textBaseline = 'middle'
  ctx.textAlign    = 'left'
  for (let i = 0; i < labelled.length; i++) {
    const o = labelled[i]
    const rowY = boxY + PAD_Y + ROW_H * (i + 0.5)
    // Colour swatch — short line for `line`, filled rect for `band`.
    const sx = boxX + PAD_X
    if (o.kind === 'line') {
      ctx.strokeStyle = o.color
      ctx.lineWidth   = o.lineWidth ?? 1
      ctx.setLineDash(o.dashed ? [3, 3] : [])
      ctx.beginPath()
      ctx.moveTo(sx,            rowY)
      ctx.lineTo(sx + SWATCH_W, rowY)
      ctx.stroke()
      ctx.setLineDash([])
    } else {
      // Band: small rectangle filled + outlined
      ctx.fillStyle   = applyAlpha(o.color, o.fillAlpha ?? 0.20)
      ctx.fillRect(sx, rowY - 4, SWATCH_W, 8)
      ctx.strokeStyle = o.color
      ctx.lineWidth   = 1
      ctx.strokeRect(sx + 0.5, rowY - 4 + 0.5, SWATCH_W - 1, 7)
    }
    ctx.fillStyle = c.text
    ctx.fillText(o.label!, sx + SWATCH_W + SWATCH_GAP, rowY)
  }
  ctx.restore()
}

// ── OHLCV readout (TV-style top strip on hover) ──────────────────────────────

function drawOhlcvReadout(
  ctx:        CanvasRenderingContext2D,
  c:          CandleColors,
  candles:    OHLCVCandle[],
  win:        VisibleWindow,
  slotW:      number,
  hover:      { x: number; y: number },
  panes:      PaneLayout,
  legendRows: number,
): void {
  const slotIdx = Math.floor((hover.x - PADDING_LEFT) / slotW)
  const idx     = win.firstIdx + slotIdx
  if (idx < 0 || idx >= candles.length) return
  const k = candles[idx]
  if (!k) return

  const change    = k.close - k.open
  const changePct = k.open !== 0 ? (change / k.open) * 100 : 0
  const sign      = change >= 0 ? '+' : ''
  const segments: Array<[label: string, value: string, color?: string]> = [
    ['O', fmtPrice(k.open),  undefined],
    ['H', fmtPrice(k.high),  undefined],
    ['L', fmtPrice(k.low),   undefined],
    ['C', fmtPrice(k.close), undefined],
    ['V', fmtVol(k.volume),  undefined],
    ['',  `${sign}${changePct.toFixed(2)}%`, change >= 0 ? c.candleBull : c.candleBear],
  ]

  ctx.save()
  ctx.font         = AXIS_FONT
  ctx.textBaseline = 'middle'
  ctx.textAlign    = 'left'

  const PAD_X = 8
  const PAD_Y = 4
  const ROW_H = 14
  // Compute total width
  let totalW = PAD_X
  const widths: number[] = []
  for (const [label, value] of segments) {
    const piece = label ? `${label} ${value}` : value
    const w = ctx.measureText(piece).width + 12   // gap between segments
    widths.push(w)
    totalW += w
  }
  totalW += PAD_X - 12   // remove trailing gap

  // Position below the legend (if any), or at top.
  const stripY = panes.priceY0 + 4 + (legendRows > 0 ? PAD_Y * 2 + 14 * legendRows + 4 : 0)
  const stripX = PADDING_LEFT + 4

  // Translucent backdrop
  ctx.fillStyle = c.panelBg
  ctx.fillRect(stripX, stripY, totalW, ROW_H + PAD_Y * 2)

  // Render segments
  let x = stripX + PAD_X
  for (let i = 0; i < segments.length; i++) {
    const [label, value, color] = segments[i]
    ctx.fillStyle = c.text
    if (label) {
      // Label tinted dim
      ctx.globalAlpha = 0.6
      ctx.fillText(label + ' ', x, stripY + PAD_Y + ROW_H / 2)
      ctx.globalAlpha = 1
      x += ctx.measureText(label + ' ').width
    }
    if (color) ctx.fillStyle = color
    ctx.fillText(value, x, stripY + PAD_Y + ROW_H / 2)
    x += ctx.measureText(value).width + 12
  }
  ctx.restore()
}

/** Compact volume formatter (1234567 → "1.2M"). */
function fmtVol(v: number): string {
  if (!isFinite(v) || v <= 0) return '0'
  if (v >= 1_000_000_000) return (v / 1_000_000_000).toFixed(2) + 'B'
  if (v >= 1_000_000)     return (v / 1_000_000).toFixed(2) + 'M'
  if (v >= 1_000)         return (v / 1_000).toFixed(1) + 'K'
  return Math.round(v).toString()
}

// ── Marker hover tooltip ─────────────────────────────────────────────────────

function drawMarkerTooltip(
  ctx:     CanvasRenderingContext2D,
  c:       CandleColors,
  markers: TradeMarker[],
  candles: OHLCVCandle[],
  win:     VisibleWindow,
  bounds:  PriceBounds,
  panes:   PaneLayout,
  slotW:   number,
  hover:   { x: number; y: number },
  W:       number,
): void {
  if (!candles.length) return
  const interval = candles.length > 1 ? candles[1].start - candles[0].start : 60_000
  const tol      = Math.max(1, interval * 0.5)
  const last     = Math.min(candles.length, win.firstIdx + win.count)

  // Hit-test: marker triangles are 7px half-width / half-height. Pick the
  // first marker whose bounding box contains the hover point.
  const HIT_R = 9   // slightly generous to reduce miss frustration
  let hit: { m: TradeMarker; x: number; y: number } | null = null
  for (const m of markers) {
    // Find candle index by timestamp
    let lo = 0, hi = candles.length - 1, idx = -1
    while (lo <= hi) {
      const mid = (lo + hi) >> 1
      const d   = candles[mid].start - m.timestamp
      if (Math.abs(d) <= tol) { idx = mid; break }
      if (d < 0) lo = mid + 1
      else       hi = mid - 1
    }
    if (idx < 0 || idx < win.firstIdx || idx >= last) continue
    const x = indexToX(idx, win.firstIdx, slotW)
    const y = priceToY(m.price, bounds, panes.priceY0, panes.priceY1)
    if (Math.abs(hover.x - x) <= HIT_R && Math.abs(hover.y - y) <= HIT_R) {
      hit = { m, x, y }
      break
    }
  }
  if (!hit) return

  // Build tooltip lines
  const tsLabel = fmtTime(hit.m.timestamp)
  const lines = [
    `${hit.m.kind === 'entry' ? '▲ ENTRY' : '▼ EXIT'}`,
    `${tsLabel}`,
    `@ ${fmtPrice(hit.m.price)}`,
  ]
  if (hit.m.label) lines.push(hit.m.label)

  ctx.save()
  ctx.font         = AXIS_FONT
  ctx.textBaseline = 'top'
  ctx.textAlign    = 'left'

  const PAD = 6
  const ROW_H = 14
  let maxW = 0
  for (const l of lines) {
    const w = ctx.measureText(l).width
    if (w > maxW) maxW = w
  }
  const boxW = maxW + PAD * 2
  const boxH = lines.length * ROW_H + PAD * 2

  // Place to the right of the marker by default, flip left if it would clip
  // off the right edge of the chart area.
  let boxX = hit.x + 12
  if (boxX + boxW > W - PADDING_RIGHT) boxX = hit.x - 12 - boxW
  let boxY = hit.y - boxH / 2
  if (boxY < panes.priceY0) boxY = panes.priceY0
  if (boxY + boxH > panes.priceY1) boxY = panes.priceY1 - boxH

  // Backdrop with marker-coloured border (solid backdrop for readability)
  ctx.fillStyle   = c.panelBgSolid
  ctx.strokeStyle = hit.m.kind === 'entry' ? c.markerEntry : c.markerExit
  ctx.lineWidth   = 1
  ctx.fillRect(boxX, boxY, boxW, boxH)
  ctx.strokeRect(boxX + 0.5, boxY + 0.5, boxW - 1, boxH - 1)

  // Lines
  for (let i = 0; i < lines.length; i++) {
    const l = lines[i]
    ctx.fillStyle = i === 0
      ? (hit.m.kind === 'entry' ? c.markerEntry : c.markerExit)
      : c.text
    ctx.fillText(l, boxX + PAD, boxY + PAD + i * ROW_H)
  }
  ctx.restore()
}

// ── Interval badge (right side of time axis) ─────────────────────────────────

function drawIntervalBadge(
  ctx:     CanvasRenderingContext2D,
  c:       CandleColors,
  candles: OHLCVCandle[],
  W:       number,
  H:       number,
): void {
  if (candles.length < 2) return
  const intervalMs = candles[1].start - candles[0].start
  const label = formatInterval(intervalMs)
  if (!label) return

  ctx.save()
  ctx.font         = AXIS_FONT
  ctx.textBaseline = 'top'
  ctx.textAlign    = 'right'

  const PAD_X = 6
  const PAD_Y = 3
  const tw = ctx.measureText(label).width
  const x  = W - PADDING_RIGHT - PAD_X
  const y  = H - PADDING_BOTTOM + 4
  // Backdrop pill
  ctx.fillStyle = c.accent
  ctx.fillRect(x - tw - PAD_X, y - PAD_Y, tw + PAD_X * 2, 14 + PAD_Y * 2)
  // Text in bg colour for contrast
  ctx.fillStyle = c.bg.startsWith('rgba(0,0,0,0)') ? '#0d1520' : c.bg
  ctx.fillText(label, x, y)
  ctx.restore()
}

/** Format a bar interval in ms to a TV-style abbreviation. Returns "" for
 *  unrecognised durations (very short / non-uniform candles). */
function formatInterval(ms: number): string {
  if (ms <= 0 || !isFinite(ms)) return ''
  const SEC = 1000
  const MIN = 60 * SEC
  const HR  = 60 * MIN
  const DAY = 24 * HR
  const WEEK = 7 * DAY
  if (ms >= WEEK && ms % WEEK === 0) return (ms / WEEK) + 'W'
  if (ms >= DAY  && ms % DAY  === 0) return (ms / DAY)  + 'D'
  if (ms >= HR   && ms % HR   === 0) return (ms / HR)   + 'h'
  if (ms >= MIN  && ms % MIN  === 0) return (ms / MIN)  + 'm'
  if (ms >= SEC  && ms % SEC  === 0) return (ms / SEC)  + 's'
  // Fall back: round to the nearest minute
  return Math.round(ms / MIN) + 'm'
}

// ── Trade markers ─────────────────────────────────────────────────────────────

function drawMarkers(
  ctx:     CanvasRenderingContext2D,
  c:       CandleColors,
  markers: TradeMarker[],
  candles: OHLCVCandle[],
  win:     VisibleWindow,
  bounds:  PriceBounds,
  panes:   PaneLayout,
  slotW:   number,
): void {
  if (!candles.length) return
  // Use bar-interval-derived tolerance: marker.timestamp must match a candle's
  // start within ±0.5 × interval. Candles are sorted by start ascending.
  const interval = candles.length > 1 ? candles[1].start - candles[0].start : 60_000
  const tol      = Math.max(1, interval * 0.5)
  const last     = Math.min(candles.length, win.firstIdx + win.count)

  // Helper: binary-search candle index by timestamp
  const findIdx = (ts: number): number => {
    let lo = 0, hi = candles.length - 1
    while (lo <= hi) {
      const mid = (lo + hi) >> 1
      const d   = candles[mid].start - ts
      if (Math.abs(d) <= tol) return mid
      if (d < 0) lo = mid + 1
      else       hi = mid - 1
    }
    return -1
  }

  const SIZE = 7   // triangle half-width / half-height in px

  for (const m of markers) {
    const idx = findIdx(m.timestamp)
    if (idx < 0 || idx < win.firstIdx || idx >= last) continue
    const x = indexToX(idx, win.firstIdx, slotW)
    const y = priceToY(m.price, bounds, panes.priceY0, panes.priceY1)
    if (y < panes.priceY0 || y > panes.priceY1) continue   // off-pane

    const color = m.color ?? (m.kind === 'entry' ? c.markerEntry : c.markerExit)
    ctx.fillStyle   = color
    // Outline contrasts with the chart-area background — light in paper
    // mode, dark in night themes — so the triangle stays clean against
    // candles regardless of the theme. 1px keeps the shape visually light.
    ctx.strokeStyle = c.panelBgSolid
    ctx.lineWidth   = 1

    // Entry: ▲ pointing UP, anchored slightly BELOW the price (so the apex sits at price).
    // Exit:  ▼ pointing DOWN, anchored slightly ABOVE the price.
    ctx.beginPath()
    if (m.kind === 'entry') {
      ctx.moveTo(x,        y - SIZE)
      ctx.lineTo(x - SIZE, y + SIZE - 1)
      ctx.lineTo(x + SIZE, y + SIZE - 1)
    } else {
      ctx.moveTo(x,        y + SIZE)
      ctx.lineTo(x - SIZE, y - SIZE + 1)
      ctx.lineTo(x + SIZE, y - SIZE + 1)
    }
    ctx.closePath()
    ctx.fill()
    ctx.stroke()
  }
}

// ── Axis drawing ──────────────────────────────────────────────────────────────

function drawPriceAxis(
  ctx:     CanvasRenderingContext2D,
  c:       CandleColors,
  bounds:  PriceBounds,
  panes:   PaneLayout,
  W:       number,
  compact = false,
): void {
  const range = bounds.max - bounds.min
  if (range <= 0) return
  // Compact panels are short — fewer labels avoid stacking. Also derive
  // a per-height target so a 120px card gets ~3 labels but a 240px card
  // gets ~5 even in compact mode.
  const paneH       = panes.priceY1 - panes.priceY0
  const targetCount = compact
    ? Math.max(2, Math.min(4, Math.round(paneH / 36)))
    : 6
  const step        = niceStep(range, targetCount)
  const startTick   = Math.ceil(bounds.min / step) * step
  const padR        = compact ? PADDING_RIGHT_COMPACT : PADDING_RIGHT

  ctx.font         = compact ? AXIS_FONT_COMPACT : AXIS_FONT
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
    ctx.lineTo(W - padR, Math.round(y) + 0.5)
    ctx.stroke()
    // Label flush to the right edge
    ctx.fillText(fmtPrice(v), W - padR + 3, y)
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
