import { useTranslations } from "next-intl";
import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import type { Locale, Project } from "@/types/project";
import { projectCopy } from "@/lib/get-projects";
import { Reveal, Stagger, StaggerItem } from "@/components/animations/reveal";

/**
 * Typographic index used for the team's commercial experience.
 *
 * Listed rather than presented as SDS case studies: name, the role the team
 * held, and the live domain. Nothing here implies SDS was the contracting
 * party — the caption above the list says who the work was done for.
 *
 * Project copy (description, role) now comes from each project's `i18n`
 * field in the DB, picked by `locale`, instead of `t(`${slug}.description`)`
 * against the old static messages/*.json — that data now lives in the DB and
 * is edited through /admin.
 */
export function ProjectIndex({
  projects,
  locale,
}: {
  projects: Project[];
  locale: Locale;
}) {
  const tTeam = useTranslations("Commercial");

  return (
    <div>
      <Reveal>
        <div className="hidden grid-cols-12 gap-x-8 border-b border-border pb-3 md:grid">
          <span className="label col-span-5">{tTeam("projectLabel")}</span>
          <span className="label col-span-4">{tTeam("roleLabel")}</span>
          <span className="label col-span-3 md:text-right">
            {tTeam("linkLabel")}
          </span>
        </div>
      </Reveal>

      <Stagger as="div" className="border-t border-border md:border-t-0">
        {projects.map((project, i) => {
          const copy = projectCopy(project, locale);
          return (
            <StaggerItem key={project.slug} className="border-b border-border">
              <Link
                href={`/projects/${project.slug}`}
                className="group grid grid-cols-1 items-baseline gap-x-8 gap-y-2 py-7 md:grid-cols-12 md:py-8"
              >
                <div className="flex items-baseline gap-4 md:col-span-5">
                  <span className="num text-subtle-foreground">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="text-2xl font-medium tracking-[-0.03em] transition-colors group-hover:text-primary md:text-[1.75rem]">
                      {project.title}
                    </h3>
                    <p className="mt-1.5 text-sm text-muted-foreground">
                      {copy.description}
                    </p>
                  </div>
                </div>

                <p className="pl-9 text-[0.9375rem] md:col-span-4 md:pl-0">
                  {copy.role}
                </p>

                <div className="flex items-center gap-3 pl-9 md:col-span-3 md:justify-end md:pl-0">
                  {project.domain ? (
                    <span className="text-[0.9375rem] text-muted-foreground">
                      {project.domain}
                    </span>
                  ) : null}
                  <ArrowRight className="size-4 shrink-0 text-subtle-foreground transition-transform duration-300 group-hover:translate-x-1 group-hover:text-foreground" />
                </div>
              </Link>
            </StaggerItem>
          );
        })}
      </Stagger>
    </div>
  );
}