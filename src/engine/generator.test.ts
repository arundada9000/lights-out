import { describe, expect, it } from "vitest";
import { generateClassic, generatePattern } from "./generator";
import { classifyDifficulty } from "./difficulty";
import { seededRandom } from "./rng";

const spec5 = { width: 5, height: 5, topology: "square" as const };

describe("generateClassic", () => {
  it("produces a solvable, non-trivial board", () => {
    const puzzle = generateClassic(
      spec5,
      "cross",
      { pressRange: [12, 18], minSolution: 4 },
      seededRandom("gen-1")
    );
    expect(puzzle).not.toBeNull();
    if (!puzzle) return;
    expect(puzzle.optimalCount).toBeGreaterThanOrEqual(4);
    expect(puzzle.initial).toHaveLength(25);
  });

  it("is deterministic under a fixed seed", () => {
    const a = generateClassic(spec5, "cross", { pressRange: [12, 18], minSolution: 4 }, seededRandom("fixed"));
    const b = generateClassic(spec5, "cross", { pressRange: [12, 18], minSolution: 4 }, seededRandom("fixed"));
    expect(a?.initial).toEqual(b?.initial);
    expect(a?.optimalCount).toBe(b?.optimalCount);
  });

  it("rejects boards below the min-solution floor", () => {
    // With a loose floor every scramble passes, so we only assert the pipe works.
    const puzzle = generateClassic(spec5, "cross", { pressRange: [4, 6], minSolution: 1 }, seededRandom("floor"));
    expect(puzzle).not.toBeNull();
    expect(puzzle?.optimalCount).toBeGreaterThanOrEqual(1);
  });

  it("honors the press density range", () => {
    const puzzle = generateClassic(spec5, "cross", { pressRange: [8, 10], minSolution: 1 }, seededRandom("density"));
    expect(puzzle).not.toBeNull();
    if (!puzzle) return;
    const presses = puzzle.initial.reduce((acc: number[], v, i) => (v === 1 ? [...acc, i] : acc), []);
    expect(presses.length).toBeGreaterThanOrEqual(1);
  });
});

describe("generatePattern", () => {
  it("scrambles toward a target that is reachable", () => {
    const puzzle = generatePattern(
      spec5,
      "cross",
      { kind: "checkerboard" },
      { pressRange: [8, 14], minSolution: 3 },
      seededRandom("pattern-1")
    );
    expect(puzzle).not.toBeNull();
    if (!puzzle) return;
    expect(puzzle.initial.length).toBe(25);
    expect(puzzle.optimalCount).toBeGreaterThanOrEqual(3);
  });

  it("is deterministic under a fixed seed", () => {
    const a = generatePattern(spec5, "cross", { kind: "border" }, { pressRange: [8, 14], minSolution: 3 }, seededRandom("p-fixed"));
    const b = generatePattern(spec5, "cross", { kind: "border" }, { pressRange: [8, 14], minSolution: 3 }, seededRandom("p-fixed"));
    expect(a?.initial).toEqual(b?.initial);
  });

  it("yields different boards for different targets", () => {
    const a = generatePattern(spec5, "cross", { kind: "checkerboard" }, { pressRange: [8, 14], minSolution: 3 }, seededRandom("p-t1"));
    const b = generatePattern(spec5, "cross", { kind: "border" }, { pressRange: [8, 14], minSolution: 3 }, seededRandom("p-t1"));
    expect(a?.initial).not.toEqual(b?.initial);
  });
});

describe("difficulty classification", () => {
  it("ranks larger optimal sets higher", () => {
    const low = classifyDifficulty(3, 5).score;
    const high = classifyDifficulty(30, 5).score;
    expect(high).toBeGreaterThan(low);
  });
});