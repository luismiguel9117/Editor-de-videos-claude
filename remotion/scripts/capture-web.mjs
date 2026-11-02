#!/usr/bin/env node
// Captura una página web animada cuadro por cuadro con un reloj controlado
// (Playwright page.clock), así el video sale fluido aunque la máquina sea lenta.
//
// Uso:  node scripts/capture-web.mjs capture/kallpa.mjs
//
// Un escenario (capture/<nombre>.mjs) exporta por defecto:
// {
//   name: "kallpa",                       // → public/footage/kallpa.mp4
//   url: "http://127.0.0.1:5173/",
//   viewport: { width: 1080, height: 1350 },
//   fps: 30, durationSec: 6,
//   warmupMs: 1500,                        // tiempo real para cargar recursos
//   hide: [".toolbar"],                    // selectores a ocultar (UI de la página)
//   css: "body{cursor:none}",              // CSS extra opcional
//   setup: async (page) => {},             // antes del primer cuadro
//   onFrame: async (page, { frame, t }) => {}, // antes de cada cuadro (t en segundos)
// }

import { execFileSync } from "node:child_process";
import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const require = createRequire(import.meta.url);
const { chromium } = require("playwright");

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const scenarioPath = process.argv[2];
if (!scenarioPath) {
  console.error("Uso: node scripts/capture-web.mjs capture/<escenario>.mjs");
  process.exit(1);
}
const sc = (await import(pathToFileURL(resolve(scenarioPath)).href)).default;
const fps = sc.fps ?? 30;
const total = Math.round((sc.durationSec ?? 5) * fps);
const framesDir = join(process.env.CAPTURE_TMP ?? tmpdir(), `capture-${sc.name}`);
rmSync(framesDir, { recursive: true, force: true });
mkdirSync(framesDir, { recursive: true });

const launchArgs = ["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--hide-scrollbars"];
const proxy = process.env.HTTPS_PROXY ? { server: process.env.HTTPS_PROXY, bypass: "127.0.0.1,localhost" } : undefined;
const browser = await chromium.launch({ args: launchArgs, proxy, executablePath: process.env.CHROME_PATH });
const page = await browser.newPage({ viewport: sc.viewport, deviceScaleFactor: sc.deviceScaleFactor ?? 1 });

await page.clock.install();
await page.goto(sc.url, { waitUntil: "networkidle" });
await page.waitForTimeout(sc.warmupMs ?? 1500);
const hideCss = (sc.hide ?? []).map((s) => `${s}{display:none!important}`).join("");
await page.addStyleTag({ content: `${hideCss}${sc.css ?? ""}` });
await page.clock.pauseAt(new Date(Date.now() + 60_000));
if (sc.setup) await sc.setup(page);

const cdp = await page.context().newCDPSession(page);
const started = Date.now();
for (let frame = 0; frame < total; frame++) {
  if (sc.onFrame) await sc.onFrame(page, { frame, t: frame / fps, fps });
  await page.clock.runFor(1000 / fps);
  const { data } = await cdp.send("Page.captureScreenshot", {
    format: "png",
    optimizeForSpeed: true,
    clip: { x: 0, y: 0, width: sc.viewport.width, height: sc.viewport.height, scale: sc.deviceScaleFactor ?? 1 },
  });
  writeFileSync(join(framesDir, `f${String(frame).padStart(5, "0")}.png`), Buffer.from(data, "base64"));
  if (frame % 30 === 0) {
    const el = (Date.now() - started) / 1000;
    console.log(`${sc.name}: ${frame}/${total} cuadros (${el.toFixed(0)} s)`);
  }
}
await browser.close();

const outDir = join(root, "public/footage");
mkdirSync(outDir, { recursive: true });
const out = join(outDir, `${sc.name}.mp4`);
execFileSync("ffmpeg", [
  "-v", "error", "-y", "-framerate", String(fps), "-i", join(framesDir, "f%05d.png"),
  "-c:v", "libx264", "-crf", "16", "-preset", "slow", "-pix_fmt", "yuv420p", "-movflags", "+faststart", out,
]);
rmSync(framesDir, { recursive: true, force: true });
console.log(`Listo: ${out}`);
