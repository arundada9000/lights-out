/**
 * Global toast queue (plan.md: toast surfaces). Not persisted; driven by game
 * milestones (records, daily clears) and install/offline events.
 */

import { create } from "zustand";

export type ToastTone = "default" | "success" | "record" | "warning";

export interface ToastItem {
  id: number;
  title: string;
  message?: string;
  tone: ToastTone;
}

interface ToastState {
  toasts: ToastItem[];
  show: (t: { title: string; message?: string; tone?: ToastTone }) => number;
  dismiss: (id: number) => void;
  clear: () => void;
}

const AUTO_DISMISS_MS = 4200;

let nextId = 1;

export const useToastStore = create<ToastState>((set, get) => ({
  toasts: [],
  show: ({ title, message, tone = "default" }) => {
    const id = nextId++;
    set({ toasts: [...get().toasts, { id, title, message, tone }] });
    window.setTimeout(() => {
      get().dismiss(id);
    }, AUTO_DISMISS_MS);
    return id;
  },
  dismiss: (id) => set({ toasts: get().toasts.filter((t) => t.id !== id) }),
  clear: () => set({ toasts: [] }),
}));

export type { ToastState };