import { describe, expect, it } from "vitest";
import { MODE_LIST, getMode, presetsFor, getPreset, rulesetFor, presetLabel } from "./modes";

describe("mode registry", () => {
  it("exposes all six V1 modes", () => {
    expect(MODE_LIST.map((m) => m.id)).toEqual(["classic", "pattern", "daily", "minimum", "timed", "zen"]);
  });

  it("looks up modes by id", () => {
    expect(getMode("daily").competitive).toBe(true);
    expect(getMode("zen").undoAllowed).toBe(true);
  });

  it("every mode declares a timer kind", () => {
    for (const m of MODE_LIST) {
      expect(["none", "count-up", "count-down"]).toContain(m.timer);
    }
  });
});

describe("presets", () => {
  it("every mode has at least one preset", () => {
    for (const m of MODE_LIST) {
      expect(presetsFor(m.id).length).toBeGreaterThan(0);
    }
  });

  it("presets are within grid bounds", () => {
    for (const m of MODE_LIST) {
      for (const p of presetsFor(m.id)) {
        expect(p.width).toBeGreaterThanOrEqual(3);
        expect(p.width).toBeLessThanOrEqual(8);
        expect(p.height).toBe(p.width);
        expect(p.pressRange[0]).toBeLessThanOrEqual(p.pressRange[1]);
        expect(p.minSolution).toBeGreaterThanOrEqual(1);
      }
    }
  });

  it("timed presets carry time limits", () => {
    for (const p of presetsFor("timed")) {
      expect(p.timeLimitMs).toBeGreaterThan(0);
    }
  });

  it("pattern presets declare a target", () => {
    for (const p of presetsFor("pattern")) {
      expect(p.target).toBeTruthy();
    }
  });

  it("unknown preset id falls back to the first preset", () => {
    const r = rulesetFor("classic", "nope");
    expect(r.presetId).toBe(presetsFor("classic")[0].id);
  });
});

describe("ruleset composition", () => {
  it("daily is competitive, seeded and square 5x5", () => {
    const r = rulesetFor("daily", "5x5", { seed: "daily:2026-09-15:v1" });
    expect(r.competitive).toBe(true);
    expect(r.seed).toBe("daily:2026-09-15:v1");
    expect(r.spec.width).toBe(5);
    expect(r.spec.height).toBe(5);
    expect(r.undoAllowed).toBe(false);
  });

  it("timed stays competitive with an all-off target", () => {
    const r = rulesetFor("timed", "t60");
    expect(r.competitive).toBe(true);
    expect(r.timeLimitMs).toBe(60_000);
    expect(r.target.kind).toBe("all-off");
    expect(r.timer).toBe("count-down");
  });

  it("zen permits assists with no timer", () => {
    const r = rulesetFor("zen", "3x3");
    expect(r.timer).toBe("none");
    expect(r.undoAllowed).toBe(true);
    expect(r.hintsAllowed).toBe(true);
    expect(r.competitive).toBe(false);
  });

  it("classic targets all-off with a count-up clock", () => {
    const r = rulesetFor("classic", "5x5");
    expect(r.timer).toBe("count-up");
    expect(r.target.kind).toBe("all-off");
    expect(r.undoAllowed).toBe(true);
  });

  it("pattern resolves the declared target", () => {
    const r = rulesetFor("pattern", "checkerboard-5");
    expect(r.target.kind).toBe("checkerboard");
    expect(r.spec.width).toBe(5);
    const p = presetLabel("pattern", "checkerboard-5");
    expect(p.length).toBeGreaterThan(0);
  });

  it("presetLabel is empty for unknown ids", () => {
    expect(presetLabel("classic", "zzz")).toBe("");
    expect(getPreset("classic", "zzz")).toBeUndefined();
  });
});