import {
  Code2,
  Smartphone,
  LayoutDashboard,
  PenTool,
  Workflow,
  type LucideIcon,
} from "lucide-react";

export type ServiceId = "web" | "mobile" | "crm" | "design" | "automation";

export type Service = {
  id: ServiceId;
  icon: LucideIcon;
  /** Technologies shown on the service detail card (not translated). */
  stack: string[];
};

export const services: Service[] = [
  {
    id: "web",
    icon: Code2,
    stack: ["React", "Next.js", "TypeScript", "Tailwind CSS", "PostgreSQL"],
  },
  {
    id: "mobile",
    icon: Smartphone,
    stack: ["React Native", "Expo", "TypeScript", "Firebase"],
  },
  {
    id: "crm",
    icon: LayoutDashboard,
    stack: ["Next.js", "NestJS", "PostgreSQL", "Prisma", "Redis"],
  },
  {
    id: "design",
    icon: PenTool,
    stack: ["Figma", "Design systems", "Prototyping", "WCAG"],
  },
  {
    id: "automation",
    icon: Workflow,
    stack: ["Node.js", "REST & GraphQL", "Webhooks", "Integrations"],
  },
];
