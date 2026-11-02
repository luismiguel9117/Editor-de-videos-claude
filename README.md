# Editor de videos con Claude

Dos motores para crear video con código:

| Carpeta | Motor | Cómo se escribe un video |
|---|---|---|
| `remotion/` | [Remotion](https://www.remotion.dev) 4.0.540 | Componentes React + TypeScript |
| `hyperframes/` | [HyperFrames](https://hyperframes.heygen.com) 0.9.4 (HeyGen) | HTML + CSS + animaciones GSAP |

Requisitos: Node.js >= 22 y FFmpeg.

## Remotion

```bash
cd remotion
npm install
npm run dev                                   # Remotion Studio en el navegador
npx remotion render HelloWorld out/video.mp4  # Renderizar a MP4
```

Si Remotion no puede descargar su Chrome headless (redes restringidas), indica uno ya instalado:
`npx remotion render HelloWorld out/video.mp4 --browser-executable=/ruta/a/chrome`

## HyperFrames

```bash
cd hyperframes
npm install
npm run dev      # Vista previa en el navegador
npm run check    # Validar la composición
npm run render   # Renderizar a MP4
```

GSAP se sirve desde `hyperframes/vendor/gsap.min.js` (en vez del CDN) para que el render
funcione sin acceso a internet desde el navegador.

## Estilo de edición

Todos los videos siguen [`ESTILO-LUISMIGUEL.md`](ESTILO-LUISMIGUEL.md).

## Skills para Claude Code

`.claude/skills/` incluye las skills oficiales de HyperFrames (`hyperframes`, `hyperframes-cli`,
`hyperframes-registry`, `media-use`), así Claude Code las carga al abrir este repositorio.

También incluye las skills oficiales de Remotion (`remotion-*`), instaladas con
`npx skills add remotion-dev/skills` y registradas en `skills-lock.json`.

## Videos para redes (Remotion)

Composiciones en `remotion/src/videos/` (carpeta "Reels" en Remotion Studio), en formato vertical
1080×1920 para Reels de Instagram y Facebook:

| Composición | Contenido |
|---|---|
| `KallpaReel` | Carrusel 3D de latas y lata con efecto de electricidad para Kallpa (23 s) |

```bash
cd remotion
npx remotion render KallpaReel out/kallpa-reel.mp4
```

### Capturar animaciones web

`npm run capture -- capture/<escenario>.mjs` abre la página en Chromium, controla su reloj y la
captura cuadro por cuadro a 30 fps (sale fluida aunque la máquina sea lenta). El resultado va a
`remotion/public/footage/<nombre>.mp4`. Escenarios incluidos:

- `capture/kallpa.mjs`: repo `luismiguel9117/Kallpa` (`npm run dev`, puerto 5173)
- `capture/electricidad.mjs`: repo `luismiguel9117/ELECTRICIDAD` (`node server.js`, puerto 3000)

Para una página nueva, copia un escenario y cambia `url`, `hide` (elementos de interfaz a ocultar)
y `onFrame` (movimientos de ratón, clics o rueda en cada cuadro).

### Efectos de sonido propios

`npm run sfx:generate` sintetiza con ffmpeg 15 efectos (whooshes, impactos, risers, transiciones,
UI, zaps eléctricos, drone y una base rítmica de 110 BPM) y los añade al catálogo. Son obra propia,
así que se pueden usar en anuncios sin restricciones.
