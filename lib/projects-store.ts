import { list, put } from "@vercel/blob";
import type { Project } from "@/types/project";
import seedProjectsJson from "@/data/projects-seed.json";

// No database — the JSON that backs the whole site lives in Vercel Blob,
// under a fixed pathname we overwrite in place. Works in serverless because
// nothing touches the local filesystem.
const DATA_PATHNAME = "data/projects.json";

interface ProjectsFile {
    projects: Project[];
}

// The JSON import is inferred with literal types, which don't line up with
// the unions in Project. It is our own file, so widen it once here.
const seedProjects = seedProjectsJson as unknown as ProjectsFile;

async function findDataBlobUrl(): Promise<string | null> {
    try {
        const { blobs } = await list({ prefix: DATA_PATHNAME, limit: 1 });
        return blobs[0]?.url ?? null;
    } catch {
        // No BLOB_READ_WRITE_TOKEN (local dev, or before Blob is set up).
        // Callers fall back to the bundled seed rather than crashing.
        return null;
    }
}

export async function readProjects(): Promise<Project[]> {
    const url = await findDataBlobUrl();

    if (!url) {
        // First run: nothing in Blob yet, fall back to the seed bundled in the
        // repo so the site isn't empty before the first admin save.
        return seedProjects.projects;
    }

    try {
        const res = await fetch(url, { cache: "no-store" });
        if (!res.ok) return seedProjects.projects;

        const parsed = (await res.json()) as ProjectsFile;
        return parsed.projects ?? seedProjects.projects;
    } catch {
        return seedProjects.projects;
    }
}

export class ProjectsStoreError extends Error {}

export async function writeProjects(projects: Project[]): Promise<void> {
    const payload: ProjectsFile = { projects };
    try {
        await put(DATA_PATHNAME, JSON.stringify(payload, null, 2), {
            access: "public",
            addRandomSuffix: false,
            allowOverwrite: true,
            contentType: "application/json",
        });
    } catch (cause) {
        const message = cause instanceof Error ? cause.message : String(cause);

        if (/private store|public access/i.test(message)) {
            throw new ProjectsStoreError(
                "Хранилище Vercel Blob создано с приватным доступом, а сайту " +
                "нужен публичный: и данные проектов, и картинки читаются из " +
                "браузера. Переключите store на public access (или создайте " +
                "публичный) и повторите сохранение.",
            );
        }
        if (/token/i.test(message)) {
            throw new ProjectsStoreError(
                "Нет доступа к Vercel Blob — проверьте BLOB_READ_WRITE_TOKEN.",
            );
        }
        throw new ProjectsStoreError(`Не удалось сохранить в Vercel Blob: ${message}`);
    }
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
    if (next.length === projects.length) return false;

    await writeProjects(next);
    return true;
}