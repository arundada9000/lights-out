"use client";

import { type CSSProperties, type ReactNode, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";

interface RevealProps {
  children: ReactNode;
  className?: string;
  /** Stagger delay in ms. */
  delay?: number;
  as?: "div" | "h2" | "h3" | "p" | "section" | "article" | "span" | "li";
  id?: string;
}

/**
 * Lightweight scroll-reveal wrapper: fades and rises into view once.
 * Relies on the `reveal` / `reveal-visible` utilities in globals.css,
 * which also drop all movement under prefers-reduced-motion.
 */
export function Reveal({ children, className, delay = 0, as: Tag = "div", id }: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setShown(true);
            observer.disconnect();
            return;
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.15 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const TagName = Tag;

  return (
    <TagName
      ref={ref as never}
      id={id}
      className={cn("reveal", shown && "reveal-visible", className)}
      style={{ "--reveal-delay": `${delay}ms` } as CSSProperties}
    >
      {children}
    </TagName>
  );
}