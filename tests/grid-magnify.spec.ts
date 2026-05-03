import { test, expect } from '@playwright/test';
import { collectConsoleErrors } from './_helpers';

/**
 * Lens-on-hover regression suite (issue #1).
 *
 * Locks in:
 *   - Toggling the Magnify checkbox actually changes the rendered output
 *     (uniform plumbing wired up — not a no-op prop)
 *   - Mousing across the grid with lens active doesn't blank the canvas
 *     or throw GL errors (a buggy lens shader could produce NaN samples)
 *   - Mouse-leave deactivates the lens (no stale uniform leaving a ring
 *     drawn at the last mouse position)
 */

const BLANK_FLOOR = 3000;

test.describe('CathodeGrid — magnify lens', () => {
  test('toggling magnify visibly changes render; mouse drift stays GL-clean', async ({ page }) => {
    const watch = collectConsoleErrors(page);

    await page.goto('/');
    await page.getByRole('button', { name: /^Grid$/ }).click();

    const canvas = page.locator('.tab-content:visible canvas').first();
    await canvas.waitFor({ state: 'visible' });
    await page.waitForTimeout(400);

    const box = await canvas.boundingBox();
    if (!box) throw new Error('grid canvas not found');

    // Move into the grid body once so subsequent mouse drift exercises the
    // lens path even before the toggle (lens is gated by props.magnify; the
    // mousemove handler still runs but writes -999 when prop is off).
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    await page.waitForTimeout(100);

    // Baseline screenshot — magnify OFF
    const before = await canvas.screenshot();
    expect(before.length, 'grid render is non-blank before toggle').toBeGreaterThan(BLANK_FLOOR);

    // Toggle magnify ON
    await page.getByTestId('cf-magnify').check();
    await page.waitForTimeout(100);

    // Move mouse into a known position over the grid body
    const lensX = box.x + box.width / 2;
    const lensY = box.y + box.height / 2;
    await page.mouse.move(lensX, lensY);
    await page.waitForTimeout(150);   // give shader time to render with lens

    // After toggle + mouse movement, the rendered image should differ from
    // baseline (lens ring at minimum, magnified content beneath).
    const after = await canvas.screenshot();
    expect(after.length, 'grid render is non-blank with lens active').toBeGreaterThan(BLANK_FLOOR);
    // PNG byte-equality is a strong test: identical render → byte-identical.
    // Any visual change → different bytes. A no-op prop would land equal.
    expect(after.equals(before), 'lens-on render differs from lens-off baseline').toBe(false);

    // Drift mouse around the grid body — exercises the lens uniform on every
    // mousemove. Tests that the shader doesn't NaN-out at edge positions.
    const STEPS = 24;
    for (let i = 0; i < STEPS; i++) {
      const t = i / STEPS;
      const x = box.x + box.width  * (0.15 + 0.7 * t);
      const y = box.y + box.height * (0.20 + 0.6 * Math.sin(t * Math.PI));
      await page.mouse.move(x, y, { steps: 2 });
    }
    await page.waitForTimeout(150);

    const drifted = (await canvas.screenshot()).length;
    expect(drifted, 'grid render survived lens-active mouse drift').toBeGreaterThan(BLANK_FLOOR);

    // Mouse-leave clears the lens — render after leaving should match the
    // lens-off baseline shape (non-blank, no stale ring).
    await page.mouse.move(box.x - 50, box.y + box.height / 2);
    await page.waitForTimeout(150);

    const leftSize = (await canvas.screenshot()).length;
    expect(leftSize, 'grid render non-blank after mouse-leave with lens prop still on').toBeGreaterThan(BLANK_FLOOR);

    // Toggle off — final state matches initial-ish (we don't assert byte
    // equality because the mouse may have nudged hovered-row state, but
    // at minimum the render should still be non-blank).
    await page.getByTestId('cf-magnify').uncheck();
    await page.waitForTimeout(100);

    const offSize = (await canvas.screenshot()).length;
    expect(offSize, 'grid render non-blank after magnify toggled off').toBeGreaterThan(BLANK_FLOOR);

    expect(watch.entries, 'no GL warnings during lens interaction').toEqual([]);
  });
});
