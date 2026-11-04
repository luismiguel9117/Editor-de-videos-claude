# Referencia 1 — "New Website Promo" (Indra Ibrahim, plantilla de After Effects)

| Dato | Valor |
|---|---|
| Duración | 41.7 s · 30 fps · 16:9 |
| Fondo | gris muy claro (#f0f0f0), sin textura |
| Acento | azul (#3b6fe0) en texto y contorno de la barra de búsqueda |
| Tipografía | sans geométrica, peso medio; títulos cortos, subtítulo pequeño gris |
| Cortes duros | solo 2 (19.2 s y 22.6 s); todo lo demás es movimiento de cámara continuo |
| Audio | pista electrónica alegre, −9 LUFS (muy alta); el beat entra justo en la revelación de la web |

## Estructura (beat por beat)

| Tiempo | Qué pasa | Cómo está hecho |
|---|---|---|
| 0–1 s | Una barra de búsqueda (pastilla redondeada) entra inclinada y desenfocada y se asienta plana en el centro | Capa 3D con rotación X/Z que va a 0, blur → 0, ease-out largo |
| 1–3.5 s | Se escribe "Your website presentation" letra por letra con cursor | Animación de texto tipo máquina de escribir (~12 caracteres/s); el ícono de micrófono queda fijo |
| 3.5–4.5 s | Pausa; la web aparece **saliendo de debajo de la barra** | La captura de la web sube desde abajo (máscara), la barra se convierte en la barra de dirección |
| 4.5–7 s | Scroll real por la web: hero → cifras → secciones → propiedades | Captura de página completa larga desplazada en Y; tarjeta con esquinas redondeadas y sombra suave |
| 7–9 s | La tarjeta se convierte en la pantalla de una laptop, que aparece a su alrededor | La laptop entra con fade/escala alrededor de la pantalla; la cámara empuja despacio |
| 9–10 s | Texto "Presentation" + subtítulo + url a la izquierda; laptop se desplaza a la derecha | Composición asimétrica: texto en columna izquierda, dispositivo derecha |
| 10–19 s | Las secciones de la web desfilan como tarjetas planas en una cinta horizontal | Cada sección es una captura recortada; desplazamiento lateral constante con escalonado (stagger) y barridos entre tarjetas |
| 19.2 s | Corte a la palabra "presentation" grande y azul, sola | Beat de texto sobre fondo vacío (~1.5 s); coincide con un respiro del audio |
| 20–22.6 s | Otras webs como láminas isométricas inclinadas pasando en diagonal | Láminas con rotación ~ −30° X / 30° Z, paneo rápido con desenfoque de movimiento |
| 22.6–28 s | Laptop con web oscura; luego 3 celulares escalonados girando | Órbita de cámara alrededor del dispositivo; celulares con desfase de rotación |
| 28–34 s | Tablet/celular volando en 3D; muro isométrico de dashboards | Mosaico de pantallas en perspectiva, dolly lateral de cámara a través del muro |
| 34–38 s | Fila de 4 celulares con apps, deslizándose | Stagger horizontal, todos con la misma inclinación |
| 38–41.7 s | "Thank you for watching" en azul, fade out | Cierre tipográfico simple |

## Qué lo hace atractivo
1. **Gancho cotidiano:** la barra de búsqueda y el tipeo generan expectativa ("¿qué va a aparecer?").
2. **La web real se lee:** las capturas son grandes, nítidas y se recorren con scroll, como si alguien la usara.
3. **Una sola cámara continua:** casi no hay cortes; las cosas se transforman (barra → navegador → laptop).
4. **Sincronía con el audio:** silencio durante el tipeo y entra el beat justo cuando aparece la web.
5. **Mucho aire:** fondo claro vacío, sombras suaves, un solo color de acento.
6. **Ritmo variado:** tramos lentos de lectura (scroll) alternan con pasadas rápidas con desenfoque de movimiento.

## Cómo replicarlo en Remotion
- Barra de búsqueda: componente propio (pastilla + texto con `slice(0, n)` por frame + cursor parpadeante).
- Revelación desde la barra: `clipPath`/máscara que sube + `translateY`.
- Scroll real: captura de página completa (`fullPage`) desplazada con `interpolate` y easing, o captura en video con `capture-web.mjs`.
- Láminas isométricas: `transform: perspective() rotateX() rotateZ()`; desenfoque de movimiento con `filter: blur()` proporcional a la velocidad.
