// Lata Kallpa con efecto de electricidad (repo luismiguel9117/ELECTRICIDAD, `node server.js` en :3000)
const W = 1080, H = 1350;
export default {
  name: "electricidad",
  url: process.env.ELEC_URL ?? "http://127.0.0.1:3000/",
  viewport: { width: W, height: H },
  deviceScaleFactor: 2,
  fps: 30,
  durationSec: Number(process.env.DURATION ?? 7),
  warmupMs: 2500,
  hide: ["[data-tg=themes]", "[data-tg=modes]", "[data-tg=bar]", ".kallpa-drag-hint"],
  css: "*{cursor:none!important}",
  setup: async (page) => {
    await page.evaluate(() => document.getElementById("btnThemeKallpa").click());
    await page.clock.runFor(1500);
  },
  // Gira la lata arrastrando: lento, un giro rápido a mitad (muestra el reverso) y suelta
  onFrame: async (page, { t }) => {
    const cx = W / 2, cy = H / 2;
    if (t === 0) { await page.mouse.move(cx, cy); await page.mouse.down(); }
    if (t < 2.5) await page.mouse.move(cx + t * 60, cy);
    else if (t < 3.3) await page.mouse.move(cx + 150 + (t - 2.5) * 600, cy);
    else if (t < 3.34) await page.mouse.up();
  },
};
