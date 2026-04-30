# stratchai/cathode — Roadmap

> **Purpose.** A CRT-styled Vue 3 component library for financial UIs.
> The defining aesthetic: barrel-distorted canvas controls that look like
> terminals from a trading floor. Built to be consumed by `stratchai/dashboard`
> and eventually published as a public npm package.
>
> Every component must degrade gracefully when WebGL is unavailable.

---

## Priority

**core → dashboard → cathode.**
New cathode features are only started after dashboard stability issues are clear.

---

## How to use this document

Find the current phase. Work the **top unresolved item**. One at a time.

---

## Phase 1 — Stability  ✓ (completed 2026-04-14)

| # | Item | Status |
|---|------|--------|
| 1 | WebGL 2D fallback — grids blank when GPU sandboxed | ✓ done |
| 2 | Filter popup missing class — dismissed on input click | ✓ done |
| 3 | Capture-phase click listener — checkboxes not toggling | ✓ done |
| 4 | `onGridReady` event signature mismatch with consumers | ✓ done |

---

## Phase 1.5 — CathodeLog + interaction test suite  ✓ (completed 2026-04-29)

Off-roadmap additions discovered while integrating with dashboard.

| # | Item | Notes |
|---|------|-------|
| 1 | `CathodeLog` component — canvas-rendered scrolling log/terminal | Same Three.js + barrel-shader pipeline as CathodeGrid. Entry shape `{ ts?, text, level? }` with level-based coloring (info/warn/error/debug/success), word wrap, stick-to-bottom autoscroll, ring-buffer cap. Read-only PR (1 of 2); optional command-prompt input deferred to PR 2. |
| 2 | Drag-rate Playwright suite (9 tests) | `grid-resize.spec.ts`, `log-resize.spec.ts`, `grid-interaction.spec.ts`, `workspace-interaction.spec.ts`. Mouse-driven at 60Hz with `webglcontextlost` instrumentation + canvas-screenshot byte-floor checks. |
| 3 | CathodeContainer curvature-drag context-loss fix | Removed `watch(() => props.curvature, () => resizeKey++)` — at slider-drag rate it was forcing slot children to remount, churning WebGL contexts, and the browser was evicting the visible Log's context. |

---

## Phase 2 — CurvedFrame  ← next

A generic slot-based container that gives any child content the CRT aesthetic:
bezel, scanline overlay, vignette, and optional glow. Works with live HTML
(no WebGL required for the container itself — CSS-based effects only).

> **Why CSS and not the WebGL shader?**
> Barrel-distorting live HTML requires render-to-texture, which kills
> interactivity. The WebGL shader pipeline is reserved for fully-canvas
> controls (CathodeGrid, CurvedKLine) where we own every pixel.
> CurvedFrame achieves the visual language through CSS `perspective`,
> a scanline pseudo-element overlay, and a vignette gradient.

| # | Item | Notes |
|---|------|-------|
| 1 | `CurvedFrame` component — bezel + scanline + vignette CSS shell | Props: `scanlines`, `glow`, `theme` |
| 2 | Curvature approximation via CSS `perspective` + slight `rotateX` | Not true barrel, but convincing at low values |
| 3 | Keyboard shortcut pass-through (Cmd+=/- curvature) | Same UX as CathodeGrid |
| 4 | Right-click context menu (scanlines / glow toggles) | Consistent with CathodeGrid |
| 5 | `dashboard/FleetPanel` integration test | Ship this before merging |

### Phase 2 → done when
- `CurvedFrame` exported from cathode index
- FleetPanel in dashboard uses it and looks correct
- No interactivity regressions inside the frame
- TypeScript props fully typed

---

## Phase 3 — CurvedKLine

A native canvas OHLCV candlestick chart with the full WebGL shader pipeline
(barrel distortion, scanlines, glow) — the same architecture as CathodeGrid.

> **Why native canvas and not a chart library wrapper?**
> Existing libraries (lightweight-charts, klinechart) render to their own
> canvas or SVG. Applying the barrel shader requires owning the canvas.
> Wrapping introduces a layout boundary that makes shader sizing unreliable.

| # | Item | Notes |
|---|------|-------|
| 1 | OHLCV data type + props interface | `candles: OHLCV[]`, `interval`, `theme` |
| 2 | Canvas renderer — candles, wicks, volume bars, crosshair | Port draw logic from existing ChartPanel patterns |
| 3 | WebGL shader pass (reuse CathodeGrid barrel/scanline/glow uniforms) | Shared shader module |
| 4 | Zoom + pan (mouse wheel + drag) | |
| 5 | Price axis + time axis labels | |
| 6 | `dashboard/ChartPanel` integration test | Replace existing chart |

### Phase 3 → done when
- `CurvedKLine` exported from cathode index
- ChartPanel in dashboard uses it
- Zoom, pan, crosshair all working
- WebGL fallback (2D blit) works as it does for CathodeGrid

---

## Phase 4 — Test Suite + Publish Prep

Phase 1.5's Playwright suite (drag-rate interaction tests) substantially
covers item #2. Pure-math unit tests (item #1) are still pending — they
catch regressions in barrel math and hit-test geometry without needing
a browser.

| # | Item | Status |
|---|------|--------|
| 1 | Unit tests — barrel math, hit-test geometry, `sizeToContainer` | pending (Vitest, no DOM) |
| 2 | Component / integration tests — render smoke + drag-rate regression | ✓ partial (Phase 1.5 Playwright suite covers grid + log + container drag) |
| 3 | GitHub Actions CI — run tests on every push to main | pending |
| 4 | Semver tagging — v1.0.0 | Requires Phase 2–3 complete |
| 5 | `package.json` publish prep — `files`, `exports`, `peerDeps` | pending |
| 6 | README — component API docs, screenshots, install instructions | pending |
| 7 | `npm publish` to public registry | pending |

### Phase 4 → done when
- `npm install @stratchai/cathode` works from a fresh project
- All three components documented with prop tables
- CI green

---

## Guiding principles

1. **Degrade gracefully.** Every component must work without WebGL.
2. **Own the canvas.** Don't wrap third-party rendering — own every pixel.
3. **Tests before enhancements.** Phase 4 test suite must exist before any v1.1 work.
4. **Dashboard is the integration test.** If it breaks in dashboard, it's a cathode bug.
