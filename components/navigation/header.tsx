"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { ArrowRight } from "lucide-react";
import { Link, usePathname } from "@/i18n/navigation";
import { navItems } from "@/data/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/container";
import { Logo } from "./logo";
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
 * Fixed header. Transparent over the top of the page, then settles into a
 * blurred bar with a hairline once scrolling starts. Deliberately flat — no
 * pill, no shadow stack.
 */
export function Header() {
  const t = useTranslations("Nav");
  const pathname = usePathname();
  const scrolled = useScrolled();

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 border-b transition-[background-color,border-color,backdrop-filter] duration-500",
        scrolled
          ? "border-border bg-background/75 backdrop-blur-xl"
          : "border-transparent bg-transparent",
      )}
    >
      <Container>
        <nav
          className={cn(
            "flex items-center justify-between transition-[height] duration-500",
            scrolled ? "h-16" : "h-20 lg:h-22",
          )}
        >
          <Logo showFullName />

          <div className="hidden items-center gap-9 lg:flex">
            {navItems.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                className={cn(
                  "link-wipe text-[0.9375rem] tracking-[-0.01em] transition-colors",
                  isActive(item.href)
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {t(item.key)}
              </Link>
            ))}
          </div>

          <div className="hidden items-center gap-6 lg:flex">
            <LanguageSwitcher />
            <Button asChild size="sm">
              <Link href="/contact">
                {t("cta")}
                <ArrowRight />
              </Link>
            </Button>
          </div>

          <MobileMenu />
        </nav>
      </Container>
    </header>
  );
}
