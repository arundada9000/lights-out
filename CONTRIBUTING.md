# Contributing to Easy Lights Out

First off, thanks for taking the time. This project is a small, careful
codebase; the guidelines below keep it that way. If anything is unclear, open
an issue and ask - the maintainer would rather answer than watch a good PR get
bogged down.

## Code of conduct

Read [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md). Be kind and constructive in
issues, PRs, and comments.

## Before you start

Read the docs so your change fits the architecture:

- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) - how the layers fit together
  (engine is deliberately framework-free; stores drive React via a revision
  counter, not by mutating classes).
- [docs/DEVELOPMENT.md](docs/DEVELOPMENT.md) - setup, scripts, conventions,
  common tasks, and the quality gate.
- [docs/ENGINE.md](docs/ENGINE.md) - if your change touches solver, generator,
  or modes, the math must stay provable by the property tests.
- [PRODUCT.md](PRODUCT.md) and [DESIGN.md](DESIGN.md) - the product truth and
  the "Control Surface" design contract. UI changes are expected to respect
  this direction; if you want to shift it, start a discussion first.

New ideas: open a feature request using `.github/ISSUE_TEMPLATE/
feature_request.yml` and agree scope before writing code. Small, agreed-upon
changes merge far faster than large surprise PRs.

## Development setup

```bash
pnpm install
pnpm dev
```

## The quality gate

Everything below must pass before you push or open a PR:

```bash
pnpm exec tsc --noEmit
pnpm exec eslint .
pnpm test
pnpm build
```

For anything touching `src/` copy or UI, also run the char detector (an empty
`[]` is success) and regenerate screenshots when the UI changed:

```bash
node "C:\Users\arunn\.claude\skills\impeccable\scripts/detect.mjs" --json src\app src\components src\lib src\game src\app\globals.css
node scripts/shots.mjs   # after `pnpm build` + `pnpm start --port=3100`
```

(On a machine without that detector, the rule in short is: no em dashes, middle
dots, `&times;`/`&rarr;` entities, or decorative unicode in app-facing text.)

## Code style

- TypeScript strict. Named exports. Path alias `@/`.
- Comments explain *why*, sparingly; module headers are fine.
- `lucide-react` for icons, never hand-rendered Unicode glyphs.
- Use the Tailwind token system from `globals.css`; don't hardcode hex in
  components. New colors/shadows/radii belong in the token layer.
- Server components must not touch browser APIs; anything that uses
  `window`/`localStorage` is `"use client"` and routes storage through
  `src/game/storage.ts`.
- Persistence shapes are versioned (`SavedRun.version`,
  `EnginePayload.version`). Bump + migrate, never silently replace.

## Pull requests

1. Create a focused branch from `main` (e.g. `fix/hint-undo-stack`,
   `feat/new-mode`).
2. Commit in the repo's style: short imperative first line with a typed prefix
   (`feat:`, `fix:`, `chore:`, `docs:`), body lines under ~72 chars explaining
   the "why".
3. Open the PR against `main` using the template in
   `.github/pull_request_template.md`; it is a checklist, fill it in.
4. Keep the diff small. Split independent changes into separate PRs.
5. Include tests with engine changes (property-style preferred: generate,
   solve, verify). UI changes include a before/after note and screenshots when
   possible.
6. Respond to review comments; force-pushing to rewrite a feature branch is
   fine, but please do not squash away review context mid-discussion.

## Reporting issues

Use `.github/ISSUE_TEMPLATE/bug_report.yml`. A good report has:

- the page URL and device/browser,
- numbered reproduction steps,
- expected versus actual behaviour,
- console errors, and the theme/accent or settings in use.

Never paste API keys or personal data. Bugs are triaged and labelled; please
don't tag maintainers.

## Security

Found a vulnerability? Do **not** open a public issue - follow
[SECURITY.md](SECURITY.md).

## Ownership and licensing

The repository is proprietary (see [LICENSE](LICENSE)). You are welcome to read
it, run it locally, and contribute via PRs. By submitting a pull request you
agree that your contribution may be used under the project's license terms. If
you plan to redistribute or reuse the code elsewhere, contact the author first.