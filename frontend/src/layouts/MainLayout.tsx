import { Outlet } from "react-router-dom";
import { Sidebar } from "../components/layout/sidebar";
import { MobileMenu } from "../components/ui/mobile-menu";
import "./MainLayout.css";

export const MainLayout = () => {
  return (
    <div className="main-layout">
      {/* Desktop Sidebar - Always visible (md: 768px+) */}
      <aside className="hidden md:block sidebar-wrapper">
        <Sidebar />
      </aside>

      <main className="main-content">
        <header className="top-header">
          {/* Mobile Menu Button (visible only on mobile) */}
          <div className="md:hidden">
            <MobileMenu>
              <Sidebar />
            </MobileMenu>
          </div>
        </header>
        <div className="content-scrollable">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
