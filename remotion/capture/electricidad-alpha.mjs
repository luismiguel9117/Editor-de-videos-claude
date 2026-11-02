// Lata eléctrica con fondo transparente para integrarla en la composición.
// La página pinta cada cuadro un fondo negro con brillo ámbar en #mainCanvas;
// aquí se omiten esos rellenos de pantalla completa y se conservan los rayos.
import base from "./electricidad.mjs";

export default {
  ...base,
  name: "electricidad-alpha",
  transparent: true,
  hide: [...base.hide, "#peersContainer"],
  css: "*{cursor:none!important} html,body,#app,[data-tg=app],#mainCanvas,#kallpaStage{background:transparent!important}",
  setup: async (page) => {
    await base.setup(page);
    await page.evaluate(() => {
      const c = document.getElementById("mainCanvas").getContext("2d");
      const fill = c.fillRect.bind(c);
      c.fillRect = (x, y, w, h) => {
        const dpr = window.devicePixelRatio || 1;
        const full = x <= 0 && y <= 0 && w >= (c.canvas.width / dpr) * 0.98 && h >= (c.canvas.height / dpr) * 0.98;
        if (full) {
          window.__cleared = (window.__cleared ?? 0) + 1;
          return c.clearRect(x, y, w, h);
        }
        return fill(x, y, w, h);
      };
      // El aura ámbar es un gradiente radial: lo dejamos sin color
      const radial = c.createRadialGradient.bind(c);
      c.createRadialGradient = (...a) => {
        const gr = radial(...a);
        gr.addColorStop = () => {};
        return gr;
      };
      // El fondo #050505 se pinta con ese fillStyle: lo volvemos transparente
      const proto = Object.getOwnPropertyDescriptor(CanvasRenderingContext2D.prototype, "fillStyle");
      Object.defineProperty(c, "fillStyle", {
        get() {
          return proto.get.call(this);
        },
        set(v) {
          proto.set.call(this, v === "#050505" ? "rgba(0,0,0,0)" : v);
        },
      });
      for (const el of [document.documentElement, document.body, document.getElementById("app"), c.canvas]) {
        el.style.setProperty("background", "transparent", "important");
        el.style.setProperty("transition", "none", "important");
      }
    });
    if (process.env.DEBUG_CAPTURE) {
      await page.clock.runFor(100);
      console.log("debug", await page.evaluate(() => [window.__cleared, getComputedStyle(document.getElementById("app")).backgroundColor, getComputedStyle(document.getElementById("mainCanvas")).backgroundColor, getComputedStyle(document.body).backgroundColor]));
    }
  },
};
