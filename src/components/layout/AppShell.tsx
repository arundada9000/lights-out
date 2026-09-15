"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { SiteHeader } from "./SiteHeader";
import { SiteFooter } from "./SiteFooter";

/**
 * Route-aware chrome. The /play scene is a full-bleed instrument - no marketing
 * header or footer - so the shell hides them there and hands the whole viewport
 * to the game.
 */
export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const fullBleed = pathname === "/play";

  return (
    <>
      {!fullBleed ? <SiteHeader /> : null}
      {fullBleed ? (
        <main className="flex w-full flex-1">{children}</main>
      ) : (
        <main className="flex-1">{children}</main>
      )}
      {!fullBleed ? <SiteFooter /> : null}
    </>
  );
}