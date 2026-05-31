import { useTranslations } from "next-intl";
import { Send, Instagram, Phone, Mail } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { navItems, siteConfig } from "@/lib/site";
import { Logo } from "./logo";

export function Footer() {
  const t = useTranslations("Footer");
  const tNav = useTranslations("Nav");
  const year = new Date().getFullYear();

  const social = [
    { label: "Telegram", href: siteConfig.contacts.telegram, Icon: Send },
    { label: "Instagram", href: siteConfig.contacts.instagram, Icon: Instagram },
    { label: "Phone", href: siteConfig.contacts.phoneHref, Icon: Phone },
    { label: "Email", href: siteConfig.contacts.emailHref, Icon: Mail },
  ];

  return (
    <footer className="border-t border-border bg-surface/40">
      <div className="mx-auto w-full max-w-6xl px-6 py-16 lg:px-8">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr]">
          <div className="max-w-sm">
            <Logo />
            <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
              {t("tagline")}
            </p>
            <p className="mt-5 text-xs text-muted-foreground">
              {t("location")}
            </p>
          </div>

          <div>
            <h3 className="eyebrow mb-4">{t("navigate")}</h3>
            <ul className="space-y-3">
              {navItems.map((item) => (
                <li key={item.key}>
                  <Link
                    href={item.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {tNav(item.key)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="eyebrow mb-4">{t("connect")}</h3>
            <ul className="space-y-3">
              {social.map(({ label, href, Icon }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    <Icon className="size-4" />
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-start justify-between gap-3 border-t border-border pt-8 text-xs text-muted-foreground sm:flex-row sm:items-center">
          <p>
            &copy; {year} {siteConfig.name}. {t("rights")}
          </p>
          <p className="font-mono tracking-tight">{siteConfig.shortName}</p>
        </div>
      </div>
    </footer>
  );
}
