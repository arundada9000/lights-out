"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { X } from "lucide-react";
import { cn } from "@/lib/cn";

/**
 * Custom sheet surface - a full-height slide-over on desktop, a bottom sheet on
 * touch. Reusable for mode selection, settings, stats and help. Escape and the
 * backdrop dismiss; internal focus is trapped lightly.
 */

interface SheetProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  side?: "left" | "right";
  className?: string;
}

export function Sheet({ open, onClose, title, children, side = "right", className }: SheetProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    const focusDelay = window.setTimeout(() => panelRef.current?.focus(), 40);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      window.clearTimeout(focusDelay);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open ? (
        <div className="fixed inset-0 z-50">
          <motion.button
            type="button"
            aria-label="Close overlay"
            className="absolute inset-0 h-full w-full cursor-default bg-[var(--scrim)]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            onClick={onClose}
          />
          <motion.div
            ref={panelRef}
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-label={title}
            initial={{ x: side === "right" ? "100%" : "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: side === "right" ? "100%" : "-100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 32 }}
            className={cn(
              "absolute top-0 bottom-0 flex w-full max-w-sm flex-col border-separator bg-surface shadow-modal",
              side === "right" ? "right-0 border-l" : "left-0 border-r",
              className
            )}
          >
            <div className="flex items-center justify-between border-b border-separator px-5 py-4">
              <h2 className="text-[15px] font-semibold tracking-tight text-label">{title}</h2>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="-mr-1 flex h-8 w-8 items-center justify-center rounded-full text-label-tertiary transition-colors duration-200 ease-ios hover:bg-fill hover:text-label active:scale-95"
              >
                <X className="h-4 w-4" strokeWidth={2.2} aria-hidden />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-5 py-5">{children}</div>
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>
  );
}