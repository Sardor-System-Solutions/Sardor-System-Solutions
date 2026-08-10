import { useTranslations } from "next-intl";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Reveal, Stagger, StaggerItem } from "@/components/animations/reveal";
import { AnimatedText } from "@/components/animations/animated-text";
import { services } from "@/data/services";
import { techGroups } from "@/data/tech";

/**
 * About, compressed to what a visitor actually needs before the work: one
 * statement, the five directions, and a single line about the team. Anything
 * longer belongs in a conversation, not on the home page.
 */
export function AboutSection() {
  const t = useTranslations("About");
  const tServices = useTranslations("Services");
  const statement = t.raw("statementLines") as string[];
  const stack = techGroups.flatMap((group) => group.items);

  return (
    <Section id="about">
      <Container>
        <div className="grid gap-8 md:grid-cols-12">
          <div className="md:col-span-3">
            <Reveal>
              <span className="label">{t("label")}</span>
            </Reveal>
          </div>

          <div className="md:col-span-9">
            <p className="display-2 text-balance">
              <AnimatedText lines={statement} trigger="inView" as="span" />
            </p>

            <Reveal delay={0.12}>
              <p className="lead mt-8 max-w-2xl text-pretty text-muted-foreground">
                {t("body")}
              </p>
            </Reveal>
          </div>
        </div>

        {/* The five directions. */}
        <Stagger
          as="ul"
          className="mt-16 grid gap-x-8 gap-y-10 border-t border-border-strong pt-10 sm:grid-cols-2 lg:mt-20 lg:grid-cols-5"
        >
          {services.map((service, i) => (
            <StaggerItem key={service.id} as="li">
              <span className="num text-subtle-foreground">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-3 text-lg tracking-[-0.025em]">
                {tServices(`items.${service.id}.title`)}
              </h3>
              <p className="mt-2 text-pretty text-sm leading-relaxed text-muted-foreground">
                {tServices(`items.${service.id}.summary`)}
              </p>
            </StaggerItem>
          ))}
        </Stagger>

        {/* Team and stack, on one line each. */}
        <Reveal>
          <div className="mt-16 grid gap-8 border-t border-border pt-8 md:grid-cols-12 lg:mt-20">
            <div className="md:col-span-3">
              <span className="label">{t("teamLabel")}</span>
              <p className="mt-3 text-[0.9375rem]">{t("team")}</p>
            </div>
            <div className="md:col-span-8 md:col-start-5">
              <span className="label">{t("stackLabel")}</span>
              <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-2">
                {stack.map((item) => (
                  <li
                    key={item}
                    className="text-[0.9375rem] tracking-[-0.02em] text-muted-foreground"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}
