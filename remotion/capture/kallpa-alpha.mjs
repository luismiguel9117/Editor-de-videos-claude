// Carrusel Kallpa con fondo transparente: las latas se integran en la composición
import base from "./kallpa.mjs";

export default {
  ...base,
  name: "kallpa-alpha",
  deviceScaleFactor: 2.5,
  transparent: true,
  hide: [".ambient-glow"],
  css: "*{cursor:none!important} html,body,.carousel-container,.carousel-viewport{background:transparent!important}",
};
