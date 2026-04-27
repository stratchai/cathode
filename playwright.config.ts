import { defineConfig, devices } from '@playwright/test';

const PORT = 5180;

export default defineConfig({
  testDir: './tests',
  // Each test file is independent and we keep the suite small enough to run
  // serially — predictable output is more important than speed.
  fullyParallel: false,
  workers: 1,
  reporter: [['list']],
  use: {
    baseURL: `http://localhost:${PORT}`,
    headless: true,
    viewport: { width: 1280, height: 800 },
    // Capture browser console + page errors; tests assert on these.
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
  // Boot the cathode demo via vite for the test run. Playwright kills it on exit.
  webServer: {
    command: `npx vite --port ${PORT} --strictPort`,
    url:     `http://localhost:${PORT}`,
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
});
