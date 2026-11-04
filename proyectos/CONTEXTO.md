# Contexto para continuar (traspaso entre sesiones)

Editor de videos de **Luis Miguel** (luismiguel.pe, diseñador web y de producto, Lima). Los videos
son para su página de Facebook e Instagram. Motor: **Remotion** (`remotion/`). Reglas del repo:
`CLAUDE.md`, `ESTILO-LUISMIGUEL.md` y la skill `.claude/skills/motion-premium/SKILL.md`.

## Cómo trabaja Luis (preferencias aprendidas)
- **Antes de renderizar cualquier video, enviar el guion y esperar aprobación.**
- Proceso: propósito → elementos reales del producto → **frames estáticos aprobados** → movimiento.
- El producto **forma parte de la composición** (capturas con fondo transparente, a sangre,
  cruzando la tipografía). **Nunca** dentro de tarjetas, marcos ni ventanas de navegador.
- Debe sentirse **premium, tipo anuncio de Apple**: una cosa a la vez, mucho espacio negro, textos
  que entran, cambian y salen, y animaciones reales de la web visibles. Nada recargado.
- Composición tipográfica **variada** en cada escena (no siempre "frase arriba y palabra gigante").
- Movimiento: el producto entra, se asienta y **flota**; parallax y deriva continuos (nada frena
  en seco); transiciones largas y solapadas (blur-zoom), sin slides ni cortes duros.
- Sonido: pocos efectos, graves, con reverb (`npm run sfx:premium`); nada de pops, clicks ni
  zaps. Música propia (`scripts/music-generate.mjs`). Master a −14 LUFS (`npm run master`).
- Tono del copy: **familiar y cercano, pero no informal**, en español.
- Paleta de Luis: azul y negro de su web (#000, #05102a, #1d4ed8, tinta #f0ecf4, punto rojo
  #ff3b30), Inter + Instrument Serif cursiva + Space Mono. Firma: "Luis *Miguel*." (sin subtítulo
  luismiguel.pe).
- La marca del cliente se escribe **KALPA**.

## Proyectos
1. **KALPA electricidad** — `proyectos/kalpa-electricidad/README.md`. Reel 9:16, 26 s. Borrador v2
   aprobado. Falta la voz.
2. **KALPA web (kalpa.pe)** — `proyectos/kalpa-web/README.md`. **En curso (prioridad).**
   - 1080×1350 (4:5). Colores KALPA (#0c0e12, dorado #fdb515, rojo #981608, Franklin Gothic en
     `public/fonts/kalpa/`); solo la firma final con los colores de Luis.
   - Protagonista: web de **escritorio** (el celular solo en la escena "…en tu celular").
   - Copy aprobado (voz): "Este mes diseñé la nueva web de KALPA." / "Una web que se siente como
     la marca: con energía." / "Con una tienda pensada para comprar en dos clics." / "Que cuenta
     de dónde viene cada grano." / "Y que se ve igual de bien en tu celular." / "Cinco páginas,
     un solo sistema." / "Lista para vender en Shopify."
   - Escenas en `remotion/src/videos/kalpaweb/scenes.tsx` (Studio → carpeta `kalpa-web`).
     Capturas estáticas en `remotion/public/kalpaweb/`. Última versión: sistema tipográfico
     variado, **sin renderizar ni aprobar todavía**.
   - **Siguiente paso:** analizar las referencias de estilo
     https://www.youtube.com/watch?v=sJGVcb5fn2c y https://www.youtube.com/watch?v=aSte18D2_YE,
     rehacer los frames en ese estilo, enviarlos para aprobar y luego capturar las animaciones
     reales (intro, cambio de slides, scroll con parallax, carrito) con
     `npm run capture -- capture/<escenario>.mjs`.
   - Web: repo `luismiguel9117/HERO-KALLPA`. La rama `shopify-theme` es el tema de Shopify; `main`
     tiene la misma web en HTML (levantarla con `python3 -m http.server 4000` en la raíz).
     En `index.html` el carrusel del hero no rota (variable `currentProductSlide` duplicada);
     para capturar, activar los slides con `classList` (ver notas del proyecto).

## Voz
Luis va a clonar su voz con **Voicebox** (jamiepine/voicebox) en su computadora y enviar un WAV
por frase: `elec-01..07.wav` y `web-01..07.wav`. Hay que adaptar `scripts/voice-timing.mjs` para
leer archivos sueltos por frase. Las voces de IA locales (Kokoro) se descartaron porque suenan
falsas.

## Entorno
- Render con el Chromium preinstalado:
  `--browser-executable=/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell`.
- Push: `git push https://github.com/luismiguel9117/Editor-de-videos-claude.git main`.
- Dominios agregados por Luis: YouTube (`youtube.com`, `googlevideo.com`, `ytimg.com`). SFXMint
  (`sfxmint.com`) ya responde: se puede llenar la biblioteca de efectos con `npm run sfx:import`.
