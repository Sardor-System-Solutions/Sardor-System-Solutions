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

  `CRM_STORE=file|blob` overrides the choice; otherwise a write token means
  Blob. A misconfigured store (private access, bad token) is reported at the
  moment of saving — see `writeCrm` — rather than by a probe write on every
  cold start, which cost a network round trip before the first read.

  Three things keep reads cheap, because the whole document is fetched for
  every screen:

  - the blob's URL is resolved once per process (it is a fixed pathname), so a
    read is one request instead of `list()` + `fetch`;
  - the parsed document is held for `MEMO_TTL_MS`, so the several reads a
    single screen makes cost one network request between them;
  - a successful write seeds that memo with what was just saved, so the render
    that follows a save shows the new data without going back to Blob at all.

  Swapping in a real database later means replacing this file and nothing
  else — everything above it goes through `readCrm`/`writeCrm`.
*/

const BLOB_PATHNAME = "data/crm.json";
const FILE_PATH = path.join(process.cwd(), ".data", "crm.json");

/** How long a parsed document is reused before going back to storage. */
const MEMO_TTL_MS = 5_000;

export type StoreDriver = "blob" | "file";

export class CrmStoreError extends Error {}

function describeBlobFailure(message: string) {
  if (/private store|public access/i.test(message)) {
    return "хранилище Vercel Blob создано с приватным доступом, а данным нужен публичный";
  }
  if (/access denied|token/i.test(message)) {
    return "Vercel Blob отклонил токен (BLOB_READ_WRITE_TOKEN)";
  }
  return message;
}

function driver(): StoreDriver {
  const override = process.env.CRM_STORE;
  if (override === "file" || override === "blob") return override;
  return process.env.BLOB_READ_WRITE_TOKEN ? "blob" : "file";
}

/** Set when a write to Blob actually failed, so the dashboard can say why. */
let writeFailure: string | null = null;

export async function storeDriver(): Promise<StoreDriver> {
  return driver();
}

/** Why Blob isn't being used, when it isn't. Surfaced on the dashboard. */
export async function storeWarning(): Promise<string | null> {
  if (writeFailure) return writeFailure;
  if (driver() === "file" && !process.env.CRM_STORE) {
    return "BLOB_READ_WRITE_TOKEN не задан";
  }
  return null;
}

/* --------------------------------- memo ---------------------------------- */

let memo: { data: CrmData; at: number } | null = null;

/** Drop the memo — the next read goes back to storage. */
export function invalidateCrm() {
  memo = null;
}

/* -------------------------------- drivers -------------------------------- */

// The pathname is fixed and written with `addRandomSuffix: false`, so the URL
// never changes for the life of the store. Resolving it once turns every
// later read into a single request.
let blobUrl: string | null = null;

async function resolveBlobUrl(): Promise<string | null> {
  if (blobUrl) return blobUrl;
  const { blobs } = await list({ prefix: BLOB_PATHNAME, limit: 10 });
  blobUrl = blobs.find((b) => b.pathname === BLOB_PATHNAME)?.url ?? null;
  return blobUrl;
}

async function readFromBlob(): Promise<CrmData | null> {
  const url = await resolveBlobUrl();
  if (!url) return null;

  // `cache: "no-store"` only bypasses Next's own cache. The blob is served
  // through a CDN, so the URL is also made unique per read — without it an
  // edge node can keep answering with the copy from before the last save,
  // which looks exactly like a save that silently didn't happen.
  const res = await fetch(`${url}?t=${Date.now()}`, { cache: "no-store" });
  if (!res.ok) {
    // The blob may have been replaced or removed — resolve it again next time.
    blobUrl = null;
    return null;
  }
  return (await res.json()) as CrmData;
}

async function readFromFile(): Promise<CrmData | null> {
  try {
    return JSON.parse(await fs.readFile(FILE_PATH, "utf8")) as CrmData;
  } catch {
    return null;
  }
}

/** One trip to storage, no memo involved. */
async function load(): Promise<CrmData> {
  const data = driver() === "blob" ? await readFromBlob() : await readFromFile();
  // Tolerate a document written by an older shape.
  return data ? { ...emptyCrmData, ...data } : { ...emptyCrmData };
}

/* --------------------------------- public -------------------------------- */

/**
 * The document, for reading. The result is shared, so callers must treat it as
 * immutable — anything that changes data goes through `mutateCrm`, which reads
 * its own copy.
 */
export async function readCrm(): Promise<CrmData> {
  if (memo && Date.now() - memo.at < MEMO_TTL_MS) return memo.data;

  try {
    const data = await load();
    memo = { data, at: Date.now() };
    return data;
  } catch {
    // A failed read is never memoised — an empty document is a symptom, not
    // an answer, and the next attempt should try storage again.
    return { ...emptyCrmData };
  }
}

export async function writeCrm(data: CrmData): Promise<void> {
  const payload = JSON.stringify(data, null, 2);
  // Whatever happens next, the copy from before this write is now wrong.
  memo = null;

  if (driver() === "file") {
    await fs.mkdir(path.dirname(FILE_PATH), { recursive: true });
    await fs.writeFile(FILE_PATH, payload, "utf8");
    memo = { data, at: Date.now() };
    return;
  }

  try {
    const result = await put(BLOB_PATHNAME, payload, {
      access: "public",
      addRandomSuffix: false,
      allowOverwrite: true,
      contentType: "application/json",
      // The document is overwritten in place, so it must not be cached at the
      // edge: a stale copy here is a lost save as far as anyone can tell.
      cacheControlMaxAge: 0,
    });
    blobUrl = result.url;
    writeFailure = null;
    // Seed the memo with what was just saved, so the screen rendered right
    // after the save is correct without another round trip.
    memo = { data, at: Date.now() };
  } catch (cause) {
    const message = cause instanceof Error ? cause.message : String(cause);
    writeFailure = describeBlobFailure(message);
    throw new CrmStoreError(`Не удалось сохранить: ${writeFailure}.`);
  }
}

/*
  Mutations run one at a time.

  A mutation is read-modify-write over the whole document. Two of them
  overlapping — a second save started before the first finished, a form
  submitted twice, a stage dragged while a lead is being created — both read
  the same document, each applies its own change to its own copy, and the
  slower write wins. The other change is gone, with no error anywhere: it
  looks exactly like a save that sometimes works and sometimes doesn't.

  Chaining them removes that race within this process. Two Vercel instances
  writing in the same second could still overlap; a document store gives no
  way to prevent that, and it is a real database's job. For a team of two in
  one office, the in-process queue is the whole of the problem.
*/
let queue: Promise<unknown> = Promise.resolve();

export async function mutateCrm<T>(
  change: (data: CrmData) => T | Promise<T>,
): Promise<T> {
  const run = async () => {
    // Always fresh: a mutation must never be applied to a memoised copy, and
    // by the time this runs an earlier mutation in the queue may have written.
    const data = await load();
    const result = await change(data);
    await writeCrm(data);
    return result;
  };

  // `then(run, run)` — a mutation that failed must not stall the ones behind it.
  const result = queue.then(run, run);
  queue = result.catch(() => undefined);
  return result;
}
