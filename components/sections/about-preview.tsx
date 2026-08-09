import { useTranslations } from "next-intl";
import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Reveal } from "@/components/animations/reveal";
import { AnimatedText } from "@/components/animations/animated-text";

/** One statement about what the studio is for, then the way through to About. */
export function AboutPreview() {
  const t = useTranslations("AboutPreview");
  const lines = t.raw("statementLines") as string[];

  return (
    <Section>
      <Container>
        <div className="grid gap-8 md:grid-cols-12">
          <div className="md:col-span-3">
            <Reveal>
              <span className="label">{t("label")}</span>
            </Reveal>
          </div>

          <div className="md:col-span-9">
            <p className="display-2 text-balance">
              <AnimatedText lines={lines} trigger="inView" as="span" />
            </p>

            <Reveal delay={0.15}>
              <p className="lead mt-10 max-w-2xl text-pretty text-muted-foreground">
                {t("body")}
              </p>
            </Reveal>

            <Reveal delay={0.2}>
              <Link
                href="/about"
                className="group mt-10 inline-flex items-center gap-2.5 text-[1.0625rem] font-medium"
              >
                {t("cta")}
                <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1.5" />
              </Link>
            </Reveal>
          </div>
        </div>
      </Container>
    </Section>
  );
}
