import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { hasLocale } from "next-intl";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { buildMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site";
import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/motion/reveal";
import { Cta } from "@/components/sections/cta";
import { BreadcrumbSchema } from "@/components/structured-data";
import { projects, getProject } from "@/content/projects";

type Result = { value: string; label: string };

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
  const t = await getTranslations({ locale, namespace: "Portfolio.projects" });
  return buildMetadata({
    locale: hasLocale(routing.locales, locale) ? locale : routing.defaultLocale,
    path: `/portfolio/${slug}`,
    title: t(`${project.id}.title`),
    description: t(`${project.id}.summary`),
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

  const t = await getTranslations("Portfolio");
  const p = (key: string) => t(`projects.${project.id}.${key}`);
  const results = t.raw(`projects.${project.id}.results`) as Result[];
  const projectServices = t.raw(
    `projects.${project.id}.services`,
  ) as string[];

  const currentIndex = projects.findIndex((x) => x.id === project.id);
  const nextProject = projects[(currentIndex + 1) % projects.length];

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", url: siteConfig.url },
          { name: t("title"), url: `${siteConfig.url}/portfolio` },
          {
            name: p("title"),
            url: `${siteConfig.url}/portfolio/${project.slug}`,
          },
        ]}
      />

      {/* Header */}
      <section className="relative overflow-hidden border-b border-border">
        <div
          className="pointer-events-none absolute inset-0 -z-10 bg-grid opacity-40"
          aria-hidden
        />
        <Container className="py-16 sm:py-20 lg:py-24">
          <Reveal>
            <Link
              href="/portfolio"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="size-4" />
              {t("backToWork")}
            </Link>
          </Reveal>
          <Reveal delay={0.05}>
            <div className="mt-8 flex items-center gap-3">
              <span className="font-mono text-xs uppercase tracking-wider text-primary">
                {p("category")}
              </span>
              <span className="text-xs text-muted-foreground">
                · {project.year}
              </span>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <h1 className="mt-3 max-w-3xl text-balance text-4xl font-semibold leading-[1.06] tracking-tight text-foreground sm:text-5xl">
              {p("title")}
            </h1>
          </Reveal>
          <Reveal delay={0.15}>
            <p className="mt-5 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground">
              {p("summary")}
            </p>
          </Reveal>
        </Container>
      </section>

      {/* Cover */}
      <Container className="py-12 sm:py-16">
        <Reveal>
          <div className="overflow-hidden rounded-2xl border border-border bg-surface">
            <Image
              src={project.cover}
              alt={p("title")}
              width={1600}
              height={1000}
              className="w-full object-cover"
              priority
            />
          </div>
        </Reveal>
      </Container>

      {/* Body */}
      <Container className="pb-8">
        <div className="grid gap-12 lg:grid-cols-[1fr_280px] lg:gap-16">
          <div className="space-y-12">
            <Reveal>
              <section>
                <h2 className="eyebrow mb-4">{t("labels.overview")}</h2>
                <p className="text-pretty text-lg leading-relaxed text-foreground/90">
                  {p("overview")}
                </p>
              </section>
            </Reveal>
            <Reveal>
              <section className="rounded-xl border border-border bg-card p-7">
                <h2 className="text-lg font-semibold tracking-tight text-foreground">
                  {t("labels.problem")}
                </h2>
                <p className="mt-3 leading-relaxed text-muted-foreground">
                  {p("problem")}
                </p>
              </section>
            </Reveal>
            <Reveal>
              <section className="rounded-xl border border-primary/20 bg-primary/[0.06] p-7">
                <h2 className="text-lg font-semibold tracking-tight text-foreground">
                  {t("labels.solution")}
                </h2>
                <p className="mt-3 leading-relaxed text-foreground/85">
                  {p("solution")}
                </p>
              </section>
            </Reveal>
          </div>

          {/* Sidebar meta */}
          <aside className="lg:pt-1">
            <Reveal>
              <div className="space-y-7 rounded-xl border border-border bg-card p-6 lg:sticky lg:top-24">
                <div>
                  <h3 className="eyebrow mb-2">{t("labels.category")}</h3>
                  <p className="text-sm text-foreground">{p("category")}</p>
                </div>
                <div>
                  <h3 className="eyebrow mb-2">{t("labels.year")}</h3>
                  <p className="text-sm text-foreground">{project.year}</p>
                </div>
                <div>
                  <h3 className="eyebrow mb-3">{t("labels.services")}</h3>
                  <ul className="space-y-1.5">
                    {projectServices.map((s) => (
                      <li key={s} className="text-sm text-foreground/90">
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="eyebrow mb-3">{t("labels.technologies")}</h3>
                  <div className="flex flex-wrap gap-1.5">
                    {project.tech.map((tech) => (
                      <span
                        key={tech}
                        className="rounded-md border border-border bg-surface px-2 py-0.5 text-[11px] font-medium text-muted-foreground"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Reveal>
          </aside>
        </div>
      </Container>

      {/* Results */}
      <Container className="py-12 sm:py-16">
        <Reveal>
          <h2 className="eyebrow mb-6">{t("labels.results")}</h2>
          <dl className="grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-3">
            {results.map((r) => (
              <div key={r.label} className="bg-card p-8">
                <dd className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                  {r.value}
                </dd>
                <dt className="mt-2 text-sm text-muted-foreground">
                  {r.label}
                </dt>
              </div>
            ))}
          </dl>
        </Reveal>
      </Container>

      {/* Next project */}
      <Container className="pb-8">
        <Link
          href={`/portfolio/${nextProject.slug}`}
          className="group flex items-center justify-between gap-4 rounded-2xl border border-border bg-card p-7 transition-colors hover:border-border-strong hover:bg-surface-2"
        >
          <div>
            <span className="eyebrow">{t("nextProject")}</span>
            <p className="mt-2 text-xl font-semibold tracking-tight text-foreground">
              {t(`projects.${nextProject.id}.title`)}
            </p>
          </div>
          <ArrowRight className="size-6 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-foreground" />
        </Link>
      </Container>

      <Cta />
    </>
  );
}
