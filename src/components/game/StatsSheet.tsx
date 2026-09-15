"use client";

import { Check, Flame } from "lucide-react";
import { MODE_LIST, type ModeId } from "@/engine/modes";
import { useStatsStore } from "@/game/useStatsStore";
import { Sheet } from "@/components/ui/Sheet";
import { cn } from "@/lib/cn";

interface StatsSheetProps {
  open: boolean;
  onClose: () => void;
  mode: ModeId;
}

function StatCard({ mode, active, onClick }: { mode: ModeId; active: boolean; onClick: () => void }) {
  const stats = useStatsStore((s) => s.stats[mode]);
  const played = stats?.played ?? 0;
  const won = stats?.won ?? 0;
  const winRate = played > 0 ? Math.round((won / played) * 100) : 0;
  const bestMoves = stats?.bestMoves;
  const bestSeconds = stats?.bestSeconds;

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex w-full cursor-pointer flex-col gap-2.5 rounded-ios-md border px-3 py-3 text-left transition-all duration-200 ease-ios focus-visible:ring-focused",
        active ? "border-accent/50 bg-accent-soft" : "border-separator bg-surface-raised hover:bg-fill"
      )}
    >
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-label">{mode}</span>
        {stats?.lastPlayedStamp ? (
          <span className="text-[11px] text-label-tertiary">{stats.lastPlayedStamp}</span>
        ) : null}
      </div>
      <div className="grid grid-cols-4 gap-2">
        <Metric label="Plays" value={String(played)} />
        <Metric label="Wins" value={String(won)} />
        <Metric label="Win" value={played > 0 ? `${winRate}%` : "-"} />
        <Metric label="Best" value={bestMoves != null ? `${bestMoves} mv` : "-"} />
      </div>
      {bestSeconds != null ? (
        <span className="flex items-center gap-1 text-[11px] text-label-tertiary">
          Fastest win in {bestSeconds}s
        </span>
      ) : null}
    </button>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <span className="flex flex-col">
      <span className="etched text-[9px]">{label}</span>
      <span className="slot-readout mt-0.5 text-[13px]">{value}</span>
    </span>
  );
}

export function StatsSheet({ open, onClose, mode }: StatsSheetProps) {
  const statsByMode = useStatsStore((s) => s.stats);
  const history = useStatsStore((s) => s.dailyHistory);
  const streak = useStatsStore((s) => s.streak());

  const totals = MODE_LIST.reduce(
    (acc, m) => {
      const s = statsByMode[m.id];
      if (!s) return acc;
      return { played: acc.played + s.played, won: acc.won + s.won };
    },
    { played: 0, won: 0 }
  );

  const hasDailyPlay = history.length > 0;

  return (
    <Sheet open={open} onClose={onClose} title="Statistics">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between rounded-ios-md border border-separator bg-surface-raised px-3 py-3">
          <div className="flex flex-col">
            <span className="etched">All time</span>
            <span className="mt-1 text-xl font-semibold tracking-tight text-label">
              {totals.played} <span className="text-sm font-normal text-label-tertiary">plays</span>
            </span>
          </div>
          <div className="flex flex-col items-end">
            <span className="etched">Win rate</span>
            <span className="mt-1 text-xl font-semibold tracking-tight text-accent">
              {totals.played > 0 ? Math.round((totals.won / totals.played) * 100) : 0}%
            </span>
          </div>
        </div>

        {hasDailyPlay ? (
          <div className="rounded-ios-md border border-separator bg-surface-raised px-3 py-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-label">Daily history</span>
              <span className="flex items-center gap-1 text-[12px] font-medium text-accent">
                <Flame className="h-3.5 w-3.5" aria-hidden />
                {streak} day{streak === 1 ? "" : "s"}
              </span>
            </div>
            <div className="mt-2.5 grid grid-cols-7 gap-1">
              {history.slice(0, 14).map((h) => (
                <span
                  key={h.date}
                  title={`${h.date}, ${h.solved ? `${h.moves} moves (${h.optimal} optimal)` : "Unsolved"}`}
                  className={cn(
                    "flex h-7 w-7 items-center justify-center rounded-md text-[11px] font-semibold",
                    h.solved ? "bg-accent text-accent-contrast" : "bg-fill text-label-tertiary"
                  )}
                >
                  {h.solved ? <Check className="h-3 w-3" aria-hidden /> : null}
                </span>
              ))}
            </div>
          </div>
        ) : null}

        <div className="flex flex-col gap-1.5">
          {MODE_LIST.map((m) => (
            <StatCard key={m.id} mode={m.id} active={m.id === mode} onClick={() => onClose()} />
          ))}
        </div>
      </div>
    </Sheet>
  );
}