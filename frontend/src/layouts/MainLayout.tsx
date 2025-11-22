import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { HamburgerMenu } from '../components/HamburgerMenu/HamburgerMenu';
import { Sidebar } from '../components/Sidebar/Sidebar';
import './MainLayout.css';

export const MainLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className="main-layout">
      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div className="sidebar-overlay" onClick={closeSidebar}></div>
      )}
      
      <div className={`sidebar-wrapper ${isSidebarOpen ? 'open' : ''}`}>
        <Sidebar />
      </div>
      
      <main className="main-content">
        <header className="top-header">
          <HamburgerMenu onClick={toggleSidebar} />
        </header>
        <div className="content-scrollable">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
