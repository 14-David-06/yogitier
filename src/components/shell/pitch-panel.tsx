import { ArrowRight, BookHeart, Clapperboard, Globe, LayoutGrid, Lock, MapPin, PawPrint, PersonStanding, Wind } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import logo from "@/assets/brand/logo.png";
import { EmmiPitchButton } from "@/components/guide/pitch-button";
import { animalsById } from "@/content/animals";

const FEATURES = [
  { icon: PersonStanding, title: "Yoga-Stunden", text: "8 geführte Stunden & 23 Tier-Übungen", bg: "#EFE2D4" },
  { icon: Wind, title: "Atmen & Träumen", text: "Atemübungen & Fantasiereisen mit Vorlesestimme", bg: "#E7E2F8" },
  { icon: PawPrint, title: "Tierfreunde", text: "Die YOGITIER-Bande mit Mutmacher-Sätzen", bg: "#FBEBC4" },
  { icon: LayoutGrid, title: "Affirmation-Memo", text: "Das beliebte Memo – jetzt digital", bg: "#FBF1BE" },
  { icon: BookHeart, title: "Gefühle-Tagebuch", text: "Stimmung, Dankbarkeit & Malen", bg: "#E8E8F0" },
  { icon: Globe, title: "Lernwelten", text: "Videos, Quiz & Missionen für gesunde Gewohnheiten", bg: "#FBE3E6" },
  { icon: MapPin, title: "Yogalehrerin finden", text: "Kurse, Probestunden & Hausbesuche", bg: "#DCEBD0" },
  { icon: Lock, title: "Eltern-Bereich", text: "Fortschritt, Tipps & Shop – geschützt", bg: "#E3EAF2" },
];

const TRUST = ["Ohne Werbung", "Daten bleiben auf dem Gerät", "Eltern-Gate", "Als App installierbar"];

/** Präsentationsfläche neben dem Handy (nur auf großen Bildschirmen). */
export function PitchPanel() {
  return (
    <aside className="no-scrollbar hidden max-h-[calc(100dvh-48px)] w-full max-w-[520px] flex-col overflow-y-auto py-2 lg:flex">
      <Image src={logo} alt="YOGITIER®" className="h-11 w-auto self-start short:h-9" loading="eager" />
      <span className="mt-8 short:mt-5 inline-flex w-fit items-center gap-2 rounded-full bg-white/80 px-3.5 py-1.5 text-[13px] font-bold text-lilac-ink ring-1 ring-line">
        <span className="size-2 rounded-full bg-lilac" />
        Interaktiver App-Prototyp
      </span>
      <h1 className="mt-4 text-[44px] font-bold leading-[1.08] tracking-tight text-ink-strong xl:text-[50px] short:mt-3 short:text-[36px] short:xl:text-[38px]">
        Kleine Auszeiten
        <br />
        für große Gefühle.
      </h1>
      <p className="mt-4 max-w-[460px] text-[17px] font-medium leading-relaxed text-ink-soft short:mt-3 short:text-[15px]">
        Die YOGITIER® App bringt Yoga, Achtsamkeit und liebevolle Rituale in den Familienalltag – spielerisch begleitet von Leo, Emmi,
        Benno und der ganzen Bande.
      </p>

      <ul className="mt-8 grid grid-cols-2 gap-3 short:mt-5 short:gap-2">
        {FEATURES.map(({ icon: Icon, title, text, bg }) => (
          <li key={title} className="flex gap-3 rounded-2xl bg-white/75 p-3 ring-1 ring-line/70 short:p-2.5">
            <span className="grid size-10 shrink-0 place-items-center rounded-xl" style={{ background: bg }}>
              <Icon className="size-5 text-ink" strokeWidth={1.8} aria-hidden />
            </span>
            <span className="min-w-0">
              <span className="block text-[14px] font-bold text-ink">{title}</span>
              <span className="block text-[12.5px] font-medium leading-snug text-ink-soft tiny:hidden">{text}</span>
            </span>
          </li>
        ))}
      </ul>

      <EmmiPitchButton />

      <Link
        href="/admin"
        className="group mt-2 flex items-center gap-3 rounded-2xl bg-ink p-3 text-white shadow-lg shadow-ink/20 transition hover:bg-ink-strong short:mt-2"
      >
        <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-white/15">
          <Clapperboard className="size-5" strokeWidth={1.8} aria-hidden />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-[14px] font-bold">Neu: YOGITIER® Studio für Admins</span>
          <span className="block text-[12.5px] font-medium leading-snug text-white/80 tiny:hidden">
            Anleitungsvideos hochladen, Lernwelten gestalten und mit einem Klick veröffentlichen
          </span>
        </span>
        <ArrowRight className="size-5 shrink-0 transition group-hover:translate-x-0.5" aria-hidden />
      </Link>

      <ul className="mt-6 flex flex-wrap gap-2 short:mt-4">
        {TRUST.map((t) => (
          <li key={t} className="rounded-full border border-line bg-cream px-3 py-1 text-[12.5px] font-semibold text-ink-soft">
            ✓ {t}
          </li>
        ))}
      </ul>

      <p className="mt-6 text-[13px] font-medium text-ink-soft/80 short:hidden">
        Tipp: Probier die App direkt im Handy-Rahmen aus – oder öffne sie auf dem Smartphone und füge sie zum Home-Bildschirm hinzu.
      </p>
    </aside>
  );
}

/** schwebende Tierköpfe als Deko rund um das Handy */
export function StageDecor() {
  const items = [
    { id: "emmi" as const, className: "left-[6%] top-[10%] w-20 rotate-[-8deg]", delay: "0s" },
    { id: "diego" as const, className: "bottom-[8%] left-[4%] w-24 rotate-[6deg]", delay: "1.2s" },
    { id: "benno" as const, className: "right-[5%] top-[12%] w-24 rotate-[8deg]", delay: "0.6s" },
    { id: "freddi" as const, className: "bottom-[10%] right-[6%] w-20 rotate-[-6deg]", delay: "1.8s" },
  ];
  return (
    <div className="pointer-events-none absolute inset-0 hidden overflow-hidden xl:block" aria-hidden>
      {items.map((it) => (
        <div key={it.id} className={`absolute opacity-90 ${it.className}`}>
          <Image src={animalsById[it.id].image} alt="" className="h-auto w-full animate-float" style={{ animationDelay: it.delay }} sizes="96px" />
        </div>
      ))}
    </div>
  );
}
