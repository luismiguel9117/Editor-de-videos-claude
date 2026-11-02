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

## Skills para Claude Code

`.claude/skills/` incluye las skills oficiales de HyperFrames (`hyperframes`, `hyperframes-cli`,
`hyperframes-registry`, `media-use`), así Claude Code las carga al abrir este repositorio.

También incluye las skills oficiales de Remotion (`remotion-*`), instaladas con
`npx skills add remotion-dev/skills` y registradas en `skills-lock.json`.
