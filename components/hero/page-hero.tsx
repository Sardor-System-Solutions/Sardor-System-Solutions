import type { ReactNode } from "react";
import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/animations/reveal";
import { AnimatedText } from "@/components/animations/animated-text";

/** The masthead used by About, Projects and Contact. */
export function PageHero({
  label,
  titleLines,
  subtitle,
  children,
}: {
  label: string;
  /** Line breaks are authored per locale. */
  titleLines: string[];
  subtitle?: string;
  children?: ReactNode;
}) {
  return (
    <section className="border-b border-border">
      <Container className="pb-16 pt-16 sm:pb-20 sm:pt-24 lg:pb-24 lg:pt-28">
        <div className="grid gap-8 md:grid-cols-12">
          <div className="md:col-span-3">
            <Reveal>
              <span className="label">{label}</span>
            </Reveal>
          </div>
          <div className="md:col-span-9">
            <h1 className="display-1">
              <AnimatedText lines={titleLines} />
            </h1>
            {subtitle ? (
              <Reveal delay={0.22}>
                <p className="lead mt-8 max-w-2xl text-pretty text-muted-foreground">
                  {subtitle}
                </p>
              </Reveal>
            ) : null}
            {children ? (
              <Reveal delay={0.28}>
                <div className="mt-10">{children}</div>
              </Reveal>
            ) : null}
          </div>
        </div>
      </Container>
    </section>
  );
}
