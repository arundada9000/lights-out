# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary: design/aesthetic-first audience. Visitors judge the site itself; the page is a portfolio-level visual statement as much as a game funnel. Secondary audiences the site must still serve: casual puzzle players who want to relax and play, and search-driven readers arriving from Google/AEO/GEO queries who want to learn about Lights Out.

## Product Purpose

Easy Lights Out is a production-quality, iOS-HIG-inspired Lights Out puzzle game as a fully free, offline-first PWA. The marketing surface (landing page plus 15 guide pages) exists to demonstrate the product's visual ambition and to rank for the Lights Out query space. The game itself is planned; this phase builds the marketing site to award-level craft with full-immersion motion.

## Positioning

A neighborhood product could not truthfully copy this combination: iOS-grade native feel and physics, an all-themes-and-accents customization system (themes, accents, fonts, font sizes, spacing, sounds, haptics, motion) with no backend and full offline PWA support. "Everything configurable, everything intentional, nothing default."

## Operating Context

Primary use on mobile and desktop browsers; users can install the site as a PWA and play offline. Theme depends on OS light/dark preference plus explicit user choice; all preferences persist locally. The demo board on the landing page is a real, solvable Lights Out board, not a mock.

## Capabilities and Constraints

- Source of truth: `rules/rules.md` > `rules/design.md` (both gitignored); ask on any contradiction.
- No backend this phase. Fully free, offline-working PWA.
- Game modes planned: classic, pattern, daily puzzle, timed, zen; statistics and achievements; offline and PWA; themes and appearance; minimum-moves parity targeting.
- 15 guide pages already authored in `src/lib/guide-content/` for SEO/AEO/GEO.
- Marketing site stack: Next.js 16 (App Router, Turbopack), React 19, TypeScript strict, Tailwind v4, pnpm, lucide-react.
- Design rules: no emojis, no em dashes, no AI-slop wording; everything intentional and custom (context menus, scrollbars, cursors, modals, popups, toasts, cursors); big touch targets; cursor pointer where interactive.
- Keyboard shortcuts and a command palette are planned for the game app, with shortcut documentation.
- Performance targets: LCP under 2.5s, CLS under 0.1; reduced-motion respected; language-readiness in markup.
- Proprietary license; nothing may be reused without explicit permission.

## Brand Commitments

- Name: Easy Lights Out (package `easylightsout`), hosted at easylightsout.vercel.app.
- Tagline: "Tap. Think. Switch it all off."
- Visual ambition (user-confirmed binding): Awwwards-level landing and guide pages with full-immersion motion; the site's own looks are a product.
- Implement every theme from the referenced loksewa project (`D:\Programming\html-css\loksewa quiz hosted`): paper, slate, midnight, sepia, mist, contrast, ocean, grape; plus fully user-configurable accents, fonts, font sizes, spacing, themes, appearance, sounds, and haptics, all variable-driven and not hardcoded.
- iOS Human Interface Guidelines inspired with an original identity; haptic feedback, touch physics, breadcrumbed purpose.
- Developer attribution: use only relevant info from `C:\Users\arunn\Desktop\ARUN-PROFILE.md`; a styled, humorous console message is required.
- SEO/AEO/GEO: homepage, guides, sitemap, robots, structured data (FAQ, Article, Breadcrumb, WebApplication, CollectionPage).

## Evidence on Hand

- `rules/design.md` full product requirements (gitignored).
- `rules/tracker.md` progress record.
- 15 authored guide identities and bodies in `src/lib/guide-content/`.
- Theme token source: `rules.css` theme blocks at `D:\Programming\html-css\loksewa quiz hosted\style.css` lines 9-281.
- No testimonials, benchmarks, or deployment numbers exist; none may be fabricated.

## Product Principles

1. Every pixel is intentional; nothing ships from a browser default (scrollbars, cursors, context menus, modals, toasts, copy).
2. The user owns the look: themes, accents, typography, spacing, motion, sound, and haptics are all configurable through variables and persisted locally.
3. Motion is buttery and full-immersion but always purposeful, with a bulletproof reduced-motion path.
4. The interface must feel like a native iOS game, not a website playing dress-up.
5. Marketing content reflects real product truth; no fake buttons, placeholders, or claims of unimplemented features.

## Accessibility & Inclusion

Requirements from the design spec: semantic HTML, keyboard support, explicit focus states, contrast standards, big touch targets, `prefers-reduced-motion` respected, and a dedicated high-contrast theme among the shipped themes.