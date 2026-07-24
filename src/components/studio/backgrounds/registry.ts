import { LinearAxis } from "./linear-axis";
import { RadialMesh } from "./radial-mesh";
import { RadialMeshDrift } from "./radial-mesh-drift";
import {
  AuroraBg,
  AuroraThumb,
  DotFieldBg,
  DotFieldThumb,
  FerrofluidBg,
  FerrofluidThumb,
  FloatingLinesBg,
  FloatingLinesThumb,
  LetterGlitchBg,
  LetterGlitchThumb,
  LightfallBg,
  LightfallThumb,
  LightPillarBg,
  LightPillarThumb,
  LiquidEtherBg,
  LiquidEtherThumb,
  OrbBg,
  OrbThumb,
  RippleGridBg,
  RippleGridThumb,
  SideRaysBg,
  SideRaysThumb,
  SilkBg,
  SilkThumb,
  SoftAuroraBg,
  SoftAuroraThumb,
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
  {
    id: "aurora",
    name: "Aurora",
    source: "React Bits",
    Component: AuroraBg,
    Thumbnail: AuroraThumb,
  },
  {
    id: "soft-aurora",
    name: "Soft Aurora",
    source: "React Bits",
    Component: SoftAuroraBg,
    Thumbnail: SoftAuroraThumb,
  },
  {
    id: "orb",
    name: "Orb",
    source: "React Bits",
    Component: OrbBg,
    Thumbnail: OrbThumb,
  },
  {
    id: "dot-field",
    name: "Dot Field",
    source: "React Bits",
    Component: DotFieldBg,
    Thumbnail: DotFieldThumb,
  },
  {
    id: "letter-glitch",
    name: "Letter Glitch",
    source: "React Bits",
    Component: LetterGlitchBg,
    Thumbnail: LetterGlitchThumb,
  },
  {
    id: "ripple-grid",
    name: "Ripple Grid",
    source: "React Bits",
    Component: RippleGridBg,
    Thumbnail: RippleGridThumb,
  },
];

export function getBackground(id: string): BackgroundDef {
  return BACKGROUNDS.find((b) => b.id === id) ?? BACKGROUNDS[0];
}
