/**
 * Live run state + saved-run persistence (game-logic 16-21, 64).
 *
 * The store owns the mutable GameEngine, bumps a revision counter for render
 * invalidation, mirrors the phase for overlays, commits stats at run end, and
 * keeps a serialized snapshot for the Continue flow. All storage reads happen
 * in `boot()` on the client - never at module load.
 */

import { create } from "zustand";
import { GameEngine, type EnginePayload, type Phase } from "@/engine/game";
import { generateClassic, generatePattern, type GeneratedPuzzle } from "@/engine/generator";
import { rulesetFor, getMode, getPreset, presetsFor, type ModeId, type Ruleset } from "@/engine/modes";
import { applyMoves } from "@/engine/solver";
import { dailySeed, randomSeed, seededRandom } from "@/engine/rng";
import { playFeedback } from "@/game/sound";
import { useStatsStore } from "@/game/useStatsStore";
import { useToastStore } from "@/game/useToastStore";
import { readJSON, writeJSON, removeKey, dateStamp } from "@/game/storage";

export interface SavedRun {
  version: number;
  mode: ModeId;
  presetId: string;
  seed: string | number;
  stamp: string;
  payload: EnginePayload;
}

export interface RunResult {
  won: boolean;
  moves: number;
  seconds: number;
  optimal: number | null;
  mode: ModeId;
  presetId: string;
  label: string;
}

export interface GameState {
  mode: ModeId;
  presetId: string;
  engine: GameEngine | null;
  phase: Phase;
  revision: number;
  clock: number;
  hintCells: number[] | null;
  result: RunResult | null;
  savedRun: SavedRun | null;
  hydrated: boolean;

  boot: () => void;
  selectMode: (id: ModeId) => void;
  selectPreset: (id: ModeId, presetId: string) => void;
  newGame: (mode?: ModeId, presetId?: string) => void;
  continueRun: () => void;
  press: (index: number) => void;
  undo: () => void;
  redo: () => void;
  restart: () => void;
  hint: () => void;
  clearHint: () => void;
  tick: (dt: number) => void;
  pause: () => void;
  resume: () => void;
  saveNow: () => void;
  discardSaved: () => void;
  resetResult: () => void;
}

const SAVED_KEY = "saved-run";
const SAVED_VERSION = 1;

function generate(ruleset: Ruleset): GeneratedPuzzle {
  const rng = seededRandom(ruleset.seed);
  const attempts = 48;
  const opts = { pressRange: [12, 18], minSolution: 2 } as const;

  let puzzle: GeneratedPuzzle | null = null;
  if (ruleset.target.kind === "all-off") {
    puzzle = generateClassic(ruleset.spec, ruleset.activation, opts, rng, attempts);
  } else {
    puzzle = generatePattern(ruleset.spec, ruleset.activation, ruleset.target, opts, rng, attempts);
  }

  if (!puzzle) {
    // Hard fallback: scramble exactly three cells so the board is never empty.
    const size = ruleset.spec.width * ruleset.spec.height;
    const whole = [0, 1, 2, Math.min(3, size - 1)].slice(0, Math.min(3, size));
    puzzle = {
      initial: applyMoves(new Array<number>(size).fill(0), ruleset.spec, "cross", whole),
      optimal: whole,
      optimalCount: whole.length,
      optimalProven: true,
    };
  }
  return puzzle;
}

function makeRuleset(mode: ModeId, presetId: string, seed: string | number): Ruleset {
  return rulesetFor(mode, presetId, { seed });
}

function firstPreset(mode: ModeId): string {
  return presetsFor(mode)[0]?.id ?? "5x5";
}

function commitResult(engine: GameEngine): RunResult {
  const seconds = Math.ceil(engine.elapsedMs / 1000);
  const result: RunResult = {
    won: engine.phase === "won",
    moves: engine.moves,
    seconds,
    optimal: engine.optimalProven ? engine.optimalCount : null,
    mode: engine.ruleset.mode,
    presetId: engine.ruleset.presetId,
    label: engine.ruleset.label,
  };
  const stats = useStatsStore.getState();
  const prev = stats.getStats(result.mode);
  if (result.mode === "daily" || !engine.assistUsed) {
    stats.recordResult(result.mode, {
      won: result.won,
      moves: result.moves,
      seconds: result.seconds,
      optimal: result.optimal,
    });
  }

  if (result.won) {
    const next = useStatsStore.getState().getStats(result.mode);
    const newBestMoves =
      next.bestMoves != null &&
      next.bestMoves === result.moves &&
      (prev.bestMoves == null || result.moves < prev.bestMoves);
    const newBestSeconds =
      next.bestSeconds != null &&
      next.bestSeconds === result.seconds &&
      (prev.bestSeconds == null || result.seconds < prev.bestSeconds);

    const toasts = useToastStore.getState();
    if (result.mode === "daily") {
      const streak = useStatsStore.getState().streak();
      toasts.show({
        title: "Daily cleared",
        message: streak > 0 ? `Streak: ${streak} day${streak === 1 ? "" : "s"}` : `Solved in ${result.moves} moves`,
        tone: "success",
      });
    } else if (newBestMoves || newBestSeconds) {
      toasts.show({
        title: "New personal best",
        message: `${result.moves} moves, ${result.seconds}s in ${result.label}`,
        tone: "record",
      });
    }
  }
  return result;
}

export const useGameStore = create<GameState>((set, get) => {
  const sync = (engine: GameEngine | null, patch: Partial<GameState> = {}) => {
    set({
      engine,
      phase: engine?.phase ?? "idle",
      hintCells: null,
      revision: get().revision + 1,
      ...patch,
    });
  };

  return {
    mode: "classic",
    presetId: "5x5",
    engine: null,
    phase: "idle",
    revision: 0,
    clock: 0,
    hintCells: null,
    result: null,
    savedRun: null,
    hydrated: false,

    boot: () => {
      if (get().hydrated) return;
      const stored = readJSON<SavedRun>(SAVED_KEY);
      const today = dateStamp();
      let saved: SavedRun | null = null;
      if (stored && stored.version === SAVED_VERSION) {
        saved = stored.mode === "daily" && stored.stamp !== today ? null : stored;
      }
      set({ savedRun: saved, hydrated: true });

      if (saved) {
        get().continueRun();
      } else {
        get().newGame("classic", "5x5");
      }
    },

    selectMode: (id) => {
      set({ mode: id, presetId: firstPreset(id), result: null, hintCells: null });
    },

    selectPreset: (id, presetId) => {
      set({ mode: id, presetId, result: null, hintCells: null });
    },

    newGame: (mode = get().mode, presetId = get().presetId) => {
      const seed = mode === "daily" ? dailySeed(dateStamp()) : randomSeed();
      const ruleset = makeRuleset(mode, presetId, seed);
      const puzzle = generate(ruleset);
      const engine = new GameEngine(ruleset, puzzle);
      sync(engine, { mode, presetId, result: null });
      playFeedback("arm");
    },

    continueRun: () => {
      const saved = get().savedRun;
      if (!saved) return get().newGame();
      const ruleset = makeRuleset(saved.mode, saved.presetId, saved.seed);
      const engine = GameEngine.hydrate(ruleset, saved.payload);
      if (!engine) {
        removeKey(SAVED_KEY);
        return get().newGame();
      }
      sync(engine, { mode: saved.mode, presetId: saved.presetId, result: null });
    },

    press: (index) => {
      const engine = get().engine;
      if (!engine) return;
      const before = engine.phase;
      if (!engine.press(index)) return;
      playFeedback("press");

      let result: RunResult | null = null;
      if (engine.phase === "won") {
        result = commitResult(engine);
      }
      sync(engine, { result, ...(before === "ready" ? { clock: engine.elapsedMs } : {}) });
      void before;
    },

    undo: () => {
      const engine = get().engine;
      if (!engine?.undo()) return;
      playFeedback("undo");
      sync(engine);
    },

    redo: () => {
      const engine = get().engine;
      if (!engine?.redo()) return;
      playFeedback("undo");
      sync(engine);
    },

    restart: () => {
      const engine = get().engine;
      if (!engine) return;
      engine.restart();
      playFeedback("arm");
      sync(engine, { result: null, clock: 0 });
    },

    hint: () => {
      const engine = get().engine;
      if (!engine) return;
      const cells = engine.hint();
      if (!cells || cells.length === 0) return;
      playFeedback("hint");
      sync(engine, { hintCells: cells });
    },

    clearHint: () => {
      set({ hintCells: null });
      set({ revision: get().revision + 1 });
    },

    tick: (dt) => {
      const engine = get().engine;
      if (!engine) return;
      const prevPhase = engine.phase;
      engine.tick(dt);
      let result: RunResult | null = null;
      if (engine.phase === "lost" && prevPhase !== "lost") {
        result = commitResult(engine);
        playFeedback("lost");
      }
      if (engine.phase !== prevPhase) {
        sync(engine, { clock: engine.elapsedMs, result });
      } else {
        set({ clock: engine.elapsedMs });
      }
    },

    pause: () => {
      const engine = get().engine;
      if (!engine) return;
      engine.pause();
      sync(engine, { clock: engine.elapsedMs });
      get().saveNow();
    },

    resume: () => {
      const engine = get().engine;
      if (!engine) return;
      engine.resume();
      sync(engine);
      get().saveNow();
    },

    saveNow: () => {
      const engine = get().engine;
      if (!engine) return;
      if (engine.phase === "won" || engine.phase === "lost" || engine.phase === "idle") return;
      const saved: SavedRun = {
        version: SAVED_VERSION,
        mode: engine.ruleset.mode,
        presetId: engine.ruleset.presetId,
        seed: engine.ruleset.seed,
        stamp: dateStamp(),
        payload: engine.serialize(),
      };
      writeJSON(SAVED_KEY, saved);
    },

    discardSaved: () => {
      removeKey(SAVED_KEY);
      set({ savedRun: null });
    },

    resetResult: () => {
      set({ result: null });
      set({ revision: get().revision + 1 });
    },
  };
});

export { getMode, getPreset };