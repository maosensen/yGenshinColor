import fs from "node:fs";
import path from "node:path";
import {
  ASSET_CATEGORIES,
  type AssetCategory,
  type StudioAsset,
} from "@/lib/studio-assets";

/**
 * Asset manifest, scanned from `public/geshin-pics/<category>/` at build
 * time. Dropping a new image into a category folder is all it takes to add
 * an asset — no registry edit needed. Server-only.
 */

const ASSETS_DIR = path.join(process.cwd(), "public", "geshin-pics");
const IMAGE_EXT = /\.(webp|png|jpe?g|avif)$/i;

/** "character-Arlecchino.webp" / "TcgCard-Faruzan.png" → "Arlecchino" */
function displayName(file: string): string {
  const base = file.replace(IMAGE_EXT, "");
  const dash = base.indexOf("-");
  const raw = dash >= 0 ? base.slice(dash + 1) : base;
  return raw.replace(/[-_]+/g, " ").replace(/^\w/, (ch) => ch.toUpperCase());
}

export function getStudioAssets(): StudioAsset[] {
  const categories = Object.keys(ASSET_CATEGORIES) as AssetCategory[];
  return categories.flatMap((category) => {
    const dir = path.join(ASSETS_DIR, category);
    if (!fs.existsSync(dir)) return [];
    return fs
      .readdirSync(dir)
      .filter((f) => IMAGE_EXT.test(f))
      .sort()
      .map((file) => ({
        id: `${category}/${file}`,
        category,
        name: displayName(file),
        src: encodeURI(`/geshin-pics/${category}/${file}`),
      }));
  });
}
