import React from "react";
import { SearchIcon } from "./icons";
import { Input } from "./input";
import { cn } from "@/lib/utils";

interface SearchBarProps extends React.InputHTMLAttributes<HTMLInputElement> {
  placeholder?: string;
}

export const SearchBar = ({
  placeholder = "検索...",
  className = "",
  ...props
}: SearchBarProps) => {
  return (
    <div
      className={cn(
        "flex items-center bg-muted rounded-lg px-4 py-2 w-full transition-all border border-transparent focus-within:bg-background focus-within:border-border focus-within:shadow-sm",
        className,
      )}
    >
      <div className="flex items-center mr-3 text-muted-foreground">
        <SearchIcon size={20} color="hsl(var(--muted-foreground))" />
      </div>
      <Input
        type="text"
        className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-[15px] placeholder:text-muted-foreground"
        placeholder={placeholder}
        {...props}
      />
    </div>
  );
};
