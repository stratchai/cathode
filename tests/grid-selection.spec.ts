import { test, expect } from '@playwright/test';
import { collectConsoleErrors } from './_helpers';

/**
 * Excel-style multi-cell selection in CathodeGrid.
 *
 *   - Plain arrow keys move the active cell and collapse selection
 *   - Shift+arrow extends selection (anchor stays, active moves)
 *   - Cmd/Ctrl+C copies the rectangle as TSV (\t cols, \n rows)
 *   - Plain click collapses selection to the clicked cell
 *   - Shift+click extends from anchor to the clicked cell
 *
 * Driven through the standalone Grid demo tab which has the trades fixture
 * loaded — no network, deterministic data.
 */

const HEADER_H = 30;

test.describe('CathodeGrid range selection', () => {

  test('shift+arrow extends; cmd+c copies a TSV rectangle to clipboard', async ({ page, context, browserName }) => {
    // Clipboard read needs explicit permission grants (Chromium only)
    if (browserName === 'chromium') {
      await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    }
    const watch = collectConsoleErrors(page);

    await page.goto('/');
    await page.getByRole('button', { name: /^Grid$/ }).click();

    const canvas = page.locator('.tab-content:visible canvas').first();
    await canvas.waitFor({ state: 'visible' });
    await page.waitForTimeout(300);

    // Click the body to seed a single-cell selection at the upper-left
    const box = await canvas.boundingBox();
    if (!box) throw new Error('canvas not found');
    await page.mouse.click(box.x + 80, box.y + HEADER_H + 14);
    await page.waitForTimeout(100);

    // Shift+ArrowRight twice → extend across 3 columns
    await page.keyboard.down('Shift');
    await page.keyboard.press('ArrowRight');
    await page.keyboard.press('ArrowRight');
    // Shift+ArrowDown twice → extend across 3 rows
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('ArrowDown');
    await page.keyboard.up('Shift');
    await page.waitForTimeout(150);

    // Cmd+C — copy
    const isMac = process.platform === 'darwin';
    await page.keyboard.press(isMac ? 'Meta+c' : 'Control+c');
    await page.waitForTimeout(150);

    if (browserName === 'chromium') {
      const tsv = await page.evaluate(() => navigator.clipboard.readText());
      // Expect 3 rows × 3 columns of cells separated by tabs / newlines.
      // Don't pin the exact values (depends on shuffled trade fixture);
      // assert structure only.
      const lines = tsv.split('\n');
      expect(lines.length, `expected 3 rows of TSV, got ${lines.length}: ${JSON.stringify(tsv)}`).toBe(3);
      for (const ln of lines) {
        const fields = ln.split('\t');
        expect(fields.length, `expected 3 cols per TSV row, got ${fields.length}: ${JSON.stringify(ln)}`).toBe(3);
      }
    }

    expect(watch.entries).toEqual([]);
  });

  test('plain arrow after shift-extend collapses the selection', async ({ page }) => {
    const watch = collectConsoleErrors(page);

    await page.goto('/');
    await page.getByRole('button', { name: /^Grid$/ }).click();
    const canvas = page.locator('.tab-content:visible canvas').first();
    await canvas.waitFor({ state: 'visible' });
    await page.waitForTimeout(300);

    const box = await canvas.boundingBox();
    if (!box) throw new Error('canvas not found');
    await page.mouse.click(box.x + 80, box.y + HEADER_H + 14);
    await page.waitForTimeout(100);

    // Build a 3×3 selection
    const baseline = (await canvas.screenshot()).length;
    await page.keyboard.down('Shift');
    await page.keyboard.press('ArrowRight');
    await page.keyboard.press('ArrowRight');
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('ArrowDown');
    await page.keyboard.up('Shift');
    await page.waitForTimeout(150);
    const extended = (await canvas.screenshot()).length;

    // Selection rectangle is visible — bytes should differ from baseline
    expect(extended,
      `extended selection produced no visible byte delta (${baseline} → ${extended})`,
    ).not.toBe(baseline);

    // Plain ArrowRight (no shift) — collapses the rectangle to a single cell.
    // We expect bytes to drop noticeably toward the single-cell baseline.
    await page.keyboard.press('ArrowRight');
    await page.waitForTimeout(150);
    const collapsed = (await canvas.screenshot()).length;

    // Heuristic: collapsed bytes should be closer to the single-cell baseline
    // than the extended frame. Use the midpoint as the divider.
    const midpoint = (baseline + extended) / 2;
    expect(Math.abs(collapsed - baseline) < Math.abs(collapsed - extended) ||
           collapsed < midpoint,
      `arrow without shift didn't collapse the selection (baseline=${baseline}, extended=${extended}, collapsed=${collapsed})`,
    ).toBe(true);

    expect(watch.entries).toEqual([]);
  });
});
