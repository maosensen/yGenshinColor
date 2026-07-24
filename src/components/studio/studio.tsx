"use client";

import {
  DndContext,
  type DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { restrictToWindowEdges } from "@dnd-kit/modifiers";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { useEffect } from "react";
import {
  TransformComponent,
  TransformWrapper,
  useControls,
} from "react-zoom-pan-pinch";
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

/** Dotted ground behind the artboard — the "canvas" surface cue. */
const GRID =
  "radial-gradient(circle, color-mix(in oklch, var(--foreground) 9%, transparent) 1px, transparent 1px)";

/**
 * The studio workbench: a framed background artboard sitting on a pannable /
 * zoomable workspace, with the asset picker, background picker and palette
 * bar floating in screen space above it. Immersive mode tucks every panel
 * away to enjoy the canvas; Esc brings them back.
 */
export function Studio({ assets }: { assets: StudioAsset[] }) {
  const immersive = useStudioStore((s) => s.immersive);
  const toggleImmersive = useStudioStore((s) => s.toggleImmersive);
  const nudgePanel = useStudioStore((s) => s.nudgePanel);

  // 5px activation so a click on a header button never starts a panel drag.
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  );
  const onDragEnd = (e: DragEndEvent) =>
    nudgePanel(String(e.active.id), { x: e.delta.x, y: e.delta.y });

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
    <div
      className="relative h-[calc(100svh-4rem-1px)] overflow-hidden bg-background"
      style={{ backgroundImage: GRID, backgroundSize: "22px 22px" }}
    >
      <TransformWrapper
        initialScale={1}
        minScale={0.35}
        maxScale={4}
        centerOnInit
        limitToBounds={false}
        doubleClick={{ mode: "reset" }}
        // Scroll must not zoom the artboard — zoom is button-only (top toolbar).
        wheel={{ disabled: true }}
        panning={{ velocityDisabled: true }}
      >
        <TransformComponent
          wrapperStyle={{ width: "100%", height: "100%" }}
          contentStyle={{ width: "100%", height: "100%" }}
        >
          <div className="flex h-full w-full items-center justify-center">
            <Stage />
          </div>
        </TransformComponent>

        {!immersive && <StudioToolbar />}
      </TransformWrapper>

      {immersive ? (
        <ImmersiveRestore />
      ) : (
        <DndContext
          sensors={sensors}
          modifiers={[restrictToWindowEdges]}
          onDragEnd={onDragEnd}
        >
          <AssetPanel assets={assets} />
          <BackgroundPanel />
          <PaletteBar assets={assets} />
        </DndContext>
      )}

      <AssetPreviewDialog assets={assets} />
    </div>
  );
}

/** The framed artboard: the live background, cross-fading on preset/palette. */
function Stage() {
  const backgroundId = useStudioStore((s) => s.backgroundId);
  const palette = useStudioStore((s) => s.palette);
  const stageBg = useStudioStore((s) => s.stageBg);
  const background = getBackground(backgroundId);
  const canvasKey = `${background.id}|${palette.map((c) => c.hex).join()}`;

  // Some GL presets measure their container on mount and, if that races with
  // layout, render into only part of the canvas. Nudging a resize after mount
  // and after the crossfade forces them to re-fit the full artboard.
  // biome-ignore lint/correctness/useExhaustiveDependencies: canvasKey is the re-fire trigger, not read inside
  useEffect(() => {
    const fire = () => window.dispatchEvent(new Event("resize"));
    const t1 = setTimeout(fire, 60);
    const t2 = setTimeout(fire, 450);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [canvasKey]);

  return (
    // No border on the artwork itself — a hairline ring reads as grime over
    // the live canvas. The soft drop shadow alone lifts it off the ground.
    <div
      className="relative aspect-video w-[60rem] overflow-hidden rounded-2xl shadow-[0_24px_64px_-16px_rgb(0_0_0/0.7)]"
      style={{ backgroundColor: stageBg === "black" ? "#000" : "#fff" }}
    >
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
          <background.Component
            palette={palette.map((c) => c.css)}
            core={corePaletteColor(palette).css}
          />
        </motion.div>
      </AnimatePresence>

      {/* Grain sits above the canvas, part of the artwork. */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.22] mix-blend-soft-light"
        style={{ backgroundImage: GRAIN, backgroundSize: "160px 160px" }}
        aria-hidden
      />
    </div>
  );
}

/**
 * Top toolbar (centered): zoom out / reset-to-fit / zoom in, then the artboard
 * backdrop toggle (black ⇄ white). Lives inside TransformWrapper so it can
 * reach the pan/zoom controls; positioned in screen space at the top.
 */
function StudioToolbar() {
  const { zoomIn, zoomOut, resetTransform } = useControls();
  const stageBg = useStudioStore((s) => s.stageBg);
  const toggleStageBg = useStudioStore((s) => s.toggleStageBg);

  return (
    <div
      className={cn(
        GLASS_PANEL,
        "absolute top-4 left-1/2 z-20 flex -translate-x-1/2 items-center gap-0.5 p-1",
      )}
    >
      <ZoomButton
        icon="icon-[solar--minus-square-linear]"
        label="Zoom out"
        onClick={() => zoomOut()}
      />
      <ZoomButton
        icon="icon-[solar--restart-square-linear]"
        label="Reset view"
        onClick={() => resetTransform()}
      />
      <ZoomButton
        icon="icon-[solar--add-square-linear]"
        label="Zoom in"
        onClick={() => zoomIn()}
      />
      <span className="mx-1 h-5 w-px bg-border" aria-hidden />
      <button
        type="button"
        title="Toggle artboard background (black / white)"
        aria-label="Toggle artboard background"
        onClick={toggleStageBg}
        className="flex size-8 cursor-pointer items-center justify-center rounded-lg transition-colors hover:bg-accent"
      >
        <span
          className="size-4 rounded-full ring-1 ring-white/40"
          style={{ backgroundColor: stageBg === "black" ? "#000" : "#fff" }}
          aria-hidden
        />
      </button>
    </div>
  );
}

function ZoomButton({
  icon,
  label,
  onClick,
}: {
  icon: string;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      onClick={onClick}
      className="flex size-8 cursor-pointer items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
    >
      <span className={cn(icon, "size-4.5")} aria-hidden />
    </button>
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
