"use client";

import {
  AlertTriangle,
  ArrowDown,
  ArrowUp,
  BookOpen,
  Check,
  ChevronDown,
  ChevronLeft,
  CircleHelp,
  Clapperboard,
  Copy,
  ExternalLink,
  Eye,
  EyeOff,
  Headphones,
  Loader2,
  PersonStanding,
  Plus,
  RefreshCw,
  Rocket,
  Star,
  Target,
  Timer,
  Trash2,
  Volume2,
  Wind,
  type LucideIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { WorldScene } from "@/components/worlds/world-scene";
import { animals } from "@/content/animals";
import { getBreath } from "@/content/breathing";
import { getPose } from "@/content/poses";
import { accentColors, ageOptions, ambientLabels, categoryLabels, newId, stepTypeLabels, worldThemes } from "@/content/worlds";
import { startAmbient, stopAmbient } from "@/lib/ambient";
import { cn } from "@/lib/cn";
import { speak } from "@/lib/speech";
import { cloneSteps, duplicateWorld, removeWorld, saveSettings, saveWorld, useStudio, worldMinutes } from "@/lib/studio/store";
import type { Ambient, Step, StepType, World, WorldCategory, WorldTheme } from "@/lib/studio/types";

import { StepEditor } from "./step-editor";
import { Button, Card, Field, Input, Select, StatusBadge, Textarea } from "./ui";

const STEP_ICON: Record<StepType, LucideIcon> = {
  info: BookOpen,
  video: Clapperboard,
  uebung: PersonStanding,
  atmung: Wind,
  timer: Timer,
  quiz: CircleHelp,
  aufgabe: Target,
};

const REWARD_PICKS = ["⭐", "🌿", "🦷", "💧", "🌙", "🏆", "🦁", "🦄", "🍎", "🎈", "🌈", "🐢"];

function newStep(type: StepType): Step {
  const id = newId("schritt");
  switch (type) {
    case "info":
      return { id, type, title: "Neue Info", text: "" };
    case "video":
      return { id, type, title: "Neues Video", source: null, instruction: "Schau zu und mach mit!", stops: [] };
    case "uebung":
      return { id, type, title: "Der Baum", pose: "baum", seconds: 30, cue: "" };
    case "atmung":
      return { id, type, title: "Ballon-Atmung", breath: "ballon-atmung" };
    case "timer":
      return { id, type, title: "Mitmach-Timer", intro: "Los geht's!", segments: [{ id: newId("abschnitt"), label: "Abschnitt 1", seconds: 30 }] };
    case "quiz":
      return {
        id,
        type,
        title: "Quiz-Frage",
        question: "",
        options: [
          { id: newId("antwort"), text: "", emoji: "🙂" },
          { id: newId("antwort"), text: "", emoji: "🤔" },
        ],
        correct: "",
        explanation: "",
      };
    case "aufgabe":
      return { id, type, title: "Mission", text: "", count: 3, unit: "⭐" };
  }
}

function summary(step: Step, mediaName: (id: string) => string | undefined): string {
  switch (step.type) {
    case "info":
      return step.text ? step.text.slice(0, 70) + (step.text.length > 70 ? " …" : "") : "Noch kein Text";
    case "video":
      if (!step.source) return "Noch kein Video ausgewählt";
      return `${step.source.kind === "upload" ? (mediaName(step.source.mediaId) ?? "Hochgeladenes Video") : "Video-Link"} · ${step.stops.length} Mitmach-Stopp${step.stops.length === 1 ? "" : "s"}`;
    case "uebung":
      return `${getPose(step.pose)?.name ?? step.pose} · ${step.seconds} Sek.`;
    case "atmung":
      return getBreath(step.breath)?.title ?? step.breath;
    case "timer":
      return `${step.segments.length} Abschnitte · ${step.segments.reduce((a, s) => a + s.seconds, 0)} Sek.`;
    case "quiz":
      return step.question || "Noch keine Frage";
    case "aufgabe":
      return `${step.count}× ${step.unit} · ${step.text || "Noch kein Text"}`;
  }
}

/** Hinweise vor dem Veröffentlichen */
function validate(w: World): string[] {
  const issues: string[] = [];
  if (!w.title.trim()) issues.push("Titel fehlt");
  if (w.steps.length === 0) issues.push("Mindestens eine Station hinzufügen");
  w.steps.forEach((s, i) => {
    const n = `Station ${i + 1}`;
    if (s.type === "video" && !s.source) issues.push(`${n}: Kein Video ausgewählt`);
    if (s.type === "info" && !s.text.trim()) issues.push(`${n}: Text fehlt`);
    if (s.type === "quiz") {
      if (!s.question.trim()) issues.push(`${n}: Quiz-Frage fehlt`);
      if (s.options.some((o) => !o.text.trim())) issues.push(`${n}: Nicht alle Antworten ausgefüllt`);
      if (!s.options.some((o) => o.id === s.correct)) issues.push(`${n}: Richtige Antwort markieren`);
    }
    if (s.type === "aufgabe" && !s.text.trim()) issues.push(`${n}: Missions-Text fehlt`);
  });
  return issues;
}

const SCALE = 0.8;

function LivePreview({ id, reloadKey, onReload }: { id: string; reloadKey: number; onReload: () => void }) {
  return (
    <div>
      <div className="mx-auto rounded-[44px] bg-gradient-to-br from-[#3a2c24] to-[#1f1712] p-[10px] shadow-2xl" style={{ width: 390 * SCALE + 20 }}>
        <div className="overflow-hidden rounded-[35px] bg-white" style={{ width: 390 * SCALE, height: 844 * SCALE }}>
          <iframe
            key={reloadKey}
            src={`/welten/${id}?vorschau=1`}
            title="Live-Vorschau der Lernwelt"
            className="origin-top-left border-0"
            style={{ width: 390, height: 844, transform: `scale(${SCALE})` }}
          />
        </div>
      </div>
      <div className="mt-3 flex justify-center gap-2">
        <Button className="h-9 text-[13px]" onClick={onReload}>
          <RefreshCw className="size-3.5" aria-hidden /> Neu laden
        </Button>
        <a href={`/welten/${id}?vorschau=1`} target="_blank" rel="noreferrer" className="inline-flex h-9 items-center gap-2 rounded-full bg-white px-4 text-[13px] font-bold text-ink ring-1 ring-line hover:bg-cream">
          <ExternalLink className="size-3.5" aria-hidden /> Im neuen Tab
        </a>
      </div>
      <p className="mt-2 text-center text-[12px] font-medium text-ink-soft">Änderungen erscheinen sofort – so sehen es die Kinder.</p>
    </div>
  );
}

export function WorldEditor({ id }: { id: string }) {
  const studio = useStudio();
  const router = useRouter();
  const [draft, setDraft] = useState<World | null>(null);
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved">("idle");
  const [openStep, setOpenStep] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  const [listening, setListening] = useState(false);
  const timer = useRef<number | null>(null);
  const pending = useRef<World | null>(null);
  const latest = useRef<World | null>(null);

  const stored = studio.worlds.find((w) => w.id === id);
  const world = draft ?? stored ?? null;

  // ausstehende Änderungen beim Verlassen speichern
  useEffect(
    () => () => {
      if (timer.current) window.clearTimeout(timer.current);
      if (pending.current) void saveWorld(pending.current);
      stopAmbient();
    },
    [],
  );

  if (!studio.ready) return <div className="mx-auto h-96 max-w-[1280px] animate-pulse rounded-[24px] bg-white" />;
  if (!world) {
    return (
      <div className="mx-auto max-w-[640px] rounded-[24px] bg-white p-10 text-center ring-1 ring-line">
        <p className="text-[18px] font-bold text-ink">Diese Lernwelt gibt es nicht (mehr).</p>
        <Link href="/admin/welten" className="mt-4 inline-flex rounded-full bg-ink px-5 py-2.5 text-[14px] font-bold text-white">
          Zur Übersicht
        </Link>
      </div>
    );
  }

  const update = (fn: (w: World) => World) => {
    const base = latest.current ?? world;
    const next = fn(base);
    latest.current = next;
    pending.current = next;
    setDraft(next);
    setSaveState("saving");
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => {
      const w = pending.current;
      pending.current = null;
      if (w) void saveWorld(w).then(() => setSaveState("saved"));
    }, 450);
  };
  const set = <K extends keyof World>(key: K, value: World[K]) => update((w) => ({ ...w, [key]: value }));
  const setStep = (step: Step) => update((w) => ({ ...w, steps: w.steps.map((s) => (s.id === step.id ? step : s)) }));
  const move = (index: number, dir: -1 | 1) =>
    update((w) => {
      const steps = [...w.steps];
      const target = index + dir;
      if (target < 0 || target >= steps.length) return w;
      [steps[index], steps[target]] = [steps[target], steps[index]];
      return { ...w, steps };
    });

  const issues = validate(world);
  const published = world.status === "veroeffentlicht";
  const featured = studio.settings.featuredWorldId === world.id;
  const mediaName = (mid: string) => studio.media.find((m) => m.id === mid)?.name;
  const mediaDuration = (mid: string) => studio.media.find((m) => m.id === mid)?.duration ?? 0;

  const togglePublish = () => {
    if (!published && issues.length && !window.confirm(`Es gibt noch ${issues.length} Hinweis(e). Trotzdem veröffentlichen?`)) return;
    set("status", published ? "entwurf" : "veroeffentlicht");
  };

  const listen = (ambient: Ambient) => {
    if (listening) {
      stopAmbient();
      setListening(false);
      return;
    }
    startAmbient(ambient);
    setListening(true);
    window.setTimeout(() => {
      stopAmbient();
      setListening(false);
    }, 6000);
  };

  return (
    <div className="mx-auto max-w-[1320px]">
      {/* Kopfzeile */}
      <div className="z-20 -mx-5 mb-6 border-b border-line bg-cream/90 px-5 py-3 backdrop-blur sm:-mx-8 sm:px-8 lg:sticky lg:top-0">
        <div className="flex flex-wrap items-center gap-3">
          <Link href="/admin/welten" aria-label="Zurück zu den Lernwelten" className="grid grid-cols-1 size-10 place-items-center rounded-full bg-white text-ink ring-1 ring-line hover:bg-cream">
            <ChevronLeft className="size-5" aria-hidden />
          </Link>
          <div className="min-w-0 flex-1 basis-[calc(100%-3.25rem)] xl:basis-0">
            <p className="truncate text-[20px] font-bold text-ink-strong">{world.title || "Ohne Titel"}</p>
            <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[12.5px] font-semibold text-ink-soft">
              <StatusBadge status={world.status} />
              {saveState === "saving" ? (
                <span className="inline-flex items-center gap-1">
                  <Loader2 className="size-3.5 animate-spin" aria-hidden /> Speichert …
                </span>
              ) : saveState === "saved" ? (
                <span className="inline-flex items-center gap-1">
                  <Check className="size-3.5" aria-hidden /> Gespeichert
                </span>
              ) : (
                <span>Automatisches Speichern aktiv</span>
              )}
              <span>· ca. {worldMinutes(world, mediaDuration)} Min.</span>
            </p>
          </div>
          <Button onClick={() => void saveSettings({ featuredWorldId: featured ? null : world.id })} aria-pressed={featured} aria-label={featured ? "Hervorgehoben" : "Hervorheben"}>
            <Star className={cn("size-4", featured && "fill-brand-yellow text-brand-orange")} aria-hidden /> <span className="hidden sm:inline">{featured ? "Hervorgehoben" : "Hervorheben"}</span>
          </Button>
          <Button
            aria-label="Duplizieren"
            onClick={async () => {
              const copy = await duplicateWorld(world);
              router.push(`/admin/welten/${copy.id}`);
            }}
          >
            <Copy className="size-4" aria-hidden /> <span className="hidden sm:inline">Duplizieren</span>
          </Button>
          <Button
            variant="danger"
            aria-label="Lernwelt löschen"
            onClick={async () => {
              if (!window.confirm(`„${world.title}“ wirklich löschen?`)) return;
              pending.current = null;
              if (timer.current) window.clearTimeout(timer.current);
              await removeWorld(world.id);
              router.push("/admin/welten");
            }}
          >
            <Trash2 className="size-4" aria-hidden /> <span className="hidden sm:inline">Löschen</span>
          </Button>
          <Button variant="primary" onClick={togglePublish}>
            {published ? <EyeOff className="size-4" aria-hidden /> : <Rocket className="size-4" aria-hidden />} {published ? "Zurückziehen" : "Veröffentlichen"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_356px]">
        <div className="space-y-6">
          {issues.length > 0 && (
            <div className="rounded-[20px] bg-[#FFF6DD] p-4 ring-1 ring-[#F1DFA4]">
              <p className="flex items-center gap-2 text-[14px] font-bold text-[#7A5A12]">
                <AlertTriangle className="size-4" aria-hidden /> {issues.length} {issues.length === 1 ? "Hinweis" : "Hinweise"} vor dem Veröffentlichen
              </p>
              <ul className="mt-1.5 list-disc pl-6 text-[13px] font-medium text-[#7A5A12]">
                {issues.map((i) => (
                  <li key={i}>{i}</li>
                ))}
              </ul>
            </div>
          )}

          {/* 1. Grunddaten */}
          <Card title="1 · Grunddaten" subtitle="Worum geht es und für wen ist die Lernwelt?">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Titel">
                <Input value={world.title} onChange={(e) => set("title", e.target.value)} maxLength={48} />
              </Field>
              <Field label="Untertitel">
                <Input value={world.subtitle} onChange={(e) => set("subtitle", e.target.value)} maxLength={90} />
              </Field>
              <Field label="Kategorie" hint="Bestimmt, wo die Lernwelt in der App zusätzlich erscheint.">
                <Select value={world.category} onChange={(e) => set("category", e.target.value as WorldCategory)}>
                  {Object.entries(categoryLabels).map(([k, v]) => (
                    <option key={k} value={k}>
                      {v}
                    </option>
                  ))}
                </Select>
              </Field>
              <Field label="Alter">
                <Select value={world.age} onChange={(e) => set("age", e.target.value)}>
                  {ageOptions.map((a) => (
                    <option key={a}>{a}</option>
                  ))}
                </Select>
              </Field>
            </div>
            <div className="mt-5">
              <p className="text-[13px] font-bold text-ink">Begleiter aus der YOGITIER-Bande</p>
              <div className="mt-2 grid grid-cols-4 gap-2 sm:grid-cols-8">
                {animals.map((a) => (
                  <button
                    key={a.id}
                    type="button"
                    onClick={() => set("guide", a.id)}
                    aria-pressed={world.guide === a.id}
                    className={cn("flex flex-col items-center gap-1 rounded-[16px] p-2 transition", world.guide === a.id ? "ring-[3px] ring-ink" : "ring-1 ring-line hover:bg-cream")}
                    style={{ background: a.soft }}
                  >
                    <Image src={a.image} alt="" className="size-10 object-contain" sizes="40px" />
                    <span className="text-[11.5px] font-bold text-ink">{a.name}</span>
                  </button>
                ))}
              </div>
            </div>
            <Field label="Begrüßung des Begleiters" hint="Wird beim Betreten der Lernwelt gezeigt und vorgelesen." className="mt-5">
              <div className="relative">
                <Textarea rows={2} value={world.greeting} onChange={(e) => set("greeting", e.target.value)} maxLength={200} />
                <button type="button" onClick={() => speak(world.greeting, { force: true })} aria-label="Probehören" className="absolute bottom-2 right-2 grid grid-cols-1 size-8 place-items-center rounded-full bg-white text-ink ring-1 ring-line">
                  <Volume2 className="size-4" aria-hidden />
                </button>
              </div>
            </Field>
          </Card>

          {/* 2. Umgebung */}
          <Card title="2 · Umgebung gestalten" subtitle="Szene, Farbe, Klang und Belohnung – damit sich jede Lernwelt wie ein eigener Ort anfühlt.">
            <p className="text-[13px] font-bold text-ink">Szene</p>
            <div className="mt-2 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {(Object.keys(worldThemes) as WorldTheme[]).map((th) => (
                <button
                  key={th}
                  type="button"
                  onClick={() => set("theme", th)}
                  aria-pressed={world.theme === th}
                  className={cn("overflow-hidden rounded-[18px] text-left transition", world.theme === th ? "ring-[3px] ring-ink" : "ring-1 ring-line hover:ring-ink/30")}
                >
                  <WorldScene theme={th} compact className="relative h-20 w-full" />
                  <span className="block bg-white px-2.5 py-2">
                    <span className="block text-[13px] font-bold text-ink">{worldThemes[th].label}</span>
                    <span className="block truncate text-[11.5px] font-medium text-ink-soft">{worldThemes[th].description}</span>
                  </span>
                </button>
              ))}
            </div>
            <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-2">
              <div>
                <p className="text-[13px] font-bold text-ink">Akzentfarbe</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {accentColors.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => set("accent", c)}
                      aria-label={`Farbe ${c}`}
                      aria-pressed={world.accent === c}
                      className={cn("size-10 rounded-full ring-offset-2 transition", world.accent === c && "ring-[3px] ring-ink")}
                      style={{ background: c }}
                    />
                  ))}
                </div>
              </div>
              <div>
                <p className="text-[13px] font-bold text-ink">Hintergrundklang</p>
                <div className="mt-2 flex gap-2">
                  <Select value={world.ambient} onChange={(e) => set("ambient", e.target.value as Ambient)}>
                    {Object.entries(ambientLabels).map(([k, v]) => (
                      <option key={k} value={k}>
                        {v}
                      </option>
                    ))}
                  </Select>
                  <Button onClick={() => listen(world.ambient)} disabled={world.ambient === "aus"} aria-pressed={listening}>
                    <Headphones className="size-4" aria-hidden /> {listening ? "Stopp" : "Probe"}
                  </Button>
                </div>
              </div>
            </div>
            <div className="mt-5">
              <p className="text-[13px] font-bold text-ink">Belohnung am Ende</p>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <Input value={world.reward.emoji} onChange={(e) => set("reward", { ...world.reward, emoji: e.target.value.slice(0, 4) })} className="w-16 px-1 text-center text-[22px]" aria-label="Sticker-Symbol" />
                <Input value={world.reward.name} onChange={(e) => set("reward", { ...world.reward, name: e.target.value })} className="max-w-[260px]" placeholder="Name des Stickers" aria-label="Name des Stickers" maxLength={28} />
                <div className="flex flex-wrap gap-1">
                  {REWARD_PICKS.map((em) => (
                    <button key={em} type="button" onClick={() => set("reward", { ...world.reward, emoji: em })} className={cn("grid size-9 place-items-center rounded-full text-[18px] hover:bg-cream", world.reward.emoji === em && "bg-cream ring-2 ring-ink")}>
                      {em}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          {/* 3. Lernpfad */}
          <Card title="3 · Lernpfad" subtitle="Stationen in der Reihenfolge, in der die Kinder sie erleben. Mischt Schauen, Mitmachen und Nachdenken.">
            {world.steps.length === 0 && (
              <p className="mb-3 rounded-[16px] bg-cream p-4 text-[13.5px] font-medium text-ink-soft">Noch keine Stationen. Fügt unten die erste hinzu – z. B. ein Video mit Mitmach-Stopps.</p>
            )}
            <ol className="grid grid-cols-1 gap-3">
              {world.steps.map((s, i) => {
                const Icon = STEP_ICON[s.type];
                const open = openStep === s.id;
                return (
                  <li key={s.id} className={cn("rounded-[20px] ring-1 transition", open ? "bg-white ring-ink/30 shadow-md" : "bg-cream/60 ring-line")}>
                    <div className="flex items-center gap-3 p-3">
                      <span className="grid grid-cols-1 size-10 shrink-0 place-items-center rounded-full text-white" style={{ background: world.accent }}>
                        <Icon className="size-5" strokeWidth={1.9} aria-hidden />
                      </span>
                      <button type="button" onClick={() => setOpenStep(open ? null : s.id)} className="min-w-0 flex-1 text-left" aria-expanded={open}>
                        <span className="flex items-center gap-2">
                          <span className="text-[12px] font-bold text-ink-soft">
                            {i + 1}. {stepTypeLabels[s.type].label}
                          </span>
                        </span>
                        <span className="block truncate text-[15px] font-bold text-ink">{s.title || "Ohne Titel"}</span>
                        <span className="block truncate text-[12.5px] font-medium text-ink-soft">{summary(s, mediaName)}</span>
                      </button>
                      <div className="flex shrink-0 items-center gap-0.5">
                        <button type="button" onClick={() => move(i, -1)} disabled={i === 0} aria-label="Nach oben" className="grid grid-cols-1 size-8 place-items-center rounded-full text-ink hover:bg-white disabled:opacity-30">
                          <ArrowUp className="size-4" aria-hidden />
                        </button>
                        <button type="button" onClick={() => move(i, 1)} disabled={i === world.steps.length - 1} aria-label="Nach unten" className="grid grid-cols-1 size-8 place-items-center rounded-full text-ink hover:bg-white disabled:opacity-30">
                          <ArrowDown className="size-4" aria-hidden />
                        </button>
                        <button
                          type="button"
                          onClick={() => update((w) => ({ ...w, steps: [...w.steps.slice(0, i + 1), cloneSteps([s])[0], ...w.steps.slice(i + 1)] }))}
                          aria-label="Station duplizieren"
                          className="grid grid-cols-1 size-8 place-items-center rounded-full text-ink hover:bg-white"
                        >
                          <Copy className="size-4" aria-hidden />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (window.confirm(`Station „${s.title}“ entfernen?`)) update((w) => ({ ...w, steps: w.steps.filter((x) => x.id !== s.id) }));
                          }}
                          aria-label="Station entfernen"
                          className="grid grid-cols-1 size-8 place-items-center rounded-full text-[#A23B1E] hover:bg-[#FDECE7]"
                        >
                          <Trash2 className="size-4" aria-hidden />
                        </button>
                        <button type="button" onClick={() => setOpenStep(open ? null : s.id)} aria-label={open ? "Zuklappen" : "Bearbeiten"} className="grid grid-cols-1 size-8 place-items-center rounded-full text-ink hover:bg-white">
                          <ChevronDown className={cn("size-4 transition", open && "rotate-180")} aria-hidden />
                        </button>
                      </div>
                    </div>
                    {open && (
                      <div className="border-t border-line p-4">
                        <StepEditor step={s} onChange={setStep} />
                      </div>
                    )}
                  </li>
                );
              })}
            </ol>

            {adding ? (
              <div className="mt-4 rounded-[20px] bg-cream p-3">
                <p className="mb-2 px-1 text-[13px] font-bold text-ink">Welche Station soll dazukommen?</p>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
                  {(Object.keys(stepTypeLabels) as StepType[]).map((t) => {
                    const Icon = STEP_ICON[t];
                    return (
                      <button
                        key={t}
                        type="button"
                        onClick={() => {
                          const step = newStep(t);
                          update((w) => ({ ...w, steps: [...w.steps, step] }));
                          setOpenStep(step.id);
                          setAdding(false);
                        }}
                        className="flex items-center gap-3 rounded-[16px] bg-white p-3 text-left ring-1 ring-line transition hover:ring-ink/40"
                      >
                        <span className="grid grid-cols-1 size-10 shrink-0 place-items-center rounded-full bg-cream text-ink">
                          <Icon className="size-5" strokeWidth={1.9} aria-hidden />
                        </span>
                        <span>
                          <span className="block text-[14px] font-bold text-ink">{stepTypeLabels[t].label}</span>
                          <span className="block text-[12px] font-medium leading-snug text-ink-soft">{stepTypeLabels[t].hint}</span>
                        </span>
                      </button>
                    );
                  })}
                </div>
                <button type="button" onClick={() => setAdding(false)} className="mt-2 px-1 text-[13px] font-bold text-ink-soft hover:text-ink">
                  Abbrechen
                </button>
              </div>
            ) : (
              <Button variant="primary" className="mt-4" onClick={() => setAdding(true)}>
                <Plus className="size-4" aria-hidden /> Station hinzufügen
              </Button>
            )}
          </Card>
        </div>

        <aside className="xl:sticky xl:top-24 xl:self-start">
          <p className="mb-3 flex items-center justify-center gap-2 text-[13px] font-bold text-ink-soft">
            <Eye className="size-4" aria-hidden /> Live-Vorschau
          </p>
          <LivePreview id={world.id} reloadKey={reloadKey} onReload={() => setReloadKey((k) => k + 1)} />
        </aside>
      </div>
    </div>
  );
}
