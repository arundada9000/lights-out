"use client";

import { cn } from "@/lib/cn";

/** Compact segmented control for choosing among a few options (sizes, presets). */
interface SegmentedProps<T extends string> {
  value: T;
  options: { value: T; label: string; sub?: string }[];
  onChange: (value: T) => void;
  ariaLabel: string;
  className?: string;
}

export function Segmented<T extends string>({ value, options, onChange, ariaLabel, className }: SegmentedProps<T>) {
  return (
    <div
      role="radiogroup"
      aria-label={ariaLabel}
      className={cn("flex w-full gap-1 rounded-ios-md bg-fill p-1", className)}
    >
      {options.map((opt) => {
        const selected = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={selected}
            aria-label={opt.label}
            disabled={selected}
            onClick={() => onChange(opt.value)}
            className={cn(
              "flex min-w-0 cursor-pointer flex-1 flex-col items-center justify-center rounded-[9px] px-2 py-1.5 transition-all duration-200 ease-ios focus-visible:ring-focused",
              selected
                ? "bg-surface shadow-sm"
                : "text-label-secondary hover:text-label"
            )}
          >
            <span className="text-[13px] font-semibold leading-tight">
              {opt.label}
            </span>
            {opt.sub ? (
              <span className="mt-0.5 text-[10px] font-medium leading-none opacity-70">
                {opt.sub}
              </span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}