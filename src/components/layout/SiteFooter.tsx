import Link from "next/link";
import { ChevronRight, ExternalLink } from "lucide-react";
import { site } from "@/lib/site";
import { Container } from "@/components/ui/Container";

const footerLinks = [
  {
    rack: "01",
    title: "Instrument",
    links: [
      { href: "/play", label: "Power On" },
      { href: "/guides", label: "Guides" },
      { href: "/guides/how-to-play", label: "How to Play" },
    ],
  },
  {
    rack: "02",
    title: "Modes",
    links: [
      { href: "/guides/classic-mode", label: "Classic" },
      { href: "/guides/pattern-mode", label: "Pattern" },
      { href: "/guides/zen-mode", label: "Zen" },
    ],
  },
  {
    rack: "03",
    title: "Manual",
    links: [
      { href: "/guides/what-is-lights-out", label: "About the Game" },
      { href: "/guides/lights-out-algorithm", label: "The Math" },
      { href: "/guides/tips-and-strategies", label: "Tips & Strategy" },
    ],
  },
];

const socials = [
  { name: "GitHub", href: site.social.github, mark: "GH" },
  { name: "X", href: site.social.twitter, mark: "X" },
  { name: "LinkedIn", href: site.social.linkedin, mark: "in" },
  { name: "Instagram", href: site.social.instagram, mark: "IG" },
];

export function SiteFooter() {
  return (
    <footer className="relative mt-auto overflow-hidden border-t border-separator bg-group">
      {/* Plate seam */}
      <span aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px bg-accent/30" />

      <Container className="pt-12 pb-12 sm:pt-16">
        {/* Upper plate */}
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1.95fr)] lg:gap-16">
          {/* Brand module */}
          <div className="flex flex-col gap-6">
            <Link href="/" className="flex w-fit items-center gap-3" aria-label={`${site.name} home`}>
              <span
                aria-hidden
                className="grid h-10 w-10 grid-cols-3 gap-[3px] rounded-[10px] border border-separator bg-surface-raised p-[7px] shadow-card"
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
              <span className="flex flex-col">
                <span className="text-[15px] font-semibold tracking-tight text-label">
                  Easy Lights Out
                </span>
                <span className="etched mt-0.5 text-[9px]">Logic instrument - PWA</span>
              </span>
            </Link>

            <p className="max-w-xs text-sm leading-relaxed text-label-secondary">
              A classic logic puzzle, rebuilt as a modular instrument. Free, offline, and
              configurable to the last LED.
            </p>

            {/* Social signal */}
            <div className="flex flex-col gap-2.5">
              <span className="etched text-[9px]">Social signal</span>
              <div className="flex items-center gap-2">
                {socials.map((s) => (
                  <a
                    key={s.name}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${s.name}, @${site.developer.handle}`}
                    className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-[10px] border border-separator bg-surface-raised font-mono text-[11px] font-bold text-label-tertiary shadow-card transition-all duration-200 ease-ios hover:-translate-y-0.5 hover:border-accent/50 hover:text-accent focus-visible:ring-focused"
                  >
                    <span aria-hidden>{s.mark}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Link rack */}
          <div className="grid gap-3 sm:grid-cols-3">
            {footerLinks.map((group) => (
              <div
                key={group.title}
                className="flex flex-col rounded-ios-xl border border-separator/70 bg-surface-raised p-5 shadow-card"
              >
                <div className="mb-4 flex items-center justify-between border-b border-separator pb-3">
                  <span className="etched text-[9px]">{group.title}</span>
                  <span className="slot-readout text-[10px] text-label-tertiary">{group.rack}</span>
                </div>
                <ul className="flex flex-col gap-1">
                  {group.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="group flex items-center justify-between gap-2 rounded-ios-md px-2 py-1.5 text-sm text-label-secondary transition-all duration-200 ease-ios hover:bg-fill hover:text-label focus-visible:ring-focused"
                      >
                        <span>{link.label}</span>
                        <ChevronRight
                          className="h-3.5 w-3.5 text-label-tertiary opacity-0 transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-accent group-hover:opacity-100"
                          aria-hidden
                        />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom rail */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-separator pt-6 sm:flex-row">
          <p className="text-xs text-label-tertiary">
            &copy; {new Date().getFullYear()} {site.developer.name}. All rights reserved.
          </p>

          <div className="hidden items-center gap-2 sm:flex" aria-hidden>
            <span className="led dim" />
            <span className="led dim" />
            <span className="led" />
            <span className="etched ml-1.5 text-[9px]">Free - Offline-ready</span>
          </div>

          <div className="flex items-center gap-4 text-xs text-label-tertiary">
            <a
              href={site.social.github}
              className="flex items-center gap-1.5 transition-colors duration-200 ease-ios hover:text-label focus-visible:ring-focused"
              target="_blank"
              rel="noopener noreferrer"
            >
              <ExternalLink className="h-3.5 w-3.5" aria-hidden />
              Source
            </a>
            <span aria-hidden className="h-3 w-px bg-separator" />
            <p>
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
        </div>
      </Container>
    </footer>
  );
}