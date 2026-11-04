import React from "react";
import { AbsoluteFill, Img, OffthreadVideo, useCurrentFrame } from "remotion";

// Dispositivos y recursos inspirados en referencias/04-recursos-y-camara.md, dibujados en CSS 3D.

const ALU = "linear-gradient(180deg, #e9ecf0 0%, #c9ced6 45%, #aeb4bd 100%)";
const ALU_DARK = "linear-gradient(180deg, #b9bfc8 0%, #8d939c 100%)";

/** Contenido de pantalla: imagen (captura) o cualquier nodo (video capturado) */
type Screen = { src?: string; node?: React.ReactNode; pos?: string; scrollY?: number };

const ScreenContent: React.FC<Screen & { w: number; h: number }> = ({ src, node, pos = "50% 0%", scrollY = 0, w, h }) => (
  <div style={{ width: w, height: h, overflow: "hidden", position: "relative", background: "#000" }}>
    {node ??
      (src ? (
        <Img src={src} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: pos, transform: `translateY(${-scrollY}px)` }} />
      ) : null)}
    {/* reflejo de vidrio */}
    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(115deg, rgba(255,255,255,.10) 0%, rgba(255,255,255,0) 38%)" }} />
  </div>
);

/**
 * Laptop plateada en 3D real: pantalla + bisagra + base con teclado y trackpad.
 * `rx/ry/rz` orientan todo el equipo; `open` es el ángulo de la tapa (90 = recta).
 */
export const Laptop: React.FC<
  Screen & { x: number; y: number; w: number; rx?: number; ry?: number; rz?: number; open?: number; scale?: number }
> = ({ x, y, w, rx = 12, ry = -18, rz = 0, open = 100, scale = 1, ...screen }) => {
  const h = w * 0.625;
  const bezel = w * 0.018;
  const depth = h * 0.7;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: w,
        height: h,
        perspective: 2600,
        transform: `scale(${scale})`,
        transformOrigin: "50% 100%",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          transformStyle: "preserve-3d",
          transform: `rotateX(${rx}deg) rotateY(${ry}deg) rotateZ(${rz}deg)`,
        }}
      >
        {/* Base (se apoya en el piso, frente a la pantalla) */}
        <div
          style={{
            position: "absolute",
            left: -w * 0.04,
            top: h,
            width: w * 1.08,
            height: depth,
            transformOrigin: "50% 0%",
            transform: "rotateX(90deg)",
            background: ALU,
            borderRadius: `0 0 ${w * 0.03}px ${w * 0.03}px`,
            boxShadow: "0 0 0 1px rgba(0,0,0,.15) inset",
          }}
        >
          <div style={{ position: "absolute", left: "9%", right: "9%", top: "8%", height: "52%", background: "#2a2d33", borderRadius: 8, opacity: 0.85 }} />
          <div style={{ position: "absolute", left: "36%", right: "36%", top: "66%", height: "26%", background: ALU_DARK, borderRadius: 8, opacity: 0.6 }} />
        </div>
        {/* Tapa: bisel negro + pantalla, abierta `open` grados respecto de la base */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            transformOrigin: "50% 100%",
            transform: `rotateX(${90 - open}deg)`,
            background: "#0b0c0f",
            borderRadius: w * 0.025,
            padding: bezel,
            boxShadow: `0 0 0 ${w * 0.004}px #c2c7cf, 0 60px 120px rgba(0,0,0,.55)`,
          }}
        >
          <div style={{ borderRadius: w * 0.008, overflow: "hidden" }}>
            <ScreenContent {...screen} w={w - bezel * 2} h={h - bezel * 2} />
          </div>
        </div>
      </div>
    </div>
  );
};

/** Celular con marco de aluminio, isla dinámica y pantalla redondeada */
export const Phone: React.FC<Screen & { x: number; y: number; w: number; rx?: number; ry?: number; rz?: number }> = ({
  x,
  y,
  w,
  rx = 0,
  ry = 0,
  rz = 0,
  ...screen
}) => {
  const h = w * 2.06;
  const frame = w * 0.035;
  const r = w * 0.15;
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, height: h, perspective: 2000 }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: `rotateX(${rx}deg) rotateY(${ry}deg) rotateZ(${rz}deg)`,
          borderRadius: r,
          background: ALU,
          padding: frame * 0.6,
          boxShadow: "0 50px 100px rgba(0,0,0,.6), inset 0 0 0 1px rgba(255,255,255,.4)",
        }}
      >
        <div style={{ width: "100%", height: "100%", borderRadius: r * 0.9, background: "#000", padding: frame * 0.5, position: "relative" }}>
          <div style={{ borderRadius: r * 0.78, overflow: "hidden", width: "100%", height: "100%" }}>
            <ScreenContent {...screen} w={w - frame * 2.2} h={h - frame * 2.2} />
          </div>
          <div style={{ position: "absolute", top: frame * 1.4, left: "50%", width: w * 0.3, height: w * 0.085, marginLeft: -w * 0.15, background: "#000", borderRadius: 99 }} />
        </div>
      </div>
    </div>
  );
};

/** Barra de búsqueda: el texto se teclea (`typed` = nº de letras) con botón en color de marca */
export const SearchBar: React.FC<{
  text: string;
  typed: number;
  w: number;
  x: number;
  y: number;
  color: string;
  morph?: number;
  /** 0 → barra; 1 → franja dorada a todo el ancho (transición a la web) */
  flat?: number;
  press?: number;
}> = ({ text, typed, w: w0, x: x0, y: y0, color, morph = 1, flat = 0, press = 0 }) => {
  const frame = useCurrentFrame();
  const h = 112 - flat * 96;
  const w = w0 + (1080 - w0) * flat;
  const x = x0 * (1 - flat);
  const y = y0 + (112 - h) / 2;
  const cur = Math.floor(frame / 8) % 2 === 0;
  return (
    <div
      style={{
        position: "absolute",
        left: x + (w - h) * (1 - morph),
        top: y,
        width: h + (w - h) * morph,
        height: h,
        borderRadius: h,
        background: morph < 0.05 || flat > 0.5 ? color : "#ffffff",
        boxShadow: "0 30px 70px rgba(0,0,0,.5)",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 48,
          top: 0,
          height: h,
          display: "flex",
          alignItems: "center",
          fontFamily: "Inter, sans-serif",
          fontWeight: 500,
          fontSize: 46,
          color: "#0c0e12",
          opacity: morph * (1 - flat * 3),
          letterSpacing: "-0.01em",
        }}
      >
        {text.slice(0, typed)}
        <span style={{ display: "inline-block", width: 3, height: 50, marginLeft: 4, background: "#0c0e12", opacity: cur ? 1 : 0 }} />
      </div>
      <div
        style={{
          position: "absolute",
          right: 8,
          top: 8,
          width: h - 16,
          height: h - 16,
          borderRadius: "50%",
          background: color,
          opacity: 1 - flat * 3,
          transform: `scale(${1 - press * 0.12})`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#0c0e12" strokeWidth="2.6" strokeLinecap="round">
          <circle cx="10.5" cy="10.5" r="6.5" />
          <path d="M15.5 15.5 L21 21" />
        </svg>
      </div>
    </div>
  );
};

/** Luz de escena KALPA: haz desde arriba + horizonte brillante (universo propio, ref. 2) */
export const KalpaLight: React.FC<{ beam?: number; horizon?: number; color?: string }> = ({ beam = 1, horizon = 1, color = "253,181,21" }) => {
  const f = useCurrentFrame();
  const pulse = 0.85 + 0.15 * Math.sin(f / 22);
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(22% 60% at 50% -5%, rgba(${color},${0.5 * beam * pulse}) 0%, rgba(152,22,8,${0.28 * beam}) 40%, rgba(0,0,0,0) 75%)`,
          filter: "blur(30px)",
          mixBlendMode: "screen",
        }}
      />
      {horizon > 0 && (
        <div
          style={{
            position: "absolute",
            left: -900,
            right: -900,
            top: 1210,
            height: 2600,
            borderRadius: "50%",
            borderTop: `2px solid rgba(255,214,120,${0.55 * horizon})`,
            boxShadow: `0 -24px 80px rgba(${color},${0.28 * horizon}), inset 0 40px 120px rgba(152,22,8,${0.35 * horizon})`,
            background: "radial-gradient(50% 12% at 50% 0%, rgba(152,22,8,.35), rgba(7,8,10,0) 70%)",
          }}
        />
      )}
    </AbsoluteFill>
  );
};

/** Carrusel cilíndrico de páginas (ref. 2 y 3) */
export const Cylinder: React.FC<{ pages: string[]; w: number; h: number; y: number; angle: number; step?: number }> = ({
  pages,
  w,
  h,
  y,
  angle,
  step = 38,
}) => {
  const r = w / 2 / Math.tan(((step / 2) * Math.PI) / 180);
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: y, height: h, perspective: 1500 }}>
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: 0,
          width: w,
          height: h,
          marginLeft: -w / 2,
          transformStyle: "preserve-3d",
          transform: `translateZ(${-r}px) rotateY(${angle}deg)`,
        }}
      >
        {pages.map((p, i) => (
          <div
            key={p + i}
            style={{
              position: "absolute",
              inset: 0,
              transform: `rotateY(${-i * step}deg) translateZ(${r}px)`,
              backfaceVisibility: "hidden",
              borderRadius: 8,
              overflow: "hidden",
              boxShadow: "0 30px 80px rgba(0,0,0,.6)",
            }}
          >
            <Img src={p} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 0%" }} />
          </div>
        ))}
      </div>
    </div>
  );
};

/** Primer plano macro con profundidad de campo: capa desenfocada + capa nítida al centro */
export const Macro: React.FC<{ src: string; scale: number; ox: number; oy: number; rx?: number; ry?: number; rz?: number }> = ({
  src,
  scale,
  ox,
  oy,
  rx = 38,
  ry = 0,
  rz = -14,
}) => {
  const layer = (sharp: boolean) => (
    <AbsoluteFill
      style={{
        perspective: 1400,
        WebkitMaskImage: sharp ? "radial-gradient(42% 30% at 50% 52%, #000 55%, transparent 100%)" : undefined,
        maskImage: sharp ? "radial-gradient(42% 30% at 50% 52%, #000 55%, transparent 100%)" : undefined,
        filter: sharp ? undefined : "blur(10px)",
      }}
    >
      <Img
        src={src}
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          width: 1440,
          height: 900,
          marginLeft: -720 - ox,
          marginTop: -450 - oy,
          transform: `rotateX(${rx}deg) rotateY(${ry}deg) rotateZ(${rz}deg) scale(${scale})`,
          transformOrigin: `${720 + ox}px ${450 + oy}px`,
        }}
      />
    </AbsoluteFill>
  );
  return (
    <AbsoluteFill>
      {layer(false)}
      {layer(true)}
    </AbsoluteFill>
  );
};

/** Recorte real de la web flotando como pieza suelta (la UI "se arma", ref. 2) */
export const Piece: React.FC<{
  src: string;
  /** región del screenshot (px de la captura) */
  crop: { x: number; y: number; w: number; h: number };
  x: number;
  y: number;
  w: number;
  rx?: number;
  ry?: number;
  rz?: number;
  z?: number;
  glow?: string;
  radius?: number;
  /** video capturado de la misma página (mismo tamaño que la captura, 2160 px de ancho) */
  video?: string;
  style?: React.CSSProperties;
}> = ({ src, crop, x, y, w, rx = 0, ry = 0, rz = 0, z = 0, glow = "rgba(253,181,21,.18)", radius = 14, video, style }) => {
  const k = w / crop.w;
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, height: crop.h * k, perspective: 1600, ...style }}>
      <div
        style={{
          width: "100%",
          height: "100%",
          overflow: "hidden",
          borderRadius: radius,
          transform: `translateZ(${z}px) rotateX(${rx}deg) rotateY(${ry}deg) rotateZ(${rz}deg)`,
          boxShadow: `0 40px 90px rgba(0,0,0,.6), 0 0 60px ${glow}, inset 0 0 0 1px rgba(255,255,255,.08)`,
        }}
      >
        {video ? (
          <OffthreadVideo src={video} muted style={{ width: 2160 * k, maxWidth: "none", marginLeft: -crop.x * k, marginTop: -crop.y * k }} />
        ) : (
          <Img src={src} style={{ width: 2160 * k, maxWidth: "none", marginLeft: -crop.x * k, marginTop: -crop.y * k }} />
        )}
      </div>
    </div>
  );
};

/** Chip de vidrio con un dato (ref. 2) */
export const GlassChip: React.FC<{ x: number; y: number; label: string; value: string; color?: string }> = ({ x, y, label, value, color = "#fdb515" }) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      padding: "22px 30px",
      borderRadius: 22,
      background: "linear-gradient(135deg, rgba(255,255,255,.14), rgba(255,255,255,.04))",
      backdropFilter: "blur(18px)",
      boxShadow: "inset 0 1px 0 rgba(255,255,255,.35), inset 0 0 0 1px rgba(255,255,255,.12), 0 30px 60px rgba(0,0,0,.45)",
      fontFamily: "'Franklin Gothic', sans-serif",
    }}
  >
    <div style={{ fontSize: 24, fontWeight: 600, color: "rgba(242,245,248,.7)", letterSpacing: "0.08em", textTransform: "uppercase" }}>{label}</div>
    <div style={{ fontSize: 58, fontWeight: 900, fontStyle: "italic", color, marginTop: 4 }}>{value}</div>
  </div>
);
