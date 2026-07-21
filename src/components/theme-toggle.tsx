"use client";

import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <button
      type="button"
      aria-label="Toggle theme"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      className="rounded-full p-2 hover:bg-accent cursor-pointer"
    >
      <span
        className="icon-[solar--sun-2-line-duotone] block size-4.5 dark:hidden"
        aria-hidden
      />
      <span
        className="icon-[solar--moon-line-duotone] hidden size-4.5 dark:block"
        aria-hidden
      />
    </button>
  );
}
