import { ViewTransition, type CSSProperties, type ReactNode } from "react";

import { cn } from "@/lib/cn";

const DIRECTIONAL = { "nav-forward": "nav-forward", "nav-back": "nav-back", default: "none" };

/**
 * Eine App-Seite. Jede Seite scrollt in ihrem eigenen Container und
 * gleitet bei Navigationen seitlich hinein bzw. heraus.
 */
export function Screen({
  children,
  className,
  background = "#FFFFFF",
  style,
}: {
  children: ReactNode;
  className?: string;
  background?: string;
  style?: CSSProperties;
}) {
  return (
    <ViewTransition enter={DIRECTIONAL} exit={DIRECTIONAL} default="none">
      <main className={cn("screen", className)} style={{ background, ...style }}>
        {children}
      </main>
    </ViewTransition>
  );
}
