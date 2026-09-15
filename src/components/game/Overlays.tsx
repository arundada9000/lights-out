"use client";

import { AnimatePresence, motion } from "motion/react";
import type { ReactNode } from "react";
import { Check, Gauge, Play, RotateCcw, Timer, X } from "lucide-react";
import { useGameStore } from "@/game/useGameStore";
import { useSettingsStore } from "@/game/useSettingsStore";
import { Button } from "@/components/ui/Button";
import { formatSeconds } from "@/lib/time";

/** Won / lost result panel rendered over the board. */
function ResultOverlay({ onNewGame, onChangeMode }: { onNewGame: () => void; onChangeMode: () => void }) {
  const result = useGameStore((s) => s.result);
  const mode = useGameStore((s) => s.mode);
  const autoNext = useSettingsStore((s) => s.autoNext);

  if (!result) return null;

  const optimal = result.optimal;
  const rating = optimal != null && optimal > 0 ? Math.round((result.moves / optimal) * 100) : null;

  return (
    <motion.div
      key="result"
      initial={{ opacity: 0, y: 24, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 16, scale: 0.97 }}
      transition={{ type: "spring", stiffness: 300, damping: 28 }}
      className="mx-auto w-full max-w-sm rounded-ios-2xl border border-separator bg-surface-raised p-6 shadow-modal"
      role="dialog"
      aria-modal="true"
      aria-live="polite"
    >
      {result.won ? (
        <div className="flex items-center gap-2 text-accent">
          <Check className="h-4 w-4" strokeWidth={2.6} aria-hidden />
          <span className="text-[13px] font-bold uppercase tracking-[0.16em]">Grid cleared</span>
        </div>
      ) : (
        <div className="flex items-center gap-2 text-danger">
          <Timer className="h-4 w-4" strokeWidth={2.4} aria-hidden />
          <span className="text-[13px] font-bold uppercase tracking-[0.16em]">Time&apos;s up</span>
        </div>
      )}

      <div className="mt-4 grid grid-cols-3 gap-2">
        <Factor label="Moves" value={String(result.moves)} />
        <Factor label="Time" value={formatSeconds(result.seconds)} />
        <Factor label="Optimal" value={optimal != null ? String(optimal) : "-"} />
      </div>

      {result.won && rating != null ? (
        <p className="mt-4 flex items-center gap-1.5 text-[13px] text-label-secondary">
          <Gauge className="h-3.5 w-3.5 text-accent" aria-hidden />
          {rating <= 100
            ? "Optimal run. The solver could not do better."
            : `You used ${rating}% of the proven minimum press count.`}
          {rating > 250 ? " Try trimming redundant presses." : ""}
        </p>
      ) : null}

      <div className="mt-6 flex flex-col gap-2">
        <Button variant="primary" size="lg" onClick={onNewGame}>
          <Play className="h-4 w-4" aria-hidden />
          {result.won ? (autoNext ? "Next board" : "Play again") : "Try again"}
        </Button>
        <Button variant="secondary" size="lg" onClick={onChangeMode}>
          <RotateCcw className="h-4 w-4" aria-hidden />
          Change mode
        </Button>
      </div>

      <p className="mt-3 text-center text-[11px] text-label-tertiary">
        {mode} run, assists locked
      </p>
    </motion.div>
  );
}

function Factor({ label, value }: { label: string; value: string }) {
  return (
    <span className="flex flex-col items-center gap-1 rounded-ios-md bg-fill px-2 py-2.5">
      <span className="etched text-[10px]">{label}</span>
      <span className="slot-readout text-[16px]">{value}</span>
    </span>
  );
}

/** Paused panel with resume / restart / quit. */
function PauseOverlay({ onResume, onRestart, onQuit }: { onResume: () => void; onRestart: () => void; onQuit: () => void }) {
  return (
    <motion.div
      key="pause"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      transition={{ type: "spring", stiffness: 320, damping: 26 }}
      className="w-full max-w-sm rounded-ios-2xl border border-separator bg-surface-raised p-6 shadow-modal"
      role="dialog"
      aria-modal="true"
    >
      <h2 className="text-center text-lg font-semibold tracking-tight text-label">Paused</h2>
      <p className="mt-1 text-center text-[13px] text-label-secondary">Take a breath. The board is waiting.</p>
      <div className="mt-5 flex flex-col gap-2">
        <Button variant="primary" size="lg" onClick={onResume}>
          <Play className="h-4 w-4" aria-hidden />
          Resume
        </Button>
        <Button variant="secondary" size="lg" onClick={onRestart}>
          <RotateCcw className="h-4 w-4" aria-hidden />
          Restart board
        </Button>
        <Button variant="ghost" size="lg" onClick={onQuit}>
          <X className="h-4 w-4" aria-hidden />
          Quit to menu
        </Button>
      </div>
    </motion.div>
  );
}

export function Overlays({ onNewGame, onChangeMode, onQuit }: { onNewGame: () => void; onChangeMode: () => void; onQuit: () => void }) {
  const phase = useGameStore((s) => s.phase);
  const resume = useGameStore((s) => s.resume);
  const restart = useGameStore((s) => s.restart);

  const showResult = phase === "won" || phase === "lost";
  const showPause = phase === "paused";

  return (
    <AnimatePresence>
      {showResult ? (
        <Inner>
          <ResultOverlay onNewGame={onNewGame} onChangeMode={onChangeMode} />
        </Inner>
      ) : null}
      {showPause ? (
        <Inner>
          <PauseOverlay onResume={resume} onRestart={restart} onQuit={onQuit} />
        </Inner>
      ) : null}
    </AnimatePresence>
  );
}

function Inner({ children }: { children: ReactNode }) {
  return (
    <motion.div
      className="absolute inset-0 z-20 flex items-center justify-center bg-[var(--scrim)] p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {children}
    </motion.div>
  );
}