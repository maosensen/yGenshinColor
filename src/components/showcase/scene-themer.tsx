"use client";

import { useEffect, useLayoutEffect } from "react";

// Same isomorphic pattern as settings-effect: layout effect on the client so
// the tint lands before paint, no-op on the server.
const useIsomorphicLayoutEffect =
  typeof window === "undefined" ? useEffect : useLayoutEffect;

export type SceneTheme = {
  /** oklch() string for --primary */
  primary: string;
  /** oklch() string for --primary-foreground */
  primaryForeground: string;
  neutralHue: number;
  neutralTint: number;
};

const VARS = [
  "--primary",
  "--primary-foreground",
  "--ring",
  "--neutral-hue",
  "--neutral-tint",
] as const;

/**
 * "Content defines the UI": while a scene page is mounted, its accent color
 * becomes --primary and its ambient hue re-temperatures the whole neutral
 * family via --neutral-hue / --neutral-tint (see globals.css).
 *
 * Written as inline styles on <html>, which win over the [data-neutral] /
 * [data-preset] stylesheet blocks; everything is removed on unmount so the
 * rest of the site returns to the brand default. Known edge: the settings
 * "custom" preset also writes --primary inline — scene pages intentionally
 * override it while open.
 */
export function SceneThemer({ theme }: { theme: SceneTheme }) {
  useIsomorphicLayoutEffect(() => {
    const el = document.documentElement;
    el.style.setProperty("--primary", theme.primary);
    el.style.setProperty("--primary-foreground", theme.primaryForeground);
    el.style.setProperty("--ring", theme.primary);
    el.style.setProperty("--neutral-hue", String(theme.neutralHue));
    el.style.setProperty("--neutral-tint", String(theme.neutralTint));
    return () => {
      for (const v of VARS) {
        el.style.removeProperty(v);
      }
    };
  }, [theme]);

  return null;
}
