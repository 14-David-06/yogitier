"use client";

import { BadgeCheck, CalendarDays, Check, ExternalLink, Languages, MapPin, Search, Send, Star } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

import { BottomSheet } from "@/components/ui/bottom-sheet";
import { ParentGateLink, ParentGatePanel, isParentUnlocked, newGateQuestion, type GateQuestion } from "@/components/ui/parent-gate";
import { animalsById } from "@/content/animals";
import { teacherProgram } from "@/content/brand";
import { DEMO_LOCATION, matchesLocation, offerLabel, teachers, type OfferType, type Teacher } from "@/content/teachers";
import { playSuccess } from "@/lib/audio";
import { cn } from "@/lib/cn";
import { addTeacherRequest, useAppState } from "@/lib/store";

const FILTERS: { id: OfferType | "alle"; label: string }[] = [
  { id: "alle", label: "Alle" },
  { id: "kurs", label: "Kurs" },
  { id: "probestunde", label: "Probestunde" },
  { id: "hausbesuch", label: "Hausbesuch" },
];

// Positionen auf der illustrierten Karte (nur Teilnehmende in der Nähe)
const PINS: Record<string, { x: number; y: number }> = {
  "lena-hoffmann": { x: 52, y: 62 },
  "sophie-kraemer": { x: 60, y: 40 },
  "miriam-yilmaz": { x: 34, y: 38 },
  "jonas-berger": { x: 22, y: 78 },
  "hannah-wolf": { x: 84, y: 40 },
};

function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2);
}

function Avatar({ t, size = 52 }: { t: Teacher; size?: number }) {
  return (
    <span className="relative inline-grid shrink-0 place-items-center rounded-full font-bold text-ink" style={{ width: size, height: size, background: t.color, fontSize: size * 0.34 }}>
      {initials(t.name)}
      <span className="absolute -bottom-1 -right-1 grid size-6 place-items-center rounded-full bg-white shadow-sm">
        <Image src={animalsById[t.animal].image} alt="" className="size-[18px] object-contain" sizes="18px" />
      </span>
    </span>
  );
}

function formatKm(km: number) {
  return km < 10 ? `${km.toLocaleString("de-DE", { maximumFractionDigits: 1 })} km` : `${Math.round(km)} km`;
}

export function TeacherFinder() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<OfferType | "alle">("alle");
  const [selected, setSelected] = useState<Teacher | null>(null);

  const results = teachers
    .filter((t) => matchesLocation(t, query))
    .filter((t) => filter === "alle" || t.offers.includes(filter))
    .sort((a, b) => a.distanceKm - b.distanceKm);

  return (
    <div className="pb-12">
      {/* Suche */}
      <div className="px-5 pt-4">
        <label className="flex h-14 items-center gap-3 rounded-[20px] bg-cream px-4 ring-1 ring-line focus-within:ring-2 focus-within:ring-lilac">
          <Search className="size-5 shrink-0 text-ink-soft" aria-hidden />
          <span className="sr-only">PLZ oder Ort</span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="PLZ oder Ort, z. B. 40225 oder Köln"
            inputMode="search"
            className="h-full w-full bg-transparent text-[15px] font-semibold text-ink outline-none placeholder:font-medium placeholder:text-ink-soft/70"
          />
        </label>
        <p className="mt-2 flex items-center gap-1.5 text-[12.5px] font-semibold text-ink-soft">
          <MapPin className="size-3.5" aria-hidden /> Dein Standort: {DEMO_LOCATION} (Demo)
        </p>
        <div className="no-scrollbar -mx-5 mt-3 flex gap-2 overflow-x-auto px-5" role="tablist" aria-label="Angebot filtern">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              role="tab"
              aria-selected={filter === f.id}
              onClick={() => setFilter(f.id)}
              className={cn("h-9 shrink-0 rounded-full px-4 text-[14px] font-bold transition", filter === f.id ? "bg-ink text-white" : "bg-white text-ink ring-1 ring-line")}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* illustrierte Karte */}
      {!query && (
        <div className="relative mx-5 mt-4 h-[168px] overflow-hidden rounded-[24px] bg-[#E6F0DC]" aria-label="Karte mit Kinderyogalehrenden in der Nähe">
          <svg viewBox="0 0 350 168" className="absolute inset-0 size-full" preserveAspectRatio="none" aria-hidden>
            <path d="M-10 30 C 60 40 90 10 150 40 S 230 120 360 100" stroke="#B9D8E8" strokeWidth="22" fill="none" strokeLinecap="round" />
            <path d="M0 140 L350 120" stroke="#fff" strokeWidth="6" opacity="0.8" />
            <path d="M120 0 L170 168" stroke="#fff" strokeWidth="5" opacity="0.8" />
            <path d="M250 0 L230 168" stroke="#fff" strokeWidth="4" opacity="0.7" />
            <rect x="196" y="58" width="54" height="34" rx="10" fill="#D7E8C9" />
            <circle cx="70" cy="110" r="18" fill="#D7E8C9" />
          </svg>
          <span className="absolute bottom-2 left-3 rounded-full bg-white/80 px-2 py-0.5 text-[10.5px] font-bold text-ink-soft">Rhein</span>
          <span className="absolute left-1/2 top-1/2 size-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-[3px] border-white bg-lilac shadow" aria-hidden />
          {teachers
            .filter((t) => PINS[t.id] && (filter === "alle" || t.offers.includes(filter)))
            .map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setSelected(t)}
                className="absolute -translate-x-1/2 -translate-y-full transition active:scale-95"
                style={{ left: `${PINS[t.id].x}%`, top: `${PINS[t.id].y}%` }}
                aria-label={`${t.name}, ${formatKm(t.distanceKm)} entfernt`}
              >
                <span className="flex items-center gap-1 whitespace-nowrap rounded-full bg-white py-1 pl-1 pr-2 text-[11px] font-bold text-ink shadow-md">
                  <span className="grid size-5 place-items-center rounded-full text-[9px]" style={{ background: t.color }}>
                    {initials(t.name)}
                  </span>
                  {formatKm(t.distanceKm)}
                </span>
                <span className="mx-auto block h-2 w-0.5 bg-white" />
              </button>
            ))}
        </div>
      )}

      {/* Ergebnisse */}
      <div className="mt-5 px-5">
        <p className="text-[13px] font-bold text-ink-soft">
          {results.length} {results.length === 1 ? "Kinderyogalehrende gefunden" : "Kinderyogalehrende gefunden"}
          {query ? ` für „${query}“` : " in deiner Nähe"}
        </p>
        <ul className="mt-3 flex flex-col gap-3">
          {results.map((t) => (
            <li key={t.id}>
              <button type="button" onClick={() => setSelected(t)} className="flex w-full gap-3 rounded-[24px] p-3.5 text-left ring-1 ring-line transition active:scale-[0.99]">
                <Avatar t={t} />
                <span className="min-w-0 flex-1">
                  <span className="flex items-start justify-between gap-2">
                    <span className="block text-[15.5px] font-bold leading-tight text-ink">{t.name}</span>
                    <span className="shrink-0 text-[12.5px] font-bold text-ink-soft">{formatKm(t.distanceKm)}</span>
                  </span>
                  <span className="block text-[12.5px] font-medium text-ink-soft">
                    {t.studio} · {t.city}-{t.district}
                  </span>
                  <span className="mt-1 flex items-center gap-1 text-[12.5px] font-bold text-ink">
                    <Star className="size-3.5 fill-brand-yellow text-brand-orange" aria-hidden /> {t.rating.toLocaleString("de-DE", { minimumFractionDigits: 1 })}
                    <span className="font-medium text-ink-soft">({t.reviews} Bewertungen)</span>
                  </span>
                  <span className="mt-2 flex flex-wrap gap-1.5">
                    {t.offers.map((o) => (
                      <span key={o} className="rounded-full bg-cream px-2.5 py-0.5 text-[11.5px] font-bold text-ink">
                        {offerLabel[o]}
                      </span>
                    ))}
                    {t.yogitierMats && (
                      <span className="rounded-full bg-tierfreunde px-2.5 py-0.5 text-[11.5px] font-bold text-ink">YOGITIER®-Matten</span>
                    )}
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ul>
        {results.length === 0 && (
          <p className="rounded-[22px] bg-cream p-4 text-[14px] font-medium text-ink-soft">
            Leider noch niemand in dieser Gegend. Probier es mit einer anderen PLZ – z. B. 40, 50, 10, 20 oder 80.
          </p>
        )}
      </div>

      <div className="mx-5 mt-7 rounded-[24px] bg-tierfreunde p-4">
        <p className="text-[16px] font-bold text-ink">{teacherProgram.title}</p>
        <p className="mt-1 text-[13.5px] font-medium leading-relaxed text-ink">{teacherProgram.text}</p>
        <ParentGateLink href={teacherProgram.url} className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-ink px-4 py-2 text-[13px] font-bold text-white active:scale-95">
          Mehr erfahren <ExternalLink className="size-3.5" aria-hidden />
        </ParentGateLink>
      </div>

      <p className="mx-5 mt-4 text-center text-[11.5px] font-medium leading-snug text-ink-soft">
        Beispielprofile für die Präsentation. In der finalen App erscheinen hier echte Kinderyogalehrende aus dem YOGITIER®-Netzwerk.
      </p>

      <TeacherSheet teacher={selected} onClose={() => setSelected(null)} />
    </div>
  );
}

function TeacherSheet({ teacher, onClose }: { teacher: Teacher | null; onClose: () => void }) {
  const { requests, profile } = useAppState();
  const [step, setStep] = useState<"info" | "gate" | "form" | "sent">("info");
  const [question, setQuestion] = useState<GateQuestion | null>(null);
  const [offer, setOffer] = useState<OfferType>("probestunde");

  const close = () => {
    setStep("info");
    onClose();
  };

  if (!teacher) return null;
  const alreadySent = requests.some((r) => r.teacherId === teacher.id);

  return (
    <BottomSheet open={!!teacher} onClose={close} title={teacher.name}>
      {step === "gate" && question ? (
        <ParentGatePanel
          question={question}
          onNewQuestion={() => setQuestion(newGateQuestion())}
          onSolved={() => setStep("form")}
          text="Anfragen an Kinderyogalehrende senden nur Erwachsene."
        />
      ) : step === "form" ? (
        <form
          className="px-6 pb-6 pt-2"
          onSubmit={(e) => {
            e.preventDefault();
            addTeacherRequest(teacher.id);
            playSuccess();
            setStep("sent");
          }}
        >
          <h2 className="text-[22px] font-bold text-ink-strong">Anfrage an {teacher.name.split(" ")[0]}</h2>
          <p className="mt-1 text-[13.5px] font-medium text-ink-soft">{teacher.studio}</p>
          <fieldset className="mt-4">
            <legend className="text-[13px] font-bold text-ink">Was interessiert euch?</legend>
            <div className="mt-2 flex flex-wrap gap-2">
              {teacher.offers.map((o) => (
                <button
                  key={o}
                  type="button"
                  onClick={() => setOffer(o)}
                  aria-pressed={offer === o}
                  className={cn("rounded-full px-3.5 py-1.5 text-[13px] font-bold", offer === o ? "bg-ink text-white" : "bg-cream text-ink ring-1 ring-line")}
                >
                  {offerLabel[o]}
                </button>
              ))}
            </div>
          </fieldset>
          <div className="mt-4 grid gap-3">
            <label className="block">
              <span className="text-[13px] font-bold text-ink">Dein Name</span>
              <input required autoComplete="name" className="mt-1 h-12 w-full rounded-[16px] border-2 border-line bg-cream px-4 text-[15px] font-semibold text-ink outline-none focus:border-lilac" />
            </label>
            <label className="block">
              <span className="text-[13px] font-bold text-ink">E-Mail</span>
              <input required type="email" autoComplete="email" className="mt-1 h-12 w-full rounded-[16px] border-2 border-line bg-cream px-4 text-[15px] font-semibold text-ink outline-none focus:border-lilac" />
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label className="block">
                <span className="text-[13px] font-bold text-ink">Vorname des Kindes</span>
                <input defaultValue={profile.name} className="mt-1 h-12 w-full rounded-[16px] border-2 border-line bg-cream px-4 text-[15px] font-semibold text-ink outline-none focus:border-lilac" />
              </label>
              <label className="block">
                <span className="text-[13px] font-bold text-ink">Alter</span>
                <input type="number" min={1} max={16} defaultValue={5} className="mt-1 h-12 w-full rounded-[16px] border-2 border-line bg-cream px-4 text-[15px] font-semibold text-ink outline-none focus:border-lilac" />
              </label>
            </div>
            <label className="block">
              <span className="text-[13px] font-bold text-ink">Nachricht (optional)</span>
              <textarea
                rows={3}
                defaultValue={`Hallo ${teacher.name.split(" ")[0]}, wir interessieren uns für eine ${offerLabel[offer]}. Wann wäre ein Termin frei?`}
                className="mt-1 w-full resize-none rounded-[16px] border-2 border-line bg-cream px-4 py-3 text-[14.5px] font-medium text-ink outline-none focus:border-lilac"
              />
            </label>
          </div>
          <button type="submit" className="mt-5 flex h-14 w-full items-center justify-center gap-2 rounded-[20px] bg-ink text-[16px] font-bold text-white active:scale-[0.98]">
            <Send className="size-5" aria-hidden /> Anfrage senden
          </button>
          <p className="mt-2 text-center text-[11.5px] font-medium text-ink-soft">Demo: Im Prototyp wird keine echte Nachricht verschickt.</p>
        </form>
      ) : step === "sent" ? (
        <div className="px-6 pb-8 pt-4 text-center">
          <span className="mx-auto grid size-16 place-items-center rounded-full bg-tierfreunde animate-pop">
            <Check className="size-8 text-ink" strokeWidth={3} aria-hidden />
          </span>
          <h2 className="mt-4 text-[24px] font-bold text-ink-strong">Anfrage gesendet!</h2>
          <p className="mt-2 text-[15px] font-medium leading-relaxed text-ink">
            {teacher.name.split(" ")[0]} meldet sich in der Regel innerhalb von 1–2 Tagen bei euch.
          </p>
          <button type="button" onClick={close} className="mt-6 h-12 w-full rounded-[18px] bg-ink text-[15px] font-bold text-white">
            Fertig
          </button>
        </div>
      ) : (
        <div className="px-6 pb-6 pt-2">
          <div className="flex items-center gap-4">
            <Avatar t={teacher} size={68} />
            <div className="min-w-0">
              <h2 className="text-[22px] font-bold leading-tight text-ink-strong">{teacher.name}</h2>
              <p className="text-[13px] font-semibold text-ink-soft">{teacher.role}</p>
              <p className="mt-0.5 flex items-center gap-1 text-[13px] font-bold text-ink">
                <Star className="size-3.5 fill-brand-yellow text-brand-orange" aria-hidden /> {teacher.rating.toLocaleString("de-DE", { minimumFractionDigits: 1 })} · {teacher.reviews} Bewertungen
              </p>
            </div>
          </div>
          <p className="mt-4 text-[14.5px] font-medium leading-relaxed text-ink">{teacher.bio}</p>

          <dl className="mt-4 grid gap-2.5 rounded-[20px] bg-cream p-4 text-[13.5px]">
            <div className="flex gap-2.5">
              <MapPin className="mt-0.5 size-4 shrink-0 text-ink-soft" aria-hidden />
              <dd className="font-semibold text-ink">
                {teacher.studio} · {teacher.plz} {teacher.city}-{teacher.district} · {formatKm(teacher.distanceKm)}
              </dd>
            </div>
            <div className="flex gap-2.5">
              <CalendarDays className="mt-0.5 size-4 shrink-0 text-ink-soft" aria-hidden />
              <dd className="font-semibold text-ink">{teacher.slots.join(" · ")}</dd>
            </div>
            <div className="flex gap-2.5">
              <Languages className="mt-0.5 size-4 shrink-0 text-ink-soft" aria-hidden />
              <dd className="font-semibold text-ink">
                {teacher.languages.join(", ")} · {teacher.ages}
              </dd>
            </div>
            <div className="flex gap-2.5">
              <BadgeCheck className="mt-0.5 size-4 shrink-0 text-ink-soft" aria-hidden />
              <dd className="font-semibold text-ink">{teacher.qualification}</dd>
            </div>
          </dl>

          <h3 className="mt-4 text-[14px] font-bold text-ink">Angebote & Preise</h3>
          <ul className="mt-1.5 grid gap-1">
            {teacher.prices.map((p) => (
              <li key={p} className="text-[13.5px] font-medium text-ink">
                • {p}
              </li>
            ))}
          </ul>

          {alreadySent ? (
            <p className="mt-5 rounded-[18px] bg-tierfreunde p-3 text-center text-[14px] font-bold text-ink">✓ Ihr habt bereits eine Anfrage gesendet.</p>
          ) : (
            <button
              type="button"
              onClick={() => {
                if (isParentUnlocked()) setStep("form");
                else {
                  setQuestion(newGateQuestion());
                  setStep("gate");
                }
              }}
              className="mt-5 flex h-14 w-full items-center justify-center gap-2 rounded-[20px] bg-ink text-[16px] font-bold text-white shadow-lg shadow-ink/20 active:scale-[0.98]"
            >
              <Send className="size-5" aria-hidden /> Anfrage senden
            </button>
          )}
        </div>
      )}
    </BottomSheet>
  );
}
