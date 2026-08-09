import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Container } from "@/components/layout/container";
import { Reveal, Stagger, StaggerItem } from "@/components/animations/reveal";

/**
 * One narrative block of a case study — label on the left, prose on the right.
 *
 * Renders nothing when it has no content, which is how a thinner project
 * quietly ends up with a shorter page instead of padded-out filler.
 */
export function CaseStudySection({
  label,
  body,
  children,
  tone = "default",
  className,
}: {
  label: string;
  /** Paragraphs. An empty array means the section is skipped entirely. */
  body?: string[];
  children?: ReactNode;
  tone?: "default" | "ink";
  className?: string;
}) {
  const paragraphs = (body ?? []).filter(Boolean);
  if (paragraphs.length === 0 && !children) return null;

  const isInk = tone === "ink";

  return (
    <section
      className={cn(
        "border-t py-16 sm:py-20 lg:py-24",
        isInk ? "border-ink-line" : "border-border",
        className,
      )}
    >
      <Container>
        <div className="grid gap-8 md:grid-cols-12">
          <div className="md:col-span-3">
            <Reveal>
              <h2 className={cn("label", isInk && "text-ink-muted")}>{label}</h2>
            </Reveal>
          </div>
          <div className="md:col-span-8">
            {paragraphs.length > 0 ? (
              <Stagger className="space-y-6">
                {paragraphs.map((paragraph) => (
                  <StaggerItem key={paragraph}>
                    <p className="text-pretty text-xl leading-relaxed tracking-[-0.015em] sm:text-[1.375rem]">
                      {paragraph}
                    </p>
                  </StaggerItem>
                ))}
              </Stagger>
            ) : null}
            {children ? (
              <div className={cn(paragraphs.length > 0 && "mt-12")}>
                {children}
              </div>
            ) : null}
          </div>
        </div>
      </Container>
    </section>
  );
}

/** The FEATURES list — a numbered hairline stack. */
export function CaseStudyFeatures({ items }: { items: string[] }) {
  if (items.length === 0) return null;

  return (
    <Stagger as="ol" className="border-t border-border">
      {items.map((item, i) => (
        <StaggerItem
          key={item}
          as="li"
          className="flex items-baseline gap-5 border-b border-border py-4"
        >
          <span className="num text-subtle-foreground">
            {String(i + 1).padStart(2, "0")}
          </span>
          <span className="text-[1.0625rem]">{item}</span>
        </StaggerItem>
      ))}
    </Stagger>
  );
}

/** The TECHNOLOGY row. Absent until a project's stack is confirmed. */
export function CaseStudyTech({ items }: { items: string[] }) {
  if (items.length === 0) return null;

  return (
    <Stagger as="ul" className="flex flex-wrap gap-x-8 gap-y-3">
      {items.map((item) => (
        <StaggerItem key={item} as="li" className="text-[1.0625rem]">
          {item}
        </StaggerItem>
      ))}
    </Stagger>
  );
}
