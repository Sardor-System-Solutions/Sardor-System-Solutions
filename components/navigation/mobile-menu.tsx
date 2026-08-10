"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { siteConfig } from "@/lib/site";
import { cn } from "@/lib/utils";
import { scrollToSection } from "@/lib/scroll";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Wordmark } from "./wordmark";
import { SectionNav } from "./section-nav";
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
 * Full-screen navigation for small screens. It reuses `SectionNav`, so the
 * travelling indicator and the scroll behaviour are identical to desktop —
 * just at a larger size.
 */
export function MobileMenu({ active }: { active: string | null }) {
  const t = useTranslations("Nav");
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        className="-mr-1 inline-flex h-10 items-center gap-2.5 rounded-sm px-1 text-[0.9375rem] text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring lg:hidden"
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

        <div className="flex h-16 items-center justify-between border-b border-border px-6 sm:px-8">
          <SheetClose asChild>
            <Wordmark />
          </SheetClose>
          <SheetClose
            className="-mr-1 inline-flex h-10 items-center gap-2.5 rounded-sm px-1 text-[0.9375rem] outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label={t("closeMenu")}
          >
            {t("closeMenu")}
            <MenuGlyph open />
          </SheetClose>
        </div>

        <div className="flex flex-1 flex-col justify-between overflow-y-auto px-6 py-10 sm:px-8">
          <SectionNav
            active={active}
            size="lg"
            className="flex-col items-start gap-4"
            onNavigate={() => setOpen(false)}
          />

          <div className="mt-12">
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                // Let the sheet close before the page starts moving.
                requestAnimationFrame(() => scrollToSection("contact"));
              }}
              className="inline-flex h-12 w-full items-center justify-center gap-2.5 rounded-md bg-primary px-6 text-[0.9375rem] font-medium text-primary-foreground transition-colors hover:bg-primary-hover"
            >
              {t("cta")}
              <ArrowRight className="size-4" />
            </button>

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
