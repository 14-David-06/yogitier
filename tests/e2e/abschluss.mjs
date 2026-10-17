// E2E: Abschluss einer Lernwelt – Feier, Sticker, Album, Eltern-Statistik. Aufruf: node tests/e2e/abschluss.mjs <ordner>
import { chromium } from "playwright-core";
import fs from "node:fs";

import { patchGoto } from "./filemode.mjs";

const [, , outDir] = process.argv;
fs.mkdirSync(outDir, { recursive: true });
const base = process.env.BASE ?? "http://localhost:3100";
const browser = await chromium.launch({ channel: "msedge", headless: true });
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, locale: "de-DE" });
const page = patchGoto(await ctx.newPage(), base);
const logs = [];
page.on("console", (m) => ["error", "warning"].includes(m.type()) && logs.push(m.text()));
page.on("pageerror", (e) => logs.push("pageerror " + e.message));

await page.goto(base + "/", { waitUntil: "domcontentloaded" });
await page.evaluate(() =>
  localStorage.setItem(
    "yogitier-app-v1",
    JSON.stringify({
      version: 1,
      onboarded: true,
      profile: { name: "Mia", animal: "emmi" },
      settings: { sound: false, voice: false, dailyGoal: 10 },
      activities: [],
      diary: [],
      stars: 4,
      memoBest: {},
      advent: [],
      requests: [],
      worldProgress: { "dschungel-pause": { done: ["dp-2", "dp-3", "dp-4", "dp-5", "dp-6"], missions: {} } },
      stickers: [],
    }),
  ),
);
await page.evaluate(() => localStorage.setItem("yogitier-guide-v1", JSON.stringify({ seen: { "kinder-start": true, "kinder-lernwelt": true, "studio-start": true, "studio-editor": true }, muted: true })));
await page.goto(base + "/welten/dschungel-pause", { waitUntil: "networkidle" });
await page.waitForTimeout(1200);
await page.getByRole("button", { name: /Station 1:/ }).click();
await page.getByRole("button", { name: /Verstanden/ }).click();
await page.getByRole("dialog", { name: "Lernwelt geschafft" }).waitFor({ timeout: 5000 });
await page.waitForTimeout(900);
await page.screenshot({ path: `${outDir}/1-celebration.png` });
await page.getByRole("link", { name: "Zu meinen Stickern" }).click();
await page.waitForURL("**/welten**");
await page.waitForTimeout(1200);
await page.evaluate(() => {
  const el = [...document.querySelectorAll("main.screen")].find((m) => getComputedStyle(m).display !== "none");
  const album = el?.querySelector("#sticker");
  if (el && album) el.scrollTo(0, album.offsetTop - 80);
});
await page.waitForTimeout(500);
await page.screenshot({ path: `${outDir}/2-album.png` });
const s = await page.evaluate(() => JSON.parse(localStorage.getItem("yogitier-app-v1")));
console.log("stickers:", JSON.stringify(s.stickers.map((x) => x.name)), "stars:", s.stars, "completedAt:", !!s.worldProgress["dschungel-pause"].completedAt, "activity:", s.activities[0]?.title);
// Eltern-Bereich zeigt die Lernwelt-Aktivität
await page.goto(base + "/eltern", { waitUntil: "networkidle" });
await page.getByRole("button", { name: /Ich bin erwachsen/ }).click();
const q = await page.getByText(/Was ist \d+ × \d+\?/).first().textContent();
const [, a, b] = q.match(/(\d+) × (\d+)/);
for (const d of String(Number(a) * Number(b))) await page.getByRole("button", { name: d, exact: true }).first().click();
await page.getByRole("button", { name: "OK", exact: true }).click();
await page.waitForTimeout(700);
await page.evaluate(() => {
  const el = [...document.querySelectorAll("main.screen")].find((m) => getComputedStyle(m).display !== "none");
  el?.scrollTo(0, 99999);
});
await page.waitForTimeout(400);
await page.screenshot({ path: `${outDir}/3-eltern.png` });
const errors = logs.filter((l) => !/Largest Contentful Paint/.test(l));
console.log("logs:", errors);
await browser.close();
const ok = s.stickers.some((x) => x.name === "Dschungel-Held") && !!s.worldProgress["dschungel-pause"].completedAt && errors.length === 0;
console.log(`${ok ? "PASS" : "FAIL"} abschluss`);
process.exit(ok ? 0 : 1);
