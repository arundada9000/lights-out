"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { Check, ChevronDown, Monitor } from "lucide-react";
import {
  ACCENT_STORAGE_KEY,
  ACCENTS,
  THEME_STORAGE_KEY,
  THEMES,
  applyThemeToDom,
  normalizeAccent,
  normalizeTheme,
  systemIsDark,
  type AccentName,
  type ThemePreference,
} from "./theme";
import { cn } from "@/lib/cn";

function emptySubscribe() {
  return () => undefined;
}

function SwatchQuad({ colors, dark }: { colors: readonly string[]; dark?: boolean }) {
  return (
    <span
      aria-hidden
      className={cn(
        "grid h-7 w-7 flex-shrink-0 grid-cols-2 overflow-hidden rounded-[7px] ring-1 ring-inset ring-black/10",
        dark && "ring-white/15"
      )}
    >
      {colors.map((c, i) => (
        <span key={i} className="h-full w-full" style={{ backgroundColor: c }} />
      ))}
    </span>
  );
}

export function ThemeSwitcher() {
  const [open, setOpen] = useState(false);
  const [theme, setTheme] = useState<ThemePreference>(() =>
    normalizeTheme(
      typeof window === "undefined" ? null : localStorage.getItem(THEME_STORAGE_KEY)
    )
  );
  const [accent, setAccent] = useState<AccentName>(() =>
    normalizeAccent(
      typeof window === "undefined" ? null : localStorage.getItem(ACCENT_STORAGE_KEY)
    )
  );
  const popRef = useRef<HTMLDivElement>(null);

  const isClient = useSyncExternalStore(emptySubscribe, () => true, () => false);

  const commit = useCallback((pref: ThemePreference, acc: AccentName) => {
    if (typeof window === "undefined") return;
    localStorage.setItem(THEME_STORAGE_KEY, pref);
    localStorage.setItem(ACCENT_STORAGE_KEY, acc);
    setTheme(pref);
    setAccent(acc);
    applyThemeToDom(pref === "system" ? (systemIsDark() ? "slate" : "paper") : pref, acc);
  }, []);

  // Follow OS changes while preferred theme is "system"
  useEffect(() => {
    if (theme !== "system") return;
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => {
      applyThemeToDom(media.matches ? "slate" : "paper", accent);
    };
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, [theme, accent]);

  // Close on outside click / Escape
  useEffect(() => {
    if (!open) return;
    const onPointer = (e: PointerEvent) => {
      if (popRef.current && !popRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const resolved = theme === "system" ? (systemIsDark() ? "slate" : "paper") : theme;
  const activeThemeMeta = THEMES.find((t) => t.name === resolved);

  return (
    <div ref={popRef} className="relative">
      <button
        type="button"
        aria-expanded={open}
        aria-controls="surface-switcher-panel"
        aria-haspopup="dialog"
        onClick={() => setOpen((v) => !v)}
        className="flex h-9 cursor-pointer items-center gap-2 rounded-ios-md border border-separator bg-surface-raised px-2.5 transition-all duration-200 ease-ios hover:bg-fill active:scale-95 focus-visible:ring-focused"
        title="Surface & accent"
      >
        {isClient && activeThemeMeta ? (
          <SwatchQuad colors={activeThemeMeta.sample} dark={activeThemeMeta.dark} />
        ) : (
          <span
            aria-hidden
            className="grid h-7 w-7 flex-shrink-0 grid-cols-2 overflow-hidden rounded-[7px] ring-1 ring-inset ring-black/10"
          />
        )}
        <span
          className="h-2 w-2 rounded-full ring-1 ring-inset ring-black/10"
          style={{
            backgroundColor: isClient
              ? ACCENTS.find((a) => a.name === accent)?.color
              : "#fbbf24",
          }}
        />
        <ChevronDown
          className={cn("h-3.5 w-3.5 text-label-tertiary transition-transform duration-200", open && "rotate-180")}
        />
      </button>

      {open ? (
        <div
          id="surface-switcher-panel"
          role="dialog"
          aria-label="Surface and accent picker"
          className="absolute right-0 top-full z-50 mt-2 w-[15.5rem] rounded-ios-xl border border-separator bg-surface shadow-modal"
        >
          <div className="flex flex-col gap-3 p-3">
            <div>
              <p className="etched mb-2 flex items-center gap-1.5 px-1 text-[10px]">
                <span aria-hidden className="led" />
                Surface
              </p>
              <div role="radiogroup" aria-label="Surface theme" className="flex flex-col gap-1">
                {THEMES.map((t) => {
                  const active = resolved === t.name;
                  return (
                    <button
                      key={t.name}
                      type="button"
                      role="radio"
                      aria-checked={active}
                      onClick={() => commit(t.name, accent)}
                      className={cn(
                        "flex cursor-pointer items-center gap-2.5 rounded-ios-md px-2.5 py-1.5 text-left transition-colors duration-200 ease-ios hover:bg-fill focus-visible:ring-focused",
                        active && "bg-accent-soft"
                      )}
                    >
                      <SwatchQuad colors={t.sample} dark={t.dark} />
                      <span className="flex flex-col">
                        <span
                          className={cn(
                            "text-[13px] font-semibold tracking-tight text-label",
                            active && "text-accent"
                          )}
                        >
                          {t.label}
                        </span>
                        <span className="text-[11px] text-label-tertiary">{t.note}</span>
                      </span>
                      {active ? (
                        <Check className="ml-auto h-3.5 w-3.5 text-accent" aria-hidden />
                      ) : null}
                    </button>
                  );
                })}
                <button
                  type="button"
                  role="radio"
                  aria-checked={theme === "system"}
                  onClick={() => commit("system", accent)}
                  className={cn(
                    "flex cursor-pointer items-center gap-2.5 rounded-ios-md px-2.5 py-1.5 text-left transition-colors duration-200 ease-ios hover:bg-fill focus-visible:ring-focused",
                    theme === "system" && "bg-accent-soft"
                  )}
                >
                  <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-[7px] bg-fill text-label-secondary">
                    <Monitor className="h-3.5 w-3.5" aria-hidden />
                  </span>
                  <span className="flex flex-col">
                    <span
                      className={cn(
                        "text-[13px] font-semibold tracking-tight text-label",
                        theme === "system" && "text-accent"
                      )}
                    >
                      System
                    </span>
                    <span className="text-[11px] text-label-tertiary">Follows device</span>
                  </span>
                  {theme === "system" ? (
                    <Check className="ml-auto h-3.5 w-3.5 text-accent" aria-hidden />
                  ) : null}
                </button>
              </div>
            </div>

            <div className="mx-1 border-t border-separator" />

            <div>
              <p className="etched mb-2 flex items-center gap-1.5 px-1 text-[10px]">
                <span aria-hidden className="led" />
                Accent
              </p>
              <div className="grid grid-cols-6 gap-2 px-1">
                {ACCENTS.map((a) => {
                  const active = accent === a.name;
                  return (
                    <button
                      key={a.name}
                      type="button"
                      aria-label={`Accent ${a.name}`}
                      title={a.name}
                      onClick={() => commit(theme, a.name)}
                      className={cn(
                        "flex h-6 w-6 cursor-pointer items-center justify-center rounded-full transition-all duration-200 ease-ios hover:scale-110 active:scale-95 focus-visible:ring-focused",
                        active && "ring-2 ring-offset-1 ring-offset-surface"
                      )}
                      style={{
                        backgroundColor: a.color,
                        boxShadow: active ? `0 0 0 2px ${a.color}` : undefined,
                      }}
                    >
                      {active ? (
                        <span className="h-1.5 w-1.5 rounded-full bg-white/90" aria-hidden />
                      ) : null}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}