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
/**
 * OHLCV candle — same shape as the dashboard's `Candle` interface.
 * `start` is ms epoch (or any monotonic key — we don't decode it here).
 */
export interface OHLCVCandle {
    start: number;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
}
/** Single-line overlay (e.g. fast EMA, slow EMA, SMA50, midline). */
export interface PriceOverlayLine {
    kind: 'line';
    /** y-values aligned to candles[] by index. NaN = gap. */
    data: number[];
    color: string;
    lineWidth?: number;
    /** Dashed line if true (e.g. for indicator midline). */
    dashed?: boolean;
    /** Optional label — used for legend / hover (PR3+). */
    label?: string;
}
/** Two-line band overlay (e.g. Bollinger Bands, Donchian Channel, Keltner). */
export interface PriceOverlayBand {
    kind: 'band';
    /** Upper edge values, aligned to candles[]. NaN = gap. */
    upper: number[];
    lower: number[];
    /** Optional middle line (e.g. Bollinger SMA20). */
    middle?: number[];
    color: string;
    /** 0..1 fill alpha for the band area. Default 0.08. */
    fillAlpha?: number;
    /** Render the middle line as dashed (default true). */
    middleDashed?: boolean;
    label?: string;
}
export type PriceOverlay = PriceOverlayLine | PriceOverlayBand;
/**
 * Triangle annotation at a (timestamp, price) point on the price pane.
 * Resolved to the nearest candle by start timestamp; if no candle within
 * one slot duration matches, the marker is dropped silently.
 */
export interface TradeMarker {
    timestamp: number;
    price: number;
    kind: 'entry' | 'exit';
    /** Optional override colour; defaults to theme entry/exit colours. */
    color?: string;
    /** Optional label — drawn next to the marker (PR3+). */
    label?: string;
}
export interface CandleColors {
    bg: string;
    /** Body fill for bullish candles (close ≥ open). */
    candleBull: string;
    /** Body fill for bearish candles (close < open). */
    candleBear: string;
    /** Wick / outline for bullish candles. */
    wickBull: string;
    wickBear: string;
    /** Volume bar fill (semi-transparent). */
    volumeBull: string;
    volumeBear: string;
    /** Subtle gridline / axis colour. */
    gridline: string;
    /** Default text colour. */
    text: string;
    /** Highlight (e.g. crosshair, selected candle). */
    accent: string;
    /** Default trade-marker colours when not overridden by the marker itself. */
    markerEntry: string;
    markerExit: string;
    /** Translucent backdrop for non-blocking floating panels (legend, OHLCV
     *  readout). Light-themes use light backdrops, dark themes use dark. */
    panelBg: string;
    /** Near-opaque backdrop for panels that need solid readability (marker
     *  tooltip). Same hue as panelBg, higher alpha. Also used as the marker
     *  triangle's stroke colour to give a thin contrasting outline. */
    panelBgSolid: string;
}
export declare const CANDLE_THEME_COLORS: Record<string, CandleColors>;
/** Default split — top portion is price, bottom is volume. 0..1. */
export declare const DEFAULT_VOLUME_FRACTION = 0.18;
/** Pixel padding around the chart inside the canvas. */
export declare const PADDING_TOP = 8;
export declare const PADDING_BOTTOM = 22;
export declare const PADDING_LEFT = 8;
export declare const PADDING_RIGHT = 56;
/** Pixel gap between the price pane and the volume pane. */
export declare const PANE_GAP = 4;
/** Minimum candle body width (px). Candles narrower than this are 1px lines. */
export declare const MIN_CANDLE_WIDTH = 1;
/** Wick stroke width (px). */
export declare const WICK_WIDTH = 1;
/**
 * Compute the visible candle range for a given canvas width and slot count.
 * `firstIdx` is the leftmost visible candle index. Negative slots are clamped.
 */
export interface VisibleWindow {
    firstIdx: number;
    count: number;
    /** px reserved per candle slot (body + spacing). */
    slotW: number;
}
export declare function computeVisibleWindow(totalCandles: number, canvasW: number, slotW: number, scrollX?: number): VisibleWindow;
/**
 * Compute the price min/max across the visible candles. Used to scale the
 * price axis so all visible wicks fit. Adds a small head/tail-room so candles
 * don't touch the pane edges.
 */
export interface PriceBounds {
    min: number;
    max: number;
    /** Whichever the largest volume in the visible window is — drives volume scaling. */
    maxVol: number;
}
export declare function computePriceBounds(candles: OHLCVCandle[], firstIdx: number, count: number): PriceBounds;
/**
 * Resolve the price + volume pane rectangles from the canvas height and a
 * volume fraction. Each pane is { y0, y1 } in canvas coords (y grows down).
 */
export interface PaneLayout {
    priceY0: number;
    priceY1: number;
    volumeY0: number;
    volumeY1: number;
}
export declare function computePaneLayout(canvasH: number, volumeFraction: number): PaneLayout;
/** Map a price to a y-pixel within `[y0, y1]` given price bounds. */
export declare function priceToY(price: number, bounds: PriceBounds, y0: number, y1: number): number;
/** Map a candle index to the centre x-pixel of its slot. */
export declare function indexToX(idx: number, firstIdx: number, slotW: number): number;
export interface DrawCandleOpts {
    candles: OHLCVCandle[];
    /** Pixel width per candle slot (body + spacing). Driven by zoom level. */
    slotW: number;
    scrollX: number;
    theme: string;
    glow: boolean;
    showVolume: boolean;
    /** 0..1, fraction of pane reserved for the volume bars. */
    volumeFraction: number;
    /** Mouse position in canvas coords; null = no crosshair. */
    hover: {
        x: number;
        y: number;
    } | null;
    /** Indicator series drawn over the price pane (BB, EMA, SMA, etc.). */
    overlays?: PriceOverlay[];
    /** Trade entry / exit annotations at (timestamp, price) points. */
    markers?: TradeMarker[];
}
export declare function drawCandle(canvas: HTMLCanvasElement, opts: DrawCandleOpts): void;
