"use client";

import { useVirtualizer } from "@tanstack/react-virtual";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { useEffect, useMemo, useRef } from "react";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
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

/** Small line icon per category, shown in the segmented tabs. */
const CATEGORY_ICONS: Record<AssetCategory, string> = {
  scene: "icon-[solar--gallery-wide-linear]",
  character: "icon-[solar--user-rounded-linear]",
  "tcg-card": "icon-[solar--layers-minimalistic-linear]",
  "name-card": "icon-[solar--user-id-linear]",
};

const PANEL_INNER_WIDTH = 264; // w-72 (288) minus px-3 padding (24)
const ROW_GAP = 8;
/** Height of the caption line under each image. */
const CAPTION_HEIGHT = 26;

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
  const cellWidth = (PANEL_INNER_WIDTH - (columns - 1) * ROW_GAP) / columns;
  const rowHeight =
    cellWidth / ASSET_CATEGORIES[category].aspect + CAPTION_HEIGHT;
  const virtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => rowHeight + ROW_GAP,
    overscan: 4,
  });
  // estimateSize is captured at mount — switching category changes the row
  // height, so drop the cached measurements or rows overlap.
  // biome-ignore lint/correctness/useExhaustiveDependencies: category is the trigger, not a value read inside
  useEffect(() => {
    virtualizer.measure();
  }, [virtualizer, category]);
  // A tab that loads in the background measures a 0-height scroll container
  // and renders no rows; re-measure when the page becomes visible again.
  useEffect(() => {
    const onVisible = () => {
      if (document.visibilityState === "visible") virtualizer.measure();
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => document.removeEventListener("visibilitychange", onVisible);
  }, [virtualizer]);

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
            <PanelHeader
              icon="icon-[solar--gallery-wide-bold-duotone]"
              title="Assets"
              meta={`${items.length}`}
              onCollapse={toggle}
            />
            <div className="mx-3 mb-2 grid grid-cols-4 gap-0.5 rounded-lg bg-muted/40 p-0.5">
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
                    "relative cursor-pointer rounded-md py-1.5 text-xs transition-colors",
                    category === key
                      ? "text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {category === key && (
                    <motion.span
                      layoutId="asset-category-thumb"
                      transition={{ duration: 0.25, ease: "easeOut" }}
                      className="absolute inset-0 rounded-md bg-primary"
                      aria-hidden
                    />
                  )}
                  <span className="relative flex items-center justify-center gap-1">
                    <span
                      className={cn(CATEGORY_ICONS[key], "size-3.5")}
                      aria-hidden
                    />
                    {def.tab}
                  </span>
                </button>
              ))}
            </div>
            {/* pt-1 keeps the first row's (2px) selection ring inside the
                scroll clip instead of shaving its top edge. */}
            <div
              ref={scrollRef}
              className="min-h-0 flex-1 overflow-y-auto px-3 pt-1 pb-3"
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
          label="Assets"
          icon="icon-[solar--gallery-wide-bold-duotone]"
          onClick={toggle}
        />
      )}
    </>
  );
}

function AssetCard({ asset }: { asset: StudioAsset }) {
  const selected = useStudioStore((s) => s.assetId === asset.id);
  const extracting = useStudioStore((s) => s.extracting && selected);
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
      toast.error("Palette extraction failed — try another image");
    }
  };

  return (
    // Image on top, caption below — nothing overlays the artwork, so names
    // never fight the image for contrast and can't be covered by neighbors.
    <div className="group flex min-w-0 flex-1 flex-col">
      <div
        className={cn(
          "relative min-h-0 flex-1 overflow-hidden rounded-lg bg-muted/40 ring-1 ring-border transition-shadow duration-200 group-hover:ring-foreground/25",
          selected && "ring-2 ring-primary group-hover:ring-primary",
        )}
      >
        <Image
          src={asset.src}
          alt={asset.name}
          fill
          sizes="280px"
          className="object-cover transition-transform duration-300 ease-out group-hover:scale-[1.04]"
        />
        <button
          type="button"
          aria-label={`Select ${asset.name}`}
          onClick={pick}
          className="absolute inset-0 cursor-pointer"
        />

        {/* Selected check. */}
        <AnimatePresence>
          {selected && !extracting && (
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

        {/* Extraction veil over the picked card. */}
        <AnimatePresence>
          {extracting && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/35 backdrop-blur-[2px]"
            >
              <Spinner className="size-5 text-white" />
            </motion.span>
          )}
        </AnimatePresence>

        <button
          type="button"
          aria-label={`Preview ${asset.name} full size`}
          onClick={() => setPreviewAsset(asset.id)}
          className="absolute top-1.5 right-1.5 flex size-6 cursor-pointer items-center justify-center rounded-full bg-black/40 text-white/90 opacity-0 backdrop-blur-sm transition-opacity hover:bg-black/60 group-hover:opacity-100"
        >
          <span
            className="icon-[solar--magnifer-zoom-in-linear] size-3.5"
            aria-hidden
          />
        </button>
      </div>

      <div
        className="flex shrink-0 items-center px-0.5"
        style={{ height: CAPTION_HEIGHT }}
      >
        <span
          className={cn(
            "truncate text-[11px] transition-colors",
            selected ? "font-medium text-foreground" : "text-muted-foreground",
          )}
          title={asset.name}
        >
          {asset.name}
        </span>
      </div>
    </div>
  );
}
