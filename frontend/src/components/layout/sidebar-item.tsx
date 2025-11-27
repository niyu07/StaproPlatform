import { NavLink } from "react-router-dom";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarItemProps {
  icon: LucideIcon;
  label: string;
  path: string;
}

export const SidebarItem = ({ icon: Icon, label, path }: SidebarItemProps) => {
  return (
    <NavLink
      to={path}
      className={({ isActive }) =>
        cn(
          "flex items-center gap-3 px-4 py-3 rounded-md text-muted-foreground no-underline font-medium text-sm transition-all",
          "hover:bg-muted hover:text-foreground",
          isActive && "bg-primary/10 text-primary"
        )
      }
    >
      <Icon size={20} />
      <span>{label}</span>
    </NavLink>
  );
};

