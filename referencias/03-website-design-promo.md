# Referencia 3 — "Website Design Template Video Promotion" (Indra Ibrahim, plantilla de After Effects)

| Dato | Valor |
|---|---|
| Duración | 28.8 s · 30 fps · 16:9 |
| Fondo | casi negro (#141414); un tramo central cambia a gris claro (#e8e8e8) |
| Acento | **amarillo puro (#ffe600)** usado como herramienta de transición, no solo como color |
| Tipografía | sans muy gruesa, blanca, 2–3 palabras apiladas y alineadas a la derecha ("Website / Promo", "New / Level / Design") |
| Cortes | ~8, todos sobre el beat (7.4, 12.8, 15.1, 16.8, 21.5, 23.5 s) |
| Audio | groove electrónico, −14 LUFS; cada corte cae en un golpe |

## Estructura (beat por beat)

| Tiempo | Qué pasa | Cómo está hecho |
|---|---|---|
| 0–0.7 s | Un círculo amarillo (logo) aparece con rebote en el centro | Escala 0 → 1.1 → 1 (overshoot) |
| 0.7–1.5 s | El círculo **se estira** y se convierte en una barra de búsqueda con la url y un botón amarillo | Morph: el círculo queda como botón y la pastilla blanca crece hacia la izquierda |
| 1.5–2.5 s | Se "presiona" buscar; la barra **colapsa en un rectángulo amarillo** que se estira y encoge | La forma amarilla hace de transición (wipe) |
| 2.5–3.2 s | El rectángulo amarillo se abre y revela la web, que **se levanta en 3D** desde el plano | Máscara amarilla + `rotateX` de 80° → 15° |
| 3.2–6 s | La cámara recorre la web inclinada; scroll hacia abajo | Perspectiva fuerte y cambiante, desenfoque de movimiento en los tramos rápidos |
| 6–7.4 s | Web inclinada a la izquierda + "Website / Promo" en blanco a la derecha; marca pequeña abajo | Composición asimétrica; el texto entra con deslizamiento corto |
| 7.4–12.8 s | Corte a una web oscura plana; luego un **carrusel cilíndrico** de páginas curvas girando alrededor de la cámara (fondo claro) | Páginas curvadas sobre un cilindro; rotación continua; cambio de fondo como acento |
| 12.8–15 s | Las páginas vuelan hacia la cámara (whip) y volvemos al negro con scroll vertical grande | Escala rápida + blur; corte en el beat |
| 15–17 s | Webs de colores (violeta, blanca con foto) planas, con empuje de cámara | Láminas planas centradas, push-in lento |
| 17–21.5 s | Web de arquitectura; luego mosaico 2×2 de páginas inclinadas + "New / Level / Design" | Mosaico en perspectiva + bloque de texto apilado a la derecha |
| 21.5–24 s | **Primer plano extremo** de la web inclinada con profundidad de campo (look macro) | Escala grande, inclinación fuerte, blur en los bordes; la cámara se desliza |
| 24–28.8 s | "Special for videohive.net" y cierre con el logo | Texto pequeño y logo con el mismo amarillo del inicio |

## Qué lo hace atractivo
1. **El color de marca es el hilo conductor:** el amarillo abre, transiciona y cierra; cada cambio de escena "pasa por" la marca.
2. **Morphing de formas:** círculo → barra de búsqueda → rectángulo → web. Todo se transforma en vez de cortarse.
3. **Contraste:** las interfaces blancas y de color resaltan sobre el negro.
4. **Perspectiva cinematográfica:** ángulos fuertes, primeros planos macro con desenfoque y carrusel cilíndrico.
5. **Tipografía de impacto mínima:** 2–3 palabras gruesas apiladas, nunca párrafos.
6. **Cortes en el beat:** cada cambio coincide con un golpe de la música.

## Cómo replicarlo en Remotion
- Morph de forma: un `div` amarillo animando `width`, `height`, `borderRadius` y posición con `spring`.
- Revelación: la web dentro de un contenedor con `clipPath: inset()` que sigue al rectángulo amarillo.
- Levantar en 3D: `perspective(1400px) rotateX(...)` con origen en el borde inferior.
- Look macro: escala 2–3×, `rotateX/rotateY` fuertes y un degradado de blur en los bordes (dos capas: una nítida enmascarada al centro y otra desenfocada).
