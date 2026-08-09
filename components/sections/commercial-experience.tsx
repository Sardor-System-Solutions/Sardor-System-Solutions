import { useTranslations } from "next-intl";
import { Container } from "@/components/layout/container";
import { Section, SectionHeading } from "@/components/layout/section";
import { Reveal } from "@/components/animations/reveal";
import { ProjectIndex } from "@/components/projects/project-index";
import { commercialProjects } from "@/data/projects";

/**
 * Commercial projects the team developed as part of Dotlabs. Kept visually
 * and verbally distinct from the SDS product work: this is team experience,
 * not an SDS client list.
 */
export function CommercialExperience() {
  const t = useTranslations("Commercial");

  return (
    <Section id="commercial">
      <Container>
        <SectionHeading
          label={t("label")}
          title={t("title")}
          description={t("subtitle")}
        />

        <div className="mt-14 lg:mt-20">
          <ProjectIndex projects={commercialProjects} />
        </div>

        <Reveal>
          <p className="mt-8 max-w-xl text-sm leading-relaxed text-subtle-foreground">
            {t("disclaimer")}
          </p>
        </Reveal>
      </Container>
    </Section>
  );
}
