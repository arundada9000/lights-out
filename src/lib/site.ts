export const site = {
  name: "Easy Lights Out",
  shortName: "Lights Out",
  domain: "easylightsout.vercel.app",
  url: "https://easylightsout.vercel.app",
  tagline: "Tap. Think. Switch it all off.",
  description:
    "Easy Lights Out is a beautifully crafted Lights Out puzzle game. Tap a cell to flip it and its neighbors, then solve every board in as few moves as possible. Free, offline, and installable as a PWA.",
  keywords: [
    "lights out",
    "lights out game",
    "lights out puzzle",
    "classic puzzle game",
    "logic game",
    "brain teaser",
    "offline puzzle game",
    "pwa game",
  ],
  themeColor: "#000000",
  developer: {
    name: "Arun Neupane",
    handle: "arundada9000",
    role: "Frontend Developer",
    site: "https://arunneupane.vercel.app",
  },
  social: {
    github: "https://github.com/arundada9000",
    twitter: "https://x.com/arundada9000",
    linkedin: "https://www.linkedin.com/in/arundada9000",
    instagram: "https://www.instagram.com/arundada9000",
  },
} as const;

export type SiteConfig = typeof site;

export const navLinks = [
  { href: "/", label: "Home" },
  { href: "/guides", label: "Guides" },
  { href: "/guides/how-to-play", label: "How to Play" },
] as const;

export const guideCategories = ["Basics", "Modes", "Strategy", "Engine", "Platform"] as const;