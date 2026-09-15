import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Container } from "./Container";

interface SectionHeadingProps {
  title: ReactNode;
  description?: ReactNode;
  align?: "left" | "center";
  className?: string;
}

export function SectionHeading({
  title,
  description,
  align = "center",
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 sm:gap-4",
        align === "center" && "items-center text-center",
        className
      )}
    >
      <h2 className="max-w-2xl text-3xl font-semibold leading-tight tracking-tight text-label sm:text-4xl">
        {title}
      </h2>
      {description ? (
        <p
          className={cn(
            "max-w-xl text-base leading-relaxed text-label-secondary sm:text-lg",
            align === "center" && "text-balance"
          )}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}

export function Section({
  children,
  className,
  id,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <section id={id} className={cn("py-16 sm:py-24", className)}>
      <Container>{children}</Container>
    </section>
  );
}

/** Engraved plate label with status LED, used above section copy. */
export function PlateLabel({ children }: { children: ReactNode }) {
  return (
    <div className="mb-6 flex items-center gap-2.5">
      <span className="led" aria-hidden />
      <span className="etched text-[10px]">{children}</span>
    </div>
  );
}