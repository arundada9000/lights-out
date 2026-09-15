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

        <div className="flex flex-col gap-5">
          <div className="flex items-center gap-3">
            <span className="led" aria-hidden />
            <Badge tone="accent">
              <span className="etched text-[9px]">{category}</span>
            </Badge>
          </div>
          <h1 className="max-w-3xl text-3xl font-semibold leading-[1.08] tracking-tight text-label sm:text-[2.6rem]">
            {title}
          </h1>
          <p className="max-w-2xl text-lg leading-relaxed text-label-secondary">
            {description}
          </p>
          <div className="mt-1 flex flex-wrap items-center gap-x-5 gap-y-2">
            <span className="flex items-center gap-2">
              <span className="led dim" aria-hidden />
              <span className="etched text-[10px]">
                <Clock className="mr-1.5 inline h-3.5 w-3.5" aria-hidden />
                {readingTime} read
              </span>
            </span>
            <span className="flex items-center gap-2">
              <span className="led dim" aria-hidden />
              <span className="etched text-[10px]">
                <FileText className="mr-1.5 inline h-3.5 w-3.5" aria-hidden />
                Updated {updated}
              </span>
            </span>
          </div>
        </div>
      </Container>
    </div>
  );
}