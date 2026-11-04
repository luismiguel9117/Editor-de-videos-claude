# Apuntes: cómo se hace bien el carrusel cilíndrico de pantallas

Analizado cuadro a cuadro en la Referencia 3 (7.2–13 s) y la Referencia 2 (12.8–16.4 s).
Primer intento en KALPA web (borrador 1, segundo 21): cilindro chico, **convexo** (visto desde
fuera), que solo giraba → se veía plano y pobre.

## Referencia 3 — anillo cóncavo, la cámara está dentro
1. **Una sola página primero:** la página entra girando (rotateX) y se asienta **de frente,
   llenando casi todo el ancho** (~0.8 s). Se lee bien.
2. **La cámara se aleja y el anillo se revela:** aparecen las páginas vecinas a los lados,
   **curvadas hacia el espectador** (cóncavo). Banda horizontal a la altura de los ojos.
3. **Giro lateral continuo:** las páginas pasan de derecha a izquierda a velocidad constante
   (~1 página por segundo); hay espacios pequeños entre páginas.
4. **Profundidad:** las páginas laterales están más oscuras y con **desenfoque de movimiento**;
   la del centro siempre nítida.
5. **Salida:** empujón rápido hacia adelante (whip) a la siguiente escena.

## Referencia 2 — se construye en pasos y la cámara sube
1. Una tarjeta al centro → aparecen 2 detrás → **se envuelven** en un anillo.
2. La cámara **sube** (vista desde arriba) mientras el anillo gira y acelera.
3. Paneles con grosor y borde iluminado (vidrio).

## Reglas para recrearlo
- Cóncavo: `translateZ(R) rotateY(θ) translateZ(-R)` por página (gira alrededor de un punto
  delante de la página) para que los lados vengan hacia la cámara.
- Páginas grandes: la central ocupa ~75–85 % del ancho del cuadro.
- Construirlo en fases: 1 página → se abre el anillo (el ángulo entre páginas va de 0 al valor
  final) → giro continuo.
- Desenfoque y oscurecimiento proporcionales al ángulo respecto del centro.
- Giro con velocidad constante, sin rebotes; entrada y salida con ease.
