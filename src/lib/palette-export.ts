import { gradientCss, type Scene, toCss, toHex } from "@/lib/scenes";

/**
 * Code-export generators for a scene. Pure string builders — computed on the
 * server and handed to the export panel, so the client bundle stays free of
 * culori and the scene loader.
 */

export type SceneExports = {
  css: string;
  tailwind: string;
  svg: string;
};

export function buildExports(scene: Scene): SceneExports {
  return {
    css: cssVariables(scene),
    tailwind: tailwindTheme(scene),
    svg: svgGradient(scene),
  };
}

function cssVariables(scene: Scene): string {
  const lines = scene.palette.map(
    (s) => `  --${s.slug}: ${toCss(s)}; /* ${s.name} ${toHex(s)} */`,
  );
  return [
    `/* ${scene.name} · ${scene.nameEn} — Teyvat Palette */`,
    ":root {",
    ...lines,
    `  --gradient-${scene.id}: ${gradientCss(scene)};`,
    "}",
  ].join("\n");
}

function tailwindTheme(scene: Scene): string {
  const lines = scene.palette.map(
    (s) => `  --color-${s.slug}: ${toCss(s)}; /* ${s.name} */`,
  );
  return [
    `/* ${scene.name} · ${scene.nameEn} — Tailwind v4 @theme */`,
    "@theme {",
    ...lines,
    "}",
  ].join("\n");
}

function svgGradient(scene: Scene): string {
  // SVG gradients don't take an angle; express the CSS angle as a unit vector.
  const rad = ((scene.gradient.angle - 90) * Math.PI) / 180;
  const x2 = (0.5 + Math.cos(rad) / 2).toFixed(3);
  const y2 = (0.5 + Math.sin(rad) / 2).toFixed(3);
  const x1 = (1 - Number(x2)).toFixed(3);
  const y1 = (1 - Number(y2)).toFixed(3);
  const stops = scene.gradient.stops
    .map((s) => `      <stop offset="${s.pos}%" stop-color="${toHex(s)}" />`)
    .join("\n");
  return [
    `<!-- ${scene.name} · ${scene.nameEn} — Teyvat Palette -->`,
    `<svg width="1200" height="750" viewBox="0 0 1200 750" xmlns="http://www.w3.org/2000/svg">`,
    "  <defs>",
    `    <linearGradient id="${scene.id}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}">`,
    stops,
    "    </linearGradient>",
    "  </defs>",
    `  <rect width="1200" height="750" fill="url(#${scene.id})" />`,
    "</svg>",
  ].join("\n");
}
