import { describe, expect, it } from "vitest";
import { buildTargetMask, matchesTarget } from "./target";
import type { GridSpec } from "./activation";

const spec5: GridSpec = { width: 5, height: 5, topology: "square" };

describe("buildTargetMask", () => {
  it("all-off produces an empty board", () => {
    expect(buildTargetMask(spec5, { kind: "all-off" })).toEqual(new Array(25).fill(0));
  });

  it("all-on fills every cell", () => {
    expect(buildTargetMask(spec5, { kind: "all-on" })).toEqual(new Array(25).fill(1));
  });

  it("checkerboard alternates by (r + c) parity", () => {
    const mask = buildTargetMask(spec5, { kind: "checkerboard" });
    expect(mask[0]).toBe(0);
    expect(mask[1]).toBe(1);
    expect(mask[5]).toBe(1);
    expect(mask[12]).toBe(0);
  });

  it("border only lights the outer ring", () => {
    const mask = buildTargetMask(spec5, { kind: "border" });
    expect(mask[0]).toBe(1);
    expect(mask[24]).toBe(1);
    expect(mask[12]).toBe(0);
    expect(mask[2]).toBe(1);
  });

  it("plus lights the middle row and column", () => {
    const mask = buildTargetMask(spec5, { kind: "plus" });
    expect(mask[12]).toBe(1);
    expect(mask[10]).toBe(1);
    expect(mask[14]).toBe(1);
    expect(mask[2]).toBe(1);
    expect(mask[0]).toBe(0);
    expect(mask[1]).toBe(0);
  });

  it("center builds a middle block", () => {
    const mask = buildTargetMask(spec5, { kind: "center" });
    const inBlock = mask.filter((v) => v === 1).length;
    expect(inBlock).toBeGreaterThan(0);
    expect(inBlock).toBeLessThan(25);
  });
});

describe("matchesTarget", () => {
  it("compares the live board against the mask", () => {
    const mask = buildTargetMask(spec5, { kind: "all-off" });
    expect(matchesTarget(new Array(25).fill(0), mask)).toBe(true);
    expect(matchesTarget([...mask].fill(1), mask)).toBe(false);
  });

  it("rejects length mismatches", () => {
    expect(matchesTarget([0], [0, 0])).toBe(false);
  });
});