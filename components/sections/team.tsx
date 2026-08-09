import { useTranslations } from "next-intl";
import { Container } from "@/components/layout/container";
import { Section, SectionHeading } from "@/components/layout/section";
import { Stagger, StaggerItem } from "@/components/animations/reveal";
import { team } from "@/data/team";

/**
 * The two founders. No invented headcount, no stock portraits — the initial
 * is set as a typographic plate instead.
 */
export function Team() {
  const t = useTranslations("Team");

  return (
    <Section tone="soft" id="team">
      <Container>
        <SectionHeading label={t("label")} title={t("title")} />

        <Stagger
          as="ul"
          className="mt-14 grid gap-8 sm:grid-cols-2 lg:mt-20 lg:gap-10"
        >
          {team.map((member) => (
            <StaggerItem key={member.id} as="li">
              <div
                className="flex aspect-4/3 items-center justify-center rounded-lg border border-border bg-background"
                aria-hidden
              >
                <span className="text-[6rem] font-medium leading-none tracking-[-0.05em] text-border-strong">
                  {member.initials}
                </span>
              </div>
              <h3 className="mt-6 text-2xl font-medium tracking-[-0.03em]">
                {member.name}
              </h3>
              <p className="mt-2 text-[0.9375rem] text-muted-foreground">
                {t(`roles.${member.id}`)}
              </p>
            </StaggerItem>
          ))}
        </Stagger>
      </Container>
    </Section>
  );
}
