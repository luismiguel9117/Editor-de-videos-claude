# Proyecto: KALPA electricidad

Reel vertical (1080×1920, 30 fps, ~26 s) para Instagram y Facebook que muestra parte del trabajo
del mes para KALPA: la lata, su construcción por capas, el carrusel 3D y la versión con electricidad.

**Estado:** borrador v2 aprobado (sonido premium, transiciones suaves, movimiento continuo).
**Falta:** la voz en off de Luis Miguel → sincronizar → render final.

## Guion de voz (aprobado)

| # | Voz | Palabra gigante |
|---|---|---|
| 1 | "Un poco del trabajo que hice este mes para KALPA." | KALPA |
| 2 | "Antes de tener forma, la etiqueta fue un diseño plano." | plano |
| 3 | "Luego la construí capa por capa: la lata, la etiqueta y las gotas." | capa por capa |
| 4 | "Y la puse a girar." | girar |
| 5 | "Pero le faltaba chispa…" | chispa |
| 6 | "Así que le di toda la energía." | energía |
| 7 | "¿Y tú, ya quieres probar una?" | probar → firma "Luis *Miguel*." |

Grabación: 3 s de silencio al inicio y ~2 s de pausa entre frases.

## Dónde está todo

| Qué | Dónde |
|---|---|
| Composición final | `remotion/src/videos/kalpa/KalpaProcesoReel.tsx` (Studio → carpeta `kalpa-electricidad` → `KalpaProcesoReel`) |
| Escenas (frames estáticos) | `remotion/src/videos/kalpa/scenes.tsx` (`Kalpa-1-Intro` … `Kalpa-8-Firma`) |
| Tiempos de escena | `TIMING` en la composición; con voz, `voice-timing.json` |
| Capturas del producto | `remotion/public/footage/kallpa-alpha.webm`, `electricidad-alpha.webm` (fondo transparente) |
| Recursos de la lata | `remotion/public/kalpa/` (del repo `luismiguel9117/Kallpa`) |
| Música | `remotion/public/music/kalpa-proceso-26s.wav` (`scripts/music-generate.mjs`) |
| Efectos | biblioteca `remotion/public/sfx/` (premium: `scripts/sfx-premium.mjs`) |

## Cómo terminarlo cuando llegue la voz

```bash
cd remotion
node scripts/voice-timing.mjs ruta/a/voz.m4a     # limpia la voz, detecta frases, ajusta tiempos y música
npx remotion render KalpaProcesoReel out/kalpa-electricidad.mp4
npm run master -- out/kalpa-electricidad.mp4
```

Recapturar las animaciones (si cambian las webs): `npm run capture -- capture/kallpa-alpha.mjs` y
`capture/electricidad-alpha.mjs` (repos Kallpa en :5173 y ELECTRICIDAD en :3000).
