import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { hasLocale } from "next-intl";
import { Send, Instagram, Phone, Mail, ArrowUpRight } from "lucide-react";
import { routing } from "@/i18n/routing";
import { buildMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site";
import { Container } from "@/components/layout/container";
import { PageHero } from "@/components/layout/page-hero";
import { Reveal } from "@/components/motion/reveal";
import { ContactForm } from "@/components/sections/contact-form";
import { BreadcrumbSchema } from "@/components/structured-data";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Meta.contact" });
  return buildMetadata({
    locale: hasLocale(routing.locales, locale) ? locale : routing.defaultLocale,
    path: "/contact",
    title: t("title"),
    description: t("description"),
  });
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Contact");

  const channels = [
    {
      label: t("channels.telegram"),
      value: "@sardor_danila_systems",
      href: siteConfig.contacts.telegram,
      Icon: Send,
      external: true,
    },
    {
      label: t("channels.instagram"),
      value: "@sardor_danila_systems",
      href: siteConfig.contacts.instagram,
      Icon: Instagram,
      external: true,
    },
    {
      label: t("channels.phone"),
      value: siteConfig.contacts.phone,
      href: siteConfig.contacts.phoneHref,
      Icon: Phone,
      external: false,
    },
    {
      label: t("channels.email"),
      value: siteConfig.contacts.email,
      href: siteConfig.contacts.emailHref,
      Icon: Mail,
      external: false,
    },
  ];

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", url: siteConfig.url },
          { name: t("title"), url: `${siteConfig.url}/contact` },
        ]}
      />
      <PageHero
        eyebrow={t("eyebrow")}
        title={t("title")}
        subtitle={t("subtitle")}
      />

      <Container className="py-20 sm:py-24">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_1fr] lg:gap-16">
          <Reveal>
            <div className="rounded-2xl border border-border bg-card p-7 sm:p-9">
              <ContactForm />
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <div>
              <h2 className="text-lg font-semibold tracking-tight text-foreground">
                {t("channels.title")}
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                {t("channels.subtitle")}
              </p>

              <ul className="mt-7 space-y-3">
                {channels.map(({ label, value, href, Icon, external }) => (
                  <li key={label}>
                    <a
                      href={href}
                      target={external ? "_blank" : undefined}
                      rel={external ? "noopener noreferrer" : undefined}
                      className="group flex items-center gap-4 rounded-xl border border-border bg-surface px-5 py-4 transition-colors hover:border-border-strong hover:bg-surface-2"
                    >
                      <span className="inline-flex size-10 items-center justify-center rounded-lg border border-border bg-card text-primary">
                        <Icon className="size-5" />
                      </span>
                      <span className="flex-1">
                        <span className="block text-xs text-muted-foreground">
                          {label}
                        </span>
                        <span className="block text-sm font-medium text-foreground">
                          {value}
                        </span>
                      </span>
                      <ArrowUpRight className="size-4 text-muted-foreground/40 transition-colors group-hover:text-foreground" />
                    </a>
                  </li>
                ))}
              </ul>

              <p className="mt-7 rounded-xl border border-border bg-card px-5 py-4 text-sm text-muted-foreground">
                {t("channels.responseTime")}
              </p>
            </div>
          </Reveal>
        </div>
      </Container>
    </>
  );
}
