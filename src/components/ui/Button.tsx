import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Slot } from "./Slot";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md" | "lg" | "xl";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
  asChild?: boolean;
}

const baseStyles =
  "inline-flex select-none items-center justify-center gap-2 font-medium transition-all duration-200 ease-ios focus-visible:outline-none focus-visible:ring-focused active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer";

const variants: Record<Variant, string> = {
  primary:
    "bg-accent text-accent-contrast glow-accent hover:brightness-110 shadow-card active:opacity-90",
  secondary:
    "border border-separator bg-surface-raised text-label hover:bg-fill active:bg-fill-secondary",
  ghost: "text-accent hover:bg-accent-soft",
  danger: "bg-danger text-white hover:opacity-90",
};

const sizes: Record<Size, string> = {
  sm: "h-9 rounded-ios-md px-3.5 text-sm",
  md: "h-11 rounded-ios-lg px-5 text-[15px]",
  lg: "h-13 rounded-ios-lg px-6 text-base",
  xl: "h-15 rounded-ios-lg px-8 text-lg tracking-tight",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    { variant = "primary", size = "md", className, asChild, children, ...props },
    ref
  ) {
    if (asChild) {
      return (
        <Slot ref={ref} className={cn(baseStyles, variants[variant], sizes[size], className)}>
          {children}
        </Slot>
      );
    }

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {children}
      </button>
    );
  }
);