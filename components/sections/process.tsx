import { useTranslations } from "next-intl";
import { Container } from "@/components/layout/container";
import { SectionHeader } from "@/components/layout/section";
import { Reveal } from "@/components/motion/reveal";
import { processSteps } from "@/content/process";

export function Process({
  header,
}: {
  header?: { eyebrow: string; title: string; subtitle: string };
}) {
  const t = useTranslations("Process");

  return (
    <section className="border-t border-border py-20 sm:py-24 lg:py-28">
      <Container>
        <SectionHeader
          eyebrow={header?.eyebrow ?? t("eyebrow")}
          title={header?.title ?? t("title")}
          description={header?.subtitle ?? t("subtitle")}
        />

        <ol className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {processSteps.map((step, i) => {
            const Icon = step.icon;
            return (
              <Reveal key={step.id} delay={i * 0.06} as="li">
                <div className="flex h-full flex-col gap-4">
                  <div className="flex items-center gap-3">
                    <span className="inline-flex size-10 items-center justify-center rounded-lg border border-border bg-surface text-primary">
                      <Icon className="size-5" />
                    </span>
                    <span className="font-mono text-sm text-muted-foreground">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <h3 className="text-base font-semibold tracking-tight text-foreground">
                    {t(`steps.${step.id}.title`)}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {t(`steps.${step.id}.description`)}
                  </p>
                </div>
              </Reveal>
            );
          })}
        </ol>
      </Container>
    </section>
  );
}
