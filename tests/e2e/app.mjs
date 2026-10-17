// E2E der Kinder-App (12 Abläufe). Aufruf über `npm run e2e` oder: node tests/e2e/app.mjs <ordner> [ablauf…]
import { chromium } from "playwright-core";
import fs from "node:fs";
import path from "node:path";

import { patchGoto } from "./filemode.mjs";

const [, , outDir, ...only] = process.argv;
fs.mkdirSync(outDir, { recursive: true });
const base = process.env.BASE ?? "http://localhost:3000";
const browser = await chromium.launch({ channel: "msedge", headless: true });

const results = [];
async function flow(name, fn, { onboarded = true, size = { width: 390, height: 844 } } = {}) {
  if (only.length && !only.includes(name)) return;
  const context = await browser.newContext({ viewport: size, locale: "de-DE", deviceScaleFactor: 1 });
  const page = patchGoto(await context.newPage(), base);
  const logs = [];
  page.on("console", (m) => {
    if (["error", "warning"].includes(m.type()) && !m.text().includes("Largest Contentful Paint")) logs.push(`[${m.type()}] ${m.text()}`);
  });
  page.on("pageerror", (e) => logs.push(`[pageerror] ${e.message}`));
  await page.goto(base + "/", { waitUntil: "domcontentloaded" });
  await page.evaluate((onb) => {
    localStorage.clear();
    if (onb)
      localStorage.setItem(
        "yogitier-app-v1",
        JSON.stringify({
          version: 1,
          onboarded: true,
          profile: { name: "Mia", animal: "emmi" },
          settings: { sound: false, voice: false, dailyGoal: 10 },
          activities: [],
          diary: [],
          stars: 0,
          memoBest: {},
          advent: [],
          requests: [],
        }),
      );
  }, onboarded);
  await page.evaluate(() => localStorage.setItem("yogitier-guide-v1", JSON.stringify({ seen: { "kinder-start": true, "kinder-lernwelt": true, "studio-start": true, "studio-editor": true }, muted: true })));

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

const visible = (page, sel) => page.locator(sel).filter({ visible: true });
const state = (page) => page.evaluate(() => JSON.parse(localStorage.getItem("yogitier-app-v1") || "{}"));

async function solveGate(page) {
  const q = await page.getByText(/Was ist \d+ × \d+\?/).filter({ visible: true }).first().textContent();
  const [, a, b] = q.match(/(\d+) × (\d+)/);
  const answer = String(Number(a) * Number(b));
  const dialog = page.getByRole("dialog").filter({ visible: true }).last();
  const scope = (await dialog.count()) ? dialog : page;
  for (const d of answer) await scope.getByRole("button", { name: d, exact: true }).filter({ visible: true }).first().click();
  await scope.getByRole("button", { name: "OK", exact: true }).filter({ visible: true }).first().click();
}

await flow(
  "onboarding",
  async (page, shot) => {
    await page.goto(base + "/", { waitUntil: "networkidle" });
    await page.getByRole("dialog", { name: "Willkommen bei YOGITIER" }).waitFor();
    await page.waitForTimeout(900);
    await shot("1-welcome");
    await page.getByRole("button", { name: /Los geht/ }).click();
    await page.getByPlaceholder("Dein Vorname").fill("Mia");
    await shot("2-name");
    await page.getByRole("button", { name: "Weiter" }).click();
    await page.getByRole("dialog", { name: "Willkommen bei YOGITIER" }).getByRole("button", { name: /Emmi/ }).click();
    await page.waitForTimeout(400);
    await shot("3-animal");
    await page.getByRole("button", { name: /Fertig/ }).click();
    await page.getByRole("dialog", { name: "Willkommen bei YOGITIER" }).waitFor({ state: "detached" });
    const s = await state(page);
    if (!s.onboarded || s.profile.name !== "Mia" || s.profile.animal !== "emmi") throw new Error("Profil nicht gespeichert");
    await shot("4-home");
  },
  { onboarded: false },
);

await flow("navigation", async (page, shot) => {
  await page.goto(base + "/", { waitUntil: "networkidle" });
  await page.getByRole("link", { name: "Yoga", exact: true }).click();
  await page.waitForURL("**/yoga");
  await page.waitForTimeout(700);
  await shot("1-yoga");
  await visible(page, 'a[href$="/yoga/stunde/guten-morgen"]').first().click();
  await page.waitForURL("**/yoga/stunde/guten-morgen");
  await page.waitForTimeout(600);
  await visible(page, 'a[aria-label="Zurück"]').first().click();
  await page.waitForURL("**/yoga");
  await visible(page, 'a[aria-label="Zurück zum Menü"]').first().click();
  await page.waitForURL(base + "/");
  await page.waitForTimeout(500);
  await shot("2-home-again");
});

await flow("lesson", async (page, shot) => {
  await page.goto(base + "/yoga/stunde/mini-pause", { waitUntil: "networkidle" });
  await visible(page, "button:has-text('Stunde starten')").first().click();
  await page.waitForTimeout(600);
  await shot("1-intro");
  await page.waitForTimeout(4200);
  await shot("2-pose");
  const next = page.getByRole("button", { name: "Nächste Übung" });
  await next.click();
  await page.waitForTimeout(500);
  await shot("3-pose2");
  await page.getByRole("button", { name: "Pause" }).click();
  await page.waitForTimeout(300);
  await shot("4-paused");
  await page.getByRole("button", { name: "Weiter" }).click();
  await next.click();
  await next.click();
  await next.click();
  await page.waitForTimeout(1200);
  await shot("5-done");
  const s = await state(page);
  if (!s.activities?.length) throw new Error("Aktivität nicht geloggt");
  await page.getByRole("button", { name: "Fertig" }).click();
});

await flow("breath", async (page, shot) => {
  await page.goto(base + "/meditation/atmen/ballon-atmung", { waitUntil: "networkidle" });
  await visible(page, "button:has-text('Atemübung starten')").first().click();
  await page.waitForTimeout(800);
  await shot("1-ready");
  await page.waitForTimeout(4500);
  await shot("2-inhale");
  await page.waitForTimeout(4200);
  await shot("3-exhale");
});

await flow("breath-visuals", async (page, shot) => {
  for (const slug of ["loewenatem", "blume-kerze", "bienen-summen", "kuscheltier-atmung", "regenbogen-atmung", "elefanten-atmung", "finger-atmung"]) {
    await page.goto(base + `/meditation/atmen/${slug}`, { waitUntil: "networkidle" });
    await visible(page, "button:has-text('Atemübung starten')").first().click();
    await page.waitForTimeout(6200);
    await shot(slug);
    await page.keyboard.press("Escape");
  }
});

await flow("journey", async (page, shot) => {
  await page.goto(base + "/meditation/reise/zauberwald", { waitUntil: "networkidle" });
  await visible(page, "button:has-text('Reise starten')").first().click();
  await page.waitForTimeout(900);
  await shot("1-start");
  await page.getByRole("button", { name: "Nächster Absatz" }).click();
  await page.waitForTimeout(700);
  await shot("2-next");
  for (let i = 0; i < 12; i++) await page.getByRole("button", { name: "Nächster Absatz" }).click().catch(() => {});
  await page.waitForTimeout(800);
  await shot("3-done");
});

await flow("memo", async (page, shot) => {
  await page.goto(base + "/memo", { waitUntil: "networkidle" });
  await page.getByRole("button", { name: /Leicht/ }).click();
  await page.waitForTimeout(400);
  await shot("1-board");
  const cards = page.locator("button.flip-card");
  const n = await cards.count();
  const known = new Map();
  const label = async (i) => (await cards.nth(i).getAttribute("aria-label")) ?? "";
  const done = new Set();
  for (let i = 0; i < n; i++) {
    if (done.has(i)) continue;
    await cards.nth(i).click();
    await page.waitForTimeout(150);
    const li = await label(i);
    const partner = [...known.entries()].find(([j, l]) => l === li && j !== i && !done.has(j));
    if (partner) {
      await cards.nth(partner[0]).click();
      done.add(i).add(partner[0]);
      await page.waitForTimeout(700);
      continue;
    }
    known.set(i, li);
    // zweite Karte aufdecken
    let j = i + 1;
    while (j < n && (done.has(j) || known.has(j))) j++;
    if (j >= n) break;
    await cards.nth(j).click();
    await page.waitForTimeout(150);
    const lj = await label(j);
    if (lj === li) {
      done.add(i).add(j);
      known.delete(i);
      await page.waitForTimeout(700);
    } else {
      known.set(j, lj);
      await page.waitForTimeout(1150);
      const match = [...known.entries()].find(([k, l]) => l === lj && k !== j && !done.has(k));
      if (match) {
        await cards.nth(j).click();
        await page.waitForTimeout(120);
        await cards.nth(match[0]).click();
        done.add(j).add(match[0]);
        await page.waitForTimeout(700);
      }
    }
    if (i === 1) await shot("2-progress");
  }
  // restliche bekannte Paare
  for (const [i, l] of known) {
    if (done.has(i)) continue;
    const m = [...known.entries()].find(([k, l2]) => l2 === l && k !== i && !done.has(k));
    if (m) {
      await cards.nth(i).click();
      await page.waitForTimeout(120);
      await cards.nth(m[0]).click();
      done.add(i).add(m[0]);
      await page.waitForTimeout(700);
    }
  }
  await page.getByText("Geschafft!").waitFor({ timeout: 5000 });
  await page.waitForTimeout(600);
  await shot("3-won");
  const s = await state(page);
  if (s.memoBest?.leicht === undefined) throw new Error("Rekord nicht gespeichert");
});

await flow("diary", async (page, shot) => {
  await page.goto(base + "/tagebuch", { waitUntil: "networkidle" });
  await page.getByRole("button", { name: /Wütend/ }).click();
  await page.waitForTimeout(500);
  await page.getByRole("button", { name: "Meine Familie" }).click();
  await page.getByRole("button", { name: "Eine Umarmung" }).click();
  await page.locator("textarea").fill("Mein Turm ist umgefallen, aber dann haben wir zusammen einen neuen gebaut.");
  await page.getByRole("button", { name: /Ein Bild dazu malen/ }).click();
  const canvas = page.getByLabel("Malfläche");
  const box = await canvas.boundingBox();
  await page.mouse.move(box.x + 40, box.y + 40);
  await page.mouse.down();
  for (let k = 0; k < 20; k++) await page.mouse.move(box.x + 40 + k * 12, box.y + 40 + Math.sin(k / 2) * 30 + k * 4);
  await page.mouse.up();
  await shot("1-form");
  await page.getByRole("button", { name: /Eintrag speichern/ }).click();
  await page.waitForTimeout(800);
  await shot("2-saved");
  const s = await state(page);
  if (s.diary?.length !== 1 || !s.diary[0].drawing) throw new Error("Eintrag/Bild nicht gespeichert");
});

await flow("advent", async (page, shot) => {
  await page.goto(base + "/besonderes", { waitUntil: "networkidle" });
  await page.getByRole("button", { name: /^Türchen 24/ }).click();
  await page.waitForTimeout(700);
  await shot("1-door24");
  await page.keyboard.press("Escape");
  await page.getByRole("button", { name: /^Türchen 13/ }).click();
  await page.waitForTimeout(500);
  await shot("2-door13");
  await page.getByRole("dialog", { name: /Türchen 13/ }).getByRole("button", { name: /Bastelvorlage/ }).click();
  await page.waitForTimeout(500);
  await shot("3-gate");
});

await flow("finder", async (page, shot) => {
  await page.goto(base + "/finder", { waitUntil: "networkidle" });
  await page.getByPlaceholder(/PLZ oder Ort/).fill("Köln");
  await page.waitForTimeout(300);
  await shot("1-search");
  await page.getByPlaceholder(/PLZ oder Ort/).fill("");
  await visible(page, "button:has-text('Lena Hoffmann')").first().click();
  await page.waitForTimeout(600);
  await shot("2-sheet");
  await page.getByRole("button", { name: /Anfrage senden/ }).click();
  await page.waitForTimeout(400);
  await shot("3-gate");
  await solveGate(page);
  await page.waitForTimeout(400);
  await page.getByLabel("Dein Name").fill("Julia Muster");
  await page.getByLabel("E-Mail").fill("julia@example.com");
  await shot("4-form");
  await page.getByRole("button", { name: /Anfrage senden/ }).click();
  await page.getByText("Anfrage gesendet!").waitFor();
  await shot("5-sent");
});

await flow("parents", async (page, shot) => {
  await page.goto(base + "/eltern", { waitUntil: "networkidle" });
  await page.getByRole("button", { name: /Ich bin erwachsen/ }).click();
  await shot("1-gate");
  await solveGate(page);
  await page.waitForTimeout(500);
  await shot("2-empty");
  await page.getByRole("button", { name: "Demo-Daten laden" }).first().click();
  await page.waitForTimeout(600);
  await shot("3-overview");
  for (const tab of ["Einstellungen", "Entdecken", "Über uns"]) {
    await page.getByRole("tab", { name: tab }).click();
    await page.waitForTimeout(400);
    await shot(`4-${tab}`);
  }
});

await flow(
  "desktop",
  async (page, shot) => {
    await page.goto(base + "/", { waitUntil: "networkidle" });
    await page.waitForTimeout(600);
    await shot("1-home");
    await page.getByRole("link", { name: "Meditation", exact: true }).click();
    await page.waitForURL("**/meditation");
    await page.waitForTimeout(800);
    await shot("2-meditation");
  },
  { size: { width: 1366, height: 768 } },
);

await browser.close();
for (const r of results) {
  console.log(`${r.ok ? "PASS" : "FAIL"} ${r.name}${r.err ? " – " + r.err : ""}`);
  for (const l of r.logs.slice(0, 8)) console.log("    " + l.slice(0, 300));
}
process.exit(results.every((r) => r.ok) ? 0 : 1);
