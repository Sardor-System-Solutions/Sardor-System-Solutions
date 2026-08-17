
import type { Locale, Project } from "@/types/project";
import { readProjects } from "./projects-store";

/**
 * Public-site replacement for the old `data/projects.ts`.
 * Call from server components: `const projects = await getProjects()`.
 */
export async function getProjects() {
    return readProjects();
}

export async function getProjectBySlugPublic(slug: string) {
    const projects = await readProjects();
    return projects.find((p) => p.slug === slug);
}

export function productProjectsOf(projects: Project[]) {
    return projects.filter((p) => p.kind === "product");
}
export function commercialProjectsOf(projects: Project[]) {
    return projects.filter((p) => p.kind === "commercial");
}
export function featuredProjectsOf(projects: Project[]) {
    return projects.filter((p) => p.featured);
}

/** Pulls the translation object your components used to get via useTranslations("Projects"). */
export function projectCopy(project: Project, locale: Locale) {
    return project.i18n[locale] ?? project.i18n.en;
}

export function getNextProjectOf(projects: Project[], slug: string) {
    const current = projects.find((p) => p.slug === slug);
    const pool = current?.kind === "commercial"
        ? commercialProjectsOf(projects)
        : productProjectsOf(projects);
    const index = pool.findIndex((p) => p.slug === slug);
    return pool[(index + 1) % pool.length];
}
