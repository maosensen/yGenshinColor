import type { ReactNode } from "react";

/**
 * Content pages (gallery, scene details, changelog) scroll normally and end
 * with the fan-project disclaimer footer. The studio page lives outside this
 * group — its canvas fills the viewport with no page scroll.
 */
export default function ContentLayout({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
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
    </>
  );
}
