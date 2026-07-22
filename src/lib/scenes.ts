import fs from "node:fs";
import path from "node:path";
import { formatHex, oklch, wcagContrast } from "culori";
import { z } from "zod";

/**
 * Scene data model. Each file under `content/scenes/<id>.json` is one Teyvat
 * scene study: an OKLCH palette, a reconstructed gradient, and the "why it
 * works" analysis. These files are (eventually) the output of the extraction
 * pipeline; the first batch is hand-tuned.
 *
 * Server-only: loaded from the filesystem at build time (SSG).
 */

export const REGIONS = {
  mondstadt: "蒙德",
  liyue: "璃月",
  inazuma: "稻妻",
  sumeru: "须弥",
  fontaine: "枫丹",
  natlan: "纳塔",
  snezhnaya: "至冬",
} as const;

export const TIMES = {
  dawn: "晨",
  day: "昼",
  dusk: "昏",
  night: "夜",
} as const;

export type Region = keyof typeof REGIONS;
export type TimeOfDay = keyof typeof TIMES;

const oklchFields = {
  /** OKLCH lightness 0–1 */
  l: z.number().min(0).max(1),
  /** OKLCH chroma */
  c: z.number().min(0).max(0.4),
  /** OKLCH hue in degrees */
  h: z.number().min(0).max(360),
};

const swatchSchema = z.object({
  /** Display name, e.g. 落日金 */
  name: z.string(),
  /** Slug used in code exports, e.g. sunset-gold */
  slug: z.string().regex(/^[a-z0-9-]+$/),
  /** Role in the composition, e.g. 主色 / 环境色 / 点缀色 */
  role: z.string(),
  ...oklchFields,
});

const gradientStopSchema = z.object({
  ...oklchFields,
  /** Stop position 0–100 (%) */
  pos: z.number().min(0).max(100),
});

export const sceneSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  name: z.string(),
  nameEn: z.string(),
  region: z.enum(Object.keys(REGIONS) as [Region, ...Region[]]),
  time: z.enum(Object.keys(TIMES) as [TimeOfDay, ...TimeOfDay[]]),
  mood: z.array(z.string()).min(1).max(4),
  palette: z.array(swatchSchema).min(3).max(8),
  gradient: z.object({
    /** CSS linear-gradient angle in degrees */
    angle: z.number(),
    stops: z.array(gradientStopSchema).min(2),
  }),
  /** How this scene tints the whole UI while viewed. */
  theme: z.object({
    /** Index into `palette` used as --primary */
    primary: z.number().int().min(0),
    neutralHue: z.number().min(0).max(360),
    neutralTint: z.number().min(0).max(6),
  }),
  analysis: z.object({
    summary: z.string(),
    points: z
      .array(z.object({ title: z.string(), body: z.string() }))
      .min(2)
      .max(5),
  }),
});

export type Scene = z.infer<typeof sceneSchema>;
export type Swatch = Scene["palette"][number];

const SCENES_DIR = path.join(process.cwd(), "content", "scenes");

let cache: Scene[] | null = null;

/** All scenes, sorted by region order then name. Build-time only. */
export function getScenes(): Scene[] {
  if (cache) return cache;
  const regionOrder = Object.keys(REGIONS);
  cache = fs
    .readdirSync(SCENES_DIR)
    .filter((f) => f.endsWith(".json"))
    .map((f) => {
      const raw = JSON.parse(fs.readFileSync(path.join(SCENES_DIR, f), "utf8"));
      const scene = sceneSchema.parse(raw);
      if (scene.theme.primary >= scene.palette.length) {
        throw new Error(`${f}: theme.primary is out of palette range`);
      }
      return scene;
    })
    .sort(
      (a, b) =>
        regionOrder.indexOf(a.region) - regionOrder.indexOf(b.region) ||
        a.id.localeCompare(b.id),
    );
  return cache;
}

export function getScene(id: string): Scene | undefined {
  return getScenes().find((s) => s.id === id);
}

/* ------------------------------ color helpers ----------------------------- */

type OklchLike = { l: number; c: number; h: number };

/** Native CSS oklch() string — usable directly in styles and gradients. */
export function toCss({ l, c, h }: OklchLike): string {
  return `oklch(${l} ${c} ${h})`;
}

/** sRGB hex for copy / export (gamut-clipped by culori). */
export function toHex({ l, c, h }: OklchLike): string {
  return formatHex(oklch({ mode: "oklch", l, c, h })) ?? "#000000";
}

/** CSS linear-gradient() reconstructed from the scene's stops. */
export function gradientCss(scene: Scene, angle = scene.gradient.angle) {
  const stops = scene.gradient.stops
    .map((s) => `${toCss(s)} ${s.pos}%`)
    .join(", ");
  return `linear-gradient(${angle}deg, ${stops})`;
}

/** "white" | "black" — the readable text color on top of a swatch. */
export function textOn(color: OklchLike): "white" | "black" {
  const c = oklch({ mode: "oklch", ...color });
  return wcagContrast(c, "white") >= wcagContrast(c, "black")
    ? "white"
    : "black";
}
