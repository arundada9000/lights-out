/**
 * Target state definitions (game-logic 10). Play never assumes "all off": a
 * ruleset declares its own objective, and the engine compares the live board
 * against it through this module.
 */

import type { GridSpec } from "./activation";

export type TargetKind = "all-off" | "all-on" | "pattern" | "checkerboard" | "border" | "plus" | "center";

export interface TargetSpec {
  kind: TargetKind;
  /** Explicit mask (0/1 per cell) used when kind === "pattern". */
  mask?: ReadonlyArray<number>;
}

/** Build a concrete 0/1 mask for a target kind on a given grid. */
export function buildTargetMask(spec: GridSpec, target: TargetSpec): number[] {
  const { width, height } = spec;
  const size = width * height;
  const mask = new Array<number>(size).fill(0);

  switch (target.kind) {
    case "all-off":
      return mask;
    case "all-on":
      return new Array<number>(size).fill(1);
    case "pattern":
      return target.mask ? Array.from(target.mask).slice(0, size) : mask;
    case "checkerboard": {
      for (let r = 0; r < height; r++) {
        for (let c = 0; c < width; c++) mask[r * width + c] = (r + c) % 2;
      }
      return mask;
    }
    case "border": {
      for (let r = 0; r < height; r++) {
        for (let c = 0; c < width; c++) {
          if (r === 0 || r === height - 1 || c === 0 || c === width - 1) {
            mask[r * width + c] = 1;
          }
        }
      }
      return mask;
    }
    case "plus": {
      const midR = Math.floor((height - 1) / 2);
      const midC = Math.floor((width - 1) / 2);
      for (let r = 0; r < height; r++) {
        for (let c = 0; c < width; c++) {
          if (r === midR || c === midC) mask[r * width + c] = 1;
        }
      }
      return mask;
    }
    case "center": {
      const spanR = Math.max(0, Math.floor(height * 0.25));
      const spanC = Math.max(0, Math.floor(width * 0.25));
      const midR = Math.floor((height - 1) / 2);
      const midC = Math.floor((width - 1) / 2);
      for (let r = 0; r < height; r++) {
        for (let c = 0; c < width; c++) {
          if (Math.abs(r - midR) <= spanR && Math.abs(c - midC) <= spanC) {
            mask[r * width + c] = 1;
          }
        }
      }
      return mask;
    }
  }
}

/** True when the live board satisfies the target. */
export function matchesTarget(cells: ReadonlyArray<number>, mask: ReadonlyArray<number>): boolean {
  if (cells.length !== mask.length) return false;
  for (let i = 0; i < cells.length; i++) {
    if (cells[i] !== mask[i]) return false;
  }
  return true;
}