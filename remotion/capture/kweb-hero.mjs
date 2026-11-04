// Hero 3D de kalpa.pe con sus 3 slides. En index.html el carrusel no rota por un error de JS
// (currentProductSlide duplicado), así que se cambian los slides a mano en el tiempo deseado.
const go = (page, i) =>
  page.evaluate((i) => {
    document.querySelectorAll(".kalpa-slide").forEach((s, k) => s.classList.toggle("is-active", k === i));
    document.querySelectorAll(".carousel-dot").forEach((s, k) => s.classList.toggle("is-active", k === i));
    document.dispatchEvent(new CustomEvent("kallpa:slidechange", { detail: { index: i } }));
  }, i);

export default {
  name: "kweb-hero",
  url: process.env.KWEB_URL ?? "http://127.0.0.1:4000/",
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 1.5,
  fps: 30,
  durationSec: Number(process.env.DURATION ?? 4.5),
  warmupMs: 2500,
  css: "*{cursor:none!important}",
  setup: async (page) => {
    await page.evaluate(() => {
      const e = document.querySelector("#hero-section");
      scrollTo(0, e.getBoundingClientRect().top + scrollY);
    });
    await page.clock.runFor(1500);
  },
  onFrame: async (page, { frame }) => {
    if (frame === 30) await go(page, 1);
    if (frame === 80) await go(page, 2);
  },
};
