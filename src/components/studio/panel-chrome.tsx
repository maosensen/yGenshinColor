"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { usePanelHandle } from "./draggable-panel";

/**
 * Shared frosted-glass surface for the floating studio panels: heavy blur
 * over the live canvas, a hairline ring and a top inset highlight that reads
 * as a lit glass edge, all riding the theme's overlay elevation.
 */
// Panels now float over the dark dotted ground (not the colorful canvas), so
// they read as raised solid surfaces rather than glass: the Card token sits a
// step lighter than the ground in dark mode, a hairline ring defines the edge,
// and an explicit drop shadow lifts it off the ground (the theme's overlay
// shadow is flat in dark). A light blur keeps a hint of glass at the edges.
export const GLASS_PANEL = cn(
  "rounded-2xl bg-card/92 backdrop-blur-md ring-1 ring-border",
  "[box-shadow:inset_0_1px_0_0_rgb(255_255_255/0.08),0_18px_44px_-16px_rgb(0_0_0/0.7)]",
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
  // The header doubles as the panel's drag handle when inside a DraggablePanel.
  const handle = usePanelHandle();
  return (
    <div
      className={cn(
        "flex items-center gap-2 px-3.5 pt-3 pb-2",
        handle && "cursor-grab touch-none active:cursor-grabbing",
      )}
      {...(handle?.listeners ?? {})}
    >
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
        // Don't let a click on collapse start a drag on the header handle.
        onPointerDown={(e) => e.stopPropagation()}
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
