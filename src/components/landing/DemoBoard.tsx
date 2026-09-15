"use client";

import { useCallback, useRef, useState } from "react";
import { Power } from "lucide-react";

const SIZE = 5;

type Board = number[][];

/** Fixed starting layout so SSR and hydration agree; New Game re-randomizes. */
const INITIAL_BOARD: Board = [
  [0, 1, 0, 0, 1],
  [1, 0, 1, 1, 0],
  [0, 0, 1, 0, 0],
  [1, 1, 0, 1, 1],
  [0, 0, 1, 0, 0],
];

interface Wave {
  id: number;
  r: number;
  c: number;
}

function createEmptyBoard(): Board {
  return Array.from({ length: SIZE }, () => Array(SIZE).fill(0));
}

function clone(board: Board): Board {
  return board.map((row) => [...row]);
}

function toggle(board: Board, r: number, c: number): Board {
  const next = clone(board);
  const deltas = [
    [0, 0],
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1],
  ];
  for (const [dr, dc] of deltas) {
    const nr = r + dr;
    const nc = c + dc;
    if (nr >= 0 && nr < SIZE && nc >= 0 && nc < SIZE) {
      next[nr][nc] ^= 1;
    }
  }
  return next;
}

function generateSolvableBoard(): { initial: Board; moves: number } {
  const board = createEmptyBoard();
  const pressed: boolean[][] = Array.from({ length: SIZE }, () => Array(SIZE).fill(false));
  for (let i = 0; i < 12 + Math.floor(Math.random() * 9); i++) {
    let r: number, c: number;
    do {
      r = Math.floor(Math.random() * SIZE);
      c = Math.floor(Math.random() * SIZE);
    } while (pressed[r][c]);
    pressed[r][c] = true;
  }
  let result = board;
  let movesUsed = 0;
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      if (pressed[r][c]) {
        result = toggle(result, r, c);
        movesUsed++;
      }
    }
  }
  return { initial: result, moves: movesUsed };
}

function countOn(board: Board): number {
  return board.reduce((acc, row) => acc + row.reduce((a, v) => a + v, 0), 0);
}

function padSlots(n: number): [string, string, string] {
  return String(Math.min(999, n)).padStart(3, "0").split("") as [string, string, string];
}

export function DemoBoard() {
  const [board, setBoard] = useState<Board>(() => INITIAL_BOARD.map((row) => [...row]));
  const [moves, setMoves] = useState(0);
  const [won, setWon] = useState(false);
  const [waves, setWaves] = useState<Wave[]>([]);
  const waveId = useRef(0);
  const reduceMotion = useRef(
    typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );

  const newGame = useCallback(() => {
    setBoard(generateSolvableBoard().initial);
    setMoves(0);
    setWon(false);
    setWaves([]);
  }, []);

  const scheduleWave = useCallback((r0: number, c0: number) => {
    if (reduceMotion.current) return () => undefined;
    const timers: ReturnType<typeof setTimeout>[] = [];
    for (let r = 0; r < SIZE; r++) {
      for (let c = 0; c < SIZE; c++) {
        const dist = Math.abs(r - r0) + Math.abs(c - c0);
        const id = ++waveId.current;
        timers.push(
          setTimeout(() => {
            setWaves((w) => [...w, { id, r, c }]);
            setTimeout(() => {
              setWaves((w) => w.filter((x) => x.id !== id));
            }, 760);
          }, 45 + dist * 85)
        );
      }
    }
    return () => timers.forEach(clearTimeout);
  }, []);
  const clearWavesRef = useRef<(() => void) | null>(null);

  const handleTap = useCallback(
    (r: number, c: number) => {
      if (won) return;
      clearWavesRef.current?.();
      clearWavesRef.current = scheduleWave(r, c);
      const next = toggle(board, r, c);
      setBoard(next);
      setMoves((m) => m + 1);
      if (countOn(next) === 0) setWon(true);
    },
    [board, won, scheduleWave]
  );

  const movesSlots = padSlots(moves);
  const waveSet = new Set(waves.map((w) => `${w.r}-${w.c}`));

  return (
    <div className="instrument relative w-full p-5 sm:p-6">
      <span className="instrument-screw left-3 top-3" aria-hidden />
      <span className="instrument-screw right-3 top-3" aria-hidden />
      <span className="instrument-screw bottom-3 left-3" aria-hidden />
      <span className="instrument-screw bottom-3 right-3" aria-hidden />
      <span className="instrument-beam" aria-hidden />

      {/* Headplate */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex flex-col">
          <span className="etched text-board-cap">Easy Lights Out</span>
          <span className="mt-1 text-[10px] font-medium uppercase tracking-[0.22em] text-board-cap/50">
            5 &times; 5 logic grid
          </span>
        </div>
        <div className="flex items-center gap-2.5">
          <span className="flex items-center gap-1.5">
            <span className="led" aria-hidden />
            <span className="text-[9px] font-semibold uppercase tracking-[0.14em] text-board-cap">pwr</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="led dim" aria-hidden />
            <span className="text-[9px] font-semibold uppercase tracking-[0.14em] text-board-cap">sig</span>
          </span>
        </div>
      </div>

      {/* The patch bay */}
      <div
        className="relative grid gap-1.5 sm:gap-2"
        style={{ gridTemplateColumns: `repeat(${SIZE}, 1fr)` }}
        role="grid"
        aria-label="Lights Out board, 5 by 5"
      >
        {board.map((row, r) =>
          row.map((cell, c) => {
            const key = `${r}-${c}`;
            const hasWave = waveSet.has(key);
            return (
              <button
                key={key}
                type="button"
                role="gridcell"
                data-on={cell ? "true" : "false"}
                onClick={() => handleTap(r, c)}
                aria-label={`Row ${r + 1} column ${c + 1}, ${cell ? "on" : "off"}. Tap to toggle.`}
                disabled={won}
                className="bulb h-11 w-11 rounded-[11px] sm:h-[54px] sm:w-[54px] sm:rounded-[13px]"
              >
                {hasWave ? <span className="bulb-wave" aria-hidden /> : null}
              </button>
            );
          })
        )}
      </div>

      {/* Readout rail */}
      <div className="mt-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="etched text-board-cap">Moves</span>
          <span className="flex gap-1" aria-live="polite">
            {movesSlots.map((d, i) => (
              <span
                key={i}
                aria-hidden={i > 0}
                className="flex h-8 w-6 items-center justify-center rounded-[7px] border border-board-line bg-board-well font-mono text-sm font-bold tabular-nums text-board-cap shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)]"
              >
                {d}
              </span>
            ))}
          </span>
          <span className="sr-only">{moves} moves</span>
        </div>

        <div className="flex items-center gap-3">
          {won ? (
            <span className="rounded-full border border-accent/40 bg-accent/15 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-accent">
              Grid cleared
            </span>
          ) : null}
          <button
            type="button"
            onClick={newGame}
            className="flex h-8 cursor-pointer items-center gap-1.5 rounded-full border border-board-line bg-board-well px-3 text-[11px] font-bold uppercase tracking-[0.12em] text-board-cap shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] transition-all duration-200 ease-ios hover:text-accent hover:border-accent/50 active:scale-95 focus-visible:ring-focused"
          >
            <Power className="h-3 w-3" strokeWidth={2.4} aria-hidden />
            Power
          </button>
        </div>
      </div>
    </div>
  );
}