import React from "react";
import { SearchIcon } from "../ui/icons";
import "./SearchBar.css";

interface SearchBarProps extends React.InputHTMLAttributes<HTMLInputElement> {
  placeholder?: string;
}

export const SearchBar = ({
  placeholder = "検索...",
  className = "",
  ...props
}: SearchBarProps) => {
  return (
    <div className={`search-bar-container ${className}`}>
      <div className="search-icon-wrapper">
        <SearchIcon size={20} color="#999" />
      </div>
      <input
        type="text"
        className="search-input"
        placeholder={placeholder}
        {...props}
      />
    </div>
  );
};
