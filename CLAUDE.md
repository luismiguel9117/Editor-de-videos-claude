# Editor de videos — luismiguel.pe

Este repositorio es **exclusivamente para crear videos** de Luis Miguel (luismiguel.pe) para Instagram
y Facebook. Todo lo de este archivo aplica siempre, sin activar skills. Las skills y carpetas citadas
amplían el detalle.

## 1. Proceso obligatorio
1. **Propósito y material real:** qué debe sentir/hacer quien lo ve, y qué elementos reales del
   producto usar (capturas o video de la web/producto real; nada inventado) y cuáles omitir.
2. **Buscar referencias en la biblioteca** `referencias/awesome-opus5-5-videos/` (703 prompts de
   videos de Opus 5.5): `cd remotion && npm run prompts -- <palabras> --completos`. Leer 2–3 del mismo
   tipo y tomar su estructura, reglas de movimiento y método de render. Análisis propios en
   `referencias/01..05-*.md`.
3. **Guion + mapa de beats** (escenas con tiempos, textos, material, música, efectos) →
   **enviarlo al usuario y esperar aprobación antes de renderizar**.
4. **Frames estáticos** de cada escena → aprobación.
5. **Animación**, luego **QA**: revisar cuadros de cada escena y de cada transición, escanear saltos
   de un solo cuadro (diferencia entre cuadros 3× mayor que sus vecinos), textos cortados, cuadros
   quietos. Corregir antes de entregar. Master a −14 LUFS, picos ≤ −1.5 dBTP (`npm run master`).

## 2. Lenguaje visual (premium, tipo anuncio de Apple / lanzamiento de producto)
- **Una toma continua:** cada escena nace de la anterior. Una forma de marca se transforma
  (tamaño, radio, color) a lo largo de todo el video; un objeto se vuelve el siguiente
  (botón → punto → pantalla → tarjeta). Floods de color que cubren el cuadro (sobrepasar las esquinas,
  ~0.3 s) y se contraen en la escena siguiente. Evitar cortes duros y crossfades genéricos.
- **Una cosa a la vez**, mucho espacio negativo, frases de 1–3 palabras.
- **Texto:** las letras suben a través de una máscara una por una; nada aparece de golpe. Una palabra
  se reemplaza por la siguiente en el mismo lugar. Mínimo 2 s legibles en textos de apertura.
- **Producto siempre vivo:** entra, se asienta (spring sin rebote exagerado) y flota; la cámara nunca
  se detiene (empuje 1.03–1.07 por escena); parallax continuo, nada frena en seco.
- **Cursor real** (puntero de macOS) que hace clics, arrastres y scroll sobre la UI real.
- **Datos que se mueven:** precios, cifras y contadores que cuentan (leer el tiempo del cuadro).
- **Cada transición demuestra algo del producto**, no solo cambia de título.
- **El video se entiende sin sonido.**
- **Composición:** el producto forma parte de la escena (fondo transparente, a sangre, cruzando la
  tipografía). Nada de marcos planos. Sí a laptops/celulares/tablets **en 3D real** (Three.js con
  materiales, ver `remotion/src/videos/kalpaweb/Phone3D.tsx`) o mockups profesionales, con dinamismo.
- **Unidad gráfica:** de las referencias se toma la técnica, nunca sus recursos ni su paleta. Los
  recursos se crean con la identidad del cliente.
- **Prohibido:** logos girando, dashboards falsos, glitch excesivo, texto diminuto, flashes blancos,
  partículas genéricas, rebotes exagerados, plantillas, holds de más de ~1 s sin movimiento.

## 3. Sonido
- Música con beat claro; definir BPM y **mapa de beats** antes de animar (algo pasa en cada beat;
  los movimientos empiezan ~0.05 s antes para caer en el beat).
- Un efecto por evento (clic, whoosh en deslizamientos, golpe en floods), colocado por su pico
  medido. Preferir efectos reales con licencia comercial (SFXMint `sfxmint.com`, biblioteca
  `remotion/public/sfx/`); los sintetizados solo si son sobrios y con reverb. Nada que suene a juguete.
- Con voz: la música baja; la voz manda los tiempos (`scripts/voice-timing.mjs`).

## 4. Técnica (Remotion)
- Todo es función pura del cuadro (`useCurrentFrame`); nada de timers ni CSS transitions.
- Capturas de webs: `npm run capture -- capture/<escenario>.mjs` (reloj controlado, `syncCss`,
  `transparent`). La **web publicada** es la fuente de lo actual (p. ej. kalpa.pe), no ramas viejas.
- 3D: `--gl=swangle` al renderizar. No usar `preserve-3d` para anillos/carruseles: proyectar a mano
  con `matrix3d` (ver `ConcaveRing`).
- Desenfoque de movimiento en lo rápido (`@remotion/motion-blur` o subframes).
- Render con `--browser-executable=/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell`.

## 5. Marca y preferencias de Luis
- Guía visual: `ESTILO-LUISMIGUEL.md`. Marca de Luis: azul y negro (#000, #05102a, #1d4ed8), tinta
  #f0ecf4, punto rojo #ff3b30, Inter + Instrument Serif cursiva + Space Mono. Firma: "Luis *Miguel*.".
- En videos de clientes: colores y tipografía del cliente; solo la firma final con la marca de Luis.
- Copy en español, **familiar y cercano, pero no informal**.
- Voz: la de Luis (clonada con Voicebox o grabada). Las voces de IA locales suenan falsas.
- Proyectos y estado: `proyectos/` (empezar por `proyectos/CONTEXTO.md`).
- Recursos de su portafolio: repo `luismiguel9117/portafolio2`.
- Motores: `remotion/` (principal) y `hyperframes/`. Reglas detalladas extra en
  `.claude/skills/motion-premium/SKILL.md`.
