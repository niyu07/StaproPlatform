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

// 保護者（student）・管理者・教師がアクセス可能なルート（スケジュール管理とカリキュラム管理）
const ParentAccessibleRoute = ({ children }: { children: ReactNode }) => {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div className="loading">読み込み中...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // 保護者（student）、管理者、教師はアクセス可能
  if (
    user?.role === "student" ||
    user?.role === "admin" ||
    user?.role === "teacher"
  ) {
    return <>{children}</>;
  }

  // その他のロールはアクセス不可
  return <Navigate to="/login" replace />;
};

// 管理者・教師専用ルート（保護者はアクセス不可）
const AdminTeacherRoute = ({ children }: { children: ReactNode }) => {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div className="loading">読み込み中...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role === "admin" || user?.role === "teacher") {
    return <>{children}</>;
  }

  // 保護者（student）はスケジュール管理にリダイレクト
  return <Navigate to="/schedule" replace />;
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

// ロールに基づいてリダイレクトするコンポーネント
const RoleBasedRedirect = () => {
  const { user } = useAuth();

  if (user?.role === "student") {
    // student = 保護者
    return <Navigate to="/schedule" replace />;
  }

  return <Dashboard />;
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
            <Route
              index
              element={
                <ProtectedRoute>
                  <RoleBasedRedirect />
                </ProtectedRoute>
              }
            />
            <Route
              path="schedule"
              element={
                <ParentAccessibleRoute>
                  <Schedule />
                </ParentAccessibleRoute>
              }
            />
            <Route
              path="students"
              element={
                <AdminTeacherRoute>
                  <StudentsList />
                </AdminTeacherRoute>
              }
            />
            <Route
              path="curriculum"
              element={
                <ParentAccessibleRoute>
                  <div className="p-6">
                    <h2>カリキュラム管理</h2>
                    <p>開発中...</p>
                  </div>
                </ParentAccessibleRoute>
              }
            />
            <Route
              path="ai"
              element={
                <AdminTeacherRoute>
                  <AIIntegration />
                </AdminTeacherRoute>
              }
            />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
