import { useTranslations } from "next-intl";
import { Container } from "@/components/layout/container";
import { Section, SectionHeading } from "@/components/layout/section";
import { Stagger, StaggerItem } from "@/components/animations/reveal";
import { ProjectGlyph } from "@/components/projects/project-glyph";
import { services } from "@/data/services";

/** The five directions in full, on the about page. */
export function ServicesList() {
  const t = useTranslations("Services");

  return (
    <Section id="services">
      <Container>
        <SectionHeading label={t("label")} title={t("title")} />

        <Stagger as="ul" className="mt-14 border-t border-border lg:mt-20">
          {services.map((service, i) => {
            const points = t.raw(`items.${service.id}.points`) as string[];

            return (
              <StaggerItem
                key={service.id}
                as="li"
                id={service.anchor}
                className="scroll-mt-28 border-b border-border"
              >
                <div className="grid gap-8 py-12 md:grid-cols-12 md:py-16">
                  <div className="md:col-span-1">
                    <span className="num text-subtle-foreground">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>

                  <div className="md:col-span-5">
                    <h3 className="display-3">
                      {t(`items.${service.id}.title`)}
                    </h3>
                    <p className="mt-5 max-w-md text-pretty leading-relaxed text-muted-foreground">
                      {t(`items.${service.id}.description`)}
                    </p>
                  </div>

                  <div className="md:col-span-4">
                    <ul className="space-y-3">
                      {points.map((point) => (
                        <li
                          key={point}
                          className="flex items-baseline gap-3 text-[1.0625rem]"
                        >
                          <span
                            className="size-1 shrink-0 translate-y-[-0.2em] rounded-full bg-primary"
                            aria-hidden
                          />
                          {point}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="hidden md:col-span-2 md:flex md:items-center md:justify-end">
                    <ProjectGlyph
                      id={service.glyph}
                      className="h-14 opacity-70"
                    />
                  </div>
                </div>
              </StaggerItem>
            );
          })}
        </Stagger>
      </Container>
    </Section>
  );
}
