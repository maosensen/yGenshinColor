import { create } from "zustand";
import type { ExtractedColor } from "@/lib/extract-palette";
import type { AssetCategory } from "@/lib/studio-assets";

/**
 * Studio workbench state: which asset is picked, the palette extracted from
 * it, which background preset renders it, and the open/collapsed state of the
 * two floating panels. Not persisted — a studio session is ephemeral.
 */

/** Default palette shown before any asset is picked (Windrise dusk). */
export const DEFAULT_PALETTE: ExtractedColor[] = [
  { css: "oklch(0.45 0.06 235)", hex: "#4c6b7e", l: 0.45 },
  { css: "oklch(0.55 0.07 315)", hex: "#87728f", l: 0.55 },
  { css: "oklch(0.66 0.11 15)", hex: "#c18a8a", l: 0.66 },
  { css: "oklch(0.7 0.15 45)", hex: "#cf8c62", l: 0.7 },
  { css: "oklch(0.8 0.13 70)", hex: "#e4ac68", l: 0.8 },
];

type StudioState = {
  category: AssetCategory;
  /** Selected asset id (`category/file`), null = none yet. */
  assetId: string | null;
  backgroundId: string;
  palette: ExtractedColor[];
  /** True while extraction runs for the selected asset. */
  extracting: boolean;
  assetPanelOpen: boolean;
  bgPanelOpen: boolean;
  /** Asset id currently shown in the full-size preview dialog. */
  previewAssetId: string | null;
  /** Immersive mode: hide every floating panel and enjoy the canvas. */
  immersive: boolean;
  setCategory: (category: AssetCategory) => void;
  selectAsset: (assetId: string) => void;
  setPalette: (palette: ExtractedColor[]) => void;
  setExtracting: (extracting: boolean) => void;
  setBackground: (backgroundId: string) => void;
  toggleAssetPanel: () => void;
  toggleBgPanel: () => void;
  setPreviewAsset: (assetId: string | null) => void;
  toggleImmersive: () => void;
};

export const useStudioStore = create<StudioState>((set) => ({
  category: "scene",
  assetId: null,
  backgroundId: "radial-mesh-drift",
  palette: DEFAULT_PALETTE,
  extracting: false,
  assetPanelOpen: true,
  bgPanelOpen: true,
  previewAssetId: null,
  immersive: false,
  setCategory: (category) => set({ category }),
  selectAsset: (assetId) => set({ assetId }),
  setPalette: (palette) => set({ palette, extracting: false }),
  setExtracting: (extracting) => set({ extracting }),
  setBackground: (backgroundId) => set({ backgroundId }),
  toggleAssetPanel: () => set((s) => ({ assetPanelOpen: !s.assetPanelOpen })),
  toggleBgPanel: () => set((s) => ({ bgPanelOpen: !s.bgPanelOpen })),
  setPreviewAsset: (previewAssetId) => set({ previewAssetId }),
  toggleImmersive: () => set((s) => ({ immersive: !s.immersive })),
}));
