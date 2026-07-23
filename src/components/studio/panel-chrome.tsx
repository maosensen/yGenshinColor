"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/utils";

/** Shared frosted-glass surface for the floating studio panels. */
export const GLASS_PANEL =
  "rounded-2xl bg-background/55 shadow-(--shadow-overlay) ring-1 ring-border backdrop-blur-2xl";

export function PanelHeader({
  title,
  onCollapse,
}: {
  title: string;
  onCollapse: () => void;
}) {
  return (
    <div className="flex items-center justify-between px-4 pt-3 pb-2">
      <h2 className="text-sm font-medium">{title}</h2>
      <button
        type="button"
        aria-label={`收起${title}栏`}
        onClick={onCollapse}
        className="cursor-pointer rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
      >
        <span
          className="icon-[solar--minimize-square-minimalistic-linear] size-4"
          aria-hidden
        />
      </button>
    </div>
  );
}

export function PanelOpener({
  side,
  label,
  icon,
  onClick,
}: {
  side: "left" | "right";
  label: string;
  icon: string;
  onClick: () => void;
}) {
  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      type="button"
      aria-label={label}
      onClick={onClick}
      className={cn(
        GLASS_PANEL,
        "absolute top-4 z-20 flex size-11 cursor-pointer items-center justify-center text-muted-foreground transition-colors hover:text-foreground",
        side === "left" ? "left-4" : "right-4",
      )}
    >
      <span className={cn(icon, "size-5")} aria-hidden />
    </motion.button>
  );
}
