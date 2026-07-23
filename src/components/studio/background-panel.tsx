"use client";

import { AnimatePresence, motion } from "motion/react";
import type { CSSProperties } from "react";
import { Badge } from "@/components/ui/badge";
import { useStudioStore } from "@/lib/stores/studio-store";
import { cn } from "@/lib/utils";
import { BACKGROUNDS } from "./backgrounds/registry";
import { NEUTRAL_PREVIEW_PALETTE } from "./backgrounds/types";
import { GLASS_PANEL, PanelHeader, PanelOpener } from "./panel-chrome";

/** Soften the blob blur inside the small thumbnails. */
const PREVIEW_STYLE = { "--blob-blur": "14px" } as CSSProperties;

export function BackgroundPanel() {
  const open = useStudioStore((s) => s.bgPanelOpen);
  const toggle = useStudioStore((s) => s.toggleBgPanel);
  const backgroundId = useStudioStore((s) => s.backgroundId);
  const setBackground = useStudioStore((s) => s.setBackground);

  return (
    <>
      <AnimatePresence initial={false}>
        {open && (
          <motion.aside
            initial={{ x: 24, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 24, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className={cn(
              GLASS_PANEL,
              "absolute top-4 right-4 bottom-4 z-20 flex w-64 flex-col",
            )}
          >
            <PanelHeader title="背景" onCollapse={toggle} />
            <div className="min-h-0 flex-1 space-y-3 overflow-y-auto px-3 pb-3">
              {BACKGROUNDS.map((bg) => (
                <button
                  key={bg.id}
                  type="button"
                  onClick={() => setBackground(bg.id)}
                  className={cn(
                    "group w-full cursor-pointer overflow-hidden rounded-xl text-left ring-1 ring-border transition-shadow",
                    backgroundId === bg.id && "ring-2 ring-primary",
                  )}
                >
                  <div
                    className="pointer-events-none relative aspect-video overflow-hidden"
                    style={PREVIEW_STYLE}
                  >
                    <bg.Component palette={NEUTRAL_PREVIEW_PALETTE} />
                  </div>
                  <div className="flex items-center justify-between gap-2 bg-card/50 px-3 py-2">
                    <span className="truncate text-xs">{bg.name}</span>
                    <Badge
                      variant="secondary"
                      className="shrink-0 px-1.5 text-[10px]"
                    >
                      {bg.source}
                    </Badge>
                  </div>
                </button>
              ))}
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
      {!open && (
        <PanelOpener
          side="right"
          label="打开背景栏"
          icon="icon-[solar--pallete-2-bold-duotone]"
          onClick={toggle}
        />
      )}
    </>
  );
}
