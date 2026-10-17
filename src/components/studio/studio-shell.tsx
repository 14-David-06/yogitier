"use client";

import { Clapperboard, Globe, KeyRound, LayoutDashboard, LogOut, Settings, Smartphone } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense, useState, useSyncExternalStore, type ReactNode } from "react";

import logo from "@/assets/brand/logo.png";
import { Guide } from "@/components/guide/guide";
import { animalsById } from "@/content/animals";
import { cn } from "@/lib/cn";
import { useStudio } from "@/lib/studio/store";

import { Button, Input } from "./ui";

const AUTH_KEY = "yogitier-studio-auth";
const AUTH_EVENT = "yogitier-studio-auth";

function subscribeAuth(cb: () => void) {
  window.addEventListener(AUTH_EVENT, cb);
  window.addEventListener("storage", cb);
  return () => {
    window.removeEventListener(AUTH_EVENT, cb);
    window.removeEventListener("storage", cb);
  };
}

function readAuth() {
  try {
    return window.sessionStorage.getItem(AUTH_KEY) === "1";
  } catch {
    return false;
  }
}

function setAuth(on: boolean) {
  try {
    if (on) window.sessionStorage.setItem(AUTH_KEY, "1");
    else window.sessionStorage.removeItem(AUTH_KEY);
  } catch {
    // Speicher blockiert – Sitzung gilt nur bis zum Neuladen
  }
  window.dispatchEvent(new Event(AUTH_EVENT));
}

const NAV = [
  { href: "/admin", label: "Übersicht", icon: LayoutDashboard },
  { href: "/admin/welten", label: "Lernwelten", icon: Globe },
  { href: "/admin/medien", label: "Medien", icon: Clapperboard },
  { href: "/admin/einstellungen", label: "Einstellungen", icon: Settings },
];

function NavLinks({ active }: { active?: string }) {
  return (
    <>
      {NAV.map(({ href, label, icon: Icon }) => {
        const on = active !== undefined && (href === "/admin" ? active === "/admin" : active.startsWith(href));
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex h-11 shrink-0 items-center gap-3 rounded-[14px] px-3.5 text-[14.5px] font-bold transition",
              on ? "bg-ink text-white" : "text-ink hover:bg-cream",
            )}
          >
            <Icon className="size-[18px]" strokeWidth={1.9} aria-hidden /> {label}
          </Link>
        );
      })}
    </>
  );
}

function ActiveNav() {
  const pathname = usePathname();
  return <NavLinks active={pathname} />;
}

function Login() {
  const studio = useStudio();
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);
  return (
    <div className="flex min-h-dvh items-center justify-center bg-cream px-5 py-10">
      <form
        className="w-full max-w-[400px] rounded-[30px] bg-white p-8 text-center shadow-[0_30px_60px_-30px_rgb(90_50_24/0.35)] ring-1 ring-line"
        onSubmit={(e) => {
          e.preventDefault();
          if (pin === studio.settings.adminPin) setAuth(true);
          else {
            setError(true);
            setPin("");
          }
        }}
      >
        <Image src={logo} alt="YOGITIER®" className="mx-auto h-8 w-auto" loading="eager" />
        <p className="mt-2 text-[13px] font-bold uppercase tracking-[0.18em] text-lilac-ink">Studio</p>
        <div className="mx-auto mt-6 flex w-fit -space-x-3">
          {(["emmi", "leo", "benno"] as const).map((id) => (
            <span key={id} className="grid grid-cols-1 size-14 place-items-center rounded-full bg-cream ring-4 ring-white">
              <Image src={animalsById[id].image} alt="" className="size-10 object-contain" sizes="40px" />
            </span>
          ))}
        </div>
        <h1 className="mt-5 text-[24px] font-bold text-ink-strong">Anmeldung für Admins</h1>
        <p className="mt-1 text-[14px] font-medium text-ink-soft">Hier gestaltet ihr Lernwelten und ladet Anleitungsvideos hoch.</p>
        <label className="mt-6 block text-left">
          <span className="text-[13px] font-bold text-ink">Admin-PIN</span>
          <Input
            type="password"
            inputMode="numeric"
            autoComplete="current-password"
            value={pin}
            onChange={(e) => {
              setPin(e.target.value);
              setError(false);
            }}
            placeholder="••••"
            className="mt-1.5 h-12 text-center text-[20px] tracking-[0.4em]"
            aria-invalid={error}
          />
        </label>
        {error && <p className="mt-2 text-[13px] font-bold text-[#A23B1E]">Falsche PIN – bitte noch einmal.</p>}
        <Button type="submit" variant="primary" className="mt-5 h-12 w-full text-[15px]" disabled={!studio.ready}>
          <KeyRound className="size-4" aria-hidden /> Anmelden
        </Button>
        <p className="mt-4 rounded-[14px] bg-cream px-3 py-2 text-[12.5px] font-semibold text-ink-soft">Prototyp: Standard-PIN 1234 – änderbar in den Einstellungen</p>
        <Link href="/" className="mt-4 inline-block text-[13px] font-bold text-ink-soft underline-offset-2 hover:underline">
          Zurück zur App
        </Link>
      </form>
    </div>
  );
}

/** Rahmen des YOGITIER® Studios: Anmeldung, Navigation und Inhalt */
export function StudioShell({ children }: { children: ReactNode }) {
  const authed = useSyncExternalStore(subscribeAuth, readAuth, () => null);
  const locked = authed !== true;

  // Der Inhalt wird immer gerendert (bei fehlender Anmeldung verborgen & inaktiv),
  // damit Next.js die Seiten vorab rendern und prüfen kann.
  return (
    <>
      {authed === null ? <div className="min-h-dvh bg-cream" aria-busy="true" /> : authed === false ? <Login /> : null}
      <div hidden={locked} inert={locked}>
        <div className="min-h-dvh bg-cream lg:flex">
          <aside className="sticky top-0 z-30 flex shrink-0 flex-col border-b border-line bg-white/95 backdrop-blur lg:h-dvh lg:w-[248px] lg:border-b-0 lg:border-r">
            <div className="flex items-center gap-2 px-5 py-4 lg:py-6">
              <Image src={logo} alt="YOGITIER®" className="h-7 w-auto" loading="eager" />
              <span className="rounded-full bg-meditation px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider text-lilac-ink">Studio</span>
            </div>
            <nav aria-label="Studio" data-tour="studio-nav" className="no-scrollbar flex gap-1 overflow-x-auto px-3 pb-3 lg:flex-1 lg:flex-col lg:overflow-visible lg:pb-0">
              <Suspense fallback={<NavLinks />}>
                <ActiveNav />
              </Suspense>
            </nav>
            <div className="hidden flex-col gap-1 border-t border-line p-3 lg:flex">
              <Link href="/" target="_blank" className="flex h-11 items-center gap-3 rounded-[14px] px-3.5 text-[14px] font-bold text-ink hover:bg-cream">
                <Smartphone className="size-[18px]" strokeWidth={1.9} aria-hidden /> App öffnen
              </Link>
              <button type="button" onClick={() => setAuth(false)} className="flex h-11 items-center gap-3 rounded-[14px] px-3.5 text-[14px] font-bold text-ink-soft hover:bg-cream">
                <LogOut className="size-[18px]" strokeWidth={1.9} aria-hidden /> Abmelden
              </button>
            </div>
          </aside>
          <main className="min-w-0 flex-1 px-5 py-6 sm:px-8 lg:py-10">{children}</main>
        </div>
        <Guide area="studio" enabled={authed === true} />
      </div>
    </>
  );
}
