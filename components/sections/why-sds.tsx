import { useTranslations } from "next-intl";
import { Container } from "@/components/layout/container";
import { SectionHeader } from "@/components/layout/section";
import { Reveal } from "@/components/motion/reveal";
import { type WhyId } from "@/content/tech";

const items: WhyId[] = ["senior", "endToEnd", "reliable", "partner"];

export function WhySds() {
  const t = useTranslations("Why");

  return (
    <section className="border-t border-border py-20 sm:py-24 lg:py-28">
      <Container>
        <SectionHeader
          eyebrow={t("eyebrow")}
          title={t("title")}
          description={t("subtitle")}
        />

        <div className="mt-14 grid gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-2">
          {items.map((id, i) => (
            <Reveal key={id} delay={i * 0.05} className="bg-card">
              <div className="flex h-full flex-col gap-3 p-7 lg:p-8">
                <span className="font-mono text-sm text-primary">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="text-lg font-semibold tracking-tight text-foreground">
                  {t(`items.${id}.title`)}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {t(`items.${id}.description`)}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
