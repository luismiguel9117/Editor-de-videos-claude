// Hero de Nosotros (repo HERO-KALLPA, `python3 -m http.server 4000`): animación de aparición CSS
export default {
  name: "kweb-nosotros",
  url: process.env.KWEB_URL ?? "http://127.0.0.1:4000/nosotros.html",
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 1.5,
  fps: 30,
  durationSec: Number(process.env.DURATION ?? 5),
  warmupMs: 1500,
  syncCss: true,
  css: "*{cursor:none!important}",
};
