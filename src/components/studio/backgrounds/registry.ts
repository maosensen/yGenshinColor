import { LinearAxis } from "./linear-axis";
import { RadialMesh } from "./radial-mesh";
import { RadialMeshDrift } from "./radial-mesh-drift";
import {
  DarkVeilBg,
  DarkVeilThumb,
  FerrofluidBg,
  FerrofluidThumb,
  LightfallBg,
  LightfallThumb,
  LiquidEtherBg,
  LiquidEtherThumb,
  PrismBg,
  PrismThumb,
} from "./reactbits";
import type { BackgroundDef } from "./types";

/**
 * Background preset registry. To add a preset — including ones adapted from
 * copy-paste libraries like React Bits — implement `BackgroundProps` and
 * append here with its origin as `source` (WebGL presets also provide a CSS
 * `Thumbnail` so the picker never stacks GL contexts).
 */
export const BACKGROUNDS: BackgroundDef[] = [
  {
    id: "radial-mesh-drift",
    name: "Radial Mesh · Animated",
    source: "Built-in",
    Component: RadialMeshDrift,
  },
  {
    id: "radial-mesh",
    name: "Radial Mesh",
    source: "Built-in",
    Component: RadialMesh,
  },
  {
    id: "linear-axis",
    name: "Linear Axis",
    source: "Built-in",
    Component: LinearAxis,
  },
  {
    id: "liquid-ether",
    name: "Liquid Ether",
    source: "React Bits",
    Component: LiquidEtherBg,
    Thumbnail: LiquidEtherThumb,
  },
  {
    id: "ferrofluid",
    name: "Ferrofluid",
    source: "React Bits",
    Component: FerrofluidBg,
    Thumbnail: FerrofluidThumb,
  },
  {
    id: "lightfall",
    name: "Lightfall",
    source: "React Bits",
    Component: LightfallBg,
    Thumbnail: LightfallThumb,
  },
  {
    id: "dark-veil",
    name: "Dark Veil",
    source: "React Bits",
    Component: DarkVeilBg,
    Thumbnail: DarkVeilThumb,
  },
  {
    id: "prism",
    name: "Prism",
    source: "React Bits",
    Component: PrismBg,
    Thumbnail: PrismThumb,
  },
];

export function getBackground(id: string): BackgroundDef {
  return BACKGROUNDS.find((b) => b.id === id) ?? BACKGROUNDS[0];
}
