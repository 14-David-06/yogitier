import type { ActivityEntry, DiaryEntry } from "./store";

const WEEKDAYS = ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"];

export function dayKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function startOfWeek(now: Date): Date {
  const d = new Date(now);
  d.setHours(0, 0, 0, 0);
  const diff = (d.getDay() + 6) % 7; // Montag = 0
  d.setDate(d.getDate() - diff);
  return d;
}

export type WeekDay = { key: string; label: string; date: Date; minutes: number; isToday: boolean; isFuture: boolean };

export function weekDays(activities: ActivityEntry[], now: Date): WeekDay[] {
  const start = startOfWeek(now);
  const todayKey = dayKey(now);
  const byDay = new Map<string, number>();
  for (const a of activities) {
    const k = dayKey(new Date(a.at));
    byDay.set(k, (byDay.get(k) ?? 0) + a.seconds);
  }
  return Array.from({ length: 7 }, (_, i) => {
    const date = new Date(start);
    date.setDate(start.getDate() + i);
    const key = dayKey(date);
    return {
      key,
      label: WEEKDAYS[date.getDay()],
      date,
      minutes: Math.round((byDay.get(key) ?? 0) / 60),
      isToday: key === todayKey,
      isFuture: date.getTime() > now.getTime() && key !== todayKey,
    };
  });
}

export function streakDays(activities: ActivityEntry[], now: Date): number {
  const days = new Set(activities.map((a) => dayKey(new Date(a.at))));
  const cursor = new Date(now);
  if (!days.has(dayKey(cursor))) cursor.setDate(cursor.getDate() - 1);
  let streak = 0;
  while (days.has(dayKey(cursor))) {
    streak++;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

export function todayMinutes(activities: ActivityEntry[], now: Date): number {
  const k = dayKey(now);
  return Math.round(activities.filter((a) => dayKey(new Date(a.at)) === k).reduce((s, a) => s + a.seconds, 0) / 60);
}

export function totals(activities: ActivityEntry[]) {
  const seconds = activities.reduce((s, a) => s + a.seconds, 0);
  return {
    minutes: Math.round(seconds / 60),
    sessions: activities.length,
    lessons: activities.filter((a) => a.type === "yoga").length,
    breaths: activities.filter((a) => a.type === "atmen").length,
    journeys: activities.filter((a) => a.type === "reise").length,
  };
}

export function favoriteActivity(activities: ActivityEntry[]): string | null {
  const counts = new Map<string, number>();
  for (const a of activities) {
    if (a.type === "tagebuch") continue;
    counts.set(a.title, (counts.get(a.title) ?? 0) + 1);
  }
  let best: string | null = null;
  let max = 0;
  for (const [title, n] of counts) {
    if (n > max) {
      best = title;
      max = n;
    }
  }
  return best;
}

export function lastMoodByDay(diary: DiaryEntry[]): Map<string, DiaryEntry> {
  const map = new Map<string, DiaryEntry>();
  // diary ist neueste zuerst sortiert → erster Treffer pro Tag gewinnt
  for (const e of diary) {
    const k = dayKey(new Date(e.at));
    if (!map.has(k)) map.set(k, e);
  }
  return map;
}

const timeFmt = new Intl.DateTimeFormat("de-DE", { hour: "2-digit", minute: "2-digit" });
const dateFmt = new Intl.DateTimeFormat("de-DE", { weekday: "short", day: "numeric", month: "short" });
const longFmt = new Intl.DateTimeFormat("de-DE", { weekday: "long", day: "numeric", month: "long" });

export function formatWhen(iso: string, now: Date): string {
  const d = new Date(iso);
  const k = dayKey(d);
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (k === dayKey(now)) return `Heute, ${timeFmt.format(d)} Uhr`;
  if (k === dayKey(yesterday)) return `Gestern, ${timeFmt.format(d)} Uhr`;
  return dateFmt.format(d);
}

export function formatLongDate(d: Date): string {
  return longFmt.format(d);
}

export function greeting(now: Date): string {
  const h = now.getHours();
  if (h < 5) return "Gute Nacht";
  if (h < 11) return "Guten Morgen";
  if (h < 17) return "Hallo";
  if (h < 21) return "Guten Abend";
  return "Gute Nacht";
}

export function formatMinutes(min: number): string {
  if (min < 60) return `${min} Min.`;
  const h = Math.floor(min / 60);
  const m = min % 60;
  return m ? `${h} Std. ${m} Min.` : `${h} Std.`;
}
