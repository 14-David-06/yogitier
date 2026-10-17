// Baut die HTML-Version: dieselbe App als Ordner mit „YOGITIER.html“, die per Doppelklick läuft (ohne Server).
// Seiten, Layouts und Komponenten kommen unverändert aus src/; nur next/link, next/image, next/navigation
// und next/font werden durch kleine Browser-Varianten ersetzt (scripts/html/shims). CSS und Schriften
// stammen aus dem letzten `next build`.
//
//   npm run html                          → dist/html/YOGITIER-HTML/
//   node scripts/html/build.mjs <ordner>  → in diesen Ordner (setzt einen aktuellen `next build` voraus)
import { build } from "esbuild";
import { createHash } from "node:crypto";
import { copyFileSync, cpSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const repo = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..");
const here = path.join(repo, "scripts", "html");
// Gleicher Ordnername wie ARCHIVOS in runtime/router.ts
const ARCHIVOS = "archivos";

/** Erzeugt das virtuelle Modul „yogitier:routes“ aus der Ordnerstruktur von src/app. */
function routesModule() {
  const app = path.join(repo, "src", "app");
  const imports = [];
  const routes = [];
  const load = (file) => {
    const name = `m${imports.length}`;
    imports.push(`import * as ${name} from ${JSON.stringify(file.replaceAll("\\", "/"))};`);
    return name;
  };
  const walk = (dir, segments, layouts, error) => {
    const has = (file) => existsSync(path.join(dir, file));
    if (dir !== app && has("layout.tsx")) layouts = [...layouts, load(path.join(dir, "layout.tsx"))];
    if (has("error.tsx")) error = load(path.join(dir, "error.tsx"));
    if (has("page.tsx")) {
      const file = path.join(dir, "page.tsx");
      const clientPage = /^\s*["']use client["']/.test(readFileSync(file, "utf8"));
      routes.push({ segments, page: load(file), layouts, error, clientPage });
    }
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      if (!entry.isDirectory() || /^[_@]/.test(entry.name)) continue;
      const group = /^\(.*\)$/.test(entry.name);
      walk(path.join(dir, entry.name), group ? segments : [...segments, entry.name], layouts, error);
    }
  };
  walk(app, [], [], undefined);
  const dynamic = (r) => r.segments.filter((s) => s.startsWith("[")).length;
  routes.sort((a, b) => a.segments.length - b.segments.length || dynamic(a) - dynamic(b));
  const root = load(path.join(app, "layout.tsx"));
  const notFound = load(path.join(app, "not-found.tsx"));
  const list = routes.map(
    (r) => `{ segments: ${JSON.stringify(r.segments)}, page: ${r.page}, layouts: [${r.layouts.join(", ")}], error: ${r.error ?? "undefined"}, clientPage: ${r.clientPage} }`,
  );
  return `${imports.join("\n")}\nexport const rootLayout = ${root};\nexport const notFoundPage = ${notFound};\nexport const routes = [\n${list.join(",\n")}\n];\n`;
}

/** Statische Bild-Importe wie bei Next.js: { src, width, height } – die Datei landet in archivos/img. */
const images = (dir) => ({
  name: "yogitier-images",
  setup(b) {
    b.onLoad({ filter: /\.png$/i }, (args) => {
      const buffer = readFileSync(args.path);
      const hash = createHash("sha1").update(buffer).digest("hex").slice(0, 8);
      const name = `${path.basename(args.path, ".png")}-${hash}.png`;
      mkdirSync(path.join(dir, "img"), { recursive: true });
      writeFileSync(path.join(dir, "img", name), buffer);
      const data = { src: `${ARCHIVOS}/img/${name}`, width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) };
      return { contents: `export default ${JSON.stringify(data)};`, loader: "js" };
    });
  },
});

const shims = {
  name: "yogitier-next-shims",
  setup(b) {
    const map = { "next/link": "link.tsx", "next/image": "image.tsx", "next/navigation": "navigation.ts", "next/font/google": "font.ts" };
    b.onResolve({ filter: /^next\/(link|image|navigation|font\/google)$/ }, (args) => ({ path: path.join(here, "shims", map[args.path]) }));
    b.onResolve({ filter: /^yogitier:routes$/ }, () => ({ path: "routes", namespace: "yogitier" }));
    b.onLoad({ filter: /.*/, namespace: "yogitier" }, () => ({ contents: routesModule(), loader: "js", resolveDir: repo }));
  },
};

export async function buildHtml(outDir = path.join(repo, "dist", "html", "YOGITIER-HTML")) {
  const next = path.join(repo, ".next");
  const home = path.join(next, "server", "app", "index.html");
  if (!existsSync(home)) throw new Error("Falta un `next build` actual (no encuentro .next/server/app/index.html).");
  const prerendered = ["index.html", "admin.html"].map((f) => path.join(next, "server", "app", f)).filter(existsSync).map((f) => readFileSync(f, "utf8"));
  const htmlClass = prerendered[0].match(/<html[^>]*class="([^"]*)"/)?.[1] ?? "h-full antialiased";
  const bodyClass = prerendered[0].match(/<body[^>]*class="([^"]*)"/)?.[1] ?? "min-h-full";
  const cssFiles = [...new Set(prerendered.flatMap((html) => [...html.matchAll(/href="\/_next\/static\/chunks\/([^"]+\.css)"/g)].map((m) => m[1])))];

  rmSync(outDir, { recursive: true, force: true });
  const files = path.join(outDir, ARCHIVOS);
  mkdirSync(path.join(files, "chunks"), { recursive: true });
  cpSync(path.join(repo, "public"), files, { recursive: true });
  // Favicons von file:// blockiert der Browser – deshalb als data:-URL.
  const icon = `data:image/png;base64,${readFileSync(path.join(repo, "public", "icons", "icon-192.png")).toString("base64")}`;

  await build({
    entryPoints: [path.join(here, "runtime", "main.tsx")],
    outfile: path.join(files, "app.js"),
    bundle: true,
    format: "iife",
    platform: "browser",
    target: ["chrome111", "edge111", "firefox115", "safari16.4"],
    minify: true,
    legalComments: "none",
    charset: "utf8",
    tsconfig: path.join(repo, "tsconfig.json"),
    define: { "process.env.NODE_ENV": '"production"' },
    banner: { js: 'var process={env:{NODE_ENV:"production"}};' },
    loader: { ".css": "empty" },
    plugins: [shims, images(files)],
    logLevel: "warning",
  });

  // CSS des Next-Builds (Tailwind + Schriften); „../media/…“ zeigt danach auf archivos/media.
  const css = cssFiles.map((f) => readFileSync(path.join(next, "static", "chunks", f), "utf8")).join("\n");
  for (const [, font] of css.matchAll(/url\(\.\.\/media\/([^)]+)\)/g)) {
    mkdirSync(path.join(files, "media"), { recursive: true });
    copyFileSync(path.join(next, "static", "media", font), path.join(files, "media", font));
  }
  writeFileSync(path.join(files, "chunks", "app.css"), css);

  writeFileSync(
    path.join(outDir, "YOGITIER.html"),
    `<!doctype html>
<html lang="de" class="${htmlClass}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="theme-color" content="#FAF6F1">
<meta name="robots" content="noindex, nofollow">
<title>YOGITIER® – Yoga &amp; Achtsamkeit für Kinder</title>
<link rel="icon" href="${icon}">
<link rel="stylesheet" href="${ARCHIVOS}/chunks/app.css">
<style>#app{display:contents}</style>
</head>
<body class="${bodyClass}">
<div id="app"></div>
<noscript>Bitte JavaScript aktivieren, um die YOGITIER-App zu nutzen.</noscript>
<script src="${ARCHIVOS}/app.js" charset="utf-8"></script>
</body>
</html>
`,
  );
  return outDir;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const out = await buildHtml(process.argv[2] ? path.resolve(process.argv[2]) : undefined);
  console.log(`✓ Versión HTML lista: ${path.join(out, "YOGITIER.html")}`);
}
