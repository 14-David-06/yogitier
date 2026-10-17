// Ersatz für `next/navigation` in der HTML-Version.
import { useMemo, useSyncExternalStore } from "react";

import { currentPath, navigate, subscribe } from "../runtime/router";

export class NotFoundError extends Error {
  constructor() {
    super("NEXT_NOT_FOUND");
  }
}

export class RedirectError extends Error {
  constructor(public readonly url: string) {
    super("NEXT_REDIRECT");
  }
}

export function notFound(): never {
  throw new NotFoundError();
}

export function redirect(url: string): never {
  throw new RedirectError(url);
}

export const permanentRedirect = redirect;

const router = {
  push: (href: string) => navigate(href),
  replace: (href: string) => navigate(href, { replace: true }),
  back: () => history.back(),
  forward: () => history.forward(),
  refresh: () => navigate(currentPath()),
  prefetch: () => {},
};

export function useRouter() {
  return router;
}

export function usePathname() {
  return useSyncExternalStore(subscribe, currentPath, () => "/");
}

export function useSearchParams() {
  const search = useSyncExternalStore(
    subscribe,
    () => location.search,
    () => "",
  );
  return useMemo(() => new URLSearchParams(search), [search]);
}
