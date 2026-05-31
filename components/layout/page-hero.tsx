import type { ReactNode } from "react";
import { Container } from "./container";
import { Reveal } from "@/components/motion/reveal";

export function PageHero({
  eyebrow,
  title,
  subtitle,
  children,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  children?: ReactNode;
}) {
  return (
    <section className="relative overflow-hidden border-b border-border">
      <div
        className="pointer-events-none absolute inset-0 -z-10 bg-grid opacity-50"
        aria-hidden
      />
      <Container className="py-20 sm:py-24 lg:py-28">
        <div className="max-w-3xl">
          <Reveal>
            <span className="eyebrow">{eyebrow}</span>
          </Reveal>
          <Reveal delay={0.05}>
            <h1 className="mt-4 text-balance text-4xl font-semibold leading-[1.06] tracking-tight text-foreground sm:text-5xl lg:text-[3.25rem]">
              {title}
            </h1>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-6 text-pretty text-lg leading-relaxed text-muted-foreground">
              {subtitle}
            </p>
          </Reveal>
          {children ? (
            <Reveal delay={0.15}>
              <div className="mt-9">{children}</div>
            </Reveal>
          ) : null}
        </div>
      </Container>
    </section>
  );
}
