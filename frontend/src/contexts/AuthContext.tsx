import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";

interface User {
  email: string;
  name: string;
  role: "admin" | "teacher" | "student";
}

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; message?: string }>;
  logout: () => Promise<void>;
}

const STORAGE_KEY = "stapro_auth_user";

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const resolveApiBaseUrl = () => {
  try {
    const envValue = (
      import.meta as ImportMeta & {
        readonly env?: Record<string, string | undefined>;
      }
    ).env?.VITE_API_BASE_URL;
    if (envValue && envValue.trim() !== "") {
      return envValue.replace(/\/$/, "");
    }
  } catch {
    // ignore when running outside the browser (tests, etc.)
  }
  if (typeof window !== "undefined") {
    return `${window.location.protocol}//${window.location.hostname}:8080`;
  }
  return "http://localhost:8080";
};

const API_BASE_URL = resolveApiBaseUrl();

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return null;
      return JSON.parse(stored) as User;
    } catch {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
  });

  const isLoading = false;

  const login = useCallback(async (email: string, password: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json().catch(() => null);

      if (
        !response.ok ||
        !data?.success ||
        !data?.email ||
        !data?.name ||
        !data?.role
      ) {
        const message =
          data?.message || "メールアドレスまたはパスワードが正しくありません";
        return { success: false, message };
      }

      const userData: User = {
        email: data.email,
        name: data.name,
        role: data.role,
      };
      setUser(userData);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
      return { success: true };
    } catch (error) {
      console.error("Failed to login", error);
      return { success: false, message: "サーバーに接続できませんでした" };
    }
  }, []);

  const logout = useCallback(async () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
    try {
      await fetch(`${API_BASE_URL}/api/logout`, { method: "POST" });
    } catch (error) {
      console.warn("Failed to call logout endpoint", error);
    }
  }, []);

  const value: AuthContextValue = {
    user,
    isAuthenticated: Boolean(user),
    isLoading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
