#!/usr/bin/env node
// capture-hero.mjs — drive the cathode demo via Playwright and screenshot
// the workspace tab in phosphor theme. Output: docs/hero.png.
//
// Usage:
//   1. Start the dev server: `npx vite --port 5180 --strictPort &`
//   2. Wait for it to respond, then: `node tools/capture-hero.mjs`
//   3. Stop the dev server when done.
//
// Or use the npm script (which orchestrates the above):
//   npm run capture:hero
//
// Image is captured at 2x device pixel ratio for retina sharpness.

import { chromium } from "playwright";
import { mkdirSync } from "node:fs";
import { dirname } from "node:path";

const URL = process.env.CATHODE_DEMO_URL || "http://localhost:5180";
const OUT = process.env.CATHODE_HERO_OUT || "docs/hero.png";
const THEME = process.env.CATHODE_HERO_THEME || "phosphor";

mkdirSync(dirname(OUT), { recursive: true });

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 2,
});
const page = await context.newPage();

console.log(`Navigating to ${URL} …`);
await page.goto(URL, { waitUntil: "networkidle" });

// The demo's default tab is "workspace" — this shows multiple cathode
// components (grid, log, candle, terminal) in one view, which is the best
// hero shot.
await page.waitForSelector(".demo-bar", { timeout: 10_000 });

// Switch to the requested theme via the demo's theme <select>.
console.log(`Setting theme=${THEME} …`);
const themeSelect = page.locator(".demo-bar select").first();
await themeSelect.selectOption(THEME);

// Let the theme transition + any canvas redraws settle.
await page.waitForTimeout(2000);

console.log(`Capturing screenshot to ${OUT} …`);
await page.screenshot({ path: OUT, fullPage: false });

await browser.close();
console.log("Done.");
