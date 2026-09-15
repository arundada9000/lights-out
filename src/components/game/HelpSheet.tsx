"use client";

import type { ReactNode } from "react";
import { Keyboard, Lightbulb, Target } from "lucide-react";
import { Sheet } from "@/components/ui/Sheet";

interface HelpSheetProps {
  open: boolean;
  onClose: () => void;
}

export function HelpSheet({ open, onClose }: HelpSheetProps) {
  return (
    <Sheet open={open} onClose={onClose} title="Help">
      <div className="flex flex-col gap-5">
        <section className="flex flex-col gap-2">
          <h3 className="etched">The rule</h3>
          <p className="text-[14px] leading-relaxed text-label-secondary">
            Tap any light and it toggles together with the four lights touching it
            (above, below, left, right). A press always cancels itself, so tapping
            the same light twice leaves the grid unchanged.
          </p>
          <p className="text-[14px] leading-relaxed text-label-secondary">
            The goal is every mode&apos;s headline. Classic and Timed clear the whole
            grid; Pattern reproduces the shape the board started from; Daily, Minimum
            and Zen run on the same all-off objective with different pressure.
          </p>
        </section>

        <section className="flex flex-col gap-2">
          <h3 className="etched flex items-center gap-1.5">
            <Target className="h-3 w-3" aria-hidden /> Goals
          </h3>
          <ul className="flex flex-col gap-1.5 text-[14px] text-label-secondary">
            <li><b className="text-label">Classic</b> - clear the grid, any size, at your pace.</li>
            <li><b className="text-label">Pattern</b> - rebuild the goal shape from wherever it was scrambled to.</li>
            <li><b className="text-label">Daily</b> - one seeded 5 x 5; everyone gets the same board, and your streak only grows when you clear it the same day.</li>
            <li><b className="text-label">Minimum Moves</b> - no timer, but the solver knows the proven minimum. Match it.</li>
            <li><b className="text-label">Timed</b> - clear the board before the countdown ends.</li>
            <li><b className="text-label">Zen</b> - no clock, no failure. Undo and hints whenever you like.</li>
          </ul>
        </section>

        <section className="flex flex-col gap-2">
          <h3 className="etched flex items-center gap-1.5">
            <Lightbulb className="h-3 w-3" aria-hidden /> Assists
          </h3>
          <p className="text-[14px] leading-relaxed text-label-secondary">
            Classic, Pattern and Zen allow undo, redo and hints. Daily, Minimum and
            Timed are scored modes: assists are locked and records only count for
            clean, assist-free runs.
          </p>
        </section>

        <section className="flex flex-col gap-2">
          <h3 className="etched flex items-center gap-1.5">
            <Keyboard className="h-3 w-3" aria-hidden /> Shortcuts
          </h3>
          <ul className="flex flex-col gap-1 text-[13px] text-label-secondary">
            <li><Kbd>U</Kbd> undo</li>
            <li><Kbd>H</Kbd> hint</li>
            <li><Kbd>R</Kbd> restart</li>
            <li><Kbd>P</Kbd> pause / resume</li>
            <li><Kbd>M</Kbd> change mode</li>
            <li><Kbd>Esc</Kbd> close overlay</li>
          </ul>
        </section>
      </div>
    </Sheet>
  );
}

function Kbd({ children }: { children: ReactNode }) {
  return (
    <kbd className="mr-1.5 inline-flex min-w-6 items-center justify-center rounded-md border border-separator bg-fill px-1.5 py-0.5 font-mono text-[12px] font-semibold text-label">
      {children}
    </kbd>
  );
}