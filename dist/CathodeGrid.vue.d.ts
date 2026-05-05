import type { CSSProperties } from 'vue';
import type { ColDef, GridApi } from './types';
import './cathode.css';
type __VLS_Props = {
    columnDefs: ColDef[];
    rowData?: any[];
    rowHeight?: number;
    defaultColDef?: Partial<ColDef>;
    getRowStyle?: (p: {
        data: any;
        node: any;
    }) => CSSProperties | undefined;
    pinnedBottomRowData?: any[];
    pagination?: boolean;
    paginationPageSize?: number;
    /** 'none' inherits parent CSS vars; 'phosphor' | 'amber' | 'paper' are built-in */
    theme?: 'none' | 'phosphor' | 'amber' | 'paper';
    /**
     * 0–45  barrel-distortion strength.
     * Higher = more panoramic CRT curve; edge columns compress so more fits.
     */
    curvature?: number;
    scanlines?: boolean;
    glow?: boolean;
    /**
     * Lens-on-hover mode. When true, mousing over the grid magnifies a circular
     * region under the cursor at ~2.5× with smoothstep falloff to 1× at the edge.
     * Hit-testing uses raw pixel coordinates (not the magnified visual position),
     * which matches the existing grid's behaviour under barrel curvature.
     */
    magnify?: boolean;
};
declare const _default: import("vue").DefineComponent<__VLS_Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    "grid-ready": (args_0: {
        api: GridApi;
    }) => any;
    "row-clicked": (args_0: {
        data: any;
        event: MouseEvent;
    }) => any;
    "cell-selected": (args_0: {
        data: any;
        row: number;
        col: number;
        colId: string;
    }) => any;
    "column-resized": () => any;
    "sort-changed": () => any;
    "filter-changed": () => any;
}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{
    "onGrid-ready"?: ((args_0: {
        api: GridApi;
    }) => any) | undefined;
    "onRow-clicked"?: ((args_0: {
        data: any;
        event: MouseEvent;
    }) => any) | undefined;
    "onCell-selected"?: ((args_0: {
        data: any;
        row: number;
        col: number;
        colId: string;
    }) => any) | undefined;
    "onColumn-resized"?: (() => any) | undefined;
    "onSort-changed"?: (() => any) | undefined;
    "onFilter-changed"?: (() => any) | undefined;
}>, {
    rowData: any[];
    rowHeight: number;
    glow: boolean;
    pagination: boolean;
    paginationPageSize: number;
    theme: "none" | "phosphor" | "amber" | "paper";
    curvature: number;
    scanlines: boolean;
    magnify: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
export default _default;
