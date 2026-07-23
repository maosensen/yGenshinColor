import { Studio } from "@/components/studio/studio";
import { getStudioAssets } from "@/lib/studio-assets.server";

/**
 * Home = the studio workbench: pick a Genshin asset, its extracted palette
 * drives a switchable animated background.
 */
export default function StudioPage() {
  return <Studio assets={getStudioAssets()} />;
}
