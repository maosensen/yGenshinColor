import { Badge } from "@/components/ui/badge";
import { gradientCss, REGIONS, type Scene, TIMES } from "@/lib/scenes";

/**
 * Scene detail hero: the reconstructed gradient at full bleed inside the
 * container, slowly drifting (.gradient-drift). A bottom scrim keeps the
 * title readable on any scene brightness.
 */
export function GradientHero({ scene }: { scene: Scene }) {
  return (
    <section
      className="gradient-drift relative flex min-h-[26rem] flex-col justify-end overflow-hidden rounded-3xl ring-1 ring-white/10 md:min-h-[30rem]"
      style={{ backgroundImage: gradientCss(scene) }}
    >
      <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/50 to-transparent" />
      <div className="relative p-7 text-white md:p-10">
        <div className="flex flex-wrap items-center gap-2">
          <Badge className="border-white/25 bg-white/15 text-white backdrop-blur-sm">
            {REGIONS[scene.region]}
          </Badge>
          <Badge className="border-white/25 bg-white/15 text-white backdrop-blur-sm">
            {TIMES[scene.time]}
          </Badge>
          {scene.mood.map((m) => (
            <Badge
              key={m}
              className="border-white/15 bg-white/8 text-white/85 backdrop-blur-sm"
            >
              {m}
            </Badge>
          ))}
        </div>
        <h1 className="mt-4 font-display text-4xl font-bold md:text-5xl">
          {scene.name}
        </h1>
        <p className="mt-2 font-display text-sm italic text-white/70 md:text-base">
          {scene.nameEn}
        </p>
      </div>
    </section>
  );
}
