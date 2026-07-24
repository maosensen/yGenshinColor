"use client";

import { converter, formatHex } from "culori";
import { useMemo } from "react";
import type { BackgroundProps } from "./types";
import Ferrofluid from "./vendor/Ferrofluid";
import FloatingLines from "./vendor/FloatingLines";
import Lightfall from "./vendor/Lightfall";
import LightPillar from "./vendor/LightPillar";
import LiquidEther from "./vendor/LiquidEther";
import SideRays from "./vendor/SideRays";
import Silk from "./vendor/Silk";

/**
 * Adapters mapping our `({ palette, core })` contract onto the vendored
 * React Bits backgrounds. Presets take 1–3 colors (or a hue rotation), so a
 * shared picker chooses which palette entries to spend:
 *
 * - 1 slot  → the core theme color,
 * - n slots → core first, then max-min greedy in OKLab (each next pick is
 *   the entry farthest from everything already chosen), so two slots never
 *   waste themselves on near-twins.
 *
 * The animated component paints on a plain dark ground — palette colors are
 * never used as a backdrop fill.
 *
 * WebGL note: only the active canvas mounts one of these — the picker panel
 * uses the lightweight CSS thumbnails below, so context count stays at 1.
 */

const toOklab = converter("oklab");

type Parsed = { css: string; l: number; lab: [number, number, number] };

function parse(css: string): Parsed | null {
  const lab = toOklab(css);
  if (!lab) return null;
  return { css, l: lab.l, lab: [lab.l, lab.a ?? 0, lab.b ?? 0] };
}

function labDist(a: Parsed, b: Parsed): number {
  const dl = a.lab[0] - b.lab[0];
  const da = a.lab[1] - b.lab[1];
  const db = a.lab[2] - b.lab[2];
  return dl * dl + da * da + db * db;
}

/**
 * Pick `n` palette entries as hex, seeded with the core color, then max-min
 * greedy for spread. `minL` biases glow-type presets toward luminous picks
 * (relaxed automatically when the palette is too dark to satisfy it).
 * Returned dark → light.
 */
function pickColors(
  palette: string[],
  core: string,
  n: number,
  minL = 0,
): string[] {
  const parsed = palette.map(parse).filter((p): p is Parsed => p !== null);
  if (parsed.length === 0) return Array(n).fill("#888888");

  let pool = parsed.filter((p) => p.l >= minL);
  if (pool.length < n) pool = parsed;

  const coreParsed = parse(core);
  const seed =
    pool.find((p) => p.css === core) ??
    (coreParsed
      ? pool.reduce((best, p) =>
          labDist(p, coreParsed) < labDist(best, coreParsed) ? p : best,
        )
      : pool[pool.length - 1]);

  const chosen: Parsed[] = [seed];
  while (chosen.length < n) {
    let best: Parsed | null = null;
    let bestScore = -1;
    for (const cand of pool) {
      if (chosen.includes(cand)) continue;
      const minDist = Math.min(...chosen.map((ch) => labDist(cand, ch)));
      if (minDist > bestScore) {
        bestScore = minDist;
        best = cand;
      }
    }
    if (!best) break;
    chosen.push(best);
  }
  while (chosen.length < n) chosen.push(seed);

  return chosen
    .sort((a, b) => a.l - b.l)
    .map((p) => formatHex(p.css) ?? "#888888");
}

/*
 * Performance: these presets fill the whole viewport — on a 2x display the
 * stock "min(devicePixelRatio, 2)" setting. That was clamped to 1x while the
 * background filled the whole viewport (~7M px/frame); now it renders inside
 * a small framed artboard (960×540), so native DPR is affordable again — and
 * at 1x these noise-based shaders looked visibly grainy, so DPR is left at
 * the vendor default (min(devicePixelRatio, 2)).
 */

/* ------------------------------- adapters -------------------------------- */
/* Wrappers are transparent — the artboard (Stage) owns the backdrop color,
   so its black/white toggle shows through wherever a preset has alpha. */

export function LiquidEtherBg({ palette, core }: BackgroundProps) {
  const colors = useMemo(() => pickColors(palette, core, 3), [palette, core]);
  return (
    <div className="absolute inset-0">
      <LiquidEther colors={colors} autoDemo autoSpeed={0.4} />
    </div>
  );
}

export function FerrofluidBg({ palette, core }: BackgroundProps) {
  const colors = useMemo(
    () => pickColors(palette, core, 3, 0.3),
    [palette, core],
  );
  return (
    <div className="absolute inset-0">
      <Ferrofluid colors={colors} speed={0.4} glow={1.6} />
    </div>
  );
}

export function LightfallBg({ palette, core }: BackgroundProps) {
  const colors = useMemo(
    () => pickColors(palette, core, 3, 0.3),
    [palette, core],
  );
  // backgroundColor intentionally left to the component default.
  return (
    <div className="absolute inset-0">
      <Lightfall colors={colors} />
    </div>
  );
}

export function LightPillarBg({ palette, core }: BackgroundProps) {
  const [bottom, top] = useMemo(
    () => pickColors(palette, core, 2, 0.25),
    [palette, core],
  );
  // Stock look runs dark (top) → bright (bottom); keep that weighting.
  return (
    <div className="absolute inset-0">
      <LightPillar topColor={bottom} bottomColor={top} />
    </div>
  );
}

export function SilkBg({ core }: BackgroundProps) {
  const color = useMemo(() => formatHex(core) ?? "#7B7481", [core]);
  return (
    <div className="absolute inset-0">
      <Silk color={color} speed={3} />
    </div>
  );
}

export function FloatingLinesBg({ palette, core }: BackgroundProps) {
  const linesGradient = useMemo(
    () => pickColors(palette, core, 3, 0.3),
    [palette, core],
  );
  return (
    <div className="absolute inset-0">
      <FloatingLines linesGradient={linesGradient} />
    </div>
  );
}

export function SideRaysBg({ palette, core }: BackgroundProps) {
  const [ray2, ray1] = useMemo(
    () => pickColors(palette, core, 2, 0.35),
    [palette, core],
  );
  return (
    <div className="absolute inset-0">
      <SideRays rayColor1={ray1} rayColor2={ray2} />
    </div>
  );
}

/* ------------------------------ thumbnails ------------------------------- */
/* CSS stand-ins for the picker: one WebGL context on the page is plenty. */

const THUMB_BG = "#050505";

export function LiquidEtherThumb({ palette, core }: BackgroundProps) {
  const colors = pickColors(palette, core, 3);
  return (
    <div
      className="absolute inset-0"
      style={{
        backgroundColor: THUMB_BG,
        backgroundImage: colors
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

export function FerrofluidThumb({ palette, core }: BackgroundProps) {
  const [, , light] = pickColors(palette, core, 3, 0.3);
  return (
    <div
      className="absolute inset-0"
      style={{
        backgroundColor: THUMB_BG,
        backgroundImage: `radial-gradient(circle at 50% 55%, transparent 0 22%, ${light} 26%, transparent 34%), radial-gradient(circle at 42% 46%, ${light} 0 3%, transparent 8%)`,
      }}
    />
  );
}

export function LightfallThumb({ palette, core }: BackgroundProps) {
  const streaks = pickColors(palette, core, 3, 0.3);
  return (
    <div
      className="absolute inset-0"
      style={{
        backgroundColor: THUMB_BG,
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

export function LightPillarThumb({ palette, core }: BackgroundProps) {
  const [dark, light] = pickColors(palette, core, 2, 0.25);
  return (
    <div
      className="absolute inset-0"
      style={{
        backgroundColor: THUMB_BG,
        backgroundImage: `linear-gradient(180deg, ${dark} 0%, ${light} 100%)`,
        backgroundSize: "18% 100%",
        backgroundPosition: "50% 0",
        backgroundRepeat: "no-repeat",
        filter: "blur(6px)",
      }}
    />
  );
}

export function SilkThumb({ core }: BackgroundProps) {
  return (
    <div className="absolute inset-0" style={{ backgroundColor: core }}>
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(125deg, rgb(0 0 0 / 0.55) 0%, transparent 45%, rgb(0 0 0 / 0.35) 70%, rgb(255 255 255 / 0.12) 100%)",
        }}
      />
    </div>
  );
}

export function FloatingLinesThumb({ palette, core }: BackgroundProps) {
  const colors = pickColors(palette, core, 3, 0.3);
  return (
    <div
      className="absolute inset-0"
      style={{
        backgroundColor: THUMB_BG,
        backgroundImage: colors
          .map(
            (c, i) =>
              `linear-gradient(180deg, transparent calc(${28 + i * 22}% - 1px), ${c} ${28 + i * 22}%, transparent calc(${28 + i * 22}% + 2px))`,
          )
          .join(", "),
        filter: "blur(0.4px)",
      }}
    />
  );
}

export function SideRaysThumb({ palette, core }: BackgroundProps) {
  const [ray2, ray1] = pickColors(palette, core, 2, 0.35);
  return (
    <div className="absolute inset-0" style={{ backgroundColor: THUMB_BG }}>
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `conic-gradient(from 118deg at -4% -10%, transparent 8%, ${ray1} 13%, transparent 20%, ${ray2} 26%, transparent 34%)`,
          filter: "blur(5px)",
          opacity: 0.9,
        }}
      />
    </div>
  );
}
