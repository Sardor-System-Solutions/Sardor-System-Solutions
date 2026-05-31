import { defineRouting } from "next-intl/routing";

export const locales = ["en", "ru", "uz"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

export const localeNames: Record<Locale, string> = {
  en: "English",
  ru: "Русский",
  uz: "Oʻzbekcha",
};

export const localeShort: Record<Locale, string> = {
  en: "EN",
  ru: "RU",
  uz: "UZ",
};

export const routing = defineRouting({
  locales,
  defaultLocale,
  localePrefix: "as-needed",
});
