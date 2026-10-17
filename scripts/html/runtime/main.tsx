// Laufzeit der HTML-Version: rendert dieselben Seiten und Layouts wie Next.js, aber komplett im Browser.
// Server-Komponenten (z. B. die async „Loader“ der Seiten) werden hier vor dem Rendern aufgelöst.
import {
  addTransitionType,
  cloneElement,
  Component,
  createElement,
  Fragment,
  isValidElement,
  startTransition,
  useEffect,
  useState,
  type ComponentType,
  type ErrorInfo,
  type ReactElement,
  type ReactNode,
} from "react";
import { createRoot } from "react-dom/client";
import { notFoundPage, rootLayout, routes, type RouteDef } from "yogitier:routes";

import { NotFoundError, RedirectError } from "../shims/navigation";
import { currentPath, isAppPath, navigate, normalizeHashQuery, subscribe, takeTransitionTypes, toFileHref } from "./router";

type Metadata = NonNullable<typeof rootLayout.metadata>;
type View = { tree: ReactNode; title: string };

// Absolute App-Adressen in Attributen (iframe-Vorschau, <a href="/…">, Videos aus public/) umbiegen.
const setAttribute = Element.prototype.setAttribute;
Element.prototype.setAttribute = function (name: string, value: string) {
  if ((name === "href" || name === "src" || name === "poster") && typeof value === "string" && isAppPath(value)) value = toFileHref(value);
  return setAttribute.call(this, name, value);
};
const open = window.open.bind(window);
window.open = (url?: string | URL, target?: string, features?: string) =>
  open(typeof url === "string" && isAppPath(url) ? toFileHref(url) : url, target, features);

const AsyncFunction = (async () => {}).constructor;

/** Löst async Server-Komponenten im Baum auf (Client-Komponenten bleiben unangetastet). */
async function resolve(node: ReactNode): Promise<ReactNode> {
  if (Array.isArray(node)) return Promise.all(node.map(resolve));
  if (node instanceof Promise) return resolve(await node);
  if (!isValidElement(node)) return node;
  const element = node as ReactElement<Record<string, unknown>>;
  if (element.type instanceof AsyncFunction) {
    const render = element.type as (props: unknown) => Promise<ReactNode>;
    return resolve(await render(element.props));
  }
  const changed: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(element.props ?? {})) {
    if (key === "children" || isValidElement(value) || Array.isArray(value)) {
      const next = await resolve(value as ReactNode);
      if (next !== value) changed[key] = next;
    }
  }
  return Object.keys(changed).length ? cloneElement(element, changed) : element;
}

function match(path: string) {
  const parts = path.split("/").filter(Boolean).map(decodeURIComponent);
  for (const route of routes) {
    if (route.segments.length !== parts.length) continue;
    const params: Record<string, string> = {};
    const ok = route.segments.every((segment, i) => {
      if (segment.startsWith("[")) params[segment.slice(1, -1)] = parts[i];
      return segment.startsWith("[") || segment === parts[i];
    });
    if (ok) return { route, params };
  }
  return null;
}

function titleText(title: Metadata["title"]) {
  if (!title) return undefined;
  if (typeof title === "string") return title;
  if ("absolute" in title && title.absolute) return title.absolute;
  return "default" in title ? title.default : undefined;
}

async function titleFor(route: RouteDef, params: Promise<Record<string, string>>) {
  const meta = route.page.generateMetadata ? await route.page.generateMetadata({ params }) : route.page.metadata;
  const own = titleText(meta?.title);
  const layoutTitles = [rootLayout.metadata, ...route.layouts.map((l) => l.metadata)].map((m) => m?.title);
  const nearest = layoutTitles.reverse().find((t) => t && typeof t === "object" && "template" in t && t.template) as { template?: string; default?: string } | undefined;
  if (!own) return titleText(layoutTitles.find((t) => t)) ?? "YOGITIER®";
  return nearest?.template ? nearest.template.replace("%s", own) : own;
}

class ErrorBoundary extends Component<{ fallback: ComponentType<{ error: Error; reset: () => void }>; children: ReactNode }, { error: Error | null }> {
  state = { error: null as Error | null };
  static getDerivedStateFromError(error: Error) {
    return { error };
  }
  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error(error, info.componentStack);
  }
  render() {
    if (this.state.error instanceof NotFoundError) return createElement(notFoundPage.default);
    if (this.state.error) return createElement(this.props.fallback, { error: this.state.error, reset: () => this.setState({ error: null }) });
    return this.props.children;
  }
}

async function notFoundView(): Promise<View> {
  return { tree: await resolve(createElement(notFoundPage.default)), title: titleText(notFoundPage.metadata?.title) ?? "Seite nicht gefunden · YOGITIER®" };
}

async function render(path: string): Promise<View | null> {
  const found = match(path);
  if (!found) return notFoundView();
  const { route } = found;
  const params = Promise.resolve(found.params);
  const searchParams = Promise.resolve(Object.fromEntries(new URLSearchParams(location.search)));
  try {
    let tree: ReactNode = route.clientPage
      ? createElement(route.page.default as ComponentType<{ params: typeof params; searchParams: typeof params }>, { params, searchParams })
      : await resolve(route.page.default({ params, searchParams }));
    if (route.error) tree = <ErrorBoundary fallback={route.error.default}>{tree}</ErrorBoundary>;
    tree = <Fragment key={path}>{tree}</Fragment>;
    for (const { default: Layout } of [...route.layouts].reverse()) tree = <Layout params={params}>{tree}</Layout>;
    return { tree, title: await titleFor(route, params) };
  } catch (error) {
    if (error instanceof NotFoundError) return notFoundView();
    if (error instanceof RedirectError) {
      navigate(error.url, { replace: true });
      return null;
    }
    throw error;
  }
}

function App({ initial }: { initial: View }) {
  const [view, setView] = useState(initial);
  useEffect(
    () =>
      subscribe(() => {
        const types = takeTransitionTypes();
        const path = currentPath();
        void render(path).then((next) => {
          if (!next || currentPath() !== path) return;
          document.title = next.title;
          startTransition(() => {
            types?.forEach((type) => addTransitionType(type));
            setView(next);
          });
        });
      }),
    [],
  );
  return view.tree;
}

void (async () => {
  if (normalizeHashQuery()) return;
  const container = document.getElementById("app");
  if (!container) return;
  try {
    const first = await render(currentPath());
    if (!first) return;
    document.title = first.title;
    createRoot(container).render(<App initial={first} />);
  } catch (error) {
    console.error(error);
    container.textContent = "Die App konnte nicht starten. Bitte die Seite neu laden.";
  }
})();
