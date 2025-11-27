import { LayoutGrid, Calendar, Users, BookOpen, Settings } from "lucide-react";
import { SidebarItem } from "./sidebar-item";
import { Logo } from "../ui/logo";
import { UserProfile } from "../ui/user-profile";
import { LogoutButton } from "../ui/logout-button";

export const Sidebar = () => {
  const navItems = [
    { icon: LayoutGrid, label: "ダッシュボード", path: "/" },
    { icon: Calendar, label: "スケジュール管理", path: "/schedule" },
    { icon: Users, label: "生徒情報", path: "/students" },
    { icon: BookOpen, label: "カリキュラム管理", path: "/curriculum" },
    { icon: Settings, label: "AI連携", path: "/ai" },
  ];

  return (
    <aside className="w-[260px] bg-background border-r border-border flex flex-col h-full flex-shrink-0">
      <div className="h-16 flex items-center px-6 border-b border-border">
        <Logo />
      </div>

      <nav className="flex-1 py-6 px-4 flex flex-col gap-2">
        {navItems.map((item) => (
          <SidebarItem
            key={item.path}
            icon={item.icon}
            label={item.label}
            path={item.path}
          />
        ))}
      </nav>

      <div className="p-4 border-t border-border flex flex-col gap-4">
        <UserProfile name="管理者" role="Admin" />
        <LogoutButton />
      </div>
    </aside>
  );
};
