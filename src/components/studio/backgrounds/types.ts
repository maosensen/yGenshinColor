import type { ComponentType } from "react";

/**
 * A background preset: a component that fills its (relative-positioned)
 * parent and paints itself from a palette, plus registry metadata.
 *
 * Presets from copy-paste libraries (React Bits, etc.) are adapted to this
 * same contract and carry their origin in `source` — the panel shows it as a
 * badge.
 */

export type BackgroundProps = {
  /** CSS color strings sorted dark → light (≥ 2 entries). */
  palette: string[];
  /**
   * The palette's core theme color (one of `palette`). Hue-driven presets
   * key off it; multi-color presets seed their color picking with it.
   */
  core: string;
};

export type BackgroundDef = {
  id: string;
  name: string;
  /** Origin badge, e.g. "Built-in" or "React Bits". */
  source: string;
  Component: ComponentType<BackgroundProps>;
  /**
   * Lightweight stand-in rendered in the picker panel. Required for WebGL
   * presets — the panel would otherwise mount one GL context per card;
   * CSS-only presets omit it and the panel renders Component live.
   */
  Thumbnail?: ComponentType<BackgroundProps>;
};

/** Neutral greys used to render the panel thumbnails uniformly. */
export const NEUTRAL_PREVIEW_PALETTE = [
  "oklch(0.25 0 0)",
  "oklch(0.45 0 0)",
  "oklch(0.62 0 0)",
  "oklch(0.78 0 0)",
  "oklch(0.92 0 0)",
];
