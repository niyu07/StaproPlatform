import { Menu } from 'lucide-react';
import './HamburgerMenu.css';

interface HamburgerMenuProps {
  onClick?: () => void;
}

export const HamburgerMenu = ({ onClick }: HamburgerMenuProps) => {
  return (
    <button className="menu-btn mobile-only" onClick={onClick}>
      <Menu size={24} />
    </button>
  );
};
