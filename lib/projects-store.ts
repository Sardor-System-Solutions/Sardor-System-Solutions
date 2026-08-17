import { list, put } from "@vercel/blob";
import type { Project } from "@/types/project";
import seedProjects from "@/data/projects-seed.json";

// No database — the JSON that backs the whole site lives in Vercel Blob,
// under a fixed pathname we overwrite in place. Works in serverless because
// nothing touches the local filesystem.
const DATA_PATHNAME = "data/projects.json";

interface ProjectsFile {
    projects: Project[];
}

async function findDataBlobUrl(): Promise<string | null> {
    const { blobs } = await list({ prefix: DATA_PATHNAME, limit: 1 });
    return blobs[0]?.url ?? null;
}

export async function readProjects(): Promise<Project[]> {
    const url = await findDataBlobUrl();

    if (!url) {
        // First run: nothing in Blob yet, fall back to the seed bundled in the
        // repo so the site isn't empty before the first admin save.
        return (seedProjects as ProjectsFile).projects;
    }

    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) return (seedProjects as ProjectsFile).projects;

    const parsed = (await res.json()) as ProjectsFile;
    return parsed.projects;
}

export async function writeProjects(projects: Project[]): Promise<void> {
    const payload: ProjectsFile = { projects };
    await put(DATA_PATHNAME, JSON.stringify(payload, null, 2), {
        access: "public",
        addRandomSuffix: false,
        allowOverwrite: true,
        contentType: "application/json",
    });
}

export async function getProjectBySlug(slug: string) {
    const projects = await readProjects();
    return projects.find((p) => p.slug === slug);
}

export function slugify(input: string) {
    return input
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
}

export async function upsertProject(project: Project) {
    const projects = await readProjects();
    const idx = projects.findIndex((p) => p.slug === project.slug);

    if (idx === -1) {
        const nextId = projects.length
            ? Math.max(...projects.map((p) => p.id)) + 1
            : 1;
        projects.push({ ...project, id: nextId });
    } else {
        projects[idx] = { ...projects[idx], ...project, id: projects[idx].id };
    }

    await writeProjects(projects);
    return project;
}

export async function deleteProjectBySlug(slug: string) {
    const projects = await readProjects();
    const next = projects.filter((p) => p.slug !== slug);
    await writeProjects(next);
    return next.length !== projects.length;
}