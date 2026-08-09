import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { hasLocale, useTranslations } from "next-intl";
import { routing } from "@/i18n/routing";
import { buildMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site";
import { Container } from "@/components/layout/container";
import { PageHero } from "@/components/hero/page-hero";
import { Section, SectionHeading } from "@/components/layout/section";
import { Reveal } from "@/components/animations/reveal";
import { ProjectCard } from "@/components/projects/project-card";
import { ProjectIndex } from "@/components/projects/project-index";
import { FinalCta } from "@/components/sections/final-cta";
import { BreadcrumbSchema } from "@/components/structured-data";
import { commercialProjects, productProjects } from "@/data/projects";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Meta.projects" });
  return buildMetadata({
    locale: hasLocale(routing.locales, locale) ? locale : routing.defaultLocale,
    path: "/projects",
    title: t("title"),
    description: t("description"),
  });
}

/** SDS products, in an editorial layout rather than a uniform grid. */
function ProductGallery() {
  const t = useTranslations("Work");

  return (
    <Section rule={false} className="pt-20 sm:pt-24 lg:pt-28">
      <Container>
        <SectionHeading
          label={t("ownLabel")}
          title={t("title")}
          description={t("subtitle")}
        />
        <div className="mt-14 grid gap-x-8 gap-y-14 md:grid-cols-2 lg:mt-20 lg:gap-y-20">
          {productProjects.map((project, i) => (
            <ProjectCard
              key={project.slug}
              project={project}
              index={i + 1}
              layout={project.span}
              priority={i === 0}
            />
          ))}
        </div>
      </Container>
    </Section>
  );
}

function CommercialGallery() {
  const t = useTranslations("Commercial");

  return (
    <Section>
      <Container>
        <SectionHeading
          label={t("label")}
          title={t("title")}
          description={t("subtitle")}
        />
        <div className="mt-14 lg:mt-20">
          <ProjectIndex projects={commercialProjects} />
        </div>
        <Reveal>
          <p className="mt-8 max-w-xl text-sm leading-relaxed text-subtle-foreground">
            {t("disclaimer")}
          </p>
        </Reveal>
      </Container>
    </Section>
  );
}

export default async function ProjectsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("ProjectsPage");

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "SDS", url: siteConfig.url },
          { name: t("label"), url: `${siteConfig.url}/projects` },
        ]}
      />
      <PageHero
        label={t("label")}
        titleLines={t.raw("titleLines") as string[]}
        subtitle={t("subtitle")}
      />
      <ProductGallery />
      <CommercialGallery />
      <FinalCta />
    </>
  );
}
