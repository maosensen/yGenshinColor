"use client";

import { converter, formatHex } from "culori";

/**
 * Client-side palette extraction: draw the image to a small offscreen canvas,
 * cluster the pixels with k-means in OKLab (perceptually uniform, so cluster
 * centers land where the eye groups colors), and return the centers sorted
 * dark → light as CSS-ready strings.
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
};

const SAMPLE_SIZE = 64;
const ITERATIONS = 12;

const toOklab = converter("oklab");
const toOklch = converter("oklch");

type Lab = [number, number, number];

function dist2(a: Lab, b: Lab): number {
  const dl = a[0] - b[0];
  const da = a[1] - b[1];
  const db = a[2] - b[2];
  return dl * dl + da * da + db * db;
}

export async function extractPalette(
  src: string,
  k = 5,
): Promise<ExtractedColor[]> {
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
  const byLightness = [...points].sort((a, b) => a[0] - b[0]);
  let centers: Lab[] = Array.from({ length: k }, (_, i) => {
    const p = byLightness[Math.floor(((i + 0.5) / k) * byLightness.length)];
    return [...p] as Lab;
  });

  const assignment = new Array<number>(points.length).fill(0);
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
    const counts = new Array<number>(k).fill(0);
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

  return centers
    .sort((a, b) => a[0] - b[0])
    .map(([l, a, b]) => {
      const lab = { mode: "oklab" as const, l, a, b };
      const lch = toOklch(lab);
      const cs = `oklch(${lch.l.toFixed(3)} ${(lch.c ?? 0).toFixed(3)} ${(lch.h ?? 0).toFixed(1)})`;
      return { css: cs, hex: formatHex(lab) ?? "#000000", l };
    });
}
