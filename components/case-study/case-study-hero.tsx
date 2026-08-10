import { getTranslations } from "next-intl/server";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import type { Project } from "@/types/project";
import { Container } from "@/components/layout/container";
import { Reveal, RevealImage } from "@/components/animations/reveal";
import { AnimatedText } from "@/components/animations/animated-text";
import { ProjectVisual } from "@/components/projects/project-visual";

/**
 * The masthead of a case study: category, name, one-line description, the
 * meta strip, then the lead visual. Meta rows only appear when the data is
 * actually there — an unknown year is simply absent, never invented.
 */
export async function CaseStudyHero({ project }: { project: Project }) {
  const t = await getTranslations("Projects");
  const tCase = await getTranslations("CaseStudy");

  const meta = [
    { label: tCase("labels.category"), value: t(`${project.slug}.category`) },
    { label: tCase("labels.role"), value: t(`${project.slug}.role`) },
    ...(project.year
      ? [{ label: tCase("labels.year"), value: project.year }]
      : []),
    ...(project.technologies.length
      ? [
          {
            label: tCase("labels.technology"),
            value: project.technologies.join(", "),
          },
        ]
      : []),
  ];

  return (
    <>
      <Container className="pb-12 pt-12 sm:pt-16 lg:pt-20">
        <Reveal>
          <Link
            href="/#projects"
            className="group inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-4 transition-transform duration-300 group-hover:-translate-x-1" />
            {tCase("backToProjects")}
          </Link>
        </Reveal>

        <div className="mt-12 grid gap-8 md:grid-cols-12">
          <div className="md:col-span-3">
            <Reveal>
              <span className="label">{t(`${project.slug}.category`)}</span>
            </Reveal>
          </div>
          <div className="md:col-span-9">
            <h1 className="display-1">
              <AnimatedText lines={[project.title]} />
            </h1>
            <Reveal delay={0.18}>
              <p className="lead mt-8 max-w-2xl text-pretty text-muted-foreground">
                {t(`${project.slug}.description`)}
              </p>
            </Reveal>
          </div>
        </div>

        <Reveal delay={0.24}>
          <dl className="mt-14 grid gap-x-8 gap-y-8 border-t border-border pt-8 sm:grid-cols-2 lg:grid-cols-4">
            {meta.map((item) => (
              <div key={item.label}>
                <dt className="label">{item.label}</dt>
                <dd className="mt-2.5 text-[1.0625rem]">{item.value}</dd>
              </div>
            ))}
            {project.href ? (
              <div>
                <dt className="label">{tCase("labels.link")}</dt>
                <dd className="mt-2.5">
                  <a
                    href={project.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link-wipe inline-flex items-center gap-1.5 text-[1.0625rem] text-primary"
                  >
                    {project.domain}
                    <ArrowUpRight className="size-4" />
                  </a>
                </dd>
              </div>
            ) : null}
          </dl>
        </Reveal>
      </Container>

      <Container className="pb-16 sm:pb-20">
        <figure>
          <RevealImage>
            <ProjectVisual
              project={project}
              alt={project.title}
              span="full"
              priority
              sizes="(max-width: 768px) 100vw, 1400px"
            />
          </RevealImage>
          {project.cover?.captionKey ? (
            <figcaption className="mt-4 flex items-center gap-3 text-sm text-muted-foreground">
              <span className="h-px w-6 bg-border-strong" aria-hidden />
              {t(`${project.slug}.captions.${project.cover.captionKey}`)}
            </figcaption>
          ) : null}
        </figure>
      </Container>
    </>
  );
}
