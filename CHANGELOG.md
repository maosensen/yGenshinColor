# Changelog

All notable changes to yTemplate are documented here. The format is based on
[Keep a Changelog](https://keepachangelog.com/); this project uses
[semantic versioning](https://semver.org/).

## [Unreleased]

## [0.1.2] - 2026-07-16

### Added

- **Dashboard Customize toolbar** — show/hide each home-dashboard widget with
  a reset to the default arrangement; the board re-initializes cleanly on the
  visible set.
- **Reusable `<GridBoard>`** — a shared grid-board component and `useGridBoard`
  hook (ported from yBlocks) consolidating grid behavior, chrome, and CSS in
  one place.

### Changed

- **Unified GridStack chrome** — themeable corner-grip resize handle, standard
  Card surface on the demo widgets, and the top-right drag-grip icon removed.

## [0.1.1] - 2026-07-13

### Added

- **Validated environment variables** — a zod schema in `src/lib/env.ts` is now
  the single source for env vars (server / client / shared split, fail-fast at
  build and dev startup, guard against reading server-only vars on the client),
  with a tracked `.env.example`.
- **CI gate** — a GitHub Actions workflow runs Biome, `tsc --noEmit`, and a
  production build on pushes to `main`/`dev` and on pull requests; new
  `pnpm check` aggregate script.
- **Error & status pages** — a shared `<StatusPage>` component powering a
  global 404, an in-shell 404, an in-shell error boundary with retry, a
  root-crash `global-error` fallback, and a route-group loading skeleton.

## [0.1.0] - 2026-07-10

First release — a themeable Next.js dashboard template.

### Added

- **Dashboard shell** — an app shell with vertical, mini-rail, and horizontal
  nav layouts, Priority+ overflow for the top bar, and a small-screen drawer.
- **Settings drawer** — live theme controls: light/dark/system, contrast,
  compact density, nav layout and color, color presets plus a custom brand
  color, radius steps, a font picker (Outfit by default), and a max-width
  toggle — persisted across reloads.
- **Token-driven theming** — card and overlay elevation, chart series, and
  borders all run on design tokens, so presets and contrast re-skin the whole
  app consistently.
- **Widgets & demos** — an analytics dashboard, line and bar chart pages, a
  drag-and-resize gridstack board, avatar fallbacks (solid / gradient), and a
  display-card gallery.
- **Solar icons** — Iconify-compiled Solar duotone glyphs across nav,
  settings, and headers.
- **Changelog page** — curated release notes on a timeline at `/changelog`,
  rendered from a typed changelog module.

[Unreleased]: https://github.com/maosensen/yTemplate/compare/v0.1.2...HEAD
[0.1.2]: https://github.com/maosensen/yTemplate/compare/v0.1.1...v0.1.2
[0.1.1]: https://github.com/maosensen/yTemplate/compare/v0.1.0...v0.1.1
[0.1.0]: https://github.com/maosensen/yTemplate/releases/tag/v0.1.0
