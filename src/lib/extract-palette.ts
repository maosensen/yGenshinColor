"use client";

import { converter, formatHex } from "culori";

/**
 * Client-side palette extraction: draw the image to a small offscreen canvas,
 * cluster the pixels with k-means in OKLab (perceptually uniform, so cluster
 * centers land where the eye groups colors), then curate the clusters into a
 * palette:
 *
 * - near-white / near-black clusters are dropped (card frames, letterboxes
 *   and vignettes would otherwise waste palette slots),
 * - the five most-voiced survivors are kept, sorted dark → light,
 * - one entry is flagged `core` — the palette's theme color, scored by
 *   chroma × pixel share (saturated AND large wins).
 *
 * This is the in-browser counterpart of the (future) build-time extraction
 * pipeline described in docs/roadmap.md.
 */

export type ExtractedColor = {
  /** oklch() CSS string — feed to backgrounds */
  css: string;
  /** sRGB hex — the copy payload */
  hex: string;
  /** OKLab lightness, for sorting / contrast decisions */
  l: number;
  /** OKLCH chroma — how saturated this entry is */
  c: number;
  /** True on exactly one entry: the palette's core theme color. */
  core: boolean;
};

const SAMPLE_SIZE = 64;
const ITERATIONS = 12;
/** Cluster more than we keep, so dropping extremes still leaves 5 colors. */
const CLUSTER_COUNT = 8;
const PALETTE_SIZE = 5;

const toOklab = converter("oklab");
const toOklch = converter("oklch");

type Lab = [number, number, number];

function dist2(a: Lab, b: Lab): number {
  const dl = a[0] - b[0];
  const da = a[1] - b[1];
  const db = a[2] - b[2];
  return dl * dl + da * da + db * db;
}

/** Card frames / letterboxes: bright-and-grey or dark-and-grey clusters. */
function isNearWhiteOrBlack(l: number, chroma: number): boolean {
  if (l > 0.95 || l < 0.07) return true;
  if (l > 0.9 && chroma < 0.03) return true;
  if (l < 0.14 && chroma < 0.03) return true;
  return false;
}

export async function extractPalette(src: string): Promise<ExtractedColor[]> {
  const img = new Image();
  img.src = src;
  await img.decode();

  const canvas = document.createElement("canvas");
  canvas.width = SAMPLE_SIZE;
  canvas.height = SAMPLE_SIZE;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) throw new Error("canvas 2d context unavailable");
  ctx.drawImage(img, 0, 0, SAMPLE_SIZE, SAMPLE_SIZE);
  const { data } = ctx.getImageData(0, 0, SAMPLE_SIZE, SAMPLE_SIZE);

  // Collect opaque pixels as OKLab points.
  const points: Lab[] = [];
  for (let i = 0; i < data.length; i += 4) {
    if (data[i + 3] < 128) continue;
    const lab = toOklab({
      mode: "rgb",
      r: data[i] / 255,
      g: data[i + 1] / 255,
      b: data[i + 2] / 255,
    });
    points.push([lab.l, lab.a ?? 0, lab.b ?? 0]);
  }
  if (points.length === 0) return [];

  // Deterministic seeding: spread initial centers across the lightness range
  // so reruns on the same image always give the same palette.
  const k = CLUSTER_COUNT;
  const byLightness = [...points].sort((a, b) => a[0] - b[0]);
  let centers: Lab[] = Array.from({ length: k }, (_, i) => {
    const p = byLightness[Math.floor(((i + 0.5) / k) * byLightness.length)];
    return [...p] as Lab;
  });

  const assignment = new Array<number>(points.length).fill(0);
  const counts = new Array<number>(k).fill(0);
  for (let iter = 0; iter < ITERATIONS; iter++) {
    for (let p = 0; p < points.length; p++) {
      let best = 0;
      let bestD = Number.POSITIVE_INFINITY;
      for (let c = 0; c < k; c++) {
        const d = dist2(points[p], centers[c]);
        if (d < bestD) {
          bestD = d;
          best = c;
        }
      }
      assignment[p] = best;
    }
    const sums: Lab[] = Array.from({ length: k }, () => [0, 0, 0]);
    counts.fill(0);
    for (let p = 0; p < points.length; p++) {
      const c = assignment[p];
      sums[c][0] += points[p][0];
      sums[c][1] += points[p][1];
      sums[c][2] += points[p][2];
      counts[c]++;
    }
    centers = centers.map((center, c) =>
      counts[c] === 0
        ? center
        : [
            sums[c][0] / counts[c],
            sums[c][1] / counts[c],
            sums[c][2] / counts[c],
          ],
    );
  }

  // Curate: measure each cluster, drop extremes, keep the most-voiced five.
  const clusters = centers
    .map((center, i) => {
      const lch = toOklch({
        mode: "oklab" as const,
        l: center[0],
        a: center[1],
        b: center[2],
      });
      return {
        center,
        weight: counts[i] / points.length,
        l: lch.l,
        chroma: lch.c ?? 0,
        hue: lch.h ?? 0,
      };
    })
    .filter((c) => c.weight > 0);

  let kept = clusters.filter((c) => !isNearWhiteOrBlack(c.l, c.chroma));
  // Defensive: an almost-monochrome image may lose everything — fall back.
  if (kept.length < 3) kept = clusters;

  kept = kept.sort((a, b) => b.weight - a.weight).slice(0, PALETTE_SIZE);

  // Core theme color: saturated AND large. sqrt keeps a vivid accent
  // competitive against a big muted backdrop.
  const coreIndex = kept.reduce(
    (best, c, i) =>
      c.chroma * Math.sqrt(c.weight) >
      kept[best].chroma * Math.sqrt(kept[best].weight)
        ? i
        : best,
    0,
  );
  const core = kept[coreIndex];

  return kept
    .map((cluster) => {
      const lab = {
        mode: "oklab" as const,
        l: cluster.center[0],
        a: cluster.center[1],
        b: cluster.center[2],
      };
      return {
        css: `oklch(${cluster.l.toFixed(3)} ${cluster.chroma.toFixed(3)} ${cluster.hue.toFixed(1)})`,
        hex: formatHex(lab) ?? "#000000",
        l: cluster.l,
        c: cluster.chroma,
        core: cluster === core,
      };
    })
    .sort((a, b) => a.l - b.l);
}
