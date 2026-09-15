import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

type Tone = "neutral" | "accent" | "success" | "danger" | "warning";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  tone?: Tone;
  interactive?: boolean;
}

const tones: Record<Tone, string> = {
  neutral: "bg-surface-raised text-label",
  accent: "bg-accent text-accent-contrast",
  success: "bg-success text-white",
  danger: "bg-danger text-white",
  warning: "bg-warning text-white",
};

function toneIconColor(tone: Tone) {
  switch (tone) {
    case "neutral":
      return "text-label-secondary";
    default:
      return "text-white/80";
  }
}

export function Card({
  children,
  tone = "neutral",
  interactive = false,
  className,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        "rounded-ios-xl border border-separator/60 bg-surface-raised p-6 shadow-card transition-all duration-300 ease-ios",
        tones[tone],
        interactive &&
          "cursor-pointer hover:-translate-y-1 hover:shadow-raised focus-within:ring-focused",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardIcon({
  children,
  tone = "neutral",
  className,
}: {
  children: ReactNode;
  tone?: Tone;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "mb-4 flex h-11 w-11 items-center justify-center rounded-ios-md",
        tone === "neutral"
          ? "bg-fill text-accent"
          : "bg-white/20 text-white",
        className
      )}
      aria-hidden
    >
      {children}
    </div>
  );
}

export function CardTitle({
  children,
  className,
  ...props
}: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3 className={cn("text-lg font-semibold tracking-tight text-label", className)} {...props}>
      {children}
    </h3>
  );
}

export function CardDescription({
  children,
  className,
  tone = "neutral",
  ...props
}: HTMLAttributes<HTMLParagraphElement> & { tone?: Tone }) {
  return (
    <p
      className={cn(
        "mt-1.5 text-[15px] leading-relaxed text-label-secondary",
        tone !== "neutral" && "text-white/85",
        toneIconColor(tone),
        className
      )}
      {...props}
    >
      {children}
    </p>
  );
}

export const cardTones = tones;