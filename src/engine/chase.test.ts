import { describe, expect, it } from "vitest";
import { bottomRowKeys, guidedSolveBlocks, pressOn, sweepDown, type CrossGrid } from "./chase";

/** The 5 x 5 pattern catalog the guide teaches (from the reference). */
const CATALOG_5: { name: string; bottom: number[]; top: number[] }[] = [
  { name: "Left triple", bottom: [1, 1, 1, 0, 0], top: [1] },
  { name: "Split quad", bottom: [1, 1, 0, 1, 1], top: [2] },
  { name: "Split triple", bottom: [1, 0, 1, 1, 0], top: [4] },
  { name: "Outer corners", bottom: [1, 0, 0, 0, 1], top: [0, 1] },
  { name: "Offset triple", bottom: [0, 1, 1, 0, 1], top: [0] },
  { name: "Inner pair", bottom: [0, 1, 0, 1, 0], top: [0, 3] },
  { name: "Right triple", bottom: [0, 0, 1, 1, 1], top: [3] },
];

const CATALOG_3: { name: string; bottom: number[]; top: number[] }[] = [
  { name: "Left triangle", bottom: [1, 0, 0], top: [0, 1] },
  { name: "Center T", bottom: [0, 1, 0], top: [0, 1, 2] },
  { name: "Right triangle", bottom: [0, 0, 1], top: [1, 2] },
  { name: "Left pair", bottom: [1, 1, 0], top: [2] },
  { name: "Right pair", bottom: [0, 1, 1], top: [0] },
  { name: "Bow arrow", bottom: [1, 0, 1], top: [0, 2] },
  { name: "Full row", bottom: [1, 1, 1], top: [1] },
];

function blankGrid(size: number): CrossGrid {
  return { width: size, height: size, cells: new Array(size * size).fill(0) };
}

describe("bottomRowKeys", () => {
  it("matches every 5 x 5 catalog case", () => {
    for (const c of CATALOG_5) {
      expect(bottomRowKeys(c.bottom), c.name).toEqual(c.top);
    }
  });

  it("matches every 3 x 3 catalog case", () => {
    for (const c of CATALOG_3) {
      expect(bottomRowKeys(c.bottom), c.name).toEqual(c.top);
    }
  });

  it("returns an empty set for an empty bottom row", () => {
    expect(bottomRowKeys([0, 0, 0, 0, 0])).toEqual([]);
  });

  it("returns null for patterns no valid board can produce", () => {
    // A full bottom row is not reachable on a 5 x 5 grid; no board can leave
    // it after a correct downward sweep.
    expect(bottomRowKeys([1, 1, 1, 1, 1])).toBeNull();
    expect(bottomRowKeys([1, 0, 1, 0, 1])).toBeNull();
  });

  it("produces a result that actually clears the board when applied", () => {
    for (const size of [3, 4, 5, 6, 7, 8]) {
      for (const trial of [0, 1, 2]) {
        // Build a valid board by scrambling from blank, then sweep it down to
        // read the bottom row exactly as a player would.
        const seeded = scrambleGrid(size, trial * 7 + size);
        const swept = sweepDown(seeded);
        const bottom = Array.from(swept.cells.slice((size - 1) * size));
        const keys = bottomRowKeys(bottom);
        expect(keys, `size ${size} trial ${trial}`).not.toBeNull();
        const solved = guidedSolveBlocks(seeded, keys as number[]);
        expect(solved, `size ${size} trial ${trial}`).toBe(true);
      }
    }
  });
});

function scrambleGrid(size: number, seed: number): CrossGrid {
  let state = seed >>> 0;
  const rnd = () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state;
  };
  let grid = blankGrid(size);
  const presses = 10 + (seed % 14);
  for (let i = 0; i < presses; i++) {
    grid = pressOn(grid, rnd() % (size * size));
  }
  return grid;
}