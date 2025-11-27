import { LogOut } from "lucide-react";
import { Button } from "./button";

interface LogoutButtonProps {
  onClick?: () => void;
}

export const LogoutButton = ({ onClick }: LogoutButtonProps) => {
  return (
    <Button
      variant="ghost"
      className="w-full justify-start text-destructive hover:bg-destructive/10 hover:text-destructive"
      onClick={onClick}
    >
      <LogOut className="h-5 w-5" />
      <span>ログアウト</span>
    </Button>
  );
};
