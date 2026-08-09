import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { hasLocale } from "next-intl";
import { ArrowUpRight } from "lucide-react";
import { routing } from "@/i18n/routing";
import { buildMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site";
import { Container } from "@/components/layout/container";
import { PageHero } from "@/components/hero/page-hero";
import { Reveal } from "@/components/animations/reveal";
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
  const tCommon = await getTranslations("Common");

  const channels = [
    {
      label: t("channels.telegram"),
      value: siteConfig.contacts.telegramHandle,
      href: siteConfig.contacts.telegram,
      external: true,
    },
    {
      label: t("channels.instagram"),
      value: siteConfig.contacts.instagramHandle,
      href: siteConfig.contacts.instagram,
      external: true,
    },
    {
      label: t("channels.email"),
      value: siteConfig.contacts.email,
      href: siteConfig.contacts.emailHref,
      external: false,
    },
    {
      label: t("channels.phone"),
      value: siteConfig.contacts.phone,
      href: siteConfig.contacts.phoneHref,
      external: false,
    },
  ];

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "SDS", url: siteConfig.url },
          { name: t("label"), url: `${siteConfig.url}/contact` },
        ]}
      />
      <PageHero
        label={t("label")}
        titleLines={t.raw("titleLines") as string[]}
        subtitle={t("subtitle")}
      />

      <Container className="py-20 sm:py-24 lg:py-28">
        <div className="grid gap-16 md:grid-cols-12 md:gap-8">
          <div className="md:col-span-7">
            <Reveal>
              <h2 className="label mb-8">{t("form.title")}</h2>
              <ContactForm />
            </Reveal>
          </div>

          <div className="md:col-span-4 md:col-start-9">
            <Reveal delay={0.08}>
              <h2 className="label">{t("channels.title")}</h2>
              <p className="mt-4 text-pretty text-[0.9375rem] leading-relaxed text-muted-foreground">
                {t("channels.subtitle")}
              </p>

              <ul className="mt-8 border-t border-border">
                {channels.map(({ label, value, href, external }) => (
                  <li key={label} className="border-b border-border">
                    <a
                      href={href}
                      target={external ? "_blank" : undefined}
                      rel={external ? "noopener noreferrer" : undefined}
                      className="group flex items-baseline justify-between gap-4 py-4"
                    >
                      <span className="text-sm text-muted-foreground">
                        {label}
                      </span>
                      <span className="inline-flex items-center gap-1.5 text-[1.0625rem] transition-colors group-hover:text-primary">
                        {value}
                        {external ? (
                          <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                        ) : null}
                      </span>
                    </a>
                  </li>
                ))}
                <li className="flex items-baseline justify-between gap-4 border-b border-border py-4">
                  <span className="text-sm text-muted-foreground">
                    {t("channels.location")}
                  </span>
                  <span className="text-[1.0625rem]">
                    {tCommon("location")}
                  </span>
                </li>
              </ul>
            </Reveal>
          </div>
        </div>
      </Container>
    </>
  );
}
