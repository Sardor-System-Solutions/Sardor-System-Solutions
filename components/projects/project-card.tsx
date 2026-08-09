import { useTranslations } from "next-intl";
import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import type { Project } from "@/types/project";
import { cn } from "@/lib/utils";
import { RevealImage } from "@/components/animations/reveal";
import { ProjectVisual } from "./project-visual";

/**
 * A case in the gallery. `full` spreads the meta into two columns under a
 * wide visual; `half` stacks it. The whole card is one link to the case.
 */
export function ProjectCard({
  project,
  index,
  layout = "half",
  priority = false,
}: {
  project: Project;
  index: number;
  layout?: "full" | "half";
  priority?: boolean;
}) {
  const t = useTranslations("Projects");
  const tWork = useTranslations("Work");

  const category = t(`${project.slug}.category`);
  const description = t(`${project.slug}.description`);
  const isFull = layout === "full";

  return (
    <article className={cn(isFull && "md:col-span-2")}>
      <Link
        href={`/projects/${project.slug}`}
        data-cursor={tWork("cursorView")}
        className="group block"
      >
        <RevealImage>
          <ProjectVisual
            project={project}
            alt={project.title}
            priority={priority}
            span={layout}
            sizes={
              isFull
                ? "(max-width: 768px) 100vw, 1400px"
                : "(max-width: 768px) 100vw, 50vw"
            }
          />
        </RevealImage>

        <div
          className={cn(
            "mt-6 gap-x-10 gap-y-4 border-t border-border pt-6",
            isFull ? "grid md:grid-cols-12" : "flex flex-col",
          )}
        >
          <div className={cn(isFull && "md:col-span-5")}>
            <div className="flex items-baseline gap-4">
              <span className="num text-subtle-foreground">
                {String(index).padStart(2, "0")}
              </span>
              <h3
                className={cn(
                  "font-medium tracking-[-0.03em] transition-colors group-hover:text-primary",
                  isFull ? "display-3" : "text-2xl leading-tight",
                )}
              >
                {project.title}
              </h3>
            </div>
            <p className="mt-3 pl-9 text-sm text-muted-foreground">{category}</p>
          </div>

          <div className={cn(isFull ? "md:col-span-6 md:col-start-7" : "pl-9")}>
            <p
              className={cn(
                "text-pretty text-muted-foreground",
                isFull ? "lead" : "text-[0.9375rem] leading-relaxed",
              )}
            >
              {description}
            </p>
            <span className="mt-5 inline-flex items-center gap-2 text-[0.9375rem] font-medium text-foreground">
              {tWork("viewProject")}
              <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}
