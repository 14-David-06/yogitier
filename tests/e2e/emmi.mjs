// E2E für Emmi (Tour + Fragen) in Kinder-App und Studio (6 Abläufe). Aufruf: node tests/e2e/emmi.mjs <ordner>
import { chromium } from "playwright-core";
import fs from "node:fs";
import path from "node:path";

import { patchGoto } from "./filemode.mjs";

const [, , outDir] = process.argv;
fs.mkdirSync(outDir, { recursive: true });
const base = process.env.BASE ?? "http://localhost:3000";
const browser = await chromium.launch({ channel: "msedge", headless: true });
const results = [];
const assert = (cond, msg) => {
  if (!cond) throw new Error(msg);
};

async function flow(name, fn, size = { width: 390, height: 844 }) {
  const context = await browser.newContext({ viewport: size, locale: "de-DE" });
  const page = patchGoto(await context.newPage(), base);
  const logs = [];
  page.on("console", (m) => {
    if (["error", "warning"].includes(m.type()) && !/Largest Contentful|React DevTools/.test(m.text())) logs.push(`[${m.type()}] ${m.text()}`);
  });
  page.on("pageerror", (e) => logs.push(`[pageerror] ${e.message}`));
  await page.goto(base + "/", { waitUntil: "domcontentloaded" });
  await page.evaluate(() => {
    localStorage.clear();
    localStorage.setItem(
      "yogitier-app-v1",
      JSON.stringify({ version: 1, onboarded: true, profile: { name: "Mia", animal: "emmi" }, settings: { sound: false, voice: false, dailyGoal: 10 }, activities: [], diary: [], stars: 5, memoBest: {}, advent: [], requests: [], worldProgress: {}, stickers: [] }),
    );
  });
  let ok = true;
  let err = "";
  try {
    await fn(page, (label) => page.screenshot({ path: path.join(outDir, `${name}_${label}.png`) }));
  } catch (e) {
    ok = false;
    err = e.message.split("\n")[0];
    await page.screenshot({ path: path.join(outDir, `${name}_FAILED.png`) }).catch(() => {});
  }
  results.push({ name, ok, err, logs });
  await context.close();
}

const tourDialog = (page) => page.getByRole("dialog", { name: "Tour mit Emmi" });
const guideState = (page) => page.evaluate(() => JSON.parse(localStorage.getItem("yogitier-guide-v1") || "{}"));
const seenKids = (page) => page.evaluate(() => localStorage.setItem("yogitier-guide-v1", JSON.stringify({ seen: { "kinder-start": true }, muted: true })));
const atHome = (u) => /\/$|#\/$/.test(u.toString());

await flow("kids-tour", async (page, shot) => {
  await page.goto(base + "/");
  await tourDialog(page).waitFor({ timeout: 8000 });
  assert(await page.getByText("Hallo Mia!").isVisible(), "Begrüßung mit Namen fehlt");
  await shot("1-offer");
  await page.getByRole("button", { name: "Ja, zeig's mir!" }).click();
  let steps = 0;
  while (await page.getByRole("button", { name: "Weiter" }).count()) {
    await page.waitForTimeout(350);
    steps++;
    await page.getByRole("button", { name: "Weiter" }).click();
  }
  await page.getByRole("button", { name: "Fertig" }).click();
  assert(steps === 7, `erwartet 7x Weiter, war ${steps}`);
  await page.waitForTimeout(300);
  assert((await tourDialog(page).count()) === 0, "Tour nicht geschlossen");
  assert((await guideState(page)).seen?.["kinder-start"], "Tour nicht als gesehen gespeichert");
  await page.goto(base + "/");
  await page.waitForTimeout(1600);
  assert((await tourDialog(page).count()) === 0, "Tour startet erneut");
  await shot("2-home-after");
});

await flow("kids-later", async (page) => {
  await page.goto(base + "/");
  await tourDialog(page).waitFor({ timeout: 8000 });
  await page.getByRole("button", { name: "Später" }).click();
  await page.goto(base + "/");
  await page.waitForTimeout(1600);
  assert((await tourDialog(page).count()) === 0, "Später nicht gemerkt");
});

await flow("kids-chat", async (page, shot) => {
  await seenKids(page);
  await page.goto(base + "/yoga");
  await page.getByRole("button", { name: "Frag Emmi" }).click();
  const chat = page.getByRole("dialog", { name: "Emmi – Fragen & Hilfe" });
  await chat.waitFor();
  await page.getByLabel("Frage an Emmi").fill("Ich bin wütend");
  await page.getByRole("button", { name: "Senden" }).click();
  await chat.getByText(/Löwenatem/).first().waitFor({ timeout: 4000 });
  await page.getByRole("button", { name: "Wie bekomme ich Sticker?" }).click();
  await chat.getByText(/5 Sterne gesammelt/).waitFor({ timeout: 4000 });
  await page.getByLabel("Frage an Emmi").fill("Was ist die Hauptstadt von Peru?");
  await page.getByRole("button", { name: "Senden" }).click();
  await chat.getByText(/weiß ich leider noch nicht/).waitFor({ timeout: 4000 });
  await shot("1-chat");
  await page.getByRole("button", { name: "Mein Sticker-Album" }).click();
  await page.waitForURL(/\/welten$/);
  assert((await chat.count()) === 0, "Chat bleibt nach Aktion offen");
  // „Zeig mir alles“ startet die Tour auf der Startseite
  await page.getByRole("button", { name: "Frag Emmi" }).click();
  await page.getByRole("button", { name: "Zeig mir alles" }).click();
  await page.getByRole("button", { name: "Los geht's!" }).click();
  await tourDialog(page).waitFor();
  await page.waitForURL(atHome);
  await shot("2-tour-from-chat");
});

await flow("world-tour", async (page, shot) => {
  await seenKids(page);
  await page.goto(base + "/welten/dschungel-pause");
  await tourDialog(page).waitFor({ timeout: 8000 });
  await page.waitForTimeout(700);
  await shot("1-step");
  await page.keyboard.press("Escape");
  await page.waitForTimeout(300);
  assert((await tourDialog(page).count()) === 0, "Esc schließt nicht");
  // Vorschau (wie im Studio-iframe): keine Tour
  await seenKids(page);
  await page.goto(base + "/welten/zaehne-putzen?vorschau=1");
  await page.waitForTimeout(2000);
  assert((await tourDialog(page).count()) === 0, "Tour in der Vorschau");
});

await flow(
  "desktop-pitch",
  async (page, shot) => {
    await page.evaluate(() => localStorage.setItem("yogitier-guide-v1", JSON.stringify({ seen: { "kinder-start": true, "kinder-lernwelt": true }, muted: true })));
    await page.goto(base + "/yoga");
    await page.getByRole("button", { name: /Emmi zeigt dir alles/ }).click();
    await tourDialog(page).waitFor();
    await page.waitForURL(atHome);
    await page.getByRole("button", { name: "Ja, zeig's mir!" }).click();
    await page.waitForTimeout(700);
    await shot("1-desktop-step");
  },
  { width: 1366, height: 768 },
);

await flow(
  "studio",
  async (page, shot) => {
    await page.goto(base + "/admin");
    await page.getByLabel("Admin-PIN").fill("1234");
    await page.getByRole("button", { name: "Anmelden" }).click();
    await tourDialog(page).waitFor({ timeout: 8000 });
    await page.getByRole("button", { name: "Tour starten" }).first().click();
    await page.waitForTimeout(800);
    await shot("1-nav");
    for (let i = 0; i < 4; i++) {
      await page.getByRole("button", { name: "Weiter" }).click();
      await page.waitForTimeout(450);
    }
    await page.getByRole("button", { name: "Fertig" }).click();
    await page.goto(base + "/admin/welten/gesunde-brotdose");
    await tourDialog(page).waitFor({ timeout: 8000 });
    await page.waitForTimeout(900);
    await shot("2-editor-tour");
    await page.getByRole("button", { name: "Überspringen" }).click();
    // Live-Vorschau zeigt Emmi nicht
    const frame = page.frameLocator('iframe[title="Live-Vorschau der Lernwelt"]');
    await frame.getByText("Die bunte Brotdose").first().waitFor({ timeout: 8000 });
    assert((await frame.getByRole("dialog", { name: "Tour mit Emmi" }).count()) === 0, "Tour im iframe");
    await page.getByRole("button", { name: "Frag Emmi" }).click();
    await page.getByRole("button", { name: "Was fehlt noch?" }).click();
    await page.getByText(/Kein Video ausgewählt/).last().waitFor({ timeout: 4000 });
    await page.getByLabel("Frage an Emmi").fill("Wie viele Lernwelten gibt es?");
    await page.getByRole("button", { name: "Senden" }).click();
    await page.getByText(/Im Studio gibt es \d+ Lernwelten/).waitFor({ timeout: 4000 });
    await shot("3-chat");
    const g = await guideState(page);
    assert(g.seen?.["studio-start"] && g.seen?.["studio-editor"], "Studio-Touren nicht gemerkt");
  },
  { width: 1440, height: 900 },
);

for (const r of results) console.log(`${r.ok ? "PASS" : "FAIL"} ${r.name}${r.err ? " – " + r.err : ""}${r.logs.length ? "\n    " + r.logs.slice(0, 6).join("\n    ") : ""}`);
await browser.close();
process.exit(results.every((r) => r.ok) ? 0 : 1);
