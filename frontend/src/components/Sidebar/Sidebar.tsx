import { LayoutGrid, Calendar, Users, BookOpen, Settings } from "lucide-react";
import { SidebarItem } from "../SidebarItem/SidebarItem";
import { Logo } from "../Logo/Logo";
import { UserProfile } from "../UserProfile/UserProfile";
import { LogoutButton } from "../LogoutButton/LogoutButton";
import "./Sidebar.css";

export const Sidebar = () => {
  const navItems = [
    { icon: LayoutGrid, label: "ダッシュボード", path: "/" },
    { icon: Calendar, label: "スケジュール管理", path: "/schedule" },
    { icon: Users, label: "生徒情報", path: "/students" },
    { icon: BookOpen, label: "カリキュラム管理", path: "/curriculum" },
    { icon: Settings, label: "AI連携", path: "/ai" },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <Logo />
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <SidebarItem
            key={item.path}
            icon={item.icon}
            label={item.label}
            path={item.path}
          />
        ))}
      </nav>

      <div className="sidebar-footer">
        <UserProfile name="管理者" role="Admin" />
        <LogoutButton />
      </div>
    </aside>
  );
};
