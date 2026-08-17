import { useTranslations } from "next-intl";
import type { Locale, Project } from "@/types/project";
import { projectCopy } from "@/lib/get-projects";
import { Container } from "@/components/layout/container";
import { Reveal, RevealImage } from "@/components/animations/reveal";
import { ProjectVisual } from "@/components/projects/project-visual";

/**
 * The PRODUCT section: the real captures we have of a project, at full width.
 * Skipped entirely when there are none — no placeholder screens.
 */
export function ProjectGallery({
  project,
  locale,
}: {
  project: Project;
  locale: Locale;
}) {
  const tCase = useTranslations("CaseStudy");
  const copy = projectCopy(project, locale);

  if (project.images.length === 0) return null;

  return (
    <section className="border-t border-border py-16 sm:py-20 lg:py-24">
      <Container>
        <Reveal>
          <h2 className="label">{tCase("labels.product")}</h2>
        </Reveal>

        <div className="mt-10 space-y-14 lg:mt-14 lg:space-y-20">
          {project.images.map((image, i) => (
            <figure key={image.src}>
              <RevealImage>
                <ProjectVisual
                  project={project}
                  image={image}
                  alt={project.title}
                  sizes="(max-width: 768px) 100vw, 1400px"
                />
              </RevealImage>
              {image.captionKey ? (
                <figcaption className="mt-4 flex items-center gap-3 text-sm text-muted-foreground">
                  <span className="h-px w-6 bg-border-strong" aria-hidden />
                  {copy.captions[image.captionKey]}
                </figcaption>
              ) : null}
              <span className="sr-only">{i + 1}</span>
            </figure>
          ))}
        </div>
      </Container>
    </section>
  );
}
