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
export type LogLevel = 'info' | 'warn' | 'error' | 'debug' | 'success';
export interface LogEntry {
    /** Optional timestamp — number = ms epoch, string = pre-formatted or ISO. */
    ts?: number | string;
    /** The line text. May contain \n (treated as hard line break). */
    text: string;
    /** Drives text colour. Defaults to 'info'. */
    level?: LogLevel;
}
/**
 * One visible row after wrapping. Multi-line entries produce N visual lines;
 * only the first carries the timestamp string (others align under it).
 */
export interface VisualLine {
    entryIdx: number;
    text: string;
    level: LogLevel;
    timestamp: string;
    isFirstFrag: boolean;
    widthPx: number;
}
export interface LogColors {
    bg: string;
    text: string;
    border: string;
    accent: string;
    rowAlt: string;
    levelInfo: string;
    levelWarn: string;
    levelError: string;
    levelDebug: string;
    levelSuccess: string;
    timestamp: string;
    /** Optional override for the selection-row tint. Default if missing. */
    selection?: string;
}
export declare const LOG_THEME_COLORS: Record<string, LogColors>;
export declare function levelColor(c: LogColors, level: LogLevel): string;
export declare const FONT_SIZE = 12;
export declare const LINE_HEIGHT = 18;
export declare const PADDING_X = 10;
export declare const PADDING_Y = 6;
/** Monospace font for terminal aesthetic. */
export declare const FONT = "12px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace";
/**
 * Wrap a single string to fit within `maxWidth` (px) using `ctx` for measurement.
 * Hard \n breaks are honoured. Long unbroken tokens are sliced character-wise.
 */
export declare function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[];
/** Default formatter — HH:mm:ss for numeric ms epoch, raw string otherwise. */
export declare function defaultFormatTs(ts: number | string): string;
/**
 * Compute pixel width of the widest formatted timestamp + a small gap.
 * Used by the Vue wrapper to reserve a column on the left when timestamps
 * are enabled.
 */
export declare function measureTimestampWidth(ctx: CanvasRenderingContext2D, sample: string): number;
export interface BuildVisualLinesOpts {
    entries: LogEntry[];
    ctx: CanvasRenderingContext2D;
    textMaxWidth: number;
    showTimestamps: boolean;
    formatTs?: (ts: number | string) => string;
    wordWrap: boolean;
}
export declare function buildVisualLines(opts: BuildVisualLinesOpts): VisualLine[];
export interface DrawLogOpts {
    visualLines: VisualLine[];
    scrollY: number;
    scrollX: number;
    theme: string;
    glow: boolean;
    showTimestamps: boolean;
    timestampWidth: number;
    hoveredLine: number;
    /**
     * Inclusive selection range in visualLines indices. Both -1 = no selection.
     * Selected lines render with a stronger highlight (brand-tinted) than hover.
     */
    selectionStart: number;
    selectionEnd: number;
}
export declare function drawLog(canvas: HTMLCanvasElement, opts: DrawLogOpts): void;
/**
 * Map a canvas-space y-coordinate to the visual-line index. Returns -1 when
 * outside the rendered range.
 */
export declare function lineHitTest(cy: number, scrollY: number, visibleLen: number): number;
export declare function totalContentHeight(visualLineCount: number): number;
