"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import { CheckCircle2, Trophy, Sparkles, Info, X } from "lucide-react";
import { useToastStore, type ToastTone } from "@/game/useToastStore";
import { cn } from "@/lib/cn";

/**
 * Toast host. Fixed stack bottom-center, spring entrance, auto-dismissing.
 * Tones map to the game's record/success/info language.
 */

const TONE_ICON: Record<ToastTone, typeof Info> = {
  record: Trophy,
  success: CheckCircle2,
  warning: Sparkles,
  default: Info,
};

const TONE_RING: Record<ToastTone, string> = {
  record: "border-accent text-accent",
  success: "border-accent-strong text-accent-strong",
  warning: "border-warning text-warning",
  default: "border-separator text-label-tertiary",
};

export function Toasts() {
  const toasts = useToastStore((s) => s.toasts);
  const dismiss = useToastStore((s) => s.dismiss);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        const last = useToastStore.getState().toasts.at(-1);
        if (last) dismiss(last.id);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [dismiss]);

  return (
    <div
      aria-live="polite"
      aria-atomic="false"
      className="pointer-events-none fixed inset-x-0 bottom-6 z-[70] flex flex-col items-center gap-2 px-4"
    >
      <AnimatePresence>
        {toasts.map((t) => {
          const Icon = TONE_ICON[t.tone];
          return (
            <motion.div
              key={t.id}
              layout
              initial={{ opacity: 0, y: 16, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{
                opacity: 0,
                y: 8,
                scale: 0.97,
                transition: { duration: 0.18, ease: "easeIn" },
              }}
              transition={{ type: "spring", stiffness: 420, damping: 34 }}
className={cn(
                "pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-ios-xl border border-separator bg-surface-raised/95 px-4 py-3 shadow-modal backdrop-blur-xl",
                t.tone === "record" && "border-accent/40"
              )}
              role="status"
            >
              <span
                className={cn(
                  "mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border",
                  TONE_RING[t.tone]
                )}
              >
                <Icon className="h-3.5 w-3.5" strokeWidth={2.4} aria-hidden />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[13px] font-semibold leading-tight text-label">{t.title}</p>
                {t.message ? (
                  <p className="mt-0.5 text-[12px] leading-snug text-label-secondary">{t.message}</p>
                ) : null}
              </div>
              <button
                type="button"
                aria-label="Dismiss notification"
                onClick={() => dismiss(t.id)}
                className="-mr-1.5 -mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-label-tertiary transition-colors duration-200 ease-ios hover:bg-fill hover:text-label active:scale-95"
              >
                <X className="h-3.5 w-3.5" strokeWidth={2.4} aria-hidden />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}