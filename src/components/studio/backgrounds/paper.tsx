"use client";

import { DotOrbit, PulsingBorder, Voronoi } from "@paper-design/shaders-react";
import { formatHex } from "culori";
import { useMemo } from "react";
import { pickColors } from "./reactbits";
import type { BackgroundProps } from "./types";

/**
 * Adapters mapping our `({ palette, core })` contract onto Paper's shader
 * backgrounds (@paper-design/shaders-react, Apache-2.0 — shaders.paper.design).
 *
 * Same rules as the React Bits adapters: the shared `pickColors` chooses which
 * palette entries to spend (core first, then max-min greedy in OKLab), and the
 * animated surface paints on a transparent ground so the artboard's own
 * black/white backdrop shows through (via `colorBack: rgba(0,0,0,0)` — Paper's
 * colour parser supports rgba()/8-digit-hex alpha).
 *
 * WebGL note: only the active canvas mounts one of these; the picker panel uses
 * the lightweight CSS thumbnails below, so the page holds a single GL context.
 */

const TRANSPARENT = "rgba(0,0,0,0)";
const FILL = {
  position: "absolute",
  inset: 0,
  width: "100%",
  height: "100%",
} as const;

/* ------------------------------- adapters -------------------------------- */

export function DotOrbitBg({ palette, core }: BackgroundProps) {
  const colors = useMemo(
    () => pickColors(palette, core, 4, 0.3),
    [palette, core],
  );
  return (
    <DotOrbit
      style={FILL}
      colors={colors}
      colorBack={TRANSPARENT}
      speed={0.6}
      size={0.5}
      sizeRange={0.3}
      spreading={0.7}
      stepsPerColor={1}
    />
  );
}

export function VoronoiBg({ palette, core }: BackgroundProps) {
  const colors = useMemo(
    () => pickColors(palette, core, 4, 0.25),
    [palette, core],
  );
  const glow = useMemo(() => formatHex(core) ?? "#888888", [core]);
  return (
    <Voronoi
      style={FILL}
      colors={colors}
      colorGap="#0a0a0a"
      colorGlow={glow}
      distortion={0.35}
      gap={0.04}
      glow={0.5}
      speed={0.4}
      stepsPerColor={1}
    />
  );
}

export function PulsingBorderBg({ palette, core }: BackgroundProps) {
  const colors = useMemo(
    () => pickColors(palette, core, 4, 0.35),
    [palette, core],
  );
  return (
    <PulsingBorder
      style={FILL}
      colors={colors}
      colorBack={TRANSPARENT}
      roundness={0.15}
      thickness={0.08}
      softness={0.8}
      intensity={0.5}
      bloom={0.6}
      spots={4}
      spotSize={0.35}
      pulse={0.4}
      smoke={0.4}
      smokeSize={0.5}
      speed={1}
    />
  );
}

/* ------------------------------ thumbnails ------------------------------- */
/* CSS stand-ins for the picker: one WebGL context on the page is plenty. */

const THUMB_BG = "#050505";

export function DotOrbitThumb({ palette, core }: BackgroundProps) {
  const [a, b, c] = pickColors(palette, core, 3, 0.3);
  return (
    <div
      className="absolute inset-0"
      style={{
        backgroundColor: THUMB_BG,
        backgroundImage: `radial-gradient(${a} 32%, transparent 34%), radial-gradient(${b} 32%, transparent 34%), radial-gradient(${c} 32%, transparent 34%)`,
        backgroundSize: "16px 16px, 16px 16px, 16px 16px",
        backgroundPosition: "0 0, 8px 8px, 4px 11px",
        opacity: 0.85,
      }}
    />
  );
}

export function VoronoiThumb({ palette, core }: BackgroundProps) {
  const [a, b, c, d] = pickColors(palette, core, 4, 0.25);
  return (
    <div
      className="absolute inset-0"
      style={{
        backgroundColor: THUMB_BG,
        backgroundImage: `radial-gradient(ellipse 45% 55% at 22% 30%, ${a}, transparent 70%), radial-gradient(ellipse 50% 45% at 70% 25%, ${b}, transparent 70%), radial-gradient(ellipse 55% 55% at 32% 78%, ${c}, transparent 72%), radial-gradient(ellipse 50% 55% at 80% 75%, ${d}, transparent 72%)`,
      }}
    />
  );
}

export function PulsingBorderThumb({ core }: BackgroundProps) {
  return (
    <div className="absolute inset-0" style={{ backgroundColor: THUMB_BG }}>
      <div
        className="absolute inset-[3px] rounded-[6px]"
        style={{
          border: `2px solid ${core}`,
          boxShadow: `0 0 8px 1px ${core}, inset 0 0 8px 0 ${core}`,
          opacity: 0.9,
        }}
      />
    </div>
  );
}
