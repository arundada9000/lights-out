# Easy Lights Out — Design System (Control Surface)

The site is treated as the machine's own schematic: a modular instrument where the
mechanism is the interface. Everything renders from variables; nothing is hardcoded
styling.

## World

- The grid is a modular-synth patch bay of glowing LED cells.
- Pressing a cell emits a visible signal ripple to its orthogonal neighbors.
- The chrome is engraved panels: etched micro-cap labels, status LEDs, slot readouts,
  screws, a scanning signal line.
- Every surface on this page is a variable: 8 surfaces x 12 accents, all switchable
  live, persisted per device, offline.

## Token architecture

- Single `globals.css` with `@theme inline` mapping raw `--board-*` values (palette,
  board, surfaces, glass) to Tailwind utilities (`bg-background`, `text-label`,
  `border-separator`, `accent` scale, `gap`, `radius`, `shadow`).
- No literal colors in components. Only token classes, `opacity-*`, and motion
  utilities.

### Surfaces (8)

| Name | Character |
| --- | --- |
| paper | warm, high-key, slightest warmth |
| mist | near-neutral, high-key |
| sepia | faded paper, mid-light |
| slate | cool dark |
| midnight | near-black, cool dark |
| contrast | black + white, pure, accessibility default |
| ocean | blue-dark |
| grape | violet-dark |

### Accents (12)

amber (default studio accent), gold, blue, green, indigo, orange, pink, purple,
red, teal, cyan, mint. Rendered via `--accent`, `--accent-soft`, `--accent-contrast`
computed from the accent theme block.

### Type

- System stack only: SF Pro (via `-apple-system`) on Apple, Segoe on Windows,
  Arial fallback. No webfonts, no shipping weight.
- Display ramps use `heading` token (48/40/32/28/24/20/17); body uses
  `body`/`label` scale. Heavy = weight 600-700 only and sparingly.

## Motion

- Motion library (keyframes in `globals.css`): `signal-patrol` (scanning headplate
  beam), `bulb-on`, `bulb-wave` (ripple), `aura-drift` (ambient light), `scan-drop`
  (closing-plate scanline), `led-breathe`.
- Interaction: `Reveal` (scroll fade-rise, staggered by `--reveal-delay`), `Magnetic`
  (soft pointer lean on primary CTAs), button press scale on tap.
- Everything decorative pauses or stops under `prefers-reduced-motion`; state
  feedback (bulb on/off) is preserved.

## Components

- `Progress`/`Badge`/`Button`/`Card`/`Container`/`SectionHeading` — token-only UI kit.
- `DemoBoard` — the hero instrument: real solvable 5x5 board, Manhattan-distance
  ripple waves, fixed-slot moves readout, POWER reset. Deterministic starting
  layout so SSR and hydration agree.
- `SurfaceRack` — live theme/accent demo; taps re-tune the whole page.
- `Reveal`/`Magnetic` — motion primitives.
- `ReadingProgress` — fixed hairline scroll-progress bar on guide pages.
- Guides: catalog list (numbered slot rows per rack), outline rail on xl, ascending
  "continue" plate for prev/next.
- `PlayConsole` (/play) — the game is the console: standby gate overlay (mode +
  grid segmented, "Arm Run"), LED telemetry (level / lights / moves / time), a
  live solvable board that auto-advances after "Signal Clear", a session-end
  plate for the two-minute speedrun, and a synthesized Soundscape dock (sfx
  chimes, generative pad loop, rain / fireside beds) with zero sample assets.
  Design DNA borrowed conceptually from lo-fi gaming rooms: single screen, start
  gate, chill room controls.
- `ThemeScript` (inline, pre-paint) + `ThemeSwitcher` (popover) + `SurfaceRack` share
  the same `applyThemeToDom` runtime; `data-theme`/`data-accent` on `<html>`.

## Commitments (anti-slop)

- No gradient text. No reflections/shadows-on-text. No glow text. No emoji. No em
  dashes in copy. No stock hero imagery.
- No decorative grid-line backgrounds except the designated blueprint surfaces
  (documented via in-file `impeccable-disable codex-grid-background` — the schematic
  is the point of the world).
- No kicker/eyebrow typography above headings.
- Preference micro-copy only where it serves utility ("This board is live - tap any
  cell").
- Audio/story in verifiable facts, product structure, and real mechanics; nothing
  fabricated (product truth lives in `PRODUCT.md`).

## Provenance

- Every asset ships with its derivation: theme palettes lifted and converted from
  the loksewa quiz project (`D:\Programming\html-css\loksewa quiz hosted\style.css`,
  lines 9-281), Korean styling conventions translated to iOS-HIG boarding.
- Idea selection trace: impeccable concept-seed `762b7e1c`; direction assigned
  index 4, Control Surface, user-confirmed.