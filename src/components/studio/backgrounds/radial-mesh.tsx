import type { BackgroundProps } from "./types";

/** Fixed anchor points; index-stable so the same palette renders the same. */
const ANCHORS = [
  "18% 22%",
  "82% 18%",
  "72% 82%",
  "22% 78%",
  "52% 48%",
  "88% 55%",
];

/**
 * Static radial mesh: the darkest color grounds the canvas, every other
 * color becomes a soft radial pool blended over it.
 */
export function RadialMesh({ palette }: BackgroundProps) {
  const [base, ...pools] = palette;
  return (
    <div
      className="absolute inset-0"
      style={{
        backgroundColor: base,
        backgroundImage: pools
          .map(
            (color, i) =>
              `radial-gradient(ellipse 85% 70% at ${ANCHORS[i % ANCHORS.length]}, ${color}, transparent 62%)`,
          )
          .join(", "),
      }}
    />
  );
}
