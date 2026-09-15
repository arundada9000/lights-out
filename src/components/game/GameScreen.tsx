"use client";

import { useEffect } from "react";
import { useGameStore } from "@/game/useGameStore";
import { useSettingsStore } from "@/game/useSettingsStore";
import { useStatsStore } from "@/game/useStatsStore";
import { useUiBus } from "@/game/uiBus";
import {
  Lightbulb,
  Grid3x3,
  HelpCircle,
  Pause,
  Play,
  Redo2,
  RotateCcw,
  Settings,
  Sparkles,
  Trophy,
  Undo2,
} from "lucide-react";
import { ContextMenu, useBoardContextMenu, type ContextMenuItem } from "@/components/ui/ContextMenu";
import { Board } from "./Board";
import { Hud } from "./Hud";
import { ModeSelect } from "./ModeSelect";
import { SettingsSheet } from "./SettingsSheet";
import { StatsSheet } from "./StatsSheet";
import { HelpSheet } from "./HelpSheet";
import { Overlays } from "./Overlays";

export function GameScreen() {
  const sheet = useUiBus((s) => s.sheet);
  const setSheet = useUiBus((s) => s.setSheet);
  const mode = useGameStore((s) => s.mode);
  const result = useGameStore((s) => s.result);
  const autoNext = useSettingsStore((s) => s.autoNext);

  const boardContext = useBoardContextMenu(() => {
    const gs = useGameStore.getState();
    const g = gs.engine;
    const items: ContextMenuItem[] = [];
    if (g) {
      const running = g.isRunning;
      items.push(
        {
          key: "undo",
          label: "Undo",
          hint: "U",
          icon: <Undo2 className="h-4 w-4" strokeWidth={2.2} aria-hidden />,
          disabled: !g.canUndo,
          onSelect: () => gs.undo(),
        },
        {
          key: "redo",
          label: "Redo",
          icon: <Redo2 className="h-4 w-4" strokeWidth={2.2} aria-hidden />,
          disabled: !g.canRedo,
          onSelect: () => gs.redo(),
        },
        {
          key: "hint",
          label: "Hint",
          hint: "H",
          icon: <Lightbulb className="h-4 w-4" strokeWidth={2.2} aria-hidden />,
          disabled: !g.ruleset.hintsAllowed,
          onSelect: () => gs.hint(),
        }
      );
      items.push({ key: "sep-controls", separator: true, label: "", onSelect: () => {} });
      if (g.phase === "playing") {
        items.push({
          key: "pause",
          label: "Pause",
          hint: "P",
          icon: <Pause className="h-4 w-4" strokeWidth={2.2} aria-hidden />,
          onSelect: () => gs.pause(),
        });
      } else if (g.phase === "paused") {
        items.push({
          key: "resume",
          label: "Resume",
          hint: "P",
          icon: <Play className="h-4 w-4" strokeWidth={2.2} aria-hidden />,
          onSelect: () => gs.resume(),
        });
      }
      items.push(
        {
          key: "restart",
          label: "Restart board",
          hint: "R",
          icon: <RotateCcw className="h-4 w-4" strokeWidth={2.2} aria-hidden />,
          disabled: !running && g.phase === "won",
          onSelect: () => gs.restart(),
        },
        {
          key: "newGame",
          label: "New game",
          icon: <Sparkles className="h-4 w-4" strokeWidth={2.2} aria-hidden />,
          onSelect: () => gs.newGame(),
        }
      );
    }
    items.push({ key: "sep-scene", separator: true, label: "", onSelect: () => {} });
    items.push(
      {
        key: "mode",
        label: "Change mode",
        icon: <Grid3x3 className="h-4 w-4" strokeWidth={2.2} aria-hidden />,
        onSelect: () => useUiBus.getState().setSheet("mode"),
      },
      {
        key: "settings",
        label: "Settings",
        icon: <Settings className="h-4 w-4" strokeWidth={2.2} aria-hidden />,
        onSelect: () => useUiBus.getState().setSheet("settings"),
      },
      {
        key: "stats",
        label: "Progress",
        icon: <Trophy className="h-4 w-4" strokeWidth={2.2} aria-hidden />,
        onSelect: () => useUiBus.getState().setSheet("stats"),
      },
      {
        key: "help",
        label: "Rules and help",
        icon: <HelpCircle className="h-4 w-4" strokeWidth={2.2} aria-hidden />,
        onSelect: () => useUiBus.getState().setSheet("help"),
      }
    );
    return items;
  });

  // Client-only boot: hydrate persisted settings/stats, then continue or deal.
  // Sole effect that owns the 100 ms clock loop. Kept guard-free so React
  // Strict Mode's setup-cleanup-setup cycle re-creates the interval.
  useEffect(() => {
    useSettingsStore.getState().hydrate();
    useStatsStore.getState().hydrate();
    useGameStore.getState().boot();
    const id = window.setInterval(() => {
      useGameStore.getState().tick(100);
    }, 100);
    return () => window.clearInterval(id);
  }, []);

  // Persist the run as it progresses (client-only), one frame after any change.
  useEffect(() => {
    let raf = 0;
    const unsub = useGameStore.subscribe((state, prev) => {
      if (state.revision !== prev.revision || state.phase !== prev.phase) {
        window.cancelAnimationFrame(raf);
        raf = window.requestAnimationFrame(() => useGameStore.getState().saveNow());
      }
    });
    return unsub;
  }, []);

  // Auto-deal the next board shortly after a win when enabled.
  useEffect(() => {
    if (!result?.won || !autoNext) return;
    const t = window.setTimeout(() => {
      useGameStore.getState().newGame();
    }, 1500);
    return () => window.clearTimeout(t);
  }, [result, autoNext]);

  // Pause and persist when the tab loses focus.
  useEffect(() => {
    const onHide = () => {
      const s = useGameStore.getState();
      if (s.phase === "playing") s.pause();
      s.saveNow();
    };
    window.addEventListener("visibilitychange", onHide);
    return () => window.removeEventListener("visibilitychange", onHide);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const gs = useGameStore.getState();
      const tag = (e.target as HTMLElement | null)?.tagName;
      if (tag && (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT")) return;

      if (sheet) {
        if (e.key === "Escape") setSheet(null);
        return;
      }

      switch (e.key) {
        case "m":
        case "M":
          setSheet("mode");
          break;
        case "u":
        case "U":
          gs.undo();
          break;
        case "h":
        case "H":
          gs.hint();
          break;
        case "r":
        case "R":
          gs.restart();
          break;
        case "p":
        case "P": {
          const g = gs.engine;
          if (g && g.phase === "playing") gs.pause();
          else if (g && g.phase === "paused") gs.resume();
          break;
        }
        default: {
          // Number keys act as cell selectors on small grids.
          const g = gs.engine;
          if (g && /^[1-9]$/.test(e.key)) {
            const index = Number(e.key) - 1;
            if (index < g.width * g.height) gs.press(index);
          }
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [sheet, setSheet]);

  const boardBox = "min(92vw, min(52vh, 420px))";

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-2xl flex-col gap-4 px-4 pb-6 pt-4 sm:px-6">
      <Hud
        onOpenMode={() => setSheet("mode")}
        onOpenSettings={() => setSheet("settings")}
        onOpenStats={() => setSheet("stats")}
        onOpenHelp={() => setSheet("help")}
      />

      <div className="relative flex flex-1 flex-col items-center justify-center">
        <div
          className="relative touch-manipulation select-none"
          style={{ width: boardBox, aspectRatio: "1 / 1" }}
          {...boardContext}
        >
          <Board />
          <Overlays
            onNewGame={() => useGameStore.getState().newGame()}
            onChangeMode={() => setSheet("mode")}
            onQuit={() => setSheet("mode")}
          />
        </div>
      </div>

      <footer className="flex items-center justify-center gap-2 pt-1 text-[12px] text-label-tertiary">
        <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent" aria-hidden />
        <span>Easy Lights Out / {mode}</span>
      </footer>

      <ModeSelect open={sheet === "mode"} onClose={() => setSheet(null)} />
      <SettingsSheet open={sheet === "settings"} onClose={() => setSheet(null)} />
      <StatsSheet open={sheet === "stats"} onClose={() => setSheet(null)} mode={mode} />
      <HelpSheet open={sheet === "help"} onClose={() => setSheet(null)} />
      <ContextMenu />
    </main>
  );
}