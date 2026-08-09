import { useTranslations } from "next-intl";
import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/animations/reveal";
import { AnimatedText } from "@/components/animations/animated-text";
import { HeroVisual } from "./hero-visual";

/**
 * Type-led opening. The headline is the composition; the product shots sit
 * underneath it as evidence rather than decoration.
 */
export function HomeHero() {
  const t = useTranslations("Hero");
  const tCommon = useTranslations("Common");
  const lines = t.raw("titleLines") as string[];

  return (
    <section className="pb-4 pt-12 sm:pt-16 lg:pt-20">
      <Container>
        <Reveal y={0}>
          <div className="flex items-center justify-between gap-6 border-b border-border pb-5">
            <span className="label">{t("label")}</span>
            <span className="label">{tCommon("location")}</span>
          </div>
        </Reveal>

        {/* No max-width: line breaks are authored per locale and the container
            measure already caps the line length. */}
        <h1 className="display-0 mt-12 sm:mt-16 lg:mt-20">
          <AnimatedText lines={lines} />
        </h1>

        <div className="mt-12 grid items-end gap-8 md:grid-cols-12 lg:mt-16">
          <Reveal delay={0.32} className="md:col-span-6">
            <p className="lead max-w-xl text-pretty text-muted-foreground">
              {t("subtitle")}
            </p>
          </Reveal>

          <Reveal delay={0.4} className="md:col-span-5 md:col-start-8">
            <div className="flex flex-col gap-3 sm:flex-row md:justify-end">
              <Button asChild size="lg">
                <Link href="/contact">
                  {t("primaryCta")}
                  <ArrowRight />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/projects">
                  {t("secondaryCta")}
                  <ArrowRight />
                </Link>
              </Button>
            </div>
          </Reveal>
        </div>
      </Container>

      <HeroVisual />
    </section>
  );
}
