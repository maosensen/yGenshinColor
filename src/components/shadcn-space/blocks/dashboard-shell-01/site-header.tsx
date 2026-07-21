import { SettingsTrigger } from "@/components/settings/settings-drawer";
import NotificationDropdown from "@/components/shadcn-space/blocks/dashboard-shell-01/notification-dropdown";
import UserDropdown from "@/components/shadcn-space/blocks/dashboard-shell-01/user-dropdown";
import { ThemeToggle } from "@/components/theme-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

/**
 * Right-hand action cluster shared by every shell layout (vertical / mini /
 * horizontal). The leading element (sidebar trigger or brand) is supplied by
 * the shell itself.
 */
export function SiteHeader() {
  return (
    <div className="flex items-center gap-3">
      <ThemeToggle />
      <SettingsTrigger />
      <NotificationDropdown
        defaultOpen={false}
        align="center"
        trigger={
          <div className="rounded-full p-2 hover:bg-accent relative before:absolute before:bottom-0 before:left-1/2 before:z-10 before:w-2 before:h-2 before:rounded-full before:bg-red-500 before:top-1 cursor-pointer">
            <span
              className="icon-[solar--bell-bing-line-duotone] block size-4.5"
              aria-hidden
            />
          </div>
        }
      />
      <UserDropdown
        defaultOpen={false}
        align="center"
        trigger={
          <div className="rounded-full">
            <Avatar className="size-8 cursor-pointer">
              <AvatarImage src="/user-avatar.png" alt="David McMichael" />
              <AvatarFallback>DM</AvatarFallback>
            </Avatar>
          </div>
        }
      />
    </div>
  );
}
