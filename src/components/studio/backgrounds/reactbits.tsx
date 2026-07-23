"use client";

import { formatHex, oklch } from "culori";
import { useMemo } from "react";
import type { BackgroundProps } from "./types";
import DarkVeil from "./vendor/DarkVeil";
import Ferrofluid from "./vendor/Ferrofluid";
import Lightfall from "./vendor/Lightfall";
import LiquidEther from "./vendor/LiquidEther";
import Prism from "./vendor/Prism";

/**
 * Adapters mapping our `({ palette })` contract onto the vendored React Bits
 * backgrounds. The palette arrives as oklch() strings sorted dark → light;
 * the vendor components take sRGB hex (colors[]) or a hue rotation, so each
 * wrapper derives what its preset needs.
 *
 * WebGL note: only the active canvas mounts one of these — the picker panel
 * uses the lightweight CSS thumbnails below, so context count stays at 1.
 */

const toHex = (css: string): string => formatHex(css) ?? "#888888";

/** Hue (deg) of the most saturated palette entry — the palette's "voice". */
function dominantHue(palette: string[]): number {
  let hue = 0;
  let chroma = -1;
  for (const css of palette) {
    const c = oklch(css);
    if (c && (c.c ?? 0) > chroma) {
      chroma = c.c ?? 0;
      hue = c.h ?? 0;
    }
  }
  return hue;
}

/** The three brightest entries as hex — what the glow-based presets paint with. */
const brightHex = (palette: string[]) => palette.slice(-3).map(toHex);

export function LiquidEtherBg({ palette }: BackgroundProps) {
  const colors = useMemo(() => brightHex(palette), [palette]);
  return (
    <div className="absolute inset-0" style={{ background: palette[0] }}>
      <LiquidEther colors={colors} autoDemo autoSpeed={0.4} />
    </div>
  );
}

export function FerrofluidBg({ palette }: BackgroundProps) {
  const colors = useMemo(() => brightHex(palette), [palette]);
  return (
    <div className="absolute inset-0" style={{ background: palette[0] }}>
      <Ferrofluid colors={colors} speed={0.4} glow={1.6} />
    </div>
  );
}

export function LightfallBg({ palette }: BackgroundProps) {
  const colors = useMemo(() => brightHex(palette), [palette]);
  const backgroundColor = useMemo(() => toHex(palette[0]), [palette]);
  return (
    <div className="absolute inset-0">
      <Lightfall colors={colors} backgroundColor={backgroundColor} />
    </div>
  );
}

// DarkVeil's stock pattern sits around magenta-purple; rotate it (degrees)
// so the pattern lands on the palette's dominant hue.
const DARK_VEIL_BASE_HUE = 320;

export function DarkVeilBg({ palette }: BackgroundProps) {
  const hueShift = useMemo(
    () => dominantHue(palette) - DARK_VEIL_BASE_HUE,
    [palette],
  );
  return (
    <div className="absolute inset-0 bg-black">
      <DarkVeil hueShift={hueShift} speed={0.6} />
    </div>
  );
}

export function PrismBg({ palette }: BackgroundProps) {
  // Prism rotates in radians; align its spectrum to the palette's voice.
  const hueShift = useMemo(
    () => (dominantHue(palette) * Math.PI) / 180,
    [palette],
  );
  return (
    <div className="absolute inset-0 bg-black">
      <Prism hueShift={hueShift} animationType="rotate" timeScale={0.4} />
    </div>
  );
}

/* ------------------------------ thumbnails ------------------------------- */
/* CSS stand-ins for the picker: one WebGL context on the page is plenty. */

export function LiquidEtherThumb({ palette }: BackgroundProps) {
  const [base, ...rest] = palette;
  return (
    <div
      className="absolute inset-0"
      style={{
        backgroundColor: base,
        backgroundImage: rest
          .slice(-3)
          .map(
            (c, i) =>
              `radial-gradient(ellipse 70% 80% at ${25 + i * 25}% ${i % 2 ? 25 : 70}%, ${c}, transparent 60%)`,
          )
          .join(", "),
        filter: "blur(6px)",
      }}
    />
  );
}

export function FerrofluidThumb({ palette }: BackgroundProps) {
  const light = palette[palette.length - 1];
  return (
    <div
      className="absolute inset-0"
      style={{
        backgroundColor: "#050505",
        backgroundImage: `radial-gradient(circle at 50% 55%, transparent 0 22%, ${light} 26%, transparent 34%), radial-gradient(circle at 42% 46%, ${light} 0 3%, transparent 8%)`,
      }}
    />
  );
}

export function LightfallThumb({ palette }: BackgroundProps) {
  const [base, ...rest] = palette;
  const streaks = rest.slice(-3);
  return (
    <div
      className="absolute inset-0"
      style={{
        backgroundColor: base,
        backgroundImage: streaks
          .map(
            (c, i) =>
              `linear-gradient(180deg, ${c} 0%, transparent ${45 + i * 12}%)`,
          )
          .join(", "),
        backgroundSize: "30% 100%, 25% 100%, 32% 100%",
        backgroundPosition: "12% 0, 48% 0, 82% 0",
        backgroundRepeat: "no-repeat",
        filter: "blur(5px)",
      }}
    />
  );
}

export function DarkVeilThumb({ palette }: BackgroundProps) {
  const accent = palette[Math.max(0, palette.length - 2)];
  return (
    <div
      className="absolute inset-0"
      style={{
        backgroundColor: "#030303",
        backgroundImage: `radial-gradient(ellipse 90% 65% at 50% 42%, ${accent} 0%, transparent 68%)`,
        filter: "saturate(1.2) blur(4px)",
        opacity: 0.85,
      }}
    />
  );
}

export function PrismThumb({ palette }: BackgroundProps) {
  const stops = palette.slice(1).join(", ");
  return (
    <div className="absolute inset-0" style={{ backgroundColor: "#030303" }}>
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `conic-gradient(from 155deg at 50% 105%, transparent 15%, ${stops}, transparent 85%)`,
          filter: "blur(7px)",
          opacity: 0.9,
        }}
      />
    </div>
  );
}
