"use client";

import { Copy, Eye, Pencil, PlusCircle, Trash2, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { WorldCover } from "@/components/worlds/world-card";
import { animalsById } from "@/content/animals";
import { categoryLabels, worldTemplates, worldThemes } from "@/content/worlds";
import { cloneSteps, createWorld, duplicateWorld, removeWorld, saveWorld, useStudio, worldMinutes } from "@/lib/studio/store";
import type { World } from "@/lib/studio/types";
import { cn } from "@/lib/cn";

import { Button, PageTitle, Segmented, StatusBadge } from "./ui";

type Filter = "alle" | "veroeffentlicht" | "entwurf";

export function WorldsList() {
  const studio = useStudio();
  const router = useRouter();
  const [filter, setFilter] = useState<Filter>("alle");
  const [chooser, setChooser] = useState(false);

  const list = studio.worlds.filter((w) => filter === "alle" || w.status === filter);
  const mediaDuration = (id: string) => studio.media.find((m) => m.id === id)?.duration ?? 0;

  const create = async (templateId: string) => {
    const tpl = worldTemplates.find((t) => t.id === templateId);
    const w = createWorld({ ...tpl?.world, steps: cloneSteps(tpl?.world.steps ?? []) });
    await saveWorld(w);
    setChooser(false);
    router.push(`/admin/welten/${w.id}`);
  };

  const remove = async (w: World) => {
    if (window.confirm(`„${w.title}“ wirklich löschen? Das kann nicht rückgängig gemacht werden.`)) await removeWorld(w.id);
  };

  return (
    <div className="mx-auto max-w-[1180px]">
      <PageTitle
        title="Lernwelten"
        subtitle="Jede Lernwelt ist eine gestaltete Umgebung mit einem Lernpfad aus Videos, Übungen, Quiz und Missionen."
        actions={
          <Button variant="primary" onClick={() => setChooser(true)} disabled={!studio.ready}>
            <PlusCircle className="size-4" aria-hidden /> Neue Lernwelt
          </Button>
        }
      />
      <Segmented
        label="Filter"
        value={filter}
        onChange={setFilter}
        options={[
          { value: "alle", label: `Alle (${studio.worlds.length})` },
          { value: "veroeffentlicht", label: "Veröffentlicht" },
          { value: "entwurf", label: "Entwürfe" },
        ]}
      />

      {!studio.ready ? (
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-72 animate-pulse rounded-[24px] bg-white" />
          ))}
        </div>
      ) : list.length === 0 ? (
        <div className="mt-6 rounded-[24px] border-2 border-dashed border-line bg-white p-10 text-center">
          <p className="text-[16px] font-bold text-ink">Hier ist noch nichts.</p>
          <p className="mt-1 text-[14px] font-medium text-ink-soft">Legt eure erste Lernwelt an – mit einer Vorlage geht es besonders schnell.</p>
          <Button variant="primary" className="mt-4" onClick={() => setChooser(true)}>
            <PlusCircle className="size-4" aria-hidden /> Neue Lernwelt
          </Button>
        </div>
      ) : (
        <ul className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {list.map((w) => (
            <li key={w.id} className="flex flex-col overflow-hidden rounded-[24px] bg-white ring-1 ring-line">
              <Link href={`/admin/welten/${w.id}`} className="relative block">
                <WorldCover world={w} className="h-40 w-full" />
                <span className="absolute left-3 top-3">
                  <StatusBadge status={w.status} />
                </span>
                {studio.settings.featuredWorldId === w.id && (
                  <span className="absolute right-3 top-3 rounded-full bg-lilac px-2.5 py-1 text-[11.5px] font-bold text-lilac-ink">Hervorgehoben</span>
                )}
              </Link>
              <div className="flex flex-1 flex-col p-4">
                <p className="text-[16px] font-bold leading-tight text-ink">{w.title}</p>
                <p className="mt-1 line-clamp-2 text-[13px] font-medium text-ink-soft">{w.subtitle || "Ohne Untertitel"}</p>
                <p className="mt-2 text-[12.5px] font-semibold text-ink-soft">
                  {categoryLabels[w.category]} · {worldThemes[w.theme].label} · {animalsById[w.guide].name} · {w.steps.length} Stationen · ca. {worldMinutes(w, mediaDuration)} Min.
                </p>
                <div className="mt-auto flex flex-wrap gap-1.5 pt-4">
                  <Link href={`/admin/welten/${w.id}`} className="inline-flex h-9 items-center gap-1.5 rounded-full bg-ink px-3.5 text-[13px] font-bold text-white">
                    <Pencil className="size-3.5" aria-hidden /> Bearbeiten
                  </Link>
                  <a
                    href={`/welten/${w.id}?vorschau=1`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex h-9 items-center gap-1.5 rounded-full bg-white px-3.5 text-[13px] font-bold text-ink ring-1 ring-line"
                  >
                    <Eye className="size-3.5" aria-hidden /> Vorschau
                  </a>
                  <button type="button" onClick={() => void duplicateWorld(w)} aria-label="Duplizieren" className="grid grid-cols-1 size-9 place-items-center rounded-full bg-white text-ink ring-1 ring-line hover:bg-cream">
                    <Copy className="size-3.5" aria-hidden />
                  </button>
                  <button type="button" onClick={() => void remove(w)} aria-label="Löschen" className="grid grid-cols-1 size-9 place-items-center rounded-full bg-white text-[#A23B1E] ring-1 ring-line hover:bg-[#FDECE7]">
                    <Trash2 className="size-3.5" aria-hidden />
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      {chooser && (
        <div role="dialog" aria-modal="true" aria-label="Neue Lernwelt" className="fixed inset-0 z-50 flex items-center justify-center bg-[#2b1d14]/40 p-5" onClick={() => setChooser(false)}>
          <div className="w-full max-w-[760px] rounded-[28px] bg-white p-6 shadow-2xl" onClick={(e) => e.stopPropagation()} style={{ animation: "pop 320ms cubic-bezier(0.34,1.56,0.64,1) both" }}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-[22px] font-bold text-ink-strong">Neue Lernwelt</h2>
                <p className="text-[14px] font-medium text-ink-soft">Wählt eine Vorlage – alles lässt sich danach anpassen.</p>
              </div>
              <button type="button" onClick={() => setChooser(false)} aria-label="Schließen" className="grid grid-cols-1 size-10 place-items-center rounded-full bg-cream text-ink">
                <X className="size-5" aria-hidden />
              </button>
            </div>
            <ul className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {worldTemplates.map((t) => {
                const preview = { theme: t.world.theme ?? "wiese", guide: t.world.guide ?? "leo" };
                return (
                  <li key={t.id}>
                    <button
                      type="button"
                      onClick={() => void create(t.id)}
                      className={cn("flex w-full items-center gap-4 rounded-[20px] p-3 text-left ring-1 ring-line transition hover:bg-cream hover:ring-ink/30")}
                    >
                      <WorldCover world={preview} size="sm" className="h-16 w-24 shrink-0 rounded-[14px]" />
                      <span>
                        <span className="block text-[15px] font-bold text-ink">{t.label}</span>
                        <span className="block text-[12.5px] font-medium text-ink-soft">{t.description}</span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
