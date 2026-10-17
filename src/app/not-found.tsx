import Image from "next/image";

import { DeviceFrame } from "@/components/shell/device-frame";
import { AppLink } from "@/components/ui/app-link";
import { Screen } from "@/components/ui/screen";
import { animalsById } from "@/content/animals";

export default function NotFound() {
  return (
    <DeviceFrame>
      <Screen>
        <div className="flex min-h-full flex-col items-center justify-center px-8 pt-safe text-center">
          <Image src={animalsById.freddi.image} alt="" className="h-32 w-auto object-contain animate-wiggle" sizes="140px" />
          <h1 className="mt-6 text-[28px] font-bold text-ink-strong">Hoppla!</h1>
          <p className="mt-2 text-[15px] font-medium leading-relaxed text-ink-soft">
            Freddi hat überall geschnuppert, aber diese Seite gibt es leider nicht.
          </p>
          <AppLink href="/" direction="back" className="mt-8 flex h-14 w-full items-center justify-center rounded-[22px] bg-ink text-[17px] font-bold text-white">
            Zurück zum Menü
          </AppLink>
        </div>
      </Screen>
    </DeviceFrame>
  );
}
