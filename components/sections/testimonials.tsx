import { useTranslations } from "next-intl";
import { Quote } from "lucide-react";
import { Container } from "@/components/layout/container";
import { SectionHeader } from "@/components/layout/section";
import { Reveal } from "@/components/motion/reveal";

export function Testimonials() {
  const t = useTranslations("Testimonials");

  return (
    <section className="border-t border-border py-20 sm:py-24 lg:py-28">
      <Container>
        <SectionHeader
          eyebrow={t("eyebrow")}
          title={t("title")}
          description={t("subtitle")}
        />

        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <Reveal key={i} delay={i * 0.06}>
              <figure className="flex h-full flex-col gap-5 rounded-xl border border-dashed border-border bg-card/40 p-7">
                <Quote className="size-6 text-primary/50" />
                <div className="flex-1 space-y-2.5" aria-hidden>
                  <div className="h-3 w-full rounded-full bg-muted" />
                  <div className="h-3 w-11/12 rounded-full bg-muted" />
                  <div className="h-3 w-4/5 rounded-full bg-muted" />
                </div>
                <figcaption className="flex items-center gap-3 border-t border-border pt-5">
                  <div className="size-10 rounded-full bg-muted" aria-hidden />
                  <span className="text-sm text-muted-foreground">
                    {t("placeholder")}
                  </span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
