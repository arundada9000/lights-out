"use client";

import { cn } from "@/lib/cn";

/** iOS-style switch. */
interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  description?: string;
  disabled?: boolean;
  testId?: string;
}

export function Switch({ checked, onChange, label, description, disabled, testId }: SwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      data-testid={testId}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={cn(
        "group flex w-full cursor-pointer items-center justify-between gap-3 rounded-ios-md px-1 py-2 text-left transition-colors duration-200 ease-ios focus-visible:ring-focused disabled:cursor-not-allowed disabled:opacity-50",
        !disabled && "hover:bg-fill"
      )}
    >
      <span className="min-w-0">
        <span className="block text-sm font-medium text-label">{label}</span>
        {description ? (
          <span className="mt-0.5 block text-[13px] leading-snug text-label-secondary">{description}</span>
        ) : null}
      </span>
      <span
        aria-hidden
        className={cn(
          "relative inline-flex h-7 w-11 shrink-0 items-center rounded-full transition-colors duration-200 ease-ios",
          checked ? "bg-accent" : "bg-fill-secondary"
        )}
      >
        <span
          className={cn(
            "absolute h-6 w-6 rounded-full bg-white shadow-sm transition-transform duration-200 ease-ios",
            checked ? "left-[calc(100%-1.5rem)]" : "left-0.5"
          )}
        />
      </span>
    </button>
  );
}