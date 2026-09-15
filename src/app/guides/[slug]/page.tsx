import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ChevronRight } from "lucide-react";
import { guides, getGuideBySlug, type ContentBlock } from "@/lib/guides";
import { site } from "@/lib/site";
import { GuideHero } from "@/components/guides/GuideHero";
import { GuideContent } from "@/components/guides/GuideContent";
import { Container } from "@/components/ui/Container";
import { ReadingProgress } from "@/components/motion/ReadingProgress";
import { cn } from "@/lib/cn";

interface GuidePageProps {
  params: Promise<{ slug: string }>;
}

type HeadingBlock = Extract<ContentBlock, { type: "h2" | "h3" }>;

interface OutlineEntry {
  id: string;
  text: string;
  level: HeadingBlock["type"];
}

function buildOutline(blocks: ContentBlock[]): OutlineEntry[] {
  return blocks
    .map((block, index) => ({ block, index }))
    .filter((entry): entry is { block: HeadingBlock; index: number } =>
      entry.block.type === "h2" || entry.block.type === "h3"
    )
    .map(({ block, index }) => ({
      id: `guide-${index}`,
      text: block.text,
      level: block.type,
    }));
}

export function generateStaticParams() {
  return guides.map((guide) => ({ slug: guide.slug }));
}

export async function generateMetadata({ params }: GuidePageProps): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);
  if (!guide) return { title: "Guide not found" };

  const url = new URL(`/guides/${guide.slug}`, site.url);

  return {
    title: `${guide.title} | Easy Lights Out`,
    description: guide.description,
    keywords: guide.keywords,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      siteName: site.name,
      title: guide.title,
      description: guide.description,
      url,
    },
    twitter: {
      card: "summary_large_image",
      title: guide.title,
      description: guide.description,
    },
  };
}

export default async function GuidePage({ params }: GuidePageProps) {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);

  if (!guide) {
    return (
      <Container className="py-24 text-center">
        <h1 className="text-2xl font-semibold text-label">Guide not found</h1>
      </Container>
    );
  }

  const index = guides.findIndex((g) => g.slug === slug);
  const prev = index > 0 ? guides[index - 1] : undefined;
  const next = index < guides.length - 1 ? guides[index + 1] : undefined;
  const outline = buildOutline(guide.content);

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: site.url },
      { "@type": "ListItem", position: 2, name: "Guides", item: `${site.url}/guides` },
      {
        "@type": "ListItem",
        position: 3,
        name: guide.title,
        item: `${site.url}/guides/${guide.slug}`,
      },
    ],
  };

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: guide.title,
    description: guide.description,
    dateModified: guide.updated,
    author: {
      "@type": "Person",
      name: site.developer.name,
      url: site.developer.site,
    },
    publisher: {
      "@type": "Organization",
      name: site.name,
      url: site.url,
    },
    mainEntityOfPage: `${site.url}/guides/${guide.slug}`,
  };

  const faqJsonLd = guide.faq
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: guide.faq.map((f) => ({
          "@type": "Question",
          name: f.question,
          acceptedAnswer: { "@type": "Answer", text: f.answer },
        })),
      }
    : null;

  return (
    <>
      <ReadingProgress />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      {faqJsonLd ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      ) : null}

      <GuideHero
        category={guide.category}
        title={guide.title}
        description={guide.description}
        readingTime={guide.readingTime}
        updated={guide.updated}
      />

      <Container className="py-12 sm:py-16">
        <div className="gap-12 xl:grid xl:grid-cols-[minmax(0,1fr)_16rem] xl:gap-16">
          {/* Article */}
          <article className="mx-auto w-full max-w-2xl xl:mx-0">
            <GuideContent blocks={guide.content} />

            {/* Continue plate */}
            <div className="mt-14 overflow-hidden rounded-ios-2xl border border-separator/70 bg-surface-raised shadow-card">
              <div className="grid sm:grid-cols-2">
                {prev ? (
                  <Link
                    href={`/guides/${prev.slug}`}
                    className="group flex flex-col gap-2 border-b border-separator/70 p-5 transition-colors duration-200 ease-ios hover:bg-fill focus-visible:ring-focused sm:border-b-0 sm:border-r sm:p-6"
                  >
                    <span className="etched flex items-center gap-1.5 text-[9px]">
                      <ArrowLeft className="h-3 w-3" aria-hidden />
                      Previous entry
                    </span>
                    <span className="mt-1 text-[15px] font-semibold tracking-tight text-label transition-colors duration-200 group-hover:text-accent">
                      {prev.title}
                    </span>
                    <span className="text-xs text-label-tertiary">{prev.readingTime} read</span>
                  </Link>
                ) : (
                  <span aria-hidden />
                )}

                {next ? (
                  <Link
                    href={`/guides/${next.slug}`}
                    className="group flex flex-col items-end gap-2 border-t border-separator/70 p-5 text-right transition-colors duration-200 ease-ios hover:bg-fill focus-visible:ring-focused sm:border-l-0 sm:border-t-0 sm:p-6"
                  >
                    <span className="etched flex items-center gap-1.5 text-[9px]">
                      Next entry
                      <ArrowRight className="h-3 w-3" aria-hidden />
                    </span>
                    <span className="mt-1 text-[15px] font-semibold tracking-tight text-label transition-colors duration-200 group-hover:text-accent">
                      {next.title}
                    </span>
                    <span className="text-xs text-label-tertiary">{next.readingTime} read</span>
                  </Link>
                ) : (
                  <span aria-hidden />
                )}
              </div>
            </div>

            <div className="mt-8 flex justify-center">
              <Link
                href="/guides"
                className="inline-flex items-center gap-2 text-sm font-medium text-accent transition-opacity duration-200 hover:opacity-80 focus-visible:rounded-ios-sm focus-visible:ring-focused"
              >
                <ChevronRight className="h-4 w-4 rotate-180" />
                Back to all guides
              </Link>
            </div>
          </article>

          {/* Outline rail */}
          {outline.length > 0 ? (
            <aside className="hidden xl:block" aria-label="On this page">
              <div className="sticky top-24 flex flex-col rounded-ios-xl border border-separator/70 bg-surface-raised p-5 shadow-card">
                <p className="etched mb-3 flex items-center gap-1.5 text-[10px]">
                  <span aria-hidden className="led" />
                  Contents
                </p>
                <nav className="flex flex-col">
                  {outline.map((entry) => (
                    <a
                      key={entry.id}
                      href={`#${entry.id}`}
                      className={cn(
                        "border-l border-separator py-1.5 pl-3 text-[13px] leading-snug text-label-tertiary transition-colors duration-200 ease-ios hover:border-accent hover:text-label",
                        entry.level === "h3" && "pl-6"
                      )}
                    >
                      {entry.text}
                    </a>
                  ))}
                </nav>
              </div>
            </aside>
          ) : null}
        </div>
      </Container>
    </>
  );
}