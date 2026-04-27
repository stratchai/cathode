import type { Page, ConsoleMessage } from '@playwright/test';

/**
 * Subscribes to a page's console + pageerror streams and collects matching
 * messages so a test can assert on them at the end. The default matcher
 * picks up WebGL / GL_INVALID_VALUE warnings — the signature of the bug
 * class this suite originally exists to guard against.
 *
 * Usage:
 *
 *   const watch = collectConsoleErrors(page);
 *   // … exercise the page …
 *   expect(watch.entries, 'no GL warnings').toEqual([]);
 *
 * Matched entries persist for the lifetime of the page; the helper does not
 * unsubscribe. That's intentional — we want the catch-all to remain on so a
 * later assertion in the same test can trigger on a new error.
 */
export function collectConsoleErrors(
  page: Page,
  matcher: (text: string, type: string) => boolean = defaultMatcher,
) {
  const entries: { type: string; text: string }[] = [];
  page.on('console', (msg: ConsoleMessage) => {
    const text = msg.text();
    const type = msg.type();
    if (matcher(text, type)) entries.push({ type, text });
  });
  page.on('pageerror', (err) => {
    entries.push({ type: 'pageerror', text: err.message });
  });
  return { entries };
}

function defaultMatcher(text: string, type: string): boolean {
  // Page errors and console.error always go through.
  if (type === 'error' || type === 'pageerror') return true;
  // Warnings: scoped to the specific GL bug class this suite guards against.
  // Performance hints (GPU stall, ReadPixels) and harmless three.js notices
  // are NOT regressions, so we ignore them.
  if (type === 'warning') {
    if (/GL Driver Message.*Performance/.test(text)) return false;
    if (/GL_CLOSE_PATH_NV|ReadPixels/.test(text))     return false;
    if (/THREE\.Color: Alpha component/.test(text))   return false;
    if (/WebGL.*context lost/i.test(text))            return false; // intentionally handled
    // Catch GL_INVALID_*, GL_OUT_OF_MEMORY, and any "GL ... Error" messages.
    return /GL_INVALID|GL_OUT_OF_MEMORY|GL.*Error|texSubImage|texImage/.test(text);
  }
  return false;
}
