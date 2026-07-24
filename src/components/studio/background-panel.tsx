"use client";

import { AnimatePresence, motion } from "motion/react";
import type { CSSProperties } from "react";
import { corePaletteColor, useStudioStore } from "@/lib/stores/studio-store";
import { cn } from "@/lib/utils";
import { BACKGROUNDS } from "./backgrounds/registry";
import { DraggablePanel } from "./draggable-panel";
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
  const previewCore = corePaletteColor(palette).css;

  return (
    <>
      {open ? (
        <DraggablePanel
          id="backgrounds"
          className="top-4 right-4 bottom-4 w-64"
        >
          {/* initial={false}: a tab that mounts in the background has rAF
              frozen, so an opacity-0 entrance would strand the panel invisible. */}
          <motion.aside
            initial={false}
            className={cn(GLASS_PANEL, "flex h-full w-full flex-col")}
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
            {/* Same card grammar as the asset panel: media block + caption
                line below (name left, origin right) — no bar over the art.
                pt-1 keeps the first card's selection ring inside the clip. */}
            <div className="min-h-0 flex-1 space-y-2 overflow-y-auto px-3 pt-1 pb-3">
              {BACKGROUNDS.map((bg) => {
                const active = backgroundId === bg.id;
                const Thumb = bg.Thumbnail ?? bg.Component;
                return (
                  <button
                    key={bg.id}
                    type="button"
                    onClick={() => setBackground(bg.id)}
                    className="group block w-full cursor-pointer text-left"
                  >
                    <div
                      className={cn(
                        "relative aspect-video overflow-hidden rounded-lg ring-1 ring-border transition-shadow duration-200 group-hover:ring-foreground/25",
                        active &&
                          "ring-2 ring-primary group-hover:ring-primary",
                      )}
                      style={PREVIEW_STYLE}
                    >
                      <span className="pointer-events-none absolute inset-0">
                        <Thumb palette={previewPalette} core={previewCore} />
                      </span>
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
                    </div>
                    <div className="flex h-[26px] items-center justify-between gap-2 px-0.5">
                      <span
                        className={cn(
                          "truncate text-[11px] transition-colors",
                          active
                            ? "font-medium text-foreground"
                            : "text-muted-foreground",
                        )}
                      >
                        {bg.name}
                      </span>
                      <span className="shrink-0 font-mono text-[9px] text-muted-foreground/70 tracking-wider">
                        {bg.source}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </motion.aside>
        </DraggablePanel>
      ) : (
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
