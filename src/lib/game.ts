export type GameMode = "time" | "endless";

export type Difficulty = "easy" | "normal" | "hard" | "very-hard";

export interface DifficultyConfig {
  label: string;
  sub: string;
  size: number;
  minPresses: number;
  maxPresses: number;
}

export const DIFFICULTIES: Record<Difficulty, DifficultyConfig> = {
  easy: { label: "Easy", sub: "5x5", size: 5, minPresses: 8, maxPresses: 14 },
  normal: { label: "Normal", sub: "6x6", size: 6, minPresses: 14, maxPresses: 22 },
  hard: { label: "Hard", sub: "7x7", size: 7, minPresses: 18, maxPresses: 30 },
  "very-hard": { label: "Very Hard", sub: "8x8", size: 8, minPresses: 24, maxPresses: 40 },
};

export const DIFFICULTY_KEYS = Object.keys(DIFFICULTIES) as Difficulty[];

/** Time mode runs a two-minute session, mirroring the speedrun variant. */
export const SESSION_SECONDS = 120;

export type Board = number[][];

export function createBoard(size: number): Board {
  return Array.from({ length: size }, () => Array<number>(size).fill(0));
}

/** Deterministic idle pattern so SSR and hydration always agree. */
export function staticBoard(size: number): Board {
  return Array.from({ length: size }, (_, r) =>
    Array.from({ length: size }, (_, c) => ((r + c) % 3 === 0 ? 1 : 0))
  );
}

/** Toggle a cell and its orthogonal neighbours, returning a new board. */
export function toggleCells(board: Board, r: number, c: number): Board {
  const size = board.length;
  const next = board.map((row) => [...row]);
  const deltas = [
    [0, 0],
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1],
  ] as const;
  for (const [dr, dc] of deltas) {
    const nr = r + dr;
    const nc = c + dc;
    if (nr >= 0 && nr < size && nc >= 0 && nc < size) next[nr][nc] ^= 1;
  }
  return next;
}

/** Build a guaranteed-solvable board by playing presses from the cleared state. */
export function generateBoard(size: number, minPresses: number, maxPresses: number): Board {
  const cap = Math.min(maxPresses, size * size);
  const presses = Math.min(cap, minPresses + Math.floor(Math.random() * (cap - minPresses + 1)));
  const used = new Set<string>();
  let board = createBoard(size);
  let guard = 0;
  while (used.size < presses && guard < size * size * 4) {
    guard++;
    const r = Math.floor(Math.random() * size);
    const c = Math.floor(Math.random() * size);
    const key = `${r}-${c}`;
    if (used.has(key)) continue;
    used.add(key);
    board = toggleCells(board, r, c);
  }
  return board;
}

export function countLit(board: Board): number {
  return board.reduce((acc, row) => acc + row.reduce((a, v) => a + v, 0), 0);
}

/** Pad a counter to fixed-width slot digits (7-seg style readouts). */
export function padSlots(n: number, digits = 3): string {
  return String(Math.max(0, Math.min(999, n))).padStart(digits, "0");
}

export function formatClock(totalSeconds: number): string {
  const s = Math.max(0, Math.floor(totalSeconds));
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
}