"use client";

import { Clapperboard, Image as ImageIcon, Play, Trash2, UploadCloud, X } from "lucide-react";
import { useEffect, useState } from "react";

import { cn } from "@/lib/cn";
import { formatBytes, formatDuration, removeMedia, uploadMedia, useMediaUrl, useStudio } from "@/lib/studio/store";
import type { MediaMeta } from "@/lib/studio/types";

import { Button, Card, PageTitle } from "./ui";

function Player({ media, onClose }: { media: MediaMeta; onClose: () => void }) {
  const url = useMediaUrl(media.id);
  return (
    <div role="dialog" aria-modal="true" aria-label={media.name} className="fixed inset-0 z-50 flex items-center justify-center bg-[#2b1d14]/60 p-5" onClick={onClose}>
      <div className="w-full max-w-[720px] rounded-[26px] bg-white p-4 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="mb-3 flex items-center justify-between gap-3">
          <p className="truncate text-[16px] font-bold text-ink">{media.name}</p>
          <button type="button" onClick={onClose} aria-label="Schließen" className="grid grid-cols-1 size-9 place-items-center rounded-full bg-cream text-ink">
            <X className="size-4" aria-hidden />
          </button>
        </div>
        {url ? (
          media.type.startsWith("video/") ? (
            <video src={url} controls autoPlay playsInline className="max-h-[70dvh] w-full rounded-[18px] bg-black" />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element -- lokales Bild
            <img src={url} alt={media.name} className="max-h-[70dvh] w-full rounded-[18px] object-contain" />
          )
        ) : (
          <div className="h-64 animate-pulse rounded-[18px] bg-cream" />
        )}
      </div>
    </div>
  );
}

export function MediaLibrary() {
  const studio = useStudio();
  const [queue, setQueue] = useState<{ name: string; progress: number }[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [drag, setDrag] = useState(false);
  const [open, setOpen] = useState<MediaMeta | null>(null);
  const [storage, setStorage] = useState<{ usage: number; quota: number } | null>(null);

  useEffect(() => {
    navigator.storage
      ?.estimate()
      .then((e) => setStorage({ usage: e.usage ?? 0, quota: e.quota ?? 0 }))
      .catch(() => {});
  }, [studio.media.length]);

  const usedIn = (id: string) =>
    studio.worlds.filter((w) => w.steps.some((s) => (s.type === "video" && s.source?.kind === "upload" && s.source.mediaId === id) || (s.type === "info" && s.imageMediaId === id)));

  const upload = async (files: FileList | null) => {
    if (!files?.length) return;
    setError(null);
    for (const file of Array.from(files)) {
      if (!file.type.startsWith("video/") && !file.type.startsWith("image/")) {
        setError(`„${file.name}“ ist kein Video oder Bild.`);
        continue;
      }
      setQueue((q) => [...q, { name: file.name, progress: 0 }]);
      try {
        await uploadMedia(file, (p) => setQueue((q) => q.map((x) => (x.name === file.name ? { ...x, progress: p } : x))));
      } catch (e) {
        setError(e instanceof DOMException && e.name === "QuotaExceededError" ? "Der Speicher im Browser ist voll." : `Upload von „${file.name}“ fehlgeschlagen.`);
      } finally {
        setQueue((q) => q.filter((x) => x.name !== file.name));
      }
    }
  };

  const remove = async (m: MediaMeta) => {
    const worlds = usedIn(m.id);
    const msg = worlds.length
      ? `„${m.name}“ wird in ${worlds.length} Lernwelt(en) verwendet (${worlds.map((w) => w.title).join(", ")}). Trotzdem löschen?`
      : `„${m.name}“ löschen?`;
    if (window.confirm(msg)) await removeMedia(m.id);
  };

  return (
    <div className="mx-auto max-w-[1180px]">
      <PageTitle
        title="Medien"
        subtitle="Alle hochgeladenen Anleitungsvideos und Bilder. Ein Video kann in mehreren Lernwelten verwendet werden."
        actions={
          storage ? (
            <span className="inline-flex h-10 items-center rounded-full bg-white px-4 text-[13px] font-bold text-ink-soft ring-1 ring-line">
              Belegt: {formatBytes(storage.usage)}
              {storage.quota ? ` von ${formatBytes(storage.quota)}` : ""}
            </span>
          ) : undefined
        }
      />

      <label
        onDragOver={(e) => {
          e.preventDefault();
          setDrag(true);
        }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDrag(false);
          void upload(e.dataTransfer.files);
        }}
        className={cn(
          "flex cursor-pointer flex-col items-center justify-center rounded-[24px] border-2 border-dashed bg-white px-6 py-10 text-center transition",
          drag ? "border-lilac bg-meditation/40" : "border-line hover:bg-cream/50",
        )}
      >
        <UploadCloud className="size-10 text-ink-soft" strokeWidth={1.5} aria-hidden />
        <span className="mt-2 text-[16px] font-bold text-ink">Videos oder Bilder hierher ziehen</span>
        <span className="mt-1 text-[13px] font-medium text-ink-soft">oder klicken zum Auswählen · mehrere Dateien möglich · MP4/MOV/WebM, JPG/PNG</span>
        <input type="file" multiple accept="video/*,image/*" className="sr-only" onChange={(e) => void upload(e.target.files)} />
      </label>

      {queue.length > 0 && (
        <ul className="mt-4 grid grid-cols-1 gap-2" aria-live="polite">
          {queue.map((q) => (
            <li key={q.name} className="rounded-[16px] bg-white p-3 ring-1 ring-line">
              <p className="truncate text-[13px] font-bold text-ink">{q.name}</p>
              <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-cream">
                <div className="h-full rounded-full bg-ink transition-[width]" style={{ width: `${Math.round(q.progress * 100)}%` }} />
              </div>
            </li>
          ))}
        </ul>
      )}
      {error && <p className="mt-4 rounded-[14px] bg-[#FDECE7] px-4 py-3 text-[13.5px] font-bold text-[#A23B1E]">{error}</p>}

      <Card title={`Mediathek (${studio.media.length})`} className="mt-6">
        {!studio.ready ? (
          <div className="h-40 animate-pulse rounded-[18px] bg-cream" />
        ) : studio.media.length === 0 ? (
          <p className="rounded-[18px] bg-cream p-6 text-center text-[14px] font-medium text-ink-soft">
            Noch keine Medien. Ladet euer erstes Anleitungsvideo hoch – z. B. direkt vom Smartphone.
          </p>
        ) : (
          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {studio.media.map((m) => {
              const worlds = usedIn(m.id);
              const isVideo = m.type.startsWith("video/");
              return (
                <li key={m.id} className="overflow-hidden rounded-[20px] ring-1 ring-line">
                  <button type="button" onClick={() => setOpen(m)} className="group relative block aspect-video w-full bg-[#1b1410]">
                    {m.thumb ? (
                      // eslint-disable-next-line @next/next/no-img-element -- lokales Vorschaubild
                      <img src={m.thumb} alt="" className="size-full object-contain" />
                    ) : (
                      <span className="grid grid-cols-1 size-full place-items-center text-white/60">{isVideo ? <Clapperboard className="size-8" aria-hidden /> : <ImageIcon className="size-8" aria-hidden />}</span>
                    )}
                    <span className="absolute inset-0 grid grid-cols-1 place-items-center bg-black/0 transition group-hover:bg-black/25">
                      <span className="grid grid-cols-1 size-12 place-items-center rounded-full bg-white/90 text-ink opacity-0 shadow-lg transition group-hover:opacity-100">
                        <Play className="ml-0.5 size-5 fill-ink" aria-hidden />
                      </span>
                    </span>
                    {isVideo && <span className="absolute bottom-2 right-2 rounded-full bg-black/70 px-2 py-0.5 text-[11.5px] font-bold text-white">{formatDuration(m.duration)}</span>}
                  </button>
                  <div className="p-3">
                    <p className="truncate text-[14px] font-bold text-ink">{m.name}</p>
                    <p className="text-[12px] font-medium text-ink-soft">
                      {formatBytes(m.size)}
                      {m.width ? ` · ${m.width}×${m.height}` : ""} · {new Date(m.createdAt).toLocaleDateString("de-DE")}
                    </p>
                    <div className="mt-2 flex items-center justify-between gap-2">
                      <span className={cn("text-[12px] font-bold", worlds.length ? "text-[#3E6B33]" : "text-ink-soft")}>
                        {worlds.length ? `In ${worlds.length} Lernwelt${worlds.length === 1 ? "" : "en"}` : "Noch nicht verwendet"}
                      </span>
                      <Button variant="danger" className="h-8 px-3 text-[12px]" onClick={() => void remove(m)}>
                        <Trash2 className="size-3.5" aria-hidden /> Löschen
                      </Button>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </Card>

      <p className="mt-4 text-[12.5px] font-medium text-ink-soft">
        Hinweis zum Prototyp: Medien werden lokal in diesem Browser gespeichert (IndexedDB). In der Produktiv-Version landen sie in der Cloud und sind auf allen Geräten verfügbar.
      </p>
      {open && <Player media={open} onClose={() => setOpen(null)} />}
    </div>
  );
}
