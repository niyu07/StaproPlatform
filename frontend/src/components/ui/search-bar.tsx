import React from "react";
import { SearchIcon } from "./icons";
import { Input } from "./input";
import "./search-bar.css";

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
        <SearchIcon size={20} color="hsl(var(--muted-foreground))" />
      </div>
      <Input
        type="text"
        className="search-input border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
        placeholder={placeholder}
        {...props}
      />
    </div>
  );
};

