# Architecture

Easy Lights Out is a static, offline-first Next.js app. The entire game runs on
the client: the server only prerenders pages and serves assets. This document
explains the system in enough detail to work on it safely.

## Layered design

```
src/engine   Pure TypeScript: puzzle math, solver, generator, modes. No React,
             no DOM, no storage. Fully unit-testable in Node.
src/game     Zustand stores + pure logic that bind the engine to the UI
             (persistence, stats, settings, toasts, sheet bus, audio).
src/components/ui        Reusable, theme-aware primitives (Sheet, Switch,
                         Tooltip, Toasts, ContextMenu, CommandPalette, ...).
src/components/game      The play scene: Board, Cell, Hud, sheets, overlays.
src/components/landing   Landing page only (DemoBoard, SurfaceRack, ...).
src/components/guides    Guide renderer + the interactive LightsOutSolver.
src/components/theme     Theme/accent registry + pre-paint ThemeScript.
src/components/motion    Reveal / Magnetic / ReadingProgress scroll helpers.
src/components/layout    AppShell, SiteHeader, SiteFooter.
src/components/pwa       Service worker registration + install affordance.
src/app                 Next.js App Router pages, metadata, CSS.
src/lib                 Guides registry, SEO, site config, time, cn().
```

The dependency direction is strict: `engine` imports nothing app-specific,
`game` imports `engine` and shared libs, `components` never import back into
`app`. Keeping `engine` and the pure parts of `game` DOM-free is what makes the
83-test suite run in plain Node (see `vitest.config.mts`).

## The engine (`src/engine`)

All of the puzzle logic lives here:

- `solver.ts` - GF(2) linear algebra over `bigint`. `buildToggleMatrix`,
  `solvePuzzle` (returns a minimum-move solution when it can prove one),
  `applyMoves`, `verifySolution`. See [ENGINE.md](ENGINE.md) for the math.
- `generator.ts` - builds solvable boards. `generateClassic` starts from an
  all-off board and applies a random optimal move set; `generatePattern` starts
  from a target pattern and prints a puzzle that solves back to it.
- `rng.ts` - `xmur3` seed hashing + `mulberry32` PRNG so every board is
  reproducible from a single seed. `dailySeed()` derives the Daily board from
  the local date, so everyone's board is deterministic without a server.
- `activation.ts` - grid topology and neighborhood rules (`cross`,
  `cross-corner`, plus wrapped topologies).
- `target.ts` - target grids (`all-off`, patterns, checkerboard, border, plus,
  center) and the `matchesTarget` check.
- `modes.ts` - the six modes and their presets, composed into a `Ruleset`
  (geometry + activation + target + timer + assist policy + seed).
- `game.ts` - `GameEngine`, a headless run. It owns cells, phases
  (`ready/playing/paused/won/lost`), move accounting, undo/redo stacks, the
  timer, replay log and assist tracking. It has getters for `canUndo`,
  `canRedo`, `canHint`, `isRunning`, and `serialize()/hydrate()` for snapshots.
- `difficulty.ts` - labels a puzzle by press count and board size.
- `chase.ts` - the light-chasing math used by the guides: `sweepDown`,
  `bottomRowKeys`, `pressOn`, `guidedSolveBlocks`.

`GameEngine` never touches React. Everything the UI needs is exposed as plain
properties or methods; callers mutate it and then bump a revision counter (see
below).

## State layer (`src/game`)

Four Zustand stores plus a tiny uiBus:

| Store | Persists to | Owns |
|---|---|---|
| `useSettingsStore` | `elo-g/settings` | theme, accent, fx, haptics, music, ambience, autoplay toggles |
| `useStatsStore` | `elo-g/stats` | per-mode totals, bests, daily grid, streak |
| `useGameStore` | `elo-g/saved-run` | the live `GameEngine`, phase, clock, hint, result |
| `useToastStore` | - | transient toast queue |
| `useUiBus` | - | which sheet is open (`mode/settings/stats/help`) |

Two more localStorage keys are written directly by the theme system:
`elo-theme` and `elo-accent` (read by the pre-paint `ThemeScript`).

`src/game/storage.ts` wraps localStorage with an SSR-safe memory mirror: all
reads route through it and never crash in private mode or mid-render.

### Rendering model

Components subscribe to the stores directly. Because `useGameStore` holds a
mutable class instance, a `revision` counter is the render trigger: every
mutation goes through `sync(engine, patch)` in `useGameStore.ts`, which bumps
`revision` once. The `Board`, `Hud` and other consumers select `revision` so a
single state change re-renders exactly once (see `useGameStore.ts:161`).

### Boot and the run lifecycle

`/play` mounts `GameScreen`, whose single boot effect (`GameScreen.tsx:136`)
hydrates settings, stats, then boots the game store:

1. `useGameStore.boot()` reads the saved run (if any and still the same local
   day) and calls `continueRun()`; otherwise it deals a fresh Classic 5x5.
2. A `100 ms` clock interval drives `tick`, which advances the engine timer and
   watches for time-out losses.
3. A store subscription autosaves ("Continue" snapshot) one animation frame
   after any revision or phase change.
4. `visibilitychange` pauses and saves when the tab is hidden; the window hides
   during app-switch, making the clock honest.
5. When the engine reaches `won` or `lost`, `commitResult` records stats, fires
   a toast if it is a new personal best, and surfaces the result overlay. With
   `autoNext` on, a fresh board is dealt shortly after a win.

The boot effect is intentionally written guard-free so React 18/19 Strict Mode's
setup-cleanup-setup cycle re-creates the interval; `boot()` itself is idempotent
via the `hydrated` flag.

## The play scene (`src/components/game`)

`GameScreen.tsx` composes:

- `Hud` - mode button (opens ModeSelect), help/statistics/settings icons, the
  status strip (moves slots, timer, undo/redo/hint/pause/restart). Every icon
  uses the Tooltip primitive and keeps an `aria-label`.
- `Board` / `Cell` - the instrument grid. A press animation, screw/beam details,
  and lamp lenses render per `globals.css`.
- `ModeSelect`, `SettingsSheet`, `StatsSheet`, `HelpSheet` - the four sheets,
  each a spring slide-over built on `src/components/ui/Sheet.tsx`.
- `Overlays` - the result plate and pause state.
- All open/close routing goes through `useUiBus` so the HUD, the board context
  menu, and the command palette stay in sync.

Keyboard controls (see `GameScreen.tsx:178`): `M` mode, `U` undo, `H` hint,
`R` restart, `P` pause/resume, number keys press cells on small grids, `Esc`
closes any sheet. Inputs/textarea/select never trigger game keys.

## Custom UI primitives (`src/components/ui`)

- `Sheet.tsx` - scrim + spring panel used by all four sheets.
- `ContextMenu.tsx` - a singleton store + host; `useBoardContextMenu(items)`
  wires a right-click menu. Items support hints, disabled/danger states and
  separators. It clamps to the viewport and dismisses on Escape/scroll/blur.
- `CommandPalette.tsx` - Cmd/Ctrl+K global search. It deals with the stores
  directly so commands work from any page.
- `Toasts.tsx` + `useToastStore.ts` - fixed bottom-center stack, spring motion,
  four tones, auto-dismiss.
- `Tooltip.tsx` - pointer/focus tooltip wrapper (no native `title`).
- `CustomCursor.tsx` - accent dot + trailing ring; fine pointers only, disabled
  under `prefers-reduced-motion` (CSS in `globals.css` hides the native cursor).
- `Switch`, `Segmented`, `Button`, `Card`, `Badge`, `Slot`, `Container`,
  `SectionHeading`.

All primitives consume the Tailwind v4 token system defined in `globals.css`
(`@theme inline`): `surface-raised`, `label`, `label-secondary`, `accent`,
`accent-soft`, `danger`, `warning`, `radius-ios-*`, `shadow-*`, `ease-ios`.

## Theming

`src/components/theme/theme.ts` is the single source of truth: 8 `data-theme`
surfaces and 12 accents. `ThemeScript` runs inline in `<head>` before paint
(`layout.tsx:49`) and applies `data-theme`/`data-accent` plus
`color-scheme` and the `theme-color` meta directly from `elo-theme` /
`elo-accent`, so there is never a theme flash. `applyThemeToDom` also updates
the `<html>` attributes at runtime when settings change.

Add a theme or accent in `theme.ts` (and optionally extend `globals.css` if it
needs new token components); the ThemeSwitcher popover renders from the
registry automatically.

## Pages and SEO

- `src/app/page.tsx` - landing page with an interactive `DemoBoard`.
- `src/app/play/page.tsx` - renders `GameScreen` (AppShell hides the site
  header/footer there).
- `src/app/guides/[...]` - 16 guide pages from `src/lib/guides.ts`.
- `sitemap.ts`, `robots.ts`, `manifest.ts` (PWA manifest) generated at build.
- All metadata comes from `src/lib/seo.ts` and `src/lib/site.ts`.

## PWA

`src/components/pwa/Pwa.tsx` registers `public/sw.js` in production, prints a
branded console signature, and shows an install pill only when the browser
actually raises `beforeinstallprompt`. Offline-first works because every page is
statically prerendered and the service worker caches those responses.

## Testing

- `vitest` runs 83 tests across 8 suites (`src/engine/*.test.ts`,
  `src/game/stats.test.ts`).
- The engine tests are property-style: they generate boards, solve them, then
  assert the returned solution actually clears the board via `verifySolution`,
  and that enumeration caps hold. Keep this property whenever you change the
  solver.
- `chase.test.ts` cross-checks `bottomRowKeys` against brute force.
- The game scene itself is not yet covered by E2E tests; `scripts/shots.mjs`
  exercises it headlessly in a real browser to produce `docs/screenshots`.

## Persistence keys (summary)

| Key | Content |
|---|---|
| `elo-theme` / `elo-accent` | pre-paint theme + accent (ThemeScript) |
| `elo-g/settings` | settings store subset |
| `elo-g/stats` | statistics store |
| `elo-g/saved-run` | serialized run for Continue |
| `elo-g/...` (anything) | cleared by `clearAll` in stats reset |

Versioning: `SavedRun.version = 1` and `EnginePayload.version = 1`; bump both
when you change snapshot shapes and add a migration in `boot()`/
`GameEngine.hydrate()`.