import { test, expect } from '@playwright/test';
import { collectConsoleErrors } from './_helpers';

/**
 * Regression for the CanvasTexture-resize bug fixed in cathode commit f4878cc:
 *
 *   GL_INVALID_VALUE: glTexSubImage2DRobustANGLE: Offset overflows texture dimensions.
 *
 * Root cause: when `offCanvas.width/height` grow, Three.js's CanvasTexture's
 * GPU storage stays at the original (smaller) allocation. The next render
 * tries to texSubImage2D into bytes outside the allocation, the driver
 * rejects, the canvas renders garbage pixels, and the user sees the trades
 * grid as misaligned/duplicated columns.
 *
 * Fix: dispose+recreate the CanvasTexture when offCanvas dimensions change.
 *
 * This test exercises the same resize path by sweeping the viewport through
 * a range of sizes, which propagates to the grid's wrap element via the
 * normal flex layout, which fires CathodeGrid's ResizeObserver, which calls
 * sizeToContainer, which is the function that goes wrong if the fix
 * regresses. We assert no GL warnings reached the console.
 */
test.describe('CathodeGrid resize regression', () => {
  test('viewport sweep: zero GL warnings on the standalone grid tab', async ({ page }) => {
    const watch = collectConsoleErrors(page);

    await page.goto('/');

    // Switch to the Grid tab — single CathodeGrid, no workspace container,
    // simplest path that still exercises the texture-resize code.
    await page.getByRole('button', { name: /^Grid$/ }).click();

    // Wait for the canvas to mount + initial render
    await page.locator('canvas').first().waitFor({ state: 'visible' });
    await page.waitForTimeout(400);

    // Sweep viewport sizes, including both directions (grow + shrink) and
    // multiple consecutive grows (the original bug pattern). Each resize
    // triggers a wrapEl size change → ResizeObserver → sizeToContainer.
    const sizes = [
      { width: 800,  height: 600  },  // shrink from default 1280x800
      { width: 1600, height: 900  },  // grow
      { width: 1920, height: 1080 },  // grow again (large jump)
      { width: 1024, height: 768  },  // shrink
      { width: 1366, height: 768  },  // mild grow
      { width: 1280, height: 800  },  // back to default
    ];

    for (const s of sizes) {
      await page.setViewportSize(s);
      // Let the ResizeObserver fire + the renderer redraw before the next
      // resize. Without this, the resizes batch and we don't exercise the
      // per-step code path.
      await page.waitForTimeout(150);
    }

    // A short tail wait to catch any async warnings that haven't flushed yet.
    await page.waitForTimeout(200);

    expect(watch.entries, `console emitted GL/page errors during resize:\n${JSON.stringify(watch.entries, null, 2)}`).toEqual([]);
  });

  test('workspace tab: zero GL warnings when resizing a container', async ({ page }) => {
    const watch = collectConsoleErrors(page);

    // Clean localStorage so saved CathodeWorkspace layout doesn't leave
    // containers hidden across runs.
    await page.addInitScript(() => localStorage.clear());

    await page.goto('/');
    // Default tab is workspace. Wait for the page to be quiet rather than
    // for visible canvases — CathodeContainers stagger-reveal and individual
    // canvases may not all be visible at once.
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1500); // staggered reveal completes ~250 + 5*200ms

    const sizes = [
      { width: 800,  height: 600  },
      { width: 1600, height: 900  },
      { width: 1280, height: 800  },
    ];
    for (const s of sizes) {
      await page.setViewportSize(s);
      await page.waitForTimeout(200);
    }
    await page.waitForTimeout(300);

    expect(watch.entries, `console emitted GL/page errors:\n${JSON.stringify(watch.entries, null, 2)}`).toEqual([]);
  });
});
