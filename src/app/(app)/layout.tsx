import type { ReactNode } from "react";
import { SiteNav } from "@/components/showcase/site-nav";

/**
 * Showcase shell: sticky top nav over the page content. The disclaimer
 * footer lives in the (content) group layout so the studio (/) keeps a
 * scroll-free, full-viewport canvas.
 */
export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-svh flex-col">
      <SiteNav />
      <main className="flex-1">{children}</main>
    </div>
  );
}
