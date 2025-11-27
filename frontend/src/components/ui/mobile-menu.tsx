import { Menu } from "lucide-react";
import { Button } from "./button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "./sheet";

interface MobileMenuProps {
  children: React.ReactNode;
}

export const MobileMenu = ({ children }: MobileMenuProps) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-6 w-6" />
          <span className="sr-only">メニューを開く</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[260px] p-0">
        {children}
      </SheetContent>
    </Sheet>
  );
};

