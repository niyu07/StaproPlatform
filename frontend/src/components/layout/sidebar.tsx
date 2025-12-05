import { LayoutGrid, Calendar, Users, BookOpen, Settings } from "lucide-react";
import { SidebarItem } from "./sidebar-item";
import { Logo } from "../ui/logo";
import { UserProfile } from "../ui/user-profile";
import { LogoutButton } from "../ui/logout-button";
import { useAuth } from "../../contexts/AuthContext";

export const Sidebar = () => {
  const { user, logout } = useAuth();

  const displayName = user?.name ?? "管理者";
  const displayRole = (() => {
    switch (user?.role) {
      case "teacher":
        return "Teacher";
      case "student":
        return "Parent"; // student = 保護者
      case "admin":
        return "Admin";
      default:
        return "Admin";
    }
  })();

  const handleLogout = () => {
    void logout();
  };

  // 全ナビゲーション項目
  const allNavItems = [
    { icon: LayoutGrid, label: "ダッシュボード", path: "/", roles: ["admin", "teacher"] },
    { icon: Calendar, label: "スケジュール管理", path: "/schedule", roles: ["admin", "teacher", "student"] }, // student = 保護者
    { icon: Users, label: "生徒情報", path: "/students", roles: ["admin", "teacher"] },
    { icon: BookOpen, label: "カリキュラム管理", path: "/curriculum", roles: ["admin", "teacher", "student"] }, // student = 保護者
    { icon: Settings, label: "AI連携", path: "/ai", roles: ["admin", "teacher"] },
  ];

  // ユーザーのロールに基づいて表示する項目をフィルタリング
  const navItems = allNavItems.filter((item) => {
    if (!user?.role) return false;
    return item.roles.includes(user.role);
  });

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
        <UserProfile name={displayName} role={displayRole} />
        <LogoutButton onClick={handleLogout} />
      </div>
    </aside>
  );
};
