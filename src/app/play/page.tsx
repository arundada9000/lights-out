import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { playMetadata } from "@/lib/seo";
import { PlayConsole } from "@/components/play/PlayConsole";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = playMetadata;

export default function PlayPage() {
  return (
    <section className="flex flex-1 flex-col py-10 sm:py-14">
      <Container size="narrow" className="max-w-4xl">
        <p className="etched text-label-tertiary">Game Console · Model LO-9000</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-label sm:text-4xl">
          Lights Out Console
        </h1>
        <p className="mt-3 max-w-2xl text-pretty leading-relaxed text-label-secondary">
          One instrument, one rule: tap a light and it toggles with its neighbours.
          Clear the whole grid to advance. Time mode gives you two minutes to clear
          as many boards as you can; endless mode keeps dealing new grids until you
          power off.
        </p>

        <div className="mt-8">
          <PlayConsole />
        </div>

        <div className="mt-8 grid gap-3 sm:grid-cols-3">
          <GuideCard
            href="/guides/how-to-play"
            index="01"
            title="How to Play"
            body="The plus-shaped toggle, and why pressing a cell twice cancels it."
          />
          <GuideCard
            href="/guides/lights-out-algorithm"
            index="02"
            title="Algorithms"
            body="The math behind solvable boards and the chase-the-lights method."
          />
          <GuideCard
            href="/guides"
            index="03"
            title="All Guides"
            body="Fifteen strategy entries covering every grid size and variant."
          />
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Link
            href="/"
            className="group inline-flex items-center gap-1.5 text-sm font-medium text-accent transition-colors duration-200 ease-ios hover:text-accent-strong"
          >
            Back to the demo
            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 ease-ios group-hover:translate-x-0.5" />
          </Link>
          <span className="text-label-tertiary">/</span>
          <Link
            href="/guides"
            className="group inline-flex items-center gap-1.5 text-sm font-medium text-accent transition-colors duration-200 ease-ios hover:text-accent-strong"
          >
            Explore guides
            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 ease-ios group-hover:translate-x-0.5" />
          </Link>
        </div>
      </Container>
    </section>
  );
}

function GuideCard({
  href,
  index,
  title,
  body,
}: {
  href: string;
  index: string;
  title: string;
  body: string;
}) {
  return (
    <Link
      href={href}
      className="group relative flex flex-col gap-2 overflow-hidden rounded-2xl border border-separator bg-surface-raised p-4 transition-all duration-300 ease-ios hover:border-accent/50 hover:bg-fill"
    >
      <span className="etched text-label-tertiary">{index}</span>
      <span className="text-sm font-semibold text-label transition-colors duration-200 ease-ios group-hover:text-accent">
        {title}
      </span>
      <span className="text-[13px] leading-snug text-label-secondary">{body}</span>
      <ArrowRight className="absolute bottom-4 right-4 h-4 w-4 text-label-tertiary transition-all duration-300 ease-ios group-hover:translate-x-0.5 group-hover:text-accent" />
    </Link>
  );
}