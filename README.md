# Kabuk app

Kabuk is a free, open-source SSH client. It keeps your hosts and keys encrypted on your own
devices, and it needs no account.

This repository is the app itself: one interface that runs as a desktop app on Windows, macOS and
Linux, as an Android app, and in the browser at web.kabuk.app.

## Status

Early and unreleased. There is nothing to download yet, and the app does not connect to
anything. Right now it shows a first-run screen and little else.

## For developers

You need [bun](https://bun.sh) and, for the desktop app, a Rust toolchain and the Tauri 2
prerequisites for your system.

```
bun install
bun run tauri dev
```

The web version runs with `bun run dev`. More commands are in [AGENTS.md](AGENTS.md).

## License

GPL-3.0-or-later. See [LICENSE](LICENSE).
