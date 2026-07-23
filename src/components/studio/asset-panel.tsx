"use client";

import { useVirtualizer } from "@tanstack/react-virtual";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { useMemo, useRef } from "react";
import { toast } from "sonner";
import { extractPalette } from "@/lib/extract-palette";
import { useStudioStore } from "@/lib/stores/studio-store";
import {
  ASSET_CATEGORIES,
  type AssetCategory,
  type StudioAsset,
} from "@/lib/studio-assets";
import { cn } from "@/lib/utils";
import { GLASS_PANEL, PanelHeader, PanelOpener } from "./panel-chrome";

/** Vertical-format categories render two columns per virtual row. */
const COLUMNS: Record<AssetCategory, number> = {
  scene: 1,
  character: 1,
  "tcg-card": 2,
  "name-card": 1,
};

const PANEL_INNER_WIDTH = 264; // w-72 (288) minus px-3 padding (24)

export function AssetPanel({ assets }: { assets: StudioAsset[] }) {
  const category = useStudioStore((s) => s.category);
  const setCategory = useStudioStore((s) => s.setCategory);
  const open = useStudioStore((s) => s.assetPanelOpen);
  const toggle = useStudioStore((s) => s.toggleAssetPanel);

  const items = useMemo(
    () => assets.filter((a) => a.category === category),
    [assets, category],
  );
  const columns = COLUMNS[category];
  const rows = useMemo(() => {
    const chunked: StudioAsset[][] = [];
    for (let i = 0; i < items.length; i += columns) {
      chunked.push(items.slice(i, i + columns));
    }
    return chunked;
  }, [items, columns]);

  const scrollRef = useRef<HTMLDivElement>(null);
  const cellWidth = (PANEL_INNER_WIDTH - (columns - 1) * 8) / columns;
  const rowHeight = cellWidth / ASSET_CATEGORIES[category].aspect;
  const virtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => rowHeight + 8,
    overscan: 4,
  });

  return (
    <>
      <AnimatePresence initial={false}>
        {open && (
          <motion.aside
            initial={{ x: -24, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -24, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className={cn(
              GLASS_PANEL,
              "absolute top-4 bottom-4 left-4 z-20 flex w-72 flex-col",
            )}
          >
            <PanelHeader title="素材" onCollapse={toggle} />
            <div className="grid grid-cols-4 gap-1 px-3 pb-2">
              {(
                Object.entries(ASSET_CATEGORIES) as [
                  AssetCategory,
                  (typeof ASSET_CATEGORIES)[AssetCategory],
                ][]
              ).map(([key, def]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setCategory(key)}
                  className={cn(
                    "cursor-pointer rounded-lg py-1.5 text-xs transition-colors",
                    category === key
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground",
                  )}
                >
                  {def.label}
                </button>
              ))}
            </div>
            <div
              ref={scrollRef}
              className="min-h-0 flex-1 overflow-y-auto px-3 pb-3"
            >
              <div
                className="relative w-full"
                style={{ height: virtualizer.getTotalSize() }}
              >
                {virtualizer.getVirtualItems().map((row) => (
                  <div
                    key={row.key}
                    className="absolute inset-x-0 flex gap-2"
                    style={{
                      top: 0,
                      transform: `translateY(${row.start}px)`,
                      height: rowHeight,
                    }}
                  >
                    {rows[row.index].map((asset) => (
                      <AssetCard key={asset.id} asset={asset} />
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
      {!open && (
        <PanelOpener
          side="left"
          label="打开素材栏"
          icon="icon-[solar--gallery-wide-bold-duotone]"
          onClick={toggle}
        />
      )}
    </>
  );
}

function AssetCard({ asset }: { asset: StudioAsset }) {
  const selected = useStudioStore((s) => s.assetId === asset.id);
  const selectAsset = useStudioStore((s) => s.selectAsset);
  const setExtracting = useStudioStore((s) => s.setExtracting);
  const setPalette = useStudioStore((s) => s.setPalette);
  const setPreviewAsset = useStudioStore((s) => s.setPreviewAsset);

  const pick = async () => {
    selectAsset(asset.id);
    setExtracting(true);
    try {
      setPalette(await extractPalette(asset.src));
    } catch {
      setExtracting(false);
      toast.error("色谱提取失败,换一张试试");
    }
  };

  return (
    <div
      className={cn(
        "group relative min-w-0 flex-1 overflow-hidden rounded-xl ring-1 ring-border transition-transform duration-200 hover:scale-[1.015]",
        selected && "ring-2 ring-primary",
      )}
    >
      <Image
        src={asset.src}
        alt={asset.name}
        fill
        sizes="280px"
        className="object-cover"
      />
      <button
        type="button"
        aria-label={`选择 ${asset.name}`}
        onClick={pick}
        className="absolute inset-0 cursor-pointer"
      />
      <span className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent px-2.5 pt-6 pb-1.5 text-left text-xs text-white">
        {asset.name}
      </span>
      <button
        type="button"
        aria-label={`预览 ${asset.name} 原图`}
        onClick={() => setPreviewAsset(asset.id)}
        className="absolute top-1.5 right-1.5 flex size-6 cursor-pointer items-center justify-center rounded-full bg-black/35 text-white/85 opacity-0 backdrop-blur-sm transition-opacity hover:bg-black/55 group-hover:opacity-100"
      >
        <span
          className="icon-[solar--magnifer-zoom-in-linear] size-3.5"
          aria-hidden
        />
      </button>
    </div>
  );
}
