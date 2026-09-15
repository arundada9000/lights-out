/**
 * Light-chasing helper used by the guides.
 *
 * The click method the guides teach is: clear every row above the bottom by
 * pressing the cell directly below each lit cell, read what is left on the
 * bottom row, then press a small set of cells on the top row once and sweep
 * down again to finish. This module computes that top-row set for a given
 * bottom row on a square cross-activation board. It returns null when the
 * bottom row cannot be a solved position, which a mis-clicked sweep produces.
 */

export interface CrossGrid {
  width: number;
  height: number;
  cells: number[];
}

function pressCross(cells: number[], size: number, r: number, c: number): void {
  const at = (rr: number, cc: number, val?: number): number => {
    const idx = rr * size + cc;
    if (val === undefined) return cells[idx];
    cells[idx] = val;
    return cells[idx];
  };
  at(r, c, at(r, c) ^ 1);
  if (r > 0) at(r - 1, c, at(r - 1, c) ^ 1);
  if (r < size - 1) at(r + 1, c, at(r + 1, c) ^ 1);
  if (c > 0) at(r, c - 1, at(r, c - 1) ^ 1);
  if (c < size - 1) at(r, c + 1, at(r, c + 1) ^ 1);
}

/**
 * Returns the top-row cells (0-based columns) that, pressed once, complete a
 * board whose bottom row reads `bottomRow` after every row above it was
 * cleared. Returns null when the pattern is unreachable from a valid board.
 *
 * Boards with a singular press matrix have several valid answers. This picks
 * the one with the fewest cells and, on ties, the pattern with the lowest
 * bitmask, which keeps guidance short and matches the published color cards.
 */
export function bottomRowKeys(bottomRow: readonly number[]): number[] | null {
  const n = bottomRow.length;
  if (n < 1) return null;

  // Build the effect matrix: pressing a top-row cell, followed by a full
  // downward sweep, changes exactly the bottom row in a known pattern.
  const basis: number[][] = [];
  for (let c = 0; c < n; c++) {
    const sweep = sweepDown(sizeBoard(n, c));
    basis.push(Array.from(sweep.cells.slice((n - 1) * n)));
  }

  // Solve basis * x = bottomRow over GF(2) into reduced row echelon form.
  const rows = n;
  const cols = n + 1;
  const m = Array.from({ length: rows }, (_, r) => {
    const row = new Array<number>(cols).fill(0);
    for (let c = 0; c < n; c++) row[c] = basis[c][r];
    row[n] = bottomRow[r];
    return row;
  });

  const pivotCol = new Array<number>(n).fill(-1);
  let pivotRow = 0;
  for (let c = 0; c < n && pivotRow < n; c++) {
    let sel = -1;
    for (let r = pivotRow; r < n; r++) {
      if (m[r][c] === 1) {
        sel = r;
        break;
      }
    }
    if (sel === -1) continue;
    [m[pivotRow], m[sel]] = [m[sel], m[pivotRow]];
    for (let r = 0; r < n; r++) {
      if (r !== pivotRow && m[r][c] === 1) {
        for (let k = c; k <= n; k++) m[r][k] ^= m[pivotRow][k];
      }
    }
    pivotCol[c] = pivotRow;
    pivotRow++;
  }

  for (let r = pivotRow; r < n; r++) {
    if (m[r][n] === 1) return null;
  }

  // Parameterize the solutions by the free (non-pivot) columns and pick the
  // best one. The pivot column with pivot row r then satisfies
  // x_pivot = rhs_r XOR (xor of m[r][f] for chosen free columns f).
  const base = new Array<number>(n).fill(0);
  for (let c = 0; c < n; c++) {
    const pr = pivotCol[c];
    if (pr !== -1 && m[pr][n] === 1) base[c] = 1;
  }
  const kernelCols: number[] = [];
  for (let f = 0; f < n; f++) {
    if (pivotCol[f] === -1) kernelCols.push(f);
  }

  let best: number[] | null = null;
  let bestPop = Infinity;
  let bestBits = Infinity;
  for (let mask = 0; mask < 1 << kernelCols.length; mask++) {
    const sol = new Array<number>(n).fill(0);
    for (let i = 0; i < kernelCols.length; i++) {
      if ((mask & (1 << i)) !== 0) sol[kernelCols[i]] = 1;
    }
    for (let c = 0; c < n; c++) {
      const pr = pivotCol[c];
      if (pr === -1) continue;
      let v = m[pr][n];
      for (let i = 0; i < kernelCols.length; i++) {
        if ((mask & (1 << i)) !== 0 && m[pr][kernelCols[i]] === 1) v ^= 1;
      }
      sol[c] = v;
    }
    const keys: number[] = [];
    let pop = 0;
    let bits = 0;
    for (let c = 0; c < n; c++) {
      if (sol[c] === 1) {
        keys.push(c);
        pop++;
        bits |= 1 << c;
      }
    }
    if (pop < bestPop || (pop === bestPop && bits < bestBits)) {
      bestPop = pop;
      bestBits = bits;
      best = keys;
    }
  }
  return best;
}

/** Board with a single top-row cell pressed, ready to be swept downward. */
function sizeBoard(size: number, col: number): CrossGrid {
  const cells = new Array<number>(size * size).fill(0);
  pressCross(cells, size, 0, col);
  return { width: size, height: size, cells };
}

/** One full downward sweep: clear rows 0..n-2 by pressing beneath each lit cell. */
export function sweepDown(grid: CrossGrid): CrossGrid {
  const cells = [...grid.cells];
  for (let r = 0; r < grid.height - 1; r++) {
    for (let c = 0; c < grid.width; c++) {
      if (cells[r * grid.width + c] === 1) {
        pressCross(cells, grid.width, r + 1, c);
      }
    }
  }
  return { width: grid.width, height: grid.height, cells };
}

/** Press a cell on a copy of the board (used by the guides and tests). */
export function pressOn(grid: CrossGrid, index: number): CrossGrid {
  const cells = [...grid.cells];
  pressCross(cells, grid.width, Math.floor(index / grid.width), index % grid.width);
  return { width: grid.width, height: grid.height, cells };
}

/** Simulate the guided click method and report whether it clears the board. */
export function guidedSolveBlocks(grid: CrossGrid, keys: number[]): boolean {
  let next = { ...grid, cells: [...grid.cells] };
  for (const k of keys) next = pressOn(next, k);
  next = sweepDown(next);
  return next.cells.every((v) => v === 0);
}