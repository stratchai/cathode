# Contributing to cathode

Thanks for considering a contribution. The project is small enough that a brief setup guide is all you need.

## Development setup

```bash
git clone https://github.com/stratchai/cathode
cd cathode
npm install

npm run dev          # demo app at http://localhost:5173
npm run build        # library → dist/
npm run typecheck    # vue-tsc --noEmit
```

The demo app under `demo/` exists to drive the components manually during development. It's not packaged with the library.

## Regression tests

Headless Playwright suite that drives the demo. Each test exists to lock in a specific bug class — when a fix lands, a test goes with it. Run on every change before pushing:

```bash
npm test             # headless
npm run test:headed  # watch the browser
npm run test:debug   # step through with inspector (PWDEBUG=1)
```

The current suite covers:

| Test | Bug class it guards |
|------|---------------------|
| `grid-resize.spec.ts` | `GL_INVALID_VALUE: glTexSubImage2DRobustANGLE: Offset overflows texture dimensions` — `CanvasTexture` not reallocated when `offCanvas` grows. Sweeps viewport sizes through grow + shrink cycles, asserts the GL warning never appears. |

The `tests/_helpers.ts` `collectConsoleErrors` helper is the reusable pattern for new tests — subscribe at start, sweep the page, assert at end.

## Conventions

- **No silent test deletions.** If a test fails because the spec genuinely changed, update the test in the same PR. If a test catches a real regression, fix the regression.
- **`npm run typecheck` must be green before merging.** The library's value proposition includes typed consumer APIs; we keep that contract honest.
- **Visual changes should include a `before / after` screenshot in the PR description** — the library is visual; review benefits from seeing the actual diff.

## Release process

1. Bump `version` in `package.json`
2. Update `CHANGELOG.md` with the user-visible changes
3. `npm run build` (emits `dist/`)
4. `npm test` (must be green)
5. `npm publish --access public`
6. `git tag v<version> && git push origin v<version>`
