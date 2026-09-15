import { describe, expect, it } from "vitest";
import { hashSeed, mulberry32, randInt, seededRandom, dailySeed } from "./rng";

describe("hashSeed", () => {
  it("is stable across calls", () => {
    expect(hashSeed("daily-board-v1")).toBe(hashSeed("daily-board-v1"));
  });

  it("differs for different inputs", () => {
    expect(hashSeed("a")).not.toBe(hashSeed("b"));
  });

  it("returns an unsigned 32-bit value", () => {
    const h = hashSeed("hello world");
    expect(h).toBeGreaterThanOrEqual(0);
    expect(h).toBeLessThanOrEqual(0xffffffff);
  });
});

describe("mulberry32", () => {
  it("produces values in [0, 1)", () => {
    const rng = mulberry32(42);
    for (let i = 0; i < 1000; i++) {
      const v = rng();
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThan(1);
    }
  });

  it("is deterministic for a fixed seed", () => {
    const a = mulberry32(7);
    const b = mulberry32(7);
    const seqA = Array.from({ length: 20 }, () => a());
    const seqB = Array.from({ length: 20 }, () => b());
    expect(seqA).toEqual(seqB);
  });
});

describe("seededRandom", () => {
  it("accepts numbers and strings interchangeably by hash", () => {
    const a = seededRandom("seed-x");
    const b = seededRandom(hashSeed("seed-x"));
    expect(a()).toBeCloseTo(b(), 10);
  });
});

describe("randInt", () => {
  it("stays within inclusive bounds", () => {
    const rng = seededRandom("bounds");
    for (let i = 0; i < 500; i++) {
      const v = randInt(rng, 3, 7);
      expect(v).toBeGreaterThanOrEqual(3);
      expect(v).toBeLessThanOrEqual(7);
    }
  });
});

describe("dailySeed", () => {
  it("varies by date and version", () => {
    expect(dailySeed("2026-09-15")).toBe(dailySeed("2026-09-15"));
    expect(dailySeed("2026-09-15")).not.toBe(dailySeed("2026-09-16"));
    expect(dailySeed("2026-09-15", 1)).not.toBe(dailySeed("2026-09-15", 2));
  });
});