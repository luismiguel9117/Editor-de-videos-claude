# Referencia 2 — "NeuraFlow" (Zelios, video de marketing SaaS)

| Dato | Valor |
|---|---|
| Duración | 20.1 s · 30 fps · 16:9 |
| Fondo | azul noche casi negro con un **haz de luz volumétrico** desde arriba y un **horizonte curvo brillante** (planeta) abajo |
| Paleta | una sola familia de azules (#0a1230 → #3d7bff) + un destello rosa/violeta al final |
| Tipografía | sans fina y elegante, pequeña; el logotipo es lo único grande |
| Material | interfaz en **glassmorphism** (paneles translúcidos con brillo en el borde) |
| Cortes duros | ninguno: todo son transformaciones continuas |
| Audio | electrónica constante, −9.8 LUFS, golpes suaves en cada transformación |

## Estructura (beat por beat)

| Tiempo | Qué pasa | Cómo está hecho |
|---|---|---|
| 0–1.5 s | Logo "✦ NeuraFlow" aparece al centro; la estrella gira y se asienta; haz de luz y horizonte detrás | Fade + escala leve; la estrella rota y frena con ease-out; luz con gradientes radiales y blur |
| 1.5–2.5 s | El logo baja hacia el horizonte; de detrás del horizonte **sube** el dashboard | Cámara que "mira hacia arriba"; el panel aparece enmascarado por la curva del horizonte |
| 2.5–5 s | Título "Smart Control / Customized Dashboard" con un orbe brillante encima; el dashboard **se arma solo** | Cada elemento entra en cascada (chips, tarjetas, botones); el medidor cuenta 76 % → 97 %; tarjetas laterales flotan a distintas profundidades (parallax) |
| 5–7 s | La cámara se aleja; aparece el logotipo gigante "NeuraFlow" detrás, cortado arriba y con bajo contraste | Profundidad de campo: fondo y laterales desenfocados, el panel central nítido |
| 7–8.5 s | Dentro del panel los gráficos crecen | Barras con `scaleY` escalonado |
| 8.5–10.5 s | Círculo "New Updates": anillos que se expanden con íconos orbitando | Rotación de un contenedor + íconos que contrarrotan; el texto se revela con máscara |
| 10.5–13 s | Chat: se escribe "How NeuraFlow AI can help?"; sube la burbuja; puntos de "escribiendo"; la respuesta se despliega | Tipeo + layout animado; la tarjeta de respuesta crece en altura con las líneas apareciendo |
| 13–16 s | Tres tarjetas de vidrio se ordenan en un **cilindro** que gira | Carrusel 3D (`rotateY` por tarjeta alrededor de un eje) con órbita de cámara |
| 16–17 s | Las tarjetas se funden en una **estrella de 4 puntas** con brillo rosa | Morph de forma + destello (bloom) |
| 17–20 s | La estrella se convierte en el ícono del logo; cierre "✦ NeuraFlow — Discover NeuraFlow today" | Continuidad de forma: lo último que se ve es lo mismo que abrió el video |

## Qué lo hace atractivo
1. **Un universo propio:** la misma luz (haz + horizonte) está en todas las escenas; todo parece ocurrir en un mismo lugar.
2. **La interfaz se construye frente a ti:** nada aparece completo; cada pieza entra en orden y da sensación de producto "vivo".
3. **Continuidad de formas (match cuts):** logo → horizonte → dashboard; tarjetas → estrella → logo. Sin cortes.
4. **Profundidad:** profundidad de campo, parallax de tarjetas laterales y logotipo gigante al fondo.
5. **Datos que se mueven:** números que cuentan y barras que crecen hacen creíble el producto.
6. **Restricción de color:** un solo tono dominante; el único color distinto (rosa) marca el clímax.

## Cómo replicarlo en Remotion
- Luz: varios `radial-gradient` con `filter: blur()` y `mixBlendMode: "screen"`; un arco brillante con `border-top` + glow.
- Glassmorphism: `backdropFilter: blur(20px)` + borde 1 px translúcido + brillo en la arista superior.
- Construcción de UI: separar la interfaz en capas y animar cada una con `spring` y retraso escalonado.
- Profundidad de campo: `filter: blur()` según la distancia en Z de cada capa.
- Cilindro: contenedor con `transformStyle: "preserve-3d"`, cada panel con `rotateY(i·ángulo) translateZ(radio)`.
