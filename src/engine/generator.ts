/**
 * Puzzle generation (game-logic 22-24).
 *
 * Reverse generation: start from the solved state and apply a random press set,
 * which guarantees solvability. The result is then validated with the solver to
 * enforce non-triviality and to learn the exact minimum-move count, which powers
 * Minimum Moves mode, records, and hints.
 */

import { buildNeighborhoods, type ActivationKind, type GridSpec } from "./activation";
import { solvePuzzle, verifySolution } from "./solver";
import { buildTargetMask, type TargetSpec } from "./target";
import type { Rng } from "./rng";

export interface GeneratedPuzzle {
  /** The board the player sees first. */
  initial: number[];
  /** One optimal press-set (ascending indices). */
  optimal: number[];
  optimalCount: number;
  /** True when optimalCount is a proven minimum. */
  optimalProven: boolean;
}

export interface GenerateOptions {
  /** Minimum and maximum scramble presses (generation density). */
  pressRange: readonly [number, number];
  /** Minimum-accepted solution length; rejects trivial puzzles. */
  minSolution?: number;
}

function scrambleFrom(start: number[], spec: GridSpec, kind: ActivationKind, rng: Rng, minPresses: number, maxPresses: number): { board: number[]; presses: number } {
  const neighbors = buildNeighborhoods(spec, kind);
  const size = spec.width * spec.height;
  const cap = Math.min(maxPresses, size);
  const low = Math.min(minPresses, cap);
  const count = low + Math.floor(rng() * Math.max(1, cap - low + 1));

  const used = new Set<number>();
  const board = [...start];
  let guard = 0;
  while (used.size < count && guard < size * 4) {
    guard++;
    const cell = Math.floor(rng() * size);
    if (used.has(cell)) continue;
    used.add(cell);
    for (const i of neighbors[cell]) board[i] ^= 1;
  }
  return { board, presses: used.size };
}

function solverFor(start: number[], spec: GridSpec, kind: ActivationKind) {
  return solvePuzzle({ initial: start, target: buildTargetMask(spec, { kind: "all-off" }), spec, kind });
}

/**
 * Generate a Classic-style puzzle: scramble an empty board and validate.
 * Returns the generated puzzle, or null when validation failed too many times.
 */
export function generateClassic(
  spec: GridSpec,
  kind: ActivationKind,
  opts: GenerateOptions,
  rng: Rng,
  attempts = 24
): GeneratedPuzzle | null {
  let best: GeneratedPuzzle | null = null;
  const [minPress, maxPress] = opts.pressRange;
  const minSolution = opts.minSolution ?? 2;

  for (let attempt = 0; attempt < attempts; attempt++) {
    const { board, presses } = scrambleFrom(new Array<number>(spec.width * spec.height).fill(0), spec, kind, rng, minPress, maxPress);
    if (presses < 2) continue; // trivially unsolvable-interesting
    const solved = solverFor(board, spec, kind);
    if (!solved.solvable || solved.moveCount < minSolution) continue;
    if (!verifySolution(board, new Array<number>(spec.width * spec.height).fill(0), solved.moves, spec, kind)) {
      continue;
    }
    best = { initial: board, optimal: solved.moves, optimalCount: solved.moveCount, optimalProven: solved.optimal };
    // Prefer denser scrambles; last valid attempt is accepted.
  }
  return best;
}

/**
 * Generate a Pattern puzzle: start from the target mask and scramble it, so the
 * objective (reach the mask) is solvable by pressing exactly the scramble set.
 */
export function generatePattern(
  spec: GridSpec,
  kind: ActivationKind,
  target: TargetSpec,
  opts: GenerateOptions,
  rng: Rng,
  attempts = 24
): GeneratedPuzzle | null {
  const mask = buildTargetMask(spec, target);
  let best: GeneratedPuzzle | null = null;
  const [minPress, maxPress] = opts.pressRange;
  const minSolution = opts.minSolution ?? 2;

  for (let attempt = 0; attempt < attempts; attempt++) {
    const { board, presses } = scrambleFrom(mask, spec, kind, rng, minPress, maxPress);
    if (presses < 2) continue;
    const solved = solvePuzzle({ initial: board, target: mask, spec, kind });
    if (!solved.solvable || solved.moveCount < minSolution) continue;
    if (!verifySolution(board, mask, solved.moves, spec, kind)) continue;
    best = { initial: board, optimal: solved.moves, optimalCount: solved.moveCount, optimalProven: solved.optimal };
  }
  return best;
}