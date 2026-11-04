import { loadFont } from "@remotion/fonts";
import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, random, staticFile, useCurrentFrame } from "remotion";
import "../../brand/fonts";
import { BlueWaves, Grain } from "../../brand/elements";
import { useFloat } from "../../brand/motion";
import { C as LM, F as LMF } from "../../brand/tokens";

// Presentación de la web de KALPA (kalpa.pe). Colores y tipografía de KALPA (theme.css del repo
// HERO-KALLPA); solo la firma final usa la marca luismiguel.pe.

export const K = {
  bg: "#0c0e12", // Obsidian Deep
  surface: "#16181f",
  gold: "#fdb515", // Solar Kinetic Gold
  red: "#981608", // rojo del hero
  redDeep: "#5a0c05",
  text: "#f2f5f8",
  muted: "#9aa5b5",
};
const FG = "'Franklin Gothic', sans-serif";

for (const [file, weight, style] of [
  ["FRAHV.TTF", "900", "normal"],
  ["FRADM.TTF", "600", "normal"],
  ["FRADMIT.TTF", "600", "italic"],
] as const) {
  loadFont({ family: "Franklin Gothic", url: staticFile(`fonts/kalpa/${file}`), weight, style });
}

const easeOut = Easing.bezier(0.16, 1, 0.3, 1);
const ease = (f: number, a: number, b: number) =>
  interpolate(f, [a, b], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: easeOut });
const W = (n: string) => staticFile(`kalpaweb/${n}.png`);

/** Fondo KALPA: obsidiana con luz dorada/roja difusa y chispas doradas */
const KalpaBg: React.FC<{ warm?: number; children: React.ReactNode }> = ({ warm = 1, children }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: K.bg, overflow: "hidden" }}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(70% 45% at ${50 + Math.sin(f / 50) * 6}% 55%, rgba(152,22,8,${0.55 * warm}) 0%, rgba(253,181,21,${0.12 * warm}) 35%, rgba(12,14,18,0) 75%)`,
          filter: "blur(40px)",
        }}
      />
      {new Array(18).fill(0).map((_, i) => {
        const t = ((f + random(`o${i}`) * 300) % 300) / 300;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: random(`x${i}`) * 1080 + t * 30,
              top: 1940 - t * 2100,
              width: 3 + random(`s${i}`) * 4,
              height: 3 + random(`s${i}`) * 4,
              borderRadius: "50%",
              background: K.gold,
              opacity: interpolate(t, [0, 0.15, 0.85, 1], [0, 0.8, 0.8, 0]),
              boxShadow: "0 0 10px rgba(253,181,21,.9)",
            }}
          />
        );
      })}
      {children}
      <Grain opacity={0.07} />
    </AbsoluteFill>
  );
};

/** Página real de la web como lámina flotante en 3D (sin navegador ni marco) */
const Sheet: React.FC<{
  src: string;
  x: number;
  y: number;
  w: number;
  h: number;
  /** recorte del screenshot: posición del contenido (object-position) */
  pos?: string;
  zoom?: number;
  rx?: number;
  ry?: number;
  rz?: number;
  seed?: number;
  z?: number;
  dim?: number;
}> = ({ src, x, y, w, h, pos = "50% 0%", zoom = 1, rx = 0, ry = 0, rz = 0, seed = 0, z = 0, dim = 0 }) => {
  const fl = useFloat(seed, 10, 4);
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: w,
        height: h,
        transform: `perspective(1800px) translateZ(${z}px) translateY(${fl.y}px) rotateX(${rx}deg) rotateY(${ry + fl.rot}deg) rotateZ(${rz}deg)`,
        boxShadow: "0 50px 90px rgba(0,0,0,.65), 0 0 60px rgba(253,181,21,.12)",
        overflow: "hidden",
        borderRadius: 6,
      }}
    >
      <Img
        src={src}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: pos,
          transform: `scale(${zoom})`,
          transformOrigin: pos,
          filter: dim ? `brightness(${1 - dim})` : undefined,
        }}
      />
    </div>
  );
};

/** Palabra gigante en Franklin Gothic Heavy, cursiva y en mayúsculas, como los títulos de la web */
const Giant: React.FC<{ children: React.ReactNode; top: number; size: number; color?: string; style?: React.CSSProperties }> = ({
  children,
  top,
  size,
  color = K.gold,
  style,
}) => {
  const f = useCurrentFrame();
  return (
    <div
      style={{
        position: "absolute",
        top,
        width: "100%",
        textAlign: "center",
        fontFamily: FG,
        fontWeight: 900,
        fontStyle: "italic",
        fontSize: size,
        lineHeight: 0.9,
        letterSpacing: "-0.02em",
        textTransform: "uppercase",
        color,
        whiteSpace: "nowrap",
        textShadow: "0 10px 40px rgba(0,0,0,.45)",
        ...style,
        transform: `translateX(${f * 0.3}px) skewX(-6deg) ${style?.transform ?? ""}`,
        opacity: ease(f, 2, 16),
      }}
    >
      {children}
    </div>
  );
};

/** Frase pequeña (Franklin Gothic Demi) */
const Line: React.FC<{ children: React.ReactNode; top?: number }> = ({ children, top = 230 }) => {
  const f = useCurrentFrame();
  const p = ease(f, 0, 14);
  return (
    <div
      style={{
        position: "absolute",
        left: 80,
        right: 80,
        top,
        fontFamily: FG,
        fontWeight: 600,
        fontSize: 54,
        lineHeight: 1.15,
        color: K.text,
        opacity: p,
        filter: `blur(${(1 - p) * 10}px)`,
        transform: `translateX(${f * 0.12}px)`,
      }}
    >
      {children}
    </div>
  );
};

// 1 · "Este mes diseñé la nueva web de KALPA." — el intro real en celular, a sangre
export const W1Intro: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <KalpaBg>
      <AbsoluteFill style={{ transform: `scale(${1.08 + f * 0.0008})` }}>
        <Img src={W("m-intro")} style={{ width: 1080, height: 2341, marginTop: -200 }} />
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "linear-gradient(to top, #0c0e12 0%, #0c0e12 24%, rgba(12,14,18,.85) 34%, rgba(12,14,18,0) 50%)" }} />
      <Line top={1440}>Este mes diseñé la nueva web de</Line>
      <Giant top={1530} size={210} color={K.gold}>
        kalpa.pe
      </Giant>
    </KalpaBg>
  );
};

// 2 · "Una web que se siente como la marca: con energía." — los 3 slides del hero en abanico
export const W2Energia: React.FC = () => (
  <KalpaBg>
    <Line>Una web que se siente como la marca: con</Line>
    <Sheet src={W("d-hero-3")} x={-360} y={560} w={1240} h={775} ry={28} rz={-4} seed={2} dim={0.35} />
    <Sheet src={W("d-hero-2")} x={-120} y={690} w={1240} h={775} ry={18} rz={-2} seed={1} dim={0.15} />
    <Giant top={470} size={230}>
      energía
    </Giant>
    <Sheet src={W("d-hero-1")} x={120} y={860} w={1240} h={775} ry={10} seed={0} />
  </KalpaBg>
);

// 3 · "Con una tienda pensada para comprar en dos clics." — tarjetas de precio reales, de cerca
export const W3Tienda: React.FC = () => (
  <KalpaBg warm={0.7}>
    <Line>Con una tienda pensada para comprar en dos clics.</Line>
    <Giant top={440} size={250} color={K.text}>
      tienda
    </Giant>
    <Sheet src={W("m-products")} x={110} y={700} w={860} h={1180} pos="50% 62%" zoom={1} rz={-3} ry={-8} seed={1.4} />
  </KalpaBg>
);

// 4 · "Que cuenta de dónde viene cada grano." — origen VRAEM y energía natural en parallax
export const W4Origen: React.FC = () => (
  <KalpaBg>
    <Line>Que cuenta de dónde viene cada grano.</Line>
    <Sheet src={W("d-energy")} x={180} y={1180} w={1100} h={688} ry={-14} seed={3} dim={0.2} />
    <Giant top={560} size={250}>
      origen
    </Giant>
    <Sheet src={W("d-origin")} x={-200} y={820} w={1100} h={688} ry={14} rz={2} seed={2.2} />
  </KalpaBg>
);

// 5 · "Y que se ve igual de bien en tu celular." — la versión móvil real, láminas altas
export const W5Movil: React.FC = () => (
  <KalpaBg>
    <Line>Y que se ve igual de bien en tu</Line>
    <Sheet src={W("m-reels")} x={520} y={740} w={500} h={1084} ry={-18} rz={3} seed={4} dim={0.25} />
    <Giant top={400} size={225} color={K.text}>
      celular
    </Giant>
    <Sheet src={W("m-origin")} x={70} y={680} w={560} h={1214} ry={12} rz={-3} seed={3.3} />
  </KalpaBg>
);

// 6 · "Cinco páginas, un solo sistema." — las páginas internas en cascada
export const W6Paginas: React.FC = () => {
  const pages = ["page-promociones", "page-nosotros", "page-productos", "page-producto"];
  return (
    <KalpaBg>
      <Line>Un solo sistema en</Line>
      <Giant top={330} size={200}>
        5 páginas
      </Giant>
      {pages.map((p, i) => (
        <Sheet
          key={p}
          src={W(p)}
          x={-260 + i * 120}
          y={650 + i * 230}
          w={1100}
          h={688}
          ry={24 - i * 4}
          rz={-6 + i * 1.5}
          seed={i * 1.3}
          dim={(3 - i) * 0.12}
        />
      ))}
    </KalpaBg>
  );
};

// 7 · "Lista para vender en Shopify." — el carrito real abierto
export const W7Shopify: React.FC = () => (
  <KalpaBg warm={0.6}>
    <Line>Lista para vender en</Line>
    <Giant top={330} size={230} color={K.text}>
      Shopify
    </Giant>
    <Sheet src={W("page-producto")} x={-420} y={900} w={1200} h={750} pos="0% 0%" ry={20} rz={-3} seed={5.5} dim={0.35} />
    <Sheet src={W("d-cart")} x={300} y={720} w={720} h={900} pos="100% 0%" zoom={1} ry={-12} rz={2} seed={5} />
  </KalpaBg>
);

// 8 · Firma con la marca luismiguel.pe (azul y negro)
export const W8Firma: React.FC = () => {
  const f = useCurrentFrame();
  const p = ease(f, 0, 20);
  return (
    <AbsoluteFill>
      <BlueWaves />
      <div
        style={{
          position: "absolute",
          left: 80,
          right: 80,
          top: 1000,
          color: LM.ink,
          opacity: p,
          filter: `blur(${(1 - p) * 14}px)`,
          transform: `translateY(${(1 - p) * 30 - f * 0.15}px) scale(${1 + f * 0.0005})`,
          lineHeight: 0.9,
        }}
      >
        <div style={{ fontFamily: LMF.sans, fontWeight: 500, fontSize: 300, letterSpacing: "-0.04em" }}>Luis</div>
        <div style={{ fontFamily: LMF.serif, fontStyle: "italic", fontSize: 330, textAlign: "right", letterSpacing: "-0.03em" }}>
          Miguel<span style={{ color: LM.red }}>.</span>
        </div>
        <div style={{ fontFamily: LMF.mono, fontSize: 34, letterSpacing: "0.06em", color: LM.ink, opacity: 0.75, marginTop: 50 }}>
          kalpa.pe
        </div>
      </div>
      <Grain opacity={0.08} />
    </AbsoluteFill>
  );
};

export const KALPAWEB_SCENES = [
  { id: "KWeb-1-Intro", component: W1Intro },
  { id: "KWeb-2-Energia", component: W2Energia },
  { id: "KWeb-3-Tienda", component: W3Tienda },
  { id: "KWeb-4-Origen", component: W4Origen },
  { id: "KWeb-5-Movil", component: W5Movil },
  { id: "KWeb-6-Paginas", component: W6Paginas },
  { id: "KWeb-7-Shopify", component: W7Shopify },
  { id: "KWeb-8-Firma", component: W8Firma },
];
