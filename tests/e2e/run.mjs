// Führt alle E2E-Prüfungen nacheinander aus (Playwright mit Microsoft Edge, Bildschirmfotos in dist/e2e).
//   npm run e2e                                   → gegen http://localhost:3000 (npm run dev oder demo)
//   $env:BASE="http://localhost:3100"; npm run e2e  → z. B. gegen das Paket mit Server
//   $env:BASE="file:///C:/…/YOGITIER.html#"; npm run e2e  → gegen die HTML-Version
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const out = path.resolve(here, "..", "..", "dist", "e2e");
const suites = ["app", "studio", "abschluss", "emmi"];

console.log(`E2E gegen ${process.env.BASE ?? "http://localhost:3000"}`);
const failed = suites.filter((suite) => {
  console.log(`\n▸ ${suite}`);
  return spawnSync(process.execPath, [path.join(here, `${suite}.mjs`), path.join(out, suite)], { stdio: "inherit" }).status !== 0;
});
console.log(failed.length ? `\n✗ Fehler in: ${failed.join(", ")}` : "\n✓ Alle E2E-Prüfungen bestanden");
process.exit(failed.length ? 1 : 0);
