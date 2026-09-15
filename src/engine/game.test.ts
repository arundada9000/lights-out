import { describe, expect, it } from "vitest";
import { GameEngine } from "./game";
import { generateClassic } from "./generator";
import { rulesetFor } from "./modes";
import { seededRandom, dailySeed } from "./rng";

function makeEngine(ruleset = rulesetFor("classic", "3x3"), seed = "game-t") {
  const puzzle = generateClassic(ruleset.spec, ruleset.activation, { pressRange: [4, 8], minSolution: 3 }, seededRandom(seed));
  if (!puzzle) throw new Error("generation failed");
  return new GameEngine(ruleset, puzzle);
}

describe("GameEngine phases", () => {
  it("starts ready and transitions on first press", () => {
    const e = makeEngine();
    expect(e.phase).toBe("ready");
    e.press(0);
    expect(e.phase).toBe("playing");
  });

  it("rejects presses when not running", () => {
    const e = makeEngine();
    e.press(0);
    e.phase = "won" as never;
    expect(e.press(4)).toBe(false);
  });

  it("detects a win and stops the timer", () => {
    const e = makeEngine();
    const solution = e.optimalMoves;
    for (const m of solution) e.press(m);
    expect(e.phase).toBe("won");
    expect(e.moves >= 0).toBe(true);
    const before = e.elapsedMs;
    e.tick(5000);
    expect(e.elapsedMs).toBe(before);
  });
});

describe("undo / redo", () => {
  it("restores the pre-press state", () => {
    const e = makeEngine();
    const before = [...e.cells];
    e.press(0);
    const after = [...e.cells];
    expect(after).not.toEqual(before);
    expect(e.undo()).toBe(true);
    expect(e.cells).toEqual(before);
    expect(e.moves).toBe(0);
  });

  it("re-applies an undone move", () => {
    const e = makeEngine();
    e.press(0);
    const after = [...e.cells];
    e.undo();
    expect(e.redo()).toBe(true);
    expect(e.cells).toEqual(after);
    expect(e.moves).toBe(1);
  });

  it("marks assists when undo is used", () => {
    const e = makeEngine();
    e.press(0);
    expect(e.assistUsed).toBe(false);
    e.undo();
    expect(e.assistUsed).toBe(true);
  });

  it("blocked when the mode forbids undo", () => {
    const ruleset = rulesetFor("daily", "5x5");
    const e = makeEngine(ruleset, "daily-x");
    e.press(0);
    expect(e.undo()).toBe(false);
    expect(e.canUndo).toBe(false);
  });
});

describe("restart", () => {
  it("returns to the opening board", () => {
    const e = makeEngine();
    const start = [...e.cells];
    e.press(0);
    e.restart();
    expect(e.cells).toEqual(start);
    expect(e.moves).toBe(0);
    expect(e.phase).toBe("ready");
    expect(e.undo()).toBe(false);
    expect(e.replay).toEqual([]);
  });
});

describe("timed mode", () => {
  it("loses the run when the countdown expires", () => {
    const ruleset = rulesetFor("timed", "t60");
    const e = makeEngine(ruleset, "timed-x");
    e.press(0);
    e.tick(60_001);
    expect(e.phase).toBe("lost");
    expect(e.reason).toBeTruthy();
  });

  it("ignores time while paused", () => {
    const ruleset = rulesetFor("timed", "t60");
    const e = makeEngine(ruleset, "timed-y");
    e.press(0);
    e.pause("Let's check the rules.");
    const t = e.elapsedMs;
    e.tick(120_000);
    expect(e.elapsedMs).toBe(t);
    expect(e.phase).toBe("paused");
  });
});

describe("hints", () => {
  it("available in zen, blocked in timed", () => {
    const zen = makeEngine(rulesetFor("zen", "3x3"), "zen-x");
    expect(zen.canHint).toBe(true);
    const timed = makeEngine(rulesetFor("timed", "t30"), "timed-h");
    expect(timed.canHint).toBe(false);
    expect(timed.hint()).toBeNull();
  });

  it("a hint is verified to remove a light and marks assists", () => {
    const e = makeEngine(rulesetFor("zen", "3x3"), "zen-y");
    const solution = e.hint();
    expect(solution).not.toBeNull();
    expect(e.assistUsed).toBe(true);
    if (solution) {
      for (const m of solution) e.press(m);
      expect(e.phase).toBe("won");
    }
  });
});

describe("serialize / hydrate", () => {
  it("round-trips an in-progress run", () => {
    const ruleset = rulesetFor("classic", "5x5");
    const e = makeEngine(ruleset, "ser-a");
    e.press(2);
    e.press(5);
    e.undo();
    const payload = e.serialize();
    const restored = GameEngine.hydrate(ruleset, payload);
    expect(restored).not.toBeNull();
    expect(restored?.cells).toEqual(e.cells);
    expect(restored?.moves).toBe(e.moves);
    expect(restored?.phase).toBe(e.phase);
    expect(restored?.replay).toEqual(e.replay);
    expect(restored?.assistUsed).toBe(e.assistUsed);
  });

  it("rejects unknown payload versions", () => {
    const ruleset = rulesetFor("classic", "3x3");
    const e = makeEngine(ruleset, "ser-b");
    const payload = e.serialize();
    payload.version = 999;
    expect(GameEngine.hydrate(ruleset, payload)).toBeNull();
  });

  it("rejects payloads that do not match the grid size", () => {
    const ruleset = rulesetFor("classic", "5x5");
    const e = makeEngine(rulesetFor("classic", "3x3"), "ser-c");
    const payload = e.serialize();
    expect(GameEngine.hydrate(ruleset, payload)).toBeNull();
  });
});

describe("replay and daily determinism", () => {
  it("records every accepted press", () => {
    const e = makeEngine();
    e.press(3);
    e.press(1);
    expect(e.replay).toEqual([3, 1]);
  });

  it("daily seed varies by date only", () => {
    const a = dailySeed("2026-09-15");
    const b = dailySeed("2026-09-15");
    const c = dailySeed("2026-09-16");
    expect(a).toBe(b);
    expect(a).not.toBe(c);
  });

  it("same day yields identical boards", () => {
    const first = makeEngine(rulesetFor("daily", "5x5", { seed: dailySeed("2026-09-15") }), "same");
    const second = makeEngine(rulesetFor("daily", "5x5", { seed: dailySeed("2026-09-15") }), "same");
    expect(first.cells).toEqual(second.cells);
  });
});