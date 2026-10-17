// YOGITIER – Starter des Offline-Pakets (wird von „Iniciar YOGITIER.bat“ aufgerufen).
// Sucht einen freien Port, startet den eigenständigen Next.js-Server und öffnet den Browser.
// Die Texte sind auf Spanisch: Sie richten sich an die Person, die das Paket ausprobiert.
import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import net from "node:net";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const servidor = path.join(raiz, "app", "server.js");
// Gleicher Port wie im INSTRUCTIVO – der Browser speichert die Daten pro Adresse.
const PRIMER_PUERTO = Number(process.env.PORT) || 3100;

if (!existsSync(servidor)) {
  console.error("\n  No se encuentra app/server.js. Descomprime el ZIP completo y vuelve a intentarlo.\n");
  process.exit(1);
}

const esperar = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const direccion = (puerto) => `http://localhost:${puerto}`;

const libre = (puerto) =>
  new Promise((resolve) => {
    const prueba = net.createServer();
    prueba.once("error", () => resolve(false));
    prueba.listen(puerto, "localhost", () => prueba.close(() => resolve(true)));
  });

async function esYogitier(puerto) {
  try {
    const res = await fetch(`${direccion(puerto)}/manifest.webmanifest`, { signal: AbortSignal.timeout(2000) });
    return res.ok && (await res.text()).includes("YOGITIER");
  } catch {
    return false;
  }
}

function abrirNavegador(url) {
  if (process.env.YOGITIER_SIN_NAVEGADOR) return;
  const [cmd, args] =
    process.platform === "win32" ? ["cmd", ["/c", "start", "", url]] : process.platform === "darwin" ? ["open", [url]] : ["xdg-open", [url]];
  try {
    spawn(cmd, args, { stdio: "ignore", windowsHide: true }).on("error", () => {}).unref();
  } catch {
    // Kein Browser gefunden – die Adresse steht in der Konsole.
  }
}

console.log("\n  YOGITIER - Prototipo\n  ====================\n  Iniciando... (unos segundos)\n");

// Schon offen (z. B. Doppelklick zweimal)? Dann nur den Browser öffnen – gleiche Adresse, gleiche Daten.
if (await esYogitier(PRIMER_PUERTO)) {
  console.log(`  YOGITIER ya está en marcha en ${direccion(PRIMER_PUERTO)} - se abre el navegador.\n`);
  abrirNavegador(direccion(PRIMER_PUERTO));
  await esperar(4000);
  process.exit(0);
}

let puerto = PRIMER_PUERTO;
while (!(await libre(puerto))) {
  if (puerto >= PRIMER_PUERTO + 20) {
    console.error(`  Los puertos ${PRIMER_PUERTO}-${puerto} están ocupados. Cierra otros programas y vuelve a intentarlo.\n`);
    process.exit(1);
  }
  puerto++;
}

const url = direccion(puerto);
Object.assign(process.env, { PORT: String(puerto), HOSTNAME: "localhost", NODE_ENV: "production", NEXT_TELEMETRY_DISABLED: "1" });
process.title = "YOGITIER - Prototipo";

// server.js (von `next build` erzeugt) startet den Server beim Laden.
await import(pathToFileURL(servidor).href);

let listo = false;
for (let i = 0; i < 120 && !listo; i++) {
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(5000) });
    listo = res.status < 500;
  } catch {
    // Server startet noch.
  }
  if (!listo) await esperar(500);
}

if (!listo) {
  console.error("\n  La app no respondió. Revisa los mensajes de arriba o vuelve a intentarlo.\n");
} else {
  console.log(`
  Listo. Se abre el navegador:

    App de los niños   ${url}
    YOGITIER Studio    ${url}/admin   (PIN 1234)
${puerto !== PRIMER_PUERTO ? `\n  Ojo: el puerto ${PRIMER_PUERTO} estaba ocupado; esta vez la dirección es ${url}.\n` : ""}
  Deja esta ventana abierta mientras pruebas. Para terminar, ciérrala.
`);
  abrirNavegador(url);
}
