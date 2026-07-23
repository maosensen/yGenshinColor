import type { BackgroundProps } from "./types";

/** Per-blob geometry; %-sized so the composition scales to any container. */
const BLOBS = [
  { left: "12%", top: "8%", size: "72%", duration: "19s", delay: "0s" },
  { left: "58%", top: "-6%", size: "65%", duration: "25s", delay: "-7s" },
  { left: "52%", top: "52%", size: "78%", duration: "31s", delay: "-13s" },
  { left: "-8%", top: "48%", size: "60%", duration: "23s", delay: "-4s" },
  { left: "30%", top: "26%", size: "55%", duration: "27s", delay: "-17s" },
];

/**
 * Animated radial mesh: blurred color blobs drifting slowly over the darkest
 * color (pure CSS — keyframes live in globals.css as .mesh-blob).
 */
export function RadialMeshDrift({ palette }: BackgroundProps) {
  const [base, ...colors] = palette;
  return (
    <div
      className="absolute inset-0 overflow-hidden"
      style={{ backgroundColor: base }}
    >
      {colors.map((color, i) => {
        const blob = BLOBS[i % BLOBS.length];
        return (
          <div
            key={`${color}-${blob.left}`}
            className="mesh-blob"
            style={{
              left: blob.left,
              top: blob.top,
              width: blob.size,
              height: blob.size,
              animationDuration: blob.duration,
              animationDelay: blob.delay,
              backgroundImage: `radial-gradient(circle, ${color} 0%, transparent 68%)`,
            }}
          />
        );
      })}
    </div>
  );
}
