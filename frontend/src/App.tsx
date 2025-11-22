import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MainLayout } from './layouts/MainLayout';
import { Dashboard } from './pages/Dashboard';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="students" element={<div className="p-6"><h2>生徒管理</h2><p>開発中...</p></div>} />
          <Route path="courses" element={<div className="p-6"><h2>コース管理</h2><p>開発中...</p></div>} />
          <Route path="settings" element={<div className="p-6"><h2>設定</h2><p>開発中...</p></div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
