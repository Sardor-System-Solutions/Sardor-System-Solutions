import { useTranslations } from "next-intl";
import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/motion/reveal";
import { HeroVisual } from "./hero-visual";

type Stat = { value: string; label: string };

export function Hero() {
  const t = useTranslations("Hero");
  const stats = t.raw("stats") as Stat[];

  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-grid opacity-60" aria-hidden />
      <div
        className="pointer-events-none absolute -top-40 left-1/2 -z-10 h-[480px] w-[820px] -translate-x-1/2 rounded-full bg-primary/10 blur-[120px]"
        aria-hidden
      />
      <Container className="py-20 sm:py-24 lg:py-32">
        <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          <div>
            <Reveal>
              <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium text-muted-foreground">
                <span className="size-1.5 rounded-full bg-primary" />
                {t("badge")}
              </span>
            </Reveal>

            <Reveal delay={0.05}>
              <h1 className="mt-6 text-balance text-4xl font-semibold leading-[1.05] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                {t("title")}{" "}
                <span className="text-primary">{t("titleAccent")}</span>
              </h1>
            </Reveal>

            <Reveal delay={0.1}>
              <p className="mt-6 max-w-xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
                {t("subtitle")}
              </p>
            </Reveal>

            <Reveal delay={0.15}>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Button asChild size="lg">
                  <Link href="/contact">
                    {t("primaryCta")}
                    <ArrowRight />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link href="/portfolio">{t("secondaryCta")}</Link>
                </Button>
              </div>
            </Reveal>

            <Reveal delay={0.2}>
              <dl className="mt-14 grid max-w-md grid-cols-3 gap-6 border-t border-border pt-8">
                {stats.map((stat) => (
                  <div key={stat.label}>
                    <dt className="sr-only">{stat.label}</dt>
                    <dd className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                      {stat.value}
                    </dd>
                    <p className="mt-1 text-xs leading-snug text-muted-foreground">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </dl>
            </Reveal>
          </div>

          <Reveal delay={0.15} className="hidden lg:block">
            <HeroVisual />
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
