import { useTranslations } from "next-intl";
import { ArrowUpRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/layout/container";
import { SectionHeader } from "@/components/layout/section";
import { Reveal } from "@/components/motion/reveal";
import { services } from "@/content/services";

export function ServicesOverview() {
  const t = useTranslations("Services");

  return (
    <section className="py-20 sm:py-24 lg:py-28">
      <Container>
        <SectionHeader
          eyebrow={t("eyebrow")}
          title={t("title")}
          description={t("subtitle")}
        />

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, i) => {
            const Icon = service.icon;
            return (
              <Reveal key={service.id} delay={i * 0.05}>
                <Link
                  href="/services"
                  className="group flex h-full flex-col rounded-xl border border-border bg-card p-6 transition-colors hover:border-border-strong hover:bg-surface-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="inline-flex size-11 items-center justify-center rounded-lg border border-border bg-surface text-primary">
                      <Icon className="size-5" />
                    </span>
                    <ArrowUpRight className="size-5 text-muted-foreground/40 transition-colors group-hover:text-foreground" />
                  </div>
                  <h3 className="mt-5 text-lg font-semibold tracking-tight text-foreground">
                    {t(`items.${service.id}.title`)}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {t(`items.${service.id}.description`)}
                  </p>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
