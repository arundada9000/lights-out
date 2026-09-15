import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, ArrowLeft, ArrowRight } from "lucide-react";
import { guides, getGuideBySlug } from "@/lib/guides";
import { site } from "@/lib/site";
import { GuideHero } from "@/components/guides/GuideHero";
import { GuideContent } from "@/components/guides/GuideContent";
import { Container } from "@/components/ui/Container";

interface GuidePageProps {
  params: Promise<{ slug: string }>;
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
        <div className="mx-auto max-w-3xl">
          <GuideContent blocks={guide.content} />

          {/* Prev / next */}
          <div className="mt-14 grid gap-3 border-t border-separator pt-8 sm:grid-cols-2">
            {prev ? (
              <Link
                href={`/guides/${prev.slug}`}
                className="group flex items-center gap-3 rounded-ios-lg border border-separator/70 bg-surface-raised px-5 py-4 shadow-card transition-all duration-200 ease-ios hover:-translate-y-0.5 hover:shadow-raised focus-visible:ring-focused"
              >
                <ArrowLeft className="h-4 w-4 flex-shrink-0 text-label-tertiary transition-colors group-hover:text-accent" />
                <div className="flex min-w-0 flex-col gap-1">
                  <span className="etched text-[9px]">Previous entry</span>
                  <span className="truncate text-sm font-medium text-label">
                    {prev.title}
                  </span>
                </div>
              </Link>
            ) : (
              <span aria-hidden />
            )}
            {next ? (
              <Link
                href={`/guides/${next.slug}`}
                className="group flex items-center justify-end gap-3 rounded-ios-lg border border-separator/70 bg-surface-raised px-5 py-4 text-right shadow-card transition-all duration-200 ease-ios hover:-translate-y-0.5 hover:shadow-raised focus-visible:ring-focused"
              >
                <div className="flex min-w-0 flex-col gap-1">
                  <span className="etched text-[9px]">Next entry</span>
                  <span className="truncate text-sm font-medium text-label">
                    {next.title}
                  </span>
                </div>
                <ArrowRight className="h-4 w-4 flex-shrink-0 text-label-tertiary transition-colors group-hover:text-accent" />
              </Link>
            ) : (
              <span aria-hidden />
            )}
          </div>

          {/* Back to guides */}
          <div className="mt-8 flex justify-center">
            <Link
              href="/guides"
              className="inline-flex items-center gap-2 text-sm font-medium text-accent transition-opacity duration-200 hover:opacity-80 focus-visible:rounded-ios-sm focus-visible:ring-focused"
            >
              <ChevronRight className="h-4 w-4 rotate-180" />
              Back to all guides
            </Link>
          </div>
        </div>
      </Container>
    </>
  );
}