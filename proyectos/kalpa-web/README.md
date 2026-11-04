# Proyecto: presentación de la web KALPA (kalpa.pe)

Video que presenta la web de KALPA diseñada por Luis Miguel.

**Estado:** guion aprobado · frames estáticos listos para aprobar · voz: Luis Miguel (clonada con Voicebox o grabada).
**Colores:** KALPA (obsidiana #0c0e12, dorado #fdb515, rojo #981608, Franklin Gothic) en todo el video;
la firma final usa la marca luismiguel.pe (azul y negro).

## Guion aprobado

| # | Voz | Palabra gigante | Material real |
|---|---|---|---|
| 1 | "Este mes diseñé la nueva web de KALPA." | KALPA.PE | intro en celular (mano + lata) |
| 2 | "Una web que se siente como la marca: con energía." | ENERGÍA | 3 slides del hero |
| 3 | "Con una tienda pensada para comprar en dos clics." | TIENDA | tarjetas de precio (celular) |
| 4 | "Que cuenta de dónde viene cada grano." | ORIGEN | VRAEM + energía natural |
| 5 | "Y que se ve igual de bien en tu celular." | CELULAR | versión móvil |
| 6 | "Cinco páginas, un solo sistema." | 5 PÁGINAS | Promociones, Nosotros, Productos, Producto |
| 7 | "Lista para vender en Shopify." | SHOPIFY | carrito abierto + ficha de producto |
| 8 | — | Luis *Miguel*. + kalpa.pe | firma (marca luismiguel.pe) |

Escenas: `remotion/src/videos/kalpaweb/scenes.tsx` (Studio → carpeta `kalpa-web`).
Capturas: `remotion/public/kalpaweb/`.

## Nota sobre la web
En `index.html` (vista HTML de `main`) el carrusel del hero no rota: `let currentProductSlide`
está declarado en `assets/theme.js` y otra vez en el script en línea de `index.html`, y ese error
detiene el script en línea (carrusel del hero, carrito, reseñas). En el tema de Shopify no pasa,
porque solo `theme.js` lo declara.

## Fuente
- Repo `luismiguel9117/HERO-KALLPA`. La rama `shopify-theme` (tema Shopify OS 2.0) se sincroniza
  desde `main@f9a24e8`; `main` tiene la misma web en HTML estático, que es la que se levanta en
  local para capturar (`python3 -m http.server 4000` en la raíz del repo).
- Páginas: `index.html` (home), `productos.html`, `producto.html`, `nosotros.html`,
  `promociones.html`, `tienda.html`.

## Secciones de la home (orden real)
1. Intro/preloader: estadio, cielo, mano lanzando la lata con canvas eléctrico — "ENERGÍA REAL PARA TU DÍA"
2. Hero 3D con 3 slides: "CAFÉ DE VRAEM", "COLD BREW", "ENERGÍA LIMPIA" (lata Three.js)
3. Ticker: Granos del VRAEM · Energía natural · Cold Brew 24H · Envíos a todo el Perú
4. Carrusel de producto: KALPA Original (S/ 7.90 · Pack x6 S/ 39.90) y Café Molido
5. "Un origen extraordinario" (VRAEM)
6. "Más que café, es energía natural"
7. Comunidad: reels + reseñas
8. Footer con newsletter "Sé parte de KALPA"
