"use client";

/**
 * Custom context menu (plan.md: replace default menus). A singleton store
 * drives a single mounted host; any surface can call show() with a position
 * and items. Escape, outside press, scroll, resize and focus change dismiss.
 * The menu clamps to the viewport so a right-click near an edge never clips.
 */

import { useEffect, useRef, type ReactNode } from "react";
import { motion } from "motion/react";
import { create } from "zustand";
import { cn } from "@/lib/cn";

export interface ContextMenuItem {
  key: string;
  label: string;
  hint?: string;
  icon?: ReactNode;
  disabled?: boolean;
  danger?: boolean;
  hidden?: boolean;
  separator?: boolean;
  onSelect: () => void;
}

interface ContextMenuState {
  open: boolean;
  x: number;
  y: number;
  items: ContextMenuItem[];
  show: (x: number, y: number, items: ContextMenuItem[]) => void;
  hide: () => void;
}

export const useContextMenuStore = create<ContextMenuState>((set) => ({
  open: false,
  x: 0,
  y: 0,
  items: [],
  show: (x, y, items) => set({ open: true, x, y, items: items.filter((i) => !i.hidden) }),
  hide: () => set({ open: false }),
}));

export function ContextMenu() {
  const open = useContextMenuStore((s) => s.open);
  const x = useContextMenuStore((s) => s.x);
  const y = useContextMenuStore((s) => s.y);
  const items = useContextMenuStore((s) => s.items);
  const hide = useContextMenuStore((s) => s.hide);

  const panelRef = useRef<HTMLDivElement>(null);
  const skipHide = useRef(false);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: globalThis.PointerEvent) => {
      if (skipHide.current) {
        skipHide.current = false;
        return;
      }
      const el = e.target as HTMLElement | null;
      if (panelRef.current && el && panelRef.current.contains(el)) return;
      hide();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") hide();
    };
    const onScroll = () => hide();
    const onResize = () => hide();
    const onBlur = () => hide();
    window.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("keydown", onKey);
    window.addEventListener("scroll", onScroll, true);
    window.addEventListener("resize", onResize);
    window.addEventListener("blur", onBlur);
    return () => {
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("scroll", onScroll, true);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("blur", onBlur);
    };
  }, [open, hide]);

  const panelW = 224;
  const panelH = Math.min(items.length, 8) * 38 + 12;
  const left = open ? Math.min(x, window.innerWidth - panelW - 8) : 0;
  const top = open ? Math.min(y, window.innerHeight - panelH - 8) : 0;

  return (
    <>
      {open ? (
        <>
          <motion.div
            ref={panelRef}
            role="menu"
            aria-label="Board actions"
            initial={{ opacity: 0, scale: 0.95, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 460, damping: 36 }}
            className="fixed z-[61] w-56 overflow-hidden rounded-ios-lg border border-separator bg-surface-raised py-1.5 shadow-modal"
            style={{ left, top }}
            onPointerDownCapture={() => {
              skipHide.current = true;
            }}
          >
              {items.map((item) =>
                item.separator ? (
                  <div
                    key={item.key}
                    className="my-1.5 h-px bg-separator/70"
                    role="separator"
                    aria-hidden
                  />
                ) : (
                  <button
                    key={item.key}
                    type="button"
                    role="menuitem"
                    disabled={item.disabled}
                  onClick={() => {
                    hide();
                    if (!item.disabled) item.onSelect();
                  }}
                  className={cn(
                    "flex w-full items-center justify-between gap-3 px-3.5 py-2 text-left text-[13px] transition-colors duration-150 ease-ios",
                    item.disabled
                      ? "cursor-not-allowed text-label-tertiary/60"
                      : item.danger
                        ? "text-danger hover:bg-fill"
                        : "text-label hover:bg-fill"
                  )}
                  style={{ pointerEvents: item.disabled ? "none" : undefined }}
                >
                  <span className="flex min-w-0 items-center gap-2.5">
                    {item.icon ? (
                      <span
                        className={cn(
                          "flex h-4 w-4 items-center justify-center",
                          item.disabled ? "text-label-tertiary/60" : "text-label-tertiary"
                        )}
                        aria-hidden
                      >
                        {item.icon}
                      </span>
                    ) : null}
                    <span className="truncate font-medium">{item.label}</span>
                  </span>
                  {item.hint ? (
                    <span className="shrink-0 text-[11px] font-medium text-label-tertiary">{item.hint}</span>
                  ) : null}
                </button>
                )
              )}
            </motion.div>
          </>
      ) : null}
    </>
  );
}

export function useBoardContextMenu(buildItems: () => ContextMenuItem[]) {
  const showMenu = useContextMenuStore((s) => s.show);

  const onContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    const items = buildItems();
    if (items.length > 0) showMenu(e.clientX, e.clientY, items);
  };

  return { onContextMenu };
}