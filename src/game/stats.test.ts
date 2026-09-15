import { describe, expect, it } from "vitest";
import {
  initialModeStats,
  updateModeStats,
  movesRating,
  recordDaily,
  dailyStreak,
  type DailyEntry,
} from "./stats";

describe("initialModeStats", () => {
  it("starts empty", () => {
    const s = initialModeStats();
    expect(s.played).toBe(0);
    expect(s.won).toBe(0);
    expect(s.bestMoves).toBeNull();
    expect(s.bestSeconds).toBeNull();
  });
});

describe("updateModeStats", () => {
  it("counts plays and wins", () => {
    let s = initialModeStats();
    s = updateModeStats(s, { won: false, moves: 9, seconds: 80, stamp: "2026-09-15" });
    s = updateModeStats(s, { won: true, moves: 7, seconds: 60, stamp: "2026-09-15" });
    expect(s.played).toBe(2);
    expect(s.won).toBe(1);
    expect(s.bestMoves).toBe(7);
    expect(s.bestSeconds).toBe(60);
    expect(s.lastPlayedStamp).toBe("2026-09-15");
  });

  it("keeps the best of run, ignoring slower/longer ones", () => {
    let s = initialModeStats();
    s = updateModeStats(s, { won: true, moves: 12, seconds: 100, stamp: "d1" });
    s = updateModeStats(s, { won: true, moves: 16, seconds: 90, stamp: "d2" });
    s = updateModeStats(s, { won: true, moves: 8, seconds: 200, stamp: "d3" });
    expect(s.bestMoves).toBe(8);
    expect(s.bestSeconds).toBe(90);
  });

  it("does not record bests from losses", () => {
    let s = initialModeStats();
    s = updateModeStats(s, { won: false, moves: 3, seconds: 12, stamp: "d1" });
    expect(s.bestMoves).toBeNull();
    expect(s.bestSeconds).toBeNull();
  });
});

describe("movesRating", () => {
  it("returns a ratio above par", () => {
    expect(movesRating(10, 5)).toBe(2);
  });

  it("treats missing optimal as null", () => {
    expect(movesRating(5, null)).toBeNull();
  });
});

describe("recordDaily", () => {
  it("dedupes by date and keeps the newest", () => {
    let h: DailyEntry[] = [];
    h = recordDaily(h, { date: "2026-09-15", solved: true, moves: 6, optimal: 5, seconds: 40 });
    h = recordDaily(h, { date: "2026-09-15", solved: true, moves: 4, optimal: 4, seconds: 30 });
    expect(h).toHaveLength(1);
    expect(h[0].moves).toBe(4);
  });

  it("sorts newest first and trims to the limit", () => {
    let h: DailyEntry[] = [];
    const stamp = (date: Date): string =>
      `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
    for (let day = 0; day < 40; day++) {
      const d = new Date(2026, 8, 20 - day);
      h = recordDaily(h, { date: stamp(d), solved: true, moves: 6, optimal: 5, seconds: 40 });
    }
    expect(h.length).toBe(30);
    expect(h[0].date).toBe("2026-09-20");
    expect(h[29].date).toBe("2026-08-22");
  });
});

describe("dailyStreak", () => {
  const solved = (date: string): DailyEntry => ({ date, solved: true, moves: 6, optimal: 5, seconds: 40 });
  const today = new Date(2026, 8, 15); // 2026-09-15

  it("counts consecutive solved days back from today", () => {
    const h = [solved("2026-09-15"), solved("2026-09-14"), solved("2026-09-13")];
    expect(dailyStreak(h, today)).toBe(3);
  });

  it("still counts a run ending yesterday (today pending)", () => {
    const h = [solved("2026-09-14"), solved("2026-09-13")];
    expect(dailyStreak(h, today)).toBe(2);
  });

  it("breaks on a gap", () => {
    const h = [solved("2026-09-15"), solved("2026-09-13")];
    expect(dailyStreak(h, today)).toBe(1);
  });

  it("breaks on an unsolved day", () => {
    const h = [solved("2026-09-15"), { ...solved("2026-09-14"), solved: false }, solved("2026-09-13")];
    expect(dailyStreak(h, today)).toBe(1);
  });

  it("zeroes when the last play is stale", () => {
    const h = [solved("2026-09-10")];
    expect(dailyStreak(h, today)).toBe(0);
  });
});