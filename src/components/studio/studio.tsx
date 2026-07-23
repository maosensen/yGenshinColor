"use client";

import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { corePaletteColor, useStudioStore } from "@/lib/stores/studio-store";
import { ASSET_CATEGORIES, type StudioAsset } from "@/lib/studio-assets";
import { cn } from "@/lib/utils";
import { AssetPanel } from "./asset-panel";
import { BackgroundPanel } from "./background-panel";
import { getBackground } from "./backgrounds/registry";
import { PaletteBar } from "./palette-bar";
import { GLASS_PANEL } from "./panel-chrome";

/**
 * Fine monochrome noise (SVG feTurbulence data-URI) blended over the canvas:
 * breaks up gradient banding and gives the big soft blobs a paper-like tooth.
 */
const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='160' height='160' filter='url(%23n)'/%3E%3C/svg%3E\")";

/**
 * The studio workbench: a full-bleed background canvas driven by the current
 * palette + preset, with the asset picker (left), background picker (right)
 * and palette bar (bottom) floating above it. Immersive mode tucks every
 * panel away to enjoy the canvas; Esc brings them back.
 */
export function Studio({ assets }: { assets: StudioAsset[] }) {
  const backgroundId = useStudioStore((s) => s.backgroundId);
  const palette = useStudioStore((s) => s.palette);
  const immersive = useStudioStore((s) => s.immersive);
  const toggleImmersive = useStudioStore((s) => s.toggleImmersive);
  const background = getBackground(backgroundId);
  // Crossfade whenever the preset or the palette changes.
  const canvasKey = `${background.id}|${palette.map((c) => c.hex).join()}`;

  // Esc leaves immersive mode (only bound while it's on, so dialogs keep Esc).
  useEffect(() => {
    if (!immersive) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") toggleImmersive();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [immersive, toggleImmersive]);

  return (
    // 4rem nav height + its 1px bottom border — anything more and the page scrolls.
    <div className="relative h-[calc(100svh-4rem-1px)] overflow-hidden">
      {/* initial={false}: the first paint must be fully visible even when the
          tab loads in the background (rAF is frozen there, so an entrance
          animation would strand the canvas at opacity 0). */}
      <AnimatePresence mode="sync" initial={false}>
        <motion.div
          key={canvasKey}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          // Short crossfade: while both layers live, two GL canvases render
          // simultaneously — halving the window halves the worst-case cost.
          transition={{ duration: 0.35, ease: "easeInOut" }}
        >
          <background.Component
            palette={palette.map((c) => c.css)}
            core={corePaletteColor(palette).css}
          />
        </motion.div>
      </AnimatePresence>

      {/* Grain sits above the canvas, below the panels. */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.22] mix-blend-soft-light"
        style={{ backgroundImage: GRAIN, backgroundSize: "160px 160px" }}
        aria-hidden
      />

      {immersive ? (
        <ImmersiveRestore />
      ) : (
        <>
          <AssetPanel assets={assets} />
          <BackgroundPanel />
          <PaletteBar assets={assets} />
        </>
      )}

      <AssetPreviewDialog assets={assets} />
    </div>
  );
}

/** The only chrome that survives immersive mode — brings the panels back. */
function ImmersiveRestore() {
  const toggleImmersive = useStudioStore((s) => s.toggleImmersive);

  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      type="button"
      title="Show panels (Esc)"
      aria-label="Show panels (Esc)"
      onClick={toggleImmersive}
      className={cn(
        GLASS_PANEL,
        "absolute right-4 bottom-6 z-20 flex size-11 cursor-pointer items-center justify-center rounded-full text-muted-foreground transition-colors hover:text-foreground",
      )}
    >
      <span className="icon-[solar--eye-closed-linear] size-5" aria-hidden />
    </motion.button>
  );
}

function AssetPreviewDialog({ assets }: { assets: StudioAsset[] }) {
  const previewAssetId = useStudioStore((s) => s.previewAssetId);
  const setPreviewAsset = useStudioStore((s) => s.setPreviewAsset);
  const asset = assets.find((a) => a.id === previewAssetId);

  return (
    <Dialog
      open={asset !== undefined}
      onOpenChange={(open) => {
        if (!open) setPreviewAsset(null);
      }}
    >
      <DialogContent className="sm:max-w-4xl">
        {asset && (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-baseline gap-2">
                {asset.name}
                <span className="font-mono text-[10px] text-muted-foreground tracking-wider">
                  {ASSET_CATEGORIES[asset.category].label}
                </span>
              </DialogTitle>
            </DialogHeader>
            <div
              className="relative w-full overflow-hidden rounded-xl"
              style={{ aspectRatio: ASSET_CATEGORIES[asset.category].aspect }}
            >
              <Image
                src={asset.src}
                alt={asset.name}
                fill
                sizes="896px"
                className="object-contain"
              />
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
