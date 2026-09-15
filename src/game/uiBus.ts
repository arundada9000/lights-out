/**
 * UI bus: a tiny shared-store layer for app chrome that spans components
 * (sheets opened from the HUD, the outliner, the command palette, or the
 * board context menu). Keeps sheet ownership out of GameScreen's local state
 * so any surface can open the mode/settings/stats/help panels.
 */

import { create } from "zustand";

export type SheetKind = "mode" | "settings" | "stats" | "help" | null;

interface UiBusState {
  sheet: SheetKind;
  setSheet: (sheet: SheetKind) => void;
}

export const useUiBus = create<UiBusState>((set) => ({
  sheet: null,
  setSheet: (sheet) => set({ sheet }),
}));