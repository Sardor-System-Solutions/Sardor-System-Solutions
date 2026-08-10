"use client";

import { useTranslations } from "next-intl";
import { ArrowUpRight } from "lucide-react";
import { navSections } from "@/data/navigation";
import { siteConfig } from "@/lib/site";
import { scrollToSection } from "@/lib/scroll";
import { Container } from "./container";

/**
 * Compact closing bar. The contact section directly above already carries the
 * form and every channel, so this stays to a wordmark, the section links and
 * the legal line.
 */
export function Footer() {
  const t = useTranslations("Footer");
  const tNav = useTranslations("Nav");
  const tCommon = useTranslations("Common");
  const year = new Date().getFullYear();

  const social = [
    { label: "Telegram", href: siteConfig.contacts.telegram },
    { label: "Instagram", href: siteConfig.contacts.instagram },
  ];

  return (
    <footer className="bg-ink text-ink-foreground">
      <Container>
        <div className="flex flex-col gap-8 border-t border-ink-line py-10 md:flex-row md:items-center md:justify-between md:gap-10">
          <div>
            <p className="text-[1.0625rem] font-semibold leading-none tracking-[-0.045em]">
              SDS
            </p>
            <p className="mt-2 text-sm text-ink-muted">{t("tagline")}</p>
          </div>

          <nav className="flex flex-wrap gap-x-7 gap-y-2">
            {navSections.map((section) => (
              <a
                key={section.key}
                href={`#${section.id}`}
                onClick={(event) => {
                  event.preventDefault();
                  scrollToSection(section.id);
                }}
                className="link-wipe text-[0.9375rem] text-ink-foreground/80 transition-colors hover:text-ink-foreground"
              >
                {tNav(section.key)}
              </a>
            ))}
          </nav>

          <ul className="flex flex-wrap gap-x-7 gap-y-2">
            {social.map(({ label, href }) => (
              <li key={label}>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-wipe inline-flex items-center gap-1 text-[0.9375rem] text-ink-foreground/80 transition-colors hover:text-ink-foreground"
                >
                  {label}
                  <ArrowUpRight className="size-3.5" />
                </a>
              </li>
            ))}
            <li>
              <a
                href={siteConfig.contacts.emailHref}
                className="link-wipe text-[0.9375rem] text-ink-foreground/80 transition-colors hover:text-ink-foreground"
              >
                {siteConfig.contacts.email}
              </a>
            </li>
          </ul>
        </div>

        <div className="flex flex-col gap-2 border-t border-ink-line py-6 text-xs text-ink-muted sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {siteConfig.name}. {t("rights")}
          </p>
          <p>{tCommon("location")}</p>
        </div>
      </Container>
    </footer>
  );
}
