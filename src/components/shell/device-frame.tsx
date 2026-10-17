import type { ReactNode } from "react";

import { Guide } from "@/components/guide/guide";

import { DeviceChrome } from "./device-chrome";
import { PitchPanel, StageDecor } from "./pitch-panel";

/**
 * Auf dem Smartphone läuft die App im Vollbild. Auf Tablet/Desktop wird sie
 * für Präsentationen in einem Handy-Rahmen mit Infotafel dargestellt.
 */
export function DeviceFrame({ children }: { children: ReactNode }) {
  return (
    <div className="stage relative">
      <StageDecor />
      <PitchPanel />
      <div className="device">
        <div id="app-screen" className="app-screen">
          {children}
          <Guide area="kids" />
          <DeviceChrome />
        </div>
      </div>
    </div>
  );
}
