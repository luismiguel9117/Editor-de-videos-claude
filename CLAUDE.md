# Editor de videos — luismiguel.pe

- **Antes de renderizar cualquier video, envía el guion al usuario y espera su aprobación**
  (escenas con tiempos, textos en pantalla, material visual, música y efectos de sonido).
- Proceso de motion design: primero el propósito del video y qué elementos reales del producto
  usar (y cuáles omitir); luego diseñar y aprobar **frames estáticos**; después el movimiento.
  Arrancar mostrando el producto, mantener la interfaz o el producto real en pantalla y revisar
  frames reales del render antes de darlo por terminado.
- Composición: el producto es parte de la escena (capturas con fondo transparente, a sangre,
  interactuando con la tipografía), nunca encerrado en tarjetas o marcos.

- Todo video que se cree o edite en este repositorio sigue `ESTILO-LUISMIGUEL.md`
  (colores, tipografía, movimiento, transiciones, sonido y cierre). Léelo antes de empezar.
- Motores: `remotion/` (React) y `hyperframes/` (HTML + GSAP).
- Efectos de sonido: usa la biblioteca de `remotion/public/sfx/` y los componentes de
  `remotion/src/sfx/` (`Sfx`, `SfxCue`, `SfxTrack`). Solo usa sonidos con licencia comercial
  verificada en videos para clientes.
- Recursos de la marca (imágenes de proyectos, textos): repositorio
  `luismiguel9117/portafolio2` (`public/images/`, `data/portfolio.ts`).
