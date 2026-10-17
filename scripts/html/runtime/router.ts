// Hash-Router der HTML-Version: Adressen haben die Form `YOGITIER.html?<query>#/<pfad>`.
// So läuft alles in einem einzigen Dokument und funktioniert auch per Doppelklick (file://).

/** Ordner neben der HTML-Datei, in den `public/` kopiert wird. */
export const ARCHIVOS = "archivos";

type Listener = () => void;
const listeners = new Set<Listener>();
let pendingTypes: string[] | undefined;

/** Name der geöffneten HTML-Datei (so wie er in der Adresse steht). */
export function fileName() {
  return location.pathname.split("/").pop() || "YOGITIER.html";
}

export function isAppPath(url: string) {
  return url.startsWith("/") && !url.startsWith("//");
}

/** Aktueller App-Pfad aus dem Hash, z. B. „/yoga/stunde/guten-morgen“. */
export function currentPath() {
  const raw = location.hash.slice(1).split("?")[0];
  if (!raw || raw === "/") return "/";
  return raw.startsWith("/") ? raw : `/${raw}`;
}

/** Übersetzt eine App-Adresse („/welten/x?vorschau=1“) in eine Adresse für die HTML-Datei. */
export function toFileHref(url: string) {
  if (!isAppPath(url)) return url;
  const withoutHash = url.split("#")[0];
  const q = withoutHash.indexOf("?");
  const path = q >= 0 ? withoutHash.slice(0, q) : withoutHash;
  const query = q >= 0 ? withoutHash.slice(q) : "";
  // Dateien aus public/ (Videos, Icons …) liegen im Ordner „archivos“.
  if (/\.[a-z0-9]{2,5}$/i.test(path)) return `${ARCHIVOS}${path}${query}`;
  return `${fileName()}${query}#${path}`;
}

/** Navigiert innerhalb der App; ändert sich die Query, lädt das Dokument neu (wie ein harter Seitenwechsel). */
export function navigate(url: string, { replace = false, types }: { replace?: boolean; types?: string[] } = {}) {
  const target = new URL(toFileHref(url), location.href);
  if (target.pathname !== location.pathname || target.search !== location.search) {
    if (replace) location.replace(target.href);
    else location.assign(target.href);
    return;
  }
  pendingTypes = types;
  if (target.hash === location.hash) emit();
  else if (replace) {
    history.replaceState(history.state, "", target.href);
    emit();
  } else location.hash = target.hash;
}

/** Übergangsarten der letzten Navigation (für View Transitions), nur einmal abrufbar. */
export function takeTransitionTypes() {
  const types = pendingTypes;
  pendingTypes = undefined;
  return types;
}

export function subscribe(listener: Listener) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function emit() {
  for (const listener of listeners) listener();
}

window.addEventListener("hashchange", emit);

/** „#/pfad?x=1“ (z. B. von Hand eingegeben) → „?x=1#/pfad“, damit window.location.search stimmt. */
export function normalizeHashQuery() {
  const hash = location.hash.slice(1);
  const q = hash.indexOf("?");
  if (q < 0) return false;
  const search = new URLSearchParams(location.search);
  new URLSearchParams(hash.slice(q + 1)).forEach((value, key) => search.set(key, value));
  location.replace(`${fileName()}?${search.toString()}#${hash.slice(0, q) || "/"}`);
  return true;
}
