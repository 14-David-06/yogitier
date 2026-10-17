import { useSyncExternalStore } from "react";

import type { AnimalId, MoodId } from "@/content/types";
import { forgetTours } from "@/lib/guide/store";

/**
 * Lokaler App-Speicher (localStorage). Alle Daten bleiben auf dem Gerät –
 * für die spätere Produktiv-Version kann diese Schicht durch eine API
 * (z. B. Supabase, Firebase oder ein eigenes Backend) ersetzt werden.
 */

export type ActivityType = "yoga" | "uebung" | "atmen" | "reise" | "memo" | "tagebuch" | "wuerfel" | "advent" | "welt";

export type WorldProgress = { done: string[]; missions: Record<string, number>; completedAt?: string };
export type Sticker = { worldId: string; emoji: string; name: string; at: string };

export type ActivityEntry = {
  id: string;
  type: ActivityType;
  refId: string;
  title: string;
  seconds: number;
  at: string;
};

export type DiaryEntry = {
  id: string;
  at: string;
  mood: MoodId;
  gratitude: string[];
  note: string;
  drawing?: string;
};

export type MemoLevel = "leicht" | "mittel" | "profi";

export type AppState = {
  version: 1;
  onboarded: boolean;
  profile: { name: string; animal: AnimalId };
  settings: { sound: boolean; voice: boolean; dailyGoal: number };
  activities: ActivityEntry[];
  diary: DiaryEntry[];
  stars: number;
  memoBest: Partial<Record<MemoLevel, number>>;
  advent: number[];
  requests: { teacherId: string; at: string }[];
  worldProgress: Record<string, WorldProgress>;
  stickers: Sticker[];
};

const KEY = "yogitier-app-v1";

export const DEFAULT_STATE: AppState = {
  version: 1,
  onboarded: false,
  profile: { name: "", animal: "leo" },
  settings: { sound: true, voice: true, dailyGoal: 10 },
  activities: [],
  diary: [],
  stars: 0,
  memoBest: {},
  advent: [],
  requests: [],
  worldProgress: {},
  stickers: [],
};

let state: AppState = DEFAULT_STATE;
let loaded = false;
const listeners = new Set<() => void>();

function read(): AppState {
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return DEFAULT_STATE;
    const parsed = JSON.parse(raw) as Partial<AppState>;
    return {
      ...DEFAULT_STATE,
      ...parsed,
      profile: { ...DEFAULT_STATE.profile, ...parsed.profile },
      settings: { ...DEFAULT_STATE.settings, ...parsed.settings },
    };
  } catch {
    return DEFAULT_STATE;
  }
}

function ensureLoaded() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  state = read();
}

function emit() {
  for (const l of listeners) l();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  const onStorage = (e: StorageEvent) => {
    if (e.key !== KEY) return;
    state = read();
    emit();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

function getSnapshot() {
  ensureLoaded();
  return state;
}

function getServerSnapshot() {
  return DEFAULT_STATE;
}

/** Liefert den App-Zustand. Während SSR/Hydration: Standardwerte. */
export function useAppState(): AppState {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

/** Zugriff außerhalb von React (z. B. Audio-Einstellungen) */
export function getAppState(): AppState {
  ensureLoaded();
  return state;
}

export function updateAppState(fn: (s: AppState) => AppState) {
  ensureLoaded();
  state = fn(state);
  try {
    window.localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    // Speicher voll oder blockiert – die App funktioniert trotzdem weiter.
  }
  emit();
}

const noopSubscribe = () => () => {};

/** true, sobald der Client hydriert ist (für Inhalte, die vom Gerät abhängen). */
export function useHydrated(): boolean {
  return useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );
}

function uid() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

// ---------------------------------------------------------------------------
// Aktionen
// ---------------------------------------------------------------------------

export function logActivity(entry: { type: ActivityType; refId: string; title: string; seconds: number; stars?: number }) {
  const { stars = 1, ...rest } = entry;
  updateAppState((s) => ({
    ...s,
    stars: s.stars + stars,
    activities: [{ ...rest, id: uid(), at: new Date().toISOString() }, ...s.activities].slice(0, 500),
  }));
}

export function completeOnboarding(profile: { name: string; animal: AnimalId }) {
  updateAppState((s) => ({ ...s, onboarded: true, profile: { name: profile.name.trim().slice(0, 24), animal: profile.animal } }));
}

export function updateProfile(profile: Partial<AppState["profile"]>) {
  updateAppState((s) => ({ ...s, profile: { ...s.profile, ...profile } }));
}

export function updateSettings(settings: Partial<AppState["settings"]>) {
  updateAppState((s) => ({ ...s, settings: { ...s.settings, ...settings } }));
}

export function addDiaryEntry(entry: Omit<DiaryEntry, "id" | "at">) {
  updateAppState((s) => ({
    ...s,
    stars: s.stars + 1,
    diary: [{ ...entry, id: uid(), at: new Date().toISOString() }, ...s.diary].slice(0, 120),
    activities: [
      { id: uid(), type: "tagebuch" as const, refId: entry.mood, title: "Tagebuch-Eintrag", seconds: 120, at: new Date().toISOString() },
      ...s.activities,
    ].slice(0, 500),
  }));
}

export function deleteDiaryEntry(id: string) {
  updateAppState((s) => ({ ...s, diary: s.diary.filter((d) => d.id !== id) }));
}

export function saveMemoResult(level: MemoLevel, moves: number) {
  updateAppState((s) => {
    const best = s.memoBest[level];
    return { ...s, memoBest: { ...s.memoBest, [level]: best === undefined ? moves : Math.min(best, moves) } };
  });
}

export function openAdventDoor(day: number) {
  updateAppState((s) => (s.advent.includes(day) ? s : { ...s, advent: [...s.advent, day], stars: s.stars + 1 }));
}

export function addTeacherRequest(teacherId: string) {
  updateAppState((s) => ({ ...s, requests: [{ teacherId, at: new Date().toISOString() }, ...s.requests] }));
}

export function resetAppState() {
  updateAppState(() => DEFAULT_STATE);
  // Emmis Touren starten danach wieder von selbst
  forgetTours("kids");
}

// ---------------------------------------------------------------------------
// Lernwelten (Inhalte aus dem YOGITIER® Studio)
// ---------------------------------------------------------------------------

const emptyProgress = (): WorldProgress => ({ done: [], missions: {} });

export function markStepDone(worldId: string, stepId: string) {
  updateAppState((s) => {
    const p = s.worldProgress[worldId] ?? emptyProgress();
    if (p.done.includes(stepId)) return s;
    return { ...s, stars: s.stars + 1, worldProgress: { ...s.worldProgress, [worldId]: { ...p, done: [...p.done, stepId] } } };
  });
}

export function setMissionCount(worldId: string, stepId: string, count: number) {
  updateAppState((s) => {
    const p = s.worldProgress[worldId] ?? emptyProgress();
    return { ...s, worldProgress: { ...s.worldProgress, [worldId]: { ...p, missions: { ...p.missions, [stepId]: count } } } };
  });
}

export function completeWorld(world: { id: string; title: string; reward: { emoji: string; name: string } }, seconds: number) {
  const at = new Date().toISOString();
  updateAppState((s) => {
    const p = s.worldProgress[world.id] ?? emptyProgress();
    const hasSticker = s.stickers.some((x) => x.worldId === world.id);
    return {
      ...s,
      stars: s.stars + 3,
      worldProgress: { ...s.worldProgress, [world.id]: { ...p, completedAt: at } },
      stickers: hasSticker ? s.stickers : [{ worldId: world.id, emoji: world.reward.emoji, name: world.reward.name, at }, ...s.stickers],
      activities: [{ id: uid(), type: "welt" as const, refId: world.id, title: `Lernwelt: ${world.title}`, seconds, at }, ...s.activities].slice(0, 500),
    };
  });
}

export function resetWorldProgress(worldId: string) {
  updateAppState((s) => {
    const rest = { ...s.worldProgress };
    delete rest[worldId];
    return { ...s, worldProgress: rest };
  });
}

/** Demo-Daten für Präsentationen: füllt Fortschritt & Tagebuch der letzten Tage. */
export function seedDemoData() {
  const now = new Date();
  const day = (offset: number, hour: number) => {
    const d = new Date(now);
    d.setDate(d.getDate() - offset);
    d.setHours(hour, 15, 0, 0);
    return d.toISOString();
  };
  const activities: ActivityEntry[] = [
    { id: uid(), type: "yoga", refId: "guten-morgen", title: "Guten-Morgen-Yoga", seconds: 300, at: day(0, 8) },
    { id: uid(), type: "atmen", refId: "ballon-atmung", title: "Ballon-Atmung", seconds: 66, at: day(1, 18) },
    { id: uid(), type: "yoga", refId: "gute-nacht", title: "Gute-Nacht-Yoga", seconds: 240, at: day(1, 19) },
    { id: uid(), type: "memo", refId: "mittel", title: "Affirmation-Memo", seconds: 150, at: day(2, 16) },
    { id: uid(), type: "reise", refId: "wolkenreise", title: "Die Wolkenreise", seconds: 330, at: day(2, 19) },
    { id: uid(), type: "yoga", refId: "dschungel-reise", title: "Tierreise durch den Dschungel", seconds: 420, at: day(3, 17) },
    { id: uid(), type: "wuerfel", refId: "wuerfel", title: "Yoga-Würfel", seconds: 120, at: day(4, 16) },
    { id: uid(), type: "atmen", refId: "loewenatem", title: "Löwenatem", seconds: 45, at: day(4, 17) },
    { id: uid(), type: "yoga", refId: "mini-pause", title: "Mini-Pause", seconds: 180, at: day(5, 15) },
    { id: uid(), type: "yoga", refId: "balance", title: "Balance & Konzentration", seconds: 330, at: day(6, 17) },
  ];
  const diary: DiaryEntry[] = [
    { id: uid(), at: day(0, 19), mood: "froehlich", gratitude: ["Meine Freunde", "Draußen spielen"], note: "" },
    { id: uid(), at: day(1, 19), mood: "muede", gratitude: ["Mein Kuscheltier"], note: "" },
    { id: uid(), at: day(2, 18), mood: "ruhig", gratitude: ["Meine Familie"], note: "" },
    { id: uid(), at: day(3, 18), mood: "wuetend", gratitude: ["Eine Umarmung"], note: "Mein Turm ist umgefallen." },
    { id: uid(), at: day(5, 18), mood: "froehlich", gratitude: ["Die Sonne", "Leckeres Essen"], note: "" },
  ];
  updateAppState((s) => ({
    ...s,
    onboarded: true,
    profile: s.profile.name ? s.profile : { name: "Mia", animal: "emmi" },
    activities: [...activities, ...s.activities],
    diary: [...diary, ...s.diary],
    stars: s.stars + activities.length + diary.length,
    memoBest: { leicht: 6, mittel: 11, ...s.memoBest },
  }));
}
