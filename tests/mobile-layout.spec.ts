import { test, expect, devices } from '@playwright/test'
import { collectConsoleErrors } from './_helpers'

/**
 * Mobile-mode regression suite. Verifies the demo's <720px breakpoint kicks
 * in and that:
 *
 *   - The Workspace tab is hidden (its 4-canvas layout stresses mobile WebGL
 *     context limits and drag-resize doesn't translate to touch).
 *   - The four standalone tabs (Grid / Log / Candle / Terminal) are still
 *     reachable and render non-blank canvases.
 *   - The toolbar wraps without overflowing the viewport horizontally.
 *
 * Uses Playwright's iPhone 13 device profile (390×844, devicePixelRatio 3,
 * Mobile Safari user-agent) so the run actually exercises the mobile WebGL
 * code path, not just a narrow desktop viewport.
 */

const BLANK_FLOOR = 3000

// Apply Pixel 5 device profile (393×851, devicePixelRatio 3, Chrome on
// Android user-agent) to every test in this file. Pixel 5 uses chromium —
// the only browser the cathode test setup keeps installed. If we ever
// install webkit we can swap to iPhone 13 for cross-vendor coverage.
test.use({ ...devices['Pixel 5'] })

test.describe('cathode demo — mobile layout', () => {
  test('workspace tab hidden, standalone tabs render', async ({ page }) => {
    const watch = collectConsoleErrors(page)

    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // .demo-shell.mobile class should be applied
    const shellClasses = await page.locator('.demo-shell').first().getAttribute('class')
    expect(shellClasses).toContain('mobile')

    // Workspace tab should not exist at all (v-if=!isMobile)
    const wsBtn = page.getByRole('button', { name: /^Workspace$/ })
    expect(await wsBtn.count()).toBe(0)

    // The four standalone tab buttons must exist
    for (const name of ['Grid', 'Log', 'Candle', 'Terminal']) {
      const btn = page.getByRole('button', { name: new RegExp(`^${name}$`) })
      await expect(btn).toBeVisible()
    }

    // No horizontal overflow on the demo shell — the toolbar should wrap, not
    // expand the page wider than the viewport.
    const dims = await page.evaluate(() => ({
      docW: document.documentElement.scrollWidth,
      vpW:  window.innerWidth,
    }))
    expect(dims.docW, 'document does not overflow horizontally').toBeLessThanOrEqual(dims.vpW + 1)

    // Each standalone tab should render a non-blank canvas after activation.
    for (const tab of ['Grid', 'Log', 'Candle', 'Terminal']) {
      await page.getByRole('button', { name: new RegExp(`^${tab}$`) }).click()
      await page.waitForTimeout(300)
      const canvas = page.locator('.tab-content:visible canvas').first()
      await canvas.waitFor({ state: 'visible' })
      const size = (await canvas.screenshot()).length
      expect(size, `${tab} canvas is non-blank on mobile`).toBeGreaterThan(BLANK_FLOOR)
    }

    expect(watch.entries, 'no GL warnings on mobile').toEqual([])
  })

})
