/**
 * CanvasGrid.ts — canvas2d grid renderer for cathode
 *
 * Draws the full grid (header + rows + pinned) to an HTMLCanvasElement.
 * The canvas is used as a THREE.CanvasTexture fed to the barrel-distortion shader.
 */
import type { CSSProperties } from 'vue';
import type { ResolvedCol } from './types';
export interface GridColors {
    bg: string;
    headerBg: string;
    text: string;
    textHeader: string;
    border: string;
    accent: string;
    rowAlt: string;
}
export declare const THEME_COLORS: Record<string, GridColors>;
export declare const HEADER_H = 30;
export interface DrawGridOpts {
    cols: ResolvedCol[];
    rows: any[];
    pinnedRows: any[];
    rowHeight: number;
    scrollY: number;
    scrollX: number;
    theme: string;
    glow: boolean;
    sortColId: string | null;
    sortDir: 'asc' | 'desc' | null;
    colFilters: Record<string, string>;
    hoveredRow: number;
    selectedRow: number;
    selectedCol: number;
    /**
     * Anchor of the selection range. The selection rectangle spans from
     * (selectionAnchorRow, selectionAnchorCol) to (selectedRow, selectedCol).
     * When the anchor equals the active cell (or is -1), selection is a
     * single cell. Excel-style: shift-arrow / shift-click moves only the
     * active cell, leaving the anchor in place.
     */
    selectionAnchorRow?: number;
    selectionAnchorCol?: number;
    formatCell: (col: ResolvedCol, row: any) => string;
    getCellStyle: (col: ResolvedCol, row: any) => CSSProperties;
}
export declare function drawGrid(canvas: HTMLCanvasElement, opts: DrawGridOpts): void;
/**
 * Forward barrel formula — same as the GLSL shader.
 * UV: x∈[0,1] left→right, y∈[0,1] bottom→top (Three.js convention).
 */
export declare function applyBarrel(uvX: number, uvY: number, strength: number): [number, number];
/**
 * Map a screen pixel (sx, sy — y=0 at top of canvas element) to the
 * offscreen canvas2d coordinate that is visually displayed there.
 * Returns [-1,-1] when the position is in the black bezel region.
 */
export declare function screenToCanvas(sx: number, sy: number, W: number, H: number, strength: number): [number, number];
/** Canvas-space left edge of column ci (scrollX removed — always 0) */
export declare function colLeft(ci: number, cols: ResolvedCol[]): number;
/** Is canvas x over the filter icon (right 24px) of a column? */
export declare function isOnFilterIcon(cx: number, colStartX: number, colWidth: number): boolean;
/** Is canvas x over the resize handle (right 6px) of a column? */
export declare function isOnResizeHandle(cx: number, colStartX: number, colWidth: number): boolean;
/** Hit-test a canvas-space coordinate → grid location */
export declare function hitTest(cx: number, cy: number, cols: ResolvedCol[], rowCount: number, rowHeight: number, scrollY: number, canvasH: number, pinnedCount: number, scrollX: number): {
    area: 'header' | 'body' | 'pinned' | 'none';
    colIdx: number;
    rowIdx: number;
};
