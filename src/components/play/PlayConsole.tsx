"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Play, Power, SlidersHorizontal } from "lucide-react";
import { cn } from "@/lib/cn";
import {
  DIFFICULTIES,
  DIFFICULTY_KEYS,
  SESSION_SECONDS,
  countLit,
  formatClock,
  generateBoard,
  padSlots,
  staticBoard,
  toggleCells,
  type Board,
  type Difficulty,
  type GameMode,
} from "@/lib/game";
import { useSoundscape } from "./useSoundscape";
import type { AmbientKind } from "./soundscape";
import { Button } from "@/components/ui/Button";

type Phase = "standby" | "playing" | "config" | "over";

interface Wave {
  id: number;
  r: number;
  c: number;
}

const DEFAULT_BOARD = staticBoard(5);

const CELL_ROUND: Record<Difficulty, string> = {
  easy: "rounded-[11px] sm:rounded-[14px]",
  normal: "rounded-[10px] sm:rounded-[13px]",
  hard: "rounded-[9px] sm:rounded-[11px]",
  "very-hard": "rounded-[8px] sm:rounded-[10px]",
};

const MODE_OPTIONS: { value: GameMode; label: string; sub: string }[] = [
  { value: "time", label: "Time", sub: "2:00 session" },
  { value: "endless", label: "Endless", sub: "no time limit" },
];

const AMBIENT_OPTIONS: { value: AmbientKind | null; label: string }[] = [
  { value: null, label: "Off" },
  { value: "rain", label: "Rain" },
  { value: "fireside", label: "Fireside" },
];

function Segmented<T extends string | null>({
  value,
  onChange,
  options,
  ariaLabel,
}: {
  value: T;
  onChange: (value: T) => void;
  options: { value: T; label: string; sub?: string }[];
  ariaLabel: string;
}) {
  return (
    <div
      role="radiogroup"
      aria-label={ariaLabel}
      style={{ gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))` }}
      className="grid gap-1 rounded-xl border border-board-line bg-board-well p-1"
    >
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          role="radio"
          aria-checked={value === o.value}
          onClick={() => onChange(o.value)}
          className={cn(
            "flex min-h-11 cursor-pointer flex-col items-center justify-center rounded-[9px] px-2 py-1.5 text-[11px] font-bold uppercase tracking-[0.1em] transition-all duration-200 ease-ios focus-visible:ring-focused",
            value === o.value
              ? "border border-accent/40 bg-accent/15 text-accent"
              : "border border-transparent text-board-cap hover:bg-board-bg/60 hover:text-label"
          )}
        >
          {o.label}
          {o.sub ? (
            <span
              className={cn(
                "mt-0.5 text-[9px] font-semibold normal-case tracking-[0.08em]",
                value === o.value ? "text-accent/70" : "text-board-cap/50"
              )}
            >
              {o.sub}
            </span>
          ) : null}
        </button>
      ))}
    </div>
  );
}

function Readout({ label, value, warn }: { label: string; value: string; warn?: boolean }) {
  return (
    <div
      className={cn(
        "flex flex-col items-center gap-1.5 rounded-xl border bg-board-well px-2 py-2.5 sm:rounded-2xl sm:py-3",
        warn ? "border-warning/40" : "border-board-line"
      )}
    >
      <span className="etched text-board-cap/70">{label}</span>
      <span
        className={cn(
          "slot-readout font-mono text-base sm:text-xl",
          warn ? "text-warning" : "text-board-cap"
        )}
      >
        {value}
      </span>
    </div>
  );
}

function SwitchRow({
  label,
  hint,
  on,
  onToggle,
}: {
  label: string;
  hint: string;
  on: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-2xl border border-board-line bg-board-well px-4 py-3">
      <div className="min-w-0">
        <span className="etched text-board-cap">{label}</span>
        <p className="mt-0.5 truncate text-[11px] text-board-cap/60">{hint}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={on}
        aria-label={`${label}: ${on ? "on" : "off"}`}
        onClick={onToggle}
        className={cn(
          "flex h-9 w-16 shrink-0 cursor-pointer items-center rounded-full border p-1 transition-all duration-200 ease-ios focus-visible:ring-focused",
          on ? "justify-end border-accent/50 bg-accent/15" : "justify-start border-board-line bg-black/25"
        )}
      >
        <span
          aria-hidden
          className={cn(
            "h-7 w-7 rounded-full transition-all duration-200 ease-ios",
            on
              ? "bg-accent shadow-[0_0_10px_color-mix(in_srgb,var(--accent)_60%,transparent)]"
              : "bg-board-cap/30"
          )}
        />
        <span className="sr-only">{on ? "on" : "off"}</span>
      </button>
    </div>
  );
}

export function PlayConsole() {
  const sound = useSoundscape();
  const [phase, setPhase] = useState<Phase>("standby");
  const [mode, setMode] = useState<GameMode>("time");
  const [difficulty, setDifficulty] = useState<Difficulty>("easy");
  const [board, setBoard] = useState<Board>(DEFAULT_BOARD);
  const [moves, setMoves] = useState(0);
  const [cleared, setCleared] = useState(0);
  const [time, setTime] = useState(0);
  const [clearing, setClearing] = useState(false);
  const [waves, setWaves] = useState<Wave[]>([]);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [announce, setAnnounce] = useState("");
  const waveId = useRef(0);
  const startRef = useRef(0);
  const clearWavesRef = useRef<(() => void) | null>(null);
  const generationRef = useRef(0);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const frame = requestAnimationFrame(() => setReduceMotion(media.matches));
    const onChange = (e: MediaQueryListEvent) => setReduceMotion(e.matches);
    media.addEventListener("change", onChange);
    return () => {
      cancelAnimationFrame(frame);
      media.removeEventListener("change", onChange);
    };
  }, []);

  const newBoard = useCallback(
    (clearedCount: number) => {
      const cfg = DIFFICULTIES[difficulty];
      const pmax = Math.min(cfg.maxPresses, cfg.minPresses + clearedCount);
      setBoard(generateBoard(cfg.size, cfg.minPresses, pmax));
      setMoves(0);
    },
    [difficulty]
  );

  const gotoStandby = useCallback(() => {
    generationRef.current += 1;
    setPhase("standby");
    setBoard(staticBoard(DIFFICULTIES[difficulty].size));
    setClearing(false);
    setWaves([]);
    clearWavesRef.current?.();
    setAnnounce("");
  }, [difficulty]);

  const startSession = useCallback(() => {
    generationRef.current += 1;
    setPhase("playing");
    setCleared(0);
    setTime(0);
    setClearing(false);
    setWaves([]);
    clearWavesRef.current?.();
    startRef.current = Date.now();
    newBoard(0);
    sound.arm();
  }, [newBoard, sound]);

  const scheduleWave = useCallback(
    (r0: number, c0: number) => {
      if (reduceMotion) return () => undefined;
      const size = board.length;
      const timers: ReturnType<typeof setTimeout>[] = [];
      for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
          const dist = Math.abs(r - r0) + Math.abs(c - c0);
          const id = ++waveId.current;
          timers.push(
            setTimeout(() => {
              setWaves((w) => [...w, { id, r, c }]);
              timers.push(
                setTimeout(() => {
                  setWaves((w) => w.filter((x) => x.id !== id));
                }, 760)
              );
            }, 45 + dist * 85)
          );
        }
      }
      return () => timers.forEach(clearTimeout);
    },
    [board.length, reduceMotion]
  );

  const handleTap = useCallback(
    (r: number, c: number) => {
      if (phase !== "playing" || clearing) return;
      clearWavesRef.current?.();
      clearWavesRef.current = scheduleWave(r, c);
      const next = toggleCells(board, r, c);
      setBoard(next);
      setMoves((m) => m + 1);
      sound.tap();
      if (countLit(next) === 0) {
        const nextCleared = cleared + 1;
        setCleared(nextCleared);
        setClearing(true);
        setAnnounce(`Level ${nextCleared} cleared`);
        sound.win();
        const gen = generationRef.current;
        window.setTimeout(() => {
          if (gen !== generationRef.current) return;
          newBoard(nextCleared);
          setClearing(false);
        }, 1400);
      }
    },
    [phase, clearing, board, cleared, newBoard, scheduleWave, sound]
  );

  useEffect(() => {
    if (phase !== "playing") return;
    const id = window.setInterval(() => {
      const elapsed = Math.floor((Date.now() - startRef.current) / 1000);
      setTime(elapsed);
      if (mode === "time" && elapsed >= SESSION_SECONDS) {
        generationRef.current += 1;
        setPhase("over");
        setAnnounce("Session ended");
        sound.timeout();
      }
    }, 250);
    return () => window.clearInterval(id);
  }, [phase, mode, sound]);

  const changeDifficulty = useCallback(
    (d: Difficulty) => {
      setDifficulty(d);
      if (phase === "standby") setBoard(staticBoard(DIFFICULTIES[d].size));
    },
    [phase]
  );

  const lit = countLit(board);
  const size = DIFFICULTIES[difficulty].size;
  const pressCount = DIFFICULTIES[difficulty].minPresses;
  const waveSet = new Set(waves.map((w) => `${w.r}-${w.c}`));
  const remaining = Math.max(0, SESSION_SECONDS - time);
  const timeLabel = mode === "time" ? formatClock(remaining) : formatClock(time);
  const timeWarn = mode === "time" && remaining <= 10;
  const busy = clearing || phase !== "playing";

  return (
    <div className="instrument relative p-5 sm:p-6">
      <span className="instrument-screw left-3 top-3" aria-hidden />
      <span className="instrument-screw right-3 top-3" aria-hidden />
      <span className="instrument-screw bottom-3 left-3" aria-hidden />
      <span className="instrument-screw bottom-3 right-3" aria-hidden />
      {phase === "standby" ? <span className="instrument-beam" aria-hidden /> : null}

      <div className="relative z-[3] flex flex-col gap-4 rounded-[17px] sm:gap-5">
        <div inert={phase !== "playing"} className="flex flex-col gap-4 sm:gap-5">
        {/* Headplate */}
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <span className="etched text-board-cap">Lights Out Console</span>
            <p className="mt-1 text-[10px] font-medium uppercase tracking-[0.22em] text-board-cap/50">
              Model LO-9000 · {mode === "time" ? "Speed session" : "Endless run"}
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-3">
            <span className="flex items-center gap-1.5">
              <span className={cn("led", phase === "standby" && "dim")} aria-hidden />
              <span className="text-[9px] font-semibold uppercase tracking-[0.14em] text-board-cap">
                pwr
              </span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className={cn("led", phase !== "playing" && "dim")} aria-hidden />
              <span className="text-[9px] font-semibold uppercase tracking-[0.14em] text-board-cap">
                sig
              </span>
            </span>
          </div>
        </div>

        {/* Telemetry */}
        <div className="grid grid-cols-4 gap-2 sm:gap-3" aria-label="Telemetry">
          <Readout label="Level" value={padSlots(cleared)} />
          <Readout label="Lights" value={padSlots(lit)} />
          <Readout label="Moves" value={padSlots(moves)} />
          <Readout label="Time" value={timeLabel} warn={timeWarn} />
        </div>

        {/* The board */}
        <div
          role="grid"
          aria-label={`Lights Out board, ${size} by ${size}`}
          aria-busy={clearing}
          className="relative grid gap-1.5 sm:gap-2"
          style={{ gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))` }}
        >
          {board.map((row, r) =>
            row.map((cell, c) => {
              const key = `${r}-${c}`;
              const hasWave = waveSet.has(key);
              return (
                <button
                  key={key}
                  type="button"
                  role="gridcell"
                  data-on={cell ? "true" : "false"}
                  onClick={() => handleTap(r, c)}
                  aria-label={`Row ${r + 1} column ${c + 1}, ${cell ? "on" : "off"}. Tap to toggle.`}
                  disabled={busy}
                  className={cn("bulb aspect-square w-full", CELL_ROUND[difficulty])}
                >
                  {hasWave ? <span className="bulb-wave" aria-hidden /> : null}
                </button>
              );
            })
          )}

          {clearing ? (
            <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
              <div className="flex items-center gap-2 rounded-full border border-accent/40 bg-board-well/90 px-4 py-2">
                <span className="led" aria-hidden />
                <span className="etched text-accent">Signal clear · Level {cleared}</span>
              </div>
            </div>
          ) : null}
        </div>

        {/* Control rail */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2">
            <span className="led dim" aria-hidden />
            <span className="truncate text-[10px] font-semibold uppercase tracking-[0.18em] text-board-cap/70">
              {DIFFICULTIES[difficulty].label} grid · {size}&times;{size} · {pressCount}+ presses
            </span>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={() => setPhase("config")}
              className="flex h-9 cursor-pointer items-center gap-1.5 rounded-full border border-board-line bg-board-well px-3.5 text-[10px] font-bold uppercase tracking-[0.12em] text-board-cap transition-all duration-200 ease-ios hover:border-accent/50 hover:text-accent focus-visible:ring-focused active:scale-95"
            >
              <SlidersHorizontal className="h-3.5 w-3.5" aria-hidden />
              Config
            </button>
            <button
              type="button"
              onClick={gotoStandby}
              className="flex h-9 cursor-pointer items-center gap-1.5 rounded-full border border-board-line bg-board-well px-3.5 text-[10px] font-bold uppercase tracking-[0.12em] text-board-cap transition-all duration-200 ease-ios hover:border-accent/50 hover:text-accent focus-visible:ring-focused active:scale-95"
            >
              <Power className="h-3.5 w-3.5" aria-hidden />
              Power
            </button>
          </div>
        </div>

        {/* Soundscape dock */}
        <div className="flex flex-col gap-2 rounded-2xl border border-board-line bg-board-bg/40 p-3 sm:p-4">
          <span className="etched mb-1 text-board-cap">Soundscape</span>
          <div className="grid gap-2 sm:grid-cols-3">
            <SwitchRow
              label="Sfx"
              hint="Toggle & level chimes"
              on={sound.sfxOn}
              onToggle={() => sound.setSfx(!sound.sfxOn)}
            />
            <SwitchRow
              label="Music Room"
              hint="Generative pad loop"
              on={sound.musicOn}
              onToggle={() => sound.setMusic(!sound.musicOn)}
            />
            <div className="flex flex-col justify-center rounded-2xl border border-board-line bg-board-well px-4 py-3">
              <span className="etched text-board-cap">Ambient</span>
              <p className="mt-0.5 text-[11px] text-board-cap/60">Room bed</p>
              <div className="mt-2">
                <Segmented<AmbientKind | null>
                  ariaLabel="Ambient sound"
                  value={sound.ambient}
                  onChange={(kind) => sound.setAmbient(kind)}
                  options={AMBIENT_OPTIONS}
                />
              </div>
            </div>
          </div>
        </div>
        </div>

        {/* Announcement for assistive tech */}
        <p aria-live="polite" role="status" className="sr-only">
          {announce}
        </p>

        {/* Gates (idle, config, session end) */}
        {phase !== "playing" ? (
          <div className="absolute inset-0 z-20 flex items-center justify-center rounded-[17px] bg-board-bg/90 p-5 backdrop-blur-[2px] sm:p-6">
            {phase === "standby" ? (
              <GatePanel
                title="Standby"
                subtitle="The console is idle. Arm a run to light the board."
                ctaLabel="Arm Run"
                onCta={startSession}
                secondaryLabel="Read the rules"
                secondaryHref="/guides/how-to-play"
              >
                <GateControls
                  mode={mode}
                  setMode={setMode}
                  difficulty={difficulty}
                  setDifficulty={changeDifficulty}
                />
              </GatePanel>
            ) : null}

            {phase === "config" ? (
              <GatePanel
                title="Run Settings"
                subtitle="Pick a session style. Changes take effect on the next run."
                ctaLabel="New Run"
                onCta={startSession}
                secondaryLabel="Resume Run"
                onSecondary={() => setPhase("playing")}
              >
                <GateControls
                  mode={mode}
                  setMode={setMode}
                  difficulty={difficulty}
                  setDifficulty={changeDifficulty}
                />
              </GatePanel>
            ) : null}

            {phase === "over" ? (
              <GatePanel
                title="Session End"
                subtitle={`The clock stopped at ${formatClock(time)}.`}
                ctaLabel="Run Again"
                onCta={startSession}
                secondaryLabel="Back to Standby"
                onSecondary={gotoStandby}
              >
                <SessionStats cleared={cleared} time={time} />
              </GatePanel>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  );
}

function GateControls({
  mode,
  setMode,
  difficulty,
  setDifficulty,
}: {
  mode: GameMode;
  setMode: (m: GameMode) => void;
  difficulty: Difficulty;
  setDifficulty: (d: Difficulty) => void;
}) {
  return (
    <div className="flex w-full flex-col gap-3">
      <Segmented<GameMode>
        ariaLabel="Game mode"
        value={mode}
        onChange={setMode}
        options={MODE_OPTIONS}
      />
      <Segmented<Difficulty>
        ariaLabel="Difficulty"
        value={difficulty}
        onChange={setDifficulty}
        options={DIFFICULTY_KEYS.map((d) => ({
          value: d,
          label: DIFFICULTIES[d].label,
          sub: DIFFICULTIES[d].sub,
        }))}
      />
    </div>
  );
}

function SessionStats({ cleared, time }: { cleared: number; time: number }) {
  return (
    <div className="flex w-full gap-3">
      <SessionStat label="Boards cleared" value={padSlots(cleared)} />
      <SessionStat label="Session time" value={formatClock(time)} />
    </div>
  );
}

function SessionStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-1 flex-col items-center gap-1.5 rounded-2xl border border-board-line bg-board-well px-3 py-3">
      <span className="etched text-board-cap/70">{label}</span>
      <span className="slot-readout font-mono text-lg text-board-cap">{value}</span>
    </div>
  );
}

function GatePanel({
  title,
  subtitle,
  ctaLabel,
  onCta,
  secondaryLabel,
  onSecondary,
  secondaryHref,
  children,
}: {
  title: string;
  subtitle: string;
  ctaLabel: string;
  onCta: () => void;
  secondaryLabel?: string;
  onSecondary?: () => void;
  secondaryHref?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex w-full max-w-md flex-col items-center gap-5 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-2xl border border-accent/30 bg-accent/10">
        <Play className="h-6 w-6 text-accent" fill="currentColor" aria-hidden />
      </span>
      <div>
        <h2 className="text-xl font-semibold tracking-tight text-board-cap">{title}</h2>
        <p className="mt-1.5 text-sm leading-relaxed text-board-cap/70">{subtitle}</p>
      </div>
      {children}
      <div className="flex w-full flex-col gap-2 sm:flex-row">
        <Button size="lg" className="flex-1 text-sm" onClick={onCta} autoFocus>
          {ctaLabel}
        </Button>
        {secondaryHref ? (
          <Button asChild size="lg" variant="ghost" className="flex-1 text-sm">
            <Link href={secondaryHref}>{secondaryLabel}</Link>
          </Button>
        ) : null}
        {onSecondary ? (
          <Button size="lg" variant="ghost" className="flex-1 text-sm" onClick={onSecondary}>
            {secondaryLabel}
          </Button>
        ) : null}
      </div>
    </div>
  );
}