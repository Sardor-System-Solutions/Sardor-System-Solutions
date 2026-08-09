import { useTranslations } from "next-intl";
import { Container } from "@/components/layout/container";
import { Section, SectionHeading } from "@/components/layout/section";
import { DrawLine, Stagger, StaggerItem } from "@/components/animations/reveal";
import { processSteps } from "@/data/process";

/**
 * The five stages of a project, on a timeline that draws itself: horizontal
 * on desktop, vertical on mobile.
 */
export function Process() {
  const t = useTranslations("Process");

  return (
    <Section id="process">
      <Container>
        <SectionHeading
          label={t("label")}
          title={t("title")}
          description={t("subtitle")}
        />

        <div className="relative mt-16 lg:mt-24">
          <DrawLine className="absolute left-[3px] top-0 hidden h-full w-px bg-border-strong sm:block md:left-0 md:h-px md:w-full" />

          <Stagger
            as="ol"
            className="grid gap-10 sm:pl-10 md:grid-cols-5 md:gap-6 md:pl-0"
          >
            {processSteps.map((step, i) => (
              <StaggerItem key={step} as="li" className="relative md:pt-10">
                <span
                  className="absolute -left-10 top-2 hidden size-[7px] rounded-full bg-primary sm:block md:left-0 md:top-0 md:-translate-y-1/2"
                  aria-hidden
                />
                <span className="num text-subtle-foreground">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-3 text-xl tracking-[-0.025em]">
                  {t(`steps.${step}.title`)}
                </h3>
                <p className="mt-2.5 max-w-xs text-pretty text-[0.9375rem] leading-relaxed text-muted-foreground">
                  {t(`steps.${step}.description`)}
                </p>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </Container>
    </Section>
  );
}
