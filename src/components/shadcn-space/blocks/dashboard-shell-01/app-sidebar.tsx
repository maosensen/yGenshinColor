"use client";
import Link from "next/link";
import Logo from "@/assets/logo/logo";
import { navData } from "@/components/shadcn-space/blocks/dashboard-shell-01/nav-data";
import { NavMain } from "@/components/shadcn-space/blocks/dashboard-shell-01/nav-main";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

export type { NavItem } from "@/components/shadcn-space/blocks/dashboard-shell-01/nav-data";
// Re-export so existing imports keep working.
export { navData } from "@/components/shadcn-space/blocks/dashboard-shell-01/nav-data";

/**
 * Circular expand/collapse control that straddles the sidebar's right edge,
 * styled after the Minimals reference. The chevron points left when expanded
 * (click to collapse) and right when collapsed. Positioned relative to the
 * sidebar's fixed container; hidden on mobile, where the header trigger opens
 * the off-canvas sheet instead.
 */
const SidebarToggle = () => {
  const { toggleSidebar, state } = useSidebar();
  return (
    <button
      type="button"
      onClick={toggleSidebar}
      aria-label="Toggle sidebar"
      className="absolute top-6 -right-3 z-20 hidden size-6 items-center justify-center rounded-full border bg-background text-muted-foreground shadow-sm transition-colors hover:text-foreground md:flex"
    >
      <span
        className={cn(
          "icon-[solar--alt-arrow-left-linear] size-3.5 transition-transform",
          state === "collapsed" && "rotate-180",
        )}
        aria-hidden
      />
    </button>
  );
};

/**
 * Vertical / mini sidebar. Rendered inside a `SidebarProvider` by `AppShell`;
 * `collapsible="icon"` lets the same component serve both the "vertical"
 * (expanded) and "mini" (icon-only) nav layouts. Surface color follows the
 * `--sidebar` token, which the "integrate" nav-color setting blends into the
 * page background.
 */
const AppSidebar = () => {
  // z-40 lifts the fixed sidebar container above the sticky header (z-30) so
  // the edge toggle's overhang isn't painted over; stays below portal layers
  // (dropdowns, sheets) at z-50.
  return (
    <Sidebar collapsible="icon" className="z-40 bg-sidebar">
      <SidebarToggle />
      <SidebarHeader className="px-4 py-4 group-data-[collapsible=icon]:px-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <Link
              href="/"
              aria-label="yTemplate home"
              className="flex justify-start group-data-[collapsible=icon]:justify-center"
            >
              {/* Full logo when expanded */}
              <span className="group-data-[collapsible=icon]:hidden">
                <Logo />
              </span>
              {/* Icon-only mark when collapsed */}
              <span className="hidden size-8 items-center justify-center rounded-full bg-primary font-bold text-primary-foreground group-data-[collapsible=icon]:flex">
                y
              </span>
            </Link>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="gap-0 px-4 group-data-[collapsible=icon]:px-2">
        <NavMain items={navData} />
      </SidebarContent>
    </Sidebar>
  );
};

export default AppSidebar;
