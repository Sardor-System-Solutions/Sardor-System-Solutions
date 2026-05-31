import Image from "next/image";
import { useTranslations } from "next-intl";
import { ArrowUpRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { type Project } from "@/content/projects";

export function ProjectCard({ project }: { project: Project }) {
  const t = useTranslations("Portfolio");

  return (
    <Link
      href={`/portfolio/${project.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card transition-colors hover:border-border-strong"
    >
      <div className="relative aspect-16/10 overflow-hidden border-b border-border bg-surface">
        <Image
          src={project.cover}
          alt={t(`projects.${project.id}.title`)}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
        />
      </div>
      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-center gap-3">
          <span className="font-mono text-[11px] uppercase tracking-wider text-primary">
            {t(`projects.${project.id}.category`)}
          </span>
          <span className="text-xs text-muted-foreground">· {project.year}</span>
        </div>
        <div className="mt-3 flex items-start justify-between gap-3">
          <h3 className="text-xl font-semibold tracking-tight text-foreground">
            {t(`projects.${project.id}.title`)}
          </h3>
          <ArrowUpRight className="mt-1 size-5 shrink-0 text-muted-foreground/40 transition-colors group-hover:text-foreground" />
        </div>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          {t(`projects.${project.id}.summary`)}
        </p>
        <div className="mt-5 flex flex-wrap gap-1.5">
          {project.tech.slice(0, 4).map((tech) => (
            <span
              key={tech}
              className="rounded-md border border-border bg-surface px-2 py-0.5 text-[11px] font-medium text-muted-foreground"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}
