---
name: prompts-opus-videos
description: Biblioteca de 703 prompts de videos hechos con Claude Opus 5.5 (motion graphics, explainers, 3D, interactivos) en referencias/awesome-opus5-5-videos. Úsala al planear un video nuevo (lanzamiento de producto, presentación de web, reel de marca, explainer, 3D) para buscar prompts parecidos y tomar su estructura, reglas de movimiento y método de render antes de escribir el guion.
---

# Prompts de videos de Opus 5.5

Fuente: https://github.com/yihui-dev/awesome-opus5-5-videos (MIT). Cada prompt es de su autor.
Copia local: `referencias/awesome-opus5-5-videos/` (`prompts/*.md` y `data/videos.json`).

## Buscar
```bash
cd remotion
npm run prompts -- product launch website --completos     # por palabras
npm run prompts -- --cat=3d --tag=threejs --n=10           # por categoría y tecnología
```
Categorías: motion (369), 3d (117), explainer (116), interactive (101).
Tecnologías: canvas, svg, threejs, shader, gsap, css, audio, particles, webgl, physics.

## Prompts clave para nuestro trabajo
| Prompt | Para qué |
|---|---|
| `twoclipping-551116` | Tráiler de lanzamiento por beats: reglas de movimiento y build muy precisas |
| `twoclipping-747965`, `twoclipping-496100` | Lanzamientos de producto con marca, wordmark y 3D |
| `howdevelop-733090` | Film de lanzamiento de 15 s con secuencia exacta y guardas de precisión |
| `redpersongpt-284430` | Anuncio de app basado en el producto real (capturar la UI real primero) |
| `gouthamjay8-910269`, `moritzkremb-466494` | Video de lanzamiento SaaS a partir de una web |
| `heyiamnick-119558` | Showreel de motion designer en bucle |

## Cómo usarlos (no copiar a ciegas)
1. Buscar 2–3 prompts del mismo tipo de video y leerlos completos.
2. Tomar su **estructura** (beats y tiempos), **reglas de movimiento** y **método de render/QA**.
3. Adaptar a la marca del cliente: colores, tipografía y recursos propios (ver skill
   `motion-premium`, regla de unidad gráfica). Nunca copiar su paleta ni sus recursos visuales.
4. Seguir el proceso del repo: guion → frames estáticos aprobados → animación → QA de cuadros.
