/**
 * Global appearance and feedback settings.
 *
 * Persisted under "settings"; hydrated once on the client (never at module
 * load, so server render and first paint share the same defaults). Every side
 * effect - theme DOM, feedback volumes, ambience, music - is applied through
 * the modules this store owns.
 */

import { create } from "zustand";
import {
  type ThemePreference,
  type AccentName,
  applyThemeToDom,
  normalizeTheme,
  normalizeAccent,
  resolveTheme,
  systemIsDark,
} from "@/components/theme/theme";
import {
  setFeedbackEnabled,
  setHapticsEnabled,
  setFeedbackVolume,
} from "@/game/sound";
import { setMusic, setAmbient, type AmbientKind } from "@/components/play/soundscape";
import { readJSON, writeJSON } from "@/game/storage";

export interface SettingsState {
  theme: ThemePreference;
  accent: AccentName;
  fxOn: boolean;
  hapticsOn: boolean;
  fxVolume: number;
  musicOn: boolean;
  ambience: AmbientKind | null;
  autoNext: boolean;
  autoContinue: boolean;
  wobble: boolean;
  showMoveCount: boolean;
  hydrated: boolean;
}

const DEFAULTS: SettingsState = {
  theme: "system",
  accent: "amber",
  fxOn: true,
  hapticsOn: true,
  fxVolume: 0.6,
  musicOn: false,
  ambience: null,
  autoNext: false,
  autoContinue: true,
  wobble: true,
  showMoveCount: true,
  hydrated: false,
};

const PERSISTED_KEYS = [
  "theme",
  "accent",
  "fxOn",
  "hapticsOn",
  "fxVolume",
  "musicOn",
  "ambience",
  "autoNext",
  "autoContinue",
  "wobble",
  "showMoveCount",
] as const;

function applyEffects(s: Pick<SettingsState, "theme" | "accent" | "fxOn" | "hapticsOn" | "fxVolume" | "musicOn" | "ambience">) {
  if (typeof document === "undefined") return;
  const pref = normalizeTheme(s.theme === "system" ? "system" : s.theme);
  applyThemeToDom(pref === "system" ? resolveTheme("system", systemIsDark()) : pref, s.accent);
  setFeedbackEnabled(s.fxOn);
  setHapticsEnabled(s.hapticsOn);
  setFeedbackVolume(s.fxVolume);
  setMusic(s.musicOn);
  setAmbient(s.ambience);
}

export interface SettingsActions {
  setTheme: (theme: ThemePreference) => void;
  setAccent: (accent: AccentName) => void;
  setFx: (on: boolean) => void;
  setHaptics: (on: boolean) => void;
  setVolume: (v: number) => void;
  setMusic: (on: boolean) => void;
  setAmbience: (kind: AmbientKind | null) => void;
  setAutoNext: (on: boolean) => void;
  setAutoContinue: (on: boolean) => void;
  setWobble: (on: boolean) => void;
  setShowMoveCount: (on: boolean) => void;
  persist: () => void;
  hydrate: (preloaded?: Partial<SettingsState>) => void;
  resetAll: () => void;
}

export const useSettingsStore = create<SettingsState & SettingsActions>((set, get) => ({
  ...DEFAULTS,

  setTheme: (theme) => {
    set({ theme });
    const s = { ...get(), theme };
    applyEffects(s);
    get().persist();
  },
  setAccent: (accent) => {
    set({ accent });
    applyEffects({ ...get(), accent });
    get().persist();
  },
  setFx: (fxOn) => {
    set({ fxOn });
    setFeedbackEnabled(fxOn);
    get().persist();
  },
  setHaptics: (hapticsOn) => {
    set({ hapticsOn });
    setHapticsEnabled(hapticsOn);
    get().persist();
  },
  setVolume: (fxVolume) => {
    set({ fxVolume });
    setFeedbackVolume(fxVolume);
    get().persist();
  },
  setMusic: (musicOn) => {
    set({ musicOn });
    setMusic(musicOn);
    get().persist();
  },
  setAmbience: (ambience) => {
    set({ ambience });
    setAmbient(ambience);
    get().persist();
  },
  setAutoNext: (autoNext) => {
    set({ autoNext });
    get().persist();
  },
  setAutoContinue: (autoContinue) => {
    set({ autoContinue });
    get().persist();
  },
  setWobble: (wobble) => {
    set({ wobble });
    get().persist();
  },
  setShowMoveCount: (showMoveCount) => {
    set({ showMoveCount });
    get().persist();
  },

  persist: () => {
    const s = get();
    const subset: Record<string, unknown> = {};
    for (const k of PERSISTED_KEYS) subset[k] = s[k];
    writeJSON("settings", subset);
  },

  hydrate: (preloaded) => {
    if (get().hydrated) return;
    let next: Partial<SettingsState> = preloaded ?? {};
    if (!next.theme) {
      const stored = readJSON<Record<string, unknown>>("settings");
      if (stored) next = stored as Partial<SettingsState>;
    }
    const final: SettingsState = {
      ...DEFAULTS,
      theme: normalizeTheme(typeof next.theme === "string" ? next.theme : null),
      accent: normalizeAccent(typeof next.accent === "string" ? next.accent : null),
      fxOn: typeof next.fxOn === "boolean" ? next.fxOn : DEFAULTS.fxOn,
      hapticsOn: typeof next.hapticsOn === "boolean" ? next.hapticsOn : DEFAULTS.hapticsOn,
      fxVolume: typeof next.fxVolume === "number" ? next.fxVolume : DEFAULTS.fxVolume,
      musicOn: typeof next.musicOn === "boolean" ? next.musicOn : DEFAULTS.musicOn,
      ambience: next.ambience ?? DEFAULTS.ambience,
      autoNext: typeof next.autoNext === "boolean" ? next.autoNext : DEFAULTS.autoNext,
      autoContinue: typeof next.autoContinue === "boolean" ? next.autoContinue : DEFAULTS.autoContinue,
      wobble: typeof next.wobble === "boolean" ? next.wobble : DEFAULTS.wobble,
      showMoveCount: typeof next.showMoveCount === "boolean" ? next.showMoveCount : DEFAULTS.showMoveCount,
      hydrated: true,
    };
    set(final);
    applyEffects(final);
  },

  resetAll: () => {
    set({ ...DEFAULTS, hydrated: true });
    applyEffects({ ...get(), ...DEFAULTS });
    get().persist();
  },
}));

export { DEFAULTS as SETTINGS_DEFAULTS };