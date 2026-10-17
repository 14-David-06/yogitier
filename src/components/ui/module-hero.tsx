import Image, { type StaticImageData } from "next/image";
import { ViewTransition, type ReactNode } from "react";

/** Farbiger Kopfbereich der Hauptbereiche – das Tier „fliegt“ aus der Menü-Kachel hierher. */
export function ModuleHero({
  title,
  text,
  image,
  color,
  vt,
  children,
}: {
  title: string;
  text: string;
  image: StaticImageData;
  color: string;
  vt?: string;
  children?: ReactNode;
}) {
  const img = <Image src={image} alt="" className="h-[96px] w-auto max-w-[120px] object-contain" sizes="120px" loading="eager" />;
  return (
    <div className="px-5 pb-10 pt-1" style={{ background: color }}>
      <div className="flex items-center gap-4">
        <div className="grid h-[104px] w-[112px] shrink-0 place-items-center">
          {vt ? (
            <ViewTransition name={vt} share="morph" default="none">
              {img}
            </ViewTransition>
          ) : (
            img
          )}
        </div>
        <div className="min-w-0">
          <h1 className="text-[30px] font-bold leading-tight text-ink-strong">{title}</h1>
          <p className="mt-1 text-[14px] font-medium leading-snug text-ink">{text}</p>
        </div>
      </div>
      {children}
    </div>
  );
}

/** weiße Inhaltsfläche, die sich mit runden Ecken über den Hero schiebt */
export function Sheet({ children }: { children: ReactNode }) {
  return <div className="relative -mt-6 min-h-[50%] rounded-t-[30px] bg-white pb-12 pt-1">{children}</div>;
}
