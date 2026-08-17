import "server-only";
import { promises as fs } from "node:fs";
import path from "node:path";
import { list, put } from "@vercel/blob";
import { emptyCrmData, type CrmData } from "@/types/crm";

/*
  Persistence for the CRM.

  There is no database in this project — the public content already lives as a
  JSON document in Vercel Blob, and the CRM follows the same shape so there is
  one storage story rather than two.

  Two drivers sit behind one interface:

  - `blob` — production. Overwrites a single pathname in place.
  - `file` — local development. Writes `.data/crm.json`, which is gitignored.

  The driver is chosen by whether Blob can be *written*, not merely read: a
  store configured with private access answers `list()` happily and then
  rejects every `put()`, which would otherwise look like a working setup that
  silently loses data. `CRM_STORE=file|blob` overrides the probe.

  Swapping in a real database later means replacing this file and nothing
  else — everything above it goes through `readCrm`/`writeCrm`.
*/

const BLOB_PATHNAME = "data/crm.json";
const FILE_PATH = path.join(process.cwd(), ".data", "crm.json");

export type StoreDriver = "blob" | "file";

export class CrmStoreError extends Error {}

let cached: { driver: StoreDriver; reason?: string } | null = null;

function describeBlobFailure(message: string) {
  if (/private store|public access/i.test(message)) {
    return "хранилище Vercel Blob создано с приватным доступом, а данным нужен публичный";
  }
  if (/access denied|token/i.test(message)) {
    return "Vercel Blob отклонил токен (BLOB_READ_WRITE_TOKEN)";
  }
  return message;
}

async function probeDriver(): Promise<{ driver: StoreDriver; reason?: string }> {
  const override = process.env.CRM_STORE;
  if (override === "file" || override === "blob") return { driver: override };

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return { driver: "file", reason: "BLOB_READ_WRITE_TOKEN не задан" };
  }

  try {
    // A real, tiny write — the only honest test of whether Blob will accept data.
    await put(`${BLOB_PATHNAME}.probe`, "{}", {
      access: "public",
      addRandomSuffix: false,
      allowOverwrite: true,
      contentType: "application/json",
    });
    return { driver: "blob" };
  } catch (cause) {
    const message = cause instanceof Error ? cause.message : String(cause);
    return { driver: "file", reason: describeBlobFailure(message) };
  }
}

async function resolve() {
  if (!cached) cached = await probeDriver();
  return cached;
}

export async function storeDriver(): Promise<StoreDriver> {
  return (await resolve()).driver;
}

/** Why Blob isn't being used, when it isn't. Surfaced on the dashboard. */
export async function storeWarning(): Promise<string | null> {
  const { driver, reason } = await resolve();
  if (driver === "blob" || !reason) return null;
  return reason;
}

async function readFromBlob(): Promise<CrmData | null> {
  const { blobs } = await list({ prefix: BLOB_PATHNAME, limit: 10 });
  const url = blobs.find((b) => b.pathname === BLOB_PATHNAME)?.url;
  if (!url) return null;

  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) return null;
  return (await res.json()) as CrmData;
}

async function readFromFile(): Promise<CrmData | null> {
  try {
    return JSON.parse(await fs.readFile(FILE_PATH, "utf8")) as CrmData;
  } catch {
    return null;
  }
}

export async function readCrm(): Promise<CrmData> {
  const { driver } = await resolve();
  try {
    const data = driver === "blob" ? await readFromBlob() : await readFromFile();
    // Tolerate a document written by an older shape.
    return data ? { ...emptyCrmData, ...data } : { ...emptyCrmData };
  } catch {
    return { ...emptyCrmData };
  }
}

export async function writeCrm(data: CrmData): Promise<void> {
  const { driver } = await resolve();
  const payload = JSON.stringify(data, null, 2);

  if (driver === "file") {
    await fs.mkdir(path.dirname(FILE_PATH), { recursive: true });
    await fs.writeFile(FILE_PATH, payload, "utf8");
    return;
  }

  try {
    await put(BLOB_PATHNAME, payload, {
      access: "public",
      addRandomSuffix: false,
      allowOverwrite: true,
      contentType: "application/json",
    });
  } catch (cause) {
    const message = cause instanceof Error ? cause.message : String(cause);
    // The probe passed but this write didn't — re-probe next time.
    cached = null;
    throw new CrmStoreError(`Не удалось сохранить: ${describeBlobFailure(message)}.`);
  }
}

/**
 * Read, change, write. Writes are whole-document, so every mutation goes
 * through here and callers never race on a partial update.
 */
export async function mutateCrm<T>(
  change: (data: CrmData) => T | Promise<T>,
): Promise<T> {
  const data = await readCrm();
  const result = await change(data);
  await writeCrm(data);
  return result;
}
