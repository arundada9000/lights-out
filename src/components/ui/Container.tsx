import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

interface ContainerProps {
  children: ReactNode;
  className?: string;
  as?: "div" | "section" | "header" | "footer" | "nav" | "main" | "aside";
  id?: string;
  size?: "default" | "wide" | "narrow";
}

const sizes = {
  default: "max-w-6xl",
  wide: "max-w-7xl",
  narrow: "max-w-3xl",
};

export function Container({
  children,
  className,
  as: Tag = "div",
  id,
  size = "default",
}: ContainerProps) {
  return (
    <Tag id={id} className={cn("mx-auto w-full px-5 sm:px-8", sizes[size], className)}>
      {children}
    </Tag>
  );
}