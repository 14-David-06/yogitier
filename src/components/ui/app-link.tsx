import Link from "next/link";
import type { ComponentProps } from "react";

type AppLinkProps = Omit<ComponentProps<typeof Link>, "transitionTypes"> & {
  /** Richtung der Seitenanimation: tiefer in die App (forward) oder zurück (back) */
  direction?: "forward" | "back" | "none";
};

/**
 * Link mit nativer Seiten-Animation (View Transitions) und vollständigem
 * Prefetch – Navigationen fühlen sich dadurch an wie in einer echten App.
 */
export function AppLink({ direction = "forward", prefetch = true, ...props }: AppLinkProps) {
  return (
    <Link
      prefetch={prefetch}
      transitionTypes={direction === "none" ? undefined : [direction === "forward" ? "nav-forward" : "nav-back"]}
      {...props}
    />
  );
}
