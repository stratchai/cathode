import { test, expect } from '@playwright/test';
import { collectConsoleErrors } from './_helpers';

/**
 * CathodeKLine regression tests — same shape as CathodeGrid / CathodeLog
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

test.describe('CathodeKLine', () => {

  test('renders the KLine tab without console errors', async ({ page }) => {
    const watch = collectConsoleErrors(page);

    await page.goto('/');
    await page.getByRole('button', { name: /^KLine$/ }).click();

    const canvas = page.locator('.tab-content:visible canvas').first();
    await canvas.waitFor({ state: 'visible' });
    await page.waitForTimeout(400);

    // Canvas has rendered content (candles + wicks + volume)
    const bytes = (await canvas.screenshot()).length;
    expect(bytes, `KLine canvas appears blank (${bytes} bytes)`).toBeGreaterThan(BLANK_FLOOR);

    expect(watch.entries).toEqual([]);
  });

  test('viewport sweep: zero GL warnings on the standalone KLine tab', async ({ page }) => {
    const watch = collectConsoleErrors(page);

    await page.goto('/');
    await page.getByRole('button', { name: /^KLine$/ }).click();
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

  test('curvature drag does not blank the KLine canvas', async ({ page }) => {
    const watch = collectConsoleErrors(page);

    await page.goto('/');
    await page.getByRole('button', { name: /^KLine$/ }).click();
    const canvas = page.locator('.tab-content:visible canvas').first();
    await canvas.waitFor({ state: 'visible' });
    await page.waitForTimeout(400);

    async function bytes(): Promise<number> {
      return (await canvas.screenshot()).length;
    }

    expect(await bytes(), 'pre-drag KLine canvas appears blank').toBeGreaterThan(BLANK_FLOOR);

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

    expect(await bytes(), 'KLine canvas blanked after curvature drag').toBeGreaterThan(BLANK_FLOOR);
    expect(watch.entries).toEqual([]);
  });

  // ── PR 2: interactions + axes ──────────────────────────────────────────────

  test('mouse wheel zoom changes the rendered canvas content', async ({ page }) => {
    const watch = collectConsoleErrors(page);
    await page.goto('/');
    await page.getByRole('button', { name: /^KLine$/ }).click();
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
    await page.getByRole('button', { name: /^KLine$/ }).click();
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

  test('crosshair + axis labels render under hover', async ({ page }) => {
    const watch = collectConsoleErrors(page);
    await page.goto('/');
    await page.getByRole('button', { name: /^KLine$/ }).click();
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
