# Changelog

All notable changes to Easy Lights Out are documented here.

## [0.1.0] - 2026-09-15

### Added
- Lights Out game engine with generation, solver, hints, undo/redo, and six modes (Classic, Pattern, Daily, Minimum Moves, Timed, Zen).
- Game scene with LED board, goal pattern, HUD readouts, save-and-continue, and keyboard controls.
- Custom UI layer: command palette (Cmd/Ctrl+K), toast notifications, board context menu, tooltips, and brand cursor.
- Statistics and records with daily streaks, all stored locally and offline.
- Sixteen guides including an interactive Lights Out solver.
- Progressive Web App: installable, theme-aware, service worker with offline navigation.
- Eight data-theme surfaces and twelve accent colours.

### Fixed
- Clock interval not starting in development under React Strict Mode.
- Move counter display when the counter is hidden.
- Result screen state after auto-next and restart.

### Notes
- Source of truth for planning lives in the gitignored `rules/` directory.
- The project is provided under a proprietary license.