// Ersatz für `next/image` in der HTML-Version: ein normales <img> (ohne Bild-Server).
import type { CSSProperties, ImgHTMLAttributes } from "react";

import { toFileHref } from "../runtime/router";

type StaticImage = { src: string; width: number; height: number };

type ImageProps = Omit<ImgHTMLAttributes<HTMLImageElement>, "src" | "width" | "height" | "loading"> & {
  src: string | StaticImage;
  alt: string;
  width?: number | `${number}`;
  height?: number | `${number}`;
  fill?: boolean;
  priority?: boolean;
  loading?: "eager" | "lazy";
  quality?: number;
  placeholder?: string;
  blurDataURL?: string;
  unoptimized?: boolean;
};

export default function Image({ src, alt, width, height, fill, priority, loading, quality, placeholder, blurDataURL, unoptimized, sizes, style, ...rest }: ImageProps) {
  void quality;
  void placeholder;
  void blurDataURL;
  void unoptimized;
  void sizes;
  const data = typeof src === "string" ? { src, width: undefined, height: undefined } : src;
  const fillStyle: CSSProperties = fill ? { position: "absolute", inset: 0, width: "100%", height: "100%" } : {};
  return (
    // eslint-disable-next-line @next/next/no-img-element -- HTML-Version ohne Bild-Optimierung
    <img
      {...rest}
      src={toFileHref(data.src)}
      alt={alt}
      width={fill ? undefined : (width ?? data.width)}
      height={fill ? undefined : (height ?? data.height)}
      loading={priority ? "eager" : (loading ?? "lazy")}
      decoding="async"
      style={{ color: "transparent", ...fillStyle, ...style }}
    />
  );
}
