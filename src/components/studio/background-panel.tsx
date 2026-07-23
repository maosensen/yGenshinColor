"use client";

import { AnimatePresence, motion } from "motion/react";
import type { CSSProperties } from "react";
import { useStudioStore } from "@/lib/stores/studio-store";
import { cn } from "@/lib/utils";
import { BACKGROUNDS } from "./backgrounds/registry";
import { GLASS_PANEL, PanelHeader, PanelOpener } from "./panel-chrome";

/** Soften the blob blur inside the small thumbnails. */
const PREVIEW_STYLE = { "--blob-blur": "14px" } as CSSProperties;

/**
 * Background preset picker. Every thumbnail renders its preset with the
 * palette currently on the canvas, so the panel doubles as a live "what
 * would this look like" preview — pick a new asset and all three repaint.
 */
export function BackgroundPanel() {
  const open = useStudioStore((s) => s.bgPanelOpen);
  const toggle = useStudioStore((s) => s.toggleBgPanel);
  const backgroundId = useStudioStore((s) => s.backgroundId);
  const setBackground = useStudioStore((s) => s.setBackground);
  const palette = useStudioStore((s) => s.palette);
  const previewPalette = palette.map((c) => c.css);

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
            <PanelHeader
              icon="icon-[solar--pallete-2-bold-duotone]"
              title="Backgrounds"
              meta={`${BACKGROUNDS.length}`}
              onCollapse={toggle}
            />
            <p className="-mt-1.5 px-3.5 pb-2 text-[11px] text-muted-foreground">
              Previews follow the current palette
            </p>
            <div className="min-h-0 flex-1 space-y-3 overflow-y-auto px-3 pb-3">
              {BACKGROUNDS.map((bg) => {
                const active = backgroundId === bg.id;
                return (
                  <button
                    key={bg.id}
                    type="button"
                    onClick={() => setBackground(bg.id)}
                    className={cn(
                      "group relative w-full cursor-pointer overflow-hidden rounded-xl text-left ring-1 ring-border transition-[transform,box-shadow] duration-200 hover:scale-[1.01] hover:shadow-lg/20",
                      active && "ring-2 ring-primary",
                    )}
                  >
                    <div
                      className="pointer-events-none relative aspect-video overflow-hidden"
                      style={PREVIEW_STYLE}
                    >
                      <bg.Component palette={previewPalette} />
                    </div>
                    <div className="flex items-center justify-between gap-2 bg-card/60 px-3 py-2 backdrop-blur-sm">
                      <span className="truncate text-xs">{bg.name}</span>
                      <span className="shrink-0 font-mono text-[10px] text-muted-foreground tracking-wider">
                        {bg.source}
                      </span>
                    </div>
                    <AnimatePresence>
                      {active && (
                        <motion.span
                          initial={{ scale: 0.5, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0.5, opacity: 0 }}
                          transition={{ duration: 0.18, ease: "easeOut" }}
                          className="pointer-events-none absolute top-1.5 left-1.5 flex size-5 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm"
                        >
                          <span
                            className="icon-[solar--check-circle-bold] size-4"
                            aria-hidden
                          />
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </button>
                );
              })}
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
      {!open && (
        <PanelOpener
          side="right"
          label="Backgrounds"
          icon="icon-[solar--pallete-2-bold-duotone]"
          onClick={toggle}
        />
      )}
    </>
  );
}
