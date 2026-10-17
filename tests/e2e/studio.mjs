// E2E des YOGITIER® Studios und der Lernwelten (5 Abläufe). Aufruf über `npm run e2e` oder: node tests/e2e/studio.mjs <ordner> [ablauf…]
import { chromium } from "playwright-core";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { patchGoto } from "./filemode.mjs";

const [, , outDir, ...only] = process.argv;
fs.mkdirSync(outDir, { recursive: true });
const base = process.env.BASE ?? "http://localhost:3000";
const VIDEO = fileURLToPath(new URL("../../public/media/demo-baum.mp4", import.meta.url));
const browser = await chromium.launch({ channel: "msedge", headless: true, args: ["--autoplay-policy=no-user-gesture-required"] });
const results = [];

async function flow(name, fn, size = { width: 1440, height: 900 }) {
  if (only.length && !only.includes(name)) return;
  const context = await browser.newContext({ viewport: size, locale: "de-DE" });
  const page = patchGoto(await context.newPage(), base);
  const logs = [];
  page.on("console", (m) => {
    if (["error", "warning"].includes(m.type()) && !/Largest Contentful Paint|Download the React DevTools/.test(m.text())) logs.push(`[${m.type()}] ${m.text()}`);
  });
  page.on("pageerror", (e) => logs.push(`[pageerror] ${e.message}`));
  // Kinder-App: Onboarding überspringen, Ton aus
  await page.goto(base + "/", { waitUntil: "domcontentloaded" });
  await page.evaluate(() => {
    localStorage.setItem(
      "yogitier-app-v1",
      JSON.stringify({ version: 1, onboarded: true, profile: { name: "Mia", animal: "emmi" }, settings: { sound: false, voice: false, dailyGoal: 10 }, activities: [], diary: [], stars: 0, memoBest: {}, advent: [], requests: [], worldProgress: {}, stickers: [] }),
    );
  });
  await page.evaluate(() => localStorage.setItem("yogitier-guide-v1", JSON.stringify({ seen: { "kinder-start": true, "kinder-lernwelt": true, "studio-start": true, "studio-editor": true }, muted: true })));

  let ok = true;
  let err = "";
  try {
    await fn(page, (label, opts = {}) => page.screenshot({ path: path.join(outDir, `${name}_${label}.png`), ...opts }));
  } catch (e) {
    ok = false;
    err = e.message.split("\n")[0];
    await page.screenshot({ path: path.join(outDir, `${name}_FAILED.png`) }).catch(() => {});
  }
  results.push({ name, ok, err, logs });
  await context.close();
}

async function login(page) {
  await page.goto(base + "/admin", { waitUntil: "networkidle" });
  await page.getByLabel("Admin-PIN").fill("1234");
  await page.getByRole("button", { name: "Anmelden" }).click();
  await page.getByText("Willkommen im YOGITIER® Studio").waitFor();
}

await flow("studio", async (page, shot) => {
  await page.goto(base + "/admin", { waitUntil: "networkidle" });
  await page.waitForTimeout(500);
  await shot("0-login");
  await page.getByLabel("Admin-PIN").fill("9999");
  await page.getByRole("button", { name: "Anmelden" }).click();
  await page.getByText("Falsche PIN").waitFor();
  await login(page);
  await page.waitForTimeout(600);
  await shot("1-dashboard");
  await page.getByRole("link", { name: "Lernwelten", exact: true }).click();
  await page.waitForURL("**/admin/welten");
  await page.waitForTimeout(600);
  await shot("2-welten", { fullPage: true });
  await page.goto(base + "/admin/welten/dschungel-pause", { waitUntil: "networkidle" });
  await page.waitForTimeout(1500);
  await shot("3-editor");
  await page.getByRole("button", { name: /Video: Der Baum mit Emmi/ }).click();
  await page.waitForTimeout(800);
  await shot("4-editor-video", { fullPage: true });
});

await flow("create", async (page, shot) => {
  await login(page);
  await page.goto(base + "/admin/welten", { waitUntil: "networkidle" });
  await page.getByRole("button", { name: "Neue Lernwelt" }).first().click();
  await page.waitForTimeout(400);
  await shot("1-templates");
  await page.getByRole("button", { name: /Bewegungspause/ }).click();
  await page.waitForURL(/\/admin\/welten\/welt-/);
  await page.waitForTimeout(1200);
  const url = page.url();
  const id = url.split("/").pop();
  // Titel ändern
  const title = page.getByRole("textbox").first();
  await title.fill("Hampelmann-Party");
  // Szene & Begleiter
  await page.getByRole("button", { name: /Weltraum/ }).first().click();
  await page.getByRole("button", { name: /Diego/ }).first().click();
  // Video-Station öffnen und Video hochladen
  await page.getByRole("button", { name: /Mitmach-Video/ }).first().click();
  await page.waitForTimeout(300);
  await page.locator('input[type="file"][accept*="video"]').first().setInputFiles(VIDEO);
  await page.getByText(/demo-baum ·/).first().waitFor({ timeout: 30000 });
  await page.waitForTimeout(800);
  // Stopp hinzufügen
  await page.getByRole("button", { name: /Stopp an aktueller Stelle/ }).click();
  await page.waitForTimeout(300);
  await shot("2-uploaded", { fullPage: true });
  // Quiz hinzufügen
  await page.getByRole("button", { name: "Station hinzufügen" }).click();
  await page.getByRole("button", { name: /Quiz-Frage/ }).last().click();
  await page.waitForTimeout(300);
  await page.getByLabel("Frage").last().fill("Wie viele Beine hat ein Hampelmann?");
  await page.getByLabel("Antwort 1", { exact: true }).fill("Zwei");
  await page.getByLabel("Antwort 2", { exact: true }).fill("Zehn");
  await page.getByLabel("Antwort 1 ist richtig").check();
  await page.getByLabel(/Erklärung/).last().fill("Genau – zwei Beine, die beim Springen auseinander und wieder zusammen gehen.");
  page.once("dialog", (d) => d.accept());
  await page.getByRole("button", { name: "Veröffentlichen" }).click();
  await page.getByRole("button", { name: "Zurückziehen" }).waitFor({ timeout: 5000 });
  await page.waitForTimeout(1500);
  await shot("3-published", { fullPage: false });
  fs.writeFileSync(path.join(outDir, "created-id.txt"), id);
  // In der Kinder-App prüfen
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(base + "/besonderes", { waitUntil: "networkidle" });
  await page.waitForTimeout(1200);
  await shot("4-besonderes");
  await page.goto(base + `/welten/${id}`, { waitUntil: "networkidle" });
  await page.waitForTimeout(1500);
  await shot("5-welt");
  await page.getByRole("button", { name: /Station 2: Mitmach-Video/ }).click();
  await page.waitForTimeout(800);
  await shot("6-video");
});

await flow("kids-world", async (page, shot) => {
  await page.goto(base + "/welten/dschungel-pause", { waitUntil: "networkidle" });
  await page.waitForTimeout(1500);
  await shot("1-path");
  await page.evaluate(() => {
    const el = [...document.querySelectorAll("main.screen")].find((m) => getComputedStyle(m).display !== "none");
    el?.scrollTo(0, 600);
  });
  await page.waitForTimeout(400);
  await shot("2-path-scrolled");
  // Station 1: Info
  await page.getByRole("button", { name: /Station 1:/ }).click();
  await page.waitForTimeout(500);
  await shot("3-info");
  await page.getByRole("button", { name: /Verstanden/ }).click();
  await page.waitForTimeout(400);
  // Station 2: Video mit Stopp
  await page.getByRole("button", { name: /Station 2:/ }).click();
  await page.waitForTimeout(600);
  await page.getByRole("button", { name: "Video abspielen" }).click();
  await page.getByRole("alertdialog", { name: "Mitmach-Stopp" }).waitFor({ timeout: 25000 });
  await page.waitForTimeout(500);
  await shot("4-video-stop");
  await page.getByRole("button", { name: /Weiter zum Video/ }).click();
  await page.getByRole("button", { name: /Super – weiter/ }).waitFor({ timeout: 25000 });
  await shot("5-video-ended");
  await page.getByRole("button", { name: /Super – weiter/ }).click();
  await page.waitForTimeout(400);
  // Station 5: Quiz (falsch, dann richtig)
  await page.getByRole("button", { name: /Station 5:/ }).click();
  await page.waitForTimeout(500);
  await page.getByRole("button", { name: /Ich werde unsichtbar/ }).click();
  await page.waitForTimeout(400);
  await page.getByRole("button", { name: /Mein Herz klopft schneller/ }).click();
  await page.waitForTimeout(500);
  await shot("6-quiz");
  await page.getByRole("button", { name: /^Weiter/ }).click();
  await page.waitForTimeout(400);
  // Station 4: Timer starten
  await page.getByRole("button", { name: /Station 4:/ }).click();
  await page.waitForTimeout(400);
  await page.getByRole("button", { name: /Los geht/ }).click();
  await page.waitForTimeout(1500);
  await shot("7-timer");
  for (let i = 0; i < 4; i++) await page.getByRole("button", { name: "Nächster Abschnitt" }).click().catch(() => {});
  await page.getByRole("button", { name: /^Weiter/ }).click();
  await page.waitForTimeout(400);
  // Station 3 (Übung) & 6 (Atmung) schnell abschließen
  await page.getByRole("button", { name: /Station 3:/ }).click();
  await page.waitForTimeout(600);
  await page.getByRole("button", { name: "Nächste Übung" }).click();
  await page.getByRole("button", { name: "Nächste Übung" }).click();
  await page.waitForTimeout(800);
  await page.getByRole("button", { name: "Fertig" }).click();
  await page.waitForTimeout(400);
  const state = await page.evaluate(() => JSON.parse(localStorage.getItem("yogitier-app-v1")).worldProgress["dschungel-pause"]);
  fs.writeFileSync(path.join(outDir, "progress.json"), JSON.stringify(state, null, 2));
  await shot("8-progress");
  if (!state || state.done.length < 5) throw new Error("Fortschritt nicht gespeichert: " + JSON.stringify(state));
}, { width: 390, height: 844 });

await flow("mission", async (page, shot) => {
  await page.goto(base + "/welten/wasser-trinken", { waitUntil: "networkidle" });
  await page.waitForTimeout(1200);
  await page.getByRole("button", { name: /Station 4:/ }).click();
  await page.waitForTimeout(500);
  for (let i = 0; i < 6; i++) await page.getByRole("button", { name: new RegExp(`^${i + 1}\\. offen`) }).click();
  await page.waitForTimeout(400);
  await shot("1-mission-done");
}, { width: 390, height: 844 });

await flow("studio-pages", async (page, shot) => {
  await login(page);
  await page.goto(base + "/admin/medien", { waitUntil: "networkidle" });
  await page.waitForTimeout(800);
  await shot("1-medien");
  await page.goto(base + "/admin/einstellungen", { waitUntil: "networkidle" });
  await page.waitForTimeout(800);
  await shot("2-einstellungen", { fullPage: true });
});

await browser.close();
for (const r of results) {
  console.log(`${r.ok ? "PASS" : "FAIL"} ${r.name}${r.err ? " – " + r.err : ""}`);
  for (const l of r.logs.slice(0, 10)) console.log("    " + l.slice(0, 300));
}
process.exit(results.every((r) => r.ok) ? 0 : 1);
