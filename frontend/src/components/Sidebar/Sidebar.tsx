import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  BookOpen, 
  Settings, 
  LogOut
} from 'lucide-react';
import { SidebarItem } from '../SidebarItem/SidebarItem';
import { Logo } from '../Logo/Logo';
import { UserProfile } from '../UserProfile/UserProfile';
import './Sidebar.css';

export const Sidebar = () => {
  const navItems = [
    { icon: LayoutDashboard, label: 'ダッシュボード', path: '/' },
    { icon: Users, label: '生徒管理', path: '/students' },
    { icon: BookOpen, label: 'コース管理', path: '/courses' },
    { icon: Settings, label: '設定', path: '/settings' },
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
        <button className="nav-item logout-btn">
          <LogOut size={20} />
          <span>ログアウト</span>
        </button>
      </div>
    </aside>
  );
};
