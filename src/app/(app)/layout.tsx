import type { ReactNode } from "react";
import { SiteNav } from "@/components/showcase/site-nav";

/**
 * Showcase layout: sticky top nav, content, and the fan-project disclaimer
 * footer. Replaces the dashboard shell — this site is a gallery, not an
 * admin app.
 */
export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-svh flex-col">
      <SiteNav />
      <main className="flex-1">{children}</main>
      <footer className="border-t">
        <div className="mx-auto w-full max-w-7xl px-6 py-8 text-xs leading-relaxed text-muted-foreground">
          <p>
            Teyvat Palette
            是非官方、非商业的开源粉丝项目,遵循米哈游《二次创作指引》。
            《原神》及相关素材 © miHoYo /
            HoYoverse。本站色卡与渐变为独立提取的学习性内容。
          </p>
        </div>
      </footer>
    </div>
  );
}
