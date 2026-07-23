"use client";

import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

/**
 * Light/dark toggle. Color is inherited (`currentColor`) so nav surfaces can
 * tint it; the site nav passes its muted-icon classes via className.
 */
export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <button
      type="button"
      aria-label="Toggle theme"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      className={cn(
        "cursor-pointer rounded-full p-2 transition-colors hover:bg-accent",
        className,
      )}
    >
      <span
        className="icon-[solar--sun-2-bold-duotone] block size-4.5 dark:hidden"
        aria-hidden
      />
      <span
        className="icon-[solar--moon-bold-duotone] hidden size-4.5 dark:block"
        aria-hidden
      />
    </button>
  );
}
