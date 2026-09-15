import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, BookOpen, Lightbulb, Binary, Shapes, Settings, Target } from "lucide-react";
import { guidesIndexMetadata } from "@/lib/seo";
import { guides, guideCategories } from "@/lib/guides";
import { site } from "@/lib/site";
import { Container } from "@/components/ui/Container";
import { SectionHeading, PlateLabel } from "@/components/ui/SectionHeading";
import { Badge } from "@/components/ui/Badge";
import { Reveal } from "@/components/motion/Reveal";

export const metadata: Metadata = guidesIndexMetadata;

const categoryIcons: Record<string, typeof Lightbulb> = {
  Basics: Lightbulb,
  Modes: Shapes,
  Strategy: Target,
  Engine: Binary,
  Platform: Settings,
};

export default function GuidesIndexPage() {
  const listingJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Easy Lights Out Guides",
    url: `${site.url}/guides`,
    description: "Guides, strategies, and deep dives into the Lights Out puzzle game.",
    mainEntity: guides.map((g) => ({
      "@type": "Article",
      headline: g.title,
      url: `${site.url}/guides/${g.slug}`,
      description: g.description,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(listingJsonLd) }}
      />

      <div className="relative overflow-hidden border-b border-separator bg-group">
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 blueprint-grid opacity-40" aria-hidden />
        <Container className="relative py-12 sm:py-16">
          <nav aria-label="Breadcrumb" className="mb-8">
            <ol className="flex flex-wrap items-center gap-1.5 text-sm text-label-tertiary">
              <li>
                <Link href="/" className="transition-colors hover:text-label">Home</Link>
              </li>
              <li aria-hidden>/</li>
              <li aria-current="page" className="text-label">Guides</li>
            </ol>
          </nav>
          <PlateLabel>Manual &middot; {guides.length} entries</PlateLabel>
          <SectionHeading
            align="left"
            title="Guides for every Lights Out player"
            description="Fifteen in-depth guides covering the rules, modes, strategy, the mathematics, and the features behind Easy Lights Out."
          />
        </Container>
      </div>

      <Container className="py-12 sm:py-16">
        <div className="flex flex-col gap-14">
          {guideCategories.map((category, ci) => {
            const guidesInCategory = guides.filter((g) => g.category === category);
            if (guidesInCategory.length === 0) return null;
            const Icon = categoryIcons[category] ?? BookOpen;
            return (
              <Reveal key={category} delay={ci * 60}>
                <div className="mb-6 flex items-center justify-between border-b border-separator pb-4">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-[11px] border border-separator bg-surface-raised text-accent shadow-card">
                      <Icon className="h-5 w-5" strokeWidth={2} aria-hidden />
                    </span>
                    <div className="flex flex-col">
                      <h2 className="etched text-[12px] text-label">{category}</h2>
                      <span className="mt-1 text-[11px] text-label-tertiary capitalize">
                        Rack {String(ci + 1).padStart(2, "0")}
                      </span>
                    </div>
                  </div>
                  <Badge tone="neutral">{guidesInCategory.length} entries</Badge>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  {guidesInCategory.map((guide) => (
                    <Link
                      key={guide.slug}
                      href={`/guides/${guide.slug}`}
                      className="group relative flex flex-col gap-2 overflow-hidden rounded-[18px] border border-separator/70 bg-surface-raised p-6 shadow-card transition-all duration-200 ease-ios hover:-translate-y-0.5 hover:border-accent/30 hover:shadow-raised focus-visible:ring-focused"
                    >
                      <span aria-hidden className="led absolute right-6 top-6 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                      <div className="flex items-start justify-between gap-4">
                        <h3 className="text-[15px] font-semibold tracking-tight text-label transition-colors duration-200 ease-ios group-hover:text-accent">
                          {guide.title}
                        </h3>
                        <ChevronRight className="mt-0.5 h-4 w-4 flex-shrink-0 text-label-tertiary transition-transform duration-200 ease-ios group-hover:translate-x-0.5" aria-hidden />
                      </div>
                      <p className="line-clamp-2 text-sm leading-relaxed text-label-secondary">
                        {guide.description}
                      </p>
                      <div className="mt-1 flex items-center gap-2">
                        <Badge tone="neutral">{guide.category}</Badge>
                        <span className="etched text-[9px]">
                          {guide.readingTime} &middot; {guide.updated}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </Reveal>
            );
          })}
        </div>
      </Container>
    </>
  );
}