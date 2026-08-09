import { useTranslations } from "next-intl";
import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/layout/container";
import { Section, SectionHeading } from "@/components/layout/section";
import { ProjectShowcase } from "@/components/projects/project-showcase";
import { featuredProjects } from "@/data/projects";

/** The strongest cases, each given a full scene. */
export function SelectedWork() {
  const t = useTranslations("Work");

  return (
    <Section id="work">
      <Container>
        <SectionHeading
          label={t("label")}
          title={t("title")}
          aside={
            <Link
              href="/projects"
              className="group inline-flex items-center gap-2 text-[0.9375rem] font-medium"
            >
              {t("viewAll")}
              <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          }
        />

        <div className="mt-16 space-y-16 lg:mt-20 lg:space-y-24">
          {featuredProjects.map((project, i) => (
            <ProjectShowcase
              key={project.slug}
              project={project}
              index={i}
              priority={i === 0}
            />
          ))}
        </div>
      </Container>
    </Section>
  );
}
