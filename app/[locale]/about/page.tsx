import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { hasLocale, useTranslations } from "next-intl";
import { routing } from "@/i18n/routing";
import { buildMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site";
import { Container } from "@/components/layout/container";
import { PageHero } from "@/components/hero/page-hero";
import { Section } from "@/components/layout/section";
import { Reveal, Stagger, StaggerItem } from "@/components/animations/reveal";
import { ServicesList } from "@/components/sections/services-list";
import { Team } from "@/components/sections/team";
import { Process } from "@/components/sections/process";
import { TechStack } from "@/components/sections/tech-stack";
import { CommercialExperience } from "@/components/sections/commercial-experience";
import { FinalCta } from "@/components/sections/final-cta";
import { BreadcrumbSchema } from "@/components/structured-data";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Meta.about" });
  return buildMetadata({
    locale: hasLocale(routing.locales, locale) ? locale : routing.defaultLocale,
    path: "/about",
    title: t("title"),
    description: t("description"),
  });
}

function WhoWeAre() {
  const t = useTranslations("About.intro");
  const body = t.raw("body") as string[];

  return (
    <Section rule={false} className="pt-20 sm:pt-24">
      <Container>
        <div className="grid gap-8 md:grid-cols-12">
          <div className="md:col-span-3">
            <Reveal>
              <span className="label">{t("label")}</span>
            </Reveal>
          </div>
          <div className="md:col-span-8">
            <Stagger className="space-y-7">
              {body.map((paragraph) => (
                <StaggerItem key={paragraph}>
                  <p className="text-pretty text-xl leading-relaxed tracking-[-0.015em] sm:text-[1.375rem]">
                    {paragraph}
                  </p>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </div>
      </Container>
    </Section>
  );
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("About");

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "SDS", url: siteConfig.url },
          { name: t("label"), url: `${siteConfig.url}/about` },
        ]}
      />
      <PageHero
        label={t("label")}
        titleLines={t.raw("titleLines") as string[]}
        subtitle={t("subtitle")}
      />
      <WhoWeAre />
      <ServicesList />
      <Team />
      <Process />
      <TechStack />
      <CommercialExperience />
      <FinalCta />
    </>
  );
}
