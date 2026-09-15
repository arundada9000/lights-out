"use client";

/**
 * Tooltip (plan.md: replace default title balloons). Pointer-and-keyboard
 * activated label positioned under the trigger. Touch never sees a tooltip;
 * buttons keep their aria-label for assistive tech.
 */

import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

interface TooltipProps {
  label: string;
  children: ReactNode;
  className?: string;
  side?: "top" | "bottom";
}

export function Tooltip({ label, children, className, side = "bottom" }: TooltipProps) {
  return (
    <span className="group/tip relative inline-flex">
      {children}
      <span
        role="tooltip"
        className={cn(
          "pointer-events-none absolute left-1/2 z-50 -translate-x-1/2 whitespace-nowrap rounded-ios-md border border-separator bg-surface-raised px-2.5 py-1 text-[11px] font-medium text-label shadow-raised opacity-0 transition-opacity duration-150 ease-ios group-hover/tip:opacity-100 group-focus-within/tip:opacity-100",
          side === "bottom" ? "top-full mt-[7px]" : "bottom-full mb-[7px]",
          className
        )}
      >
        {label}
      </span>
    </span>
  );
}