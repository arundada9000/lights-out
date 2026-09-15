/**
 * Mode and preset registry (game-logic 78, 82-83).
 *
 * A mode is a declared behavior profile; a ruleset composes geometry, activation,
 * target, timer, and assist rules into something the engine can execute. Presets
 * keep every combination data-driven instead of hardcoded per-mode.
 */

import type { ActivationKind, GridSpec } from "./activation";
import type { TargetSpec } from "./target";

export type ModeId = "classic" | "pattern" | "daily" | "minimum" | "timed" | "zen";

export interface ModeDef {
  id: ModeId;
  name: string;
  tagline: string;
  description: string;
  /** Competitive runs update records only when no assists were used. */
  competitive: boolean;
  undoAllowed: boolean;
  hintsAllowed: boolean;
  timer: "none" | "count-up" | "count-down";
}

export interface Preset {
  id: string;
  label: string;
  sub?: string;
  width: number;
  height: number;
  /** Generation scrape density [min, max] presses. */
  pressRange: readonly [number, number];
  minSolution: number;
  timeLimitMs?: number;
  target?: TargetSpec;
}

export const MODE_LIST: ModeDef[] = [
  {
    id: "classic",
    name: "Classic",
    tagline: "The original puzzle",
    description: "Clear every light. Start anywhere, undo freely, learn at your own pace.",
    competitive: false,
    undoAllowed: true,
    hintsAllowed: true,
    timer: "count-up",
  },
  {
    id: "pattern",
    name: "Pattern",
    tagline: "Build the shape",
    description: "Recreate a target pattern. The objective is the board, not just zeroes.",
    competitive: false,
    undoAllowed: true,
    hintsAllowed: true,
    timer: "count-up",
  },
  {
    id: "daily",
    name: "Daily",
    tagline: "One board per day",
    description: "The same deterministic 5x5 for everyone, generated locally from the date.",
    competitive: true,
    undoAllowed: false,
    hintsAllowed: false,
    timer: "count-up",
  },
  {
    id: "minimum",
    name: "Minimum Moves",
    tagline: "Prove your mastery",
    description: "No clock. Beat the board in as few presses as the solver allows.",
    competitive: true,
    undoAllowed: false,
    hintsAllowed: false,
    timer: "none",
  },
  {
    id: "timed",
    name: "Timed",
    tagline: "Beat the clock",
    description: "Clear the board before the countdown ends. One slip and the run is over.",
    competitive: true,
    undoAllowed: false,
    hintsAllowed: false,
    timer: "count-down",
  },
  {
    id: "zen",
    name: "Zen",
    tagline: "No pressure",
    description: "Solve calmly. Undo and hints are welcome; no timer, no failure state.",
    competitive: false,
    undoAllowed: true,
    hintsAllowed: true,
    timer: "none",
  },
];

const SIZES: { size: number; presses: readonly [number, number]; minSol: number }[] = [
  { size: 3, presses: [4, 8], minSol: 2 },
  { size: 4, presses: [6, 12], minSol: 2 },
  { size: 5, presses: [12, 18], minSol: 4 },
  { size: 6, presses: [16, 26], minSol: 6 },
  { size: 7, presses: [20, 32], minSol: 7 },
  { size: 8, presses: [24, 38], minSol: 9 },
];

function sizePresets(modeId: ModeId, minSize = 3, maxSize = 8): Preset[] {
  return SIZES.filter((s) => s.size >= minSize && s.size <= maxSize).map((s) => ({
    id: `${s.size}x${s.size}`,
    label: `${s.size} x ${s.size}`,
    sub: s.size >= 5 ? "Full grid" : "Warm-up",
    width: s.size,
    height: s.size,
    pressRange: s.presses,
    minSolution: s.minSol,
  }));
}

const PATTERNS: Preset[] = [
  { id: "checkerboard-5", label: "Checkerboard", sub: "5 x 5", width: 5, height: 5, pressRange: [8, 14], minSolution: 3, target: { kind: "checkerboard" } },
  { id: "border-5", label: "Border", sub: "5 x 5", width: 5, height: 5, pressRange: [8, 14], minSolution: 3, target: { kind: "border" } },
  { id: "plus-5", label: "Plus", sub: "5 x 5", width: 5, height: 5, pressRange: [8, 14], minSolution: 3, target: { kind: "plus" } },
  { id: "center-5", label: "Center", sub: "5 x 5", width: 5, height: 5, pressRange: [8, 14], minSolution: 3, target: { kind: "center" } },
  { id: "checkerboard-6", label: "Checkerboard", sub: "6 x 6", width: 6, height: 6, pressRange: [10, 18], minSolution: 4, target: { kind: "checkerboard" } },
  { id: "border-6", label: "Border", sub: "6 x 6", width: 6, height: 6, pressRange: [10, 18], minSolution: 4, target: { kind: "border" } },
];

const MINIMUM_PRESETS: Preset[] = [
  { id: "5x5", label: "5 x 5", sub: "Moderate", width: 5, height: 5, pressRange: [16, 22], minSolution: 8 },
  { id: "6x6", label: "6 x 6", sub: "Demanding", width: 6, height: 6, pressRange: [22, 30], minSolution: 10 },
];

const TIMED_PRESETS: Preset[] = [
  { id: "t30", label: "30 seconds", sub: "Sprint", width: 5, height: 5, pressRange: [10, 14], minSolution: 4, timeLimitMs: 30_000 },
  { id: "t60", label: "60 seconds", sub: "Standard", width: 5, height: 5, pressRange: [12, 16], minSolution: 4, timeLimitMs: 60_000 },
  { id: "t120", label: "120 seconds", sub: "Long", width: 5, height: 5, pressRange: [12, 18], minSolution: 5, timeLimitMs: 120_000 },
];

const DAILY_PRESET: Preset = {
  id: "5x5",
  label: "5 x 5",
  sub: "Today's board",
  width: 5,
  height: 5,
  pressRange: [14, 20],
  minSolution: 5,
};

export function getMode(id: ModeId): ModeDef {
  const mode = MODE_LIST.find((m) => m.id === id);
  if (!mode) throw new Error(`Unknown mode: ${id}`);
  return mode;
}

export function presetsFor(mode: ModeId): Preset[] {
  switch (mode) {
    case "classic":
      return sizePresets("classic");
    case "pattern":
      return PATTERNS;
    case "daily":
      return [DAILY_PRESET];
    case "minimum":
      return MINIMUM_PRESETS;
    case "timed":
      return TIMED_PRESETS;
    case "zen":
      return sizePresets("zen", 3, 6);
  }
}

export function getPreset(mode: ModeId, presetId: string): Preset | undefined {
  return presetsFor(mode).find((p) => p.id === presetId);
}

export interface Ruleset {
  mode: ModeId;
  presetId: string;
  label: string;
  spec: GridSpec;
  activation: ActivationKind;
  target: TargetSpec;
  timer: "none" | "count-up" | "count-down";
  timeLimitMs: number | null;
  undoAllowed: boolean;
  hintsAllowed: boolean;
  competitive: boolean;
  seed: string | number;
}

export function rulesetFor(
  mode: ModeId,
  presetId: string,
  options: { seed?: string | number } = {}
): Ruleset {
  const modeDef = getMode(mode);
  const preset = getPreset(mode, presetId) ?? presetsFor(mode)[0];
  return {
    mode,
    presetId: preset.id,
    label: `${modeDef.name} / ${preset.label}`,
    spec: { width: preset.width, height: preset.height, topology: "square" },
    activation: "cross",
    target: preset.target ?? { kind: "all-off" },
    timer: modeDef.timer,
    timeLimitMs: preset.timeLimitMs ?? null,
    undoAllowed: modeDef.undoAllowed,
    hintsAllowed: modeDef.hintsAllowed,
    competitive: modeDef.competitive,
    seed: options.seed ?? `run:${Math.floor(Math.random() * 0xffffffff)}`,
  };
}

export function presetLabel(mode: ModeId, presetId: string): string {
  const preset = getPreset(mode, presetId);
  if (!preset) return "" ;
  return preset.sub ?? preset.label;
}