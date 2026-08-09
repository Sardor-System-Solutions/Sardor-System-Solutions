import type { Metadata } from "next";
import { siteConfig } from "./site";
import { locales, defaultLocale, type Locale } from "@/i18n/routing";

/** Absolute URL for a path in a given locale. The default locale is unprefixed. */
export function localeUrl(locale: string, path: string) {
  const clean = path === "/" ? "" : path;
  return locale === defaultLocale
    ? `${siteConfig.url}${clean || "/"}`
    : `${siteConfig.url}/${locale}${clean}`;
}

/**
 * Canonical for the current locale plus the full hreflang map. Every locale
 * lists the same set, and `x-default` points at the default locale.
 */
export function buildAlternates(
  locale: Locale,
  path: string,
): Metadata["alternates"] {
  const languages: Record<string, string> = {};
  for (const code of locales) {
    languages[code] = localeUrl(code, path);
  }
  languages["x-default"] = localeUrl(defaultLocale, path);

  return {
    canonical: localeUrl(locale, path),
    languages,
  };
}

export function buildMetadata({
  locale,
  path,
  title,
  description,
}: {
  locale: Locale;
  path: string;
  title: string;
  description: string;
}): Metadata {
  return {
    title,
    description,
    alternates: buildAlternates(locale, path),
    openGraph: {
      type: "website",
      siteName: siteConfig.name,
      title: `${title} — ${siteConfig.name}`,
      description,
      locale,
      url: localeUrl(locale, path),
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} — ${siteConfig.name}`,
      description,
    },
  };
}
