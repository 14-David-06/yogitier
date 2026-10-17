import { Onboarding } from "@/components/onboarding/onboarding";
import { DeviceFrame } from "@/components/shell/device-frame";

/** Kinder-App: Vollbild auf dem Smartphone, Handy-Rahmen auf großen Bildschirmen. */
export default function KidsLayout({ children }: LayoutProps<"/">) {
  return (
    <DeviceFrame>
      {children}
      <Onboarding />
    </DeviceFrame>
  );
}
