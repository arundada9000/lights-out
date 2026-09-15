# Contributing to Easy Lights Out

Thanks for your interest in contributing.

## Development setup

1. Fork and clone the repo.
2. Install dependencies: `pnpm install`
3. Start the dev server: `pnpm dev`
4. Run checks before committing:

```bash
pnpm exec tsc --noEmit
pnpm exec eslint .
pnpm test
```

## Code style

- TypeScript strict mode.
- No em dashes, middle dots, or emojis in user-facing copy.
- Use `lucide-react` for icons, not Unicode glyphs.
- Prefer Tailwind utility classes; custom CSS tokens live in `globals.css`.
- Zustand stores are plain and pure; persistence is handled separately.

## Pull requests

- Keep PRs focused on a single change.
- Write a clear description of what changed and why.
- Make sure all checks pass.

## Reporting issues

Open an issue on GitHub with steps to reproduce.