import type { BackgroundProps } from "./types";

/** Single-axis linear gradient — the palette laid straight along one axis. */
export function LinearAxis({ palette }: BackgroundProps) {
  return (
    <div
      className="absolute inset-0"
      style={{
        backgroundImage: `linear-gradient(170deg, ${palette.join(", ")})`,
      }}
    />
  );
}
