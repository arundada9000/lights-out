/**
 * Gameplay feedback - synthesized Web Audio + haptics.
 *
 * Distinct from the ambient soundscape. This bus covers immediate feedback for
 * gameplay events (press, win, lose, hint, undo, error) with a tiny object-free
 * oscillator synth, plus optional vibration. Everything is gated by the live
 * settings so toggles take effect immediately.
 */

export type FeedbackKind = "press" | "won" | "lost" | "hint" | "undo" | "error" | "arm";

let ctx: AudioContext | null = null;
let master: GainNode | null = null;

let fxOn = true;
let hapticsOn = true;
let fxVolume = 0.6;

function ensure(): { ctx: AudioContext; master: GainNode } | null {
  if (typeof window === "undefined") return null;
  const AC =
    window.AudioContext ??
    (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AC) return null;
  if (!ctx) {
    ctx = new AC();
    const g = ctx.createGain();
    g.gain.value = fxVolume;
    g.connect(ctx.destination);
    master = g;
  }
  if (ctx.state === "suspended") void ctx.resume();
  if (master) return { ctx, master };
  return null;
}

function tone(
  e: { ctx: AudioContext; master: GainNode },
  opts: {
    freqFrom: number;
    freqTo?: number;
    type?: OscillatorType;
    gain?: number;
    attack?: number;
    decay: number;
    delay?: number;
  }
): void {
  const { ctx, master } = e;
  const t0 = ctx.currentTime + (opts.delay ?? 0);
  const osc = ctx.createOscillator();
  osc.type = opts.type ?? "triangle";
  osc.frequency.setValueAtTime(opts.freqFrom, t0);
  if (opts.freqTo && opts.freqTo !== opts.freqFrom) {
    osc.frequency.exponentialRampToValueAtTime(opts.freqTo, t0 + Math.max(0.03, opts.decay * 0.6));
  }
  const g = ctx.createGain();
  const base = opts.gain ?? 0.05;
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(base, t0 + (opts.attack ?? 0.008));
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + opts.decay);
  osc.connect(g).connect(master);
  osc.start(t0);
  osc.stop(t0 + opts.decay + 0.05);
}

const PATTERNS: Record<FeedbackKind, { sound?: (e: { ctx: AudioContext; master: GainNode }) => void; haptic: number[] }> = {
  press: {
    sound: (e) => tone(e, { freqFrom: 520, freqTo: 330, gain: 0.04, decay: 0.09 }),
    haptic: [8],
  },
  undo: {
    sound: (e) => tone(e, { freqFrom: 330, freqTo: 520, gain: 0.03, decay: 0.08 }),
    haptic: [4],
  },
  won: {
    sound: (e) => {
      const notes = [659.25, 783.99, 1046.5, 1318.5];
      notes.forEach((freq, i) => tone(e, { freqFrom: freq, gain: 0.055, decay: 0.6, delay: i * 0.09 }));
    },
    haptic: [20, 40, 20, 40, 60],
  },
  lost: {
    sound: (e) => tone(e, { freqFrom: 440, freqTo: 196, type: "sine", gain: 0.06, decay: 1.1, attack: 0.015 }),
    haptic: [60, 30, 80],
  },
  hint: {
    sound: (e) => tone(e, { freqFrom: 880, freqTo: 1320, type: "sine", gain: 0.035, decay: 0.28 }),
    haptic: [16, 16, 16],
  },
  error: {
    sound: (e) => tone(e, { freqFrom: 220, freqTo: 150, type: "square", gain: 0.03, decay: 0.2 }),
    haptic: [30, 50, 30],
  },
  arm: {
    sound: (e) => tone(e, { freqFrom: 220, freqTo: 440, gain: 0.05, decay: 0.4, attack: 0.03 }),
    haptic: [12],
  },
};

function vibrate(pattern: number[]): void {
  if (!hapticsOn) return;
  if (typeof navigator === "undefined" || typeof navigator.vibrate !== "function") return;
  try {
    navigator.vibrate(pattern);
  } catch {
    /* unsupported */
  }
}

export function setFeedbackVolume(level: number): void {
  fxVolume = Math.max(0, Math.min(1, level));
  if (master) master.gain.value = fxVolume;
}

export function setFeedbackEnabled(on: boolean): void {
  fxOn = on;
  if (on) ensure();
}

export function setHapticsEnabled(on: boolean): void {
  hapticsOn = on;
}

export function unlockFeedback(): void {
  ensure();
}

export function playFeedback(kind: FeedbackKind): void {
  const entry = PATTERNS[kind];
  if (hapticsOn) vibrate(entry.haptic);
  if (!fxOn) return;
  const e = ensure();
  if (!e) return;
  entry.sound?.(e);
}

export function shutdownFeedback(): void {
  if (ctx && ctx.state !== "closed") void ctx.close().catch(() => undefined);
  ctx = null;
  master = null;
}