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

## Phase 2 — CurvedFrame  ✗ dropped (2026-04-30)

Originally planned as a CSS-based slot container with bezel + scanlines
+ vignette + curvature for arbitrary HTML. Built and reviewed; dropped
on the same day for two reasons:

  1. **CSS cannot truly curve live HTML.** `rotateX` / `perspective`
     foreshorten a flat plane (top edge tilts back) but do not bend
     it — the visual effect on real content read as "shrink", not
     "bulge". True barrel distortion requires render-to-texture,
     which kills interactivity. The roadmap already noted this
     ("Not true barrel, but convincing at low values"); the actual
     output was less convincing than predicted.
  2. **The aesthetic was already in CathodeContainer.** Inspection
     revealed the existing CathodeContainer.vue scoped CSS already
     applies scanlines (`.cc::after`), curvature-driven vignette
     (`.cc::before`), glass shine, and bezel border-radius scaling
     in production — making CurvedFrame a near-pure duplicate.

The "non-window CRT shell" use case that motivated the component
doesn't exist in the dashboard — every panel is already wrapped in
a CathodeContainer. Component, demo tab, and tests removed in the
same commit; index export unwired.

If a future need for a chrome-less CRT shell appears, the path
forward is a `<CathodeContainer chromeless>` prop that suppresses
the title bar + drag handles, NOT a separate component.

---

## Phase 3 — CathodeKLine  ← in progress

A native canvas OHLCV candlestick chart with the full WebGL shader pipeline
(barrel distortion, scanlines, glow) — the same architecture as CathodeGrid
and CathodeLog. Component renamed from "CurvedKLine" → "CathodeKLine" for
naming consistency.

> **Why native canvas and not a chart library wrapper?**
> Existing libraries (lightweight-charts, klinechart) render to their own
> canvas or SVG. Applying the barrel shader requires owning the canvas.
> Wrapping introduces a layout boundary that makes shader sizing unreliable.

### PR 1 — foundation  ✓ (2026-04-30)

| # | Item | Status |
|---|------|--------|
| 1 | `OHLCVCandle` type + `KLineColors` palette + `KLINE_THEME_COLORS` for none/paper/phosphor/amber | ✓ done |
| 2 | `drawKLine` pure renderer — candles + wicks + volume bars | ✓ done |
| 3 | `CathodeKLine.vue` Vue wrapper — Three.js + barrel-shader pipeline (mirrors CathodeLog) | ✓ done |
| 4 | Demo KLine tab + 300-bar synthetic OHLCV generator | ✓ done |
| 5 | Playwright suite: render smoke + viewport sweep + curvature drag | ✓ done (3 tests) |
| 6 | Index exports for component + types | ✓ done |

### PR 2 — interactions + integration  ← next

| # | Item | Notes |
|---|------|-------|
| 1 | Mouse wheel zoom (slot width interpolation) | |
| 2 | Click-drag pan (horizontal scroll through candles) | |
| 3 | Crosshair + price/time readout on hover | |
| 4 | Price axis (right edge) — labels at major price levels | |
| 5 | Time axis (bottom edge) — auto-scaled to interval | |
| 6 | `dashboard/ChartPanel` integration — replace klinecharts | Validate: trade markers, focused-product switching, candle stream updates |

### Phase 3 → done when
- CathodeKLine exported from cathode index
- ChartPanel in dashboard uses it (klinecharts dep removed)
- Zoom, pan, crosshair all working
- WebGL fallback (2D blit) works as it does for CathodeGrid / CathodeLog

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
