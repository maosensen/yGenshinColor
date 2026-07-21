export type NavItem = {
  label?: string;
  isSection?: boolean;
  title?: string;
  /** Iconify Tailwind class, e.g. "icon-[solar--chart-2-bold-duotone]" */
  icon?: string;
  href?: string;
  children?: NavItem[];
};

export const navData: NavItem[] = [
  // General Section
  { label: "General", isSection: true },
  {
    title: "Home",
    icon: "icon-[solar--home-2-bold-duotone]",
    href: "/",
  },

  // Project Section
  { label: "Project", isSection: true },
  {
    title: "Changelog",
    icon: "icon-[solar--document-text-bold-duotone]",
    href: "/changelog",
  },
];
