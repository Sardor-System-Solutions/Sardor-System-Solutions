import { useTranslations } from "next-intl";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import type { Locale, Project } from "@/types/project";
import { projectCopy } from "@/lib/get-projects";
import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/animations/reveal";
import { ProjectVisual } from "@/components/projects/project-visual";

/**
 * The end of a case study hands straight to the next one, so the portfolio
 * reads as one continuous pass.
 *
 * The way back out is always offered alongside it — the chain cycles, so a
 * visitor could otherwise loop indefinitely with no obvious exit. Nothing
 * redirects on its own; leaving is always the visitor's choice.
 */
export function NextProject({
  project,
  locale,
}: {
  project: Project;
  locale: Locale;
}) {
  const tCase = useTranslations("CaseStudy");
  const tWork = useTranslations("Work");

  return (
    <section className="bg-ink text-ink-foreground">
      <Container>
        <Link
          href={`/projects/${project.slug}`}
          className="group block border-b border-ink-line py-20 sm:py-24 lg:py-28"
        >
          <Reveal>
            <span className="label text-ink-muted">{tCase("nextProject")}</span>
          </Reveal>

          <div className="mt-8 grid items-center gap-10 md:grid-cols-12">
            <div className="md:col-span-6">
              <Reveal delay={0.05}>
                <h2 className="display-1 transition-colors duration-300 group-hover:text-primary">
                  {project.title}
                </h2>
                <p className="mt-5 text-ink-muted">
                  {projectCopy(project, locale).category}
                </p>
                <span className="mt-8 inline-flex items-center gap-2.5 text-[0.9375rem] font-medium">
                  {tWork("viewProject")}
                  <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1.5" />
                </span>
              </Reveal>
            </div>

            <Reveal delay={0.1} className="md:col-span-6">
              <ProjectVisual
                project={project}
                alt={project.title}
                tone="ink"
                sizes="(max-width: 768px) 100vw, 45vw"
              />
            </Reveal>
          </div>
        </Link>

        <Reveal>
          <div className="flex flex-col gap-4 py-10 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-ink-muted">{tCase("endOfCase")}</p>
            <Link
              href="/#projects"
              className="group inline-flex items-center gap-2.5 text-[1.0625rem] font-medium"
            >
              <ArrowLeft className="size-4 transition-transform duration-300 group-hover:-translate-x-1.5" />
              {tCase("backToProjects")}
            </Link>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
