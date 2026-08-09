"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Link, usePathname } from "@/i18n/navigation";
import { navItems } from "@/data/navigation";
import { siteConfig } from "@/lib/site";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Logo } from "./logo";
import { LanguageSwitcher } from "./language-switcher";

/** Two bars that fold into a cross. */
function MenuGlyph({ open }: { open: boolean }) {
  return (
    <span className="relative block h-3 w-5" aria-hidden>
      <span
        className={cn(
          "absolute left-0 h-px w-full bg-current transition-all duration-300",
          open ? "top-1.5 rotate-45" : "top-0",
        )}
      />
      <span
        className={cn(
          "absolute left-0 h-px w-full bg-current transition-all duration-300",
          open ? "top-1.5 -rotate-45" : "top-3",
        )}
      />
    </span>
  );
}

/**
 * Full-screen navigation for small screens — composed for the phone rather
 * than a shrunk-down header: oversized numbered links, then language, then
 * the direct contact routes.
 */
export function MobileMenu() {
  const t = useTranslations("Nav");
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) => pathname.startsWith(href);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        className="inline-flex h-10 items-center gap-2.5 rounded-sm pl-3 text-[0.9375rem] text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring lg:hidden"
        aria-label={t("openMenu")}
      >
        {t("menu")}
        <MenuGlyph open={open} />
      </SheetTrigger>

      <SheetContent
        hideClose
        className="w-full max-w-none gap-0 border-l-0 bg-background p-0"
      >
        <SheetTitle className="sr-only">{t("menu")}</SheetTitle>

        <div className="flex h-20 items-center justify-between border-b border-border px-6 sm:px-8">
          <SheetClose asChild>
            <Logo />
          </SheetClose>
          <SheetClose
            className="inline-flex h-10 items-center gap-2.5 rounded-sm pl-3 text-[0.9375rem] outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label={t("closeMenu")}
          >
            {t("closeMenu")}
            <MenuGlyph open />
          </SheetClose>
        </div>

        <div className="flex flex-1 flex-col justify-between overflow-y-auto px-6 py-10 sm:px-8">
          <ul className="flex flex-col">
            {navItems.map((item, i) => (
              <li key={item.key} className="border-b border-border">
                <SheetClose asChild>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-baseline gap-5 py-5 text-[2rem] leading-none tracking-[-0.03em] transition-colors",
                      isActive(item.href) ? "text-primary" : "hover:text-primary",
                    )}
                  >
                    <span className="num text-subtle-foreground">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {t(item.key)}
                  </Link>
                </SheetClose>
              </li>
            ))}
          </ul>

          <div className="mt-12">
            <SheetClose asChild>
              <Button asChild size="lg" className="w-full">
                <Link href="/contact">
                  {t("cta")}
                  <ArrowRight />
                </Link>
              </Button>
            </SheetClose>

            <div className="mt-8 border-t border-border pt-6">
              <LanguageSwitcher size="lg" />
            </div>

            <div className="mt-6 flex flex-col gap-3 text-sm text-muted-foreground">
              <a
                href={siteConfig.contacts.telegram}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5"
              >
                Telegram <ArrowUpRight className="size-3.5" />
              </a>
              <a href={siteConfig.contacts.emailHref}>
                {siteConfig.contacts.email}
              </a>
              <a href={siteConfig.contacts.phoneHref}>
                {siteConfig.contacts.phone}
              </a>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
