"use client";

import { BookHeart, Dices, Flame, Gift, Globe, LayoutGrid, Moon, PersonStanding, Sparkles, Star, Wind, type LucideIcon } from "lucide-react";
import Image from "next/image";

import { MoodFace } from "@/components/diary/mood-face";
import { animalsById } from "@/content/animals";
import { moodsById } from "@/content/moods";
import type { MoodId } from "@/content/types";
import { dayKey, favoriteActivity, formatMinutes, formatWhen, streakDays, todayMinutes, totals, weekDays } from "@/lib/stats";
import { type ActivityType, seedDemoData, useAppState, useHydrated } from "@/lib/store";
import { useNow } from "@/lib/use-now";

import { WeekChart } from "./week-chart";

const TYPE_ICON: Record<ActivityType, LucideIcon> = {
  yoga: PersonStanding,
  uebung: PersonStanding,
  atmen: Wind,
  reise: Moon,
  memo: LayoutGrid,
  tagebuch: BookHeart,
  wuerfel: Dices,
  advent: Gift,
  welt: Globe,
};

function Stat({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="rounded-[20px] bg-cream p-3.5">
      <p className="text-[12.5px] font-bold text-ink-soft">{label}</p>
      <p className="mt-0.5 text-[24px] font-bold leading-tight text-ink-strong">{value}</p>
      {hint && <p className="mt-0.5 text-[12px] font-semibold text-ink-soft">{hint}</p>}
    </div>
  );
}

export function OverviewTab({ onOpenSettings }: { onOpenSettings: () => void }) {
  const hydrated = useHydrated();
  const now = useNow();
  const state = useAppState();

  if (!hydrated || !now) {
    return (
      <div className="space-y-3 px-5 pt-2" aria-busy="true">
        <div className="h-24 animate-pulse rounded-[24px] bg-cream" />
        <div className="h-40 animate-pulse rounded-[24px] bg-cream" />
      </div>
    );
  }

  const { activities, diary, profile, settings, stars } = state;
  const animal = animalsById[profile.animal];
  const week = weekDays(activities, now);
  const weekMin = week.reduce((s, d) => s + d.minutes, 0);
  const today = todayMinutes(activities, now);
  const streak = streakDays(activities, now);
  const sum = totals(activities);
  const fav = favoriteActivity(activities);
  const goalPct = Math.min(1, today / settings.dailyGoal);

  // Stimmungen der letzten 7 Tage
  const last7 = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(now);
    d.setDate(now.getDate() - (6 - i));
    return d;
  });
  const moodsByDay = new Map<string, MoodId>();
  for (const e of [...diary].reverse()) moodsByDay.set(dayKey(new Date(e.at)), e.mood);
  const moodCounts = new Map<MoodId, number>();
  for (const d of last7) {
    const m = moodsByDay.get(dayKey(d));
    if (m) moodCounts.set(m, (moodCounts.get(m) ?? 0) + 1);
  }
  const topMood = [...moodCounts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0];

  return (
    <div className="px-5 pt-2">
      {/* Profil */}
      <div className="flex items-center gap-3.5 rounded-[24px] p-4" style={{ background: animal.soft }}>
        <span className="grid size-16 shrink-0 place-items-center rounded-full bg-white">
          <Image src={animal.image} alt="" className="size-11 object-contain" sizes="44px" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[19px] font-bold leading-tight text-ink-strong">{profile.name || "Euer Kind"}</p>
          <p className="text-[13px] font-semibold text-ink-soft">Lieblingstier: {animal.fullName}</p>
        </div>
        <span className="flex flex-col items-center rounded-[16px] bg-white px-3 py-2">
          <Star className="size-4 fill-brand-yellow text-brand-orange" aria-hidden />
          <span className="text-[16px] font-bold text-ink">{stars}</span>
          <span className="text-[10.5px] font-bold text-ink-soft">Sterne</span>
        </span>
      </div>

      {activities.length === 0 ? (
        <div className="mt-4 rounded-[24px] border-2 border-dashed border-line p-5 text-center">
          <Sparkles className="mx-auto size-7 text-brand-orange" aria-hidden />
          <p className="mt-2 text-[16px] font-bold text-ink">Noch keine Aktivitäten</p>
          <p className="mt-1 text-[13.5px] font-medium leading-relaxed text-ink-soft">
            Sobald euer Kind Yoga macht, atmet oder Memo spielt, seht ihr hier Minuten, Serien und Stimmungen.
          </p>
          <button type="button" onClick={() => seedDemoData()} className="mt-4 h-11 rounded-full bg-ink px-5 text-[14px] font-bold text-white active:scale-95">
            Demo-Daten laden
          </button>
          <p className="mt-2 text-[11.5px] font-medium text-ink-soft">Für Präsentationen: füllt die letzten 7 Tage mit Beispielwerten.</p>
        </div>
      ) : (
        <>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="col-span-2 rounded-[20px] bg-cream p-3.5">
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-[12.5px] font-bold text-ink-soft">Heute geübt</p>
                  <p className="mt-0.5 text-[26px] font-bold leading-tight text-ink-strong">{today} Min.</p>
                </div>
                <button type="button" onClick={onOpenSettings} className="text-[12.5px] font-bold text-ink-soft underline-offset-2 hover:underline">
                  Tagesziel: {settings.dailyGoal} Min.
                </button>
              </div>
              <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-[#F1E4D2]" role="progressbar" aria-valuemin={0} aria-valuemax={settings.dailyGoal} aria-valuenow={today} aria-label="Tagesziel">
                <div className="h-full rounded-full bg-[#D9821A] transition-[width]" style={{ width: `${goalPct * 100}%` }} />
              </div>
              <p className="mt-1.5 text-[12px] font-semibold text-ink-soft">
                {goalPct >= 1 ? "Tagesziel erreicht – wunderbar!" : `Noch ${settings.dailyGoal - today} Min. bis zum Tagesziel`}
              </p>
            </div>
            <Stat label="Diese Woche" value={formatMinutes(weekMin)} hint={`${week.filter((d) => d.minutes > 0).length} von 7 Tagen aktiv`} />
            <div className="rounded-[20px] bg-cream p-3.5">
              <p className="text-[12.5px] font-bold text-ink-soft">Serie</p>
              <p className="mt-0.5 flex items-center gap-1 text-[24px] font-bold leading-tight text-ink-strong">
                <Flame className="size-5 text-brand-red" aria-hidden /> {streak} {streak === 1 ? "Tag" : "Tage"}
              </p>
              <p className="mt-0.5 text-[12px] font-semibold text-ink-soft">am Stück</p>
            </div>
            <Stat label="Yoga-Stunden" value={String(sum.lessons)} hint="abgeschlossen" />
            <Stat label="Atem & Reisen" value={String(sum.breaths + sum.journeys)} hint="Übungen" />
            <Stat label="Lernwelten" value={String(Object.values(state.worldProgress).filter((p) => p.completedAt).length)} hint="komplett geschafft" />
            <div className="rounded-[20px] bg-cream p-3.5">
              <p className="text-[12.5px] font-bold text-ink-soft">Sticker-Album</p>
              <p className="mt-0.5 text-[24px] font-bold leading-tight text-ink-strong">{state.stickers.length}</p>
              <p className="mt-0.5 truncate text-[18px] leading-tight" aria-label={state.stickers.map((s) => s.name).join(", ") || "noch keine Sticker"}>
                {state.stickers.length ? state.stickers.slice(0, 6).map((s) => s.emoji).join(" ") : <span className="text-[12px] font-semibold text-ink-soft">noch keine Sticker</span>}
              </p>
            </div>
          </div>

          <section className="mt-6">
            <h2 className="text-[17px] font-bold text-ink">Übungsminuten diese Woche</h2>
            <p className="mb-3 text-[12.5px] font-medium text-ink-soft">Montag bis Sonntag, inklusive Atemübungen, Reisen und Spielen</p>
            <WeekChart days={week} goal={settings.dailyGoal} />
          </section>

          <section className="mt-6">
            <h2 className="text-[17px] font-bold text-ink">Stimmungen der letzten 7 Tage</h2>
            <ol className="mt-3 grid grid-cols-7 gap-1.5">
              {last7.map((d) => {
                const m = moodsByDay.get(dayKey(d));
                return (
                  <li key={dayKey(d)} className="flex flex-col items-center gap-1">
                    <span className="grid size-10 place-items-center rounded-full bg-cream">
                      {m ? <MoodFace mood={m} className="size-10" /> : <span className="size-1.5 rounded-full bg-line" />}
                    </span>
                    <span className="text-[11px] font-bold text-ink-soft">{d.toLocaleDateString("de-DE", { weekday: "short" }).replace(".", "")}</span>
                  </li>
                );
              })}
            </ol>
            <p className="mt-3 rounded-[18px] bg-cream p-3 text-[13px] font-medium leading-relaxed text-ink">
              {topMood
                ? `Am häufigsten: ${moodsById[topMood].label}. ${moodsById[topMood].tip}`
                : "Noch keine Tagebuch-Einträge. Das Gefühle-Tagebuch hilft Kindern, ihre Emotionen zu benennen."}
            </p>
          </section>

          <section className="mt-6">
            <h2 className="text-[17px] font-bold text-ink">Zuletzt gemacht</h2>
            {fav && <p className="text-[12.5px] font-medium text-ink-soft">Lieblingsaktivität: {fav}</p>}
            <ul className="mt-3 divide-y divide-line rounded-[20px] ring-1 ring-line">
              {activities.slice(0, 6).map((a) => {
                const Icon = TYPE_ICON[a.type];
                return (
                  <li key={a.id} className="flex items-center gap-3 px-3.5 py-3">
                    <span className="grid size-9 shrink-0 place-items-center rounded-full bg-cream">
                      <Icon className="size-4 text-ink" aria-hidden />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[14px] font-bold text-ink">{a.title}</span>
                      <span className="block text-[12px] font-medium text-ink-soft">{formatWhen(a.at, now)}</span>
                    </span>
                    <span className="text-[12.5px] font-bold text-ink-soft">{Math.max(1, Math.round(a.seconds / 60))} Min.</span>
                  </li>
                );
              })}
            </ul>
          </section>
        </>
      )}
    </div>
  );
}
