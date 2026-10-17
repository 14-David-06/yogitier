import { useSyncExternalStore } from "react";

import type { GuideArea, TourId } from "@/content/guide";

/**
 * Zustand von Emmi: gesehene Touren und Stummschaltung (im Browser gespeichert)
 * sowie die laufende Tour, der offene Chat und ob Emmi gerade spricht.
 */

type Persisted = { seen: Partial<Record<TourId, true>>; muted: boolean };
export type GuideState = Persisted & {
  tour: { id: TourId; index: number } | null;
  chat: boolean;
  speaking: boolean;
};

const KEY = "yogitier-guide-v1";
const SERVER: GuideState = { seen: {}, muted: false, tour: null, chat: false, speaking: false };

let state: GuideState = SERVER;
let loaded = false;
const listeners = new Set<() => void>();

function ensureLoaded() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try {
    const parsed = JSON.parse(window.localStorage.getItem(KEY) ?? "{}") as Partial<Persisted>;
    state = { ...state, seen: parsed.seen ?? {}, muted: parsed.muted ?? false };
  } catch {
    // Ohne gespeicherten Zustand starten
  }
}

function set(patch: Partial<GuideState>) {
  ensureLoaded();
  state = { ...state, ...patch };
  if ("seen" in patch || "muted" in patch) {
    try {
      window.localStorage.setItem(KEY, JSON.stringify({ seen: state.seen, muted: state.muted }));
    } catch {
      // Speichern nicht möglich (z. B. privater Modus) – Emmi funktioniert trotzdem
    }
  }
  for (const l of listeners) l();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot() {
  ensureLoaded();
  return state;
}

export function useGuide() {
  return useSyncExternalStore(subscribe, getSnapshot, () => SERVER);
}

export function getGuide() {
  return getSnapshot();
}

export function startTour(id: TourId, index = 0) {
  set({ tour: { id, index }, chat: false });
}

export function setTourStep(index: number) {
  if (state.tour) set({ tour: { ...state.tour, index } });
}

/** Beendet die Tour; sie gilt danach als gesehen und startet nicht mehr von selbst. */
export function endTour() {
  if (!state.tour) return;
  set({ tour: null, seen: { ...state.seen, [state.tour.id]: true } });
}

export function markTourSeen(id: TourId) {
  set({ seen: { ...state.seen, [id]: true } });
}

/** Touren eines Bereichs wieder „ungesehen“ machen (z. B. nach „Alle Daten löschen“). */
export function forgetTours(area: GuideArea) {
  ensureLoaded();
  const prefix = area === "kids" ? "kinder-" : "studio-";
  const seen = Object.fromEntries(Object.entries(state.seen).filter(([id]) => !id.startsWith(prefix)));
  set({ seen });
}

export function openChat() {
  set({ chat: true, tour: null });
}

export function closeChat() {
  set({ chat: false });
}

export function setMuted(muted: boolean) {
  set({ muted });
}

export function setSpeaking(speaking: boolean) {
  if (state.speaking !== speaking) set({ speaking });
}
