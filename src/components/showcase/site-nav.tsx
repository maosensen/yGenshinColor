"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";

// Every nav glyph comes from the Solar set so the header reads as one family.
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
 * Showcase top navigation: brand wordmark on the left, a short link row and
 * the white-preview (theme) toggle on the right. Replaces the dashboard
 * sidebar shell — a gallery site reads top-down, not from a side rail.
 */
export function SiteNav() {
  const pathname = usePathname();

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
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm transition-colors",
                pathname === link.href
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <span className={cn(link.icon, "size-4")} aria-hidden />
              {link.label}
            </Link>
          ))}
          <a
            href="https://github.com/maosensen/yGenshinColor"
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub repository"
            className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            <span
              className="icon-[solar--code-square-bold-duotone] block size-4.5"
              aria-hidden
            />
            <span className="sr-only">GitHub</span>
          </a>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
