// Ersatz für `next/link` in der HTML-Version: normale Links mit Hash-Adresse und View-Transition-Typen.
import type { AnchorHTMLAttributes, Ref } from "react";

import { isAppPath, navigate, toFileHref } from "../runtime/router";

type UrlObject = { pathname?: string; query?: Record<string, string>; hash?: string };

type LinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
  href: string | UrlObject;
  replace?: boolean;
  scroll?: boolean;
  prefetch?: boolean | "auto" | null;
  transitionTypes?: string[];
  ref?: Ref<HTMLAnchorElement>;
};

function format(href: string | UrlObject) {
  if (typeof href === "string") return href;
  const query = href.query ? `?${new URLSearchParams(href.query).toString()}` : "";
  return `${href.pathname ?? "/"}${query}${href.hash ?? ""}`;
}

export default function Link({ href, replace, scroll, prefetch, transitionTypes, onClick, ...rest }: LinkProps) {
  void scroll;
  void prefetch;
  const url = format(href);
  return (
    <a
      {...rest}
      href={toFileHref(url)}
      onClick={(e) => {
        onClick?.(e);
        if (e.defaultPrevented || !isAppPath(url) || rest.target === "_blank") return;
        if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        e.preventDefault();
        navigate(url, { replace, types: transitionTypes });
      }}
    />
  );
}
