import { useTranslations } from "next-intl";
import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import type { Locale, Project } from "@/types/project";
import { projectCopy } from "@/lib/get-projects";
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
 * The whole scene is one link.
 *
 * `category`/`description` now come from the project's `i18n` field in the
 * DB (picked by `locale`) instead of `t(`${slug}.category`)` against the
 * old static messages/*.json — that copy is edited through /admin now.
 */
export function ProjectShowcase({
  project,
  locale,
  index,
  priority = false,
}: {
  project: Project;
  locale: Locale;
  index: number;
  priority?: boolean;
}) {
  const tWork = useTranslations("Work");

  const copy = projectCopy(project, locale);
  const flipped = index % 2 === 1;

  return (
    <article>
      <Link
        href={`/projects/${project.slug}`}
        className="group block"
      >
        <div className="grid items-start gap-6 md:grid-cols-12 md:gap-10">
          <Reveal
            className={cn(
              "md:row-start-1 md:col-span-4",
              flipped ? "md:col-start-9" : "md:col-start-1",
            )}
          >
            {/* Hover reads through the layout itself — the rule, the index
                and the title — rather than a floating badge chasing the
                pointer. */}
            <div className="relative flex items-baseline gap-4 pt-5">
              <span
                aria-hidden
                className="absolute inset-x-0 top-0 h-px bg-border-strong"
              />
              <span
                aria-hidden
                className="absolute left-0 top-0 h-px w-full origin-left scale-x-0 bg-primary transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100"
              />
              <span className="index-num text-subtle-foreground transition-colors duration-300 group-hover:text-primary">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="display-3 transition-colors duration-300 group-hover:text-primary">
                {project.title}
              </h3>
            </div>

            <p className="label mt-4 pl-9">{copy.category}</p>

            <p className="mt-5 max-w-sm text-pretty pl-9 text-[0.9375rem] leading-relaxed text-muted-foreground">
              {copy.description}
            </p>

            <span className="mt-6 inline-flex items-center gap-2 pl-9 text-[0.9375rem] font-medium transition-colors duration-300 group-hover:text-primary">
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