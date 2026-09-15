/**
 * Guide registry: central source of truth for all guide metadata, structured
 * content blocks, and SEO data. The game-logic and design spec both require
 * 12+ rich guide pages for SEO/AEO/GEO.
 */

export type GuideCategory = "Basics" | "Modes" | "Strategy" | "Engine" | "Platform";

export interface FaqItem {
  question: string;
  answer: string;
}

type Tone = "info" | "tip" | "warning";

interface ParagraphBlock {
  type: "p";
  text: string;
}

interface HeadingBlock {
  type: "h2" | "h3";
  text: string;
}

interface ListBlock {
  type: "ul" | "ol";
  items: string[];
}

interface CalloutBlock {
  type: "callout";
  text?: string;
  tone?: Tone;
  title?: string;
}

interface StepsBlock {
  type: "steps";
  items: string[];
}

interface TableBlock {
  type: "table";
  header?: string[];
  rows: string[][];
}

interface CodeBlock {
  type: "code";
  code: string;
  language?: string;
}

interface BlockquoteBlock {
  type: "blockquote";
  text: string;
}

interface LinkListBlock {
  type: "link-list";
  links: { label: string; href: string }[];
}

interface SolverBlock {
  type: "solver";
}

export type ContentBlock =
  | ParagraphBlock
  | HeadingBlock
  | ListBlock
  | CalloutBlock
  | StepsBlock
  | TableBlock
  | CodeBlock
  | BlockquoteBlock
  | LinkListBlock
  | SolverBlock;

export interface GuideMeta {
  slug: string;
  title: string;
  description: string;
  category: GuideCategory;
  updated: string;
  readingTime: string;
  keywords: string[];
  faq?: FaqItem[];
  content: ContentBlock[];
}

import {
  whatIsLightsOut,
  howToPlay,
  classicMode,
  patternMode,
  dailyPuzzle,
  minimumMoves,
  timedMode,
  zenMode,
  tipsAndStrategies,
  lightsOutAlgorithm,
  howPuzzlesAreMade,
  statsAndAchievements,
  offlineAndPwa,
  keyboardAndAccessibility,
  themesAndAppearance,
  howToSolveLightsOut,
} from "./guide-content";

export const guides: GuideMeta[] = [
  whatIsLightsOut,
  howToPlay,
  classicMode,
  patternMode,
  dailyPuzzle,
  minimumMoves,
  timedMode,
  zenMode,
  tipsAndStrategies,
  howToSolveLightsOut,
  lightsOutAlgorithm,
  howPuzzlesAreMade,
  statsAndAchievements,
  offlineAndPwa,
  keyboardAndAccessibility,
  themesAndAppearance,
];

export function getGuideBySlug(slug: string): GuideMeta | undefined {
  return guides.find((g) => g.slug === slug);
}

export function getGuidesByCategory(category: GuideCategory): GuideMeta[] {
  return guides.filter((g) => g.category === category);
}

export const guideCategories = [
  "Basics",
  "Modes",
  "Strategy",
  "Engine",
  "Platform",
] as const;