"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import { useStudioStore } from "@/lib/stores/studio-store";
import { ASSET_CATEGORIES, type StudioAsset } from "@/lib/studio-assets";
import { cn } from "@/lib/utils";
import { DraggablePanel, usePanelHandle } from "./draggable-panel";
import { GLASS_PANEL } from "./panel-chrome";

/**
 * The extracted palette, floating bottom-center — the studio's actual
 * "output". A leading meta block credits the asset the colors came from;
 * each swatch shows its hex and copies it on click (with an inline check
 * flash); the action cluster copies the whole palette or a ready-made CSS
 * gradient. New palettes stagger in swatch by swatch.
 */
export function PaletteBar({ assets }: { assets: StudioAsset[] }) {
  const palette = useStudioStore((s) => s.palette);
  const extracting = useStudioStore((s) => s.extracting);
  const assetId = useStudioStore((s) => s.assetId);
  const asset = assets.find((a) => a.id === assetId);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copy = (payload: string, key: string, message: string) => {
    navigator.clipboard.writeText(payload);
    setCopiedKey(key);
    window.setTimeout(() => {
      setCopiedKey((cur) => (cur === key ? null : cur));
    }, 1200);
    toast(message);
  };

  const allHex = palette.map((c) => c.hex).join(", ");
  const gradient = `linear-gradient(135deg, ${palette
    .map((c) => c.hex)
    .join(", ")})`;

  return (
    <DraggablePanel id="palette" centerX className="bottom-6 left-1/2">
      <motion.div
        layout
        className={cn(GLASS_PANEL, "flex items-center gap-1 px-2 py-2.5")}
      >
        <PaletteGrip />
        {extracting ? (
          <span className="flex items-center gap-2.5 px-2 py-2">
            {[0, 1, 2, 3, 4].map((i) => (
              <span
                key={i}
                className="size-9 animate-pulse rounded-full bg-muted-foreground/20"
                style={{ animationDelay: `${i * 120}ms` }}
                aria-hidden
              />
            ))}
            <span className="flex items-center gap-1.5 pl-1 text-muted-foreground text-xs">
              <Spinner className="size-3.5" />
              Extracting…
            </span>
          </span>
        ) : (
          <>
            {asset && (
              <>
                <div className="flex max-w-40 flex-col gap-0.5 px-2">
                  <span
                    className="truncate font-medium text-xs"
                    title={asset.name}
                  >
                    {asset.name}
                  </span>
                  <span className="truncate whitespace-nowrap font-mono text-[9px] text-muted-foreground tracking-wider">
                    {ASSET_CATEGORIES[asset.category].label} · source
                  </span>
                </div>
                <span
                  className="mx-1.5 h-9 w-px self-center bg-border"
                  aria-hidden
                />
              </>
            )}
            <AnimatePresence initial={false} mode="popLayout">
              {palette.map((color, i) => {
                const copied = copiedKey === color.hex;
                return (
                  <motion.button
                    key={color.css}
                    layout
                    initial={{ scale: 0.4, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.4, opacity: 0 }}
                    transition={{
                      duration: 0.25,
                      delay: i * 0.05,
                      ease: "easeOut",
                    }}
                    type="button"
                    title={`${color.hex}${color.core ? " · core" : ""} · click to copy`}
                    onClick={() =>
                      copy(color.hex, color.hex, `Copied ${color.hex}`)
                    }
                    className="group flex cursor-pointer flex-col items-center gap-1 rounded-lg px-1.5 pt-1.5 pb-1 transition-colors hover:bg-accent/60"
                  >
                    <span
                      className={cn(
                        "relative flex size-9 items-center justify-center rounded-full transition-transform duration-200 group-hover:scale-110",
                        color.core
                          ? "ring-2 ring-white/70 ring-offset-2 ring-offset-transparent"
                          : "ring-1 ring-white/25",
                      )}
                      style={{ backgroundColor: color.css }}
                    >
                      <span
                        className={cn(
                          "icon-[solar--check-circle-bold] size-4 transition-opacity duration-150",
                          copied ? "opacity-100" : "opacity-0",
                          color.l > 0.6 ? "text-black/70" : "text-white/90",
                        )}
                        aria-hidden
                      />
                    </span>
                    <span className="font-mono text-[9px] text-muted-foreground tracking-wide tabular-nums">
                      {color.hex.slice(1).toUpperCase()}
                    </span>
                  </motion.button>
                );
              })}
            </AnimatePresence>

            <span
              className="mx-1.5 h-9 w-px self-center bg-border"
              aria-hidden
            />

            <div className="flex items-center gap-0.5 self-center">
              <ActionButton
                icon="icon-[solar--copy-linear]"
                copied={copiedKey === "__all__"}
                label="Copy all hex values"
                onClick={() => copy(allHex, "__all__", "Copied all hex values")}
              />
              <ActionButton
                icon="icon-[solar--code-linear]"
                copied={copiedKey === "__css__"}
                label="Copy CSS gradient"
                onClick={() => copy(gradient, "__css__", "Copied CSS gradient")}
              />
              <ImmersiveButton />
            </div>
          </>
        )}
      </motion.div>
    </DraggablePanel>
  );
}

/** Drag grip — the palette bar's contents are all interactive, so dragging
 * gets its own handle at the leading edge. */
function PaletteGrip() {
  const handle = usePanelHandle();
  if (!handle) return null;
  return (
    <span
      {...handle.listeners}
      className="flex h-9 cursor-grab touch-none items-center px-1 text-muted-foreground/50 transition-colors hover:text-muted-foreground active:cursor-grabbing"
      aria-hidden
    >
      <span className="icon-[solar--menu-dots-bold] size-4 rotate-90" />
    </span>
  );
}

/** Enter immersive mode — the studio hides every panel to show the canvas. */
function ImmersiveButton() {
  const toggleImmersive = useStudioStore((s) => s.toggleImmersive);
  return (
    <button
      type="button"
      title="Immersive view"
      aria-label="Immersive view"
      onClick={toggleImmersive}
      className="flex size-7 cursor-pointer items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
    >
      <span className="icon-[solar--eye-linear] size-4" aria-hidden />
    </button>
  );
}

function ActionButton({
  icon,
  label,
  copied,
  onClick,
}: {
  icon: string;
  label: string;
  copied: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      onClick={onClick}
      className="flex size-7 cursor-pointer items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
    >
      <span
        className={cn(
          copied ? "icon-[solar--check-read-linear] text-primary" : icon,
          "size-4",
        )}
        aria-hidden
      />
    </button>
  );
}
