# Changelog

## [0.1.5] — 2026-05-31

### Fixed

- **`License: none` on npmjs.com.** `package.json` was missing the `license` field, so the npm registry reported the package as unlicensed even though the LICENSE file (MIT) is in the repo and ships in the tarball. Added `"license": "MIT"` plus the standard discoverability metadata: `author`, `repository`, `bugs`, `homepage`, `keywords`. The shields.io license badge will resolve to `MIT` once the registry CDN propagates.

---

## [0.1.4] — 2026-05-31

### Fixed

- **README rendering on npmjs.com.** The hero image and `ROADMAP.md` / `CONTRIBUTING.md` links used repo-relative paths (`docs/hero.png`, `ROADMAP.md`, etc.). These resolve fine on GitHub but break on npmjs.com because none of those files ship in the tarball (`files: ["dist"]` excludes them by design — the 1.5 MB hero image shouldn't be a transport cost for every install). All three links are now absolute `github.com` / `raw.githubusercontent.com` URLs.

### Note on prior versions

`@stratchai/cathode` was first published to the npm registry as **v0.1.0 on 2026-05-31**. The internal versions 0.1.0, 0.1.1, 0.1.2, 0.1.3 below describe pre-publish CHANGELOG milestones — all of that code shipped together as the public v0.1.0 release.

---

## [0.1.3] — 2026-04-17

### Fixed

- **`CathodeGrid.vue` — WebGL context loss recovery** — browsers can lose the WebGL context under GPU pressure or after rapid repeated rendering (e.g. a resize storm). Previously the canvas would go permanently blank with no recovery path short of a hard page reload. Added `webglcontextlost` / `webglcontextrestored` event listeners on the canvas element: `contextlost` calls `e.preventDefault()` to signal the browser it should restore the context; `contextrestored` disposes the dead renderer and calls `initThree()` to rebuild the scene, texture, material, and camera from scratch. Both listeners are cleaned up in `onUnmounted`.

---

## [0.1.2] — 2026-04-16

### Fixed

- **`CathodeGrid.vue` — filter popup closed immediately on open** — clicking the filter icon emitted a click event that bubbled to the `onDocClick` document listener, which closed the popup in the same tick it was opened. Fixed by calling `e.stopPropagation()` on the filter icon click before toggling the popup.

- **`CathodeGrid.vue` — filter popup missing CSS class** — the filter popup `<div>` was missing its `cathode-filter-popup` class, so `closest('.cathode-filter-popup')` in `onDocClick` never matched and the popup closed on any click inside it. Class added; click listener moved to bubble phase so it fires after the stopPropagation guard.

---

## [0.1.1] — 2026-04-14 — Font, fallback, and resize fixes

### Added

- **`CathodeGrid.vue` — graceful 2D fallback** — when the WebGL context is unavailable (sandboxed GPU, headless environment), the grid now falls back to a direct 2D canvas blit instead of rendering nothing. `webglFailed` flag gates the render path; `sizeToContainer` and `redraw` both handle the fallback case.

- **`CathodeGrid.vue` — `gridApi.resize()`** — exposes `resize()` on the public `GridApi` so host components can trigger `sizeToContainer()` directly, bypassing the ResizeObserver settle delay. Useful when a panel drag ends and the container's final size is known.

- **`cathode.css` — paper theme** — Perplexity-inspired flat light theme: white background, quiet borders, crisp dark text. Added alongside the existing `phosphor` and `amber` CRT themes. Vignette and scanline effects are suppressed for `paper`.

### Fixed

- **`CathodeGrid.vue` — canvas CSS sizing conflict** — removed `width`/`height` CSS rules from `.cathode-canvas`. `renderer.setSize()` owns the canvas dimensions via inline styles; CSS-based sizing caused the old pixel buffer to stretch visibly between a container resize and the ResizeObserver correction.

- **`CathodeGrid.vue` / `CanvasGrid.ts` — font rendering** — replaced `Courier New` / `monospace` with `system-ui, -apple-system, sans-serif` across all grid canvas rendering for `default` and `paper` themes. `phosphor` and `amber` themes retain Courier for the CRT aesthetic.

---

## [0.1.0] — 2026-04-11 — Initial release

### Added

- **`CathodeGrid.vue`** — WebGL-accelerated canvas datagrid with CRT aesthetics. Features: Three.js barrel-distortion shader (0–45 curvature), scanline overlay, vignette, column sort/filter/resize, keyboard navigation, pagination (auto-fit to container height), pinned bottom rows, right-click context menu for display options, copy-to-clipboard on selected cell.

- **Themes** — `none` (inherits CSS vars), `phosphor` (green CRT), `amber` (amber CRT), `paper` (flat light).

- **`GridApi`** — `setGridOption`, `getColumnState`, `applyColumnState`, `setFilterModel`, `getFilterModel`, `onFilterChanged`, `refreshCells`, `exportDataAsCsv`, `resize`, `resetColumnState`.

- **`CanvasGrid.ts`** — 2D canvas draw primitives: header row, body rows, sort indicators, filter icons, hover/selected row highlight, cell style support, barrel-distortion hit-test mapping.

- **`dist/`** — pre-built ESM (`cathode.js`) and UMD (`cathode.umd.cjs`) bundles committed so `npm install` from GitHub resolves the package entry point without a build step.
