# app

The one SvelteKit UI for Kabuk, shipped as a Tauri 2 desktop and mobile app and as a static
web build for `web.kabuk.app`. Umbrella index: [`../AGENTS.md`](../AGENTS.md).

## Commands

```
bun install
bun run dev            # vite dev server on :5173
bun run build          # static bundle in build/ (used by Tauri)
bun run build:web      # static bundle in build-web/ (web.kabuk.app)
bun run tauri dev      # desktop app
bun run tauri build --debug --no-bundle
bun run tauri android init && bun run tauri android build --debug --apk
bun run check          # svelte-kit sync + svelte-check
bun run test           # vitest
bun run test:coverage  # vitest, 100% thresholds
bun run test:e2e       # Playwright against build-web/
```

## Layout

- `src/lib/i18n/`: `en` is the source of truth for keys, the others are typed against it.
- `src/lib/theme.ts`: theme registry and `data-theme`. `settings.svelte.ts`: language and theme state.
- `src/lib/platform.ts`: the only place that decides which features exist where.
- `src/lib/splash.ts`, `startup.ts`: 800 ms minimum splash logic.
- `src-tauri/`: Rust shell. Depends on `kabuk-proto` by git, not on `core` yet.
- `e2e/`: Playwright scenarios.

## Notes

- SvelteKit 3 has no `$lib`; use relative imports.
- `typescript` stays on 6.x: SvelteKit's sync needs the JS compiler API, which 7 does not ship.
- `@tauri-apps/api` and the `tauri` crate must share a minor version (currently 2.11).
- Android builds need a JDK of 26 or older (use 21), the NDK and `ANDROID_HOME`.
- Topic files: [status](docs/agents/status.md), [coverage exceptions](docs/agents/coverage-exceptions.md).
