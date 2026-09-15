import Link from "next/link";
import { Clock, FileText } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";

interface GuideHeroProps {
  category: string;
  title: string;
  description: string;
  readingTime: string;
  updated: string;
  categoryHref?: string;
}

export function GuideHero({
  category,
  title,
  description,
  readingTime,
  updated,
  categoryHref,
}: GuideHeroProps) {
  return (
    <div className="relative overflow-hidden border-b border-separator bg-group">
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 blueprint-grid opacity-40" aria-hidden />
      <span aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px bg-accent/30" />
      <Container className="relative py-12 sm:py-16">
        <nav aria-label="Breadcrumb" className="mb-8">
          <ol className="flex flex-wrap items-center gap-1.5 text-sm text-label-tertiary">
            <li>
              <Link href="/" className="transition-colors hover:text-label">Home</Link>
            </li>
            <li aria-hidden>/</li>
            <li>
              <Link href="/guides" className="transition-colors hover:text-label">Guides</Link>
            </li>
            {categoryHref ? (
              <>
                <li aria-hidden>/</li>
                <li>
                  <Link href={categoryHref} className="transition-colors hover:text-label">
                    {category}
                  </Link>
                </li>
              </>
            ) : (
              <li aria-current="page" className="text-label">{category}</li>
            )}
          </ol>
        </nav>

        <div className="flex max-w-3xl flex-col gap-5">
          <div className="flex items-center gap-3">
            <span className="led" aria-hidden />
            <Badge tone="accent">{category}</Badge>
          </div>
          <h1 className="text-3xl font-semibold leading-[1.08] tracking-tight text-label sm:text-[2.6rem]">
            {title}
          </h1>
          <p className="text-lg leading-relaxed text-label-secondary">
            {description}
          </p>
          <div className="mt-1 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-separator/70 pt-4 text-sm text-label-tertiary">
            <span className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" strokeWidth={2} aria-hidden />
              {readingTime} read
            </span>
            <span aria-hidden className="h-3 w-px bg-separator" />
            <span className="flex items-center gap-1.5">
              <FileText className="h-3.5 w-3.5" strokeWidth={2} aria-hidden />
              Updated {updated}
            </span>
          </div>
        </div>
      </Container>
    </div>
  );
}