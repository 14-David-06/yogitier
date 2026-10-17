// Baut ein ZIP, das sich auf einem Windows-PC ohne Installation ausprobieren lässt:
// eigenständiger Next.js-Server + portables Node.js + Starter + Anleitung (Spanisch) + Quellcode.
//
//   npm run paquete                                → dist/
//   npm run paquete -- --destino "C:\…\avances"    → in diesen Ordner
import { execFileSync, spawnSync } from "node:child_process";
import { copyFileSync, cpSync, existsSync, mkdirSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repo = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const vorlagen = path.join(repo, "scripts", "paquete");
const argDestino = process.argv.indexOf("--destino");
const destino = path.resolve(argDestino > 1 && process.argv[argDestino + 1] ? process.argv[argDestino + 1] : path.join(repo, "dist"));

const CARPETA = "YOGITIER-Prototipo";
// Gleicher Port wie in scripts/paquete/iniciar.mjs
const PUERTO = 3100;
const hoy = new Date();
const zwei = (n) => String(n).padStart(2, "0");
const fechaIso = `${hoy.getFullYear()}-${zwei(hoy.getMonth() + 1)}-${zwei(hoy.getDate())}`;
const fecha = `${zwei(hoy.getDate())}/${zwei(hoy.getMonth() + 1)}/${hoy.getFullYear()}`;
const zipNombre = `YOGITIER_avance_${fechaIso}.zip`;

const staging = path.join(repo, "dist", ".paquete");
const raiz = path.join(staging, CARPETA);
const app = path.join(raiz, "app");

const paso = (texto) => console.log(`\n▸ ${texto}`);
const git = (...args) => execFileSync("git", args, { cwd: repo, encoding: "utf8" });

let commit = "sin commit";
try {
  commit = git("rev-parse", "--short", "HEAD").trim();
} catch {
  // Noch kein Commit
}
if (git("status", "--porcelain").trim()) console.warn("Aviso: hay cambios sin commit; el paquete los incluye igualmente.");

// 1. Build
paso("Compilando la app (next build, modo standalone)…");
const build = spawnSync(process.execPath, [path.join(repo, "node_modules", "next", "dist", "bin", "next"), "build"], {
  cwd: repo,
  stdio: "inherit",
  env: { ...process.env, YOGITIER_STANDALONE: "1" },
});
if (build.status !== 0) process.exit(build.status ?? 1);
const standalone = path.join(repo, ".next", "standalone");
if (!existsSync(path.join(standalone, "server.js"))) throw new Error("Falta .next/standalone/server.js (revisa `output` en next.config.ts).");

// 2. App: Server + statische Dateien (kopiert der Standalone-Build nicht selbst)
paso("Armando la carpeta…");
rmSync(staging, { recursive: true, force: true });
cpSync(standalone, app, { recursive: true, dereference: true });
cpSync(path.join(repo, ".next", "static"), path.join(app, ".next", "static"), { recursive: true });
cpSync(path.join(repo, "public"), path.join(app, "public"), { recursive: true, dereference: true });
// macOS/Linux: sharp weicht auf WebAssembly aus, wenn die Windows-Binärdatei nicht passt.
for (const paquete of ["@img/sharp-wasm32", "@emnapi/runtime"]) {
  const origen = path.join(repo, "node_modules", paquete);
  const ziel = path.join(app, "node_modules", paquete);
  if (existsSync(origen) && !existsSync(ziel)) cpSync(origen, ziel, { recursive: true });
}

// 3. Portables Node.js + Starter
const runtime = path.join(raiz, "runtime");
mkdirSync(runtime, { recursive: true });
copyFileSync(process.execPath, path.join(runtime, path.basename(process.execPath)));
copyFileSync(path.join(vorlagen, "iniciar.mjs"), path.join(runtime, "iniciar.mjs"));
try {
  const res = await fetch(`https://raw.githubusercontent.com/nodejs/node/${process.version}/LICENSE`, { signal: AbortSignal.timeout(15000) });
  if (!res.ok) throw new Error(String(res.status));
  writeFileSync(path.join(runtime, "LICENSE-node.txt"), await res.text());
} catch {
  writeFileSync(path.join(runtime, "LICENSE-node.txt"), `Node.js ${process.version} (MIT): https://github.com/nodejs/node/blob/${process.version}/LICENSE\n`);
}
// .bat bewusst ohne Umlaute/Akzente: cmd.exe liest die Datei in der Codepage des Systems.
const bat = [
  "@echo off",
  "title YOGITIER - Prototipo",
  'pushd "%~dp0"',
  'if not exist "runtime\\node.exe" goto sinextraer',
  'if not exist "app\\server.js" goto sinextraer',
  '"runtime\\node.exe" "runtime\\iniciar.mjs"',
  "if errorlevel 1 pause",
  "exit /b",
  "",
  ":sinextraer",
  "echo.",
  "echo   Primero hay que descomprimir el ZIP completo:",
  'echo   clic derecho sobre el ZIP ^> "Extraer todo..." ^> Extraer.',
  "echo   Luego abre la carpeta extraida y vuelve a hacer doble clic en este archivo.",
  "echo.",
  "pause",
];
writeFileSync(path.join(raiz, "Iniciar YOGITIER.bat"), bat.join("\r\n") + "\r\n");

// 4. Anleitung (UTF-8 mit BOM und CRLF, damit der Windows-Editor sie sicher richtig anzeigt)
const instructivo =
  "\uFEFF" +
  readFileSync(path.join(vorlagen, "INSTRUCTIVO.txt"), "utf8")
    .replaceAll("{{FECHA}}", fecha)
    .replaceAll("{{COMMIT}}", commit)
    .replaceAll("{{PUERTO}}", String(PUERTO))
    .replace(/\r?\n/g, "\r\n");
writeFileSync(path.join(raiz, "INSTRUCTIVO.txt"), instructivo);

// 5. Quellcode: alle Dateien, die Git kennt oder nicht ignoriert (Stand des Arbeitsverzeichnisses)
paso("Copiando el código fuente…");
const fuentes = git("ls-files", "-z", "--cached", "--others", "--exclude-standard").split("\0").filter(Boolean);
for (const rel of fuentes) {
  const origen = path.join(repo, rel);
  if (!existsSync(origen) || statSync(origen).isDirectory()) continue;
  const ziel = path.join(raiz, "codigo-fuente", rel);
  mkdirSync(path.dirname(ziel), { recursive: true });
  copyFileSync(origen, ziel);
}

// 6. Prüfen: Windows-Explorer scheitert an Pfaden über 260 Zeichen
const rutas = [];
const recorrer = (dir) => {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) recorrer(p);
    else rutas.push(path.relative(staging, p));
  }
};
recorrer(raiz);
const masLarga = rutas.reduce((a, b) => (b.length > a.length ? b : a), "");
if (masLarga.length > 170) console.warn(`Aviso: ruta interna de ${masLarga.length} caracteres (${masLarga}). Al extraer en carpetas profundas podría superar el límite de Windows.`);

// 7. ZIP
paso("Comprimiendo…");
const zipTemporal = path.join(staging, zipNombre);
if (process.platform === "win32") {
  const tar = path.join(process.env.SystemRoot ?? "C:\\Windows", "System32", "tar.exe");
  execFileSync(tar, ["-a", "-c", "-f", zipNombre, CARPETA], { cwd: staging, stdio: "inherit" });
} else {
  execFileSync("zip", ["-qrX", zipNombre, CARPETA], { cwd: staging, stdio: "inherit" });
}
mkdirSync(destino, { recursive: true });
copyFileSync(zipTemporal, path.join(destino, zipNombre));
writeFileSync(path.join(destino, "INSTRUCTIVO.txt"), instructivo);
const mb = (statSync(zipTemporal).size / 1024 / 1024).toFixed(1);
rmSync(staging, { recursive: true, force: true });

console.log(`
✓ Paquete listo (${rutas.length} archivos, ruta interna más larga: ${masLarga.length} caracteres)
  ${path.join(destino, zipNombre)}  (${mb} MB)
  ${path.join(destino, "INSTRUCTIVO.txt")}
`);
