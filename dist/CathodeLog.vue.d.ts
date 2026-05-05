import { type LogEntry } from './CanvasLog';
import './cathode.css';
type __VLS_Props = {
    entries: LogEntry[];
    /** 'none' inherits parent CSS vars; built-ins: phosphor | amber | paper. */
    theme?: 'none' | 'phosphor' | 'amber' | 'paper';
    /** 0–45 barrel-distortion strength. */
    curvature?: number;
    scanlines?: boolean;
    glow?: boolean;
    /** Show/hide the timestamp column (left of the text). Defaults to true. */
    showTimestamps?: boolean;
    /** Per-entry timestamp formatter. Defaults to HH:mm:ss for ms epoch. */
    formatTs?: (ts: number | string) => string;
    /** Wrap long lines to fit the canvas width (default true). */
    wordWrap?: boolean;
    /** Stick to bottom on new entries unless the user has scrolled up (default true). */
    autoscroll?: boolean;
    /** Ring-buffer cap on rendered entries — older entries scroll off. 0 = no cap. */
    maxLines?: number;
    /**
     * Lens-on-hover mode. When true, mousing over the log magnifies a
     * circular region under the cursor at ~1.6× with a flat field and a
     * subtle glass curl at the rim.
     */
    magnify?: boolean;
};
declare const _default: import("vue").DefineComponent<__VLS_Props, {
    /** Force-scroll to the latest entry. Resumes autoscroll. */
    scrollToBottom(): void;
    /** Programmatic scroll to a given line index (visual lines, not entry idx). */
    scrollToLine(li: number): void;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{}>, {
    glow: boolean;
    showTimestamps: boolean;
    wordWrap: boolean;
    theme: "none" | "phosphor" | "amber" | "paper";
    curvature: number;
    scanlines: boolean;
    magnify: boolean;
    autoscroll: boolean;
    maxLines: number;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
export default _default;
