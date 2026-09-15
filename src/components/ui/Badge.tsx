import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  children: ReactNode;
  tone?: "neutral" | "accent" | "success" | "danger" | "warning" | "label";
}

const tones = {
  neutral: "bg-fill text-label-secondary",
  accent: "bg-accent-soft text-accent",
  success: "bg-success/15 text-success",
  danger: "bg-danger/15 text-danger",
  warning: "bg-warning/15 text-warning",
  label: "bg-label text-background",
};

export function Badge({ children, tone = "neutral", className, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide",
        tones[tone],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}