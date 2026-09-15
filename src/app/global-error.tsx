"use client";

import { Link } from "lucide-react";
import { useRouter } from "next/navigation";

export default function GlobalError({
  _error,
  reset,
}: {
  _error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();

  console.error(_error);

  return (
    <html lang="en">
      <body className="flex min-h-screen items-center justify-center bg-background p-6 text-center">
        <div className="flex flex-col items-center gap-5">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">
            Something went wrong
          </p>
          <h1 className="text-2xl font-semibold text-label">
            The board short-circuited.
          </h1>
          <p className="max-w-md text-sm text-label-secondary">
            We hit an unexpected error. You can try again or start over.
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => reset()}
              className="cursor-pointer rounded-ios-lg bg-accent px-5 py-3 text-sm font-medium text-accent-contrast transition-transform active:scale-95"
            >
              Try again
            </button>
            <button
              onClick={() => router.push("/")}
              className="cursor-pointer rounded-ios-lg bg-fill px-5 py-3 text-sm font-medium text-label transition-colors hover:bg-fill-secondary"
            >
              <Link className="mr-1 inline-block h-4 w-4 translate-y-0.5" />
              Go Home
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}