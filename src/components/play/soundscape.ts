/**
 * Procedural soundscape engine (Web Audio, no sample assets).
 *
 * Everything is synthesized at runtime so the console ships with zero audio
 * files. All toggles default to off or muted and the context is unlocked on
 * the first user gesture (arming the run / flipping a switch).
 */

export type AmbientKind = "rain" | "fireside";

type Stoppable = () => void;

let ctx: AudioContext | null = null;
let master: GainNode | null = null;

let fxEnabled = true;
let ambientKind: AmbientKind | null = null;
let ambientSources: Stoppable[] = [];
let musicOn = false;
let musicSources: Stoppable[] = [];
let musicTimer: number | null = null;

function ensure(): { ctx: AudioContext; master: GainNode } | null {
  if (typeof window === "undefined") return null;
  const AC =
    window.AudioContext ??
    (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AC) return null;
  if (!ctx) {
    ctx = new AC();
    const g = ctx.createGain();
    g.gain.value = 0.9;
    g.connect(ctx.destination);
    master = g;
  }
  if (ctx.state === "suspended") void ctx.resume();
  if (master) return { ctx, master };
  return null;
}

export function unlockAudio(): void {
  ensure();
}

export function setFxEnabled(on: boolean): void {
  fxEnabled = on;
  if (on) unlockAudio();
}

function blip(
  e: { ctx: AudioContext; master: GainNode },
  opts: {
    freqFrom: number;
    freqTo?: number;
    type?: OscillatorType;
    gain: number;
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
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(opts.gain, t0 + (opts.attack ?? 0.008));
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + opts.decay);
  osc.connect(g).connect(master);
  osc.start(t0);
  osc.stop(t0 + opts.decay + 0.05);
}

export function playArm(): void {
  const e = ensure();
  if (!e) return;
  blip(e, { freqFrom: 220, freqTo: 440, gain: 0.08, decay: 0.5, attack: 0.03 });
}

export function playTap(): void {
  if (!fxEnabled) return;
  const e = ensure();
  if (!e) return;
  blip(e, { freqFrom: 520, freqTo: 330, gain: 0.06, decay: 0.1 });
}

export function playWin(): void {
  if (!fxEnabled) return;
  const e = ensure();
  if (!e) return;
  const notes = [659.25, 783.99, 1046.5];
  notes.forEach((freq, i) => {
    blip(e, { freqFrom: freq, gain: 0.07, decay: 0.7, delay: i * 0.09 });
  });
}

export function playTimeout(): void {
  if (!fxEnabled) return;
  const e = ensure();
  if (!e) return;
  blip(e, { freqFrom: 440, freqTo: 196, type: "sine", gain: 0.09, decay: 1.2, attack: 0.015 });
}

function makeNoiseBuffer(c: AudioContext, seconds: number, brown = false): AudioBuffer {
  const length = Math.max(1, Math.floor(c.sampleRate * seconds));
  const buffer = c.createBuffer(1, length, c.sampleRate);
  const data = buffer.getChannelData(0);
  if (brown) {
    let last = 0;
    for (let i = 0; i < length; i++) {
      const white = Math.random() * 2 - 1;
      last = (last + 0.02 * white) / 1.02;
      data[i] = last * 3.5;
    }
  } else {
    for (let i = 0; i < length; i++) data[i] = Math.random() * 2 - 1;
  }
  return buffer;
}

function startRain(e: { ctx: AudioContext; master: GainNode }): Stoppable {
  const { ctx, master } = e;
  const src = ctx.createBufferSource();
  src.buffer = makeNoiseBuffer(ctx, 2);
  src.loop = true;
  const lp = ctx.createBiquadFilter();
  lp.type = "lowpass";
  lp.frequency.value = 900;
  const g = ctx.createGain();
  g.gain.value = 0.05;
  const lfo = ctx.createOscillator();
  lfo.frequency.value = 0.3;
  const lfoGain = ctx.createGain();
  lfoGain.gain.value = 0.012;
  lfo.connect(lfoGain).connect(g.gain);
  src.connect(lp).connect(g).connect(master);
  src.start();
  lfo.start();
  return () => {
    try {
      src.stop();
      lfo.stop();
    } catch {
      /* node already stopped */
    }
    src.disconnect();
    lp.disconnect();
    g.disconnect();
    lfo.disconnect();
    lfoGain.disconnect();
  };
}

function startFireside(e: { ctx: AudioContext; master: GainNode }): Stoppable {
  const { ctx, master } = e;
  const src = ctx.createBufferSource();
  src.buffer = makeNoiseBuffer(ctx, 3, true);
  src.loop = true;
  const lp = ctx.createBiquadFilter();
  lp.type = "lowpass";
  lp.frequency.value = 420;
  const g = ctx.createGain();
  g.gain.value = 0.08;
  src.connect(lp).connect(g).connect(master);
  src.start();

  const burst = ctx.createBufferSource();
  const burstGain = ctx.createGain();
  burstGain.gain.value = 0;
  const hp = ctx.createBiquadFilter();
  hp.type = "highpass";
  hp.frequency.value = 2600;
  burst.buffer = makeNoiseBuffer(ctx, 0.06);
  burst.connect(hp).connect(burstGain).connect(master);
  burst.start();

  let alive = true;
  const ticker = window.setInterval(() => {
    if (!alive) return;
    if (Math.random() < 0.34) {
      const t = ctx.currentTime;
      burstGain.gain.cancelScheduledValues(t);
      burstGain.gain.setValueAtTime(0.09, t);
      burstGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.09);
    }
  }, 150);

  return () => {
    alive = false;
    window.clearInterval(ticker);
    try {
      src.stop();
      burst.stop();
    } catch {
      /* node already stopped */
    }
    src.disconnect();
    lp.disconnect();
    g.disconnect();
    burst.disconnect();
    hp.disconnect();
    burstGain.disconnect();
  };
}

const CHORDS: number[][] = [
  [110.0, 130.81, 164.81, 246.94],
  [87.31, 130.81, 164.81, 220.0],
  [130.81, 164.81, 196.0, 246.94],
  [98.0, 147.0, 196.0, 246.94],
];
const CHORD_DURATION = 7;

function startMusic(e: { ctx: AudioContext; master: GainNode }): Stoppable {
  const { ctx, master } = e;
  let stopped = false;
  let index = 0;

  const scheduleChord = () => {
    if (stopped) return;
    const t0 = ctx.currentTime + 0.05;
    const chord = CHORDS[index % CHORDS.length];
    index++;
    const perVoice = 0.05 / chord.length;
    for (const freq of chord) {
      for (const detune of [-5, 5]) {
        const osc = ctx.createOscillator();
        osc.type = "sine";
        osc.frequency.value = freq;
        osc.detune.value = detune;
        const g = ctx.createGain();
        g.gain.setValueAtTime(0.0001, t0);
        g.gain.exponentialRampToValueAtTime(perVoice, t0 + 2.2);
        g.gain.setValueAtTime(perVoice, t0 + CHORD_DURATION - 2.2);
        g.gain.exponentialRampToValueAtTime(0.0001, t0 + CHORD_DURATION);
        const lp = ctx.createBiquadFilter();
        lp.type = "lowpass";
        lp.frequency.value = 1100;
        const node = { osc, g, lp };
        osc.connect(g).connect(lp).connect(master);
        osc.start(t0);
        osc.stop(t0 + CHORD_DURATION + 0.1);
        window.setTimeout(() => {
          try {
            node.osc.stop();
          } catch {
            /* already stopped */
          }
          node.osc.disconnect();
          node.g.disconnect();
          node.lp.disconnect();
        }, (CHORD_DURATION + 0.2) * 1000);
      }
    }
    if (!stopped) musicTimer = window.setTimeout(scheduleChord, CHORD_DURATION * 1000);
  };

  scheduleChord();

  return () => {
    stopped = true;
    if (musicTimer) {
      window.clearTimeout(musicTimer);
      musicTimer = null;
    }
  };
}

export function setMusic(on: boolean): void {
  musicOn = on;
  for (const stop of musicSources) stop();
  musicSources = [];
  if (!on) return;
  const e = ensure();
  if (e) musicSources.push(startMusic(e));
}

export function getMusicOn(): boolean {
  return musicOn;
}

export function setAmbient(kind: AmbientKind | null): void {
  ambientKind = kind;
  for (const stop of ambientSources) stop();
  ambientSources = [];
  if (!kind) return;
  const e = ensure();
  if (!e) return;
  if (kind === "rain") ambientSources.push(startRain(e));
  if (kind === "fireside") ambientSources.push(startFireside(e));
}

export function getAmbientKind(): AmbientKind | null {
  return ambientKind;
}

export function shutdown(): void {
  setMusic(false);
  setAmbient(null);
  fxEnabled = true;
  if (ctx && ctx.state !== "closed") void ctx.close().catch(() => undefined);
  ctx = null;
  master = null;
}