"use client";

import { motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SocialLinks } from "@/components/showcase/social-links";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";

// Every nav glyph comes from the Solar set so the header reads as one family
// (brand marks live in SocialLinks as inline SVGs — Solar has none).
const links = [
  { href: "/", label: "Studio", icon: "icon-[solar--pallete-2-linear]" },
  {
    href: "/scenes",
    label: "场景库",
    icon: "icon-[solar--gallery-wide-linear]",
  },
  {
    href: "/changelog",
    label: "Changelog",
    icon: "icon-[solar--document-text-linear]",
  },
];

/**
 * Showcase top navigation, following the yStage header conventions: the
 * active link is marked by a shared-layout pill that slides between
 * destinations, a hairline divider separates links from the icon cluster
 * (theme toggle + inline-SVG brand links).
 */
export function SiteNav() {
  const pathname = usePathname();
  const reduce = useReducedMotion();

  return (
    <header className="sticky top-0 z-30 border-b bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-6">
        <Link href="/" className="flex items-baseline gap-2.5">
          <span className="font-display text-xl font-semibold tracking-wide">
            Teyvat Palette
          </span>
          <span className="hidden text-xs text-muted-foreground sm:inline">
            提瓦特色卡
          </span>
        </Link>

        <nav className="flex items-center gap-1">
          {links.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "relative flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm transition-colors",
                  active
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {active && (
                  <motion.span
                    layoutId={reduce ? undefined : "site-nav-pill"}
                    className="absolute inset-0 rounded-full bg-foreground/[0.06] ring-1 ring-border dark:bg-foreground/[0.08]"
                    transition={{ type: "spring", stiffness: 400, damping: 34 }}
                  />
                )}
                <span
                  className={cn(link.icon, "relative size-4")}
                  aria-hidden
                />
                <span className="relative">{link.label}</span>
              </Link>
            );
          })}
          <span className="mx-2 h-4 w-px bg-border" aria-hidden />
          <ThemeToggle className="text-muted-foreground hover:text-foreground" />
          <SocialLinks />
        </nav>
      </div>
    </header>
  );
}
