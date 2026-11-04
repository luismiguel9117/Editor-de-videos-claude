// Intro de la home de kalpa.pe (escritorio): mano, lata y canvas eléctrico
export default {
  name: "kweb-intro",
  url: process.env.KWEB_URL ?? "http://127.0.0.1:4000/",
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 1.5,
  fps: 30,
  durationSec: Number(process.env.DURATION ?? 4),
  warmupMs: 2500,
  syncCss: true,
  css: "*{cursor:none!important}",
};
