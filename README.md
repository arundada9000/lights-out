# Easy Lights Out

A beautifully crafted, offline-ready Lights Out puzzle built with Next.js and Tailwind CSS. Tap a cell to flip it and its neighbours, then solve every board in as few moves as possible.

## Features

- Six modes: Classic, Pattern, Daily, Minimum Moves, Timed and Zen
- Cross-platform hint engine, competitive statistics, and streak tracking
- Custom command palette, context menus, toasts, and brand cursor
- Progressive Web App (installable, offline-ready)
- Eight data-theme surfaces with twelve accent colours

## Tech stack

- Next.js 16 (App Router, Turbopack)
- React 19
- Tailwind CSS v4
- Zustand (state)
- Framer Motion (motion/react)
- Vitest (unit tests)
- TypeScript (strict)

## Getting started

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command | Description |
|---|---|
| `pnpm dev` | Development server |
| `pnpm build` | Production build |
| `pnpm start` | Serve production build |
| `pnpm test` | Run Vitest unit tests |
| `pnpm exec tsc --noEmit` | Type check |
| `pnpm exec eslint .` | Lint |

## Project structure

```
src/
  app/          Pages and layouts
  components/   UI and game components
  engine/       Puzzle generation, solver, modes, rules
  game/         Zustand stores and pure game logic
  lib/          Guides, SEO, time, site config
public/         Icons and service worker
rules/          Internal planning docs (gitignored)
```

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).

## License

Proprietary. See [LICENSE](LICENSE) for details.

## Author

Arun Neupane - [arunneupane.vercel.app](https://arunneupane.vercel.app)