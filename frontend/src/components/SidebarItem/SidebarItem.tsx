import { NavLink } from 'react-router-dom';
import type { LucideIcon } from 'lucide-react';
import './SidebarItem.css';

interface SidebarItemProps {
  icon: LucideIcon;
  label: string;
  path: string;
}

export const SidebarItem = ({ icon: Icon, label, path }: SidebarItemProps) => {
  return (
    <NavLink 
      to={path}
      className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
    >
      <Icon size={20} />
      <span>{label}</span>
    </NavLink>
  );
};
