/**
 * Viewport-height screenshots of the main pages, desktop and mobile.
 *
 * Usage (after `pnpm build`):  pnpm start  then  node scripts/shots.mjs http://localhost:3000
 *
 * Every frame is exactly one viewport (never a full-page document capture).
 * All shots are taken in a deterministic one-screen state:
 *   - paper theme / amber accent (except the midnight showcase), sfx muted
 *   - fresh classic 5x5 run, a few moves played so the board looks lived-in
 * This script uses the system Google Chrome so no browser download is needed.
 */

import { chromium, devices } from "playwright";
import { mkdir } from "node:fs/promises";
import { resolve } from "node:path";

const BASE = process.argv[2] ?? "http://localhost:3100";
const OUT = resolve("docs/screenshots");
await mkdir(OUT, { recursive: true });

const SETTINGS_DEFAULTS = {
  theme: "paper",
  accent: "amber",
  fxOn: false,
  hapticsOn: false,
  fxVolume: 0.6,
  musicOn: false,
  ambience: null,
  autoNext: false,
  autoContinue: true,
  wobble: true,
  showMoveCount: true,
};

function seed(theme, accent) {
  const settings = { ...SETTINGS_DEFAULTS, theme, accent };
  return {
    eloTheme: theme,
    eloAccent: accent,
    eloSettings: settings,
  };
}

const browser = await chromium.launch({ channel: "chrome", headless: true });

async function newPage(seedData, viewport, device) {
  const context = await browser.newContext({
    viewport,
    deviceScaleFactor: 2,
    ...(device ? devices[device] : {}),
  });
  await context.addInitScript((s) => {
    try {
      localStorage.clear();
      localStorage.setItem("elo-theme", s.eloTheme);
      localStorage.setItem("elo-accent", s.eloAccent);
      localStorage.setItem("elo-g/settings", JSON.stringify(s.eloSettings));
    } catch {}
  }, seedData);
  const page = await context.newPage();
  page.setDefaultTimeout(30000);
  return { context, page };
}

async function settled(page, path, extra = 300) {
  await page.goto(BASE + path, { waitUntil: "networkidle" });
  await page.waitForTimeout(extra);
}

async function shoot(page, name) {
  await page.screenshot({ path: resolve("docs/screenshots", name), fullPage: false });
  console.log("  -", name);
}

const DESKTOP = { width: 1920, height: 1080 };
const MOBILE = { width: 390, height: 844 };

// Desktop ------------------------------------------------------------
const desktop = await newPage(seed("paper", "amber"), DESKTOP);
await settled(desktop.page, "/");
await desktop.page.mouse.move(1400, 900);
await shoot(desktop.page, "desktop-landing.png");

await settled(desktop.page, "/play");
await desktop.page.waitForSelector('[role="grid"]');
for (const key of ["1", "4", "7", "3"]) {
  await desktop.page.keyboard.press(key);
  await desktop.page.waitForTimeout(240);
}
await desktop.page.mouse.move(1450, 60);
await desktop.page.waitForTimeout(900);
await shoot(desktop.page, "desktop-play.png");

await desktop.page.keyboard.press("m");
await desktop.page.waitForTimeout(700);
await shoot(desktop.page, "desktop-play-mode-sheet.png");

await desktop.page.keyboard.press("Escape");
await desktop.page.waitForTimeout(400);
await desktop.page.getByRole("button", { name: "Settings" }).click();
await desktop.page.waitForTimeout(700);
await shoot(desktop.page, "desktop-play-settings-sheet.png");

await desktop.page.keyboard.press("Escape");
await desktop.page.waitForTimeout(400);
const midnight = await newPage(seed("midnight", "amber"), DESKTOP);
await settled(midnight.page, "/play");
await midnight.page.waitForSelector('[role="grid"]');
for (const key of ["1", "5", "3"]) {
  await midnight.page.keyboard.press(key);
  await midnight.page.waitForTimeout(240);
}
await midnight.page.mouse.move(1450, 60);
await midnight.page.waitForTimeout(900);
await shoot(midnight.page, "desktop-play-midnight.png");

await settled(desktop.page, "/guides");
await shoot(desktop.page, "desktop-guides.png");

await settled(desktop.page, "/guides/how-to-solve-lights-out");
await desktop.page.waitForTimeout(600);
await desktop.page.mouse.move(1100, 200);
await shoot(desktop.page, "desktop-guide-solver.png");

await desktop.context.close();
await midnight.context.close();

// Mobile -------------------------------------------------------------
const mobile = await newPage(seed("paper", "amber"), MOBILE, "iPhone 13");
await settled(mobile.page, "/");
await mobile.page.tap("body", { position: { x: 340, y: 120 }, force: true }).catch(() => {});
await shoot(mobile.page, "mobile-landing.png");

await settled(mobile.page, "/play");
await mobile.page.waitForSelector('[role="grid"]');
for (const key of ["1", "4", "7", "3"]) {
  await mobile.page.keyboard.press(key);
  await mobile.page.waitForTimeout(240);
}
await mobile.page.waitForTimeout(900);
await shoot(mobile.page, "mobile-play.png");

await mobile.page.keyboard.press("m");
await mobile.page.waitForTimeout(700);
await shoot(mobile.page, "mobile-play-mode-sheet.png");

await mobile.context.close();

await browser.close();
console.log("Done ->", "docs/screenshots");