import { type OHLCVCandle } from './CanvasCandle';
import './cathode.css';
type __VLS_Props = {
    candles: OHLCVCandle[];
    /** 'none' inherits parent CSS vars; built-ins: phosphor | amber | paper. */
    theme?: 'none' | 'phosphor' | 'amber' | 'paper';
    /** 0–45 barrel-distortion strength, same scale as CathodeGrid/Log. */
    curvature?: number;
    scanlines?: boolean;
    glow?: boolean;
    /** Show/hide the volume pane at the bottom. Defaults to true. */
    showVolume?: boolean;
    /** 0..1, fraction of pane reserved for volume bars (default 0.18). */
    volumeFraction?: number;
    /** px slot width per candle (driver of "zoom"). Higher = wider candles. */
    slotW?: number;
};
declare const _default: import("vue").DefineComponent<__VLS_Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{}>, {
    glow: boolean;
    theme: "none" | "phosphor" | "amber" | "paper";
    curvature: number;
    scanlines: boolean;
    showVolume: boolean;
    volumeFraction: number;
    slotW: number;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
export default _default;
