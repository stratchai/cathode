# cathode

> A retro CRT curved-screen datagrid for the web.  
> Barrel-distorted columns, phosphor aesthetics, more data per viewport.

---

## Why

Flat datagrids waste peripheral vision. A curved screen — like a real CRT monitor — angles the
left and right columns toward the viewer, creating a panoramic effect that lets you comfortably
read more columns without horizontal eye strain. Edge columns are also slightly foreshortened,
fitting 10–15% more content at the same viewport width.

The effect is pure CSS 3D (`perspective` + `rotateY` per column). Text stays real DOM —
selectable, copyable, accessible.

---

## Quick start

```bash
npm install @stratchai/cathode
```

```vue
<script setup lang="ts">
import { CathodeGrid } from '@stratchai/cathode'
import '@stratchai/cathode/style'
import type { ColDef, GridApi } from '@stratchai/cathode'

const cols: ColDef[] = [
  { field: 'ticker',   headerName: 'Ticker',  width: 90 },
  { field: 'price',    headerName: 'Price',   width: 100, cellStyle: { textAlign: 'right' } },
  { field: 'pnl',      headerName: 'PnL %',   width: 80  },
]

let api: GridApi

function onGridReady(e: { api: GridApi }) {
  api = e.api
  api.setGridOption('rowData', myRows)
}
</script>

<template>
  <CathodeGrid
    :column-defs="cols"
    :row-height="28"
    theme="phosphor"
    :curvature="12"
    :scanlines="true"
    :glow="true"
    :pagination="true"
    :pagination-page-size="50"
    @grid-ready="onGridReady"
    @row-clicked="e => console.log(e.data)"
  />
</template>
```

---

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `columnDefs` | `ColDef[]` | required | Column definitions |
| `rowData` | `any[]` | `[]` | Initial row data (use `api.setGridOption('rowData', …)` to update) |
| `rowHeight` | `number` | `28` | Row height in px |
| `defaultColDef` | `Partial<ColDef>` | `{}` | Merged into every column definition |
| `getRowStyle` | `(p) => CSSProperties` | — | Per-row inline style callback |
| `pinnedBottomRowData` | `any[]` | — | Rows pinned to the bottom of the scroll area |
| `pagination` | `boolean` | `false` | Enable pagination bar |
| `paginationPageSize` | `number` | `50` | Rows per page |
| `theme` | `'none' \| 'phosphor' \| 'amber' \| 'paper'` | `'none'` | Built-in colour theme (`'none'` inherits parent CSS vars) |
| `curvature` | `number` | `10` | Max `rotateY` angle (°) for edge columns — `0` = flat |
| `perspective` | `number` | `1400` | CSS perspective distance (px) — higher = subtler vanishing point |
| `scanlines` | `boolean` | `true` | Overlay repeating scanline gradient |
| `glow` | `boolean` | `true` | Apply `text-shadow` phosphor glow to cell text |

---

## Grid API

Emitted via `@grid-ready`. Mirrors the ag-Grid Community API surface used in typical dashboards.

```ts
api.setGridOption('rowData', rows)
api.setGridOption('pinnedBottomRowData', pinnedRows)
api.setGridOption('quickFilterText', 'BTC')

api.getColumnState()                   // → ColState[]
api.applyColumnState({ state, applyOrder })
api.setFilterModel({ status: { type: 'equals', filter: 'open' } })
api.getFilterModel()
await api.setColumnFilterModel('status', { type: 'equals', filter: 'open' })
api.onFilterChanged()                  // no-op — Vue reactivity handles it

api.refreshCells()                     // force re-evaluation (e.g. Age column)
api.exportDataAsCsv({ fileName: 'trades.csv' })
api.resetColumnState()
```

---

## ColDef

```ts
interface ColDef {
  field?:          string           // row[field]
  headerName?:     string
  colId?:          string           // explicit ID; defaults to field → headerName slug
  width?:          number
  minWidth?:       number
  sortable?:       boolean
  filter?:         boolean          // shows ⌕ icon in header → popup text filter
  resizable?:      boolean
  hide?:           boolean
  sort?:           'asc' | 'desc'   // initial sort
  valueGetter?:    (p) => any
  valueFormatter?: (p) => string
  cellStyle?:      CSSProperties | ((p) => CSSProperties)
  cellRenderer?:   (p) => string    // HTML string rendered via v-html
  comparator?:     (a, b) => number
}
```

---

## Themes

| Theme | Background | Text | Use for |
|-------|-----------|------|---------|
| `none` (default) | inherits `--c-bg` CSS var | inherits `--c-tx1` | Drop into an existing dashboard |
| `phosphor` | `#060d06` | `#33ff33` | Classic green CRT terminal |
| `amber` | `#0a0700` | `#ffb000` | Amber phosphor |
| `paper` | `#f6f6f6` | `#222` | Light / Lumen-style |

### CSS custom properties (`theme="none"`)

If no theme is set, the grid reads these variables from its parent — making it a natural
fit alongside the dashboard's existing `:root` / `html.light` token system:

```
--c-bg, --c-surface, --c-header, --c-tx1, --c-tx2, --c-tx4,
--c-border, --c-input
```

---

## Roadmap

The target feature parity is ag-Grid Community Edition. Priority order:

- [ ] Virtual scrolling (TanStack Virtual) for 10k+ row datasets
- [ ] Column pinning (left / right freeze)
- [ ] Column drag-to-reorder
- [ ] Multi-column sort
- [ ] Row grouping / aggregation
- [ ] Column visibility chooser panel
- [ ] React and Web Component wrappers
- [ ] Smooth barrel-distortion via WebGL post-pass (opt-in, replaces CSS faceting)
- [ ] CRT bezel / frame component

---

## Development

```bash
git clone https://github.com/stratchai/cathode
cd cathode
npm install
npm run dev          # demo app at http://localhost:5173
npm run build        # library → dist/
npm run typecheck
```

## Regression tests

Headless Playwright suite that drives the demo. Each test exists to lock
in a specific bug class — when a fix lands, a test goes with it. Run on
every change before pushing:

```bash
npm test             # headless
npm run test:headed  # watch the browser
npm run test:debug   # step through with inspector (PWDEBUG=1)
```

The current suite covers:

| Test | Bug class it guards |
|------|--------------------|
| `grid-resize.spec.ts` | `GL_INVALID_VALUE: glTexSubImage2DRobustANGLE: Offset overflows texture dimensions` (CanvasTexture not reallocated when offCanvas grows). Sweeps viewport sizes through grow + shrink cycles, asserts the GL warning never appears. |

The `tests/_helpers.ts` `collectConsoleErrors` helper is the reusable
pattern for new tests — subscribe at start, sweep the page, assert at end.

---

## License

MIT — © stratchai
