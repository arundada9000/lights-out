"use client";

import { useEffect, useState } from "react";
import { Download } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

/**
 * PWA glue: registers the offline service worker (production only), prints a
 * small branded console line, and surfaces an install affordance when the
 * browser offers it (custom UI, nothing platform-specific).
 */
export function Pwa() {
  const [installEvent, setInstallEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    if (process.env.NODE_ENV === "production" && "serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .catch(() => undefined);
    }

    const onPrompt = (e: Event) => {
      e.preventDefault();
      setInstallEvent(e as BeforeInstallPromptEvent);
    };
    const onInstalled = () => {
      setInstallEvent(null);
      setInstalled(true);
    };
    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);

    // Branded console signature - this is own-world, not tooling chatter.
    console.info(
      "%cEasy Lights Out.%c Tap, think, switch it all off.",
      "color:#fbbf24;font-weight:700;",
      "color:inherit;"
    );

    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  const install = async () => {
    if (!installEvent) return;
    await installEvent.prompt();
    const choice = await installEvent.userChoice;
    if (choice.outcome === "accepted") setInstallEvent(null);
  };

  if (installed) return null;

  return (
    <AnimatePresence>
      {installEvent ? (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16 }}
          transition={{ type: "spring", stiffness: 320, damping: 28 }}
          className="fixed bottom-5 left-1/2 z-40 -translate-x-1/2"
        >
          <button
            type="button"
            onClick={install}
            className="glass inline-flex cursor-pointer items-center gap-2 rounded-full border border-separator-opaque px-4 py-2.5 text-sm font-semibold text-label shadow-modal transition-all duration-200 ease-ios hover:text-accent active:scale-95 focus-visible:ring-focused"
          >
            <Download className="h-4 w-4 text-accent" aria-hidden />
            Install Easy Lights Out
          </button>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}