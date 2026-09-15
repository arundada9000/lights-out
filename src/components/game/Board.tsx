"use client";

import { useCallback } from "react";
import { useGameStore } from "@/game/useGameStore";
import { useSettingsStore } from "@/game/useSettingsStore";
import { Cell } from "./Cell";

export function Board() {
  const engine = useGameStore((s) => s.engine);
  const revision = useGameStore((s) => s.revision);
  const press = useGameStore((s) => s.press);
  const hintCells = useGameStore((s) => s.hintCells);
  const wobble = useSettingsStore((s) => s.wobble);

  void revision;

  const onPress = useCallback(
    (index: number) => {
      press(index);
    },
    [press]
  );

  if (!engine) return null;

  const { width, height, phase, cells } = engine;
  const playable = phase === "ready" || phase === "playing";
  const hintSet = hintCells ? new Set(hintCells) : null;

  return (
    <div
      className="instrument relative grid gap-[max(3px,0.7vmin)] p-[max(6px,1.4vmin)]"
      role="grid"
      aria-label={`Lights Out board, ${width} by ${height}`}
      style={{ gridTemplateColumns: `repeat(${width}, minmax(0, 1fr))`, gridTemplateRows: `repeat(${height}, minmax(0, 1fr))` }}
    >
      <span className="instrument-screw left-[6px] top-[6px] scale-75" aria-hidden />
      <span className="instrument-screw right-[6px] top-[6px] scale-75" aria-hidden />
      <span className="instrument-screw bottom-[6px] left-[6px] scale-75" aria-hidden />
      <span className="instrument-screw bottom-[6px] right-[6px] scale-75" aria-hidden />
      <span className="instrument-beam" aria-hidden />

      {Array.from({ length: width * height }, (_, index) => {
        const r = Math.floor(index / width);
        const c = index % width;
        return (
          <Cell
            key={index}
            index={index}
            row={r}
            col={c}
            on={cells[index] === 1}
            hint={hintSet?.has(index) ?? false}
            disabled={!playable}
            wobble={wobble}
            onPress={onPress}
          />
        );
      })}
    </div>
  );
}