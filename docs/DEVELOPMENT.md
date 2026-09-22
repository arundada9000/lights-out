# Development

Everything you need to contribute to Easy Lights Out. If you are new here, read
[ARCHITECTURE.md](ARCHITECTURE.md) first, then [ENGINE.md](ENGINE.md) for the
puzzle math.

## Prerequisites

- Node.js 20.9+ (the repo targets 24, see `engines` in `package.json`)
- pnpm 10+
- A recent Chrome/Edge (only needed for `scripts/shots.mjs`)

```bash
pnpm install
```

## Scripts

| Command | What it does |
|---|---|
| `pnpm dev` | Next.js dev server (Turbopack) at http://localhost:3000 |
| `pnpm build` | Production build (prerenders all static pages) |
| `pnpm start` | Serve the production build |
| `pnpm test` / `test:watch` | Vitest, once / watch |
| `pnpm exec tsc --noEmit` | Type check (strict) |
| `pnpm exec eslint .` | Lint |
| `pnpm exec eslint . --fix` | Autofix lint |
| `node scripts/shots.mjs` | Regenerate viewport screenshots into `docs/screenshots` |

### Regenerating screenshots

```bash
pnpm build
pnpm start --port=3100   # in one terminal
node scripts/shots.mjs http://localhost:3100
```

The script drives the system Chrome (channel `chrome`), seeds a deterministic
state (paper theme, muted sfx, a fresh Classic 5x5 with a few moves played) and
captures one-viewport frames. Every frame is exactly one screen height; the
script never takes full-page document captures.

## Everyday workflow

1. Create a branch from `main`: `git checkout -b feat/your-change`.
2. Make focused changes. Keep commits small and typed.
3. Run the quality gate before pushing:
   `pnpm exec tsc --noEmit && pnpm exec eslint . && pnpm test && pnpm build`.
4. For UI copy work, also run the char detector (see below).
5. Open a pull request using the template in
   `.github/pull_request_template.md`.

## Coding conventions

- **TypeScript strict everywhere.** No `any` unless a legacy shim demands it and
  the file documents why. `tsconfig.json` targets ES2022.
- **Imports**: path alias `@/` maps to `src/`. Prefer named exports
  (`export function Foo`) to match the codebase.
- **Comments**: the codebase uses short JSDoc header comments on modules and key
  functions. Do not sprinkle inline chatter; a comment must explain a why, not
  restate the code.
- **Components**: components that use hooks or browser APIs are
  `"use client"`. Server components stay synchronous and never touch
  `window`/`localStorage`/`document`. The rest of `src/engine` and the pure
  parts of `src/game` are available to Node tests.
- **Design tokens**: never hardcode hex colors in components. Use the Tailwind
  tokens from `globals.css` (`surface-raised`, `label`, `accent`, ...) or
  `theme.ts` values.
- **Icons**: `lucide-react` only. Do not hand-render arbitrary Unicode glyphs.
- **Copy discipline** (app-facing text): no em dashes, middle dots, `&times;`,
  `&rarr;`-style entities, or decorative unicode in `src/`. The detector in
  CI-adjacent workflow supersedes nothing - run it on everything you touch:
  ```bash
  node "C:\Users\arunn\.claude\skills\impeccable\scripts/detect.mjs" --json src\app src\components src\lib src\game src\app\globals.css
  ```
  An empty `[]` is the expected result.

## The quality gate (before any push)

```bash
pnpm exec tsc --noEmit
pnpm exec eslint .
pnpm test
pnpm build
# + detector for src/ changes, screenshots regenerated if UI changed
```

## Common tasks

### Add a guide page

1. Create `src/lib/guide-content/<name>.ts` returning a `GuideMeta` object
   (type in `src/lib/guides.ts`). Blocks: `p`, `h2`, `h3`, `ul`, `ol`, `callout`,
   `steps`, `table`, `code`, `blockquote`, `link-list`, and `solver` (an
   interactive Lights Out tool).
2. Register it in `src/lib/guide-content/index.ts` and append it to the
   `guides` array in `src/lib/guides.ts`.
3. Use unique, descriptive `keywords`; each guide also has an optional `faq`.
4. Reading time and category are metadata, not computed.

### Add a mode or preset

Modes and presets are data, not code paths.

1. In `src/engine/modes.ts`, either add a `ModeDef` to `MODE_LIST` or a preset
   to the relevant `*_PRESETS` array / `presetsFor` switch.
2. Presets declare geometry, press density, minimum solution size, an optional
   time cap, and an optional target. `rulesetFor` composes everything into a
   `Ruleset` the engine can execute - no other glue is needed.
3. If the mode should record records, set `competitive: true`; that disables
   undo and hints automatically and gates stats recording.

### Add a theme or accent

Both are config, not components.

1. Add the entry to `THEMES` or `ACCENTS` in
   `src/components/theme/theme.ts` (name, label, sample colors, `dark` flag).
2. If the theme needs new token components (e.g. a new surface tint), extend
   `@theme inline` and the `[data-theme=...]` override block in `globals.css`.
3. `ThemeSwitcher` renders from the registry automatically. Data is validated
   at runtime by `normalizeTheme` / `normalizeAccent`.

### Touch the solver or generator

The invariants that protect these are in the tests - do not soften them:

- `solver.test.ts` asserts `verifySolution` on solved boards and enumeration
  caps (`MAX_ENUMERATE = 2^17`).
- `generator.test.ts` asserts every generated board is solvable and within its
  `pressRange`.
- `chase.test.ts` asserts `bottomRowKeys` matches brute force for 5x5 and 3x3.

If you change the math, re-run the whole suite; property tests will catch
regressions.

## Gotchas

- **Strict Mode double effects**: the `GameScreen` boot effect is intentionally
  guard-free so setup-cleanup-setup re-creates the clock interval. If you add
  effects there or to a store, never assume a single mount.
- **SSR safety**: `localStorage` is a client-only API. Always read/write through
  `src/game/storage.ts` (it has an in-memory mirror and try/catch). Never read
  a store from a server component.
- **Deterministic Daily**: the Daily seed is derived from the local calendar
  date (`dateStamp` in `src/game/storage.ts`), so the "same board every day"
  guarantee is per device timezone, not global.
- **Mutation + revision**: you cannot mutate `GameEngine` and expect React to
  re-render. Mutate through the store actions or bump `revision`.
- **Web Audio**: the SFX/ambience modules touch `AudioContext`; they are not
  unit-tested and must no-op where `AudioContext` is missing (Node, some mobile
  browsers).
- **Do not run `pnpm start` without `pnpm build`** first; `next start` serves
  `.next`, not source.

## Testing expectations for PRs

- Bug fixes: add a regression test that fails on `main` and passes with your
  change (engine logic) - or, for UI bugs, a short note in the PR describing the
  before/after with a screenshot from `scripts/shots.mjs`.
- New engine behavior: property-style tests preferred (generate, solve, verify).
- You are expected to keep `pnpm test` green; the suite is fast, so run it while
  developing with `pnpm test --watch`.

## Project documentation map

- `README.md` - what this is, badge-free overview, screenshots.
- `docs/ARCHITECTURE.md` - layers, data flow, state model, theming, PWA.
- `docs/ENGINE.md` - the Lights Out math (GF(2), chase, generation).
- `docs/DEVELOPMENT.md` - this file.
- `CONTRIBUTING.md` - process and etiquette for issues + PRs.
- `CHANGELOG.md` - user-facing change log, kept per release.
- `PRODUCT.md` / `DESIGN.md` - product truth and the "Control Surface" design
  contract (internal, but read them before redesigning UI).