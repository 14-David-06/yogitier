"use client";

import { Clapperboard, Hand, Link2, Plus, Trash2, UploadCloud, X } from "lucide-react";
import { useRef, useState } from "react";

import { embedUrl } from "@/components/worlds/interactive-video";
import { newId } from "@/content/worlds";
import { cn } from "@/lib/cn";
import { formatBytes, formatDuration, uploadMedia, useMediaUrl, useStudio } from "@/lib/studio/store";
import type { VideoStep } from "@/lib/studio/types";

import { Button, Input, Segmented } from "./ui";

type Tab = "upload" | "bibliothek" | "link";

function sourceKind(url: string) {
  if (/youtube\.com|youtu\.be/.test(url)) return "YouTube";
  if (/vimeo\.com/.test(url)) return "Vimeo";
  if (/\.(mp4|webm|mov|m4v)(\?|$)/i.test(url) || url.startsWith("/")) return "Videodatei";
  return "Link";
}

function errorText(e: unknown) {
  if (e instanceof DOMException && e.name === "QuotaExceededError") return "Der Speicher im Browser ist voll. Bitte löscht alte Videos oder nutzt eine kleinere Datei.";
  return e instanceof Error ? e.message : "Upload fehlgeschlagen.";
}

/** Video einer Station: hochladen, aus der Mediathek wählen oder verlinken – plus Mitmach-Stopps */
export function VideoField({ step, onChange }: { step: VideoStep; onChange: (s: VideoStep) => void }) {
  const studio = useStudio();
  const [tab, setTab] = useState<Tab>(step.source?.kind === "url" ? "link" : "upload");
  const [progress, setProgress] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [drag, setDrag] = useState(false);
  const [url, setUrl] = useState(step.source?.kind === "url" ? step.source.url : "");
  const player = useRef<HTMLVideoElement>(null);

  const uploadId = step.source?.kind === "upload" ? step.source.mediaId : null;
  const uploadUrl = useMediaUrl(uploadId);
  const media = uploadId ? studio.media.find((m) => m.id === uploadId) : undefined;
  const directUrl = step.source?.kind === "url" && !embedUrl(step.source.url) ? step.source.url : null;
  const embed = step.source?.kind === "url" ? embedUrl(step.source.url) : null;
  const playable = uploadUrl ?? directUrl;
  const videos = studio.media.filter((m) => m.type.startsWith("video/"));

  const handleFiles = async (files: FileList | null) => {
    const file = files?.[0];
    if (!file) return;
    if (!file.type.startsWith("video/")) {
      setError("Bitte eine Videodatei wählen (z. B. MP4 oder MOV).");
      return;
    }
    setError(null);
    setProgress(0);
    try {
      const meta = await uploadMedia(file, setProgress);
      onChange({ ...step, source: { kind: "upload", mediaId: meta.id }, title: step.title === "Neues Video" ? meta.name : step.title });
    } catch (e) {
      setError(errorText(e));
    } finally {
      setProgress(null);
    }
  };

  const addStop = () => {
    const current = player.current?.currentTime ?? 0;
    const at = current > 0 ? Math.round(current * 2) / 2 : (step.stops.at(-1)?.at ?? 0) + 10;
    const stops = [...step.stops, { id: newId("stopp"), at, prompt: "Jetzt du! Mach die Übung mit.", seconds: 15 }].sort((a, b) => a.at - b.at);
    onChange({ ...step, stops });
  };

  return (
    <div className="space-y-4">
      {step.source ? (
        <div className="rounded-[18px] bg-cream p-3">
          <div className="mb-2 flex items-center justify-between gap-3">
            <p className="flex min-w-0 items-center gap-2 text-[13px] font-bold text-ink">
              <Clapperboard className="size-4 shrink-0" aria-hidden />
              <span className="truncate">
                {media ? `${media.name} · ${formatDuration(media.duration)} · ${formatBytes(media.size)}` : step.source.kind === "url" ? `${sourceKind(step.source.url)}: ${step.source.url}` : "Video"}
              </span>
            </p>
            <Button variant="ghost" className="h-8 px-3 text-[12.5px]" onClick={() => onChange({ ...step, source: null, stops: [] })}>
              <X className="size-3.5" aria-hidden /> Entfernen
            </Button>
          </div>
          {embed ? (
            <iframe src={embed} title="Video-Vorschau" className="aspect-video w-full rounded-[14px] bg-black" allow="encrypted-media; picture-in-picture; fullscreen" allowFullScreen />
          ) : playable ? (
            <video ref={player} src={playable} controls playsInline className="max-h-[340px] w-full rounded-[14px] bg-black" />
          ) : (
            <div className="h-40 animate-pulse rounded-[14px] bg-white" />
          )}
        </div>
      ) : (
        <>
          <Segmented
            label="Videoquelle"
            value={tab}
            onChange={setTab}
            options={[
              { value: "upload", label: "Hochladen" },
              { value: "bibliothek", label: `Mediathek (${videos.length})` },
              { value: "link", label: "Link einfügen" },
            ]}
          />
          {tab === "upload" && (
            <label
              onDragOver={(e) => {
                e.preventDefault();
                setDrag(true);
              }}
              onDragLeave={() => setDrag(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDrag(false);
                void handleFiles(e.dataTransfer.files);
              }}
              className={cn(
                "flex cursor-pointer flex-col items-center justify-center rounded-[20px] border-2 border-dashed px-6 py-8 text-center transition",
                drag ? "border-lilac bg-meditation/50" : "border-line bg-cream hover:bg-white",
              )}
            >
              <UploadCloud className="size-9 text-ink-soft" strokeWidth={1.6} aria-hidden />
              <span className="mt-2 text-[15px] font-bold text-ink">Video hierher ziehen oder auswählen</span>
              <span className="mt-1 text-[12.5px] font-medium text-ink-soft">MP4, MOV oder WebM · am besten im Hochformat · Vorschaubild & Dauer werden automatisch erkannt</span>
              <input type="file" accept="video/mp4,video/quicktime,video/webm,video/*" className="sr-only" onChange={(e) => void handleFiles(e.target.files)} />
              {progress !== null && (
                <span className="mt-4 block w-full max-w-[320px]" aria-live="polite">
                  <span className="block h-2.5 overflow-hidden rounded-full bg-white">
                    <span className="block h-full rounded-full bg-ink transition-[width]" style={{ width: `${Math.round(progress * 100)}%` }} />
                  </span>
                  <span className="mt-1 block text-[12px] font-bold text-ink">{progress < 1 ? `Wird hochgeladen … ${Math.round(progress * 100)} %` : "Fertig!"}</span>
                </span>
              )}
            </label>
          )}
          {tab === "bibliothek" &&
            (videos.length === 0 ? (
              <p className="rounded-[18px] bg-cream p-4 text-[13.5px] font-medium text-ink-soft">Noch keine Videos in der Mediathek. Ladet zuerst eines hoch.</p>
            ) : (
              <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {videos.map((m) => (
                  <li key={m.id}>
                    <button
                      type="button"
                      onClick={() => onChange({ ...step, source: { kind: "upload", mediaId: m.id } })}
                      className="flex w-full items-center gap-3 rounded-[16px] p-2 text-left ring-1 ring-line hover:bg-cream"
                    >
                      {m.thumb ? (
                        // eslint-disable-next-line @next/next/no-img-element -- lokales Vorschaubild
                        <img src={m.thumb} alt="" className="h-12 w-16 shrink-0 rounded-[10px] bg-black object-cover" />
                      ) : (
                        <span className="grid grid-cols-1 h-12 w-16 shrink-0 place-items-center rounded-[10px] bg-cream">
                          <Clapperboard className="size-5 text-ink-soft" aria-hidden />
                        </span>
                      )}
                      <span className="min-w-0">
                        <span className="block truncate text-[13.5px] font-bold text-ink">{m.name}</span>
                        <span className="block text-[12px] font-medium text-ink-soft">
                          {formatDuration(m.duration)} · {formatBytes(m.size)}
                        </span>
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            ))}
          {tab === "link" && (
            <div className="flex flex-col gap-2 sm:flex-row">
              <Input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://www.youtube.com/watch?v=… oder https://…/video.mp4" />
              <Button variant="primary" disabled={!url.trim()} onClick={() => onChange({ ...step, source: { kind: "url", url: url.trim() } })}>
                <Link2 className="size-4" aria-hidden /> Übernehmen
              </Button>
            </div>
          )}
          {error && <p className="rounded-[14px] bg-[#FDECE7] px-3 py-2 text-[13px] font-bold text-[#A23B1E]">{error}</p>}
        </>
      )}

      {/* Mitmach-Stopps */}
      <div className="rounded-[18px] p-4 ring-1 ring-line">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="flex items-center gap-2 text-[14px] font-bold text-ink">
            <Hand className="size-4" aria-hidden /> Mitmach-Stopps
          </p>
          <Button className="h-8 px-3 text-[12.5px]" onClick={addStop} disabled={!playable}>
            <Plus className="size-3.5" aria-hidden /> {playable ? "Stopp an aktueller Stelle" : "Stopp hinzufügen"}
          </Button>
        </div>
        <p className="mt-1 text-[12.5px] font-medium text-ink-soft">
          {embed
            ? "Bei YouTube/Vimeo sind keine Stopps möglich – ladet das Video hoch oder nutzt einen MP4-Link."
            : "Das Video hält an, die Kinder machen mit (mit Countdown & Vorlesestimme) – danach läuft es weiter. Tipp: Video bis zur gewünschten Stelle abspielen, dann hinzufügen."}
        </p>
        {step.stops.length > 0 && (
          <ul className="mt-3 grid grid-cols-1 gap-2">
            {step.stops.map((s, i) => (
              <li key={s.id} className="grid grid-cols-1 gap-2 rounded-[14px] bg-cream p-2.5 sm:grid-cols-[110px_1fr_110px_auto] sm:items-center">
                <label className="flex items-center gap-1.5 text-[12px] font-bold text-ink-soft">
                  bei
                  <Input
                    type="number"
                    min={0}
                    step={0.5}
                    value={s.at}
                    onChange={(e) => onChange({ ...step, stops: step.stops.map((x) => (x.id === s.id ? { ...x, at: Number(e.target.value) || 0 } : x)) })}
                    className="h-9 px-2 text-center"
                    aria-label={`Stopp ${i + 1}: Zeitpunkt in Sekunden`}
                  />
                  s
                </label>
                <Input
                  value={s.prompt}
                  onChange={(e) => onChange({ ...step, stops: step.stops.map((x) => (x.id === s.id ? { ...x, prompt: e.target.value } : x)) })}
                  className="h-9"
                  aria-label={`Stopp ${i + 1}: Aufforderung`}
                />
                <label className="flex items-center gap-1.5 text-[12px] font-bold text-ink-soft">
                  <Input
                    type="number"
                    min={3}
                    max={120}
                    value={s.seconds}
                    onChange={(e) => onChange({ ...step, stops: step.stops.map((x) => (x.id === s.id ? { ...x, seconds: Math.max(3, Number(e.target.value) || 3) } : x)) })}
                    className="h-9 px-2 text-center"
                    aria-label={`Stopp ${i + 1}: Dauer in Sekunden`}
                  />
                  Sek.
                </label>
                <button
                  type="button"
                  onClick={() => onChange({ ...step, stops: step.stops.filter((x) => x.id !== s.id) })}
                  aria-label={`Stopp ${i + 1} entfernen`}
                  className="grid grid-cols-1 size-9 place-items-center justify-self-end rounded-full text-[#A23B1E] hover:bg-white"
                >
                  <Trash2 className="size-4" aria-hidden />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
