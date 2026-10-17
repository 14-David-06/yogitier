"use client";

import { Download, KeyRound, Save, ShieldCheck, Sparkles, Trash2, Upload } from "lucide-react";
import { useState } from "react";

import { exportJson, importJson, resetStudio, restoreExamples, saveSettings, useStudio } from "@/lib/studio/store";

import { Button, Card, Field, Input, PageTitle, Select } from "./ui";

export function SettingsPanel() {
  const studio = useStudio();
  const [badge, setBadge] = useState<string | null>(null);
  const [pin, setPin] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  const badgeValue = badge ?? studio.settings.specialBadge;
  const flash = (m: string) => {
    setMessage(m);
    window.setTimeout(() => setMessage(null), 3500);
  };

  const download = () => {
    const blob = new Blob([exportJson()], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `yogitier-studio-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  return (
    <div className="mx-auto max-w-[900px]">
      <PageTitle title="Einstellungen" subtitle="Was die Kinder auf dem Startbildschirm sehen, Zugang zum Studio und Datensicherung." />
      {message && <p className="mb-4 rounded-[14px] bg-[#DCEBD0] px-4 py-3 text-[14px] font-bold text-[#3E6B33]">{message}</p>}

      <div className="space-y-6">
        <Card title="Kachel „Besonderes“ im Menü" subtitle="Die Plakette auf der Kachel kündigt Neues an – z. B. eine Saison oder eine frische Lernwelt.">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Text der Plakette" hint="Leer lassen, um keine Plakette zu zeigen.">
              <Input value={badgeValue} onChange={(e) => setBadge(e.target.value)} maxLength={16} placeholder="z. B. Weihnachten, Neu!, Sommer" />
            </Field>
            <Field label="Hervorgehobene Lernwelt" hint="Steht ganz vorne unter „Besonderes“.">
              <Select value={studio.settings.featuredWorldId ?? ""} onChange={(e) => void saveSettings({ featuredWorldId: e.target.value || null })}>
                <option value="">Keine</option>
                {studio.worlds
                  .filter((w) => w.status === "veroeffentlicht")
                  .map((w) => (
                    <option key={w.id} value={w.id}>
                      {w.title}
                    </option>
                  ))}
              </Select>
            </Field>
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <Button
              variant="primary"
              onClick={async () => {
                await saveSettings({ specialBadge: badgeValue.trim() });
                setBadge(null);
                flash("Plakette gespeichert – sie ist sofort in der App sichtbar.");
              }}
            >
              <Save className="size-4" aria-hidden /> Speichern
            </Button>
            <span className="inline-flex items-center gap-2 text-[13px] font-semibold text-ink-soft">
              Vorschau:
              {badgeValue.trim() ? <span className="rounded-xl bg-lilac px-2.5 py-[3px] text-[11px] font-bold text-lilac-ink">{badgeValue}</span> : <span>keine Plakette</span>}
            </span>
          </div>
        </Card>

        <Card title="Zugang zum Studio" subtitle="Im Prototyp schützt eine PIN den Admin-Bereich. Im Livebetrieb: persönliche Konten mit Rollen.">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <Field label="Neue PIN (4–8 Ziffern)" className="flex-1">
              <Input type="password" inputMode="numeric" value={pin} onChange={(e) => setPin(e.target.value.replace(/\D/g, "").slice(0, 8))} placeholder="••••" />
            </Field>
            <Button
              variant="primary"
              disabled={pin.length < 4}
              onClick={async () => {
                await saveSettings({ adminPin: pin });
                setPin("");
                flash("PIN geändert.");
              }}
            >
              <KeyRound className="size-4" aria-hidden /> PIN ändern
            </Button>
          </div>
        </Card>

        <Card title="Daten sichern & übertragen" subtitle="Lernwelten und Einstellungen als Datei exportieren – z. B. um sie auf einem anderen Gerät zu importieren.">
          <div className="flex flex-wrap gap-2">
            <Button onClick={download} disabled={!studio.ready}>
              <Download className="size-4" aria-hidden /> Exportieren (JSON)
            </Button>
            <label className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-full bg-white px-4 text-[14px] font-bold text-ink ring-1 ring-line hover:bg-cream">
              <Upload className="size-4" aria-hidden /> Importieren
              <input
                type="file"
                accept="application/json,.json"
                className="sr-only"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  try {
                    const n = await importJson(await file.text());
                    flash(`${n} Lernwelt(en) importiert.`);
                  } catch (err) {
                    window.alert(err instanceof Error ? err.message : "Import fehlgeschlagen");
                  }
                  e.target.value = "";
                }}
              />
            </label>
          </div>
          <p className="mt-2 text-[12.5px] font-medium text-ink-soft">Hochgeladene Videos sind nicht in der Datei enthalten (Video-Links schon).</p>
        </Card>

        <Card title="Beispiele & Zurücksetzen">
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={async () => {
                await restoreExamples();
                flash("Beispiel-Lernwelten wiederhergestellt.");
              }}
            >
              <Sparkles className="size-4" aria-hidden /> Beispiel-Lernwelten wiederherstellen
            </Button>
            <Button
              variant="danger"
              onClick={async () => {
                if (!window.confirm("Studio komplett zurücksetzen? Alle eigenen Lernwelten und hochgeladenen Medien werden gelöscht.")) return;
                await resetStudio();
                flash("Studio zurückgesetzt.");
              }}
            >
              <Trash2 className="size-4" aria-hidden /> Studio zurücksetzen
            </Button>
          </div>
        </Card>

        <div className="flex gap-3 rounded-[20px] bg-white p-4 ring-1 ring-line">
          <ShieldCheck className="mt-0.5 size-5 shrink-0 text-brand-teal" aria-hidden />
          <p className="text-[13px] font-medium leading-relaxed text-ink">
            <b>Speicherort im Prototyp:</b> alles bleibt lokal in diesem Browser (IndexedDB) – ohne Server, ohne Tracking. Für den Livebetrieb ist die
            Datenschicht so gebaut, dass Uploads in die Cloud (z. B. Vercel Blob) und eine Datenbank angebunden werden können – inklusive mehrerer Admins.
          </p>
        </div>
      </div>
    </div>
  );
}
