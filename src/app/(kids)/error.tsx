"use client";

import Image from "next/image";

import { animalsById } from "@/content/animals";

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="screen bg-white">
      <div className="flex min-h-full flex-col items-center justify-center px-8 pt-safe text-center">
        <Image src={animalsById.benno.image} alt="" className="h-28 w-auto object-contain" sizes="120px" />
        <h1 className="mt-6 text-[26px] font-bold text-ink-strong">Da ist etwas schiefgelaufen</h1>
        <p className="mt-2 text-[15px] font-medium leading-relaxed text-ink-soft">Kein Problem – atme einmal tief durch und versuch es noch einmal.</p>
        <button type="button" onClick={reset} className="mt-8 h-14 w-full rounded-[22px] bg-ink text-[17px] font-bold text-white">
          Nochmal versuchen
        </button>
      </div>
    </main>
  );
}
