import { defineRouting } from "next-intl/routing";

/*
  Russian is the default and stays unprefixed (`/`), English and Uzbek are
  served under `/en` and `/uz`. Adding another locale is a message file plus
  an entry here.
*/
export const locales = ["ru", "en", "uz"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "ru";

/** Full names, for the language switcher's accessible labels. */
export const localeNames: Record<Locale, string> = {
  ru: "Русский",
  en: "English",
  uz: "Oʻzbekcha",
};

/** Two-letter labels, for the switcher itself. */
export const localeShort: Record<Locale, string> = {
  ru: "RU",
  en: "EN",
  uz: "UZ",
};

export const routing = defineRouting({
  locales,
  defaultLocale,
  localePrefix: "as-needed",
});
