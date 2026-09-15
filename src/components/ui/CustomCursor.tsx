"use client";

/**
 * Brand cursor (design.md: alternatives to the pointer). A small accent dot
 * with a trailing ring that swells over interactive targets and on press.
 * Desktop fine pointers only, native cursor hidden while active, and never
 * rendered for reduced-motion users. Pure rAF updates - no React state per
 * pointer frame.
 */

import { useEffect, useRef, useState } from "react";

export function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mqFine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const mqReduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setEnabled(mqFine.matches && !mqReduce.matches);
    update();
    mqFine.addEventListener("change", update);
    mqReduce.addEventListener("change", update);
    return () => {
      mqFine.removeEventListener("change", update);
      mqReduce.removeEventListener("change", update);
    };
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    document.body.classList.add("brand-cursor");
    let tx = window.innerWidth / 2;
    let ty = window.innerHeight / 2;
    let rx = tx;
    let ry = ty;
    let hidden = true;
    let active = false;
    let raf = 0;

    const onMove = (e: PointerEvent) => {
      if (!e.isPrimary) return;
      tx = e.clientX;
      ty = e.clientY;
      if (hidden) {
        hidden = false;
        dot.style.opacity = "1";
        ring.style.opacity = "1";
        rx = tx;
        ry = ty;
      }
      const el = e.target as HTMLElement | null;
      const interactive = !!el?.closest(
        "a, button, [role='button'], [role='menuitem'], input, select, textarea, label, [data-cursor]"
      );
      if (interactive !== active) {
        active = interactive;
        ring.dataset.active = String(active);
      }
    };

    const onDown = () => {
      dot.style.transform = "translate(-50%, -50%) scale(0.72)";
    };
    const onUp = () => {
      dot.style.transform = "translate(-50%, -50%) scale(1)";
    };

    const loop = () => {
      rx += (tx - rx) * 0.24;
      ry += (ty - ry) * 0.24;
      ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
      dot.style.left = `${tx}px`;
      dot.style.top = `${ty}px`;
      raf = window.requestAnimationFrame(loop);
    };
    raf = window.requestAnimationFrame(loop);

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    return () => {
      window.cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.body.classList.remove("brand-cursor");
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[9999]">
      <div ref={dotRef} className="cursor-dot" />
      <div ref={ringRef} className="cursor-ring" />
    </div>
  );
}