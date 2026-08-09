import { useTranslations } from "next-intl";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { siteConfig } from "@/lib/site";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/animations/reveal";
import { AnimatedText } from "@/components/animations/animated-text";

/** The closing block — one of the few inverted surfaces on the site. */
export function FinalCta() {
  const t = useTranslations("Cta");
  const lines = t.raw("titleLines") as string[];

  const direct = [
    { label: "Telegram", href: siteConfig.contacts.telegram, external: true },
    {
      label: siteConfig.contacts.email,
      href: siteConfig.contacts.emailHref,
      external: false,
    },
    {
      label: siteConfig.contacts.phone,
      href: siteConfig.contacts.phoneHref,
      external: false,
    },
    {
      label: "Instagram",
      href: siteConfig.contacts.instagram,
      external: true,
    },
  ];

  return (
    <Section tone="ink" rule={false}>
      <Container>
        <div className="grid items-end gap-12 md:grid-cols-12 md:gap-8">
          <div className="md:col-span-8">
            <h2 className="display-1 text-balance">
              <AnimatedText lines={lines} trigger="inView" />
            </h2>
            <Reveal delay={0.12}>
              <p className="lead mt-8 max-w-xl text-pretty text-ink-muted">
                {t("subtitle")}
              </p>
            </Reveal>
          </div>

          <Reveal delay={0.18} className="md:col-span-4">
            <div className="flex flex-col gap-3 sm:flex-row md:flex-col">
              <Button asChild size="lg">
                <Link href="/contact">
                  {t("primary")}
                  <ArrowRight />
                </Link>
              </Button>
              <Button asChild size="lg" variant="onInk">
                <Link href="/projects">
                  {t("secondary")}
                  <ArrowRight />
                </Link>
              </Button>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.22}>
          <div className="mt-16 grid gap-6 border-t border-ink-line pt-8 md:grid-cols-12 lg:mt-20">
            <span className="label text-ink-muted md:col-span-3">
              {t("directLabel")}
            </span>
            <ul className="flex flex-wrap gap-x-10 gap-y-3 md:col-span-9">
              {direct.map(({ label, href, external }) => (
                <li key={label}>
                  <a
                    href={href}
                    target={external ? "_blank" : undefined}
                    rel={external ? "noopener noreferrer" : undefined}
                    className="link-wipe inline-flex items-center gap-1 text-[1.0625rem] text-ink-foreground/85 transition-colors hover:text-ink-foreground"
                  >
                    {label}
                    {external ? <ArrowUpRight className="size-4" /> : null}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}
