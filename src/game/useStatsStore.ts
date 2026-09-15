/**
 * Cross-run statistics (game-logic 54-58, 60-63).
 *
 * Records are committed only for qualifying runs (see useGameStore), and the
 * store is a thin persistence shell around the pure logic in stats.ts.
 */

import { create } from "zustand";
import {
  initialModeStats,
  updateModeStats,
  recordDaily,
  dailyStreak,
  type ModeStats,
  type DailyEntry,
} from "@/game/stats";
import type { ModeId } from "@/engine/modes";
import { readJSON, writeJSON, dateStamp } from "@/game/storage";

export interface StatsState {
  stats: Partial<Record<ModeId, ModeStats>>;
  dailyHistory: DailyEntry[];
  todayStamp: string;
  hydrated: boolean;

  recordResult: (mode: ModeId, result: { won: boolean; moves: number; seconds: number; optimal: number | null }) => void;
  getStats: (mode: ModeId) => ModeStats;
  streak: () => number;
  hydrate: () => void;
}

const EMPTY: ModeStats = initialModeStats();

export const useStatsStore = create<StatsState>((set, get) => ({
  stats: {},
  dailyHistory: [],
  todayStamp: "",
  hydrated: false,

  getStats: (mode) => get().stats[mode] ?? EMPTY,

  streak: () => dailyStreak(get().dailyHistory),

  recordResult: (mode, result) => {
    const stamp = dateStamp();
    const base = get().stats[mode] ?? initialModeStats();
    const stats = {
      ...get().stats,
      [mode]: updateModeStats(base, {
        won: result.won,
        moves: result.moves,
        seconds: result.seconds,
        stamp,
      }),
    };

    let dailyHistory = get().dailyHistory;
    if (mode === "daily") {
      dailyHistory = recordDaily(dailyHistory, {
        date: stamp,
        solved: result.won,
        moves: result.moves,
        optimal: result.optimal ?? result.moves,
        seconds: result.seconds,
      });
    }

    set({ stats, dailyHistory, todayStamp: stamp });
    writeJSON("stats", { stats, dailyHistory });
  },

  hydrate: () => {
    if (get().hydrated) return;
    const stored = readJSON<{ stats?: StatsState["stats"]; dailyHistory?: DailyEntry[] }>("stats");
    let stats: StatsState["stats"] = {};
    let dailyHistory: DailyEntry[] = [];
    if (stored) {
      stats = stored.stats ?? {};
      dailyHistory = Array.isArray(stored.dailyHistory) ? stored.dailyHistory : [];
    }
    set({ stats, dailyHistory, todayStamp: dateStamp(), hydrated: true });
  },
}));