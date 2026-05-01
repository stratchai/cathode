import { test, expect } from '@playwright/test';
import { collectConsoleErrors } from './_helpers';

/**
 * CathodeTerminal regression tests. The component composes a CathodeLog
 * scrollback with a command-prompt input row. The demo wires a small echo
 * handler so we can drive the full round-trip without a backend.
 *
 * Coverage:
 *   - Tab mounts cleanly (no console errors)
 *   - Submit emits + the echo handler appends both the user line and the
 *     handler's response into the scrollback (visible byte-delta on canvas)
 *   - History navigation: ↑ recalls the last command; ↓ past it restores
 *     the in-progress draft
 */

const BLANK_FLOOR = 3000;

test.describe('CathodeTerminal', () => {

  test('renders the Terminal tab without console errors', async ({ page }) => {
    const watch = collectConsoleErrors(page);

    await page.goto('/');
    await page.getByRole('button', { name: /^Terminal$/ }).click();

    const canvas = page.locator('.tab-content:visible canvas').first();
    await canvas.waitFor({ state: 'visible' });
    await page.waitForTimeout(300);

    // Scrollback canvas drew the seed entry
    const bytes = (await canvas.screenshot()).length;
    expect(bytes, `terminal scrollback canvas appears blank (${bytes} bytes)`).toBeGreaterThan(BLANK_FLOOR);

    // Input row is present and shows the prompt
    const input  = page.getByTestId('ct-input');
    const prompt = page.getByTestId('ct-prompt');
    await expect(input).toBeVisible();
    await expect(prompt).toContainText('→');
    // (focus-on-mount happens but the v-show tab isn't visible at app boot,
    // so we don't assert focus here — the unit-of-truth is real-mount usage,
    // not v-show toggling.)

    expect(watch.entries).toEqual([]);
  });

  test('submit echoes the command + handler response into the scrollback', async ({ page }) => {
    const watch = collectConsoleErrors(page);

    await page.goto('/');
    await page.getByRole('button', { name: /^Terminal$/ }).click();
    const canvas = page.locator('.tab-content:visible canvas').first();
    await canvas.waitFor({ state: 'visible' });
    await page.waitForTimeout(300);

    const baseline = (await canvas.screenshot()).length;

    // Type + submit
    const input = page.getByTestId('ct-input');
    await input.fill('echo regression-check');
    await input.press('Enter');

    // Demo's echo handler intentionally simulates 180ms latency so the busy
    // spinner shows up — wait past that.
    await page.waitForTimeout(400);

    const afterBytes = (await canvas.screenshot()).length;
    expect(afterBytes,
      `scrollback bytes did not change after submit (${baseline} → ${afterBytes}) — handler did not run`,
    ).not.toBe(baseline);

    // Input cleared on submit
    await expect(input).toHaveValue('');

    expect(watch.entries).toEqual([]);
  });

  test('arrow-up recalls last command; arrow-down restores in-progress draft', async ({ page }) => {
    const watch = collectConsoleErrors(page);

    await page.goto('/');
    await page.getByRole('button', { name: /^Terminal$/ }).click();
    await page.locator('.tab-content:visible canvas').first().waitFor({ state: 'visible' });
    await page.waitForTimeout(300);

    const input = page.getByTestId('ct-input');

    // Submit twice so history has two entries
    await input.fill('first');
    await input.press('Enter');
    await page.waitForTimeout(220);
    await input.fill('second');
    await input.press('Enter');
    await page.waitForTimeout(220);

    // Type a fresh draft, then ↑ should snapshot it and recall 'second'
    await input.fill('in-progress');
    await input.press('ArrowUp');
    await expect(input).toHaveValue('second');

    // ↑ again — recall 'first'
    await input.press('ArrowUp');
    await expect(input).toHaveValue('first');

    // ↓ moves forward — back to 'second'
    await input.press('ArrowDown');
    await expect(input).toHaveValue('second');

    // ↓ past the most recent entry — restore the snapshot
    await input.press('ArrowDown');
    await expect(input).toHaveValue('in-progress');

    expect(watch.entries).toEqual([]);
  });
});
