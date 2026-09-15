export const THEME_STORAGE_KEY = "elo-theme";
export const ACCENT_STORAGE_KEY = "elo-accent";

export type ThemeName =
  | "paper"
  | "mist"
  | "sepia"
  | "contrast"
  | "slate"
  | "midnight"
  | "ocean"
  | "grape";

export type AccentName =
  | "amber"
  | "gold"
  | "blue"
  | "green"
  | "indigo"
  | "orange"
  | "pink"
  | "purple"
  | "red"
  | "teal"
  | "cyan"
  | "mint";

export interface ThemeOption {
  name: ThemeName;
  label: string;
  note: string;
  sample: [string, string, string, string];
  dark: boolean;
}

export const THEMES: ThemeOption[] = [
  {
    name: "paper",
    label: "Paper",
    note: "iOS system light",
    sample: ["#f2f2f7", "#ffffff", "#000000", "#d97706"],
    dark: false,
  },
  {
    name: "mist",
    label: "Mist",
    note: "Cool studio light",
    sample: ["#eef2f6", "#ffffff", "#111827", "#d97706"],
    dark: false,
  },
  {
    name: "sepia",
    label: "Sepia",
    note: "Warm eye comfort",
    sample: ["#eae0ce", "#f5ecd9", "#2c220e", "#b25e00"],
    dark: false,
  },
  {
    name: "contrast",
    label: "Contrast",
    note: "High accessibility",
    sample: ["#ffffff", "#ffffff", "#000000", "#9e4d00"],
    dark: false,
  },
  {
    name: "slate",
    label: "Slate",
    note: "iOS system dark",
    sample: ["#000000", "#1c1c1e", "#ffffff", "#fbbf24"],
    dark: true,
  },
  {
    name: "midnight",
    label: "Midnight",
    note: "Deep OLED black",
    sample: ["#000000", "#141416", "#ffffff", "#fbbf24"],
    dark: true,
  },
  {
    name: "ocean",
    label: "Ocean",
    note: "Deep blue signal",
    sample: ["#070d18", "#0e182a", "#f0f6fc", "#fbbf24"],
    dark: true,
  },
  {
    name: "grape",
    label: "Grape",
    note: "Deep purple signal",
    sample: ["#0b0814", "#151024", "#f5f3ff", "#fbbf24"],
    dark: true,
  },
];

export const ACCENTS: { name: AccentName; color: string }[] = [
  { name: "amber", color: "#d97706" },
  { name: "gold", color: "#d4a017" },
  { name: "blue", color: "#007aff" },
  { name: "green", color: "#1f9c4c" },
  { name: "indigo", color: "#5856d6" },
  { name: "orange", color: "#f07716" },
  { name: "pink", color: "#e13e72" },
  { name: "purple", color: "#a358d1" },
  { name: "red", color: "#ef3e30" },
  { name: "teal", color: "#12a5b4" },
  { name: "cyan", color: "#0aa2c9" },
  { name: "mint", color: "#16b987" },
];

export const THEME_COLOR: Record<ThemeName, string> = {
  paper: "#f2f2f7",
  mist: "#eef2f6",
  sepia: "#eae0ce",
  contrast: "#ffffff",
  slate: "#000000",
  midnight: "#000000",
  ocean: "#070d18",
  grape: "#0b0814",
};

export type ThemePreference = ThemeName | "system";

export function resolveTheme(pref: ThemePreference, systemDark: boolean): ThemeName {
  if (pref === "system") return systemDark ? "slate" : "paper";
  return pref;
}

/** Map legacy stored values from the earlier two-theme implementation. */
export function normalizeTheme(value: string | null): ThemePreference {
  if (value === "light") return "paper";
  if (value === "dark") return "slate";
  if (value && THEMES.some((t) => t.name === value)) return value as ThemeName;
  return "system";
}

export function normalizeAccent(value: string | null): AccentName {
  if (value && ACCENTS.some((a) => a.name === value)) return value as AccentName;
  return "amber";
}

export function systemIsDark(): boolean {
  return typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches;
}

export function applyThemeToDom(theme: ThemeName, accent: AccentName) {
  const root = document.documentElement;
  root.setAttribute("data-theme", theme);
  root.setAttribute("data-accent", accent);
  root.style.colorScheme = THEMES.find((t) => t.name === theme)?.dark ? "dark" : "light";
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute("content", THEME_COLOR[theme]);
}