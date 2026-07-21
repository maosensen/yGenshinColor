import type { ReactNode } from "react";
import { PageContainer } from "@/components/page-container";
import { cn } from "@/lib/utils";

type AppHeaderProps = {
  /** The page's primary heading. */
  title: ReactNode;
  /** Optional supporting copy under the title. */
  description?: ReactNode;
  /** Page-level actions placed at the right of the title row (optional). */
  actions?: ReactNode;
  /**
   * Content placed below the title row (typically underline tabs). When given,
   * the bottom padding is dropped so the tabs sit flush with the band's edge.
   */
  children?: ReactNode;
  /** Extra classes for the inner (centered) container. */
  className?: string;
};

/**
 * Page header band shared across pages.
 *
 * The band (background + bottom border) spans the full content-area width and
 * sits directly under the system header; its contents live in a centered
 * `<PageContainer>`, so they line up with the page body and follow the Max
 * Width setting. Background is the Card surface (`bg-card`) so it stays white
 * under Contrast, matching the system header and sidebar.
 *
 * Render it as a page's first child, before its `<PageContainer>` body:
 *
 *   <AppHeader title="…" description="…" />
 *   <PageContainer>…page content…</PageContainer>
 */
export function AppHeader({
  title,
  description,
  actions,
  children,
  className,
}: AppHeaderProps) {
  return (
    <div className="border-b bg-card">
      <PageContainer
        className={cn("flex flex-col gap-3", children && "!pb-0", className)}
      >
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold">{title}</h1>
            {description ? (
              <p className="text-muted-foreground">{description}</p>
            ) : null}
          </div>
          {actions ? (
            <div className="flex shrink-0 items-center gap-2">{actions}</div>
          ) : null}
        </div>
        {children}
      </PageContainer>
    </div>
  );
}
