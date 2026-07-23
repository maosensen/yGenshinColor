"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/utils";

/**
 * Shared frosted-glass surface for the floating studio panels: heavy blur
 * over the live canvas, a hairline ring and a top inset highlight that reads
 * as a lit glass edge, all riding the theme's overlay elevation.
 */
// 80% ground: enough opacity that text keeps stable contrast over any canvas
// color, while the blur still reads as glass at the edges. blur-xl (24px)
// instead of 2xl: backdrop-filter re-blurs the animated canvas every frame,
// and at 80% opacity the smaller radius is visually identical but far
// cheaper to composite.
export const GLASS_PANEL = cn(
  "rounded-2xl bg-background/80 backdrop-blur-xl backdrop-saturate-150 ring-1 ring-border",
  "[box-shadow:inset_0_1px_0_0_rgb(255_255_255/0.07),var(--shadow-overlay)]",
);

/** Icon-chip + title header row shared by the floating panels. */
export function PanelHeader({
  icon,
  title,
  meta,
  onCollapse,
}: {
  icon: string;
  title: string;
  /** Small mono annotation next to the title (e.g. a count). */
  meta?: string;
  onCollapse: () => void;
}) {
  return (
    <div className="flex items-center gap-2 px-3.5 pt-3 pb-2">
      <span
        className="flex size-6 items-center justify-center rounded-md bg-primary/12 text-primary"
        aria-hidden
      >
        <span className={cn(icon, "size-4")} />
      </span>
      <h2 className="font-medium text-sm">{title}</h2>
      {meta !== undefined && (
        <span className="font-mono text-[10px] text-muted-foreground tabular-nums tracking-wider">
          {meta}
        </span>
      )}
      <button
        type="button"
        aria-label={`Collapse ${title} panel`}
        title={`Collapse ${title} panel`}
        onClick={onCollapse}
        className="ml-auto cursor-pointer rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
      >
        <span
          className="icon-[solar--minimize-square-minimalistic-linear] size-4"
          aria-hidden
        />
      </button>
    </div>
  );
}

/**
 * Collapsed-panel restorer: a glass pill that grows its label on hover, so
 * the collapsed state stays quiet but never cryptic.
 */
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
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      type="button"
      aria-label={label}
      onClick={onClick}
      className={cn(
        GLASS_PANEL,
        "group absolute top-4 z-20 flex h-11 cursor-pointer items-center gap-0 overflow-hidden px-3 text-muted-foreground transition-colors hover:text-foreground",
        side === "left" ? "left-4" : "right-4 flex-row-reverse",
      )}
    >
      <span className={cn(icon, "size-5 shrink-0")} aria-hidden />
      <span
        className={cn(
          "max-w-0 overflow-hidden whitespace-nowrap text-xs opacity-0 transition-all duration-300 group-hover:max-w-24 group-hover:opacity-100",
          side === "left" ? "group-hover:pl-2" : "group-hover:pr-2",
        )}
      >
        {label}
      </span>
    </motion.button>
  );
}
