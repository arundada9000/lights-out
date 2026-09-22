## Summary

<!-- One or two sentences. What does this PR change and why? -->

## Type of change

- [ ] Bug fix
- [ ] New feature (engine / mode / guide / theme)
- [ ] UI or interaction polish
- [ ] Docs / refactor (no behaviour change)

## Checklist

- [ ] Branch is up to date with `main`
- [ ] `pnpm exec tsc --noEmit` passes
- [ ] `pnpm exec eslint .` passes
- [ ] `pnpm test` passes (83+ tests)
- [ ] `pnpm build` succeeds
- [ ] Detector is clean for changed `src/` files (see `docs/DEVELOPMENT.md`)
- [ ] Screenshots regenerated (`node scripts/shots.mjs`) if UI changed
- [ ] `CHANGELOG.md` updated for user-facing changes

## Behaviour changes

Before / after description. Screenshots go into `docs/screenshots` (viewport
frames only, desktop + mobile) and are linked here.

## Notes for reviewers

- Anything reviewers should know about the approach?
- Linked issue(s): #

## Risk

- [ ] Not sure / not applicable
- [ ] Low: contained change, covered by existing tests
- [ ] Medium: touches engine or persistence (structure/versions unchanged)
- [ ] High: changes snapshot format or prerendering; migration included