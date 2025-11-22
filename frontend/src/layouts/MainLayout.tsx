import { Outlet } from 'react-router-dom';
import { HamburgerMenu } from '../components/HamburgerMenu/HamburgerMenu';
import { Sidebar } from '../components/Sidebar/Sidebar';
import './MainLayout.css';



export const MainLayout = () => {
  return (
    <div className="main-layout">
      <Sidebar />
      <main className="main-content">
        <div className="content-scrollable">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
