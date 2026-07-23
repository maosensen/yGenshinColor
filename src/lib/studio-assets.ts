/**
 * Studio asset model shared by server and client. The filesystem scan lives
 * in `studio-assets.server.ts` (node:fs must stay out of client bundles).
 */

export const ASSET_CATEGORIES = {
  scene: { label: "场景", aspect: 16 / 9 },
  character: { label: "角色", aspect: 4 / 3 },
  "tcg-card": { label: "卡牌", aspect: 7 / 12 },
  "name-card": { label: "名片", aspect: 21 / 10 },
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
