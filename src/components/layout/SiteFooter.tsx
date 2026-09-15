import Link from "next/link";
import { site } from "@/lib/site";
import { Container } from "@/components/ui/Container";

const footerLinks = [
  {
    title: "Instrument",
    links: [
      { href: "/play", label: "Power On" },
      { href: "/guides", label: "Guides" },
      { href: "/guides/how-to-play", label: "How to Play" },
    ],
  },
  {
    title: "Modes",
    links: [
      { href: "/guides/classic-mode", label: "Classic" },
      { href: "/guides/pattern-mode", label: "Pattern" },
      { href: "/guides/daily-puzzle", label: "Daily" },
      { href: "/guides/zen-mode", label: "Zen" },
    ],
  },
  {
    title: "Manual",
    links: [
      { href: "/guides/lights-out-algorithm", label: "The Math" },
      { href: "/guides/tips-and-strategies", label: "Tips & Strategy" },
      { href: "/guides/what-is-lights-out", label: "About the Game" },
      { href: "/guides/statistics-and-achievements", label: "Stats & Records" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="mt-auto overflow-hidden border-t border-separator bg-group">
      <Container className="pt-12 pb-8 sm:pt-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand / status column */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="flex items-center gap-3" aria-label={`${site.name} home`}>
              <span
                aria-hidden
                className="grid h-9 w-9 grid-cols-3 gap-[3px] rounded-[9px] border border-separator bg-surface-raised p-[6px] shadow-card"
              >
                {Array.from({ length: 9 }).map((_, i) => {
                  const on = i % 2 === 0;
                  return (
                    <span
                      key={i}
                      className="rounded-[2px]"
                      style={{
                        backgroundColor: on ? "var(--accent)" : "var(--fill-secondary)",
                        boxShadow: on
                          ? "0 0 6px color-mix(in srgb, var(--accent) 70%, transparent)"
                          : undefined,
                      }}
                    />
                  );
                })}
              </span>
              <span className="text-[15px] font-semibold tracking-tight text-label">
                Easy Lights Out
              </span>
            </Link>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-label-secondary">
              {site.tagline} A classic logic puzzle, rebuilt as a modular instrument for the
              modern web.
            </p>
            <div className="mt-5 flex items-center gap-2.5 rounded-ios-lg border border-separator bg-surface-raised px-3.5 py-2.5 w-fit">
              <span className="led" aria-hidden />
              <span className="led dim" aria-hidden />
              <span className="flex items-center gap-1.5">
                <span className="led" aria-hidden style={{ backgroundColor: "var(--success)" }} />
                <span className="etched text-[9px]">All systems nominal</span>
              </span>
            </div>
          </div>

          {/* Link columns */}
          {footerLinks.map((group) => (
            <div key={group.title}>
              <h4 className="etched mb-4 text-[11px]">{group.title}</h4>
              <ul className="flex flex-col gap-2">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-label-secondary transition-all duration-200 ease-ios hover:text-label hover:translate-x-0.5 focus-visible:rounded-ios-sm focus-visible:ring-focused"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom rail */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-separator pt-6 sm:flex-row">
          <p className="text-xs text-label-tertiary">
            &copy; {new Date().getFullYear()} {site.developer.name}. All rights reserved.
          </p>
          <p className="text-xs text-label-tertiary">
            Built by{" "}
            <a
              href={site.developer.site}
              className="text-accent transition-colors duration-200 ease-ios hover:underline focus-visible:ring-focused"
              target="_blank"
              rel="noopener noreferrer"
            >
              {site.developer.name}
            </a>
          </p>
        </div>
      </Container>
    </footer>
  );
}