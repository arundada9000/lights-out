import type { Metadata, Viewport } from "next";
import { site } from "@/lib/site";
import { homeMetadata } from "@/lib/seo";
import { ThemeScript } from "@/components/theme/ThemeScript";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import "./globals.css";

export const metadata: Metadata = {
  ...homeMetadata,
  applicationName: site.name,
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: site.shortName,
  },
  formatDetection: {
    telephone: false,
  },
  metadataBase: new URL(site.url),
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  manifest: "/manifest.webmanifest",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
  themeColor: site.themeColor,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth">
      <head>
        <ThemeScript />
      </head>
      <body className="flex min-h-screen flex-col bg-background text-label antialiased">
        {/* EASY LIGHTS OUT - CONTROL SURFACE (direction contract, seed 762b7e1c)
        THESIS: A Light s out game presented as a modular synth instrument; the grid is a
        patch bay of glowing LED cells, and pressing one visibly emits a signal pulse that
        ripples to its neighbors. Refuses the generic dark-game hero-and-cards template.
        OWN-WORLD: Eight data-theme surfaces (paper/mist/sepia/contrast/slate/midnight/ocean/
        grape) over a configurable 12-accent axis; machined panels with hairline grids,
        engraved micro-caps, fixed-slot readouts, screws, ambient aura; SF Pro throughout.
        STORY: The visitor understands the one-line rule in seconds, presses the board and
        sees physics, then learns the game is fully configurable and offline.
        FIRST VIEWPORT: Left, an engraved module text panel (micro-cap + display headline +
        two CTAs). Right, the instrument: a live 5x5 board; the primary action is the board
        itself. Ambient accent aura + blueprint grid + slow patrol beam behind.
        FORM: "The Control Surface" (grounded #4; challenged and raised: 16-color theme
        discipline, bumper transitions via surface cross-fade, fixed-slot readouts).
        FINISH: unreviewed and undocumented is unfinished; this build ends with the finish
        review, the verdict, DESIGN.md, and every shipping raster carrying its provenance. */}
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}