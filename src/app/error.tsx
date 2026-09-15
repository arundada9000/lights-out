"use client";

import { RotateCcw, Home } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();

  return (
    <section className="flex flex-1 items-center justify-center py-20 text-center">
      <div className="flex flex-col items-center gap-5">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">
          Error &middot; Something went wrong
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-label">
          The board short-circuited.
        </h1>
        <p className="max-w-md text-base leading-relaxed text-label-secondary">
          An unexpected error occurred while rendering this page. Try again, or
          head back to the home page.
        </p>
        <div className="mt-2 flex flex-col gap-3 sm:flex-row">
          <button
            onClick={() => reset()}
            className="inline-flex h-11 cursor-pointer items-center justify-center gap-2 rounded-ios-lg bg-accent px-5 text-sm font-medium text-accent-contrast transition-all duration-200 ease-ios hover:opacity-90 active:scale-[0.97]"
          >
            <RotateCcw className="h-4 w-4" />
            Try again
          </button>
          <button
            onClick={() => router.push("/")}
            className="inline-flex h-11 cursor-pointer items-center justify-center gap-2 rounded-ios-lg bg-fill px-5 text-sm font-medium text-label transition-all duration-200 ease-ios hover:bg-fill-secondary active:scale-[0.97]"
          >
            <Home className="h-4 w-4" />
            Go Home
          </button>
        </div>
        {error?.digest ? (
          <p className="mt-2 text-xs text-label-tertiary">Reference: {error.digest}</p>
        ) : null}
      </div>
    </section>
  );
}