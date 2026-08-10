"use client";

import { useTranslations } from "next-intl";
import { ArrowDown, ArrowRight } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/animations/reveal";
import { AnimatedText } from "@/components/animations/animated-text";
import { scrollToSection } from "@/lib/scroll";
import { HeroVisual } from "@/components/hero/hero-visual";

/**
 * The opening. Type-led and short: one statement, one line of what we build,
 * and the two ways forward. The product shots sit underneath as evidence.
 */
export function HeroSection() {
  const t = useTranslations("Hero");
  const tCommon = useTranslations("Common");
  const lines = t.raw("titleLines") as string[];

  return (
    <section id="hero" className="pb-4 pt-28 sm:pt-32 lg:pt-36">
      <Container>
        <Reveal y={0}>
          <div className="flex items-center justify-between gap-6 border-b border-border pb-5">
            <span className="label">{t("label")}</span>
            <span className="label">{tCommon("location")}</span>
          </div>
        </Reveal>

        <h1 className="display-0 mt-12 sm:mt-16 lg:mt-20">
          <AnimatedText lines={lines} />
        </h1>

        <div className="mt-12 grid items-end gap-8 md:grid-cols-12 lg:mt-16">
          <Reveal delay={0.32} className="md:col-span-6">
            <p className="lead max-w-lg text-pretty text-muted-foreground">
              {t("subtitle")}
            </p>
          </Reveal>

          <Reveal delay={0.4} className="md:col-span-5 md:col-start-8">
            <div className="flex flex-col gap-3 sm:flex-row md:justify-end">
              <button
                type="button"
                onClick={() => scrollToSection("projects")}
                className="group inline-flex h-12 items-center justify-center gap-2.5 rounded-md bg-primary px-6 text-[0.9375rem] font-medium text-primary-foreground transition-colors hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                {t("primaryCta")}
                <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" />
              </button>
              <button
                type="button"
                onClick={() => scrollToSection("contact")}
                className="group inline-flex h-12 items-center justify-center gap-2.5 rounded-md border border-border-strong px-6 text-[0.9375rem] font-medium transition-colors hover:border-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                {t("secondaryCta")}
                <ArrowDown className="size-4 transition-transform duration-300 group-hover:translate-y-0.5" />
              </button>
            </div>
          </Reveal>
        </div>
      </Container>

      <HeroVisual />
    </section>
  );
}
