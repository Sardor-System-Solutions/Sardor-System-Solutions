import { useTranslations } from "next-intl";
import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/layout/container";
import { SectionHeader } from "@/components/layout/section";
import { Reveal } from "@/components/motion/reveal";
import { ProjectCard } from "@/components/project-card";
import { projects } from "@/content/projects";

export function FeaturedProjects() {
  const t = useTranslations("Featured");
  const featured = projects.filter((p) => p.featured);

  return (
    <section className="border-t border-border py-20 sm:py-24 lg:py-28">
      <Container>
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <SectionHeader
            eyebrow={t("eyebrow")}
            title={t("title")}
            description={t("subtitle")}
          />
          <Reveal>
            <Link
              href="/portfolio"
              className="inline-flex items-center gap-1.5 whitespace-nowrap text-sm font-medium text-primary transition-colors hover:text-primary/80"
            >
              {t("viewAll")}
              <ArrowRight className="size-4" />
            </Link>
          </Reveal>
        </div>

        <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {featured.map((project, i) => (
            <Reveal key={project.id} delay={i * 0.06}>
              <ProjectCard project={project} />
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
