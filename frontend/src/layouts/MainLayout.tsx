import { Outlet } from 'react-router-dom';
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
