"use client";

import { memo } from "react";
import { cn } from "@/lib/cn";

interface CellProps {
  index: number;
  row: number;
  col: number;
  on: boolean;
  hint: boolean;
  disabled: boolean;
  wobble: boolean;
  onPress: (index: number) => void;
}

/**
 * One lamp cell. The structure is fixed: the button draws the socket, the inner
 * `.lamp` is the recessed lens. All animation is opacity/transform-only.
 */
export const Cell = memo(function Cell({ index, row, col, on, hint, disabled, wobble, onPress }: CellProps) {
  return (
    <button
      type="button"
      role="gridcell"
      data-on={on ? "true" : "false"}
      data-hint={hint ? "true" : "false"}
      aria-disabled={disabled}
      aria-label={`Row ${row + 1} column ${col + 1}, ${on ? "lit" : "dark"}. Tap to toggle.`}
      disabled={disabled}
      onClick={() => onPress(index)}
      className={cn("bulb h-full w-full", wobble && "bulb-wobble")}
    >
      <span className="lamp" aria-hidden />
    </button>
  );
});