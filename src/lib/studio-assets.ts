/**
 * Studio asset model shared by server and client. The filesystem scan lives
 * in `studio-assets.server.ts` (node:fs must stay out of client bundles).
 */

// `label` is the full name (dialogs, palette bar); `tab` is the short form
// that fits the four-column segmented control in the asset panel.
export const ASSET_CATEGORIES = {
  scene: { label: "Scenes", tab: "Scene", aspect: 16 / 9 },
  character: { label: "Characters", tab: "Char", aspect: 4 / 3 },
  "tcg-card": { label: "TCG Cards", tab: "TCG", aspect: 7 / 12 },
  "name-card": { label: "Namecards", tab: "Card", aspect: 21 / 10 },
} as const;

export type AssetCategory = keyof typeof ASSET_CATEGORIES;

export type StudioAsset = {
  id: string;
  category: AssetCategory;
  /** Display name derived from the file name, e.g. "Hiisi Island" */
  name: string;
  /** URL-encoded public path */
  src: string;
};
