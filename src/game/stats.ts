/**
 * Pure statistics and record logic (game-logic 54-58, 61-63).
 *
 * Stats derive from completed runs only. A "record" is a best move count or
 * best time for a mode; because competition modes forbid assists, the gate
 * lives at the record-commit boundary in the store, not here.
 */

export interface ModeStats {
  played: number;
  won: number;
  bestMoves: number | null;
  bestSeconds: number | null;
  elapsedSeconds: number;
  lastPlayedStamp: string | null;
}

export interface DailyEntry {
  date: string;
  solved: boolean;
  moves: number;
  optimal: number;
  seconds: number;
}

export type ModeId = "classic" | "pattern" | "daily" | "minimum" | "timed" | "zen";

export function initialModeStats(): ModeStats {
  return {
    played: 0,
    won: 0,
    bestMoves: null,
    bestSeconds: null,
    elapsedSeconds: 0,
    lastPlayedStamp: null,
  };
}

export interface RunResult {
  won: boolean;
  moves: number;
  seconds: number;
  stamp: string;
}

export function updateModeStats(base: ModeStats, result: RunResult): ModeStats {
  const played = base.played + 1;
  const won = base.won + (result.won ? 1 : 0);
  const bestMoves =
    result.won && (base.bestMoves == null || result.moves < base.bestMoves)
      ? result.moves
      : base.bestMoves;
  const bestSeconds =
    result.won && (base.bestSeconds == null || result.seconds < base.bestSeconds)
      ? result.seconds
      : base.bestSeconds;
  return {
    played,
    won,
    bestMoves,
    bestSeconds,
    elapsedSeconds: base.elapsedSeconds + result.seconds,
    lastPlayedStamp: result.stamp,
  };
}

/** How far a run overshot the proven minimum, expressed as a ratio >= 1. */
export function movesRating(moves: number, optimal: number | null): number | null {
  if (optimal == null || optimal <= 0) return null;
  return Math.round((moves / optimal) * 100) / 100;
}

export const DAILY_HISTORY_LIMIT = 30;

/** Insert one daily entry, keep history sorted by date, trim to limit. */
export function recordDaily(history: DailyEntry[], entry: DailyEntry): DailyEntry[] {
  const index = history.findIndex((h) => h.date === entry.date);
  const next = index >= 0 ? history.slice(0, index).concat(history.slice(index + 1)) : [...history];
  next.push(entry);
  next.sort((a, b) => b.date.localeCompare(a.date));
  return next.slice(0, DAILY_HISTORY_LIMIT);
}

/** Current streak: consecutive solved days ending today (or yesterday if today
 *  has not been played yet). */
export function dailyStreak(history: DailyEntry[], today = new Date()): number {
  if (history.length === 0) return 0;
  const sorted = [...history].sort((a, b) => b.date.localeCompare(a.date));

  const daysAgo = (stamp: string, from: Date): number => {
    const [y, m, d] = stamp.split("-").map(Number);
    const target = new Date(y, m - 1, d);
    const delta = Date.UTC(from.getFullYear(), from.getMonth(), from.getDate()) -
      Date.UTC(target.getFullYear(), target.getMonth(), target.getDate());
    return Math.round(delta / 86_400_000);
  };

  const first = sorted[0];
  const gap = daysAgo(first.date, today);
  if (gap > 1 || gap < 0) return 0;
  if (!first.solved) return 0;

  let streak = 1;
  for (let i = 1; i < sorted.length; i++) {
    const prevStamp = sorted[i - 1].date;
    const prev = new Date(
      Number(prevStamp.slice(0, 4)),
      Number(prevStamp.slice(5, 7)) - 1,
      Number(prevStamp.slice(8, 10))
    );
    const expected = new Date(prev.getFullYear(), prev.getMonth(), prev.getDate() - 1);
    const expectedStamp = `${expected.getFullYear()}-${String(expected.getMonth() + 1).padStart(2, "0")}-${String(expected.getDate()).padStart(2, "0")}`;
    if (sorted[i].date === expectedStamp && sorted[i].solved) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
}