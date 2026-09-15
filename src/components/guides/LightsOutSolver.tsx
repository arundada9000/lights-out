"use client";

import { useState } from "react";
import { bottomRowKeys } from "@/engine/chase";
import { cn } from "@/lib/cn";

interface CatalogCase {
  name: string;
  cells: number[];
  tap: number[];
}

const CATALOG_5: CatalogCase[] = [
  { name: "Left triple", cells: [1, 1, 1, 0, 0], tap: [1] },
  { name: "Split quad", cells: [1, 1, 0, 1, 1], tap: [2] },
  { name: "Split triple", cells: [1, 0, 1, 1, 0], tap: [4] },
  { name: "Outer corners", cells: [1, 0, 0, 0, 1], tap: [0, 1] },
  { name: "Offset triple", cells: [0, 1, 1, 0, 1], tap: [0] },
  { name: "Inner pair", cells: [0, 1, 0, 1, 0], tap: [0, 3] },
  { name: "Right triple", cells: [0, 0, 1, 1, 1], tap: [3] },
];

const CATALOG_3: CatalogCase[] = [
  { name: "Left triangle", cells: [1, 0, 0], tap: [0, 1] },
  { name: "Center T", cells: [0, 1, 0], tap: [0, 1, 2] },
  { name: "Right triangle", cells: [0, 0, 1], tap: [1, 2] },
  { name: "Left pair", cells: [1, 1, 0], tap: [2] },
  { name: "Right pair", cells: [0, 1, 1], tap: [0] },
  { name: "Bow arrow", cells: [1, 0, 1], tap: [0, 2] },
  { name: "Full row", cells: [1, 1, 1], tap: [1] },
];

const SIZES = [3, 4, 5, 6, 7, 8];

function catalogFor(size: number): CatalogCase[] {
  if (size === 5) return CATALOG_5;
  if (size === 3) return CATALOG_3;
  return [];
}

function matchPattern(bottom: number[], catalog: CatalogCase[]): CatalogCase | undefined {
  return catalog.find((c) =>
    c.cells.length === bottom.length && c.cells.every((v, i) => v === bottom[i])
  );
}

function cellList(keys: number[]): string {
  if (keys.length === 0) return "none";
  if (keys.length === 1) return String(keys[0] + 1);
  const last = keys[keys.length - 1] + 1;
  const rest = keys.slice(0, -1).map((k) => k + 1);
  return `${rest.join(", ")} and ${last}`;
}

function Lamp({ on, mark }: { on: boolean; mark?: boolean }) {
  return (
    <span
      className={cn("relative rounded-lg p-0.5 transition-colors", mark && "border border-accent/70 bg-accent/12")}
    >
      <span className="bulb h-7 w-7" data-on={on ? "true" : "false"}>
        <span className="lamp" aria-hidden />
      </span>
    </span>
  );
}

export function LightsOutSolver() {
  const [size, setSize] = useState(5);
  const [bottom, setBottom] = useState<number[]>(() => Array<number>(5).fill(0));

  const changeSize = (n: number) => {
    setSize(n);
    setBottom(Array<number>(n).fill(0));
  };

  const toggle = (i: number) => {
    setBottom((b) => b.map((v, j) => (j === i ? v ^ 1 : v)));
  };

  const keys = bottomRowKeys(bottom);
  const allDark = bottom.every((v) => v === 0);
  const catalog = catalogFor(size);
  const matched = matchPattern(bottom, catalog);

  return (
    <div className="overflow-hidden rounded-ios-2xl border border-separator bg-surface-raised shadow-card">
      <div className="flex items-center justify-between gap-3 border-b border-separator bg-fill/40 px-5 py-3.5">
        <p className="text-[15px] font-semibold tracking-tight text-label">
          Interactive solver
        </p>
        <span className="slot-readout text-[10px] text-label-tertiary">
          {size} x {size}
        </span>
      </div>

      <div className="flex flex-col gap-5 px-5 py-5 sm:px-6">
        <div className="flex flex-col gap-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-label-tertiary">
            Board size
          </p>
          <div className="flex flex-wrap gap-1.5" role="group" aria-label="Board size">
            {SIZES.map((n) => (
              <button
                key={n}
                type="button"
                aria-pressed={size === n}
                onClick={() => changeSize(n)}
                className={cn(
                  "rounded-ios-sm border px-3 py-1.5 text-sm font-medium transition-colors duration-200 ease-ios focus-visible:ring-focused",
                  size === n
                    ? "border-accent bg-accent text-accent-contrast"
                    : "border-separator bg-fill text-label-secondary hover:border-accent/50 hover:text-label"
                )}
              >
                {n}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-2.5">
          <p className="text-sm font-semibold text-label">Step 1: clear the rows above the bottom</p>
          <p className="text-sm leading-relaxed text-label-secondary">
            Tap each lit cell on your bottom row so the row here matches your board
            after the downward sweep. The tool answers below on every change.
          </p>
          <div className="flex flex-wrap items-end gap-2 pt-1" role="group" aria-label="Bottom row cells">
            {bottom.map((v, i) => (
              <button
                key={i}
                type="button"
                aria-pressed={v === 1}
                aria-label={`${v === 1 ? "Lit" : "Off"} bottom row cell ${i + 1}`}
                onClick={() => toggle(i)}
                className="bulb h-9 w-9 sm:h-10 sm:w-10"
                data-on={v === 1 ? "true" : "false"}
              >
                <span className="lamp" aria-hidden />
                <span className="slot-readout pointer-events-none absolute -bottom-4.5 left-1/2 -translate-x-1/2 text-[10px] font-semibold text-label-tertiary">
                  {i + 1}
                </span>
              </button>
            ))}
          </div>
          <p className="text-xs font-medium text-label-tertiary">
            {matched ? `Pattern: ${matched.name}` : allDark ? "Bottom row is empty" : "Custom pattern"}
          </p>
        </div>

        {keys === null ? (
          <div className="rounded-ios-lg border border-warning/30 bg-warning/10 px-4 py-3.5 text-sm leading-relaxed text-label">
            This bottom row cannot be produced by a valid board. Within the sweep
            one tap was wrong: restart the board and clear one row at a time.
          </div>
        ) : (
          <div className="flex flex-col gap-2.5 rounded-ios-lg border border-separator bg-fill/40 px-4 py-4">
            <p className="text-sm font-semibold text-label">Step 2: tap these on the top row once</p>
            <div className="flex flex-wrap items-end gap-2">
              {bottom.map((_, i) => (
                <Lamp key={i} on={keys.includes(i)} mark={keys.includes(i)} />
              ))}
            </div>
            {keys.length === 0 ? (
              <p className="text-sm leading-relaxed text-label-secondary">
                Nothing to tap on the top row. Go straight to the final sweep below.
              </p>
            ) : (
              <p className="text-sm leading-relaxed text-label-secondary">
                Tap top-row cell {cellList(keys)}. The lamp icons are marked for you.
              </p>
            )}
            <p className="text-sm leading-relaxed text-label-secondary">
              Step 3: clear the board with one more sweep. From the top row down,
              tap the cell directly below every lit cell. The board goes dark.
            </p>
          </div>
        )}

        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-0.5">
            <p className="text-xs font-semibold uppercase tracking-wide text-label-tertiary">Pattern cards</p>
            <p className="text-sm text-label-secondary">
              A card shows a bottom row you can land on. Tap a card to load it
              into the tool above.
            </p>
          </div>

          {catalog.length > 0 && (
            <div className="grid gap-2 sm:grid-cols-2">
              {catalog.map((c) => (
                <button
                  key={`${size}-${c.name}`}
                  type="button"
                  onClick={() => {
                    if (size !== c.cells.length) setSize(c.cells.length);
                    setBottom([...c.cells]);
                  }}
                  className="flex flex-col gap-2.5 rounded-ios-lg border border-separator bg-fill/40 p-3.5 text-left transition-colors duration-200 ease-ios hover:border-accent/50 focus-visible:ring-focused"
                >
                  <span className="flex items-center justify-between gap-2">
                    <span className="text-sm font-semibold tracking-tight text-label">
                      {c.name}
                    </span>
                    <span className="slot-readout text-[10px] text-label-tertiary">
                      {c.cells.length} x {c.cells.length}
                    </span>
                  </span>
                  <span className="flex flex-col gap-1.5">
                    <span className="flex items-center gap-1">
                      {c.cells.map((v, i) => (
                        <LampCell key={i} on={v === 1} />
                      ))}
                    </span>
                    <span className="flex items-center gap-1">
                      {c.tap.length === 0 ? (
                        <span className="text-xs text-label-tertiary">Tap nothing</span>
                      ) : (
                        <>
                          {c.tap.map((cell) => (
                            <span key={cell} className="relative rounded-lg p-0.5 border border-accent/70 bg-accent/12">
                              <span className="bulb h-4.5 w-4.5" data-on="true">
                                <span className="lamp" aria-hidden />
                              </span>
                            </span>
                          ))}
                          <span className="ml-1 text-xs font-medium text-label-secondary">
                            Tap {cellList(c.tap)}
                          </span>
                        </>
                      )}
                    </span>
                  </span>
                </button>
              ))}
            </div>
          )}

          <p className="text-xs leading-relaxed text-label-tertiary">
            Cards assume you finished the first sweep (step 1) with a clean
            downward pass. On other board sizes the same steps apply; every
            reachable bottom row has an answer.
          </p>
        </div>
      </div>
    </div>
  );
}

function LampCell({ on }: { on: boolean }) {
  return (
    <span className="bulb h-4.5 w-4.5" data-on={on ? "true" : "false"}>
      <span className="lamp" aria-hidden />
    </span>
  );
}