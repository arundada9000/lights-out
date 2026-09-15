/**
 * Deterministic PRNG helpers.
 *
 * Lights Out generation must be reproducible (Daily puzzles, shared seeds),
 * so the board generator only ever consumes these seeded streams.
 */

export type Rng = () => number;

/** Small string hash (xmur3) producing a 32-bit seed. */
export function hashSeed(text: string): number {
  let h = 1779033703 ^ text.length;
  for (let i = 0; i < text.length; i++) {
    h = Math.imul(h ^ text.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  h = Math.imul(h ^ (h >>> 16), 2246822507);
  h = Math.imul(h ^ (h >>> 13), 3266489909);
  return (h ^= h >>> 16) >>> 0;
}

/** Mulberry32 - fast, decent-quality PRNG returning floats in [0, 1). */
export function mulberry32(seed: number): Rng {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Create a seeded RNG from a string seed. */
export function seededRandom(seed: string | number): Rng {
  const n = typeof seed === "number" ? seed : hashSeed(seed);
  return mulberry32(n);
}

/** A fresh random seed for casual boards. */
export function randomSeed(): number {
  return (Math.random() * 0xffffffff) >>> 0;
}

/** Deterministic per-day seed including ruleset/generator version. */
export function dailySeed(dateStamp: string, rulesetVersion = 1): string {
  return `daily:${dateStamp}:v${rulesetVersion}`;
}

/** Uniform integer in [min, max] (inclusive). */
export function randInt(rng: Rng, min: number, max: number): number {
  return min + Math.floor(rng() * (max - min + 1));
}

/** Pick a random element from an array. */
export function pick<T>(rng: Rng, arr: readonly T[]): T {
  return arr[Math.floor(rng() * arr.length)];
}