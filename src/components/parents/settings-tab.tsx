"use client";

import { BellRing, Check, Database, RotateCcw, ShieldCheck, Smartphone, Trash2, Volume2, Waves } from "lucide-react";
import Image from "next/image";
import type { ReactNode } from "react";

import { animals } from "@/content/animals";
import { cn } from "@/lib/cn";
import { speak } from "@/lib/speech";
import { resetAppState, seedDemoData, updateAppState, updateProfile, updateSettings, useAppState, useHydrated } from "@/lib/store";

function Card({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mt-4 rounded-[24px] p-4 ring-1 ring-line">
      <h2 className="text-[16px] font-bold text-ink">{title}</h2>
      <div className="mt-3">{children}</div>
    </section>
  );
}

function Toggle({ label, hint, icon, checked, onChange, disabled }: { label: string; hint?: string; icon: ReactNode; checked: boolean; onChange?: (v: boolean) => void; disabled?: boolean }) {
  return (
    <div className={cn("flex items-center gap-3 py-2", disabled && "opacity-50")}>
      <span className="grid size-9 shrink-0 place-items-center rounded-full bg-cream text-ink">{icon}</span>
      <span className="min-w-0 flex-1">
        <span className="block text-[14.5px] font-bold text-ink">{label}</span>
        {hint && <span className="block text-[12px] font-medium text-ink-soft">{hint}</span>}
      </span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        disabled={disabled}
        onClick={() => onChange?.(!checked)}
        className={cn("relative h-8 w-[52px] shrink-0 rounded-full transition", checked ? "bg-ink" : "bg-line")}
      >
        <span className={cn("absolute top-1 size-6 rounded-full bg-white shadow transition-all", checked ? "left-[24px]" : "left-1")} />
      </button>
    </div>
  );
}

export function SettingsTab() {
  const hydrated = useHydrated();
  const { profile, settings } = useAppState();

  if (!hydrated) return <div className="mx-5 mt-2 h-64 animate-pulse rounded-[24px] bg-cream" />;

  return (
    <div className="px-5">
      <Card title="Profil">
        <label className="block">
          <span className="text-[13px] font-bold text-ink-soft">Vorname des Kindes</span>
          <input
            value={profile.name}
            onChange={(e) => updateProfile({ name: e.target.value.slice(0, 24) })}
            placeholder="z. B. Mia"
            className="mt-1 h-12 w-full rounded-[16px] border-2 border-line bg-cream px-4 text-[16px] font-bold text-ink outline-none focus:border-lilac"
          />
        </label>
        <p className="mt-4 text-[13px] font-bold text-ink-soft">Lieblingstier</p>
        <div className="mt-2 grid grid-cols-4 gap-2">
          {animals.map((a) => {
            const on = profile.animal === a.id;
            return (
              <button
                key={a.id}
                type="button"
                onClick={() => updateProfile({ animal: a.id })}
                aria-pressed={on}
                aria-label={a.fullName}
                className={cn("relative grid aspect-square place-items-center rounded-[18px] transition active:scale-95", on ? "ring-[3px] ring-ink" : "ring-1 ring-line")}
                style={{ background: a.soft }}
              >
                <Image src={a.image} alt="" className="size-10 object-contain" sizes="40px" />
                {on && (
                  <span className="absolute -right-1 -top-1 grid size-5 place-items-center rounded-full bg-ink text-white">
                    <Check className="size-3" strokeWidth={3} aria-hidden />
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </Card>

      <Card title="Ton & Stimme">
        <Toggle
          label="Vorlesestimme"
          hint="Liest Übungen, Geschichten und Mutmacher-Sätze vor"
          icon={<Volume2 className="size-4" aria-hidden />}
          checked={settings.voice}
          onChange={(v) => {
            updateSettings({ voice: v });
            if (v) speak("Hallo! Ich lese dir ab jetzt alles vor.", { force: true });
          }}
        />
        <Toggle label="Klänge" hint="Klangschale, Glöckchen und Erfolgs-Melodien" icon={<Waves className="size-4" aria-hidden />} checked={settings.sound} onChange={(v) => updateSettings({ sound: v })} />
      </Card>

      <Card title="Tagesziel">
        <p className="text-[13px] font-medium leading-relaxed text-ink-soft">Schon 10 Minuten am Tag reichen für ein schönes, alltagstaugliches Ritual.</p>
        <div className="mt-3 grid grid-cols-4 gap-2" role="radiogroup" aria-label="Tagesziel in Minuten">
          {[5, 10, 15, 20].map((m) => (
            <button
              key={m}
              type="button"
              role="radio"
              aria-checked={settings.dailyGoal === m}
              onClick={() => updateSettings({ dailyGoal: m })}
              className={cn("h-12 rounded-[16px] text-[15px] font-bold transition", settings.dailyGoal === m ? "bg-ink text-white" : "bg-cream text-ink ring-1 ring-line")}
            >
              {m} Min.
            </button>
          ))}
        </div>
        <Toggle label="Tägliche Erinnerung" hint="Push-Benachrichtigung – in der App-Version verfügbar" icon={<BellRing className="size-4" aria-hidden />} checked={false} disabled />
      </Card>

      <Card title="Daten & Datenschutz">
        <p className="flex gap-2 text-[13px] font-medium leading-relaxed text-ink">
          <ShieldCheck className="mt-0.5 size-4 shrink-0 text-brand-teal" aria-hidden />
          Alle Daten (Name, Fortschritt, Tagebuch) bleiben ausschließlich lokal auf diesem Gerät. Keine Werbung, kein Tracking, kein Konto.
        </p>
        <div className="mt-4 grid gap-2">
          <button type="button" onClick={() => seedDemoData()} className="flex h-12 items-center gap-2.5 rounded-[16px] bg-cream px-4 text-[14px] font-bold text-ink active:scale-[0.99]">
            <Database className="size-4" aria-hidden /> Demo-Daten laden (für Präsentationen)
          </button>
          <button
            type="button"
            onClick={() => updateAppState((s) => ({ ...s, onboarded: false }))}
            className="flex h-12 items-center gap-2.5 rounded-[16px] bg-cream px-4 text-[14px] font-bold text-ink active:scale-[0.99]"
          >
            <RotateCcw className="size-4" aria-hidden /> Begrüßung erneut zeigen
          </button>
          <button
            type="button"
            onClick={() => {
              if (window.confirm("Wirklich alle Daten auf diesem Gerät löschen? Fortschritt und Tagebuch gehen verloren.")) resetAppState();
            }}
            className="flex h-12 items-center gap-2.5 rounded-[16px] bg-[#FDECE7] px-4 text-[14px] font-bold text-[#A23B1E] active:scale-[0.99]"
          >
            <Trash2 className="size-4" aria-hidden /> Alle Daten löschen
          </button>
        </div>
      </Card>

      <Card title="Als App installieren">
        <p className="flex gap-2 text-[13px] font-medium leading-relaxed text-ink">
          <Smartphone className="mt-0.5 size-4 shrink-0 text-ink-soft" aria-hidden />
          Öffnet die Seite auf dem Smartphone und wählt im Browser-Menü „Zum Home-Bildschirm“. Dann startet YOGITIER im Vollbild wie eine echte
          App.
        </p>
      </Card>
    </div>
  );
}
