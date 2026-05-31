import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";
import { locales, defaultLocale } from "@/i18n/routing";
import { projects } from "@/content/projects";

const staticPaths = ["", "/services", "/portfolio", "/about", "/contact"];

function localizedUrl(locale: string, path: string) {
  if (locale === defaultLocale) return `${siteConfig.url}${path}` || siteConfig.url;
  return `${siteConfig.url}/${locale}${path}`;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    ...staticPaths,
    ...projects.map((p) => `/portfolio/${p.slug}`),
  ];

  return paths.map((path) => ({
    url: localizedUrl(defaultLocale, path) || siteConfig.url,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: path === "" ? 1 : 0.7,
    alternates: {
      languages: Object.fromEntries(
        locales.map((locale) => [locale, localizedUrl(locale, path)]),
      ),
    },
  }));
}
