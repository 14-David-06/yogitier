"use client";

import { ImagePlus, Plus, Trash2, Volume2 } from "lucide-react";
import { useState } from "react";

import { PoseArtView } from "@/components/poses/pose-art";
import { breathing } from "@/content/breathing";
import { getPose, poses } from "@/content/poses";
import { newId } from "@/content/worlds";
import { cn } from "@/lib/cn";
import { speak } from "@/lib/speech";
import { uploadMedia, useMediaUrl } from "@/lib/studio/store";
import type { InfoStep, Step } from "@/lib/studio/types";

import { Button, Field, Input, Select, Textarea } from "./ui";
import { VideoField } from "./video-field";

const EMOJI_PICKS = ["⭐", "💧", "🦷", "🍎", "🥕", "🏃", "🧘", "🌙", "❤️", "🌿", "🫧", "🎵"];

function ImageField({ step, onChange }: { step: InfoStep; onChange: (s: InfoStep) => void }) {
  const url = useMediaUrl(step.imageMediaId);
  const [busy, setBusy] = useState(false);
  return (
    <div className="flex items-center gap-3">
      {url ? (
        // eslint-disable-next-line @next/next/no-img-element -- lokales Bild aus dem Studio
        <img src={url} alt="" className="h-20 w-28 rounded-[14px] object-cover ring-1 ring-line" />
      ) : (
        <span className="grid grid-cols-1 h-20 w-28 place-items-center rounded-[14px] bg-cream text-ink-soft">
          <ImagePlus className="size-6" aria-hidden />
        </span>
      )}
      <div className="flex flex-col gap-1.5">
        <label className="inline-flex h-9 cursor-pointer items-center gap-2 rounded-full bg-white px-3.5 text-[13px] font-bold text-ink ring-1 ring-line hover:bg-cream">
          <ImagePlus className="size-4" aria-hidden /> {busy ? "Wird geladen …" : url ? "Bild ersetzen" : "Bild hochladen (optional)"}
          <input
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              setBusy(true);
              try {
                const meta = await uploadMedia(file);
                onChange({ ...step, imageMediaId: meta.id });
              } finally {
                setBusy(false);
              }
            }}
          />
        </label>
        {url && (
          <button type="button" onClick={() => onChange({ ...step, imageMediaId: undefined })} className="text-left text-[12.5px] font-bold text-ink-soft hover:text-ink">
            Bild entfernen
          </button>
        )}
      </div>
    </div>
  );
}

/** Formular für eine Station – je nach Typ */
export function StepEditor({ step, onChange }: { step: Step; onChange: (s: Step) => void }) {
  const title = (
    <Field label="Titel der Station">
      <Input value={step.title} onChange={(e) => onChange({ ...step, title: e.target.value })} maxLength={60} />
    </Field>
  );

  switch (step.type) {
    case "info":
      return (
        <div className="grid grid-cols-1 gap-4">
          {title}
          <Field label="Text" hint="Kurz & kindgerecht – wird in der App vorgelesen.">
            <div className="relative">
              <Textarea rows={4} value={step.text} onChange={(e) => onChange({ ...step, text: e.target.value })} maxLength={400} />
              <button type="button" onClick={() => speak(step.text, { force: true })} aria-label="Probehören" className="absolute bottom-2 right-2 grid grid-cols-1 size-8 place-items-center rounded-full bg-white text-ink ring-1 ring-line">
                <Volume2 className="size-4" aria-hidden />
              </button>
            </div>
          </Field>
          <ImageField step={step} onChange={onChange} />
        </div>
      );

    case "video":
      return (
        <div className="grid grid-cols-1 gap-4">
          {title}
          <Field label="Anweisung für die Kinder">
            <Input value={step.instruction} onChange={(e) => onChange({ ...step, instruction: e.target.value })} maxLength={120} />
          </Field>
          <VideoField step={step} onChange={onChange} />
        </div>
      );

    case "uebung": {
      const pose = getPose(step.pose);
      return (
        <div className="grid grid-cols-1 gap-4">
          {title}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-[1fr_140px]">
            <Field label="Übung aus der Bibliothek">
              <Select
                value={step.pose}
                onChange={(e) => {
                  const p = getPose(e.target.value);
                  onChange({ ...step, pose: e.target.value, title: p && (step.title === pose?.name || !step.title) ? p.name : step.title });
                }}
              >
                {poses.map((p) => (
                  <option key={p.slug} value={p.slug}>
                    {p.name}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Dauer (Sek.)">
              <Input type="number" min={10} max={180} step={5} value={step.seconds} onChange={(e) => onChange({ ...step, seconds: Math.max(10, Number(e.target.value) || 10) })} />
            </Field>
          </div>
          <div className="flex gap-3">
            {pose && (
              <span className="grid grid-cols-1 size-24 shrink-0 place-items-center rounded-[18px]" style={{ background: pose.color }}>
                <span className="block size-20">
                  <PoseArtView pose={pose} sizes="80px" />
                </span>
              </span>
            )}
            <Field label="Ansage (optional)" hint={pose ? `Standard: „${pose.steps[0]}“` : undefined} className="flex-1">
              <Textarea rows={3} value={step.cue} onChange={(e) => onChange({ ...step, cue: e.target.value })} placeholder={pose?.steps.slice(0, 2).join(" ")} maxLength={240} />
            </Field>
          </div>
        </div>
      );
    }

    case "atmung":
      return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {title}
          <Field label="Atemübung">
            <Select
              value={step.breath}
              onChange={(e) => {
                const b = breathing.find((x) => x.slug === e.target.value);
                onChange({ ...step, breath: e.target.value, title: b ? b.title : step.title });
              }}
            >
              {breathing.map((b) => (
                <option key={b.slug} value={b.slug}>
                  {b.title} – {b.purpose}
                </option>
              ))}
            </Select>
          </Field>
        </div>
      );

    case "timer":
      return (
        <div className="grid grid-cols-1 gap-4">
          {title}
          <Field label="Einleitung" hint="Wird zu Beginn vorgelesen.">
            <Textarea rows={2} value={step.intro} onChange={(e) => onChange({ ...step, intro: e.target.value })} maxLength={200} />
          </Field>
          <div>
            <p className="text-[13px] font-bold text-ink">Abschnitte</p>
            <ul className="mt-2 grid grid-cols-1 gap-2">
              {step.segments.map((s, i) => (
                <li key={s.id} className="flex items-center gap-2">
                  <span className="grid grid-cols-1 size-8 shrink-0 place-items-center rounded-full bg-cream text-[13px] font-bold text-ink">{i + 1}</span>
                  <Input
                    value={s.label}
                    onChange={(e) => onChange({ ...step, segments: step.segments.map((x) => (x.id === s.id ? { ...x, label: e.target.value } : x)) })}
                    aria-label={`Abschnitt ${i + 1}`}
                  />
                  <Input
                    type="number"
                    min={5}
                    max={300}
                    value={s.seconds}
                    onChange={(e) => onChange({ ...step, segments: step.segments.map((x) => (x.id === s.id ? { ...x, seconds: Math.max(5, Number(e.target.value) || 5) } : x)) })}
                    className="w-24 text-center"
                    aria-label={`Abschnitt ${i + 1}: Sekunden`}
                  />
                  <button
                    type="button"
                    disabled={step.segments.length <= 1}
                    onClick={() => onChange({ ...step, segments: step.segments.filter((x) => x.id !== s.id) })}
                    aria-label={`Abschnitt ${i + 1} entfernen`}
                    className="grid grid-cols-1 size-9 shrink-0 place-items-center rounded-full text-[#A23B1E] hover:bg-[#FDECE7] disabled:opacity-30"
                  >
                    <Trash2 className="size-4" aria-hidden />
                  </button>
                </li>
              ))}
            </ul>
            <Button className="mt-2 h-9 text-[13px]" onClick={() => onChange({ ...step, segments: [...step.segments, { id: newId("abschnitt"), label: `Abschnitt ${step.segments.length + 1}`, seconds: 30 }] })}>
              <Plus className="size-4" aria-hidden /> Abschnitt
            </Button>
          </div>
        </div>
      );

    case "quiz":
      return (
        <div className="grid grid-cols-1 gap-4">
          {title}
          <Field label="Frage">
            <Textarea rows={2} value={step.question} onChange={(e) => onChange({ ...step, question: e.target.value })} maxLength={160} />
          </Field>
          <div>
            <p className="text-[13px] font-bold text-ink">Antworten · richtige Antwort markieren</p>
            <ul className="mt-2 grid grid-cols-1 gap-2">
              {step.options.map((o, i) => (
                <li key={o.id} className={cn("flex items-center gap-2 rounded-[16px] p-1.5", step.correct === o.id && "bg-[#DCEBD0]")}>
                  <input
                    type="radio"
                    name={`correct-${step.id}`}
                    checked={step.correct === o.id}
                    onChange={() => onChange({ ...step, correct: o.id })}
                    className="size-5 shrink-0 accent-[#4A8A3C]"
                    aria-label={`Antwort ${i + 1} ist richtig`}
                  />
                  <Input
                    value={o.emoji}
                    onChange={(e) => onChange({ ...step, options: step.options.map((x) => (x.id === o.id ? { ...x, emoji: e.target.value.slice(0, 4) } : x)) })}
                    className="w-14 px-1 text-center text-[20px]"
                    aria-label={`Antwort ${i + 1}: Emoji`}
                  />
                  <Input
                    value={o.text}
                    onChange={(e) => onChange({ ...step, options: step.options.map((x) => (x.id === o.id ? { ...x, text: e.target.value } : x)) })}
                    placeholder={`Antwort ${i + 1}`}
                    aria-label={`Antwort ${i + 1}`}
                  />
                  <button
                    type="button"
                    disabled={step.options.length <= 2}
                    onClick={() => {
                      const options = step.options.filter((x) => x.id !== o.id);
                      onChange({ ...step, options, correct: step.correct === o.id ? options[0].id : step.correct });
                    }}
                    aria-label={`Antwort ${i + 1} entfernen`}
                    className="grid grid-cols-1 size-9 shrink-0 place-items-center rounded-full text-[#A23B1E] hover:bg-[#FDECE7] disabled:opacity-30"
                  >
                    <Trash2 className="size-4" aria-hidden />
                  </button>
                </li>
              ))}
            </ul>
            {step.options.length < 4 && (
              <Button className="mt-2 h-9 text-[13px]" onClick={() => onChange({ ...step, options: [...step.options, { id: newId("antwort"), text: "", emoji: "🙂" }] })}>
                <Plus className="size-4" aria-hidden /> Antwort
              </Button>
            )}
          </div>
          <Field label="Erklärung nach der richtigen Antwort" hint="Hier passiert das Lernen – kurz erklären, warum.">
            <Textarea rows={2} value={step.explanation} onChange={(e) => onChange({ ...step, explanation: e.target.value })} maxLength={240} />
          </Field>
        </div>
      );

    case "aufgabe":
      return (
        <div className="grid grid-cols-1 gap-4">
          {title}
          <Field label="Aufgabe" hint="Eine kleine Mission für den Alltag – die Kinder haken sie in der App ab.">
            <Textarea rows={2} value={step.text} onChange={(e) => onChange({ ...step, text: e.target.value })} maxLength={200} />
          </Field>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-[140px_1fr]">
            <Field label="Wie oft?">
              <Input type="number" min={1} max={10} value={step.count} onChange={(e) => onChange({ ...step, count: Math.min(10, Math.max(1, Number(e.target.value) || 1)) })} />
            </Field>
            <Field label="Symbol">
              <div className="flex flex-wrap items-center gap-1.5">
                <Input value={step.unit} onChange={(e) => onChange({ ...step, unit: e.target.value.slice(0, 4) })} className="w-16 px-1 text-center text-[20px]" aria-label="Eigenes Symbol" />
                {EMOJI_PICKS.map((em) => (
                  <button
                    key={em}
                    type="button"
                    onClick={() => onChange({ ...step, unit: em })}
                    className={cn("grid size-9 place-items-center rounded-full text-[18px] hover:bg-cream", step.unit === em && "bg-cream ring-2 ring-ink")}
                  >
                    {em}
                  </button>
                ))}
              </div>
            </Field>
          </div>
        </div>
      );
  }
}
