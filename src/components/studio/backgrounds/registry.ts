import { LinearAxis } from "./linear-axis";
import { RadialMesh } from "./radial-mesh";
import { RadialMeshDrift } from "./radial-mesh-drift";
import {
  DarkVeilBg,
  DarkVeilThumb,
  FerrofluidBg,
  FerrofluidThumb,
  FloatingLinesBg,
  FloatingLinesThumb,
  LightfallBg,
  LightfallThumb,
  LightPillarBg,
  LightPillarThumb,
  LiquidEtherBg,
  LiquidEtherThumb,
  SideRaysBg,
  SideRaysThumb,
  SilkBg,
  SilkThumb,
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
    id: "light-pillar",
    name: "Light Pillar",
    source: "React Bits",
    Component: LightPillarBg,
    Thumbnail: LightPillarThumb,
  },
  {
    id: "silk",
    name: "Silk",
    source: "React Bits",
    Component: SilkBg,
    Thumbnail: SilkThumb,
  },
  {
    id: "floating-lines",
    name: "Floating Lines",
    source: "React Bits",
    Component: FloatingLinesBg,
    Thumbnail: FloatingLinesThumb,
  },
  {
    id: "side-rays",
    name: "Side Rays",
    source: "React Bits",
    Component: SideRaysBg,
    Thumbnail: SideRaysThumb,
  },
];

export function getBackground(id: string): BackgroundDef {
  return BACKGROUNDS.find((b) => b.id === id) ?? BACKGROUNDS[0];
}
