import type { MetadataRoute } from "next";

/** Prototyp: nicht von Suchmaschinen indexieren lassen. Für den Livegang anpassen. */
export default function robots(): MetadataRoute.Robots {
  return { rules: [{ userAgent: "*", disallow: "/" }] };
}
