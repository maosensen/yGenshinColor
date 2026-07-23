import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageContainer } from "@/components/page-container";
import { ExportPanel } from "@/components/showcase/export-panel";
import { GradientHero } from "@/components/showcase/gradient-hero";
import {
  PaletteStrip,
  type SwatchView,
} from "@/components/showcase/palette-strip";
import { SceneThemer } from "@/components/showcase/scene-themer";
import { Card, CardContent } from "@/components/ui/card";
import { buildExports } from "@/lib/palette-export";
import { getScene, getScenes, textOn, toCss, toHex } from "@/lib/scenes";

type Params = { id: string };

export function generateStaticParams(): Params[] {
  return getScenes().map((scene) => ({ id: scene.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const scene = getScene((await params).id);
  return scene
    ? { title: scene.name, description: scene.analysis.summary }
    : {};
}

export default async function ScenePage({
  params,
}: {
  params: Promise<Params>;
}) {
  const scene = getScene((await params).id);
  if (!scene) notFound();

  const swatches: SwatchView[] = scene.palette.map((s) => ({
    name: s.name,
    slug: s.slug,
    role: s.role,
    css: toCss(s),
    hex: toHex(s),
    label: `oklch(${s.l} ${s.c} ${s.h})`,
    text: textOn(s),
  }));

  const accent = scene.palette[scene.theme.primary];

  return (
    <PageContainer className="pt-8 pb-20">
      <SceneThemer
        theme={{
          primary: toCss(accent),
          primaryForeground:
            textOn(accent) === "white" ? "oklch(0.98 0 0)" : "oklch(0.16 0 0)",
          neutralHue: scene.theme.neutralHue,
          neutralTint: scene.theme.neutralTint,
        }}
      />

      <Link
        href="/"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <span
          className="icon-[solar--alt-arrow-left-linear] size-4"
          aria-hidden
        />
        画廊
      </Link>

      <GradientHero scene={scene} />

      <section className="mt-12">
        <h2 className="font-display text-2xl font-semibold">色卡</h2>
        <p className="mt-1.5 mb-5 text-sm text-muted-foreground">
          点击色块复制 HEX;悬停查看 OKLCH 值。
        </p>
        <PaletteStrip swatches={swatches} />
      </section>

      <section className="mt-14">
        <h2 className="font-display text-2xl font-semibold">为什么和谐</h2>
        <p className="mt-4 max-w-3xl border-l-2 border-primary pl-4 text-base leading-relaxed text-muted-foreground">
          {scene.analysis.summary}
        </p>
        <div className="mt-7 grid gap-4 md:grid-cols-3">
          {scene.analysis.points.map((point, i) => (
            <Card key={point.title}>
              <CardContent className="space-y-2.5">
                <div className="font-mono text-xs text-primary">
                  {String(i + 1).padStart(2, "0")}
                </div>
                <h3 className="font-medium">{point.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {point.body}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="mt-14">
        <h2 className="font-display text-2xl font-semibold">带走这组颜色</h2>
        <p className="mt-1.5 mb-5 text-sm text-muted-foreground">
          CSS 变量、Tailwind v4 主题或 SVG,一键复制到你的项目。
        </p>
        <ExportPanel exports={buildExports(scene)} />
      </section>
    </PageContainer>
  );
}
