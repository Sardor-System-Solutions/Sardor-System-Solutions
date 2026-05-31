import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { useTranslations } from "next-intl";
import { Check, ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { hasLocale } from "next-intl";
import { routing } from "@/i18n/routing";
import { buildMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site";
import { Container } from "@/components/layout/container";
import { PageHero } from "@/components/layout/page-hero";
import { Reveal } from "@/components/motion/reveal";
import { Button } from "@/components/ui/button";
import { Process } from "@/components/sections/process";
import { Cta } from "@/components/sections/cta";
import { BreadcrumbSchema } from "@/components/structured-data";
import { services } from "@/content/services";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Meta.services" });
  return buildMetadata({
    locale: hasLocale(routing.locales, locale) ? locale : routing.defaultLocale,
    path: "/services",
    title: t("title"),
    description: t("description"),
  });
}

function ServiceList() {
  const t = useTranslations("Services");

  return (
    <Container className="py-20 sm:py-24">
      <div className="flex flex-col gap-px overflow-hidden rounded-2xl border border-border bg-border">
        {services.map((service, i) => {
          const Icon = service.icon;
          const features = t.raw(`items.${service.id}.features`) as string[];
          return (
            <Reveal key={service.id} delay={i * 0.04} className="bg-card">
              <div
                id={service.id}
                className="grid scroll-mt-24 gap-8 p-8 lg:grid-cols-[1fr_1.1fr] lg:p-10"
              >
                <div>
                  <span className="inline-flex size-12 items-center justify-center rounded-xl border border-border bg-surface text-primary">
                    <Icon className="size-6" />
                  </span>
                  <span className="mt-5 block font-mono text-sm text-muted-foreground">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h2 className="mt-2 text-2xl font-semibold tracking-tight text-foreground">
                    {t(`items.${service.id}.title`)}
                  </h2>
                  <p className="mt-1 text-sm font-medium text-primary">
                    {t(`items.${service.id}.tagline`)}
                  </p>
                  <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
                    {t(`items.${service.id}.description`)}
                  </p>
                </div>

                <div className="lg:pl-10">
                  <h3 className="eyebrow mb-4">{t("deliverablesLabel")}</h3>
                  <ul className="space-y-3">
                    {features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3">
                        <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                        <span className="text-sm text-foreground/90">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <h3 className="eyebrow mb-3 mt-7">{t("stackLabel")}</h3>
                  <div className="flex flex-wrap gap-1.5">
                    {service.stack.map((tech) => (
                      <span
                        key={tech}
                        className="rounded-md border border-border bg-surface px-2.5 py-1 text-xs font-medium text-muted-foreground"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>
    </Container>
  );
}

export default async function ServicesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Services");

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", url: siteConfig.url },
          { name: t("pageTitle"), url: `${siteConfig.url}/services` },
        ]}
      />
      <PageHero
        eyebrow={t("pageEyebrow")}
        title={t("pageTitle")}
        subtitle={t("pageSubtitle")}
      >
        <Button asChild size="lg">
          <Link href="/contact">
            {t("learnMore")}
            <ArrowRight />
          </Link>
        </Button>
      </PageHero>
      <ServiceList />
      <Process />
      <Cta />
    </>
  );
}
