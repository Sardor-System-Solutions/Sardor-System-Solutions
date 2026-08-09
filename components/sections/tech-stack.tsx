import { useTranslations } from "next-intl";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Reveal, Stagger, StaggerItem } from "@/components/animations/reveal";
import { techGroups } from "@/data/tech";

/** The stack, grouped by layer rather than dumped as a wall of logos. */
export function TechStack() {
  const t = useTranslations("Tech");

  return (
    <Section size="compact" id="stack">
      <Container>
        <div className="grid gap-10 md:grid-cols-12 md:gap-8">
          <div className="md:col-span-3">
            <Reveal>
              <span className="label">{t("label")}</span>
              <p className="mt-4 max-w-xs text-pretty text-[0.9375rem] leading-relaxed text-muted-foreground">
                {t("subtitle")}
              </p>
            </Reveal>
          </div>

          <Stagger className="grid grid-cols-2 gap-x-8 gap-y-10 md:col-span-9 lg:grid-cols-4">
            {techGroups.map((group) => (
              <StaggerItem key={group.id}>
                <span className="label">{t(`groups.${group.labelKey}`)}</span>
                <ul className="mt-4 space-y-2">
                  {group.items.map((item) => (
                    <li key={item} className="text-[1.0625rem] tracking-[-0.02em]">
                      {item}
                    </li>
                  ))}
                </ul>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </Container>
    </Section>
  );
}
