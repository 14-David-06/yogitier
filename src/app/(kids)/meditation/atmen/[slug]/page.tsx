import { Clock, Repeat, Wind } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { BreathStart } from "@/components/meditation/breath-player";
import { PageHeader } from "@/components/ui/page-header";
import { Screen } from "@/components/ui/screen";
import { Pill, Section } from "@/components/ui/section";
import { DetailSkeleton } from "@/components/ui/skeleton";
import { SpeakButton } from "@/components/ui/speak-button";
import { animalsById } from "@/content/animals";
import { breathing, breathSeconds, getBreath } from "@/content/breathing";

export function generateStaticParams() {
  return breathing.map((b) => ({ slug: b.slug }));
}

export async function generateMetadata({ params }: PageProps<"/meditation/atmen/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const b = getBreath(slug);
  return b ? { title: b.title, description: b.description } : { title: "Atemübung" };
}

export default function BreathPage({ params }: PageProps<"/meditation/atmen/[slug]">) {
  return (
    <Screen>
      <Suspense fallback={<DetailSkeleton />}>
        <BreathDetail params={params} />
      </Suspense>
    </Screen>
  );
}

async function BreathDetail({ params }: { params: PageProps<"/meditation/atmen/[slug]">["params"] }) {
  const { slug } = await params;
  const b = getBreath(slug);
  if (!b) notFound();
  const host = animalsById[b.host];
  const { inhale, hold, exhale, rest } = b.pattern;
  const rhythm = [`${inhale} Sek. einatmen`, hold ? `${hold} Sek. halten` : null, `${exhale} Sek. ausatmen`, rest ? `${rest} Sek. Pause` : null].filter(Boolean);

  return (
    <>
      <PageHeader back="/meditation" background={b.color} />
      <div className="px-5 pb-10" style={{ background: b.color }}>
        <div className="flex items-center gap-4">
          <Image src={host.image} alt={host.fullName} className="h-[100px] w-[100px] shrink-0 object-contain animate-float" sizes="110px" loading="eager" />
          <div>
            <p className="text-[12.5px] font-bold uppercase tracking-wider text-ink-soft">mit {host.fullName}</p>
            <h1 className="mt-0.5 text-[28px] font-bold leading-tight text-ink-strong">{b.title}</h1>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <Pill>
            <Wind className="size-3.5" aria-hidden /> {b.purpose}
          </Pill>
          <Pill>
            <Clock className="size-3.5" aria-hidden /> ca. {Math.max(1, Math.round(breathSeconds(b) / 60))} Min.
          </Pill>
          <Pill>
            <Repeat className="size-3.5" aria-hidden /> {b.cycles} Atemzüge
          </Pill>
        </div>
      </div>

      <div className="relative -mt-6 rounded-t-[30px] bg-white pt-1">
        <section className="mx-5 mt-5 rounded-[24px] bg-cream p-4">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-[16px] font-bold text-ink">Worum geht&apos;s?</h2>
            <SpeakButton text={`${b.description} ${b.howTo.join(" ")}`} />
          </div>
          <p className="mt-2 text-[15px] font-medium leading-relaxed text-ink">{b.description}</p>
        </section>

        <Section title="So geht's">
          <ol className="flex flex-col gap-2.5">
            {b.howTo.map((s, i) => (
              <li key={i} className="flex gap-3">
                <span className="grid size-8 shrink-0 place-items-center rounded-full text-[14px] font-bold text-ink" style={{ background: b.color }}>
                  {i + 1}
                </span>
                <p className="pt-1 text-[15px] font-medium leading-snug text-ink">{s}</p>
              </li>
            ))}
          </ol>
        </Section>

        <Section title="Der Atem-Rhythmus">
          <div className="flex flex-wrap gap-2">
            {rhythm.map((r) => (
              <span key={r} className="rounded-full border border-line px-3 py-1.5 text-[13px] font-bold text-ink">
                {r}
              </span>
            ))}
          </div>
          <p className="mt-3 text-[13.5px] font-medium leading-relaxed text-ink-soft">
            Die Animation im Player zeigt dir, wann du ein- und ausatmest. Du musst nicht mitzählen – folge einfach dem Bild.
          </p>
        </Section>

        <section className="mx-5 mt-6 rounded-[24px] border border-dashed border-line p-4">
          <h2 className="text-[14px] font-bold text-ink">Tipp für Eltern</h2>
          <p className="mt-1 text-[13.5px] font-medium leading-relaxed text-ink-soft">
            Atmet gemeinsam: Kinder übernehmen ganz automatisch euren ruhigen Rhythmus. Bei großer Aufregung lieber erst ein paar Mal mit Bewegung
            (Löwe, Elefant) ausatmen und dann langsamer werden.
          </p>
        </section>

        <BreathStart slug={b.slug} />
      </div>
    </>
  );
}
