export type ProjectId = "oson-uy" | "crm-dashboard" | "mobile-app";

export type ProjectScreenshot = {
  src: string;
  /** Aspect hint for layout: "wide" (16:9) or "tall" (mobile). */
  ratio: "wide" | "tall";
};

export type Project = {
  id: ProjectId;
  slug: ProjectId;
  cover: string;
  screenshots: ProjectScreenshot[];
  tech: string[];
  /** Number of result metrics defined in messages for this project. */
  resultCount: number;
  year: string;
  featured: boolean;
};

export const projects: Project[] = [
  {
    id: "oson-uy",
    slug: "oson-uy",
    cover: "/oson-uy.png",
    screenshots: [{ src: "/oson-uy.png", ratio: "wide" }],
    tech: ["Next.js", "TypeScript", "PostgreSQL", "Prisma", "Mapbox"],
    resultCount: 3,
    year: "2024",
    featured: true,
  },
  {
    id: "crm-dashboard",
    slug: "crm-dashboard",
    cover: "/dashboard.png",
    screenshots: [{ src: "/dashboard.png", ratio: "wide" }],
    tech: ["Next.js", "NestJS", "PostgreSQL", "Redis", "WebSockets"],
    resultCount: 3,
    year: "2024",
    featured: true,
  },
  {
    id: "mobile-app",
    slug: "mobile-app",
    cover: "/kidscity.png",
    screenshots: [{ src: "/kidscity.png", ratio: "wide" }],
    tech: ["React Native", "Expo", "TypeScript", "Firebase"],
    resultCount: 3,
    year: "2023",
    featured: true,
  },
];

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}
