import { useTranslations } from "next-intl";
import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import type { Project } from "@/types/project";
import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/animations/reveal";
import { ProjectVisual } from "@/components/projects/project-visual";

/**
 * The end of a case study hands straight to the next one, so the portfolio
 * reads as one continuous pass rather than a series of dead ends.
 */
export function NextProject({ project }: { project: Project }) {
  const t = useTranslations("Projects");
  const tCase = useTranslations("CaseStudy");
  const tWork = useTranslations("Work");

  return (
    <section className="bg-ink text-ink-foreground">
      <Container>
        <Link
          href={`/projects/${project.slug}`}
          data-cursor={tWork("cursorNext")}
          className="group block py-20 sm:py-24 lg:py-28"
        >
          <Reveal>
            <span className="label text-ink-muted">
              {tCase("nextProject")}
            </span>
          </Reveal>

          <div className="mt-8 grid items-center gap-10 md:grid-cols-12">
            <div className="md:col-span-6">
              <Reveal delay={0.05}>
                <h2 className="display-1 transition-colors duration-300 group-hover:text-primary">
                  {project.title}
                </h2>
                <p className="mt-5 text-ink-muted">
                  {t(`${project.slug}.category`)}
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
      </Container>
    </section>
  );
}
