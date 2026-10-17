import type { MediaMeta, StudioSettings, World } from "./types";

/**
 * Speicher des Studios im Browser (IndexedDB). Videos werden als Blob gespeichert,
 * Lernwelten und Einstellungen als JSON. Für die Produktiv-Version wird diese Datei
 * durch eine API ersetzt (z. B. Vercel Blob + Datenbank) – die Funktionen bleiben gleich.
 */

const DB_NAME = "yogitier-studio";
const VERSION = 1;

type Stores = "worlds" | "media" | "blobs" | "meta";

let dbPromise: Promise<IDBDatabase> | null = null;

function open(): Promise<IDBDatabase> {
  if (dbPromise) return dbPromise;
  dbPromise = new Promise((resolve, reject) => {
    if (typeof indexedDB === "undefined") {
      reject(new Error("IndexedDB wird von diesem Browser nicht unterstützt."));
      return;
    }
    const req = indexedDB.open(DB_NAME, VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains("worlds")) db.createObjectStore("worlds", { keyPath: "id" });
      if (!db.objectStoreNames.contains("media")) db.createObjectStore("media", { keyPath: "id" });
      if (!db.objectStoreNames.contains("blobs")) db.createObjectStore("blobs", { keyPath: "id" });
      if (!db.objectStoreNames.contains("meta")) db.createObjectStore("meta", { keyPath: "key" });
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error ?? new Error("IndexedDB konnte nicht geöffnet werden."));
  });
  dbPromise.catch(() => {
    dbPromise = null;
  });
  return dbPromise;
}

function request<T>(r: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    r.onsuccess = () => resolve(r.result);
    r.onerror = () => reject(r.error);
  });
}

async function store(name: Stores, mode: IDBTransactionMode) {
  const db = await open();
  return db.transaction(name, mode).objectStore(name);
}

function done(tx: IDBTransaction): Promise<void> {
  return new Promise((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
    tx.onabort = () => reject(tx.error ?? new Error("Transaktion abgebrochen"));
  });
}

// ---------------------------------------------------------------- Lernwelten

export async function getAllWorlds(): Promise<World[]> {
  return request((await store("worlds", "readonly")).getAll() as IDBRequest<World[]>);
}

export async function putWorld(world: World): Promise<void> {
  await request((await store("worlds", "readwrite")).put(world));
}

export async function putWorlds(worlds: World[]): Promise<void> {
  const db = await open();
  const tx = db.transaction("worlds", "readwrite");
  for (const w of worlds) tx.objectStore("worlds").put(w);
  await done(tx);
}

export async function deleteWorld(id: string): Promise<void> {
  await request((await store("worlds", "readwrite")).delete(id));
}

// ---------------------------------------------------------------- Medien

export async function getAllMedia(): Promise<MediaMeta[]> {
  return request((await store("media", "readonly")).getAll() as IDBRequest<MediaMeta[]>);
}

export async function putMedia(meta: MediaMeta, blob: Blob): Promise<void> {
  const db = await open();
  const tx = db.transaction(["media", "blobs"], "readwrite");
  tx.objectStore("blobs").put({ id: meta.id, blob });
  tx.objectStore("media").put(meta);
  await done(tx);
}

export async function getMediaBlob(id: string): Promise<Blob | null> {
  const row = (await request((await store("blobs", "readonly")).get(id))) as { id: string; blob: Blob } | undefined;
  return row?.blob ?? null;
}

export async function deleteMedia(id: string): Promise<void> {
  const db = await open();
  const tx = db.transaction(["media", "blobs"], "readwrite");
  tx.objectStore("blobs").delete(id);
  tx.objectStore("media").delete(id);
  await done(tx);
}

// ---------------------------------------------------------------- Meta

export async function getMeta<T>(key: string): Promise<T | undefined> {
  const row = (await request((await store("meta", "readonly")).get(key))) as { key: string; value: T } | undefined;
  return row?.value;
}

export async function setMeta<T>(key: string, value: T): Promise<void> {
  await request((await store("meta", "readwrite")).put({ key, value }));
}

export async function clearAll(): Promise<void> {
  const db = await open();
  const tx = db.transaction(["worlds", "media", "blobs", "meta"], "readwrite");
  for (const s of ["worlds", "media", "blobs", "meta"] as const) tx.objectStore(s).clear();
  await done(tx);
}

export type { StudioSettings };
