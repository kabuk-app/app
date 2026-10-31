# Status

Index: [`../../AGENTS.md`](../../AGENTS.md).

## Done

- Scaffold: SvelteKit 3 static app, Tauri 2 shell, tests at 100% coverage, Playwright scenarios.
- i18n (en, tr, kk, ru), themes (system, light, dark, registry), platform capabilities, first-run
  screen without behaviour, splash timing.
- Desktop splash window, `splash_done` command, `kabuk-proto` git dependency.

## Not done

- The first-run buttons do nothing yet.
- Mobile splash: the JS side waits the minimum and calls `splash_done`, which does nothing on
  mobile. The native Android/iOS splash is not customised yet.
- No `core` dependency, no vault, no connections.
- iOS is not initialised.
- Rust tests and the Rust coverage gate are not set up, see coverage exceptions.
