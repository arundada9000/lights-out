"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, Power, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { site } from "@/lib/site";
import { ThemeSwitcher } from "@/components/theme/ThemeSwitcher";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

const links = [
  { href: "/guides", label: "Guides" },
  { href: "/guides/how-to-play", label: "How to Play" },
  { href: "/guides/lights-out-algorithm", label: "The Math" },
];

function Emblem() {
  const lit = new Set(["1-1", "0-2", "2-0", "2-2", "1-0"]);
  return (
    <span
      aria-hidden
      className="grid h-9 w-9 flex-shrink-0 grid-cols-3 gap-[3px] rounded-[9px] border border-separator bg-surface-raised p-[6px] shadow-card"
    >
      {Array.from({ length: 9 }).map((_, i) => {
        const r = Math.floor(i / 3);
        const c = i % 3;
        const on = lit.has(`${r}-${c}`);
        return (
          <span
            key={i}
            className="rounded-[2px]"
            style={{
              backgroundColor: on ? "var(--accent)" : "var(--fill-secondary)",
              boxShadow: on ? "0 0 6px color-mix(in srgb, var(--accent) 70%, transparent)" : undefined,
            }}
          />
        );
      })}
    </span>
  );
}

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full">
      <div className="glass border-b border-separator/80">
        <Container className="flex h-16 items-center justify-between gap-4 sm:h-[68px]">
          <Link
            href="/"
            className="group flex items-center gap-3 rounded-ios-sm focus-visible:ring-focused"
            aria-label={`${site.name} home`}
            onClick={() => setOpen(false)}
          >
            <Emblem />
            <span className="flex flex-col leading-none">
              <span className="text-[15px] font-semibold tracking-tight text-label">
                Easy Lights Out
              </span>
              <span className="etched mt-1 text-[9px]">Tap. Think. Solve.</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-0.5 md:flex" aria-label="Primary">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="etched rounded-ios-sm px-3.5 py-2.5 text-[11px] text-label-secondary transition-colors duration-200 ease-ios hover:bg-fill hover:text-label focus-visible:ring-focused"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <ThemeSwitcher />
            <Button asChild size="sm" className="glow-accent">
              <Link href="/play" onClick={() => setOpen(false)}>
                <Power className="h-3.5 w-3.5" strokeWidth={2.4} strokeLinecap="square" />
                Power On
              </Link>
            </Button>
            <button
              type="button"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              aria-controls="mobile-nav"
              onClick={() => setOpen((v) => !v)}
              className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-separator bg-surface-raised text-label-secondary transition-all duration-150 ease-ios hover:text-label active:scale-90 focus-visible:ring-focused md:hidden"
            >
              {open ? (
                <X className="h-[18px] w-[18px]" strokeWidth={2.2} aria-hidden />
              ) : (
                <Menu className="h-[18px] w-[18px]" strokeWidth={2.2} aria-hidden />
              )}
            </button>
          </div>
        </Container>
      </div>

      <AnimatePresence>
        {open ? (
          <motion.nav
            id="mobile-nav"
            aria-label="Primary"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ type: "spring", stiffness: 360, damping: 32 }}
            className="overflow-hidden border-b border-separator/80 bg-surface-raised shadow-card md:hidden"
          >
            <div className="flex flex-col gap-1 px-4 py-3">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="cursor-pointer rounded-ios-md px-3.5 py-3 text-[15px] font-medium text-label transition-colors duration-200 ease-ios hover:bg-fill focus-visible:ring-focused"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </motion.nav>
        ) : null}
      </AnimatePresence>
    </header>
  );
}