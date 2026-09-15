/**
 * GameEngine - a headless Lights Out run.
 *
 * Owns the live board, phases, move accounting, undo/redo, timer, replay log and
 * assist tracking. It has no idea about React or the DOM; the game layer binds
 * it to the UI and persists snapshots for the Continue flow (game-logic 16-21,
 * 60, 64).
 */

import { buildNeighborhoods } from "./activation";
import { solvePuzzle } from "./solver";
import { buildTargetMask, matchesTarget, type TargetSpec } from "./target";
import type { GeneratedPuzzle } from "./generator";
import type { Ruleset } from "./modes";

export type Phase = "idle" | "ready" | "playing" | "paused" | "won" | "lost";

export interface Snapshot {
  cells: number[];
  moves: number;
  elapsedMs: number;
  phase: Phase;
}

export interface EnginePayload {
  version: number;
  cells: number[];
  startCells: number[];
  targetMask: number[];
  phase: Phase;
  reason: string | null;
  moves: number;
  elapsedMs: number;
  undo: Snapshot[];
  redo: Snapshot[];
  replay: number[];
  assistUsed: boolean;
  optimalCount: number;
  optimalMoves: number[];
}

const PAYLOAD_VERSION = 1;

export class GameEngine {
  readonly ruleset: Ruleset;
  readonly cells: number[];
  readonly startCells: number[];
  readonly targetMask: number[];
  readonly optimalCount: number;
  readonly optimalMoves: number[];
  readonly optimalProven: boolean;

  phase: Phase = "ready";
  reason: string | null = null;
  moves = 0;
  elapsedMs = 0;
  assistUsed = false;
  replay: number[] = [];

  private undoStack: Snapshot[] = [];
  private redoStack: Snapshot[] = [];
  private neighbors: number[][];

  constructor(ruleset: Ruleset, generated: GeneratedPuzzle) {
    this.ruleset = ruleset;
    this.cells = [...generated.initial];
    this.startCells = [...generated.initial];
    this.optimalCount = generated.optimalCount;
    this.optimalMoves = [...generated.optimal];
    this.optimalProven = generated.optimalProven;
    this.targetMask = buildTargetMask(ruleset.spec, ruleset.target);
    this.neighbors = buildNeighborhoods(ruleset.spec, ruleset.activation);
  }

  get size(): number {
    return this.ruleset.spec.width * this.ruleset.spec.height;
  }

  get width(): number {
    return this.ruleset.spec.width;
  }

  get height(): number {
    return this.ruleset.spec.height;
  }

  get isRunning(): boolean {
    return this.phase === "ready" || this.phase === "playing";
  }

  get canUndo(): boolean {
    return this.ruleset.undoAllowed && this.undoStack.length > 0 && this.isRunning;
  }

  get canRedo(): boolean {
    return this.ruleset.undoAllowed && this.redoStack.length > 0 && this.isRunning;
  }

  get canHint(): boolean {
    return this.ruleset.hintsAllowed && this.isRunning;
  }

  get remainingMs(): number {
    if (this.ruleset.timer !== "count-down" || this.ruleset.timeLimitMs == null) return 0;
    return Math.max(0, this.ruleset.timeLimitMs - this.elapsedMs);
  }

  private snapshot(phase: Phase): Snapshot {
    return { cells: [...this.cells], moves: this.moves, elapsedMs: this.elapsedMs, phase };
  }

  private applyPressSet(indexes: number[]): void {
    for (const i of indexes) {
      this.cells[i] ^= 1;
    }
  }

  /** Fire a press on a cell. Returns true when the move was accepted. */
  press(index: number): boolean {
    if (!this.isRunning) return false;
    if (index < 0 || index >= this.size) return false;

    this.undoStack.push(this.snapshot(this.phase));
    if (this.redoStack.length > 0) this.redoStack = [];

    this.applyPressSet(this.neighbors[index]);
    this.moves += 1;
    this.replay.push(index);

    if (this.phase === "ready") this.phase = "playing";

    if (matchesTarget(this.cells, this.targetMask)) {
      this.phase = "won";
    }
    return true;
  }

  /** Restore the exact state before the previous press. */
  undo(): boolean {
    if (!this.canUndo) return false;
    const prev = this.undoStack.pop() as Snapshot;
    this.redoStack.push(this.snapshot(this.phase));
    this.cells.length = 0;
    this.cells.push(...prev.cells);
    this.moves = prev.moves;
    this.elapsedMs = prev.elapsedMs;
    this.phase = prev.phase;
    this.assistUsed = true;
    return true;
  }

  /** Re-apply the state that was just undone. */
  redo(): boolean {
    if (!this.canRedo) return false;
    const next = this.redoStack.pop() as Snapshot;
    this.undoStack.push(this.snapshot(this.phase));
    this.cells.length = 0;
    this.cells.push(...next.cells);
    this.moves = next.moves;
    this.elapsedMs = next.elapsedMs;
    this.phase = next.phase;
    return true;
  }

  /** Reset to the generated opening. Restart never replaces the puzzle. */
  restart(): void {
    this.cells.length = 0;
    this.cells.push(...this.startCells);
    this.moves = 0;
    this.elapsedMs = 0;
    this.phase = "ready";
    this.reason = null;
    this.undoStack = [];
    this.redoStack = [];
    this.replay = [];
    this.assistUsed = false;
  }

  pause(reasonMsg?: string): void {
    if (this.phase !== "playing") return;
    this.phase = "paused";
    this.reason = reasonMsg ?? null;
  }

  resume(): void {
    if (this.phase !== "paused") return;
    this.phase = "playing";
  }

  /**
   * Advance the timer. Called from the client clock loop.
   * Runs from the moment the board is dealt (ready), not just after the first
   * press, so count-up and count-down clocks are honest from the deal.
   */
  tick(deltaMs: number): void {
    if (!this.isRunning) return;
    if (this.ruleset.timer === "none") return;
    this.elapsedMs += deltaMs;
    if (
      this.ruleset.timer === "count-down" &&
      this.ruleset.timeLimitMs != null &&
      this.elapsedMs >= this.ruleset.timeLimitMs
    ) {
      this.elapsedMs = this.ruleset.timeLimitMs;
      this.phase = "lost";
      this.reason = "Time's up.";
    }
  }

  /** Next optimal move (or cell set) for the current board, or null. */
  hint(): number[] | null {
    if (!this.canHint) return null;
    const result = solvePuzzle({
      initial: this.cells,
      target: this.targetMask,
      spec: this.ruleset.spec,
      kind: this.ruleset.activation,
    });
    if (!result.solvable || result.moves.length === 0) return null;
    this.assistUsed = true;
    return result.moves;
  }

  /** A loss caused the run to end (timer). */
  get isAutoPaused(): boolean {
    return this.phase === "paused";
  }

  serialize(): EnginePayload {
    return {
      version: PAYLOAD_VERSION,
      cells: [...this.cells],
      startCells: [...this.startCells],
      targetMask: [...this.targetMask],
      phase: this.phase,
      reason: this.reason,
      moves: this.moves,
      elapsedMs: this.elapsedMs,
      undo: this.undoStack.map((s) => ({ cells: [...s.cells], moves: s.moves, elapsedMs: s.elapsedMs, phase: s.phase })),
      redo: this.redoStack.map((s) => ({ cells: [...s.cells], moves: s.moves, elapsedMs: s.elapsedMs, phase: s.phase })),
      replay: [...this.replay],
      assistUsed: this.assistUsed,
      optimalCount: this.optimalCount,
      optimalMoves: [...this.optimalMoves],
    };
  }

  /** Rebuild an engine from a previously serialized run. */
  static hydrate(ruleset: Ruleset, payload: EnginePayload): GameEngine | null {
    if (!payload || payload.version !== PAYLOAD_VERSION) return null;
    const size = ruleset.spec.width * ruleset.spec.height;
    if (payload.cells.length !== size) return null;

    const engine = new GameEngine(
      ruleset,
      { initial: payload.startCells, optimal: payload.optimalMoves, optimalCount: payload.optimalCount, optimalProven: true }
    );
    engine.cells.length = 0;
    engine.cells.push(...payload.cells);
    for (let i = 0; i < engine.targetMask.length; i++) {
      engine.targetMask[i] = payload.targetMask[i] ?? 0;
    }
    engine.phase = payload.phase;
    engine.reason = payload.reason;
    engine.moves = payload.moves;
    engine.elapsedMs = payload.elapsedMs;
    engine.undoStack = payload.undo.map((s) => ({ ...s, cells: [...s.cells] }));
    engine.redoStack = payload.redo.map((s) => ({ ...s, cells: [...s.cells] }));
    engine.replay = [...payload.replay];
    engine.assistUsed = payload.assistUsed;
    return engine;
  }
}

export type { TargetSpec };