import { useTranslations } from "next-intl";
import { ArrowUpRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { navItems } from "@/data/navigation";
import { siteConfig } from "@/lib/site";
import { Container } from "./container";

/** Inverted, and the last thing on every page. */
export function Footer() {
  const t = useTranslations("Footer");
  const tNav = useTranslations("Nav");
  const tCommon = useTranslations("Common");
  const year = new Date().getFullYear();

  const social = [
    { label: "Telegram", href: siteConfig.contacts.telegram, external: true },
    { label: "Instagram", href: siteConfig.contacts.instagram, external: true },
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
  ];

  return (
    <footer className="bg-ink text-ink-foreground">
      <Container>
        <div className="grid gap-12 border-t border-ink-line py-16 md:grid-cols-12 md:gap-8 lg:py-20">
          <div className="md:col-span-5">
            <p className="text-[1.375rem] font-medium leading-none tracking-[-0.03em]">
              SDS
            </p>
            <p className="mt-3 text-sm text-ink-muted">{t("fullName")}</p>
            <p className="mt-6 max-w-xs text-pretty text-sm leading-relaxed text-ink-muted">
              {t("tagline")}
            </p>
          </div>

          <div className="md:col-span-3 md:col-start-7">
            <h2 className="label text-ink-muted">{t("navigate")}</h2>
            <ul className="mt-5 space-y-3">
              {navItems.map((item) => (
                <li key={item.key}>
                  <Link
                    href={item.href}
                    className="link-wipe text-[0.9375rem] text-ink-foreground/80 transition-colors hover:text-ink-foreground"
                  >
                    {tNav(item.key)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-3">
            <h2 className="label text-ink-muted">{t("connect")}</h2>
            <ul className="mt-5 space-y-3">
              {social.map(({ label, href, external }) => (
                <li key={label}>
                  <a
                    href={href}
                    target={external ? "_blank" : undefined}
                    rel={external ? "noopener noreferrer" : undefined}
                    className="link-wipe inline-flex items-center gap-1 text-[0.9375rem] text-ink-foreground/80 transition-colors hover:text-ink-foreground"
                  >
                    {label}
                    {external ? <ArrowUpRight className="size-3.5" /> : null}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex flex-col gap-2 border-t border-ink-line py-7 text-xs text-ink-muted sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {siteConfig.name}. {t("rights")}
          </p>
          <p>{tCommon("location")}</p>
        </div>
      </Container>
    </footer>
  );
}
