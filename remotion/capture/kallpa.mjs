// Carrusel 3D de latas Kallpa (repo luismiguel9117/Kallpa, `npm run dev` en :5173)
export default {
  name: "kallpa",
  url: process.env.KALLPA_URL ?? "http://127.0.0.1:5173/",
  viewport: { width: 720, height: 900 },
  deviceScaleFactor: 1.5,
  fps: 30,
  durationSec: Number(process.env.DURATION ?? 7),
  warmupMs: 2500,
  css: "*{cursor:none!important}",
  // Desliza el carrusel con la rueda del ratón: rápido al principio, luego frena
  onFrame: async (page, { t }) => {
    await page.mouse.move(360 + Math.sin(t * 1.3) * 80, 450);
    if (t < 4.5) await page.mouse.wheel(0, 34 * Math.max(0.15, 1 - t / 4.5));
  },
};
