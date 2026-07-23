import { LinearAxis } from "./linear-axis";
import { RadialMesh } from "./radial-mesh";
import { RadialMeshDrift } from "./radial-mesh-drift";
import type { BackgroundDef } from "./types";

/**
 * Background preset registry. To add a preset — including ones adapted from
 * copy-paste libraries like React Bits — implement `BackgroundProps` and
 * append here with its origin as `source`.
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
];

export function getBackground(id: string): BackgroundDef {
  return BACKGROUNDS.find((b) => b.id === id) ?? BACKGROUNDS[0];
}
