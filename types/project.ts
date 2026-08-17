export type ProjectKind = "product" | "commercial";

export type GlyphId =
  | "platform"
  | "dashboard"
  | "mobile"
  | "warehouse"
  | "store"
  | "site";

export type Locale = "en" | "ru" | "uz";

export const LOCALES: Locale[] = ["en", "ru", "uz"];

export interface ProjectImage {
  src: string;
  width: number;
  height: number;
  ratio?: "wide" | "tall";
  captionKey?: string;
}

export interface ProjectTranslation {
  category: string;
  description: string;
  role: string;
  overview: string[];
  challenge: string[];
  solution: string[];
  features: string[];
  result: string[];
  captions: Record<string, string>;
}

export interface Project {
  id: number;
  slug: string;
  title: string;
  kind: ProjectKind;
  glyph: GlyphId;
  cover?: ProjectImage;
  images: ProjectImage[];
  href?: string;
  domain?: string;
  technologies: string[];
  year?: string;
  featured: boolean;
  span: "full" | "half";
  i18n: Record<Locale, ProjectTranslation>;
}

export const emptyTranslation: ProjectTranslation = {
  category: "",
  description: "",
  role: "",
  overview: [],
  challenge: [],
  solution: [],
  features: [],
  result: [],
  captions: {},
};
