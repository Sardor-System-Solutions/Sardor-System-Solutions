"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Link, usePathname } from "@/i18n/navigation";
import { navSectionIds } from "@/data/navigation";
import { cn } from "@/lib/utils";
import { useActiveSection } from "@/lib/use-active-section";
import { scrollToSection } from "@/lib/scroll";
import { Container } from "@/components/layout/container";
import { Wordmark } from "./wordmark";
import { SectionNav } from "./section-nav";
import { LanguageSwitcher } from "./language-switcher";
import { MobileMenu } from "./mobile-menu";

function useScrolled(threshold = 8) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > threshold);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);
  return scrolled;
}

/**
 * Fixed header. A floating bar with a moderate radius: transparent at the top
 * of the page, settling into a blurred panel once scrolling starts.
 *
 * It has two modes. On the one-page site it carries the section navigation
 * with the travelling indicator. Inside a case study there are no sections to
 * track, so it swaps to a single "back" action and gets out of the way.
 */
export function Header() {
  const t = useTranslations("Nav");
  const pathname = usePathname();
  const scrolled = useScrolled();

  const isCaseStudy = pathname.startsWith("/projects/");
  const active = useActiveSection(navSectionIds);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <Container className="pt-3 sm:pt-4">
        <div
          className={cn(
            "flex items-center justify-between gap-6 rounded-xl px-4 transition-[background-color,box-shadow,backdrop-filter,height] duration-500 sm:px-5",
            scrolled ? "h-14" : "h-16",
            scrolled
              ? "bg-background/70 shadow-[0_1px_0_0_var(--border)] backdrop-blur-xl"
              : "bg-transparent",
          )}
        >
          <Wordmark />

          {isCaseStudy ? (
            <Link
              href="/#projects"
              className="group inline-flex items-center gap-2 text-[0.9375rem] text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="size-4 transition-transform duration-300 group-hover:-translate-x-1" />
              {t("back")}
            </Link>
          ) : (
            <>
              <SectionNav
                active={active}
                className="hidden gap-8 lg:flex"
              />

              <div className="hidden items-center gap-6 lg:flex">
                <LanguageSwitcher />
                <button
                  type="button"
                  onClick={() => scrollToSection("contact")}
                  className="group inline-flex h-9 items-center gap-2 rounded-md bg-primary px-4 text-[0.875rem] font-medium text-primary-foreground transition-colors hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  {t("cta")}
                  <ArrowRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
                </button>
              </div>

              <MobileMenu active={active} />
            </>
          )}
        </div>
      </Container>
    </header>
  );
}
