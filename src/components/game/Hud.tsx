"use client";

import type { ReactNode } from "react";
import { ChevronDown, ChartColumn, CircleHelp, Lightbulb, Pause, Play, RotateCcw, Settings, Undo2 } from "lucide-react";
import { useGameStore } from "@/game/useGameStore";
import { useSettingsStore } from "@/game/useSettingsStore";
import { getMode, getPreset } from "@/engine/modes";
import { formatDuration, padSlots, todayLabel } from "@/lib/time";
import { cn } from "@/lib/cn";
import { Tooltip } from "@/components/ui/Tooltip";

interface HudProps {
  onOpenMode: () => void;
  onOpenSettings: () => void;
  onOpenStats: () => void;
  onOpenHelp: () => void;
}

function IconButton({
  label,
  onClick,
  disabled,
  danger,
  children,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  danger?: boolean;
  children: ReactNode;
}) {
  return (
    <Tooltip label={label}>
      <button
        type="button"
        aria-label={label}
        disabled={disabled}
        onClick={onClick}
        className={cn(
          "flex h-9 w-9 cursor-pointer items-center justify-center rounded-full transition-all duration-150 ease-ios active:scale-90 focus-visible:ring-focused disabled:cursor-default disabled:opacity-30",
          danger ? "text-danger hover:bg-danger/10" : "text-label-secondary hover:bg-fill hover:text-label"
        )}
      >
        {children}
      </button>
    </Tooltip>
  );
}

export function Hud({ onOpenMode, onOpenSettings, onOpenStats, onOpenHelp }: HudProps) {
  const engine = useGameStore((s) => s.engine);
  const revision = useGameStore((s) => s.revision);
  const phase = useGameStore((s) => s.phase);
  const clock = useGameStore((s) => s.clock);
  const mode = useGameStore((s) => s.mode);
  const presetId = useGameStore((s) => s.presetId);
  const undo = useGameStore((s) => s.undo);
  const redo = useGameStore((s) => s.redo);
  const restart = useGameStore((s) => s.restart);
  const hint = useGameStore((s) => s.hint);
  const pause = useGameStore((s) => s.pause);
  const resume = useGameStore((s) => s.resume);
  const showMoveCount = useSettingsStore((s) => s.showMoveCount);
  void revision;

  if (!engine) return null;

  const modeDef = getMode(mode);
  const preset = getPreset(mode, presetId);
  const timeLimit = engine.ruleset.timeLimitMs;
  const elapsed = phase === "paused" ? engine.elapsedMs : clock;

  const timerLabel =
    engine.ruleset.timer === "count-down" && timeLimit != null
      ? formatDuration(Math.max(0, timeLimit - elapsed))
      : formatDuration(elapsed);
  const low = engine.ruleset.timer === "count-down" && timeLimit != null && timeLimit - elapsed <= 10_000;

  const showUndo = engine.ruleset.undoAllowed;
  const showHint = engine.ruleset.hintsAllowed;
  const running = phase === "ready" || phase === "playing";
  const paused = phase === "paused";
  const movesSlots = padSlots(engine.moves);

  return (
    <div className="flex w-full flex-col gap-3">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={onOpenMode}
          className="group flex cursor-pointer items-center gap-1.5 rounded-ios-md px-1 py-1 text-left transition-colors duration-200 ease-ios hover:bg-fill focus-visible:ring-focused"
          aria-label={`Mode: ${modeDef.name}. Change mode.`}
        >
          <span className="flex flex-col leading-none">
            <span className="text-[15px] font-semibold tracking-tight text-label">{modeDef.name}</span>
            <span className="mt-0.5 text-[11px] font-medium uppercase tracking-[0.14em] text-label-tertiary">
              {mode === "daily" ? todayLabel() : preset?.label ?? "-"}
            </span>
          </span>
          <ChevronDown className="h-3.5 w-3.5 text-label-tertiary transition-transform duration-200 ease-ios group-hover:translate-y-0.5" aria-hidden />
        </button>

        <div className="flex items-center gap-1">
          <IconButton label="Help" onClick={onOpenHelp}>
            <CircleHelp className="h-[18px] w-[18px]" strokeWidth={2} aria-hidden />
          </IconButton>
          <IconButton label="Statistics" onClick={onOpenStats}>
            <ChartColumn className="h-[18px] w-[18px]" strokeWidth={2} aria-hidden />
          </IconButton>
          <IconButton label="Settings" onClick={onOpenSettings}>
            <Settings className="h-[18px] w-[18px]" strokeWidth={2} aria-hidden />
          </IconButton>
        </div>
      </div>

      {/* Mode tagline / goal hint */}
      <div className="flex items-center justify-between gap-3 text-[12px] text-label-secondary">
        <span className="truncate">{modeDef.tagline}</span>
        {engine.ruleset.target.kind !== "all-off" ? (
          <span className="flex shrink-0 items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-accent shadow-[0_0_6px_var(--accent)]" aria-hidden />
            <span className="font-medium">Match the goal grid</span>
          </span>
        ) : null}
      </div>

      {/* Status strip */}
      <div className="flex items-center justify-between gap-2 rounded-ios-lg border border-separator bg-surface-raised px-3 py-2 shadow-card">
        <div className="flex items-center gap-2">
          <span className="etched">Moves</span>
          {showMoveCount ? (
            <span className="flex gap-[3px]" aria-live="polite">
              {movesSlots.map((d, i) => (
                <span
                  key={i}
                  aria-hidden={i > 0}
                  className={cn(
                    "flex h-7 w-5 items-center justify-center rounded-[6px] border border-separator bg-fill font-mono text-[13px] font-bold tabular-nums",
                    i > 0 ? "text-label-secondary" : "text-label"
                  )}
                >
                  {d}
                </span>
              ))}
            </span>
          ) : (
            <span className="slot-readout text-[15px]">{engine.moves}</span>
          )}
        </div>

        <div className="flex items-center gap-1">
          {modeDef.timer !== "none" ? (
            <span
              className={cn(
                "slot-readout font-mono text-[15px]",
                low ? "text-danger" : "text-label"
              )}
              aria-live="polite"
              aria-label={engine.ruleset.timer === "count-down" ? "Time remaining" : "Elapsed time"}
            >
              {timerLabel}
            </span>
          ) : null}
        </div>

        <div className="flex items-center gap-0.5">
          {showUndo ? (
            <>
              <IconButton label="Undo (U)" onClick={undo} disabled={!engine.canUndo}>
                <Undo2 className="h-4 w-4" strokeWidth={2.2} aria-hidden />
              </IconButton>
              <IconButton label="Redo (Shift+Z)" onClick={redo} disabled={!engine.canRedo}>
                <RotateCcw className="h-4 w-4 -scale-x-100" strokeWidth={2.2} aria-hidden />
              </IconButton>
            </>
          ) : null}
          {showHint ? (
            <IconButton label="Hint (H)" onClick={hint} disabled={!engine.canHint}>
              <Lightbulb className="h-4 w-4" strokeWidth={2.2} aria-hidden />
            </IconButton>
          ) : null}
          {running ? (
            <IconButton label="Pause (P)" onClick={pause}>
              <Pause className="h-4 w-4" strokeWidth={2.2} aria-hidden />
            </IconButton>
          ) : null}
          {paused ? (
            <IconButton label="Resume (P)" onClick={resume}>
              <Play className="h-4 w-4" strokeWidth={2.2} aria-hidden />
            </IconButton>
          ) : null}
          <IconButton label="Restart (R)" onClick={restart}>
            <RotateCcw className="h-4 w-4" strokeWidth={2.2} aria-hidden />
          </IconButton>
        </div>
      </div>
    </div>
  );
}