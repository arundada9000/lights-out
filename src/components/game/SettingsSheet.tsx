"use client";

import { THEMES, ACCENTS, type AccentName, type ThemePreference } from "@/components/theme/theme";
import { useSettingsStore } from "@/game/useSettingsStore";
import { useGameStore } from "@/game/useGameStore";
import { useStatsStore } from "@/game/useStatsStore";
import { clearAll } from "@/game/storage";
import { Sheet } from "@/components/ui/Sheet";
import { Switch } from "@/components/ui/Switch";
import { Segmented } from "@/components/ui/Segmented";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import { Monitor } from "lucide-react";

interface SettingsSheetProps {
  open: boolean;
  onClose: () => void;
}

export function SettingsSheet({ open, onClose }: SettingsSheetProps) {
  const s = useSettingsStore();
  const discardSaved = useGameStore((s) => s.discardSaved);
  const hasSaved = useGameStore((s) => s.savedRun != null);

  const pickTheme = (pref: ThemePreference) => s.setTheme(pref);
  const pickAccent = (a: AccentName) => s.setAccent(a);

  return (
    <Sheet open={open} onClose={onClose} title="Settings">
      <div className="flex flex-col gap-6">
        {/* Appearance */}
        <section className="flex flex-col gap-3">
          <h3 className="etched">Appearance</h3>

          <div className="flex flex-col gap-2">
            <span className="text-[13px] font-medium text-label">Theme</span>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                aria-pressed={s.theme === "system"}
                onClick={() => pickTheme("system")}
                className={cn(
                  "flex cursor-pointer items-center gap-1.5 rounded-full border px-3 py-1.5 text-[12px] font-medium transition-all duration-150 ease-ios focus-visible:ring-focused",
                  s.theme === "system"
                    ? "border-accent bg-accent-soft text-accent"
                    : "border-separator bg-surface-raised text-label-secondary hover:text-label"
                )}
              >
                <Monitor className="h-3.5 w-3.5" aria-hidden /> System
              </button>
              {THEMES.map((t) => {
                const selected = s.theme === t.name;
                return (
                  <button
                    key={t.name}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => pickTheme(t.name)}
                    title={t.note}
                    className={cn(
                      "flex cursor-pointer items-center gap-2 rounded-full border px-2.5 py-1.5 pl-1 transition-all duration-150 ease-ios focus-visible:ring-focused",
                      selected
                        ? "border-accent shadow-[0_0_0_1px_var(--accent)]"
                        : "border-separator bg-surface-raised hover:border-label-tertiary"
                    )}
                  >
                    <span
                      aria-hidden
                      className="h-5 w-5 rounded-full border border-black/10"
                      style={{
                        background: `linear-gradient(145deg, ${t.sample[0]}, ${t.sample[1]})`,
                      }}
                    />
                    <span className={cn("text-[12px] font-medium", selected ? "text-accent" : "text-label-secondary")}>
                      {t.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-[13px] font-medium text-label">Accent</span>
            <div className="flex flex-wrap gap-2">
              {ACCENTS.map((a) => {
                const selected = s.accent === a.name;
                return (
                  <button
                    key={a.name}
                    type="button"
                    aria-label={a.name}
                    aria-pressed={selected}
                    onClick={() => pickAccent(a.name)}
                    className={cn(
                      "h-7 w-7 cursor-pointer rounded-full transition-transform duration-150 ease-ios focus-visible:ring-focused active:scale-90",
                      selected && "scale-110 ring-2 ring-offset-2"
                    )}
                    style={{
                      background: a.color,
                      ...(selected ? { boxShadow: `0 0 0 2px var(--surface), 0 0 0 3px ${a.color}` } : {}),
                    }}
                  />
                );
              })}
            </div>
          </div>
        </section>

        {/* Feedback */}
        <section className="flex flex-col gap-3">
          <h3 className="etched">Feedback</h3>

          <Switch
            checked={s.fxOn}
            onChange={s.setFx}
            label="Sound effects"
            description="Tap pulses, win chime and countdown ticks."
          />
          <Switch
            checked={s.hapticsOn}
            onChange={s.setHaptics}
            label="Haptics"
            description="Subtle vibration on supported devices."
          />

          <div className="flex flex-col gap-2 px-1 pt-1">
            <span className="text-[13px] font-medium text-label">Ambience</span>
            <Segmented
              ariaLabel="Ambience"
              value={s.ambience ?? "none"}
              onChange={(v) => s.setAmbience(v === "none" ? null : (v as "rain" | "fireside"))}
              options={[
                { value: "none", label: "Off" },
                { value: "rain", label: "Rain" },
                { value: "fireside", label: "Fireside" },
              ]}
            />
          </div>

          <Switch
            checked={s.musicOn}
            onChange={s.setMusic}
            label="Ambient music"
            description="Slow, drifting chords behind the board."
          />

          <div className="flex flex-col gap-1.5 px-1 pt-1">
            <div className="flex items-center justify-between">
              <span className="text-[13px] font-medium text-label">Effect volume</span>
              <span className="slot-readout text-[12px] text-label-secondary">
                {Math.round(s.fxVolume * 100)}%
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={s.fxVolume}
              onChange={(e) => s.setVolume(Number(e.target.value))}
              aria-label="Effect volume"
              className="slider-input"
              style={{ ["--slider-fill" as string]: `${Math.round(s.fxVolume * 100)}%` }}
            />
          </div>
        </section>

        {/* Behavior */}
        <section className="flex flex-col gap-3">
          <h3 className="etched">Behavior</h3>

          <Switch
            checked={s.showMoveCount}
            onChange={s.setShowMoveCount}
            label="Move counter"
            description="Show the three-digit move readout."
          />
          <Switch
            checked={s.wobble}
            onChange={s.setWobble}
            label="Press wobble"
            description="A small mechanical dip when a lamp is pressed."
          />
          <Switch
            checked={s.autoNext}
            onChange={s.setAutoNext}
            label="Auto next"
            description="Deal a fresh board shortly after a win."
          />
          <Switch
            checked={s.autoContinue}
            onChange={s.setAutoContinue}
            label="Resume saved runs"
            description="Pick up where you left off on reload."
          />
        </section>

        {/* Data */}
        <section className="flex flex-col gap-3 border-t border-separator pt-4">
          <h3 className="etched">Data</h3>

          {hasSaved ? (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                discardSaved();
              }}
            >
              Discard saved run
            </Button>
          ) : null}

          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              discardSaved();
              s.resetAll();
              useStatsStore.setState({ stats: {}, dailyHistory: [], todayStamp: "" });
              clearAll();
            }}
          >
            Reset everything
          </Button>
        </section>
      </div>
    </Sheet>
  );
}