import { useEffect, useState, useSyncExternalStore } from "react";

import { DEFAULT_SETTINGS, newId, seedWorlds } from "@/content/worlds";
import { forgetTours } from "@/lib/guide/store";

import * as db from "./db";
import type { MediaMeta, Step, StudioSettings, World } from "./types";

export type StudioSnapshot = {
  ready: boolean;
  error: string | null;
  worlds: World[];
  media: MediaMeta[];
  settings: StudioSettings;
};

const EMPTY: StudioSnapshot = { ready: false, error: null, worlds: [], media: [], settings: DEFAULT_SETTINGS };

let snapshot: StudioSnapshot = EMPTY;
let started = false;
const listeners = new Set<() => void>();
const channel = typeof BroadcastChannel !== "undefined" ? new BroadcastChannel("yogitier-studio") : null;

function emit() {
  for (const l of listeners) l();
}

async function ensureSeeded() {
  const seeded = await db.getMeta<boolean>("seeded");
  if (seeded) return;
  await db.putWorlds(seedWorlds);
  await db.setMeta("settings", DEFAULT_SETTINGS);
  await db.setMeta("seeded", true);
}

async function reload() {
  try {
    await ensureSeeded();
    const [worlds, media, settings] = await Promise.all([db.getAllWorlds(), db.getAllMedia(), db.getMeta<StudioSettings>("settings")]);
    snapshot = {
      ready: true,
      error: null,
      worlds: worlds.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)),
      media: media.sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
      settings: { ...DEFAULT_SETTINGS, ...settings },
    };
  } catch (e) {
    snapshot = { ...EMPTY, ready: true, error: e instanceof Error ? e.message : "Speicher nicht verfügbar" };
  }
  emit();
}

channel?.addEventListener("message", () => void reload());

function subscribe(listener: () => void) {
  listeners.add(listener);
  if (!started) {
    started = true;
    void reload();
  }
  return () => listeners.delete(listener);
}

/** Lernwelten, Medien und Einstellungen des Studios (auf dem Server: leer, ready=false). */
export function useStudio(): StudioSnapshot {
  return useSyncExternalStore(
    subscribe,
    () => snapshot,
    () => EMPTY,
  );
}

async function changed() {
  await reload();
  channel?.postMessage("changed");
}

// ---------------------------------------------------------------------------
// Aktionen
// ---------------------------------------------------------------------------

export async function saveWorld(world: World) {
  await db.putWorld({ ...world, updatedAt: new Date().toISOString() });
  await changed();
}

export async function removeWorld(id: string) {
  await db.deleteWorld(id);
  if (snapshot.settings.featuredWorldId === id) await db.setMeta("settings", { ...snapshot.settings, featuredWorldId: null });
  await changed();
}

export function createWorld(partial?: Partial<World>): World {
  const ts = new Date().toISOString();
  return {
    id: newId("welt"),
    title: "Neue Lernwelt",
    subtitle: "",
    category: "bewegung",
    age: "ab 4 Jahren",
    guide: "leo",
    greeting: "Hallo! Schön, dass du da bist. Los geht's!",
    theme: "wiese",
    accent: "#E8961E",
    ambient: "aus",
    reward: { emoji: "⭐", name: "Super-Stern" },
    steps: [],
    status: "entwurf",
    createdAt: ts,
    updatedAt: ts,
    ...partial,
  };
}

/** Kopiert Schritte mit neuen IDs (für Vorlagen & Duplikate) */
export function cloneSteps(steps: Step[]): Step[] {
  return steps.map((s) => {
    const copy = structuredClone(s);
    copy.id = newId("schritt");
    if (copy.type === "video") copy.stops = copy.stops.map((st) => ({ ...st, id: newId("stopp") }));
    if (copy.type === "timer") copy.segments = copy.segments.map((sg) => ({ ...sg, id: newId("abschnitt") }));
    return copy;
  });
}

export async function duplicateWorld(world: World): Promise<World> {
  const copy: World = {
    ...structuredClone(world),
    id: newId("welt"),
    title: `${world.title} (Kopie)`,
    status: "entwurf",
    steps: cloneSteps(world.steps),
  };
  await saveWorld(copy);
  return copy;
}

export async function saveSettings(settings: Partial<StudioSettings>) {
  await db.setMeta("settings", { ...snapshot.settings, ...settings });
  await changed();
}

export async function restoreExamples() {
  await db.putWorlds(seedWorlds);
  await changed();
}

export async function resetStudio() {
  await db.clearAll();
  forgetTours("studio");
  started = false;
  await changed();
}

/** Liest Dauer, Größe und ein Vorschaubild aus einer Videodatei. */
function probeVideo(file: Blob): Promise<{ duration: number; width: number; height: number; thumb: string | null }> {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file);
    const video = document.createElement("video");
    video.preload = "metadata";
    video.muted = true;
    video.playsInline = true;
    video.src = url;
    const finish = (thumb: string | null) => {
      const result = { duration: Number.isFinite(video.duration) ? video.duration : 0, width: video.videoWidth, height: video.videoHeight, thumb };
      URL.revokeObjectURL(url);
      resolve(result);
    };
    video.onloadedmetadata = () => {
      video.currentTime = Math.min(1.2, (video.duration || 2) / 3);
    };
    video.onseeked = () => {
      try {
        const w = 320;
        const h = Math.round((video.videoHeight / Math.max(1, video.videoWidth)) * w) || 180;
        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        canvas.getContext("2d")?.drawImage(video, 0, 0, w, h);
        finish(canvas.toDataURL("image/jpeg", 0.75));
      } catch {
        finish(null);
      }
    };
    video.onerror = () => finish(null);
  });
}

/** Video (oder Bild) in die Medienbibliothek hochladen. */
export async function uploadMedia(file: File, onProgress?: (p: number) => void): Promise<MediaMeta> {
  onProgress?.(0.05);
  // Datei vollständig einlesen (zeigt Fortschritt bei großen Videos)
  const buffer = await new Promise<ArrayBuffer>((resolve, reject) => {
    const reader = new FileReader();
    reader.onprogress = (e) => {
      if (e.lengthComputable) onProgress?.(0.05 + (e.loaded / e.total) * 0.7);
    };
    reader.onload = () => resolve(reader.result as ArrayBuffer);
    reader.onerror = () => reject(reader.error);
    reader.readAsArrayBuffer(file);
  });
  const blob = new Blob([buffer], { type: file.type || "video/mp4" });
  onProgress?.(0.8);
  const isVideo = blob.type.startsWith("video/");
  const info = isVideo ? await probeVideo(blob) : { duration: 0, width: 0, height: 0, thumb: null };
  const meta: MediaMeta = {
    id: newId("medium"),
    name: file.name.replace(/\.[^.]+$/, ""),
    type: blob.type,
    size: blob.size,
    duration: info.duration,
    width: info.width,
    height: info.height,
    thumb: info.thumb,
    createdAt: new Date().toISOString(),
  };
  await db.putMedia(meta, blob);
  onProgress?.(1);
  await changed();
  return meta;
}

export async function removeMedia(id: string) {
  await db.deleteMedia(id);
  const url = urlCache.get(id);
  if (url) URL.revokeObjectURL(url);
  urlCache.delete(id);
  await changed();
}

// ---------------------------------------------------------------------------
// Medien-URLs (Object-URLs aus IndexedDB)
// ---------------------------------------------------------------------------

const urlCache = new Map<string, string>();

export async function getMediaUrl(id: string): Promise<string | null> {
  const cached = urlCache.get(id);
  if (cached) return cached;
  const blob = await db.getMediaBlob(id);
  if (!blob) return null;
  const url = URL.createObjectURL(blob);
  urlCache.set(id, url);
  return url;
}

/** Abspielbare URL für ein hochgeladenes Medium (null, solange es lädt). */
export function useMediaUrl(id: string | null | undefined): string | null {
  const [state, setState] = useState<{ id: string | null; url: string | null }>({ id: null, url: null });
  useEffect(() => {
    if (!id) return;
    let alive = true;
    getMediaUrl(id).then((url) => {
      if (alive) setState({ id, url });
    });
    return () => {
      alive = false;
    };
  }, [id]);
  return id && state.id === id ? state.url : null;
}

// ---------------------------------------------------------------------------
// Export / Import (Lernwelten & Einstellungen als JSON)
// ---------------------------------------------------------------------------

export function exportJson(): string {
  return JSON.stringify({ format: "yogitier-studio", version: 1, exportedAt: new Date().toISOString(), worlds: snapshot.worlds, settings: snapshot.settings }, null, 2);
}

export async function importJson(text: string): Promise<number> {
  const data = JSON.parse(text) as { format?: string; worlds?: World[]; settings?: StudioSettings };
  if (data.format !== "yogitier-studio" || !Array.isArray(data.worlds)) throw new Error("Unbekanntes Dateiformat");
  await db.putWorlds(data.worlds);
  if (data.settings) await db.setMeta("settings", { ...snapshot.settings, ...data.settings });
  await changed();
  return data.worlds.length;
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / 1024 / 1024).toLocaleString("de-DE", { maximumFractionDigits: 1 })} MB`;
  return `${(bytes / 1024 / 1024 / 1024).toLocaleString("de-DE", { maximumFractionDigits: 2 })} GB`;
}

export function formatDuration(sec: number): string {
  const s = Math.max(0, Math.round(sec));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}

/** geschätzte Dauer einer Lernwelt in Minuten */
export function worldMinutes(world: World, mediaDuration: (id: string) => number = () => 0): number {
  let sec = 0;
  for (const s of world.steps) {
    if (s.type === "info") sec += 20;
    else if (s.type === "video") sec += (s.source?.kind === "upload" ? mediaDuration(s.source.mediaId) : 30) + s.stops.reduce((a, x) => a + x.seconds, 0);
    else if (s.type === "uebung") sec += s.seconds + 10;
    else if (s.type === "atmung") sec += 60;
    else if (s.type === "timer") sec += s.segments.reduce((a, x) => a + x.seconds, 0) + 10;
    else if (s.type === "quiz") sec += 30;
    else sec += 20;
  }
  return Math.max(1, Math.round(sec / 60));
}
