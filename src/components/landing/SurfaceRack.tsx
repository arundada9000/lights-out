"use client";

import { ACCENTS, THEMES, applyThemeToDom, normalizeAccent, normalizeTheme } from "@/components/theme/theme";
import { cn } from "@/lib/cn";

/**
 * Landing-page "Own the instrument" rack: taps a surface or accent and the
 * whole page re-tunes instantly. Active state is driven by data attributes
 * the click handlers mutate directly, so the rack stays in sync with the DOM.
 */
export function SurfaceRack() {
  const setTheme = (name: (typeof THEMES)[number]["name"]) => {
    const accent = normalizeAccent(localStorage.getItem("elo-accent"));
    localStorage.setItem("elo-theme", name);
    applyThemeToDom(name, accent);
    document.querySelectorAll("[data-rack-theme]").forEach((el) => {
      const active = el.getAttribute("data-rack-theme") === name;
      el.setAttribute("data-active", active ? "true" : "false");
    });
  };

  const setAccent = (name: (typeof ACCENTS)[number]["name"]) => {
    const theme = normalizeTheme(localStorage.getItem("elo-theme"));
    const resolved =
      theme === "system"
        ? window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "slate"
          : "paper"
        : theme;
    localStorage.setItem("elo-accent", name);
    applyThemeToDom(resolved, name);
    document.querySelectorAll("[data-rack-accent]").forEach((el) => {
      el.setAttribute("data-active", el.getAttribute("data-rack-accent") === name ? "true" : "false");
    });
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
            {THEMES.map((t) => (
              <button
                key={t.name}
                type="button"
                data-rack-theme={t.name}
                data-active="false"
                onClick={() => setTheme(t.name)}
                aria-pressed="false"
                className={cn(
                  "group flex cursor-pointer items-center gap-2.5 rounded-ios-lg border px-3 py-2.5 text-left transition-all duration-200 ease-ios hover:-translate-y-0.5 hover:shadow-card focus-visible:ring-focused",
                  "border-separator bg-surface data-[active=true]:border-accent/60 data-[active=true]:bg-accent-soft"
                )}
              >
                <span
                  aria-hidden
                  className="grid h-8 w-8 flex-shrink-0 grid-cols-2 overflow-hidden rounded-[8px] ring-1 ring-inset ring-black/10"
                >
                  {t.sample.map((c) => (
                    <span key={c} style={{ backgroundColor: c }} />
                  ))}
                </span>
                <span className="flex flex-col">
                  <span className="text-[13px] font-semibold tracking-tight text-label transition-colors duration-200 group-data-[active=true]:text-accent">
                    {t.label}
                  </span>
                  <span className="text-[11px] text-label-tertiary">{t.note}</span>
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="border-t border-separator" />

        <div>
          <p className="etched mb-3 flex items-center gap-1.5 text-[10px]">
            <span aria-hidden className="led" />
            Accent <span className="ml-1 hidden text-label-tertiary sm:inline">12 available</span>
          </p>
          <div className="flex flex-wrap gap-2">
            {ACCENTS.map((a) => (
              <button
                key={a.name}
                type="button"
                data-rack-accent={a.name}
                data-active="false"
                onClick={() => setAccent(a.name)}
                aria-label={`Accent ${a.name}`}
                aria-pressed="false"
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
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}