import { LogOut } from "lucide-react";
import { Button } from "./button";
import "./logout-button.css";

interface LogoutButtonProps {
  onClick?: () => void;
}

export const LogoutButton = ({ onClick }: LogoutButtonProps) => {
  return (
    <Button
      variant="ghost"
      className="logout-btn w-full justify-start"
      onClick={onClick}
    >
      <LogOut className="h-5 w-5" />
      <span>ログアウト</span>
    </Button>
  );
};

