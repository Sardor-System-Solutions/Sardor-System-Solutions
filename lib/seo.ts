import type { Metadata } from "next";
import { siteConfig } from "./site";
import { locales, defaultLocale, type Locale } from "@/i18n/routing";

/** Build a localized alternates map for hreflang tags. */
export function buildAlternates(path: string): Metadata["alternates"] {
  const clean = path === "/" ? "" : path;
  const languages: Record<string, string> = {};
  for (const locale of locales) {
    languages[locale] =
      locale === defaultLocale
        ? `${siteConfig.url}${clean || "/"}`
        : `${siteConfig.url}/${locale}${clean}`;
  }
  return {
    canonical: `${siteConfig.url}${clean || "/"}`,
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
    alternates: buildAlternates(path),
    openGraph: {
      type: "website",
      siteName: siteConfig.name,
      title: `${title} — ${siteConfig.name}`,
      description,
      locale,
      url: `${siteConfig.url}${path === "/" ? "" : path}`,
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} — ${siteConfig.name}`,
      description,
    },
  };
}
