import type { Project, ProjectSlug } from "@/types/project";

/*
  The work index — the single source of truth for both the gallery and the
  case studies. Adding a project here gives it a card, a case study page, a
  sitemap entry and a place in the next-project chain, with no layout changes.

  Only real captures are referenced. Projects without one fall back to a
  schematic plate; we never mock up an interface that was not photographed.
*/

const shot = (name: string, captionKey?: string): Project["cover"] => ({
  src: `/work/${name}.webp`,
  width: 2000,
  height: 1091,
  ratio: "wide",
  captionKey,
});

export const projects: Project[] = [
  {
    id: 1,
    slug: "oson-uy",
    title: "Oson Uy",
    kind: "product",
    glyph: "platform",
    cover: shot("oson-uy", "home"),
    images: [],
    href: "https://oson-uy.uz",
    domain: "oson-uy.uz",
    technologies: [],
    featured: true,
    span: "half",
  },
  {
    id: 2,
    slug: "oson-uy-mobile",
    title: "Oson Uy Mobile",
    kind: "product",
    glyph: "mobile",
    images: [],
    technologies: [],
    featured: true,
    span: "half",
  },
  {
    id: 3,
    slug: "oson-uy-crm",
    title: "Oson Uy CRM",
    kind: "product",
    glyph: "dashboard",
    cover: shot("dashboard", "overview"),
    images: [],
    href: "https://dashboard.oson-uy.uz",
    domain: "dashboard.oson-uy.uz",
    technologies: [],
    featured: true,
    span: "half",
  },
  {
    id: 4,
    slug: "wms",
    title: "WMS",
    kind: "product",
    glyph: "warehouse",
    images: [],
    technologies: [],
    featured: true,
    span: "half",
  },
  {
    id: 5,
    slug: "kidscity",
    title: "KidsCity.uz",
    kind: "product",
    glyph: "store",
    cover: shot("kidscity", "advantages"),
    images: [],
    href: "https://kidscity.uz",
    domain: "kidscity.uz",
    technologies: [],
    featured: true,
    span: "half",
  },
  {
    id: 6,
    slug: "evro-plaza",
    title: "EVRO PLAZA",
    kind: "product",
    glyph: "site",
    images: [],
    technologies: [],
    featured: false,
    span: "half",
  },
  {
    id: 7,
    slug: "pishcool",
    title: "Pishcool",
    kind: "commercial",
    glyph: "site",
    href: "https://pishcool.uz",
    domain: "pishcool.uz",
    images: [],
    technologies: [],
    featured: false,
    span: "half",
  },
  {
    id: 8,
    slug: "samyak",
    title: "Samyak",
    kind: "commercial",
    glyph: "site",
    href: "https://samyak.uz",
    domain: "samyak.uz",
    images: [],
    technologies: [],
    featured: false,
    span: "half",
  },
  {
    id: 9,
    slug: "tespack",
    title: "Tespack",
    kind: "commercial",
    glyph: "site",
    href: "https://tespack.uz",
    domain: "tespack.uz",
    images: [],
    technologies: [],
    featured: false,
    span: "half",
  },
];

export const productProjects = projects.filter((p) => p.kind === "product");
export const commercialProjects = projects.filter(
  (p) => p.kind === "commercial",
);

/** The five carried on the home page, in presentation order. */
export const featuredProjects = projects.filter((p) => p.featured);

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

/**
 * The next case in the chain. Products cycle through products and commercial
 * work cycles through commercial work, so "next project" never silently
 * crosses from an SDS product into Dotlabs-era work.
 */
export function getNextProject(slug: ProjectSlug): Project {
  const pool = getProject(slug)?.kind === "commercial" ? commercialProjects : productProjects;
  const index = pool.findIndex((p) => p.slug === slug);
  return pool[(index + 1) % pool.length];
}
