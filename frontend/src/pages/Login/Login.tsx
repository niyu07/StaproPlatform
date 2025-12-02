import { FormEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Label } from "../../components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { AlertCircle, Loader2 } from "lucide-react";
import "./Login.css";

const testUsers = [
  { email: "admin@example.com", password: "admin123", label: "管理者" },
  { email: "teacher@example.com", password: "teacher123", label: "講師" },
  { email: "student@example.com", password: "student123", label: "生徒" },
];

export const Login = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const result = await login(email.trim(), password);
    if (!result.success) {
      setError(result.message || "ログインに失敗しました");
      setIsSubmitting(false);
      return;
    }

    setIsSubmitting(false);
    navigate("/", { replace: true });
  };

  const fillTestUser = (userEmail: string, userPassword: string) => {
    setEmail(userEmail);
    setPassword(userPassword);
  };

  return (
    <div className="login-page">
      <Card className="login-card">
        <CardHeader>
          <CardTitle>Stapro ログイン</CardTitle>
          <CardDescription>
            登録済みのメールアドレスとパスワードを入力してください。
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="login-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <Label htmlFor="email">メールアドレス</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                required
              />
            </div>
            <div className="form-group">
              <Label htmlFor="password">パスワード</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>

            {error ? (
              <div className="error-banner">
                <AlertCircle className="error-icon" />
                <p>{error}</p>
              </div>
            ) : (
              <p className="hint-text">
                テストユーザーを選択すると自動入力されます。
              </p>
            )}

            <Button
              type="submit"
              className="login-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="button-content">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  認証中...
                </span>
              ) : (
                "ログイン"
              )}
            </Button>
          </form>

          <div className="test-users">
            <p className="test-users-title">テストユーザー</p>
            <div className="test-user-buttons">
              {testUsers.map((user) => (
                <button
                  key={user.email}
                  type="button"
                  className="test-user-chip"
                  onClick={() => fillTestUser(user.email, user.password)}
                >
                  <span className="chip-label">{user.label}</span>
                  <span className="chip-credentials">
                    {user.email} / {user.password}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
