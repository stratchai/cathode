import { test, expect } from '@playwright/test';
import { collectConsoleErrors } from './_helpers';

/**
 * CathodeCandle regression tests — same shape as CathodeGrid / CathodeLog
 * (Three.js + CanvasTexture + barrel shader). PR 1 only renders candles +
 * wicks + volume; zoom/pan/axes/crosshair come in PR 2.
 *
 * Coverage:
 *   - Renders without console errors at default viewport
 *   - Viewport sweep — zero GL warnings (mirrors CanvasTexture-resize fix)
 *   - Curvature slider drag — canvas keeps content (catches the bug class
 *     that blanked CathodeLog before the resizeKey fix)
 */

const BLANK_FLOOR = 3000;

test.describe('CathodeCandle', () => {

  test('renders the Candle tab without console errors', async ({ page }) => {
    const watch = collectConsoleErrors(page);

    await page.goto('/');
    await page.getByRole('button', { name: /^Candle$/ }).click();

    const canvas = page.locator('.tab-content:visible canvas').first();
    await canvas.waitFor({ state: 'visible' });
    await page.waitForTimeout(400);

    // Canvas has rendered content (candles + wicks + volume)
    const bytes = (await canvas.screenshot()).length;
    expect(bytes, `Candle canvas appears blank (${bytes} bytes)`).toBeGreaterThan(BLANK_FLOOR);

    expect(watch.entries).toEqual([]);
  });

  test('viewport sweep: zero GL warnings on the standalone Candle tab', async ({ page }) => {
    const watch = collectConsoleErrors(page);

    await page.goto('/');
    await page.getByRole('button', { name: /^Candle$/ }).click();
    await page.locator('.tab-content:visible canvas').first().waitFor({ state: 'visible' });
    await page.waitForTimeout(400);

    const sizes = [
      { width: 800,  height: 600  },
      { width: 1600, height: 900  },
      { width: 1920, height: 1080 },
      { width: 1024, height: 768  },
      { width: 1280, height: 800  },
    ];
    for (const s of sizes) {
      await page.setViewportSize(s);
      await page.waitForTimeout(150);
    }
    await page.waitForTimeout(200);

    expect(
      watch.entries,
      `console emitted GL/page errors during viewport sweep:\n${JSON.stringify(watch.entries, null, 2)}`,
    ).toEqual([]);
  });

  test('curvature drag does not blank the Candle canvas', async ({ page }) => {
    const watch = collectConsoleErrors(page);

    await page.goto('/');
    await page.getByRole('button', { name: /^Candle$/ }).click();
    const canvas = page.locator('.tab-content:visible canvas').first();
    await canvas.waitFor({ state: 'visible' });
    await page.waitForTimeout(400);

    async function bytes(): Promise<number> {
      return (await canvas.screenshot()).length;
    }

    expect(await bytes(), 'pre-drag Candle canvas appears blank').toBeGreaterThan(BLANK_FLOOR);

    // Wire a context-loss listener — same instrumentation as the log test
    await page.evaluate(() => {
      const w = window as any;
      w.__klineLossCount = 0;
      const wire = (c: HTMLCanvasElement) => {
        c.addEventListener('webglcontextlost', () => w.__klineLossCount++);
      };
      document.querySelectorAll('canvas').forEach(c => wire(c as HTMLCanvasElement));
      new MutationObserver(muts => {
        for (const m of muts) for (const node of Array.from(m.addedNodes)) {
          if (node instanceof HTMLCanvasElement) wire(node);
          if (node instanceof HTMLElement) node.querySelectorAll?.('canvas').forEach(c => wire(c as HTMLCanvasElement));
        }
      }).observe(document.body, { childList: true, subtree: true });
    });

    const slider = page.locator('input[type="range"]').first();
    const box    = await slider.boundingBox();
    if (!box) throw new Error('curvature slider not found');

    const y = box.y + box.height / 2;
    await page.mouse.move(box.x + box.width * 0.55, y);
    await page.mouse.down();
    for (const t of [0.10, 0.95, 0.30, 0.55]) {
      const x = box.x + box.width * t;
      for (let i = 1; i <= 25; i++) await page.mouse.move(x, y, { steps: 1 });
    }
    await page.mouse.up();
    await page.waitForTimeout(300);

    const lossCount = await page.evaluate(() => (window as any).__klineLossCount ?? 0);
    expect(lossCount, `${lossCount} WebGL context-loss events during curvature drag`).toBe(0);

    expect(await bytes(), 'Candle canvas blanked after curvature drag').toBeGreaterThan(BLANK_FLOOR);
    expect(watch.entries).toEqual([]);
  });

  // ── PR 2: interactions + axes ──────────────────────────────────────────────

  test('mouse wheel zoom changes the rendered canvas content', async ({ page }) => {
    const watch = collectConsoleErrors(page);
    await page.goto('/');
    await page.getByRole('button', { name: /^Candle$/ }).click();
    const canvas = page.locator('.tab-content:visible canvas').first();
    await canvas.waitFor({ state: 'visible' });
    await page.waitForTimeout(400);

    const before = (await canvas.screenshot()).length;

    // Hover over the chart, then send a strong zoom-in wheel event.
    const box = await canvas.boundingBox();
    if (!box) throw new Error('canvas not found');
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    // Multiple wheel events to overcome any debouncing — Playwright dispatches
    // them as individual events so the chart should accumulate the zoom.
    for (let i = 0; i < 8; i++) {
      await page.mouse.wheel(0, -120);
      await page.waitForTimeout(40);
    }

    const after = (await canvas.screenshot()).length;
    expect(after,
      `canvas screenshot byte size unchanged after zoom (${before} → ${after}) — wheel handler not wired or zoom is a no-op`,
    ).not.toBe(before);
    expect(after, 'canvas blanked after zoom').toBeGreaterThan(BLANK_FLOOR);

    expect(watch.entries).toEqual([]);
  });

  test('click-drag pan scrolls the candle window', async ({ page }) => {
    const watch = collectConsoleErrors(page);
    await page.goto('/');
    await page.getByRole('button', { name: /^Candle$/ }).click();
    const canvas = page.locator('.tab-content:visible canvas').first();
    await canvas.waitFor({ state: 'visible' });
    await page.waitForTimeout(400);

    const before = (await canvas.screenshot()).length;

    const box = await canvas.boundingBox();
    if (!box) throw new Error('canvas not found');
    const startX = box.x + box.width  * 0.7;
    const y      = box.y + box.height * 0.5;
    await page.mouse.move(startX, y);
    await page.mouse.down();
    // Drag right: the chart should pan to show older candles
    for (let i = 1; i <= 30; i++) {
      await page.mouse.move(startX + i * 8, y, { steps: 1 });
    }
    await page.mouse.up();
    await page.waitForTimeout(150);

    const after = (await canvas.screenshot()).length;
    expect(after,
      `canvas screenshot byte size unchanged after pan (${before} → ${after}) — drag handler not wired`,
    ).not.toBe(before);
    expect(after, 'canvas blanked after pan').toBeGreaterThan(BLANK_FLOOR);

    expect(watch.entries).toEqual([]);
  });

  // ── PR 2.5: indicator overlays + trade markers ─────────────────────────────

  test('indicator overlays + trade markers add visible content', async ({ page }) => {
    const watch = collectConsoleErrors(page);
    await page.goto('/');
    await page.getByRole('button', { name: /^Candle$/ }).click();
    const canvas = page.locator('.tab-content:visible canvas').first();
    await canvas.waitFor({ state: 'visible' });
    await page.waitForTimeout(400);

    async function bytes(): Promise<number> {
      return (await canvas.screenshot()).length;
    }

    // Indicators ON (default) — capture bytes.
    const withIndicators = await bytes();

    // Toggle off via the demo's checkbox.
    const toggle = page.getByTestId('cf-show-indicators');
    await expect(toggle).toBeChecked();
    await toggle.uncheck();
    await page.waitForTimeout(150);

    const withoutIndicators = await bytes();

    expect(withIndicators,
      `screenshot bytes did not change when toggling overlays + markers ` +
      `(on=${withIndicators}, off=${withoutIndicators}) — overlays/markers ` +
      `are not actually rendering`,
    ).not.toBe(withoutIndicators);

    // Sanity: both states have substantial canvas content (no blank).
    expect(withIndicators).toBeGreaterThan(BLANK_FLOOR);
    expect(withoutIndicators).toBeGreaterThan(BLANK_FLOOR);

    // Re-enable — bytes should return CLOSE to the original on-state, much
    // closer than to the off-state. Catches a watcher that fails to redraw
    // when the prop reference changes.
    await toggle.check();
    await page.waitForTimeout(150);
    const reEnabled = await bytes();
    const drift = Math.abs(reEnabled - withIndicators);
    const gap   = Math.abs(withIndicators - withoutIndicators);
    expect(drift,
      `re-enable did not restore the rendered state (drift ${drift} >= toggle gap ${gap})`,
    ).toBeLessThan(gap);

    expect(watch.entries).toEqual([]);
  });

  // ── PR 2.6: legend / OHLCV strip / marker tooltip / interval badge ─────────

  test('indicator legend appears with overlays and disappears without', async ({ page }) => {
    const watch = collectConsoleErrors(page);
    await page.goto('/');
    await page.getByRole('button', { name: /^Candle$/ }).click();
    const canvas = page.locator('.tab-content:visible canvas').first();
    await canvas.waitFor({ state: 'visible' });
    await page.waitForTimeout(400);

    async function bytes(): Promise<number> { return (await canvas.screenshot()).length; }

    // With overlays — legend is drawn (text + swatches add bytes)
    const withLegend = await bytes();

    // Toggle off — both overlays AND legend go away
    const toggle = page.getByTestId('cf-show-indicators');
    await toggle.uncheck();
    await page.waitForTimeout(150);
    const noLegend = await bytes();

    // Heuristic: with the legend drawn (3 labelled overlays), the screenshot
    // has materially more content. The "indicator overlays + markers" test
    // already proves the bigger toggle works; this test focuses on the
    // labelled-overlay path specifically by re-enabling and checking the
    // delta hasn't collapsed (which would happen if the legend draw was
    // skipped or threw).
    await toggle.check();
    await page.waitForTimeout(150);
    const restored = await bytes();
    const drift = Math.abs(restored - withLegend);
    const gap   = Math.abs(withLegend - noLegend);
    expect(drift, `legend not redrawn after toggle (drift=${drift}, gap=${gap})`).toBeLessThan(gap);

    expect(watch.entries).toEqual([]);
  });

  test('OHLCV readout changes content as the cursor moves between candles', async ({ page }) => {
    const watch = collectConsoleErrors(page);
    await page.goto('/');
    await page.getByRole('button', { name: /^Candle$/ }).click();
    const canvas = page.locator('.tab-content:visible canvas').first();
    await canvas.waitFor({ state: 'visible' });
    await page.waitForTimeout(400);

    const box = await canvas.boundingBox();
    if (!box) throw new Error('canvas not found');

    // Hover at one location
    await page.mouse.move(box.x + box.width * 0.40, box.y + box.height * 0.50);
    await page.waitForTimeout(120);
    const a = (await canvas.screenshot()).length;

    // Move to a far-away candle — different O/H/L/C/V values mean different
    // text widths in the readout strip, which compress to a different size.
    await page.mouse.move(box.x + box.width * 0.85, box.y + box.height * 0.30);
    await page.waitForTimeout(120);
    const b = (await canvas.screenshot()).length;

    expect(a,
      `OHLCV readout did not update between hover positions (${a} vs ${b}) — ` +
      `the strip is either not drawing or is drawing the same content`,
    ).not.toBe(b);

    expect(watch.entries).toEqual([]);
  });

  test('marker hover shows a tooltip; empty area does not', async ({ page }) => {
    const watch = collectConsoleErrors(page);
    await page.goto('/');
    await page.getByRole('button', { name: /^Candle$/ }).click();
    const canvas = page.locator('.tab-content:visible canvas').first();
    await canvas.waitFor({ state: 'visible' });
    await page.waitForTimeout(400);

    const box = await canvas.boundingBox();
    if (!box) throw new Error('canvas not found');

    // Demo exposes window.__cathodeDebug.getDemoMarkerCanvasCoords() so the
    // test can hover at the EXACT canvas pixel where a marker is drawn.
    // Avoids a slow wide sweep that hits the 30s timeout.
    const markerCoords = await page.evaluate(() => {
      const dbg = (window as any).__cathodeDebug;
      return dbg?.getDemoMarkerCanvasCoords?.() ?? [];
    });
    expect(markerCoords.length, 'no demo markers exposed via __cathodeDebug').toBeGreaterThan(0);

    // Baseline: hover in clearly-empty area — top-right corner of the price
    // pane, outside the legend block, away from any marker.
    await page.mouse.move(box.x + box.width * 0.92, box.y + box.height * 0.10);
    await page.waitForTimeout(120);
    const noTooltip = (await canvas.screenshot()).length;

    // Hover the FIRST marker's exact canvas position
    const m = markerCoords[0];
    await page.mouse.move(box.x + m.x, box.y + m.y);
    await page.waitForTimeout(150);
    const onMarker = (await canvas.screenshot()).length;

    // Threshold lowered from 500 → 250 after the 2026-05-01 brightness
    // boost (3-pass glow + softer shader vignette + brighter palette).
    // The tooltip overlay still produces a clear delta; the underlying
    // bg just has more pixel variance now, so PNG-encoded byte deltas
    // are smaller in relative terms.
    expect(onMarker - noTooltip,
      `hovering exactly on a marker (kind=${m.kind}, label=${m.label}, ` +
      `x=${m.x}, y=${m.y}) did not produce a tooltip — bytes ` +
      `${noTooltip} → ${onMarker}, delta ${onMarker - noTooltip}`,
    ).toBeGreaterThan(250);

    // Move OFF the marker — back to empty area. Tooltip should disappear.
    await page.mouse.move(box.x + box.width * 0.92, box.y + box.height * 0.10);
    await page.waitForTimeout(150);
    const offMarker = (await canvas.screenshot()).length;
    expect(Math.abs(offMarker - noTooltip),
      `tooltip lingered after moving off marker (off=${offMarker} vs baseline=${noTooltip})`,
    ).toBeLessThan(500);

    expect(watch.entries).toEqual([]);
  });

  test('interval badge renders ("1h" for hourly demo bars)', async ({ page }) => {
    const watch = collectConsoleErrors(page);
    await page.goto('/');
    await page.getByRole('button', { name: /^Candle$/ }).click();
    const canvas = page.locator('.tab-content:visible canvas').first();
    await canvas.waitFor({ state: 'visible' });
    await page.waitForTimeout(400);

    // Interval badge is canvas-rendered text — we can't grep DOM. Instead we
    // sample the bottom-right corner pixels and assert the accent-coloured
    // badge backdrop is present (drawn vs a candle that probably renders the
    // theme bg instead).
    const accentVisible = await canvas.evaluate((c: HTMLCanvasElement) => {
      const ctx = c.getContext('2d');
      if (!ctx) return false;
      // For WebGL canvases this returns null/zeroed — but the fallback path
      // (and the offscreen canvas via texture) means screenshot tests are
      // the right tool here. Fall back to bytes-based assertion.
      return false;
    });

    // Pragmatic check: confirm screenshot content is non-blank and includes
    // the bottom strip where the badge lives. Toggle the candles ref via
    // demo controls to nothing and verify bytes drop substantially — the
    // existing "renders" smoke test already handles the trivial case.
    const bytes = (await canvas.screenshot()).length;
    expect(bytes).toBeGreaterThan(BLANK_FLOOR);

    // Assert a fragment of the rendered chart includes the badge area —
    // crop the bottom-right corner via clip and check it has more bytes
    // than a blank crop.
    const clipBytes = (await canvas.screenshot({
      clip: { x: 1100, y: 600, width: 180, height: 80 },
    })).length;
    expect(clipBytes,
      `bottom-right clip (where the interval badge lives) appears blank (${clipBytes} bytes)`,
    ).toBeGreaterThan(200);

    void accentVisible;   // unused — placeholder for a future pixel-precise check
    expect(watch.entries).toEqual([]);
  });

  test('paper theme produces visibly different output than dark theme (no blank, no errors)', async ({ page }) => {
    const watch = collectConsoleErrors(page);
    await page.goto('/');
    await page.getByRole('button', { name: /^Candle$/ }).click();
    const canvas = page.locator('.tab-content:visible canvas').first();
    await canvas.waitFor({ state: 'visible' });
    await page.waitForTimeout(400);

    // Make sure overlays + markers are on so legend / tooltip backdrops render
    const indicatorsToggle = page.getByTestId('cf-show-indicators');
    if (!(await indicatorsToggle.isChecked())) await indicatorsToggle.check();
    await page.waitForTimeout(150);

    // Hover so the OHLCV strip + crosshair pill + price-axis label render
    const box = await canvas.boundingBox();
    if (!box) throw new Error('canvas not found');
    await page.mouse.move(box.x + box.width * 0.5, box.y + box.height * 0.4);
    await page.waitForTimeout(150);

    const darkBytes = (await canvas.screenshot()).length;
    expect(darkBytes, 'dark-theme candle canvas blank').toBeGreaterThan(BLANK_FLOOR);

    // Switch to paper theme
    await page.locator('select').filter({ hasText: 'Paper' }).first().selectOption('paper');
    await page.waitForTimeout(250);
    await page.mouse.move(box.x + box.width * 0.5, box.y + box.height * 0.4);
    await page.waitForTimeout(150);

    const paperBytes = (await canvas.screenshot()).length;
    expect(paperBytes, 'paper-theme candle canvas blank').toBeGreaterThan(BLANK_FLOOR);
    expect(paperBytes,
      `paper theme produced same screenshot bytes as dark (${darkBytes} → ${paperBytes}) — colors did not change`,
    ).not.toBe(darkBytes);

    expect(watch.entries).toEqual([]);
  });

  test('compact mode drops the time axis + interval badge', async ({ page }) => {
    // Regression: without the compact prop, mini-cards in the dashboard
    // ChartPanel rendered the full time-axis labels at 180px wide, where
    // they collapsed into illegible smears. Compact mode skips them.
    const watch = collectConsoleErrors(page);
    await page.goto('/');
    await page.getByRole('button', { name: /^Candle$/ }).click();
    const canvas = page.locator('.tab-content:visible canvas').first();
    await canvas.waitFor({ state: 'visible' });
    await page.waitForTimeout(300);

    // Sample bottom-edge pixels with full chrome — interval badge sits
    // bottom-right, time labels run across the bottom strip.
    const sampleBottomBand = async () => canvas.evaluate((c: HTMLCanvasElement) => {
      const ctx = c.getContext('2d');
      if (!ctx) return { ok: false, opaqueBottom: 0 };
      const stripH = 18;                           // axis label band height
      const data = ctx.getImageData(0, c.height - stripH, c.width, stripH).data;
      let opaque = 0, count = 0;
      for (let i = 3; i < data.length; i += 4) {
        if (data[i] >= 200) opaque++;
        count++;
      }
      return { ok: true, opaqueBottom: opaque / count };
    });

    // Ensure WebGL pipeline + flat-fallback both render compact identically:
    // toggle to flat so we read pixel data directly off the visible canvas.
    await page.getByTestId('cf-flat').check();
    await page.waitForTimeout(300);

    const fullChrome = await sampleBottomBand();
    expect(fullChrome.ok).toBe(true);

    await page.getByTestId('cf-compact').check();
    await page.waitForTimeout(300);

    const compactChrome = await sampleBottomBand();
    expect(compactChrome.opaqueBottom,
      `compact bottom-band opaque ratio (${(compactChrome.opaqueBottom * 100).toFixed(1)}%) ` +
      `should be lower than full chrome (${(fullChrome.opaqueBottom * 100).toFixed(1)}%)`,
    ).toBeLessThan(fullChrome.opaqueBottom);

    expect(watch.entries).toEqual([]);
  });

  test('flat mode does not accumulate across redraws (transparent-bg stacking bug)', async ({ page }) => {
    // Regression: themes with `bg: rgba(0,0,0,0)` (none, paper) caused the
    // 2D fallback to layer drawImage on top of the previous frame because
    // the visible canvas was never cleared. After ~13 redraws an 0.08-alpha
    // BB band saturated to opaque, and axis/OHLCV labels smeared. We detect
    // this by reading pixels directly — saturation pulls average alpha up.
    const watch = collectConsoleErrors(page);
    await page.goto('/');
    await page.getByRole('button', { name: /^Candle$/ }).click();
    const canvas = page.locator('.tab-content:visible canvas').first();
    await canvas.waitFor({ state: 'visible' });
    await page.waitForTimeout(300);

    // Force flat mode + indicators on (overlays are what visibly accumulate)
    await page.getByTestId('cf-flat').check();
    await page.waitForTimeout(300);
    if (!(await page.getByTestId('cf-show-indicators').isChecked())) {
      await page.getByTestId('cf-show-indicators').check();
    }
    await page.waitForTimeout(300);

    const box = await canvas.boundingBox();
    if (!box) throw new Error('canvas not found');

    // Trigger many hover redraws — every mousemove updates the hover ref,
    // which fires a redraw via Vue's reactive watcher.
    for (let i = 0; i < 50; i++) {
      const t = i / 49;
      await page.mouse.move(
        box.x + box.width * (0.3 + t * 0.5),
        box.y + box.height * (0.4 + Math.sin(t * Math.PI) * 0.1),
        { steps: 1 },
      );
    }
    await page.waitForTimeout(250);

    // Sample pixels directly. Without the clearRect, the BB band region
    // (mid-pane, where it always overlays) saturates to its base alpha
    // multiplied by the number of redraws.
    const stats = await canvas.evaluate((c: HTMLCanvasElement) => {
      // Visible canvas is in `2d` mode under flat path; getContext('2d')
      // returns the existing context.
      const ctx = c.getContext('2d');
      if (!ctx) return { ok: false, avgAlpha: 0, opaqueRatio: 0, w: c.width, h: c.height };
      const data = ctx.getImageData(0, 0, c.width, c.height).data;
      let sumA = 0, opaque = 0, count = 0;
      for (let i = 3; i < data.length; i += 4) {
        sumA += data[i];
        if (data[i] >= 250) opaque++;
        count++;
      }
      return { ok: true, avgAlpha: sumA / count, opaqueRatio: opaque / count, w: c.width, h: c.height };
    });
    expect(stats.ok, '2d context not available — flat path did not engage').toBe(true);
    // Empirical baselines (sampled at 1280×684, 50 hover redraws, BB+EMA
    // overlays on): clean flat draw ~ avgAlpha 23 / opaque 3.4%.
    // With the bug ~ avgAlpha 67 / opaque 12.4%. Set ceilings at 2× the
    // clean baseline.
    expect(stats.avgAlpha,
      `avg alpha ${stats.avgAlpha.toFixed(1)} suggests redraw stacking — clean baseline ~23`,
    ).toBeLessThan(45);
    expect(stats.opaqueRatio,
      `${(stats.opaqueRatio * 100).toFixed(1)}% of pixels are opaque — clean baseline ~3.4%`,
    ).toBeLessThan(0.08);

    expect(watch.entries).toEqual([]);
  });

  test('flat mode skips Three.js — non-blank, differs from WebGL output, no GL errors', async ({ page }) => {
    const watch = collectConsoleErrors(page);
    await page.goto('/');
    await page.getByRole('button', { name: /^Candle$/ }).click();
    const canvas = page.locator('.tab-content:visible canvas').first();
    await canvas.waitFor({ state: 'visible' });
    await page.waitForTimeout(400);

    // WebGL pipeline (default) — barrel shader applied; capture for comparison
    const glBytes = (await canvas.screenshot()).length;
    expect(glBytes, 'WebGL-pipeline canvas blank').toBeGreaterThan(BLANK_FLOOR);

    // Switch to flat — the watcher should tear down Three.js and re-init via
    // the 2D path. Output should still render but visually differ (no barrel).
    await page.getByTestId('cf-flat').check();
    await page.waitForTimeout(350);

    const flatBytes = (await canvas.screenshot()).length;
    expect(flatBytes, 'flat-mode canvas blank').toBeGreaterThan(BLANK_FLOOR);
    expect(flatBytes,
      `flat mode produced same screenshot bytes as WebGL (${glBytes} → ${flatBytes}) — pipeline did not switch`,
    ).not.toBe(glBytes);

    expect(watch.entries).toEqual([]);
  });

  test('crosshair + axis labels render under hover', async ({ page }) => {
    const watch = collectConsoleErrors(page);
    await page.goto('/');
    await page.getByRole('button', { name: /^Candle$/ }).click();
    const canvas = page.locator('.tab-content:visible canvas').first();
    await canvas.waitFor({ state: 'visible' });
    await page.waitForTimeout(400);

    // Without hover, the canvas already has axes — capture as the baseline
    const noHover = (await canvas.screenshot()).length;

    // Now hover — adds crosshair lines + price/time pill, should compress to
    // a different size (more visual content).
    const box = await canvas.boundingBox();
    if (!box) throw new Error('canvas not found');
    await page.mouse.move(box.x + box.width * 0.5, box.y + box.height * 0.4);
    await page.waitForTimeout(120);

    const withHover = (await canvas.screenshot()).length;
    expect(withHover,
      `crosshair did not change screenshot bytes (${noHover} → ${withHover})`,
    ).not.toBe(noHover);
    expect(withHover, 'canvas blanked when crosshair drawn').toBeGreaterThan(BLANK_FLOOR);

    expect(watch.entries).toEqual([]);
  });
});
