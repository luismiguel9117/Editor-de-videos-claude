# Guía de estilo de video — luismiguel.pe

Guía única para todos los videos de **Luis Miguel** (Web & Product Designer, Lima).
Se aplica a Remotion (`remotion/`) y HyperFrames (`hyperframes/`). Si una decisión no está
aquí, elige la opción más **sobria**: la marca es *"type and restraint"*.

> **Referencia de edición:** promo de portafolio de 24 s (TikTok, @hatsu6961). Tomamos su
> **ritmo, estructura y lenguaje de movimiento**, no su marca, textos ni logos.

---

## 1. La idea en una frase

**Tipografía que aparece palabra por palabra sobre fondo claro → un golpe de transición →
el trabajo flotando en 3D sobre negro con un brillo cálido → una pregunta → un cierre con
la firma "Luis *Miguel*."**

Dos mundos que se alternan:

| Mundo | Fondo | Para qué |
|---|---|---|
| **Papel** | `#eae6de` (paper) | Frases, preguntas, la voz de Luis Miguel |
| **Brasa** | `#0a090f` (surface) + brillo rojo/naranja | El trabajo: pantallas, proyectos, cards |

El contraste papel ↔ brasa *es* el montaje. Nunca más de 2 escenas seguidas en el mismo mundo.

---

## 2. Anatomía de la referencia (lo que copiamos)

Medido en el video de referencia (24 s de contenido, 29.97 fps, música a −16.6 LUFS integrados):

| Tiempo | Mundo | Qué pasa | Cómo se mueve |
|---|---|---|---|
| 0.0–3.0 s | Papel | "Welcome" → "to my" → "Portfolio" | Cada palabra entra con desenfoque → nítida, ligero salto de escala. La palabra clave va en color de acento. La anterior sale con blur antes de la siguiente. |
| 3.0–4.2 s | Golpe | Flash a color sólido → negro con una **línea de onda brillante** horizontal | Corte seco + whip. La palabra clave queda sobre el negro un instante. |
| 4.2–8.0 s | Brasa | Una card pequeña con **retícula de líneas discontinuas** crece y se curva (efecto barril/ojo de pez) hasta llenar el cuadro; dentro, el trabajo; la retícula se divide en 4 paneles | Zoom-in continuo, la curvatura aumenta con la velocidad. Paneles se deslizan como ventanas. |
| 8.0–10.0 s | Negro | "Got a project in mind?" | Texto pequeño y quieto; un **barrido de luz blanca suave** cruza el fondo en diagonal. |
| 10.0–17.4 s | Brasa | **Cards 3D apiladas** (capturas de proyectos) flotando con *glow* naranja, entran en abanico, cámara se mueve entre ellas | Parallax por profundidad, rotación leve en Y, *bloom* en los bordes. Picos de audio en 10.8, 14.4 y 16.2 s = nueva card al frente. |
| 17.4–18.0 s | Brasa | Primer plano de una card | Empujón de cámara hacia la card. |
| 18.0–21.0 s | Papel | "Let's bring your ideas" → "to" → "life" | Entra con **wipe de desenfoque desde la izquierda**. Mismo palabra-por-palabra; "life" en acento. Golpe de audio más fuerte del video en 18.0 s. |
| 21.0–24.0 s | Negro | Firma: nombre con un leve resplandor | Fade-in con glow, quieto, sin nada más. |

**Patrones clave a conservar**
- Escenas de **1.5–4 s**, cambio de mundo cada ~3–7 s.
- Texto siempre **centrado, corto (1–3 palabras por golpe)**, mucho aire alrededor.
- Un solo color de acento por frase, en **una** palabra.
- El trabajo nunca aparece plano: siempre en perspectiva, con profundidad y brillo.
- Cada cambio de escena va **sincronizado con un acento de audio**.

---

## 3. Marca luismiguel.pe (lo que cambiamos)

Tokens tomados de la web (`portafolio2/app/globals.css`, `app/layout.tsx`):

### Color

| Token | Hex | Uso en video |
|---|---|---|
| `surface` | `#0a090f` | Fondo del mundo Brasa y del cierre (en vez de negro puro) |
| `ink` | `#f0ecf4` | Texto sobre oscuro |
| `dim` | `#8e889b` | Texto secundario, retícula discontinua |
| `card` | `#13101c` | Fondo de cards oscuras |
| `paper` | `#eae6de` | Fondo del mundo Papel (en vez de blanco puro) |
| `paper-ink` | `#0a090f` | Texto sobre papel |
| `paper-dim` | `#646070` | Texto secundario sobre papel |
| `red` | `#ff3b30` | **Acento único**: palabra clave, punto de "Miguel.", flash de transición |
| `ember` | `rgba(255,130,80,.95)` | Brillo/glow de cards y chispas (sale de `.em-spark`) |
| `ember-hot` | `rgba(255,60,30,.9)` | Núcleo del glow |
| `violet` | `#5e45e3` / `rgba(140,35,210,.45)` | Solo como luz de fondo difusa (crestas de onda, gradiente "ember" de la web). Nunca en texto. |

Regla: **rojo = significado, naranja = luz, violeta = atmósfera.** La onda brillante de la
referencia (naranja) se hace con `ember` y se le puede sumar una cresta `violet` difusa,
como el fondo `GradientWaves` de la web.

### Tipografía

| Rol | Fuente | Estilo |
|---|---|---|
| Frases y UI | **Inter** 500 | `letter-spacing: -0.02em` |
| Palabra con alma | **Instrument Serif** *italic* | La palabra emocional de la frase ("*feeling*", "*life*", "*Miguel*") |
| Datos, etiquetas, año | **Space Mono** 400 | Mayúsculas, `letter-spacing: 0.08em`, pequeño |

La referencia usa una sola sans; nosotros sustituimos el "solo color" por **la mezcla
Inter + serif italic**, que es la firma de la web (hero: "Luis *Miguel*."). La palabra clave
puede ser serif italic, roja, o ambas — pero sólo una palabra por frase.

Tamaños (alto del texto respecto al alto del cuadro):

| Uso | 16:9 (1920×1080) | 9:16 (1080×1920) |
|---|---|---|
| Frase palabra por palabra | 64–96 px | 72–110 px |
| Pregunta en negro ("¿Tienes un proyecto en mente?") | 48–56 px | 56–64 px |
| Firma final | 140–200 px | 120–160 px |
| Etiqueta mono | 20–24 px | 24–28 px |

> La referencia usa texto muy pequeño (~2.5 % del alto). Lo subimos porque en luismiguel.pe
> la tipografía grande es protagonista, pero se mantiene el aire: el texto nunca ocupa más
> del 40 % del ancho salvo la firma.

### Textura
- **Grano** sutil encima de todo (como `.em-grain`, opacidad 0.04–0.06). En papel y en brasa.
- **Chispas** (`.em-spark`): 10–20 partículas subiendo lento en escenas Brasa. Nunca en Papel.
- **Halftone** (puntos 16 px, opacidad 0.25) sólo en el cierre si hace falta fondo.

### Voz y copy
- Tono: tranquilo, cercano, primera persona, frases cortas. Nada de "¡INCREÍBLE!" ni emojis.
- Idioma por defecto **español**; inglés sólo si el video es para el portafolio en inglés
  (la web está en inglés: "Mostly, I design websites.").
- Estructura de copy recomendada (adaptación de la referencia):
  1. **Bienvenida**: "Bienvenido" → "a mi" → "*portafolio*"
  2. **Pregunta**: "¿Tienes un proyecto en mente?"
  3. **Promesa**: "Hagamos que tus ideas" → "cobren" → "*vida*"
  4. **Firma**: "Luis *Miguel*." + `luismiguel.pe` en mono
- Variante en inglés tomada de la web: "Mostly, I design websites." /
  "Turning rough ideas into *feeling*."
- **Proyectos a mostrar** (de `data/portfolio.ts`): Velora House, VibeMove, Meridian,
  Auralee, Lunar. Imágenes en `portafolio2/public/images/*.webp`.

---

## 4. Movimiento

Valores para **30 fps** (Remotion `fps={30}`). En HyperFrames/GSAP usar los mismos tiempos en segundos.

### Texto palabra por palabra (mundo Papel)
| Fase | Duración | Valores |
|---|---|---|
| Entrada | 10–12 frames | `blur 12px → 0`, `opacity 0 → 1`, `scale 0.94 → 1`, `y +12px → 0` |
| Sostener | 14–24 frames | quieto (máx. 1 % de deriva de escala) |
| Salida | 6–8 frames | `blur 0 → 10px`, `opacity 1 → 0` |
| Solape | 2–4 frames | la siguiente palabra empieza antes de que termine la salida |

Easing: entrada `cubic-bezier(0.16, 1, 0.3, 1)` (expo out); salida `cubic-bezier(0.7, 0, 0.84, 0)` (expo in).
En Remotion: `spring({ fps, frame, config: { damping: 200 } })` para entradas.

### Cards 3D (mundo Brasa)
- `perspective: 1600px`; cards con `rotateY` entre −18° y 18°, `rotateX` ≤ 8°.
- Profundidad en 3–4 capas (`translateZ` −600 / −300 / 0 / +200 px); la de delante lleva más glow.
- Glow: `box-shadow: 0 0 40px rgba(255,130,80,.55), 0 0 120px rgba(255,60,30,.35)`.
- Esquinas `border-radius: 16px` (igual que la caja de medios del hero de la web).
- Cámara: deriva constante lenta (≈ 2–4 % del cuadro por segundo) + un empujón en cada acento.
- Entrada de cada card: 12–18 frames, desde atrás y con blur 8px → 0.

### Ventana con retícula (puente Papel → Brasa)
- Líneas discontinuas `dim` (2 px, guiones 10/8) que dividen el cuadro en 3×3.
- La celda central contiene el trabajo y crece hasta pantalla completa en 30–45 frames.
- Curvatura tipo barril que sube con la velocidad del zoom (máx. ~12 %) y vuelve a 0 al llegar.

### Lo que NO hacemos
- Rebotes exagerados, giros de 360°, textos que tiemblan, transiciones de plantilla (estrellas, cortinas, cubos).
- Más de un efecto llamativo a la vez.
- Movimiento lineal (siempre con easing).

---

## 5. Transiciones permitidas

| Transición | Cuándo | Duración | Sonido |
|---|---|---|---|
| **Corte seco** en el golpe musical | Cambio de mundo principal | 0 frames | `bass-impacts` |
| **Flash rojo** (`#ff3b30`, 2–3 frames) + whip | Papel → Brasa | 6–10 frames | `cinematic-whooshes` |
| **Wipe de desenfoque desde la izquierda** | Brasa → Papel | 8–12 frames | `transitions` |
| **Barrido de luz** blanca/ember en diagonal | Dentro de escenas negras | 30–60 frames | `risers` (suave) |
| **Empujón de cámara** a la card + corte | Fin de escena Brasa | 10–15 frames | `cinematic-whooshes` |
| **Fade con glow** | Sólo en la firma final | 15–20 frames | `bass-impacts` largo o nada |

Máximo **6 transiciones con sonido** en 30 s.

---

## 6. Sonido

Usa la biblioteca local (`remotion/public/sfx/`) y los componentes de `remotion/src/sfx/`.

- **Música**: base electrónica/ambiente minimal, sin voz, 100–120 BPM; corta en el golpe final.
- **Loudness final**: −14 LUFS integrados para redes (la referencia está en −16.6), picos ≤ −1 dBTP.
- **Música bajo SFX**: baja la música 4–6 dB durante 0.3 s en cada impacto.
- Sólo efectos con `license.commercialUse: true` en videos para clientes o anuncios.

Mapa evento → efecto (`SfxTrack`):

| Momento del video | Evento `SfxTrack` | Categoría |
|---|---|---|
| Aparece palabra clave | `text-in` | `cinematic-whooshes` (volumen 0.4–0.6) |
| Papel → Brasa | `scene-change` | `transitions` |
| Antes de la gran revelación (1–2 s) | `build-up` | `risers` |
| Nueva card al frente / firma | `logo-reveal` | `bass-impacts` |
| Captura de interfaz / clic | `button` | `ui-sounds` (volumen 0.3–0.5) |
| Fondo de escenas negras | `ambience` | `ambient-sounds` (volumen 0.15–0.25) |

---

## 7. Plantillas de duración

| Formato | Estructura (segundos) |
|---|---|
| **15 s** (anuncio / reel) | Bienvenida 0–2.5 · golpe 2.5–3 · cards 3–10 · promesa 10–13 · firma 13–15 |
| **24 s** (como la referencia) | Bienvenida 0–3 · golpe 3–4 · ventana 4–8 · pregunta 8–10 · cards 10–17.5 · promesa 18–21 · firma 21–24 |
| **30 s** (caso de estudio) | Bienvenida 0–3 · ventana 3–7 · proyecto A 7–13 · pregunta 13–15 · proyectos B–C 15–23 · promesa 23–27 · firma 27–30 |

Formatos de salida:

| Destino | Tamaño | Notas |
|---|---|---|
| Web / YouTube / Behance | 1920×1080, 30 fps | |
| Reels / TikTok / Shorts | 1080×1920, 30 fps | Zona segura: nada importante en el 12 % superior ni en el 20 % inferior, ni en el 15 % derecho (botones de la app) |
| Feed cuadrado | 1080×1080, 30 fps | |

---

## 8. Firma y cierre

- Siempre termina con **"Luis *Miguel*."**: "Luis" Inter 500, "Miguel" Instrument Serif italic, punto en `#ff3b30`.
- Debajo, `luismiguel.pe` en Space Mono, `dim`, pequeño.
- Fondo `surface` con grano; glow muy suave detrás del nombre (`0 0 24px rgba(240,236,244,.35)`).
- 2–3 s quietos. No agregar logos de redes ni marcas de agua.

---

## 9. Checklist antes de exportar

- [ ] Alterna Papel / Brasa; ninguna escena dura más de 4 s (salvo cards: máx. 7 s).
- [ ] Una sola palabra de acento por frase (rojo y/o serif italic).
- [ ] Colores sólo de la tabla de tokens; nada de blanco o negro puros.
- [ ] Inter + Instrument Serif + Space Mono; ninguna otra fuente.
- [ ] El trabajo aparece en perspectiva con glow, nunca plano y a pantalla completa sin más.
- [ ] Cada transición coincide con un acento de audio.
- [ ] SFX con licencia comercial verificada; −14 LUFS; picos ≤ −1 dBTP.
- [ ] Zonas seguras respetadas en vertical.
- [ ] Termina en la firma "Luis *Miguel*." + `luismiguel.pe`.
- [ ] Nada de la referencia (nombre "Hatsu", su copy, logos de TikTok) aparece en el video.
