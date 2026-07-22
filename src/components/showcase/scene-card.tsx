import Link from "next/link";
import { gradientCss, REGIONS, type Scene, TIMES, toCss } from "@/lib/scenes";

/**
 * Gallery card: the reconstructed gradient is the artwork — no thumbnail,
 * no chrome. Name, region · time and the swatch dots sit below it.
 */
export function SceneCard({ scene }: { scene: Scene }) {
  return (
    <Link href={`/scene/${scene.id}`} className="group block">
      <div
        className="aspect-[16/10] rounded-2xl ring-1 ring-white/10 transition-transform duration-300 ease-out group-hover:scale-[1.02]"
        style={{ backgroundImage: gradientCss(scene) }}
      />
      <div className="mt-3.5 flex items-start justify-between gap-3 px-1">
        <div className="min-w-0">
          <h2 className="truncate font-display text-lg font-semibold">
            {scene.name}
          </h2>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {REGIONS[scene.region]} · {TIMES[scene.time]} ·{" "}
            {scene.mood.join(" / ")}
          </p>
        </div>
        <div className="mt-1.5 flex shrink-0 -space-x-1">
          {scene.palette.map((swatch) => (
            <span
              key={swatch.slug}
              className="size-4 rounded-full ring-2 ring-background"
              style={{ backgroundColor: toCss(swatch) }}
              title={swatch.name}
            />
          ))}
        </div>
      </div>
    </Link>
  );
}
