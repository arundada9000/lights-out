"use client";

import { useEffect, useState } from "react";
import {
  ACCENT_STORAGE_KEY,
  ACCENTS,
  THEME_STORAGE_KEY,
  THEMES,
  applyThemeToDom,
  normalizeAccent,
  normalizeTheme,
  resolveTheme,
  systemIsDark,
  type AccentName,
  type ThemeName,
} from "@/components/theme/theme";
import { cn } from "@/lib/cn";

/**
 * Landing-page "Own the instrument" rack: taps a surface or accent and the
 * whole page re-tunes instantly. Active state starts unset so server and
 * hydration renders agree, then syncs from storage after mount.
 */
export function SurfaceRack() {
  const [activeTheme, setActiveTheme] = useState<ThemeName | null>(null);
  const [activeAccent, setActiveAccent] = useState<AccentName | null>(null);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      const pref = normalizeTheme(localStorage.getItem(THEME_STORAGE_KEY));
      setActiveTheme(resolveTheme(pref, systemIsDark()));
      setActiveAccent(normalizeAccent(localStorage.getItem(ACCENT_STORAGE_KEY)));
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  const setTheme = (name: ThemeName) => {
    const accent = normalizeAccent(localStorage.getItem(ACCENT_STORAGE_KEY));
    localStorage.setItem(THEME_STORAGE_KEY, name);
    applyThemeToDom(name, accent);
    setActiveTheme(name);
  };

  const setAccent = (name: AccentName) => {
    const pref = normalizeTheme(localStorage.getItem(THEME_STORAGE_KEY));
    const resolved = resolveTheme(pref, systemIsDark());
    localStorage.setItem(ACCENT_STORAGE_KEY, name);
    applyThemeToDom(resolved, name);
    setActiveAccent(name);
  };

  return (
    <div className="relative overflow-hidden rounded-ios-2xl border border-separator bg-surface-raised shadow-raised">
      <div className="pointer-events-none absolute inset-0 blueprint-grid opacity-40" aria-hidden />

      <div className="relative flex flex-col gap-6 p-6 sm:p-8">
        <div>
          <p className="etched mb-3 flex items-center gap-1.5 text-[10px]">
            <span aria-hidden className="led" />
            Surface <span className="ml-1 hidden text-label-tertiary sm:inline">08 available</span>
          </p>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {THEMES.map((t) => {
              const active = activeTheme === t.name;
              return (
                <button
                  key={t.name}
                  type="button"
                  data-rack-theme={t.name}
                  data-active={active ? "true" : "false"}
                  onClick={() => setTheme(t.name)}
                  aria-pressed={active}
                  className={cn(
                    "group flex cursor-pointer items-center gap-2.5 rounded-ios-lg border px-3 py-2.5 text-left transition-all duration-200 ease-ios hover:-translate-y-0.5 hover:shadow-card focus-visible:ring-focused",
                    "border-separator bg-surface data-[active=true]:border-accent/60 data-[active=true]:bg-accent-soft"
                  )}
                >
                  <span
                    aria-hidden
                    className="grid h-8 w-8 flex-shrink-0 grid-cols-2 overflow-hidden rounded-[8px] ring-1 ring-inset ring-black/10"
                  >
                    {t.sample.map((c, i) => (
                      <span key={i} style={{ backgroundColor: c }} />
                    ))}
                  </span>
                  <span className="flex flex-col">
                    <span className="text-[13px] font-semibold tracking-tight text-label transition-colors duration-200 group-data-[active=true]:text-accent">
                      {t.label}
                    </span>
                    <span className="text-[11px] text-label-tertiary">{t.note}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="border-t border-separator" />

        <div>
          <p className="etched mb-3 flex items-center gap-1.5 text-[10px]">
            <span aria-hidden className="led" />
            Accent <span className="ml-1 hidden text-label-tertiary sm:inline">12 available</span>
          </p>
          <div className="flex flex-wrap gap-2">
            {ACCENTS.map((a) => {
              const active = activeAccent === a.name;
              return (
                <button
                  key={a.name}
                  type="button"
                  data-rack-accent={a.name}
                  data-active={active ? "true" : "false"}
                  onClick={() => setAccent(a.name)}
                  aria-label={`Accent ${a.name}`}
                  aria-pressed={active}
                  title={a.name}
                  className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full transition-all duration-200 ease-ios hover:scale-110 active:scale-95 focus-visible:ring-focused data-[active=true]:ring-2 data-[active=true]:ring-offset-2 data-[active=true]:ring-offset-surface-raised"
                  style={{ backgroundColor: a.color }}
                >
                  <span
                    className="h-1.5 w-1.5 rounded-full bg-white/90 opacity-0 transition-opacity duration-200 data-[active=true]:opacity-100"
                    style={{ boxShadow: "0 0 0 1px rgba(0,0,0,0.2)" }}
                    aria-hidden
                  />
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}