import { cache } from "react";
import { list, put } from "@vercel/blob";
import type { Project } from "@/types/project";
import seedProjectsJson from "@/data/projects-seed.json";

/*
  No database — the JSON that backs the whole site lives in Vercel Blob, under
  a fixed pathname we overwrite in place. Works in serverless because nothing
  touches the local filesystem.

  The same three rules as the CRM store keep it quick and honest:

  - the blob URL is resolved once per process, so a read is one request rather
    than `list()` + `fetch`;
  - the parsed file is held briefly (`MEMO_TTL_MS`) so a page that asks for it
    from several places pays for one read;
  - it is written with `cacheControlMaxAge: 0` and read through a unique URL,
    because a CDN copy of the previous version is indistinguishable from an
    edit that never saved.

  Anything that writes — and the admin screens, which must show what was just
  saved — reads with `{ fresh: true }` and skips the memo entirely.
*/

const DATA_PATHNAME = "data/projects.json";

/** How long a parsed file is reused on the public site. */
const MEMO_TTL_MS = 15_000;

interface ProjectsFile {
    projects: Project[];
}

// The JSON import is inferred with literal types, which don't line up with
// the unions in Project. It is our own file, so widen it once here.
const seedProjects = seedProjectsJson as unknown as ProjectsFile;

let blobUrl: string | null = null;
let memo: { projects: Project[]; at: number } | null = null;

async function findDataBlobUrl(): Promise<string | null> {
    if (blobUrl) return blobUrl;
    try {
        const { blobs } = await list({ prefix: DATA_PATHNAME, limit: 10 });
        blobUrl =
            blobs.find((b) => b.pathname === DATA_PATHNAME)?.url ??
            blobs[0]?.url ??
            null;
        return blobUrl;
    } catch {
        // No BLOB_READ_WRITE_TOKEN (local dev, or before Blob is set up).
        // Callers fall back to the bundled seed rather than crashing.
        return null;
    }
}

/** One trip to storage, no memo involved. */
async function load(): Promise<Project[]> {
    const url = await findDataBlobUrl();

    // First run: nothing in Blob yet, fall back to the seed bundled in the
    // repo so the site isn't empty before the first admin save.
    if (!url) return seedProjects.projects;

    try {
        const res = await fetch(`${url}?t=${Date.now()}`, { cache: "no-store" });
        if (!res.ok) {
            blobUrl = null;
            return seedProjects.projects;
        }

        const parsed = (await res.json()) as ProjectsFile;
        return parsed.projects ?? seedProjects.projects;
    } catch {
        return seedProjects.projects;
    }
}

/** Per-request dedupe, on top of the cross-request memo below. */
const loadOnce = cache(load);

export async function readProjects(
    { fresh = false }: { fresh?: boolean } = {},
): Promise<Project[]> {
    if (fresh) {
        const projects = await load();
        memo = { projects, at: Date.now() };
        return projects;
    }

    if (memo && Date.now() - memo.at < MEMO_TTL_MS) return memo.projects;

    const projects = await loadOnce();
    memo = { projects, at: Date.now() };
    return projects;
}

export class ProjectsStoreError extends Error {}

export async function writeProjects(projects: Project[]): Promise<void> {
    const payload: ProjectsFile = { projects };
    memo = null;

    try {
        const result = await put(DATA_PATHNAME, JSON.stringify(payload, null, 2), {
            access: "public",
            addRandomSuffix: false,
            allowOverwrite: true,
            contentType: "application/json",
            // Overwritten in place, so an edge copy of the old version would
            // keep the site showing yesterday's portfolio.
            cacheControlMaxAge: 0,
        });
        blobUrl = result.url;
        memo = { projects, at: Date.now() };
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
    // Used by the admin editor — it must never open a stale copy of the form.
    const projects = await readProjects({ fresh: true });
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
    // Always against the stored file — writing on top of a memoised copy would
    // drop whatever was saved in between.
    const projects = await readProjects({ fresh: true });
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
    const projects = await readProjects({ fresh: true });
    const next = projects.filter((p) => p.slug !== slug);
    if (next.length === projects.length) return false;

    await writeProjects(next);
    return true;
}
