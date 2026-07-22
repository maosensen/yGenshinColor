import { PageContainer } from "@/components/page-container";
import { SceneCard } from "@/components/showcase/scene-card";
import { Badge } from "@/components/ui/badge";
import { getScenes } from "@/lib/scenes";

export default function GalleryPage() {
  const scenes = getScenes();

  return (
    <PageContainer className="pt-14 pb-20">
      <section className="max-w-2xl">
        <Badge variant="outline" className="text-muted-foreground">
          非官方粉丝项目 · 开源
        </Badge>
        <h1 className="mt-5 font-display text-4xl font-bold leading-tight md:text-5xl">
          跟着原神学配色
        </h1>
        <p className="mt-4 text-base leading-relaxed text-muted-foreground md:text-lg">
          从提瓦特的场景中提取色卡与渐变,并讲清楚
          <em className="not-italic text-foreground">为什么和谐</em>
          ——色相的路线、明度的节奏、饱和度的分寸。点开一个场景,让它为整个页面上色。
        </p>
      </section>

      <section className="mt-14 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
        {scenes.map((scene) => (
          <SceneCard key={scene.id} scene={scene} />
        ))}
      </section>
    </PageContainer>
  );
}
