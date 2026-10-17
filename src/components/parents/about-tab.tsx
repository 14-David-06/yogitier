import { ChevronDown, Leaf, Mail, Quote, Sparkles, Sun, Users } from "lucide-react";
import Image from "next/image";

import logo from "@/assets/brand/logo.png";
import { faq, legalLinks, social, story, teacherProgram, values } from "@/content/brand";

const VALUE_ICONS = [Leaf, Users, Sun, Sparkles];
const VALUE_BG = ["#DCEBD0", "#FBE3E6", "#FBF1BE", "#E7E2F8"];

/** Über YOGITIER®: Geschichte, Werte, FAQ & Kontakt */
export function AboutTab() {
  return (
    <div className="px-5">
      <div className="mt-2 rounded-[26px] bg-cream p-5">
        <Image src={logo} alt="YOGITIER®" className="h-7 w-auto" />
        <h2 className="mt-4 text-[20px] font-bold leading-snug text-ink-strong">Unsere Story</h2>
        <div className="mt-2 grid gap-2.5">
          {story.paragraphs.map((p) => (
            <p key={p.slice(0, 20)} className="text-[14px] font-medium leading-relaxed text-ink">
              {p}
            </p>
          ))}
        </div>
        <figure className="mt-4 rounded-[20px] bg-white p-4">
          <Quote className="size-5 text-brand-orange" aria-hidden />
          <blockquote className="mt-1 text-[16px] font-bold leading-snug text-ink-strong">{story.quote}</blockquote>
          <figcaption className="mt-1 text-[12.5px] font-semibold text-ink-soft">– {story.founder}, Gründerin von YOGITIER®</figcaption>
        </figure>
      </div>

      <h2 className="mb-3 mt-7 text-[18px] font-bold text-ink">Unsere Werte</h2>
      <ul className="grid grid-cols-2 gap-3">
        {values.map((v, i) => {
          const Icon = VALUE_ICONS[i];
          return (
            <li key={v.title} className="rounded-[22px] p-3.5" style={{ background: VALUE_BG[i] }}>
              <Icon className="size-5 text-ink" aria-hidden />
              <p className="mt-2 text-[14px] font-bold leading-tight text-ink">{v.title}</p>
              <p className="mt-1 text-[12.5px] font-medium leading-snug text-ink">{v.text}</p>
            </li>
          );
        })}
      </ul>

      <p className="mt-5 text-[12.5px] font-bold uppercase tracking-wider text-ink-soft">Bekannt aus</p>
      <ul className="mt-2 flex flex-wrap gap-2">
        {story.knownFrom.map((k) => (
          <li key={k} className="rounded-full border border-line px-3 py-1 text-[12.5px] font-bold text-ink">
            {k}
          </li>
        ))}
      </ul>

      <h2 className="mb-3 mt-7 text-[18px] font-bold text-ink">Häufige Fragen</h2>
      <div className="divide-y divide-line rounded-[22px] ring-1 ring-line">
        {faq.map((f) => (
          <details key={f.q} className="group px-4 py-3.5">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-[14.5px] font-bold text-ink [&::-webkit-details-marker]:hidden">
              {f.q}
              <ChevronDown className="size-4 shrink-0 text-ink-soft transition group-open:rotate-180" aria-hidden />
            </summary>
            <p className="mt-2 text-[13.5px] font-medium leading-relaxed text-ink-soft">{f.a}</p>
          </details>
        ))}
      </div>

      <div className="mt-6 rounded-[24px] bg-tierfreunde p-4">
        <p className="text-[16px] font-bold text-ink">{teacherProgram.title}</p>
        <p className="mt-1 text-[13.5px] font-medium leading-relaxed text-ink">{teacherProgram.text}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          <a href={teacherProgram.url} target="_blank" rel="noopener noreferrer" className="rounded-full bg-ink px-4 py-2 text-[13px] font-bold text-white">
            Mehr erfahren
          </a>
          <a href={`mailto:${teacherProgram.email}`} className="inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-[13px] font-bold text-ink">
            <Mail className="size-4" aria-hidden /> {teacherProgram.email}
          </a>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        <a href={social.instagram} target="_blank" rel="noopener noreferrer" className="rounded-full bg-cream px-4 py-2 text-[13px] font-bold text-ink">
          Instagram
        </a>
        <a href={social.facebook} target="_blank" rel="noopener noreferrer" className="rounded-full bg-cream px-4 py-2 text-[13px] font-bold text-ink">
          Facebook
        </a>
      </div>
      <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-1">
        {legalLinks.map((l) => (
          <li key={l.label}>
            <a href={l.url} target="_blank" rel="noopener noreferrer" className="text-[12.5px] font-semibold text-ink-soft underline-offset-2 hover:underline">
              {l.label}
            </a>
          </li>
        ))}
      </ul>
      <p className="mt-4 text-[11.5px] font-medium text-ink-soft">YOGITIER® App · Interaktiver Prototyp v0.1 · Oktober 2026</p>
    </div>
  );
}
