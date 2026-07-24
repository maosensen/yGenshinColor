/**
 * User-facing changelog — curated, categorized release highlights rendered by
 * the /changelog page, distinct from the developer CHANGELOG.md (which tracks
 * every change for the GitHub release notes).
 *
 * Keep this in sync on release: add one entry per shipped version. Every
 * release needs a headline `title` (plus an optional `summary`); changes
 * usually carry a short row `title` too — and the `text` should not start
 * with that title, or the rendered row reads twice.
 */

/** Change category — drives the colored tag on each row. */
export type ChangeKind = "new" | "improved" | "fixed";

export type ChangelogChange = {
  kind: ChangeKind;
  /** One-sentence description of the change. */
  text: string;
  /** Short feature name shown as the row heading. */
  title?: string;
};

export type ChangelogRelease = {
  version: string;
  /** ISO date (YYYY-MM-DD). */
  date: string;
  /** Curated, user-facing changes for this release. */
  changes: ChangelogChange[];
  /** Release headline (e.g. "Hello, dashboard"). */
  title: string;
  /** Optional one-paragraph framing shown under the headline. */
  summary?: string;
};

/** Newest first. */
export const changelog: ChangelogRelease[] = [
  {
    version: "0.3.0",
    date: "2026-07-24",
    title: "The studio becomes a canvas",
    summary:
      "The workbench turns into a pannable, zoomable canvas with floating panels you can drag anywhere, joined by a fresh crop of palette-driven backgrounds.",
    changes: [
      {
        kind: "new",
        title: "Canvas workbench",
        text: "Pan and zoom around a framed artboard, and drag the asset and background panels wherever you like — a top toolbar zooms, resets the view, and flips the artboard between black and white.",
      },
      {
        kind: "new",
        title: "Warp Grid",
        text: "A faint grid pinched toward a glowing gravity well that follows your cursor, its nodes lit in the palette's core color.",
      },
      {
        kind: "new",
        title: "Six more backgrounds",
        text: "Ripple Grid, Letter Glitch, Orb, Dot Field, Aurora, and Soft Aurora join the roster, each painting from your extracted palette.",
      },
      {
        kind: "improved",
        title: "Smoother, cleaner canvas",
        text: "Backgrounds render at native resolution again (no more grain), Silk's noise is off, resting borders are gone, and dark-mode panels read clearly over any animation.",
      },
      {
        kind: "fixed",
        title: "Ripple Grid stability",
        text: "Switching away from Ripple Grid no longer breaks the artboard.",
      },
    ],
  },
  {
    version: "0.2.1",
    date: "2026-07-23",
    title: "The studio grows up",
    summary:
      "Eight React Bits backgrounds join the preset roster, the palette learns what its core color is, and a big performance fix makes everything smooth.",
    changes: [
      {
        kind: "new",
        title: "React Bits backgrounds",
        text: "Liquid Ether, Ferrofluid, Lightfall, Dark Veil, Light Pillar, Silk, Floating Lines, and Side Rays — each painting from your extracted palette.",
      },
      {
        kind: "new",
        title: "Core theme color",
        text: "Extraction flags the palette's strongest voice; it drives hue-based presets and seeds the color picks for everything else.",
      },
      {
        kind: "new",
        title: "Immersive mode",
        text: "Hide every panel with one click and enjoy the canvas full-screen — Esc brings the tools back.",
      },
      {
        kind: "improved",
        title: "Cleaner palette",
        text: "Near-white and near-black areas (card frames, dark skies) no longer waste palette slots, and the bar can copy all hex values or a CSS gradient at once.",
      },
      {
        kind: "fixed",
        title: "Performance",
        text: "Animated backgrounds now render at native 1x resolution instead of Retina 2x, removing the page-wide lag on large screens.",
      },
    ],
  },
  {
    version: "0.2.0",
    date: "2026-07-23",
    title: "Welcome to Teyvat Palette",
    summary:
      "The template becomes a product — a fan-made studio for learning color design from Genshin Impact art, with a background workbench at its heart.",
    changes: [
      {
        kind: "new",
        title: "Background Studio",
        text: "Pick a Genshin asset and its extracted palette drives a full-screen animated background — switch between linear, radial-mesh, and drifting-mesh presets.",
      },
      {
        kind: "new",
        title: "Palette extraction",
        text: "Five swatches are clustered from the picked image right in the browser (OKLab k-means), shown in a click-to-copy palette bar.",
      },
      {
        kind: "new",
        title: "Asset library",
        text: "Scene, character, TCG-card, and name-card categories with smooth virtualized lists, thumbnails, and a full-size preview dialog.",
      },
      {
        kind: "new",
        title: "Scene studies",
        text: "Five hand-tuned Teyvat scenes with gradient heroes, color analysis notes, and CSS / Tailwind / SVG exports — each scene re-themes the page from its own palette.",
      },
      {
        kind: "improved",
        title: "Showcase identity",
        text: "Dark-by-default deep grey-blue tone with film grain and display serif headings; template demo pages are gone.",
      },
    ],
  },
  {
    version: "0.1.2",
    date: "2026-07-16",
    title: "Make the board yours",
    summary:
      "The dashboard grid gains a Customize toolbar and cleaner, unified chrome — powered by a reusable grid board under the hood.",
    changes: [
      {
        kind: "new",
        title: "Customize toolbar",
        text: "Show or hide each dashboard widget and reset the board back to its default arrangement.",
      },
      {
        kind: "improved",
        title: "Grid chrome",
        text: "A themeable corner resize grip, standard card surfaces on grid widgets, and no more drag icon cluttering the top-right corner.",
      },
      {
        kind: "improved",
        title: "Grid board internals",
        text: "All grid behavior now runs through one reusable board component, so every grid page shares the same look and feel.",
      },
    ],
  },
  {
    version: "0.1.1",
    date: "2026-07-13",
    title: "Hardening the foundations",
    summary:
      "A groundwork release — validated configuration, a CI gate on every change, and polished error states across the app.",
    changes: [
      {
        kind: "new",
        title: "Status pages",
        text: "Consistent 404 pages inside and outside the shell, an error screen with one-click retry, and a loading skeleton while pages stream in.",
      },
      {
        kind: "new",
        title: "Validated env vars",
        text: "Environment variables are checked against a zod schema at startup, so a bad config fails the build instead of surfacing at runtime.",
      },
      {
        kind: "new",
        title: "CI gate",
        text: "Every push and pull request now runs lint, type checks, and a production build on GitHub Actions.",
      },
    ],
  },
  {
    version: "0.1.0",
    date: "2026-07-10",
    title: "Hello, dashboard",
    summary:
      "The first cut of the template — a themeable Next.js dashboard shell with a live settings drawer, ready to build on.",
    changes: [
      {
        kind: "new",
        title: "Dashboard shell",
        text: "An app shell with vertical, mini-rail, and horizontal nav layouts, Priority+ overflow for the top bar, and a small-screen drawer.",
      },
      {
        kind: "new",
        title: "Settings drawer",
        text: "Live theme controls — light/dark/system, contrast, compact density, nav layout and color, color presets plus a custom brand color, radius steps, a font picker (Outfit by default), and a max-width toggle — persisted across reloads.",
      },
      {
        kind: "new",
        title: "Token-driven theming",
        text: "Card and overlay elevation, chart series, and borders all run on design tokens, so presets and contrast re-skin the whole app consistently.",
      },
      {
        kind: "new",
        title: "Widgets & demos",
        text: "An analytics dashboard, line and bar chart pages, a drag-and-resize gridstack board, avatar fallbacks, and a display-card gallery.",
      },
      {
        kind: "new",
        title: "Solar icons",
        text: "Iconify-compiled Solar duotone glyphs across nav, settings, and headers.",
      },
      {
        kind: "new",
        title: "This page",
        text: "Curated release notes on a timeline, rendered from a typed changelog module.",
      },
    ],
  },
];
