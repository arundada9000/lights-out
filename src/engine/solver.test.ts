import { describe, expect, it } from "vitest";
import { buildToggleMatrix, solvePuzzle, applyMoves, verifySolution } from "./solver";
import type { GridSpec } from "./activation";

const spec3: GridSpec = { width: 3, height: 3, topology: "square" };
const spec5: GridSpec = { width: 5, height: 5, topology: "square" };

describe("buildToggleMatrix", () => {
  it("is symmetric for cross neighborhoods", () => {
    const m = buildToggleMatrix(spec5, "cross");
    for (let i = 0; i < 25; i++) {
      for (let j = 0; j < 25; j++) {
        expect((m[i] >> BigInt(j)) & 1n).toBe((m[j] >> BigInt(i)) & 1n);
      }
    }
  });

  it("cross press toggles self + orthogonal neighbours only", () => {
    const m = buildToggleMatrix(spec3, "cross");
    const center = 4;
    const affected = [1, 3, 4, 5, 7];
    for (let i = 0; i < 9; i++) {
      expect((m[center] >> BigInt(i)) & 1n ? 1 : 0).toBe(affected.includes(i) ? 1 : 0);
    }
  });
});

describe("solvePuzzle", () => {
  it("empty board needs zero presses", () => {
    const res = solvePuzzle({
      initial: new Array(25).fill(0),
      target: new Array(25).fill(0),
      spec: spec5,
      kind: "cross",
    });
    expect(res.solvable).toBe(true);
    expect(res.moveCount).toBe(0);
    expect(res.optimal).toBe(true);
  });

  it("single press board solves with exactly that press", () => {
    const initial = applyMoves(new Array(9).fill(0), spec3, "cross", [4]);
    const res = solvePuzzle({ initial, target: new Array(9).fill(0), spec: spec3, kind: "cross" });
    expect(res.solvable).toBe(true);
    expect(res.moveCount).toBe(1);
    expect(res.moves).toEqual([4]);
    expect(verifySolution(initial, new Array(9).fill(0), res.moves, spec3, "cross")).toBe(true);
  });

  it("returns a solution within the scramble bound", () => {
    const presses = [0, 4, 7, 11, 16, 22, 24];
    const initial = applyMoves(new Array(25).fill(0), spec5, "cross", presses);
    const res = solvePuzzle({ initial, target: new Array(25).fill(0), spec: spec5, kind: "cross" });
    expect(res.solvable).toBe(true);
    expect(res.moves.length).toBeLessThanOrEqual(presses.length);
    expect(res.optimal).toBe(true);
    expect(verifySolution(initial, new Array(25).fill(0), res.moves, spec5, "cross")).toBe(true);
  });

  it("detects unsolvable boards", () => {
    // A 2-cell line: every press toggles BOTH cells, so a one-cell state is
    // unreachable -> the toggle equations are inconsistent.
    const spec2: GridSpec = { width: 2, height: 1, topology: "square" };
    const res = solvePuzzle({
      initial: [0, 0],
      target: [1, 0],
      spec: spec2,
      kind: "cross",
    });
    expect(res.solvable).toBe(false);
  });

  it("counts the full solution space when bounded", () => {
    // The 5x5 cross grid has nullity 2, so every solvable board admits exactly
    // 4 press-sets.
    const initial = new Array(25).fill(0);
    const res = solvePuzzle({ initial, target: new Array(25).fill(0), spec: spec5, kind: "cross" });
    expect(res.solutionCount).toBe(4);
    expect(res.moveCount).toBe(0);
  });
});

describe("applyMoves + verifySolution", () => {
  it("applying a move twice is a no-op", () => {
    const start = new Array(9).fill(0);
    const once = applyMoves(start, spec3, "cross", [0, 2]);
    const twice = applyMoves(once, spec3, "cross", [0, 2]);
    expect(twice).toEqual(start);
  });

  it("verifySolution accepts only true solutions", () => {
    const target = new Array(9).fill(0);
    const initial = applyMoves(target, spec3, "cross", [1, 3, 5]);
    expect(verifySolution(initial, target, [1, 3, 5], spec3, "cross")).toBe(true);
    expect(verifySolution(initial, target, [1, 3], spec3, "cross")).toBe(false);
  });
});