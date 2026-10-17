import type { ReactNode } from "react";

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
          <DeviceChrome />
        </div>
      </div>
    </div>
  );
}
