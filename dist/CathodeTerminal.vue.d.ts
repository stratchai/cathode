import { type LogEntry } from './CanvasLog';
import './cathode.css';
type __VLS_Props = {
    /** Scrollback entries — same shape as CathodeLog. Consumer-owned. */
    entries: LogEntry[];
    /** 'none' inherits parent CSS vars; built-ins: phosphor | amber | paper. */
    theme?: 'none' | 'phosphor' | 'amber' | 'paper';
    curvature?: number;
    scanlines?: boolean;
    glow?: boolean;
    /** Show/hide the timestamp column on scrollback entries (the prompt row
     *  never carries a timestamp regardless). */
    showTimestamps?: boolean;
    formatTs?: (ts: number | string) => string;
    wordWrap?: boolean;
    autoscroll?: boolean;
    maxLines?: number;
    /** Prefix shown before the input (e.g. "→ ", "$ ", "> "). */
    prompt?: string;
    /** When true, the input is read-only and submit is disabled. */
    disabled?: boolean;
    /** When true, the cursor stops blinking and shows a steady block —
     *  useful while awaiting a response. */
    busy?: boolean;
    /** Max number of submitted commands kept for ↑/↓ history. */
    historyLimit?: number;
    /**
     * Hover-lens magnify. Forwarded straight to the underlying CathodeLog
     * since the terminal renders through it — no separate implementation
     * needed. Same circle, same shader pipeline.
     */
    magnify?: boolean;
};
declare function focus(): void;
declare const _default: import("vue").DefineComponent<__VLS_Props, {
    focus: typeof focus;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    submit: (command: string) => any;
}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{
    onSubmit?: ((command: string) => any) | undefined;
}>, {
    glow: boolean;
    showTimestamps: boolean;
    wordWrap: boolean;
    theme: "none" | "phosphor" | "amber" | "paper";
    curvature: number;
    scanlines: boolean;
    magnify: boolean;
    disabled: boolean;
    autoscroll: boolean;
    maxLines: number;
    prompt: string;
    busy: boolean;
    historyLimit: number;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
export default _default;
