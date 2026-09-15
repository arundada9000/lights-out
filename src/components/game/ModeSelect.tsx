"use client";

import { useMemo, useState } from "react";
import { CalendarDays, Clock, Gauge, Timer, Trophy } from "lucide-react";
import { MODE_LIST, presetsFor, type ModeId } from "@/engine/modes";
import { useGameStore } from "@/game/useGameStore";
import { useStatsStore } from "@/game/useStatsStore";
import { Sheet } from "@/components/ui/Sheet";
import { Segmented } from "@/components/ui/Segmented";
import { Button } from "@/components/ui/Button";
import { todayLabel } from "@/lib/time";
import { cn } from "@/lib/cn";

const MODE_META: Record<ModeId, { icon: typeof Clock; tag: string }> = {
  classic: { icon: Clock, tag: "Any size" },
  pattern: { icon: Timer, tag: "Goal grid" },
  daily: { icon: CalendarDays, tag: "Today" },
  minimum: { icon: Gauge, tag: "Scored" },
  timed: { icon: Timer, tag: "Countdown" },
  zen: { icon: Trophy, tag: "No pressure" },
};

interface ModeSelectProps {
  open: boolean;
  onClose: () => void;
}

export function ModeSelect({ open, onClose }: ModeSelectProps) {
  const currentMode = useGameStore((s) => s.mode);
  const currentPreset = useGameStore((s) => s.presetId);
  const selectMode = useGameStore((s) => s.selectMode);
  const selectPreset = useGameStore((s) => s.selectPreset);
  const newGame = useGameStore((s) => s.newGame);
  const streak = useStatsStore((s) => s.streak());
  const dailySolved = useStatsStore((s) =>
    s.dailyHistory.find((h) => h.date === s.todayStamp)?.solved ?? undefined
  );

  const [mode, setMode] = useState<ModeId>(currentMode);
  const [preset, setPreset] = useState<string>(currentPreset);

  const presets = useMemo(() => presetsFor(mode), [mode]);

  const start = () => {
    selectMode(mode);
    selectPreset(mode, preset);
    newGame(mode, preset);
    onClose();
  };

  const isCurrent = mode === currentMode && preset === currentPreset;

  return (
    <Sheet open={open} onClose={onClose} title="Choose a mode">
      <div className="flex flex-col gap-4">
        {/* Daily echo */}
        {mode === "daily" ? (
          <div className="flex items-center justify-between rounded-ios-md border border-accent/30 bg-accent-soft px-3 py-2.5">
            <div className="flex flex-col">
              <span className="text-[13px] font-semibold text-label">{todayLabel()}</span>
              <span className="text-[12px] text-label-secondary">
                {dailySolved
                  ? "Solved today. Streak preserved."
                  : streak > 0
                    ? `${streak} day streak going`
                    : "One deterministic board for everyone"}
              </span>
            </div>
            <CalendarDays className="h-4 w-4 text-accent" aria-hidden />
          </div>
        ) : null}

        {/* Mode rows */}
        <div role="radiogroup" aria-label="Game mode" className="flex flex-col gap-1.5">
          {MODE_LIST.map((m) => {
            const meta = MODE_META[m.id];
            const Icon = meta.icon;
            const selected = mode === m.id;
            return (
              <button
                key={m.id}
                type="button"
                role="radio"
                aria-checked={selected}
                onClick={() => {
                  setMode(m.id);
                  const first = presetsFor(m.id)[0];
                  if (first) setPreset(first.id);
                }}
                className={cn(
                  "flex cursor-pointer items-center gap-3 rounded-ios-md border px-3 py-2.5 text-left transition-all duration-200 ease-ios focus-visible:ring-focused",
                  selected
                    ? "border-accent/50 bg-accent-soft"
                    : "border-separator bg-surface-raised hover:bg-fill"
                )}
              >
                <span
                  className={cn(
                    "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
                    selected ? "bg-accent text-accent-contrast" : "bg-fill text-label-secondary"
                  )}
                >
                  <Icon className="h-4 w-4" strokeWidth={2} aria-hidden />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-semibold text-label">{m.name}</span>
                  <span className="block truncate text-[12px] text-label-secondary">{m.tagline}</span>
                </span>
                <span className="shrink-0 text-[11px] font-semibold uppercase tracking-[0.12em] text-label-tertiary">
                  {meta.tag}
                </span>
              </button>
            );
          })}
        </div>

        {/* Presets */}
        <div className="flex flex-col gap-2">
          <span className="etched">Board</span>
          <Segmented<string>
            ariaLabel={`Preset for ${mode}`}
            value={preset}
            onChange={setPreset}
            options={presets.slice(0, 5).map((p) => ({
              value: p.id,
              label: p.label,
              sub: p.sub,
            }))}
          />
        </div>

        <Button variant="primary" size="lg" className="mt-1" onClick={start}>
          {isCurrent ? `Play again, fresh ${presets.find((p) => p.id === preset)?.label ?? "board"}` : "Start game"}
        </Button>
      </div>
    </Sheet>
  );
}