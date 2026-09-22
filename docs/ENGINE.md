# Engine

This document explains the math inside `src/engine`. You can write and
contribute to this layer without touching React; it is the part of the project
that is also referenced by the user-facing guides.

## Lights Out over GF(2)

A Lights Out board state is a vector of bits (one per cell: off/on). Pressing a
cell toggles it and its neighbors - which is an XOR of a fixed set of bits. The
whole game is therefore linear over the integers mod 2, written as a matrix
equation:

```
A x = b   (mod 2)
```

- `A` is the toggle matrix: column `j` of `A` is the indicator vector of the
  cells that a press on cell `j` flips.
- `b` is the difference between the current board and the goal
  (`initial XOR target`), i.e. "which cells are currently in the wrong state".
- `x` is the unknown press vector; `x[j] = 1` means "press cell `j` once".

Every solver in the project simply solves this system. Because pressing a cell
twice cancels, solutions are always sets and presses commute.

### Solver algorithm (`solver.ts`)

1. Build `A` (`buildToggleMatrix`) as an array of `bigint` columns so rows pack
   into machine words.
2. Gaussian elimination to reduced row echelon form over GF(2) on the augmented
   matrix `[A | b]`.
3. If a zero pivot row has a nonzero `b`, the board is unsolvable - this is how
   the generator guarantees it only ships solvable boards and how the guides
   detect an unreachable "bottom row".
4. Otherwise read off a particular solution (pivot columns) plus a nullspace
   basis, one basis vector per free column.
5. Enumerate the free-variable combinations (bounded at 2^17), evaluate
   popcount, and keep the minimum-move solution. When the nullspace fits in the
   budget, `optimal: true`, so the engine can report an optimal press count.
   Bigger nullspaces keep the particular solution and report
   `optimal: false`.

`verifySolution(initial, target, steps, spec, kind)` replays the press set with
`applyMoves` and proves it reaches the target, independent of the linear
algebra. Tests always assert this property on generated boards.

## Generation (`generator.ts`)

To build a solvable board with a known optimum:

- `generateClassic`: start at all-off, pick `pressRange` random cells via the
  seeded RNG, press them (using the true toggle matrix), and keep the pressed
  set as the "solution". The opening is the result: no matter now it looks, it
  provably clears in that many moves.
- `generatePattern`: press moves on top of a target pattern so the opening
  board solves back to the pattern.
- A solver run then recomputes the true minimum for verification and for the
  displayed `optimal` value.
- 48 generation attempts; if none lands in the requested press density the
  function falls back to a tiny scramble so a board is always served.

## Deterministic randomness (`rng.ts`)

The generator never asks the OS for randomness. It takes a seed:

- `hashSeed` (xmur3) hashes any string/number to a 32-bit state.
- `mulberry32` expands it into a deterministic PRNG.
- Seeds: `randomSeed()` for ad-hoc boards, `dailySeed(dateStamp)` for the Daily
  board - same seed, same board, for everyone that parses the same date.

This is why a run can be serialized and continued (or replayed) from a handful
of numbers.

## Difficulty (`difficulty.ts`)

`classifyDifficulty(optimalMoves, size)` buckets optimal length and board size
into `Beginner..Brutal` labels, used by the guides and generator quality tests.

## Modes and presets (`modes.ts`)

A mode is a behavior profile (Classic, Pattern, Daily, Minimum Moves, Timed,
Zen); presets pick geometry and density. `rulesetFor(mode, presetId, {seed})`
composes them into an executable `Ruleset` that carries everything the engine
needs, including assist policy:

- `competitive: true` disables undo and hints and gates whether a finished run
  updates records (Daily, Minimum Moves, Timed).
- `timer` is `none`, `count-up`, or `count-down` (with `timeLimitMs`).

## GameEngine (`game.ts`)

A headless run: cells, phase, move accounting, undo/redo snapshot stacks,
elapsed time, replay log, and assist tracking (using undo or a hint marks the
run as assisted so competitive stats stay honest). It is serialized with
`serialize()` (versioned `EnginePayload`) and rebuilt with `hydrate()` - that is
the entire "Continue" flow; nothing about the board state lives outside the
engine.

## The chase math (`chase.ts`)

The guides teach light chasing: sweep the board down clearing every row above
the bottom, then read the leftover bottom pattern and press a small set on the
top row once, then sweep again. The "knowable" fact is which top-row cells to
press for a given leftover bottom row.

`bottomRowKeys(bottomRow)` answers exactly that:

1. For each column, press the top cell once and sweep the board down; this
   yields a basis vector describing that top cell's full effect on the bottom
   row.
2. Solve `basis * x = bottomRow` over GF(2) into RREF.
3. An inconsistent row means the bottom pattern cannot come from a solvable
   board -> `null` (the guides use this to warn about mis-sweeps).
4. Otherwise enumerate the kernel, requiring the minimal-popcount answer with
   the lowest bitmask as the tie-breaker - matching the published color cards.

Verified against brute force in `chase.test.ts`: 5x5 has nullity 2 (several
valid answers per bottom row, and every generation returns the canonical
minimum), 3x3 is unique, and unreachable patterns report null.

`sweepDown` / `pressOn` / `guidedSolveBlocks` are the deterministic helpers the
guide tool and tests share.