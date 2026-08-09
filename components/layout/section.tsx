import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Container } from "./container";
import { Reveal } from "@/components/animations/reveal";

/**
 * A page section. The optional top hairline runs the full width of the
 * viewport — that edge-to-edge rule is the structural motif of the layout.
 */
export function Section({
  children,
  className,
  id,
  rule = true,
  tone = "default",
  size = "default",
}: {
  children: ReactNode;
  className?: string;
  id?: string;
  rule?: boolean;
  tone?: "default" | "soft" | "ink";
  size?: "default" | "compact" | "tall";
}) {
  return (
    <section
      id={id}
      className={cn(
        "scroll-mt-24",
        size === "compact" && "py-16 sm:py-20 lg:py-24",
        size === "default" && "py-20 sm:py-28 lg:py-36",
        size === "tall" && "py-28 sm:py-36 lg:py-48",
        rule && tone !== "ink" && "border-t border-border",
        tone === "soft" && "bg-surface",
        tone === "ink" && "bg-ink text-ink-foreground",
        className,
      )}
    >
      {children}
    </section>
  );
}

/**
 * Section header on the editorial two-column pattern: a small label pinned
 * left, the statement running across the wider right column.
 */
export function SectionHeading({
  label,
  title,
  description,
  aside,
  className,
  tone = "default",
}: {
  label?: string;
  title: ReactNode;
  description?: ReactNode;
  /** Optional trailing element, e.g. a "view all" link. */
  aside?: ReactNode;
  className?: string;
  tone?: "default" | "ink";
}) {
  const isInk = tone === "ink";

  return (
    <Reveal className={cn("grid gap-6 md:grid-cols-12 md:gap-8", className)}>
      {label ? (
        <div className="md:col-span-3">
          <span className={cn("label", isInk && "text-ink-muted")}>{label}</span>
        </div>
      ) : null}
      <div className={cn(label ? "md:col-span-9" : "md:col-span-12")}>
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between md:gap-10">
          <h2 className="display-2 max-w-3xl text-balance">{title}</h2>
          {aside ? <div className="shrink-0 md:pb-2">{aside}</div> : null}
        </div>
        {description ? (
          <p
            className={cn(
              "lead mt-6 max-w-2xl text-pretty",
              isInk ? "text-ink-muted" : "text-muted-foreground",
            )}
          >
            {description}
          </p>
        ) : null}
      </div>
    </Reveal>
  );
}

export { Container };
