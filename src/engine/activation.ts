/**
 * Board geometry, topology and activation neighbourhoods.
 *
 * Topology is deliberately separate from activation (game-logic 7, 9: the
 * rectangular grid decides which cells exist and how edges connect, and the
 * activation rule decides which neighbouring cells a press toggles.
 */

export type Topology = "square" | "wrap-horizontal" | "wrap-vertical" | "toroidal";

/** Which cells a press activates. Each variant is a function of the tapped
 *  cell's row/column and the board size. */
export type ActivationKind =
  | "cross" //     X
  | "diagonal" // X X
  | "eight" //    X X X
  | "row" //      X X X X
  | "column" //   X  X  X
  | "diamond"; //   X
  //              X X X
  //                X   (radius-1 diamond)

export interface GridSpec {
  width: number;
  height: number;
  topology: Topology;
}

export function cellCount(spec: GridSpec): number {
  return spec.width * spec.height;
}

export function rowColOf(index: number, width: number): { r: number; c: number } {
  return { r: Math.floor(index / width), c: index % width };
}

function wrapValue(v: number, size: number): number {
  const m = v % size;
  return m < 0 ? m + size : m;
}

/**
 * Neighbour offsets for each activation kind, as [dr, dc] pairs relative to the
 * tapped cell. Edge clipping happens per-board; wrap topologies fold instead.
 */
const OFFSETS: Record<ActivationKind, ReadonlyArray<readonly [number, number]>> = {
  cross: [[0, 0], [-1, 0], [1, 0], [0, -1], [0, 1]],
  diagonal: [[0, 0], [-1, -1], [-1, 1], [1, -1], [1, 1]],
  eight: [[0, 0], [-1, 0], [1, 0], [0, -1], [0, 1], [-1, -1], [-1, 1], [1, -1], [1, 1]],
  row: [[0, 0]],
  column: [[0, 0]],
  diamond: [[0, 0], [-1, 0], [1, 0], [0, -1], [0, 1]],
};

/**
 * The set of cell indices toggled when `index` is pressed.
 *
 * - diamond and cross currently share neighbourhood geometry for their V1
 *   definition; the names are kept distinct so future tuning stays a one-liner.
 * - row flattens the tapped cell's whole row; column the whole column.
 */
export function neighborhoodOf(
  index: number,
  spec: GridSpec,
  kind: ActivationKind,
  baseCell: number
): number[] {
  const { width, height, topology } = spec;
  const { r, c } = rowColOf(index, width);

  if (kind === "row") {
    const out: number[] = [];
    for (let c0 = 0; c0 < width; c0++) out.push(r * width + c0);
    return out;
  }
  if (kind === "column") {
    const out: number[] = [];
    for (let r0 = 0; r0 < height; r0++) out.push(r0 * width + c);
    return out;
  }

  const wrapH = topology === "wrap-horizontal" || topology === "toroidal";
  const wrapV = topology === "wrap-vertical" || topology === "toroidal";

  const out: number[] = [];
  for (const [dr, dc] of OFFSETS[kind]) {
    if (dr === 0 && dc === 0) {
      out.push(index);
      continue;
    }
    let nr = r + dr;
    let nc = c + dc;
    if (wrapH) nc = wrapValue(nc, width);
    if (wrapV) nr = wrapValue(nr, height);
    if (nr < 0 || nr >= height || nc < 0 || nc >= width) continue;
    out.push(nr * width + nc);
  }
  return out.length > 0 ? out : [baseCell];
}

/** Precompute every cell's neighbourhood once per board. */
export function buildNeighborhoods(spec: GridSpec, kind: ActivationKind): number[][] {
  const size = cellCount(spec);
  const map: number[][] = new Array(size);
  for (let i = 0; i < size; i++) {
    map[i] = neighborhoodOf(i, spec, kind, i);
  }
  return map;
}