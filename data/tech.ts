/**
 * The stack the studio works in, grouped by layer rather than dumped as a
 * wall of logos. Names are product names and stay in English.
 */
export interface TechGroup {
  id: string;
  /** Message key under `Tech.groups`. */
  labelKey: string;
  items: string[];
}

export const techGroups: TechGroup[] = [
  { id: "frontend", labelKey: "frontend", items: ["Next.js", "React", "TypeScript"] },
  { id: "backend", labelKey: "backend", items: ["Node.js", "NestJS", "Python"] },
  { id: "data", labelKey: "data", items: ["PostgreSQL", "Prisma"] },
  { id: "mobile", labelKey: "mobile", items: ["React Native", "Expo"] },
];
