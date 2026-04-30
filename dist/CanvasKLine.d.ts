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
export interface KLineColors {
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
    /** Subtle gridline / axis colour for future use (PR 2). */
    gridline: string;
    /** Default text colour. */
    text: string;
    /** Highlight (e.g. crosshair, selected candle). */
    accent: string;
}
export declare const KLINE_THEME_COLORS: Record<string, KLineColors>;
/** Default split — top portion is price, bottom is volume. 0..1. */
export declare const DEFAULT_VOLUME_FRACTION = 0.18;
/** Pixel padding around the chart inside the canvas. */
export declare const PADDING_TOP = 8;
export declare const PADDING_BOTTOM = 8;
export declare const PADDING_LEFT = 8;
export declare const PADDING_RIGHT = 8;
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
export interface DrawKLineOpts {
    candles: OHLCVCandle[];
    /** Pixel width per candle slot (body + spacing). Driven by zoom level. */
    slotW: number;
    scrollX: number;
    theme: string;
    glow: boolean;
    showVolume: boolean;
    /** 0..1, fraction of pane reserved for the volume bars. */
    volumeFraction: number;
}
export declare function drawKLine(canvas: HTMLCanvasElement, opts: DrawKLineOpts): void;
