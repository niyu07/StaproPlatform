import { LogOut } from "lucide-react";
import "./LogoutButton.css";

interface LogoutButtonProps {
  onClick?: () => void;
}

export const LogoutButton = ({ onClick }: LogoutButtonProps) => {
  return (
    <button className="logout-btn" onClick={onClick}>
      <LogOut size={20} />
      <span>ログアウト</span>
    </button>
  );
};
