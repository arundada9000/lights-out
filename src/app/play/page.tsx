import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Construction } from "lucide-react";
import { playMetadata } from "@/lib/seo";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = playMetadata;

export default function PlayPage() {
  return (
    <section className="flex flex-1 items-center justify-center py-24">
      <Container size="narrow" className="text-center">
        <div className="flex flex-col items-center gap-7">
          <div className="flex h-20 w-20 items-center justify-center rounded-[24px] bg-fill">
            <Construction className="h-9 w-9 text-accent" strokeWidth={1.8} />
          </div>

          <h1 className="text-3xl font-semibold tracking-tight text-label sm:text-4xl">
            Coming Soon
          </h1>

          <p className="max-w-md text-lg leading-relaxed text-label-secondary">
            The full game is currently being built. In the meantime, try the
            interactive demo on the{" "}
            <Link href="/" className="font-medium text-accent hover:underline">
              home page
            </Link>{" "}
            or explore our{" "}
            <Link href="/guides" className="font-medium text-accent hover:underline">
              guides
            </Link>{" "}
            to learn the rules and strategies.
          </p>

          <div className="mt-2 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link href="/">
                <ArrowLeft className="h-4 w-4" />
                Back to Demo
              </Link>
            </Button>
            <Button asChild variant="ghost" size="lg">
              <Link href="/guides">Browse Guides</Link>
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}