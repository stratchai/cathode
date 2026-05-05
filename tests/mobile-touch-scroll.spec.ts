import { test, expect, devices } from '@playwright/test'
import { collectConsoleErrors } from './_helpers'

/**
 * Touch-scroll regression suite. Verifies a one-finger swipe inside the
 * canvas of CathodeGrid / CathodeLog / CathodeCandle drives the component's
 * internal scroll position the same way a mouse drag does on desktop.
 *
 * Method: take a baseline canvas screenshot, dispatch a touch swipe, take a
 * second screenshot, assert the rendered output changed. Pixel-equality
 * would prove no scroll happened; any visible change is good enough since
 * the test isn't trying to assert the exact scroll distance.
 */

const BLANK_FLOOR = 3000

test.use({ ...devices['Pixel 5'] })

async function swipe(
  page: import('@playwright/test').Page,
  startX: number, startY: number,
  endX:   number, endY:   number,
) {
  // Dispatch synthesised touch events directly on the visible canvas. Using
  // elementFromPoint can return a wrapper div whose touch handlers don't
  // exist — the listeners are on the canvas itself, and touch events don't
  // bubble down — so we resolve the canvas explicitly.
  await page.evaluate(([sx, sy, ex, ey]) => {
    const target = document.querySelector('.tab-content:not([style*="display: none"]) canvas') as HTMLCanvasElement | null
    if (!target) throw new Error('no canvas in visible tab')
    function send(type: string, x: number, y: number) {
      const t = new Touch({ identifier: 1, target, clientX: x, clientY: y, pageX: x, pageY: y, screenX: x, screenY: y, force: 1 })
      const ev = new TouchEvent(type, {
        cancelable:    true,
        bubbles:       true,
        touches:        type === 'touchend' ? [] : [t],
        targetTouches:  type === 'touchend' ? [] : [t],
        changedTouches: [t],
      })
      target.dispatchEvent(ev)
    }
    const STEPS = 12
    send('touchstart', sx, sy)
    for (let i = 1; i <= STEPS; i++) {
      const t = i / STEPS
      send('touchmove', sx + (ex - sx) * t, sy + (ey - sy) * t)
    }
    send('touchend', ex, ey)
  }, [startX, startY, endX, endY])
}

test.describe('cathode demo — mobile touch scroll', () => {
  test('Grid: vertical swipe scrolls rows', async ({ page }) => {
    const watch = collectConsoleErrors(page)
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    await page.getByRole('button', { name: /^Grid$/ }).click()
    await page.waitForTimeout(400)

    const canvas = page.locator('.tab-content:visible canvas').first()
    const box    = await canvas.boundingBox()
    if (!box) throw new Error('grid canvas not visible')

    const before = await canvas.screenshot()
    expect(before.length).toBeGreaterThan(BLANK_FLOOR)

    // Swipe up — finger starts low, ends high → scroll content down (newer
    // rows appear from the bottom). Skip header band (top 30px).
    await swipe(
      page,
      box.x + box.width / 2, box.y + box.height - 30,
      box.x + box.width / 2, box.y + 60,
    )
    await page.waitForTimeout(300)

    const after = await canvas.screenshot()
    expect(after.equals(before), 'grid canvas changed after vertical swipe').toBe(false)
    expect(watch.entries).toEqual([])
  })

  test('Log: vertical swipe scrolls lines', async ({ page }) => {
    const watch = collectConsoleErrors(page)
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    await page.getByRole('button', { name: /^Log$/ }).click()
    await page.waitForTimeout(400)

    const canvas = page.locator('.tab-content:visible canvas').first()
    const box    = await canvas.boundingBox()
    if (!box) throw new Error('log canvas not visible')

    const before = await canvas.screenshot()
    expect(before.length).toBeGreaterThan(BLANK_FLOOR)

    // Log defaults to autoscroll=true and starts pinned at the bottom
    // (newest entries visible). A swipe UP would push scrollY past max
    // and clamp to no-op. Swipe DOWN — finger drags downward — to scroll
    // BACKWARDS through the entries (older content slides in from the top).
    await swipe(
      page,
      box.x + box.width / 2, box.y + 50,
      box.x + box.width / 2, box.y + box.height - 50,
    )
    await page.waitForTimeout(300)

    const after = await canvas.screenshot()
    expect(after.equals(before), 'log canvas changed after vertical swipe').toBe(false)
    expect(watch.entries).toEqual([])
  })

  test('Candle: horizontal swipe pans candles', async ({ page }) => {
    const watch = collectConsoleErrors(page)
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    await page.getByRole('button', { name: /^Candle$/ }).click()
    await page.waitForTimeout(400)

    const canvas = page.locator('.tab-content:visible canvas').first()
    const box    = await canvas.boundingBox()
    if (!box) throw new Error('candle canvas not visible')

    const before = await canvas.screenshot()
    expect(before.length).toBeGreaterThan(BLANK_FLOOR)

    // LEFT-to-RIGHT swipe (finger drags rightward) — the chart's pan
    // convention is "drag right → see older candles on the left". A
    // right-to-left swipe instead would push scrollX past 0 (already at
    // newest) and clamp to no-op.
    await swipe(
      page,
      box.x + 30,             box.y + box.height / 2,
      box.x + box.width - 30, box.y + box.height / 2,
    )
    await page.waitForTimeout(300)

    const after = await canvas.screenshot()
    expect(after.equals(before), 'candle canvas changed after horizontal swipe').toBe(false)
    expect(watch.entries).toEqual([])
  })
})
