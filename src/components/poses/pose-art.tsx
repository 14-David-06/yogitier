import Image from "next/image";

import type { Pose } from "@/content/types";
import { cn } from "@/lib/cn";

import { KidFigure } from "./kid-figure";

/** Zeigt die Illustration einer Übung – Original-Illustration oder SVG-Figur. */
export function PoseArtView({ pose, className, sizes = "220px", eager }: { pose: Pose; className?: string; sizes?: string; eager?: boolean }) {
  if (pose.art.kind === "image") {
    return (
      <Image
        src={pose.art.src}
        alt={pose.name}
        className={cn("h-full w-full object-contain", className)}
        sizes={sizes}
        loading={eager ? "eager" : undefined}
      />
    );
  }
  return <KidFigure figure={pose.art.figure} title={pose.name} className={cn("h-full w-full", className)} />;
}
