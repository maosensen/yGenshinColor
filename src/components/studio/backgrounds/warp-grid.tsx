"use client";

import { formatHex } from "culori";
import { useEffect, useRef } from "react";
import type { BackgroundProps } from "./types";

/**
 * Warp Grid — a built-in background inspired by the satoriui.site hero: a
 * faint square grid over near-black, pinched toward a slowly drifting focal
 * point (a smooth "gravity well"), with the lines and intersection nodes near
 * the focus glowing in the palette's core theme color.
 *
 * Canvas 2D (not WebGL): cheap at the small artboard size, fully deterministic,
 * and free of GL-context concerns. rAF is cancelled on cleanup.
 */

const SPACING = 46; // grid cell size (css px)
const WELL_RADIUS = 250; // px — reach of the warp
const PULL = 0.55; // how far focus-adjacent nodes are pulled inward (0–1)

function hexToRgb(hex: string): [number, number, number] {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return m
    ? [parseInt(m[1], 16), parseInt(m[2], 16), parseInt(m[3], 16)]
    : [120, 160, 255];
}

export function WarpGrid({ core }: BackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // Latest core color read inside the loop without re-running the effect.
  const coreRef = useRef(core);
  coreRef.current = core;

  useEffect(() => {
    const canvas = canvasRef.current;
    const parent = canvas?.parentElement;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !parent || !ctx) return;

    let raf = 0;
    let w = 0;
    let h = 0;
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = parent.clientWidth;
      h = parent.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const draw = (t: number) => {
      const time = reduce ? 0 : t / 1000;
      const [r, g, b] = hexToRgb(formatHex(coreRef.current) ?? "#88aaff");
      ctx.clearRect(0, 0, w, h);

      // Focus drifts on a slow Lissajous around the upper-middle.
      const fx = w / 2 + Math.cos(time * 0.18) * w * 0.1;
      const fy = h * 0.46 + Math.sin(time * 0.23) * h * 0.1;

      const cols = Math.ceil(w / SPACING) + 2;
      const rows = Math.ceil(h / SPACING) + 2;

      // Displace each node toward the focus by a smooth well falloff, and keep
      // the well value as a per-node intensity for colour/glow.
      const px: number[][] = [];
      const py: number[][] = [];
      const inten: number[][] = [];
      for (let j = 0; j < rows; j++) {
        px[j] = [];
        py[j] = [];
        inten[j] = [];
        for (let i = 0; i < cols; i++) {
          const gx = i * SPACING;
          const gy = j * SPACING;
          const dx = gx - fx;
          const dy = gy - fy;
          const d2 = dx * dx + dy * dy;
          const well =
            (WELL_RADIUS * WELL_RADIUS) / (d2 + WELL_RADIUS * WELL_RADIUS);
          const pull = PULL * well;
          px[j][i] = gx - dx * pull;
          py[j][i] = gy - dy * pull;
          inten[j][i] = well;
        }
      }

      // Lines: dim baseline everywhere, brightening toward the focus.
      ctx.lineWidth = 1;
      for (let j = 0; j < rows; j++) {
        for (let i = 0; i < cols; i++) {
          const a = 0.04 + inten[j][i] * 0.6;
          ctx.strokeStyle = `rgba(${r},${g},${b},${a})`;
          if (i < cols - 1) {
            ctx.beginPath();
            ctx.moveTo(px[j][i], py[j][i]);
            ctx.lineTo(px[j][i + 1], py[j][i + 1]);
            ctx.stroke();
          }
          if (j < rows - 1) {
            ctx.beginPath();
            ctx.moveTo(px[j][i], py[j][i]);
            ctx.lineTo(px[j + 1][i], py[j + 1][i]);
            ctx.stroke();
          }
        }
      }

      // Glowing intersection nodes near the focus.
      for (let j = 0; j < rows; j++) {
        for (let i = 0; i < cols; i++) {
          const v = inten[j][i];
          if (v < 0.28) continue;
          ctx.beginPath();
          ctx.fillStyle = `rgba(${r},${g},${b},${v})`;
          ctx.shadowColor = `rgba(${r},${g},${b},${v})`;
          ctx.shadowBlur = v * 14;
          ctx.arc(px[j][i], py[j][i], 1 + v * 2.2, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.shadowBlur = 0;

      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas ref={canvasRef} className="absolute inset-0 block h-full w-full" />
  );
}

/** CSS stand-in for the picker: faint grid + a central accent bloom. */
export function WarpGridThumb({ core }: BackgroundProps) {
  return (
    <div className="absolute inset-0" style={{ backgroundColor: "#060606" }}>
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(rgb(255 255 255 / 0.12) 1px, transparent 1px), linear-gradient(90deg, rgb(255 255 255 / 0.12) 1px, transparent 1px)",
          backgroundSize: "12px 12px",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(circle at 50% 46%, ${core} 0%, transparent 42%)`,
          opacity: 0.7,
          filter: "blur(2px)",
        }}
      />
    </div>
  );
}
