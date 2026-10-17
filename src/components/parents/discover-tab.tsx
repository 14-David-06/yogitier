import { ArrowUpRight, Download, Gift, Newspaper, ShoppingBag, Truck } from "lucide-react";
import Image from "next/image";
import type { ReactNode } from "react";

import { animals, animalsById } from "@/content/animals";
import { blogPosts, downloads, parentTips, shop } from "@/content/brand";

function Ext({ href, className, children }: { href: string; className?: string; children: ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
      {children}
    </a>
  );
}

function Heading({ icon, title, subtitle }: { icon: ReactNode; title: string; subtitle?: string }) {
  return (
    <div className="mb-3 mt-7 flex items-start gap-2.5">
      <span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-full bg-cream text-ink">{icon}</span>
      <div>
        <h2 className="text-[18px] font-bold leading-tight text-ink">{title}</h2>
        {subtitle && <p className="text-[12.5px] font-medium text-ink-soft">{subtitle}</p>}
      </div>
    </div>
  );
}

/** Eltern-Kompass, Shop, Gratis-Downloads und Blog – Inhalte von yogitier.de */
export function DiscoverTab() {
  const kompass = downloads[0];
  const matAnimals = animals.filter((a) => a.mat);

  return (
    <div className="px-5">
      {/* Eltern-Kompass */}
      <div className="mt-2 rounded-[26px] bg-tierfreunde p-4">
        <p className="text-[12px] font-bold uppercase tracking-wider text-ink-soft">YOGITIER® Eltern-Kompass</p>
        <p className="mt-1 text-[19px] font-bold leading-snug text-ink-strong">Dein Fahrplan für weniger Stress und mehr Verbindung.</p>
        <ul className="mt-3 grid gap-2.5">
          {parentTips.map((t, i) => (
            <li key={t.title} className="flex gap-3 rounded-[18px] bg-white/80 p-3">
              <span className="grid size-7 shrink-0 place-items-center rounded-full bg-ink text-[13px] font-bold text-white">{i + 1}</span>
              <span>
                <span className="block text-[14px] font-bold text-ink">{t.title}</span>
                <span className="mt-0.5 block text-[13px] font-medium leading-relaxed text-ink">{t.text}</span>
              </span>
            </li>
          ))}
        </ul>
        <Ext href={kompass.url} className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-ink px-4 py-2 text-[13px] font-bold text-white">
          <Download className="size-4" aria-hidden /> Eltern-Kompass als PDF
        </Ext>
      </div>

      {/* Shop */}
      <Heading icon={<ShoppingBag className="size-4" aria-hidden />} title={shop.mats.title} subtitle={shop.mats.subtitle} />
      <div className="no-scrollbar -mx-5 flex gap-3 overflow-x-auto px-5 pb-1">
        {matAnimals.map((a) => (
          <Ext key={a.id} href={a.mat!.url} className="w-[118px] shrink-0">
            <span className="relative block h-[150px] w-full overflow-hidden rounded-[20px] shadow-[0_8px_18px_-10px_rgb(90_50_24/0.45)]" style={{ background: a.color }}>
              <span className="absolute inset-x-0 top-0 h-5 bg-white/25" />
              <Image src={a.image} alt="" className="absolute left-1/2 top-1/2 h-[62px] w-auto -translate-x-1/2 -translate-y-1/2 object-contain" sizes="70px" />
              <span className="absolute inset-x-4 bottom-3 h-1 rounded-full bg-white/50" />
            </span>
            <span className="mt-2 block text-[13px] font-bold leading-tight text-ink">{a.fullName}</span>
            <span className="block text-[12.5px] font-semibold text-ink-soft">{a.mat!.price}</span>
          </Ext>
        ))}
      </div>
      <ul className="mt-3 flex flex-wrap gap-1.5">
        {shop.mats.facts.map((f) => (
          <li key={f} className="rounded-full bg-cream px-2.5 py-1 text-[12px] font-bold text-ink">
            {f}
          </li>
        ))}
      </ul>

      <h3 className="mt-6 text-[15px] font-bold text-ink">Spiele & Tools</h3>
      <ul className="mt-2 divide-y divide-line rounded-[20px] ring-1 ring-line">
        {shop.accessories.map((p) => (
          <li key={p.title}>
            <Ext href={p.url} className="flex items-center gap-3 px-3.5 py-3">
              <span className="grid size-11 shrink-0 place-items-center rounded-[14px]" style={{ background: animalsById[p.animal].soft }}>
                <Image src={animalsById[p.animal].image} alt="" className="size-8 object-contain" sizes="32px" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[14px] font-bold text-ink">{p.title}</span>
                <span className="block truncate text-[12px] font-medium text-ink-soft">{p.subtitle}</span>
              </span>
              <span className="text-right">
                <span className="block text-[13.5px] font-bold text-ink">{p.price}</span>
                {"oldPrice" in p && p.oldPrice && <span className="block text-[11.5px] font-semibold text-ink-soft line-through">{p.oldPrice}</span>}
              </span>
            </Ext>
          </li>
        ))}
      </ul>

      <h3 className="mt-6 text-[15px] font-bold text-ink">Ruheinsel-Bundles</h3>
      <p className="text-[12.5px] font-medium text-ink-soft">Für dein Kind, für euch als Familie oder für Kitas und Einrichtungen.</p>
      <div className="mt-2 grid gap-2">
        {shop.bundles.map((b, i) => (
          <Ext key={b.title} href={b.url} className="flex items-center gap-3 rounded-[20px] p-3.5 ring-1 ring-line">
            <span className="grid size-11 shrink-0 place-items-center rounded-full" style={{ background: ["#E7E2F8", "#FBEBC4", "#DCEBD0"][i] }}>
              <Gift className="size-5 text-ink" aria-hidden />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-[14px] font-bold text-ink">{b.title}</span>
              <span className="block text-[12px] font-medium text-ink-soft">{b.subtitle}</span>
            </span>
            {"price" in b && b.price ? (
              <span className="text-right">
                <span className="block text-[13.5px] font-bold text-ink">{b.price}</span>
                <span className="block text-[11.5px] font-semibold text-ink-soft line-through">{b.oldPrice}</span>
              </span>
            ) : (
              <ArrowUpRight className="size-4 text-ink-soft" aria-hidden />
            )}
          </Ext>
        ))}
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 rounded-[18px] bg-cream px-4 py-3 text-[12.5px] font-bold text-ink">
        <Truck className="size-4 text-ink-soft" aria-hidden />
        {shop.perks.join(" · ")}
      </div>
      <Ext href={shop.voucher.url} className="mt-2 flex items-center justify-between rounded-[18px] bg-besonderes px-4 py-3 text-[14px] font-bold text-ink">
        <span className="inline-flex items-center gap-2">
          <Gift className="size-4" aria-hidden /> {shop.voucher.title}
        </span>
        <ArrowUpRight className="size-4" aria-hidden />
      </Ext>
      <p className="mt-2 text-[11px] font-medium text-ink-soft">Preise laut yogitier.de, Stand Oktober 2026.</p>

      {/* Downloads */}
      <Heading icon={<Download className="size-4" aria-hidden />} title="Gratis-Downloads" subtitle="Zum Ausdrucken, Basteln und Spielen" />
      <ul className="grid gap-2">
        {downloads.map((d) => (
          <li key={d.title}>
            <Ext href={d.url} className="flex items-center gap-3 rounded-[20px] bg-cream p-3">
              <Image src={animalsById[d.animal].image} alt="" className="size-10 shrink-0 object-contain" sizes="40px" />
              <span className="min-w-0 flex-1">
                <span className="block text-[14px] font-bold text-ink">{d.title}</span>
                <span className="block text-[12px] font-medium leading-snug text-ink-soft">{d.text}</span>
              </span>
              <span className="shrink-0 rounded-full bg-white px-2 py-0.5 text-[11px] font-bold text-ink-soft">{d.format}</span>
            </Ext>
          </li>
        ))}
      </ul>

      {/* Blog */}
      <Heading icon={<Newspaper className="size-4" aria-hidden />} title="Wissen aus dem Blog" subtitle="Aktuelle Artikel auf yogitier.de" />
      <ul className="grid gap-2.5">
        {blogPosts.map((p) => (
          <li key={p.url}>
            <Ext href={p.url} className="block rounded-[20px] p-3.5 ring-1 ring-line">
              <span className="block text-[11.5px] font-bold uppercase tracking-wider text-ink-soft">{p.date}</span>
              <span className="mt-1 block text-[14.5px] font-bold leading-snug text-ink">{p.title}</span>
              <span className="mt-1 block text-[12.5px] font-medium leading-relaxed text-ink-soft">{p.excerpt}</span>
            </Ext>
          </li>
        ))}
      </ul>
    </div>
  );
}
