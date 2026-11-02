---
name: motion-premium
description: Detalles de movimiento y sonido que hacen que un video de producto se sienta premium (no genérico ni "de juego de niños"). Úsala siempre que crees, animes o revises un video de luismiguel.pe en Remotion o HyperFrames, antes de escribir animaciones, elegir transiciones o poner efectos de sonido, y al revisar un borrador.
---

# Motion premium — luismiguel.pe

Feedback real del cliente: lo que da sensación premium son los **detalles de vida y suavidad**.
Lo que lo arruina: sonidos de juguete y saltos bruscos entre escenas.

## Antes de animar
1. Propósito del video y qué elementos reales del producto usar (y cuáles omitir).
2. Frames estáticos aprobados primero; movimiento después.
3. El producto es parte de la composición (fondo transparente, a sangre, cruzando la tipografía). Nunca en tarjetas o marcos.

## Producto: nunca quieto
- **Entrada → asentamiento → flotar.** Un objeto entra (sube, cae, gira), se asienta con un pequeño rebote amortiguado (spring con damping alto, overshoot ≤ 3 %) y luego **flota**: vaivén vertical 10–18 px, periodo 3–4 s, rotación ±1.5°, con fases distintas para que no sea mecánico.
- **Movimiento secundario:** la sombra se aleja/encoge cuando el objeto sube; los reflejos o brillos se desplazan levemente; las partículas reaccionan.
- **Cámara siempre viva:** deriva lenta (scale 1 → 1.04 por escena) o paneo de pocos px. Nada completamente estático.
- **Easing:** entradas expo-out `cubic-bezier(0.16,1,0.3,1)`, salidas expo-in; nada lineal salvo derivas de cámara.
- **Duraciones:** entradas 18–30 frames (a 30 fps), nunca de golpe; asentamiento 10–15 frames.

## Parallax continuo (nada frena en seco)
- Cada movimiento de entrada (acostarse, separarse, girar, subir) termina **fundiéndose en una
  deriva continua** que dura toda la escena; nunca llega a cero y se congela.
- Parallax por capas, siempre activo mientras la escena está en pantalla: fondo ≈ 0.1 px/frame,
  frase pequeña ≈ 0.12, palabra gigante ≈ 0.28, producto ≈ 0.5–0.7 (y su flotación).
- Regla práctica: `posición = entrada(ease) + deriva(frame)`; la deriva arranca en el frame 0,
  así cuando la entrada termina el objeto sigue moviéndose sin cambio brusco de velocidad.
- Revisa el último tercio de cada escena: si algo está quieto, falta deriva.

## Tipografía
- Palabra gigante con su propia vida: entra con blur → nítida y deriva 20–40 px durante la escena.
- La palabra interactúa con el producto (detrás, cruzada, aplastada, en capas), no flota sola.

## Transiciones: un solo lenguaje
- Crossfade **largo y solapado** (18–24 frames) con zoom suave + desenfoque: la escena que sale crece 1 → 1.08 y se desenfoca; la que entra viene de 0.94 → 1 y se enfoca.
- Nada de slides duros, cortes secos ni flashes de 1–2 frames. Si hay un acento (ej. energía), usar un **bloom de luz** de 8–12 frames que sube y baja, no un flash.
- La posición del producto al salir de una escena debería continuar en la siguiente cuando sea posible.

## Sonido premium
- **Menos es más:** 1 efecto por transición o momento clave, nunca por cada palabra.
- Paleta: barridos de aire suaves con paneo y reverb (`silk-sweep`, `deep-pass`, `air-transition`), swells graves (`sub-swell`, `reverse-swell`), impactos suaves con cola larga (`soft-impact`), un `glint` para destellos, `electric-hum` sutil para energía, `night-air` como ambiente.
- Prohibido: pops, clicks, zaps, "boings", sonidos de meme, ruido blanco seco sin reverb.
- Música: pad cálido con reverb, graves suaves, beat a medio tiempo; nada de arpegios agudos chillones. Volumen bajo bajo la voz.
- Masterizar a −14 LUFS, picos ≤ −1.5 dBTP (`npm run master`).

## Revisión antes de entregar
- Revisa cuadros a mitad de **cada** transición: ningún salto, ninguna escena vacía.
- ¿El producto se mueve en todas las escenas? ¿Algún objeto queda congelado?
- ¿Algún sonido se siente de juguete? Quítalo.
