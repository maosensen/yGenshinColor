"use client";

import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { SceneExports } from "@/lib/palette-export";

const FORMATS = [
  { key: "css", label: "CSS Variables" },
  { key: "tailwind", label: "Tailwind v4" },
  { key: "svg", label: "SVG" },
] as const;

/**
 * Copy-ready code exports for the scene. The strings are generated on the
 * server (palette-export.ts); this panel only renders and copies them.
 */
export function ExportPanel({ exports: code }: { exports: SceneExports }) {
  return (
    <Tabs defaultValue="css">
      <TabsList>
        {FORMATS.map((f) => (
          <TabsTrigger key={f.key} value={f.key}>
            {f.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {FORMATS.map((f) => (
        <TabsContent key={f.key} value={f.key}>
          <div className="relative">
            <Button
              variant="secondary"
              size="sm"
              className="absolute top-3 right-3"
              onClick={() => {
                navigator.clipboard.writeText(code[f.key]);
                toast(`已复制 ${f.label}`);
              }}
            >
              <span className="icon-[solar--copy-line-duotone]" aria-hidden />
              复制
            </Button>
            <pre className="max-h-96 overflow-auto rounded-2xl bg-muted/50 p-5 font-mono text-xs leading-relaxed ring-1 ring-border">
              {code[f.key]}
            </pre>
          </div>
        </TabsContent>
      ))}
    </Tabs>
  );
}
