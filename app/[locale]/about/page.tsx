import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { useTranslations } from "next-intl";
import { hasLocale } from "next-intl";
import { routing } from "@/i18n/routing";
import { buildMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site";
import { Container } from "@/components/layout/container";
import { PageHero } from "@/components/layout/page-hero";
import { SectionHeader } from "@/components/layout/section";
import { Reveal } from "@/components/motion/reveal";
import { Process } from "@/components/sections/process";
import { Cta } from "@/components/sections/cta";
import { BreadcrumbSchema } from "@/components/structured-data";
import { values } from "@/content/values";
import { team } from "@/content/team";

type Stat = { value: string; label: string };

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

function Mission() {
  const t = useTranslations("About");
  const body = t.raw("mission.body") as string[];
  const stats = t.raw("stats") as Stat[];

  return (
    <Container className="py-20 sm:py-24">
      <div className="grid gap-12 lg:grid-cols-[1fr_1fr] lg:gap-16">
        <Reveal>
          <div>
            <span className="eyebrow">{t("mission.eyebrow")}</span>
            <h2 className="mt-4 text-balance text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              {t("mission.title")}
            </h2>
          </div>
        </Reveal>
        <Reveal delay={0.05}>
          <div className="space-y-5">
            {body.map((paragraph, i) => (
              <p
                key={i}
                className="text-pretty leading-relaxed text-muted-foreground"
              >
                {paragraph}
              </p>
            ))}
          </div>
        </Reveal>
      </div>

      <Reveal delay={0.1}>
        <dl className="mt-16 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border bg-border lg:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-card p-7 text-center">
              <dd className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                {stat.value}
              </dd>
              <dt className="mt-2 text-sm text-muted-foreground">
                {stat.label}
              </dt>
            </div>
          ))}
        </dl>
      </Reveal>
    </Container>
  );
}

function Values() {
  const t = useTranslations("About.values");

  return (
    <section className="border-t border-border py-20 sm:py-24">
      <Container>
        <SectionHeader
          eyebrow={t("eyebrow")}
          title={t("title")}
          description={t("subtitle")}
        />
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((value, i) => {
            const Icon = value.icon;
            return (
              <Reveal key={value.id} delay={i * 0.05}>
                <div className="flex h-full flex-col gap-4 rounded-xl border border-border bg-card p-6">
                  <span className="inline-flex size-11 items-center justify-center rounded-lg border border-border bg-surface text-primary">
                    <Icon className="size-5" />
                  </span>
                  <h3 className="text-base font-semibold tracking-tight text-foreground">
                    {t(`items.${value.id}.title`)}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {t(`items.${value.id}.description`)}
                  </p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </Container>
    </section>
  );
}

function Team() {
  const t = useTranslations("About.team");

  return (
    <section className="border-t border-border py-20 sm:py-24">
      <Container>
        <SectionHeader
          eyebrow={t("eyebrow")}
          title={t("title")}
          description={t("subtitle")}
        />
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {team.map((member, i) => (
            <Reveal key={member.id} delay={i * 0.05}>
              <div className="flex h-full flex-col gap-4 rounded-xl border border-border bg-card p-6">
                <span
                  className="inline-flex size-14 items-center justify-center rounded-full border border-border bg-surface text-lg font-semibold text-primary"
                  aria-hidden
                >
                  {member.initials}
                </span>
                <div>
                  <h3 className="text-base font-semibold tracking-tight text-foreground">
                    {t(`members.${member.id}.name`)}
                  </h3>
                  <p className="mt-0.5 text-sm text-primary">
                    {t(`members.${member.id}.role`)}
                  </p>
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {t(`members.${member.id}.bio`)}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
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

  const processHeader = {
    eyebrow: t("process.eyebrow"),
    title: t("process.title"),
    subtitle: t("process.subtitle"),
  };

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", url: siteConfig.url },
          { name: t("hero.title"), url: `${siteConfig.url}/about` },
        ]}
      />
      <PageHero
        eyebrow={t("hero.eyebrow")}
        title={t("hero.title")}
        subtitle={t("hero.subtitle")}
      />
      <Mission />
      <Values />
      <Process header={processHeader} />
      <Team />
      <Cta />
    </>
  );
}
