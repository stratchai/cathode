import type { CSSProperties } from 'vue';
export interface ValueGetterParams<T = any> {
    data: T;
    colDef: ColDef<T>;
}
export interface ValueFormatterParams<T = any> {
    value: any;
    data: T;
    colDef: ColDef<T>;
}
export interface CellStyleParams<T = any> {
    value: any;
    data: T;
    colDef: ColDef<T>;
}
export interface CellRendererParams<T = any> {
    value: any;
    data: T;
    colDef: ColDef<T>;
}
export interface ColDef<T = any> {
    /** Dot-path or top-level field name on each row object */
    field?: string;
    /** Display label in the column header */
    headerName?: string;
    /** Explicit column ID; defaults to field → headerName slug */
    colId?: string;
    width?: number;
    minWidth?: number;
    maxWidth?: number;
    sortable?: boolean;
    filter?: boolean;
    resizable?: boolean;
    hide?: boolean;
    /** Initial sort direction */
    sort?: 'asc' | 'desc' | null;
    valueGetter?: (params: ValueGetterParams<T>) => any;
    valueFormatter?: (params: ValueFormatterParams<T>) => string;
    /** Inline styles for data cells — object or function */
    cellStyle?: CSSProperties | ((params: CellStyleParams<T>) => CSSProperties | null | undefined);
    /**
     * Custom cell renderer.
     * Return an HTML string (rendered via v-html) or null to fall back to
     * the formatted value.
     */
    cellRenderer?: (params: CellRendererParams<T>) => string | null;
    /** Custom sort comparator — (aValue, bValue) => -1|0|1 */
    comparator?: (a: any, b: any) => number;
    /**
     * Aggregator applied to this column's values across all currently-filtered
     * rows. Result renders in a sticky aggregate row at the bottom of the grid
     * and recomputes whenever the filter / sort / quick-filter change.
     *
     *   - 'sum'   — total of numeric values
     *   - 'avg'   — arithmetic mean of numeric values
     *   - 'min'   — smallest value (numeric or string)
     *   - 'max'   — largest value (numeric or string)
     *   - 'count' — number of rows contributing a non-null value
     *
     * Or pass a custom function — receives the raw values from each row's
     * `valueGetter` / `field` lookup and returns whatever should render.
     */
    aggFunc?: 'sum' | 'avg' | 'min' | 'max' | 'count' | ((values: any[]) => any);
    /** Format the aggregate result for display. Falls back to String(v). */
    aggValueFormatter?: (value: any) => string;
}
export interface ColState {
    colId: string;
    hide?: boolean;
    sort?: 'asc' | 'desc' | null;
    sortIndex?: number | null;
    width?: number;
}
export interface GridApi {
    setGridOption(key: 'rowData', value: any[]): void;
    setGridOption(key: 'pinnedBottomRowData', value: any[]): void;
    setGridOption(key: 'quickFilterText', value: string): void;
    setGridOption(key: string, value: any): void;
    getColumnState(): ColState[];
    applyColumnState(params: {
        state: ColState[];
        applyOrder?: boolean;
    }): void;
    setFilterModel(model: Record<string, any> | null): void;
    getFilterModel(): Record<string, any>;
    /** ag-Grid compat: set a single column's filter model (returns Promise) */
    setColumnFilterModel(colId: string, model: any | null): Promise<void>;
    /** No-op shim — Cathode's reactive system handles filter propagation */
    onFilterChanged(): void;
    /** Force re-evaluation of cell computed values (e.g., Age column) */
    refreshCells(params?: {
        columns?: string[];
        force?: boolean;
    }): void;
    exportDataAsCsv(params?: {
        fileName?: string;
    }): void;
    resetColumnState(): void;
    /** Immediately re-measure the container and resize the WebGL canvas.
     *  Call this when the parent container is resized programmatically
     *  (e.g. a draggable panel) so the ResizeObserver delay is bypassed. */
    resize(): void;
}
export interface GridReadyEvent {
    api: GridApi;
}
export interface RowClickedEvent {
    data: any;
    event: MouseEvent;
}
export interface ResolvedCol {
    colId: string;
    colDef: ColDef;
    width: number;
}
