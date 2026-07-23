# Changelog

All notable changes to Teyvat Palette (yGenshinColor) are documented here. The
format is based on [Keep a Changelog](https://keepachangelog.com/); this
project uses [semantic versioning](https://semver.org/).

## [Unreleased]

## [0.2.0] - 2026-07-23

The template becomes a product: **Teyvat Palette** — a fan-made, non-commercial
studio for learning color design from Genshin Impact art.

### Added

- **Background Studio workbench** (home page) — pick a Genshin asset, its
  palette drives a switchable animated background on a full-viewport canvas:
  - Asset toolbar: scene / character / TCG-card / name-card categories,
    virtualized lists (TanStack Virtual), `next/image` thumbnails, and a
    full-size preview dialog; assets auto-register from
    `public/geshin-pics/<category>/` at build time.
  - In-browser palette extraction: OKLab k-means with deterministic seeding —
    the same image always yields the same five swatches.
  - Background preset registry with a uniform `({ palette })` contract:
    linear axis, radial mesh, and an animated radial mesh (pure-CSS drifting
    blobs); presets show live neutral-grey thumbnails and origin badges.
  - Click-to-copy palette bar and collapsible frosted-glass panels.
- **Scene study library** (`/scenes`) — five hand-tuned Teyvat scene studies
  with a drifting gradient hero, a click-to-copy OKLCH palette strip,
  "why it works" color analysis, and CSS variables / Tailwind v4 / SVG
  exports; opening a scene re-themes the whole page from its palette.
- **Showcase identity** — dark-by-default deep grey-blue tone, film-grain
  overlay, and a display serif pairing (Playfair Display + Noto Serif SC).

### Changed

- Repositioned from a personal dashboard template (yTemplate) to Teyvat
  Palette; the dashboard sidebar shell is replaced by a top-nav showcase
  layout with a fan-project disclaimer footer on content pages.

### Removed

- All template demo content: chart pages, gridstack board and demos, avatar
  and display-card galleries, the example zustand store, the sidebar promo
  card, and the `gridstack` dependency.

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

[Unreleased]: https://github.com/maosensen/yGenshinColor/compare/v0.2.0...HEAD
[0.2.0]: https://github.com/maosensen/yGenshinColor/releases/tag/v0.2.0
[0.1.2]: https://github.com/maosensen/yTemplate/compare/v0.1.1...v0.1.2
[0.1.1]: https://github.com/maosensen/yTemplate/compare/v0.1.0...v0.1.1
[0.1.0]: https://github.com/maosensen/yTemplate/releases/tag/v0.1.0
