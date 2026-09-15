"use client";

import { useCallback, useRef, useState } from "react";

interface MagneticProps {
  children: React.ReactNode;
  className?: string;
  /** Max pull in px. */
  strength?: number;
}

/**
 * Magnetic wrapper: the child leans toward the pointer, springs back on
 * leave, and gives a tactile press on down. Disabled under reduced motion.
 */
export function Magnetic({ children, strength = 10, className }: MagneticProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [active] = useState(
    () => typeof window !== "undefined" && !window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );

  const onMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!active) return;
      const node = ref.current;
      if (!node) return;
      const rect = node.getBoundingClientRect();
      const dx = e.clientX - (rect.left + rect.width / 2);
      const dy = e.clientY - (rect.top + rect.height / 2);
      const dist = Math.max(1, Math.hypot(dx, dy));
      const pull = Math.min(1, dist / (rect.width * 0.6));
      node.style.transform = `translate(${((dx / dist) * strength * pull).toFixed(1)}px, ${(
        (dy / dist) *
        strength *
        pull
      ).toFixed(1)}px) scale(1.02)`;
    },
    [active, strength]
  );

  const onLeave = useCallback(() => {
    if (!ref.current) return;
    ref.current.style.transform = "";
  }, []);

  const onDown = useCallback(() => {
    if (active && ref.current) ref.current.style.transform = "scale(0.96)";
  }, [active]);

  return (
    <div
      ref={ref}
      className={className}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      onPointerDown={onDown}
      style={{
        transitionProperty: "transform",
        transitionDuration: "0.34s",
        transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
        willChange: "transform",
      }}
    >
      {children}
    </div>
  );
}