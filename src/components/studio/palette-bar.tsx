"use client";

import { motion } from "motion/react";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import { useStudioStore } from "@/lib/stores/studio-store";
import { cn } from "@/lib/utils";
import { GLASS_PANEL } from "./panel-chrome";

/**
 * The extracted palette, floating bottom-center: one click per swatch copies
 * its hex. This bar is the studio's actual "output".
 */
export function PaletteBar() {
  const palette = useStudioStore((s) => s.palette);
  const extracting = useStudioStore((s) => s.extracting);

  return (
    <div className="absolute inset-x-0 bottom-6 z-20 flex justify-center">
      <motion.div
        layout
        className={cn(GLASS_PANEL, "flex items-center gap-2 px-3 py-2")}
      >
        {extracting ? (
          <span className="flex items-center gap-2 px-2 py-1.5 text-xs text-muted-foreground">
            <Spinner className="size-4" />
            正在提取色谱…
          </span>
        ) : (
          palette.map((color) => (
            <motion.button
              key={color.css}
              layout
              type="button"
              title={`${color.hex} · 点击复制`}
              onClick={() => {
                navigator.clipboard.writeText(color.hex);
                toast(`已复制 ${color.hex}`);
              }}
              className="size-9 cursor-pointer rounded-full ring-1 ring-white/25 transition-transform hover:scale-110"
              style={{ backgroundColor: color.css }}
            />
          ))
        )}
      </motion.div>
    </div>
  );
}
