"use client";

import { toast } from "sonner";
import { cn } from "@/lib/utils";

/** Pre-resolved swatch view model (color math stays on the server). */
export type SwatchView = {
  name: string;
  slug: string;
  role: string;
  /** Native oklch() string used to paint the block. */
  css: string;
  /** sRGB hex, the copy payload. */
  hex: string;
  /** Human label, e.g. "oklch(0.70 0.15 45)" */
  label: string;
  /** Readable text color on this swatch. */
  text: "white" | "black";
};

/**
 * The palette as one horizontal strip of clickable blocks — click copies the
 * hex. Blocks flex-grow on hover so the strip feels alive without any JS
 * animation work.
 */
export function PaletteStrip({ swatches }: { swatches: SwatchView[] }) {
  return (
    <div className="flex h-40 w-full overflow-hidden rounded-2xl ring-1 ring-white/10 md:h-48">
      {swatches.map((swatch) => (
        <button
          key={swatch.slug}
          type="button"
          onClick={() => {
            navigator.clipboard.writeText(swatch.hex);
            toast(`已复制 ${swatch.name}`, { description: swatch.hex });
          }}
          className={cn(
            "group flex flex-1 cursor-pointer flex-col justify-between p-3 text-left transition-[flex-grow] duration-300 ease-out hover:flex-[1.6] md:p-4",
            swatch.text === "white" ? "text-white" : "text-black",
          )}
          style={{ backgroundColor: swatch.css }}
        >
          <span className="text-[11px] opacity-60">{swatch.role}</span>
          <span className="min-w-0">
            <span className="block truncate text-sm font-medium">
              {swatch.name}
            </span>
            <span className="block truncate font-mono text-[11px] uppercase opacity-70">
              {swatch.hex}
            </span>
            <span className="hidden truncate font-mono text-[10px] opacity-50 group-hover:block">
              {swatch.label}
            </span>
          </span>
        </button>
      ))}
    </div>
  );
}
