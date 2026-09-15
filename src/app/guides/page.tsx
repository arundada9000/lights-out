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

  const categoryStart = guideCategories.reduce<Record<string, number>>((acc, category) => {
    const soFar = guideCategories
      .slice(0, guideCategories.indexOf(category))
      .reduce((sum, cat) => sum + guides.filter((g) => g.category === cat).length, 0);
    acc[category] = soFar;
    return acc;
  }, {});

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
          <PlateLabel>Manual - {guides.length} entries</PlateLabel>
          <SectionHeading
            align="left"
            title="Guides for every Lights Out player"
            description="Sixteen in-depth guides covering the rules, modes, strategy, the mathematics, and the features behind Easy Lights Out."
          />
        </Container>
      </div>

      <Container className="py-12 sm:py-16">
        <div className="flex flex-col gap-10">
          {guideCategories.map((category, ci) => {
            const guidesInCategory = guides.filter((g) => g.category === category);
            if (guidesInCategory.length === 0) return null;
            const Icon = categoryIcons[category] ?? BookOpen;
            const startIndex = categoryStart[category] ?? 0;
            const inCategoryIndex = (idx: number) => startIndex + idx;

            return (
              <Reveal key={category} delay={ci * 60}>
                <div className="overflow-hidden rounded-ios-2xl border border-separator/70 bg-surface-raised shadow-card">
                  {/* Category header */}
                  <div className="flex items-center justify-between border-b border-separator bg-fill/40 px-5 py-3.5 sm:px-6">
                    <div className="flex items-center gap-3">
                      <span className="flex h-9 w-9 items-center justify-center rounded-[10px] border border-separator bg-surface-raised text-accent shadow-card">
                        <Icon className="h-4.5 w-4.5" strokeWidth={2} aria-hidden />
                      </span>
                      <h2 className="text-[15px] font-semibold tracking-tight text-label">
                        {category}
                      </h2>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge tone="neutral">
                        {guidesInCategory.length} {guidesInCategory.length === 1 ? "entry" : "entries"}
                      </Badge>
                      <span className="slot-readout hidden text-[10px] text-label-tertiary sm:block">
                        Rack {String(ci + 1).padStart(2, "0")}
                      </span>
                    </div>
                  </div>

                  {/* Entry rows */}
                  <ul className="flex flex-col">
                    {guidesInCategory.map((guide, gi) => (
                      <li key={guide.slug}>
                        <Link
                          href={`/guides/${guide.slug}`}
                          className="group grid items-center gap-x-4 gap-y-1 border-b border-separator/60 px-5 py-4 transition-colors duration-200 ease-ios hover:bg-fill focus-visible:ring-focused sm:grid-cols-[2.5rem_minmax(0,1fr)_auto] sm:px-6 last:border-0"
                        >
                          <span
                            aria-hidden
                            className="slot-readout hidden text-sm font-bold text-label-tertiary transition-colors duration-200 group-hover:text-accent sm:block"
                          >
                            {String(inCategoryIndex(gi) + 1).padStart(2, "0")}
                          </span>
                          <span className="flex min-w-0 flex-col gap-1">
                            <span className="truncate text-[15px] font-semibold tracking-tight text-label transition-colors duration-200 group-hover:text-accent">
                              {guide.title}
                            </span>
                            <span className="line-clamp-1 text-sm text-label-secondary">
                              {guide.description}
                            </span>
                          </span>
                          <span className="col-start-2 flex items-center justify-between gap-3 sm:col-start-3">
                            <span className="etched hidden text-[9px] md:block">
                              {guide.readingTime}
                            </span>
                            <ChevronRight
                              className="h-4 w-4 flex-shrink-0 text-label-tertiary transition-all duration-200 ease-ios group-hover:translate-x-0.5 group-hover:text-accent"
                              aria-hidden
                            />
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            );
          })}
        </div>
      </Container>
    </>
  );
}