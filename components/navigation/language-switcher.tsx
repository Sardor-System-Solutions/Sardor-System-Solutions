"use client";

import { useTransition } from "react";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { locales, localeNames, localeShort, type Locale } from "@/i18n/routing";
import { cn } from "@/lib/utils";

/**
 * Three labels separated by hairlines — no boxed control, so it sits inside
 * the header without reading as a widget. Switching keeps the current path.
 */
export function LanguageSwitcher({
  className,
  size = "sm",
  tone = "default",
}: {
  className?: string;
  size?: "sm" | "lg";
  tone?: "default" | "ink";
}) {
  const t = useTranslations("Nav");
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function onSelect(next: Locale) {
    if (next === locale) return;
    startTransition(() => {
      router.replace(pathname, { locale: next });
    });
  }

  const isInk = tone === "ink";

  return (
    <div
      role="group"
      aria-label={t("language")}
      className={cn(
        "flex items-center transition-opacity",
        size === "sm" ? "gap-2.5" : "gap-3.5",
        isPending && "opacity-60",
        className,
      )}
    >
      {locales.map((code, i) => {
        const active = code === locale;
        return (
          <span key={code} className="flex items-center gap-2.5">
            {i > 0 ? (
              <span
                aria-hidden
                className={cn(
                  "w-px",
                  isInk ? "bg-ink-line" : "bg-border-strong",
                  size === "sm" ? "h-2.5" : "h-3",
                )}
              />
            ) : null}
            <button
              type="button"
              lang={code}
              onClick={() => onSelect(code)}
              aria-current={active ? "true" : undefined}
              aria-label={localeNames[code]}
              className={cn(
                "rounded-sm tracking-[0.06em] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4",
                size === "sm" ? "text-xs" : "text-sm",
                active
                  ? isInk
                    ? "font-medium text-ink-foreground"
                    : "font-medium text-foreground"
                  : isInk
                    ? "text-ink-muted hover:text-ink-foreground"
                    : "text-subtle-foreground hover:text-foreground",
              )}
            >
              {localeShort[code]}
            </button>
          </span>
        );
      })}
    </div>
  );
}
