"use client";

import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useStudioStore } from "@/lib/stores/studio-store";
import { ASSET_CATEGORIES, type StudioAsset } from "@/lib/studio-assets";
import { AssetPanel } from "./asset-panel";
import { BackgroundPanel } from "./background-panel";
import { getBackground } from "./backgrounds/registry";
import { PaletteBar } from "./palette-bar";

/**
 * The studio workbench: a full-bleed background canvas driven by the current
 * palette + preset, with the asset picker (left), background picker (right)
 * and palette bar (bottom) floating above it.
 */
export function Studio({ assets }: { assets: StudioAsset[] }) {
  const backgroundId = useStudioStore((s) => s.backgroundId);
  const palette = useStudioStore((s) => s.palette);
  const background = getBackground(backgroundId);
  // Crossfade whenever the preset or the palette changes.
  const canvasKey = `${background.id}|${palette.map((c) => c.hex).join()}`;

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
          transition={{ duration: 0.7, ease: "easeInOut" }}
        >
          <background.Component palette={palette.map((c) => c.css)} />
        </motion.div>
      </AnimatePresence>

      <AssetPanel assets={assets} />
      <BackgroundPanel />
      <PaletteBar />
      <AssetPreviewDialog assets={assets} />
    </div>
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
              <DialogTitle>{asset.name}</DialogTitle>
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
