import { cn } from "@/lib/utils";

interface SectionTitleProps {
  children: React.ReactNode;
  className?: string;
}

export const SectionTitle = ({ children, className }: SectionTitleProps) => {
  return (
    <h4
      className={cn(
        "text-base font-medium text-muted-foreground m-0",
        className,
      )}
    >
      {children}
    </h4>
  );
};
