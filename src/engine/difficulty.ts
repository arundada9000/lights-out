/**
 * Difficulty classification (game-logic 25, 77.
 *
 * Difficulty is data-driven and derived from measurable puzzle properties -
 * primarily minimum solution length combined with board size - rather than
 * being hardcoded to dimensions.
 */

export type DifficultyLabel = "Beginner" | "Easy" | "Medium" | "Hard" | "Expert" | "Brutal";

export interface DifficultyEstimate {
  label: DifficultyLabel;
  /** Score used to order puzzles; higher is harder. */
  score: number;
}

/** Relative complexity of an optimal-solution press against its board. */
export function classifyDifficulty(optimalMoves: number, size: number): DifficultyEstimate {
  const cells = size * size;
  const ratio = optimalMoves / Math.max(1, cells);

  let label: DifficultyLabel;
  let score: number;

  if (optimalMoves <= 3) {
    label = "Beginner";
    score = optimalMoves * 10;
  } else if (ratio <= 0.18) {
    label = "Easy";
    score = 30 + ratio * 140;
  } else if (ratio <= 0.3) {
    label = "Medium";
    score = 60 + ratio * 120;
  } else if (ratio <= 0.42) {
    label = "Hard";
    score = 100 + ratio * 100;
  } else if (ratio <= 0.55) {
    label = "Expert";
    score = 140 + ratio * 80;
  } else {
    label = "Brutal";
    score = 200 + ratio * 60;
  }

  return { label, score: Math.round(score) };
}