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
          <Route path="schedule" element={<div className="p-6"><h2>スケジュール管理</h2><p>開発中...</p></div>} />
          <Route path="students" element={<div className="p-6"><h2>生徒情報</h2><p>開発中...</p></div>} />
          <Route path="curriculum" element={<div className="p-6"><h2>カリキュラム管理</h2><p>開発中...</p></div>} />
          <Route path="ai" element={<div className="p-6"><h2>AI連携</h2><p>開発中...</p></div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
