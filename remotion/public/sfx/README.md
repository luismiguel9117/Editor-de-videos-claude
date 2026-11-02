# Biblioteca local de efectos de sonido

Carpetas: `cinematic-whooshes`, `bass-impacts`, `risers`, `transitions`, `ui-sounds`,
`product-sounds`, `ambient-sounds`, `nature`, `sports`.

- Todos los archivos están en WAV PCM 16 bit, 48 kHz.
- Cada `<sonido>.wav` tiene al lado un `<sonido>.license.json` con licencia, autor y fuente.
- `LICENSES.md` resume todas las licencias (se genera solo).
- El catálogo con búsqueda está en `src/sfx/catalog.json`.

## Añadir sonidos

```bash
npm run sfx:import -- manifest.json   # descarga, convierte a WAV y cataloga
npm run sfx:search -- whoosh --category=cinematic-whooshes --commercial
```

## Usar en Remotion

```tsx
import { Sfx, SfxCue, SfxTrack } from "./sfx";

<Sfx id="bass-impacts/deep-hit" at={60} />                 // un sonido concreto
<SfxCue category="risers" at={0} />                          // elige uno de la categoría
<SfxTrack events={[{ type: "logo-reveal", at: 60 }]} />      // pista automática por eventos
```

Los efectos de `@remotion/sfx` también están en el catálogo (id `remotion/<nombre>`), pero su
licencia por sonido no está documentada: no se marcan como aptos para anuncios comerciales.
