import { type LogEntry } from './CanvasLog';
import './cathode.css';
type __VLS_Props = {
    /** Scrollback entries — same shape as CathodeLog. Consumer-owned. */
    entries: LogEntry[];
    /** 'none' inherits parent CSS vars; built-ins: phosphor | amber | paper. */
    theme?: 'none' | 'phosphor' | 'amber' | 'paper';
    /** 0–45 barrel-distortion strength (forwarded to CathodeLog). */
    curvature?: number;
    scanlines?: boolean;
    glow?: boolean;
    /** Show/hide the timestamp column on scrollback entries. */
    showTimestamps?: boolean;
    formatTs?: (ts: number | string) => string;
    wordWrap?: boolean;
    /** Stick to bottom on new entries unless the user has scrolled up. */
    autoscroll?: boolean;
    /** Ring-buffer cap on rendered entries (forwarded to CathodeLog). 0 = no cap. */
    maxLines?: number;
    /** Prefix shown before the input (e.g. "→ ", "$ ", "> "). */
    prompt?: string;
    /** Placeholder text in the empty input. */
    placeholder?: string;
    /** When true, the input is read-only and submit is disabled. */
    disabled?: boolean;
    /** When true, render a spinner/dim state — useful while awaiting a response. */
    busy?: boolean;
    /** Max number of submitted commands kept for ↑/↓ history. */
    historyLimit?: number;
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
    disabled: boolean;
    placeholder: string;
    autoscroll: boolean;
    maxLines: number;
    prompt: string;
    busy: boolean;
    historyLimit: number;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
export default _default;
