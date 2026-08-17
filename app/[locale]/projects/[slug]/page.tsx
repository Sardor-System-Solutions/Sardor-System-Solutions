import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { hasLocale } from "next-intl";
import { routing } from "@/i18n/routing";
import { buildMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site";
import {
  getProjects,
  getProjectBySlugPublic,
  getNextProjectOf,
  projectCopy,
} from "@/lib/get-projects";
import type { Locale } from "@/types/project";
import { CaseStudyHero } from "@/components/case-study/case-study-hero";
import {
  CaseStudyFeatures,
  CaseStudySection,
  CaseStudyTech,
} from "@/components/case-study/case-study-section";
import { ProjectGallery } from "@/components/case-study/project-gallery";
import { NextProject } from "@/components/case-study/next-project";
import { BreadcrumbSchema } from "@/components/structured-data";

export async function generateStaticParams() {
  const projects = await getProjects();
  return routing.locales.flatMap((locale) =>
    projects.map((p) => ({ locale, slug: p.slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const project = await getProjectBySlugPublic(slug);
  if (!project) return {};

  const resolved = hasLocale(routing.locales, locale)
    ? locale
    : routing.defaultLocale;
  const copy = projectCopy(project, resolved as Locale);

  return buildMetadata({
    locale: resolved,
    path: `/projects/${slug}`,
    title: copy.category ? `${project.title} — ${copy.category}` : project.title,
    description: copy.description,
  });
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const projects = await getProjects();
  const project = projects.find((p) => p.slug === slug);
  if (!project) notFound();

  const resolved = (
    hasLocale(routing.locales, locale) ? locale : routing.defaultLocale
  ) as Locale;
  // Project copy now lives in the DB (edited through /admin) rather than in
  // messages/*.json; only the page's own labels come from the catalogues.
  const copy = projectCopy(project, resolved);

  const tCase = await getTranslations("CaseStudy");
  const tCommercial = await getTranslations("Commercial");

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "SDS", url: siteConfig.url },
          { name: tCase("breadcrumb"), url: `${siteConfig.url}/#projects` },
          {
            name: project.title,
            url: `${siteConfig.url}/projects/${project.slug}`,
          },
        ]}
      />

      <CaseStudyHero project={project} locale={resolved} />

      {/* Dotlabs-era work states its context up front, so the page can never
          be mistaken for an SDS client engagement. */}
      {project.kind === "commercial" ? (
        <CaseStudySection
          label={tCase("labels.context")}
          body={[tCommercial("caseNote")]}
        />
      ) : null}

      {/* Every narrative block is optional: a project we know less about
          simply gets a shorter page rather than padded-out filler. */}
      <CaseStudySection
        label={tCase("labels.overview")}
        body={copy.overview}
      />
      <CaseStudySection
        label={tCase("labels.challenge")}
        body={copy.challenge}
      />
      <CaseStudySection
        label={tCase("labels.solution")}
        body={copy.solution}
      />

      <ProjectGallery project={project} locale={resolved} />

      {copy.features.length > 0 ? (
        <CaseStudySection label={tCase("labels.features")}>
          <CaseStudyFeatures items={copy.features} />
        </CaseStudySection>
      ) : null}

      {project.technologies.length > 0 ? (
        <CaseStudySection label={tCase("labels.technology")}>
          <CaseStudyTech items={project.technologies} />
        </CaseStudySection>
      ) : null}

      <CaseStudySection label={tCase("labels.result")} body={copy.result} />

      <NextProject
        project={getNextProjectOf(projects, project.slug)}
        locale={resolved}
      />
    </>
  );
}
