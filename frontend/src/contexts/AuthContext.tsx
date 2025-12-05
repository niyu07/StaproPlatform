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
  role: "admin" | "teacher" | "student"; // student = 保護者
}

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (
    email: string,
    password: string,
  ) => Promise<{ success: boolean; message?: string }>;
  logout: () => Promise<void>;
}

const storageKey = "stapro_auth_user";

const readEnvValue = (key: string): string | undefined => {
  try {
    const env = (
      import.meta as ImportMeta & {
        readonly env?: Record<string, string | undefined>;
      }
    ).env;
    return env?.[key]?.trim() || undefined;
  } catch {
    return undefined;
  }
};

const getSessionStorage = (): Storage | null => {
  if (typeof window === "undefined") {
    return null;
  }
  try {
    return window.sessionStorage;
  } catch (error) {
    console.warn("Failed to access sessionStorage", error);
    return null;
  }
};

const readStoredUser = (): User | null => {
  const storage = getSessionStorage();
  if (!storage) return null;
  try {
    const stored = storage.getItem(storageKey);
    if (!stored) return null;
    return JSON.parse(stored) as User;
  } catch (error) {
    console.warn("Failed to parse stored user", error);
    storage.removeItem(storageKey);
    return null;
  }
};

const persistUser = (userData: User) => {
  const storage = getSessionStorage();
  if (!storage) return;
  try {
    storage.setItem(storageKey, JSON.stringify(userData));
  } catch (error) {
    console.warn("Failed to persist user", error);
  }
};

const clearStoredUser = () => {
  const storage = getSessionStorage();
  if (!storage) return;
  storage.removeItem(storageKey);
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const resolveApiBaseUrl = () => {
  const envBaseUrl = readEnvValue("VITE_API_BASE_URL");
  if (envBaseUrl) {
    return envBaseUrl.replace(/\/$/, "");
  }

  if (typeof window !== "undefined") {
    const { protocol, hostname } = window.location;
    const envPort = readEnvValue("VITE_API_PORT");
    const shouldUseDevPort =
      !envPort && (hostname === "localhost" || hostname === "127.0.0.1");
    const port = envPort || (shouldUseDevPort ? "8080" : "");
    const portSegment = port ? `:${port}` : "";
    return `${protocol}//${hostname}${portSegment}`.replace(/:(80|443)$/, "");
  }

  return "http://localhost:8080";
};

const API_BASE_URL = resolveApiBaseUrl();

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => readStoredUser());

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

      const data = await response.json().catch((err) => {
        console.error("ログイン応答JSONの解析に失敗しました", err);
        return null;
      });

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
      persistUser(userData);
      return { success: true };
    } catch (error) {
      console.error("Failed to login", error);
      return { success: false, message: "サーバーに接続できませんでした" };
    }
  }, []);

  const logout = useCallback(async () => {
    setUser(null);
    clearStoredUser();
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
