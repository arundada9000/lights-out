import type { Metadata } from "next";
import Link from "next/link";
import { Lightbulb, Home, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "Page not found | Easy Lights Out",
  description: "This light is out. The page you are looking for cannot be found.",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  const miniBoard = [
    [1, 0, 1, 0, 1],
    [0, 1, 0, 1, 0],
    [1, 0, 1, 0, 1],
    [0, 1, 0, 1, 0],
    [1, 0, 1, 0, 1],
  ];

  return (
    <section className="flex flex-1 items-center justify-center py-20">
      <Container size="narrow" className="text-center">
        <div className="flex flex-col items-center gap-8">
          {/* Mini decorative board */}
          <div className="grid gap-1.5" style={{ gridTemplateColumns: "repeat(5, 1fr)" }} aria-hidden>
            {miniBoard.flat().map((cell, i) => (
              <span
                key={i}
                className={`h-6 w-6 rounded-[6px] sm:h-8 sm:w-8 ${
                  cell
                    ? "bg-amber-400/80 shadow-[0_0_10px_rgba(251,191,36,0.4)]"
                    : "bg-fill"
                }`}
              />
            ))}
          </div>

          <div className="flex flex-col items-center gap-3">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">
              404 - Page not found
            </p>
            <h1 className="text-3xl font-semibold tracking-tight text-label sm:text-4xl">
              Hmm, this light is out.
            </h1>
            <p className="max-w-md text-lg leading-relaxed text-label-secondary">
              The page you are looking for does not exist, or it may have moved
              to a new spot on the board.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link href="/">
                <Home className="h-4 w-4" />
                Back to Home
              </Link>
            </Button>
            <Button asChild variant="secondary" size="lg">
              <Link href="/guides">
                <BookOpen className="h-4 w-4" />
                Browse Guides
              </Link>
            </Button>
          </div>

          <Button asChild variant="ghost" size="md">
            <Link href="/play">
              <Lightbulb className="h-4 w-4" />
              Play Now
            </Link>
          </Button>
        </div>
      </Container>
    </section>
  );
}