import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { hasLocale } from "next-intl";
import { routing } from "@/i18n/routing";
import { buildMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site";
import { CaseStudyHero } from "@/components/case-study/case-study-hero";
import {
  CaseStudyFeatures,
  CaseStudySection,
  CaseStudyTech,
} from "@/components/case-study/case-study-section";
import { ProjectGallery } from "@/components/case-study/project-gallery";
import { NextProject } from "@/components/case-study/next-project";
import { FinalCta } from "@/components/sections/final-cta";
import { BreadcrumbSchema } from "@/components/structured-data";
import { projects, getProject, getNextProject } from "@/data/projects";

export function generateStaticParams() {
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
  const project = getProject(slug);
  if (!project) return {};

  const t = await getTranslations({ locale, namespace: "Projects" });
  return buildMetadata({
    locale: hasLocale(routing.locales, locale) ? locale : routing.defaultLocale,
    path: `/projects/${slug}`,
    title: `${project.title} — ${t(`${project.slug}.category`)}`,
    description: t(`${project.slug}.description`),
  });
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const project = getProject(slug);
  if (!project) notFound();

  const t = await getTranslations("Projects");
  const tCase = await getTranslations("CaseStudy");
  const tCommercial = await getTranslations("Commercial");

  // Every narrative block is optional: a project we know less about simply
  // gets a shorter page rather than padded-out filler.
  const paragraphs = (key: string) =>
    (t.raw(`${project.slug}.${key}`) as string[] | undefined) ?? [];
  const features = (t.raw(`${project.slug}.features`) as string[]) ?? [];

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "SDS", url: siteConfig.url },
          { name: tCase("breadcrumb"), url: `${siteConfig.url}/projects` },
          {
            name: project.title,
            url: `${siteConfig.url}/projects/${project.slug}`,
          },
        ]}
      />

      <CaseStudyHero project={project} />

      {/* Dotlabs-era work states its context up front, so the page can never
          be mistaken for an SDS client engagement. */}
      {project.kind === "commercial" ? (
        <CaseStudySection
          label={tCase("labels.context")}
          body={[tCommercial("caseNote")]}
        />
      ) : null}

      <CaseStudySection
        label={tCase("labels.overview")}
        body={paragraphs("overview")}
      />
      <CaseStudySection
        label={tCase("labels.challenge")}
        body={paragraphs("challenge")}
      />
      <CaseStudySection
        label={tCase("labels.solution")}
        body={paragraphs("solution")}
      />

      <ProjectGallery project={project} />

      {features.length > 0 ? (
        <CaseStudySection label={tCase("labels.features")}>
          <CaseStudyFeatures items={features} />
        </CaseStudySection>
      ) : null}

      {project.technologies.length > 0 ? (
        <CaseStudySection label={tCase("labels.technology")}>
          <CaseStudyTech items={project.technologies} />
        </CaseStudySection>
      ) : null}

      <CaseStudySection
        label={tCase("labels.result")}
        body={paragraphs("result")}
      />

      <NextProject project={getNextProject(project.slug)} />
      <FinalCta />
    </>
  );
}
