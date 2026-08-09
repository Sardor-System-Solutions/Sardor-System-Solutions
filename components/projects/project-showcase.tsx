import { useTranslations } from "next-intl";
import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import type { Project } from "@/types/project";
import { cn } from "@/lib/utils";
import { Reveal, RevealImage } from "@/components/animations/reveal";
import { Parallax } from "@/components/animations/parallax";
import { ProjectVisual } from "./project-visual";

/**
 * A project scene: the meta sits beside the visual rather than above a
 * full-bleed image, which keeps the visual to roughly half its former height
 * while still reading as a composed scene. Alternating sides stops a run of
 * them from turning into a list.
 *
 * The whole scene is one link, and carries the pointer label.
 */
export function ProjectShowcase({
  project,
  index,
  priority = false,
}: {
  project: Project;
  index: number;
  priority?: boolean;
}) {
  const t = useTranslations("Projects");
  const tWork = useTranslations("Work");

  const category = t(`${project.slug}.category`);
  const description = t(`${project.slug}.description`);
  const flipped = index % 2 === 1;

  return (
    <article>
      <Link
        href={`/projects/${project.slug}`}
        data-cursor={tWork("cursorView")}
        className="group block"
      >
        {/* Tops align, so the meta's hairline sits on the same line as the top
            edge of the visual. */}
        <div className="grid items-start gap-6 md:grid-cols-12 md:gap-10">
          {/* Explicit placement on md+, so the mobile order below is free to
              lead with the visual. */}
          <Reveal
            className={cn(
              "md:row-start-1 md:col-span-4",
              flipped ? "md:col-start-9" : "md:col-start-1",
            )}
          >
            <div className="flex items-baseline gap-4 border-t border-border-strong pt-5">
              <span className="index-num text-subtle-foreground">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="display-3 transition-colors duration-300 group-hover:text-primary">
                {project.title}
              </h3>
            </div>

            <p className="label mt-4 pl-9">{category}</p>

            <p className="mt-5 max-w-sm text-pretty pl-9 text-[0.9375rem] leading-relaxed text-muted-foreground">
              {description}
            </p>

            <span className="mt-6 inline-flex items-center gap-2 pl-9 text-[0.9375rem] font-medium">
              {tWork("viewProject")}
              <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1.5" />
            </span>
          </Reveal>

          <RevealImage
            className={cn(
              "order-first md:order-none md:row-start-1 md:col-span-7",
              flipped ? "md:col-start-1" : "md:col-start-6",
            )}
          >
            <Parallax distance={32}>
              <ProjectVisual
                project={project}
                alt={project.title}
                priority={priority}
                sizes="(max-width: 768px) 100vw, 58vw"
              />
            </Parallax>
          </RevealImage>
        </div>
      </Link>
    </article>
  );
}
