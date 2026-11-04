# Recursos, dispositivos y movimientos de cámara de las referencias

Inventario de **todo lo que aparece** en las 3 referencias y **cómo lo recreamos en Remotion**.
Leyenda: R1 = New Website Promo · R2 = NeuraFlow · R3 = Website Design Promo.

## 1. Dispositivos y contenedores

| Recurso | Dónde | Cómo se ve | Cómo lo recreamos |
|---|---|---|---|
| **Laptop plateada** (tipo MacBook) | R1 7–10 s, 22–26 s | Aluminio claro, bisel negro fino, base vista en 3/4, sombra suave en el piso | Componente `Laptop`: pantalla (captura o video real) + bisel + base dibujados en CSS/SVG con degradados metálicos; en 3D con `perspective` y `rotateX/Y` |
| **iPhone** (varios en fila) | R1 26–28 s, 34–38 s | Marco redondeado claro, isla dinámica, pantalla con app; 3–4 en escalera con desfase | Componente `Phone`: rectángulo con `borderRadius` ~ 14 % del ancho, marco de 2 capas, notch; fila con `stagger` de rotación |
| **Tablet / iPad** | R1 23–31 s | Marco blanco grueso, esquinas grandes, inclinado | Variante de `Phone` con otras proporciones |
| **Tarjeta de página sin dispositivo** | R1 4–7 s, 10–19 s · R3 todo | Captura de una sección con esquinas redondeadas y sombra difusa, sin marco | `Sheet` actual (ya existe) |
| **Ventana de navegador minimalista** | R3 | Barra superior finita con los 3 puntos de macOS y la url, casi invisible | `BrowserBar`: tira de 18 px con 3 círculos y url en gris |
| **Barra de búsqueda / dirección** | R1 0–4 s · R3 0.7–2.5 s | Pastilla blanca, ícono de lupa, texto tecleado, botón de color | `SearchBar` con tipeo letra por letra y cursor; en R3 el botón es el color de marca |
| **Paneles de vidrio (glassmorphism)** | R2 | Paneles translúcidos azules, borde brillante de 1 px, blur detrás | `GlassPanel`: `backdropFilter: blur()`, borde translúcido, brillo en la arista |
| **Chips y tarjetas flotantes de UI** | R2 2.5–7 s | Pastillas ("Calendar", "Chat"), mini tarjetas con datos, a distintas profundidades | Recortes de la propia UI de KALPA (precio, "Agregar", sellos) flotando con parallax |
| **Cursor del mouse** | (implícito en R1/R3) | Flecha blanca con sombra que hace clic | `Cursor` (ya existe) con animación de clic (escala 1 → 0.85 → 1 + onda) |

## 2. Elementos gráficos y de luz

| Recurso | Dónde | Cómo lo recreamos |
|---|---|---|
| **Haz de luz volumétrico** desde arriba | R2 toda | 2–3 `radial-gradient` alargados con blur y `mixBlendMode: screen`; pulso lento de opacidad |
| **Horizonte/planeta brillante** (arco) | R2 0–5 s, cierre | Círculo enorme con `border-top` luminoso + glow; la UI sale de detrás (máscara) |
| **Orbe/estrella de marca** | R2 (✦), R3 (círculo amarillo) | Forma de marca que gira y se asienta; en KALPA: el **rayo ⚡ del logo** o un círculo dorado |
| **Anillos con íconos en órbita** | R2 8.5–10.5 s | Contenedor que rota + íconos que contrarrotan; íconos de KALPA (granos, rayo, montaña, envío) |
| **Forma de color que hace de transición** (morph) | R3 0–3 s | `div` dorado que cambia `width/height/borderRadius` con `spring`: círculo → barra → franja que revela la web |
| **Logotipo gigante de fondo, cortado** | R2 5–8 s | Texto "KALPA" enorme, bajo contraste, detrás de la UI y desenfocado |
| **Destello/bloom** | R2 16–17 s | `Bloom` (ya existe) en dorado/rojo |
| **Números que cuentan y barras que crecen** | R2 | `interpolate` sobre el precio (S/ 7.90), "280 mg", "24 h" |
| **Texto que se teclea** | R1, R2 | `slice` del texto por frame + cursor |
| **Fondo plano limpio** | R1 (claro), R3 (negro) | Obsidiana KALPA #0c0e12 con grano sutil |

## 3. Movimientos de cámara

| Movimiento | Dónde | Cómo se siente | Cómo lo hacemos |
|---|---|---|---|
| **Push-in lento** (acercamiento) | todas | Calma, atención | `scale` 1 → 1.06 durante la escena |
| **Pull-back / revelación** | R1 7 s (tarjeta → laptop), R2 5 s | Descubrir el contexto | `scale` de 1.6 → 1 con el entorno apareciendo alrededor |
| **Órbita** alrededor del dispositivo | R1 22–26 s, R2 13–16 s | Objeto 3D "real" | `rotateY` del grupo de −25° → 25° con `perspective` |
| **Dolly lateral** sobre un muro de pantallas | R1 31–34 s | Escala, abundancia | Mosaico inclinado que se traslada en X |
| **Grúa / tilt** (mirar hacia arriba) | R2 1.5–2.5 s | Aparición épica | `translateY` del mundo + `rotateX` leve |
| **Whip pan** con desenfoque de movimiento | R1 20 s, R3 12.8 s | Energía, transición | Traslación rápida (8–10 cuadros) + `blur` direccional |
| **Macro con profundidad de campo** | R3 21.5–24 s | Cine, detalle premium | Escala 2–3×, inclinación fuerte, capa desenfocada en los bordes y nítida al centro |
| **Scroll dentro de la página** | R1 4–9 s, R3 3–6 s | Usar la web de verdad | Video capturado de la web real o captura de página completa desplazada |
| **Levantar en 3D desde el plano** | R3 2.5–3.2 s | La web "se para" frente a ti | `rotateX` 80° → 15° con origen abajo |
| **Carrusel cilíndrico** | R2 13–16 s, R3 7.4–12.8 s | Sistema, variedad | Páginas en `rotateY(i·α) translateZ(r)` girando |

## 4. Efectos de postproducción

- **Desenfoque de movimiento** en todo lo rápido (blur proporcional a la velocidad).
- **Profundidad de campo:** lo lejano desenfocado, el foco nítido.
- **Sombras suaves y largas** bajo dispositivos y tarjetas (nunca sombras duras).
- **Easing largo:** entradas rápidas que frenan muy suave (expo-out); nada lineal.
- **Overshoot leve** en formas de marca (escala 1.1 → 1).

## Nota importante para KALPA

Las referencias usan **laptops, celulares y tablets**. Antes, Luis pidió que el producto no fuera
enmarcado en tarjetas ni marcos. Hay que confirmar con él si en esta presentación se usan
dispositivos (como en las referencias) o se mantienen las láminas de página a sangre.
