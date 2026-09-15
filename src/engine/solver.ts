/**
 * Lights Out solver over GF(2).
 *
 * Pressing cells is linear over the xor of cell states, so the puzzle reduces
 * to A*x = b mod 2 where A describes which cells each press toggles and b is
 * (initial XOR target). Gaussian elimination over GF(2) yields a particular
 * solution plus a nullspace basis; free variables are enumerated (bounded) to
 * find the minimum-move solution (game-logic 28-30).
 */

import { buildNeighborhoods, type ActivationKind, type GridSpec } from "./activation";

export interface SolverResult {
  solvable: boolean;
  /** Cell indices to press, in ascending order. */
  moves: number[];
  moveCount: number;
  /** True when `moves` is proven to be a minimum-move solution. */
  optimal: boolean;
  /** Enumerated solution count, or null when the nullspace was too large. */
  solutionCount: number | null;
}

/** Maximum free-variable combinations we are willing to enumerate (2^17). */
const MAX_ENUMERATE = 1 << 17;

function popcount(n: bigint): number {
  let count = 0;
  let v = n;
  while (v > 0n) {
    v &= v - 1n;
    count++;
  }
  return count;
}

function bitsToIndices(mask: bigint, size: number): number[] {
  const out: number[] = [];
  for (let i = 0; i < size; i++) {
    if ((mask >> BigInt(i)) & 1n) out.push(i);
  }
  return out;
}

export type SolverTarget = ReadonlyArray<number>;

/** Build the toggle matrix A for a grid and activation rule. */
export function buildToggleMatrix(spec: GridSpec, kind: ActivationKind): bigint[] {
  const size = spec.width * spec.height;
  const neighbors = buildNeighborhoods(spec, kind);
  const matrix: bigint[] = new Array(size).fill(0n);
  for (let pressCell = 0; pressCell < size; pressCell++) {
    const bit = 1n << BigInt(pressCell);
    for (const affected of neighbors[pressCell]) {
      matrix[affected] |= bit;
    }
  }
  return matrix;
}

export interface SolveRequest {
  initial: SolverTarget;
  target: SolverTarget;
  spec: GridSpec;
  kind: ActivationKind;
}

export function solvePuzzle({ initial, target, spec, kind }: SolveRequest): SolverResult {
  const size = spec.width * spec.height;
  const matrix = buildToggleMatrix(spec, kind);

  const b: boolean[] = new Array(size);
  for (let i = 0; i < size; i++) b[i] = (initial[i] ?? 0) !== (target[i] ?? 0);

  // Gaussian elimination to row-reduced echelon form with augmented column.
  const rows: bigint[] = [...matrix];
  const rhs: boolean[] = [...b];
  const pivotFor: number[] = new Array(size).fill(-1);

  let col = 0;
  for (let row = 0; row < size && col < size; col++) {
    let pivot = -1;
    for (let r = row; r < size; r++) {
      if ((rows[r] >> BigInt(col)) & 1n) {
        pivot = r;
        break;
      }
    }
    if (pivot === -1) continue;
    [rows[row], rows[pivot]] = [rows[pivot], rows[row]];
    [rhs[row], rhs[pivot]] = [rhs[pivot], rhs[row]];
    pivotFor[row] = col;

    const mask = rows[row] ^ (1n << BigInt(col));
    for (let r = 0; r < size; r++) {
      if (r !== row && ((rows[r] >> BigInt(col)) & 1n)) {
        rows[r] ^= mask;
        rhs[r] = rhs[r] !== rhs[row];
      }
    }
    row++;
  }

  const rank = pivotFor.filter((p) => p !== -1).length;

  // No pivot in a row whose rhs is set -> inconsistent, not solvable.
  for (let r = rank; r < size; r++) {
    if (rhs[r]) {
      return { solvable: false, moves: [], moveCount: 0, optimal: false, solutionCount: null };
    }
  }

  const freeVars: number[] = [];
  for (let c = 0; c < size; c++) {
    if (!pivotFor.includes(c)) freeVars.push(c);
  }

  // particular solution: x_pivot = rhs of that row
  let base = 0n;
  for (let r = 0; r < rank; r++) {
    if (rhs[r]) base |= 1n << BigInt(pivotFor[r]);
  }

  // nullspace basis vectors (one per free variable)
  const basis: bigint[] = freeVars.map((f) => {
    let v = 1n << BigInt(f);
    for (let r = 0; r < rank; r++) {
      if ((rows[r] >> BigInt(f)) & 1n) v |= 1n << BigInt(pivotFor[r]);
    }
    return v;
  });

  const enumCount = basis.length === 0 || 1 << basis.length <= MAX_ENUMERATE ? 1 << basis.length : null;
  let best = base;
  let bestWeight = popcount(base);

  if (enumCount !== null && enumCount > 1) {
    for (let combo = 1; combo < enumCount; combo++) {
      let candidate = base;
      let comboMask: number = combo;
      let idx = 0;
      while (comboMask > 0) {
        if (comboMask & 1) candidate ^= basis[idx];
        comboMask >>= 1;
        idx++;
      }
      const w = popcount(candidate);
      if (w < bestWeight) {
        bestWeight = w;
        best = candidate;
      }
      // Optional early cut: minimum possible is 0, but a zero press-set means
      // the board starts solved, which the generator refuses anyway.
      if (w === 0) break;
    }
  } else if (enumCount === null && basis.length > 0) {
    // Too many free variables to prove optimality; keep the particular solution.
  }

  return {
    solvable: true,
    moves: bitsToIndices(best, size),
    moveCount: bestWeight,
    optimal: enumCount !== null,
    solutionCount: enumCount,
  };
}

/** Apply a press-set to a board and compare against a target. */
export function applyMoves(
  initial: SolverTarget,
  spec: GridSpec,
  kind: ActivationKind,
  moves: ReadonlyArray<number>,
  stateCount = 2
): number[] {
  const size = spec.width * spec.height;
  const neighbors = buildNeighborhoods(spec, kind);
  const cells = initial.slice(0, size);
  for (const press of moves) {
    for (const i of neighbors[press]) {
      cells[i] = (cells[i] + 1) % stateCount;
    }
  }
  return cells;
}

/** Independent verification that a solution actually reaches the target. */
export function verifySolution(
  initial: SolverTarget,
  target: SolverTarget,
  moves: ReadonlyArray<number>,
  spec: GridSpec,
  kind: ActivationKind
): boolean {
  const result = applyMoves(initial, spec, kind, moves);
  return result.every((v, i) => v === (target[i] ?? 0));
}