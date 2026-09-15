import type { Metadata } from "next";
import { site } from "./site";

interface PageMetaInput {
  title: string;
  description: string;
  path: string;
  keywords?: readonly string[];
  /**
   * When true, the page is not indexed (mirrors robots directives).
   */
  noIndex?: boolean;
  /**
   * Canonical path when it differs from `path`.
   */
  canonicalPath?: string;
}

export function buildMetadata({
  title,
  description,
  path,
  keywords,
  noIndex = false,
  canonicalPath,
}: PageMetaInput): Metadata {
  const canonical = canonicalPath ?? path;
  const url = new URL(canonical, site.url);

  return {
    title,
    description,
    keywords: keywords ? [...keywords] : undefined,
alternates: {
    canonical: url,
  },
    robots: {
      index: !noIndex,
      follow: true,
      googleBot: {
        index: !noIndex,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    openGraph: {
      type: "website",
      siteName: site.name,
      title,
      description,
      url,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export const homeMetadata = buildMetadata({
  title: "Easy Lights Out: Tap. Think. Switch it all off.",
  description: site.description,
  path: "/",
  keywords: site.keywords,
});

export const guidesIndexMetadata = buildMetadata({
  title: "Guides & Learning Hub | Easy Lights Out",
  description:
    "Master the Lights Out puzzle with detailed guides: rules, game modes, winning strategies, the mathematics behind the board, and offline play.",
  path: "/guides",
  keywords: [
    "lights out guide",
    "how to win lights out",
    "lights out strategy",
    "lights out math",
    "lights out solver",
  ],
});

export const playMetadata = buildMetadata({
  title: "Play Lights Out | Easy Lights Out",
  description:
    "Play the classic Lights Out puzzle board game instantly. Tap cells, flip their neighbors, and solve every grid.",
  path: "/play",
  keywords: site.keywords,
});