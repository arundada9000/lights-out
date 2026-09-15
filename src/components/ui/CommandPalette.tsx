"use client";

/**
 * Command palette (plan.md: custom, on-brand). Cmd/Ctrl+K anywhere. Fast fuzzy
 * search across navigation, game modes, board controls, sheets and appearance,
 * driven by the same stores the game uses. Router navigation, mode dealing and
 * sheet opening all stay store-first so the palette works across the app.
 */

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowRight,
  CircleHelp,
  Command,
  Compass,
  Gamepad2,
  Grid3x3,
  Home,
  LayoutGrid,
  Lightbulb,
  Moon,
  Palette,
  Pause,
  Play,
  Redo2,
  RotateCcw,
  Search,
  Settings,
  Sparkles,
  Sun,
  Trophy,
  Undo2,
} from "lucide-react";
import { MODE_LIST, presetsFor } from "@/engine/modes";
import { ACCENTS, type ThemePreference } from "@/components/theme/theme";
import { useGameStore } from "@/game/useGameStore";
import { useSettingsStore } from "@/game/useSettingsStore";
import { useUiBus } from "@/game/uiBus";
import { cn } from "@/lib/cn";

interface Command {
  id: string;
  group: string;
  label: string;
  sub?: string;
  keywords?: string;
  icon: ReactNode;
  hint?: string;
  run: () => void;
}

function NoIcon({ className, ariaHidden }: { className?: string; ariaHidden?: boolean }) {
  return <span className={className} aria-hidden={ariaHidden ?? true} />;
}

export function CommandPalette() {
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const openPalette = () => {
    setQuery("");
    setActive(0);
    setOpen(true);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (open) setOpen(false);
        else openPalette();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const t = window.setTimeout(() => inputRef.current?.focus(), 30);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.clearTimeout(t);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const commands = useMemo<Command[]>(() => {
    const onPlay = pathname === "/play";
    const list: Command[] = [];

    // Navigation
    list.push(
      { id: "nav-home", group: "Navigate", label: "Home", sub: "The control surface", icon: <Home className="h-4 w-4" strokeWidth={2.2} aria-hidden />, hint: "/", run: () => router.push("/") },
      { id: "nav-play", group: "Navigate", label: "Play", sub: "The game", icon: <Gamepad2 className="h-4 w-4" strokeWidth={2.2} aria-hidden />, hint: "/play", run: () => router.push("/play") },
      { id: "nav-guides", group: "Navigate", label: "Guides", sub: "How to play, strategies, engine", icon: <Compass className="h-4 w-4" strokeWidth={2.2} aria-hidden />, run: () => router.push("/guides") },
      { id: "nav-howto", group: "Navigate", label: "How to Play", sub: "The one-line rule", icon: <CircleHelp className="h-4 w-4" strokeWidth={2.2} aria-hidden />, run: () => router.push("/guides/how-to-play") }
    );

    // Modes (deals immediately through the global store)
    for (const m of MODE_LIST) {
      const preset = presetsFor(m.id)[0];
      list.push({
        id: `mode-${m.id}`,
        group: "Start a game",
        label: m.name,
        sub: preset ? `${preset.label} - ${preset.sub ?? m.tagline}` : m.tagline,
        icon: <Grid3x3 className="h-4 w-4" strokeWidth={2.2} aria-hidden />,
        keywords: `${m.tagline} ${m.description}`,
        hint: onPlay ? undefined : "Play",
        run: () => {
          const gs = useGameStore.getState();
          gs.selectMode(m.id);
          gs.newGame(m.id, presetsFor(m.id)[0]?.id);
          if (pathname !== "/play") router.push("/play");
        },
      });
    }

    // Board controls, only meaningful on the play scene
    if (onPlay) {
      const gs = useGameStore.getState();
      const g = gs.engine;
      const running = g && (g.phase === "ready" || g.phase === "playing");
      list.push(
        { id: "new-game", group: "Board", label: "New game", sub: "Deal a fresh board", icon: <Sparkles className="h-4 w-4" strokeWidth={2.2} aria-hidden />, run: () => gs.newGame() },
        { id: "restart", group: "Board", label: "Restart board", sub: "Reset this puzzle", icon: <RotateCcw className="h-4 w-4" strokeWidth={2.2} aria-hidden />, hint: "R", run: () => gs.restart() },
        { id: "undo", group: "Board", label: "Undo", icon: <Undo2 className="h-4 w-4" strokeWidth={2.2} aria-hidden />, hint: "U", keywords: "step back", run: () => gs.undo() },
        { id: "redo", group: "Board", label: "Redo", icon: <Redo2 className="h-4 w-4" strokeWidth={2.2} aria-hidden />, keywords: "step forward", run: () => gs.redo() },
        { id: "hint", group: "Board", label: "Hint", sub: "Reveal the next move", icon: <Lightbulb className="h-4 w-4" strokeWidth={2.2} aria-hidden />, hint: "H", run: () => gs.hint() }
      );
      if (running) {
        list.push({ id: "pause", group: "Board", label: "Pause", icon: <Pause className="h-4 w-4" strokeWidth={2.2} aria-hidden />, hint: "P", run: () => gs.pause() });
      } else if (g?.phase === "paused") {
        list.push({ id: "resume", group: "Board", label: "Resume", icon: <Play className="h-4 w-4" strokeWidth={2.2} aria-hidden />, hint: "P", run: () => gs.resume() });
      }
      list.push(
        { id: "scene-mode", group: "Panels", label: "Choose a mode", icon: <LayoutGrid className="h-4 w-4" strokeWidth={2.2} aria-hidden />, run: () => useUiBus.getState().setSheet("mode") },
        { id: "scene-settings", group: "Panels", label: "Settings", icon: <Settings className="h-4 w-4" strokeWidth={2.2} aria-hidden />, run: () => useUiBus.getState().setSheet("settings") },
        { id: "scene-stats", group: "Panels", label: "Progress", sub: "Records and streaks", icon: <Trophy className="h-4 w-4" strokeWidth={2.2} aria-hidden />, run: () => useUiBus.getState().setSheet("stats") },
        { id: "scene-help", group: "Panels", label: "Rules", icon: <CircleHelp className="h-4 w-4" strokeWidth={2.2} aria-hidden />, run: () => useUiBus.getState().setSheet("help") }
      );
    }

    // Appearance
    const themes: { id: string; pref: ThemePreference; label: string; icon: ReactNode }[] = [
      { id: "theme-system", pref: "system", label: "Match system", icon: <NoIcon className="h-4 w-4" /> },
      { id: "theme-light", pref: "paper", label: "Paper (light)", icon: <Sun className="h-4 w-4" strokeWidth={2.2} aria-hidden /> },
      { id: "theme-dark", pref: "slate", label: "Slate (dark)", icon: <Moon className="h-4 w-4" strokeWidth={2.2} aria-hidden /> },
    ];
    for (const t of themes) {
      list.push({ id: t.id, group: "Appearance", label: t.label, icon: t.icon, keywords: "theme", run: () => useSettingsStore.getState().setTheme(t.pref) });
    }
    for (const a of ACCENTS) {
      list.push({ id: `accent-${a.name}`, group: "Accent", label: `Accent: ${a.name}`, icon: <Palette className="h-4 w-4" strokeWidth={2.2} aria-hidden />, run: () => useSettingsStore.getState().setAccent(a.name) });
    }

    return list;
  }, [pathname, router]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return commands;
    return commands.filter((c) =>
      `${c.label} ${c.sub ?? ""} ${c.keywords ?? ""} ${c.group}`.toLowerCase().includes(q)
    );
  }, [commands, query]);

  const groups = useMemo(() => {
    const order: string[] = [];
    const map: Record<string, Command[]> = {};
    for (const c of filtered) {
      if (!order.includes(c.group)) order.push(c.group);
      (map[c.group] ??= []).push(c);
    }
    return order.map((name) => ({ name, items: map[name] }));
  }, [filtered]);

  const total = filtered.length;
  const displayActive = total > 0 ? Math.max(0, Math.min(active, total - 1)) : 0;

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActive((a) => (total > 0 ? (Math.max(0, Math.min(a, total - 1)) + 1) % total : 0));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActive((a) => (total > 0 ? (Math.max(0, Math.min(a, total - 1)) - 1 + total) % total : 0));
      } else if (e.key === "Enter") {
        e.preventDefault();
        const c = filtered[displayActive];
        if (c) {
          setOpen(false);
          c.run();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, total, displayActive, filtered]);

  return (
    <AnimatePresence>
      {open ? (
        <div className="fixed inset-0 z-[65] flex items-start justify-center pt-[14vh]">
          <motion.button
            type="button"
            aria-label="Close command palette"
            className="absolute inset-0 h-full w-full cursor-default bg-[var(--scrim)]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={() => setOpen(false)}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Command palette"
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 420, damping: 34 }}
            className="relative flex max-h-[60vh] w-[min(560px,calc(100vw-2rem))] flex-col overflow-hidden rounded-ios-xl border border-separator bg-surface-raised shadow-modal">
            <div className="flex items-center gap-3 border-b border-separator px-4 py-3.5">
              <Search className="h-[18px] w-[18px] shrink-0 text-label-tertiary" strokeWidth={2.2} aria-hidden />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setActive(0);
                }}
                placeholder="Search commands, modes, themes"
                aria-label="Search commands"
                spellCheck={false}
                autoComplete="off"
                className="h-6 w-full bg-transparent text-[15px] text-label outline-none placeholder:text-label-tertiary"
              />
              <kbd className="flex shrink-0 items-center gap-1 rounded-ios-sm border border-separator bg-fill px-1.5 py-0.5 text-[11px] font-medium text-label-tertiary">
                <Command className="h-3 w-3" aria-hidden />
                K
              </kbd>
            </div>

            <div role="listbox" aria-label="Commands" className="flex-1 overflow-y-auto overscroll-contain">
              {groups.length === 0 ? (
                <p className="px-4 py-8 text-center text-[13px] text-label-secondary">
                  No commands match your search.
                </p>
              ) : (
                groups.map((g) => (
                  <div key={g.name} className="py-2">
                    <p className="px-4 pb-1.5 pt-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-label-tertiary">
                      {g.name}
                    </p>
                    {g.items.map((c) => {
                      const idx = filtered.indexOf(c);
                      const isActive = idx === active;
                      return (
                        <button
                          key={c.id}
                          type="button"
                          role="option"
                          aria-selected={isActive}
                          onMouseEnter={() => setActive(idx)}
                          onClick={() => {
                            setOpen(false);
                            c.run();
                          }}
                          className={cn(
                            "flex w-full items-center gap-3 px-4 py-2.5 text-left text-[13.5px] transition-colors duration-100 ease-ios",
                            isActive ? "bg-accent-soft/70 text-label" : "text-label-secondary"
                          )}
                        >
                          <span
                            className={cn(
                              "flex h-6 w-6 shrink-0 items-center justify-center rounded-ios-sm",
                              isActive ? "bg-accent/15 text-accent" : "bg-fill text-label-tertiary"
                            )}
                          >
                            {c.icon}
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block truncate font-medium text-label">{c.label}</span>
                            {c.sub ? <span className="block truncate text-[11.5px] text-label-tertiary">{c.sub}</span> : null}
                          </span>
                          {c.hint ? (
                            <span className="flex shrink-0 items-center gap-1 text-[11px] font-medium text-label-tertiary">
                              {c.hint}
                              <ArrowRight className="h-3 w-3" aria-hidden />
                            </span>
                          ) : null}
                        </button>
                      );
                    })}
                  </div>
                ))
              )}
            </div>
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>
  );
}