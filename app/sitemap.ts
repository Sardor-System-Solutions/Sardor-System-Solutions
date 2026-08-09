import type { MetadataRoute } from "next";
import { localeUrl } from "@/lib/seo";
import { locales, defaultLocale } from "@/i18n/routing";
import { projects } from "@/data/projects";

const staticPaths = ["/", "/about", "/projects", "/contact"];

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    ...staticPaths,
    ...projects.map((p) => `/projects/${p.slug}`),
  ];

  // One entry per locale, each carrying the full alternates map.
  return locales.flatMap((locale) =>
    paths.map((path) => ({
      url: localeUrl(locale, path),
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: path === "/" ? 1 : 0.7,
      alternates: {
        languages: {
          ...Object.fromEntries(
            locales.map((code) => [code, localeUrl(code, path)]),
          ),
          "x-default": localeUrl(defaultLocale, path),
        },
      },
    })),
  );
}
