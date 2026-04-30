import { type OHLCVCandle, type PriceOverlay, type TradeMarker } from './CanvasCandle';
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
    /** Indicator series drawn on the price pane (BB, EMA, SMA, etc.). */
    overlays?: PriceOverlay[];
    /** Trade entry/exit annotations at (timestamp, price) points. */
    markers?: TradeMarker[];
    /**
     * Force the 2D-canvas fallback path — skip Three.js + barrel shader
     * entirely. Use for mini-charts: dashboards rendering many cards at
     * once exceed Chrome's ~16 WebGL-context cap, evicting visible charts.
     * The barrel effect is also barely legible at small sizes.
     */
    flat?: boolean;
};
declare const _default: import("vue").DefineComponent<__VLS_Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{}>, {
    flat: boolean;
    glow: boolean;
    theme: "none" | "phosphor" | "amber" | "paper";
    curvature: number;
    scanlines: boolean;
    showVolume: boolean;
    volumeFraction: number;
    slotW: number;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
export default _default;
