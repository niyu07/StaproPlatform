import { type ReactNode } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { MainLayout } from "./layouts/MainLayout";
import Dashboard from "./features/home/Dashboard";
import { StudentsList } from "./pages/StudentsList";
import { Schedule } from "./pages/Schedule";
import { Login } from "./pages/Login/Login";
import { AIIntegration } from "./pages/AIIntegration";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import "./App.css";

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div className="loading">読み込み中...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

const PublicRoute = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div className="loading">読み込み中...</div>;
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="schedule" element={<Schedule />} />
            <Route path="students" element={<StudentsList />} />
            <Route
              path="curriculum"
              element={
                <div className="p-6">
                  <h2>カリキュラム管理</h2>
                  <p>開発中...</p>
                </div>
              }
            />
            <Route path="ai" element={<AIIntegration />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
