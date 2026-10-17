"use client";

import { ArrowRight, Clapperboard, Globe, HardDrive, PlusCircle, Rocket, Smartphone, Trophy, Upload, Wand2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { WorldCover } from "@/components/worlds/world-card";
import { categoryLabels } from "@/content/worlds";
import { createWorld, formatBytes, formatDuration, saveWorld, useStudio } from "@/lib/studio/store";
import { useAppState } from "@/lib/store";

import { Button, Card, PageTitle, StatusBadge } from "./ui";

function Kpi({ icon: Icon, label, value, hint }: { icon: typeof Globe; label: string; value: string; hint?: string }) {
  return (
    <div className="rounded-[22px] bg-white p-5 ring-1 ring-line">
      <span className="grid grid-cols-1 size-10 place-items-center rounded-[14px] bg-cream text-ink">
        <Icon className="size-5" strokeWidth={1.8} aria-hidden />
      </span>
      <p className="mt-3 text-[13px] font-bold text-ink-soft">{label}</p>
      <p className="text-[26px] font-bold leading-tight text-ink-strong">{value}</p>
      {hint && <p className="mt-0.5 text-[12.5px] font-medium text-ink-soft">{hint}</p>}
    </div>
  );
}

export function Dashboard() {
  const studio = useStudio();
  const app = useAppState();
  const router = useRouter();
  const [storage, setStorage] = useState<{ usage: number; quota: number } | null>(null);

  useEffect(() => {
    navigator.storage
      ?.estimate()
      .then((e) => setStorage({ usage: e.usage ?? 0, quota: e.quota ?? 0 }))
      .catch(() => {});
  }, [studio.media.length]);

  const published = studio.worlds.filter((w) => w.status === "veroeffentlicht");
  const drafts = studio.worlds.length - published.length;
  const videos = studio.media.filter((m) => m.type.startsWith("video/"));
  const videoSeconds = videos.reduce((s, m) => s + m.duration, 0);
  const completed = Object.values(app.worldProgress).filter((p) => p.completedAt).length;

  const newWorld = async () => {
    const w = createWorld();
    await saveWorld(w);
    router.push(`/admin/welten/${w.id}`);
  };

  return (
    <div className="mx-auto max-w-[1180px]">
      <PageTitle
        title="Willkommen im YOGITIER® Studio"
        subtitle="Gestaltet Lernwelten, ladet Anleitungsvideos hoch und veröffentlicht sie mit einem Klick in der Kinder-App."
        actions={
          <>
            <Button onClick={() => window.open("/", "_blank")} data-tour="studio-app">
              <Smartphone className="size-4" aria-hidden /> App ansehen
            </Button>
            <Button variant="primary" onClick={newWorld} disabled={!studio.ready} data-tour="studio-neu">
              <PlusCircle className="size-4" aria-hidden /> Neue Lernwelt
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4" data-tour="studio-kpis">
        <Kpi icon={Globe} label="Lernwelten" value={String(studio.worlds.length)} hint={`${published.length} live · ${drafts} Entwürfe`} />
        <Kpi icon={Clapperboard} label="Videos" value={String(videos.length)} hint={videos.length ? `${formatDuration(videoSeconds)} Min. Material` : "Noch keine Uploads"} />
        <Kpi icon={HardDrive} label="Speicher" value={storage ? formatBytes(storage.usage) : "–"} hint={storage?.quota ? `von ${formatBytes(storage.quota)} im Browser` : "lokal im Browser"} />
        <Kpi icon={Trophy} label="Abgeschlossen" value={String(completed)} hint="Lernwelten auf diesem Gerät" />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[1.4fr_1fr]">
        <Card
          title="Zuletzt bearbeitet"
          action={
            <Link href="/admin/welten" className="inline-flex items-center gap-1 text-[13px] font-bold text-ink">
              Alle <ArrowRight className="size-4" aria-hidden />
            </Link>
          }
        >
          {!studio.ready ? (
            <div className="h-48 animate-pulse rounded-[18px] bg-cream" />
          ) : (
            <ul className="divide-y divide-line">
              {studio.worlds.slice(0, 5).map((w) => (
                <li key={w.id}>
                  <Link href={`/admin/welten/${w.id}`} className="flex items-center gap-4 py-3 transition hover:opacity-80">
                    <WorldCover world={w} size="sm" className="h-14 w-20 shrink-0 rounded-[14px]" />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[15px] font-bold text-ink">{w.title}</span>
                      <span className="block text-[12.5px] font-medium text-ink-soft">
                        {categoryLabels[w.category]} · {w.steps.length} Stationen · {new Date(w.updatedAt).toLocaleDateString("de-DE")}
                      </span>
                    </span>
                    <StatusBadge status={w.status} />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card title="So funktioniert's" subtitle="In drei Schritten zur neuen Lernwelt">
          <ol className="grid grid-cols-1 gap-4">
            {[
              { icon: Upload, title: "Video hochladen", text: "MP4 vom Handy oder Kamera – oder einen YouTube-/Vimeo-Link einfügen." },
              { icon: Wand2, title: "Lernwelt gestalten", text: "Umgebung, Begleiter und Klang wählen, Stationen anordnen und Mitmach-Stopps setzen." },
              { icon: Rocket, title: "Veröffentlichen", text: "Ein Klick – und die Lernwelt erscheint bei den Kindern unter „Besonderes“." },
            ].map(({ icon: Icon, title, text }, i) => (
              <li key={title} className="flex gap-3">
                <span className="grid grid-cols-1 size-10 shrink-0 place-items-center rounded-full bg-tierfreunde text-ink">
                  <Icon className="size-5" strokeWidth={1.8} aria-hidden />
                </span>
                <span>
                  <span className="block text-[14.5px] font-bold text-ink">
                    {i + 1}. {title}
                  </span>
                  <span className="block text-[13px] font-medium leading-relaxed text-ink-soft">{text}</span>
                </span>
              </li>
            ))}
          </ol>
          <div className="mt-5 flex flex-wrap gap-2">
            <Button variant="primary" onClick={newWorld} disabled={!studio.ready}>
              <PlusCircle className="size-4" aria-hidden /> Lernwelt erstellen
            </Button>
            <Button onClick={() => router.push("/admin/medien")}>
              <Upload className="size-4" aria-hidden /> Video hochladen
            </Button>
          </div>
        </Card>
      </div>

      {studio.error && <p className="mt-6 rounded-[18px] bg-[#FDECE7] p-4 text-[14px] font-bold text-[#A23B1E]">Speicherfehler: {studio.error}</p>}
    </div>
  );
}
