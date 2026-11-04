import { loadFont } from "@remotion/fonts";
import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import "../../brand/fonts";
import { BlueWaves, Grain } from "../../brand/elements";
import { Cylinder, GlassChip, KalpaLight, Macro, Phone, Piece, SearchBar } from "./devices";
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

// Formato 1080×1350 (4:5). Estilo anuncio de Apple: una cosa a la vez, mucho negro y una
// composición tipográfica distinta en cada beat. Protagonista: la web de escritorio.

const T: React.FC<{
  children: React.ReactNode;
  x?: number;
  y: number;
  size: number;
  color?: string;
  weight?: number;
  italic?: boolean;
  align?: "left" | "right" | "center";
  outline?: boolean;
  delay?: number;
  style?: React.CSSProperties;
}> = ({ children, x = 0, y, size, color = K.text, weight = 900, italic = true, align = "left", outline, delay = 0, style }) => {
  const f = useCurrentFrame();
  const p = ease(f, delay, delay + 18);
  return (
    <div
      style={{
        position: "absolute",
        left: align === "right" ? undefined : x,
        right: align === "right" ? x : undefined,
        width: align === "center" ? "100%" : undefined,
        top: y,
        textAlign: align,
        fontFamily: FG,
        fontWeight: weight,
        fontStyle: italic ? "italic" : "normal",
        fontSize: size,
        lineHeight: 0.86,
        letterSpacing: "-0.03em",
        textTransform: "uppercase",
        whiteSpace: "nowrap",
        color: outline ? "transparent" : color,
        WebkitTextStroke: outline ? `3px ${color}` : undefined,
        opacity: p,
        filter: `blur(${(1 - p) * 12}px)`,
        transform: `translateY(${(1 - p) * 28}px) translateX(${f * 0.25}px)`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

const Small: React.FC<{ children: React.ReactNode; x?: number; y: number; color?: string; size?: number; align?: "left" | "right" }> = ({
  children,
  x = 80,
  y,
  color = K.muted,
  size = 40,
  align = "left",
}) => (
  <T x={x} y={y} size={size} color={color} weight={600} italic={false} align={align} style={{ textTransform: "none", letterSpacing: "0", lineHeight: 1.2 }}>
    {children}
  </T>
);

/** Texto apilado de 2–3 palabras (ref. 3): bloque alineado a un lado */
const Stack: React.FC<{ lines: { t: string; gold?: boolean; outline?: boolean }[]; x?: number; y: number; size: number; align?: "left" | "right" }> = ({
  lines,
  x = 80,
  y,
  size,
  align = "left",
}) => (
  <>
    {lines.map((l, i) => (
      <T key={l.t} x={x} y={y + i * size * 0.9} size={size} color={l.gold ? K.gold : K.text} outline={l.outline} align={align} delay={i * 5}>
        {l.t}
      </T>
    ))}
  </>
);

const Stage: React.FC<{ children: React.ReactNode; horizon?: number; beam?: number }> = ({ children, horizon = 1, beam = 1 }) => (
  <AbsoluteFill style={{ background: "#07080a", overflow: "hidden" }}>
    <KalpaLight horizon={horizon} beam={beam} />
    {children}
    <Grain opacity={0.06} />
  </AbsoluteFill>
);

// 1 · Gancho: el círculo dorado se estira en barra de búsqueda y se teclea kalpa.pe (ref. 1 + 3)
export const W1Busca: React.FC = () => (
  <Stage horizon={0.7}>
    <SearchBar text="kalpa.pe" typed={8} w={760} x={160} y={560} color={K.gold} />
    <Small x={0} y={740}>
      <span style={{ display: "block", width: 1080, textAlign: "center" }}>Este mes diseñé una nueva web.</span>
    </Small>
  </Stage>
);

// 2 · La web se levanta en 3D desde el plano, tras la franja dorada (ref. 3)
export const W2Revela: React.FC = () => (
  <Stage>
    <div style={{ position: "absolute", left: -120, top: 380, width: 1320, height: 825, perspective: 1500 }}>
      <Img
        src={W("d-intro")}
        style={{ width: 1320, height: 825, transform: "rotateX(24deg) rotateY(-16deg) rotateZ(4deg)", transformOrigin: "50% 100%", borderRadius: 10, boxShadow: "0 80px 140px rgba(0,0,0,.75), 0 0 80px rgba(253,181,21,.15)" }}
      />
    </div>
    <Stack lines={[{ t: "Nueva" }, { t: "web.", gold: true }]} x={80} y={110} size={170} align="right" />
  </Stage>
);

// 3 · El hero se arma: la web al fondo y sus piezas reales + datos flotando delante (ref. 2)
export const W3Hero: React.FC = () => (
  <Stage beam={1.2}>
    <T y={120} size={330} align="center" color="rgba(242,245,248,.08)" italic>
      KALPA
    </T>
    <Piece src={W("d-hero-2")} crop={{ x: 0, y: 70, w: 2160, h: 1280 }} x={60} y={380} w={960} rx={8} ry={-10} />
    <GlassChip x={40} y={980} label="Cafeína natural" value="280 mg" />
    <GlassChip x={700} y={330} label="Macerado" value="24 h" />
    <Stack lines={[{ t: "Con" }, { t: "energía.", gold: true }]} x={80} y={1060} size={120} align="right" />
  </Stage>
);

// 4 · Tienda: primer plano macro del precio y el botón, con un chip flotante (ref. 3 + 2)
export const W4Tienda: React.FC = () => (
  <Stage horizon={0}>
    <Macro src={W("page-producto")} scale={2.1} ox={300} oy={120} rx={34} rz={-12} />
    <AbsoluteFill style={{ background: "linear-gradient(to bottom, rgba(7,8,10,.85) 0%, rgba(7,8,10,0) 30%, rgba(7,8,10,0) 75%, rgba(7,8,10,.8) 100%)" }} />
    <Stack lines={[{ t: "Comprar" }, { t: "en 2 clics.", gold: true }]} y={90} size={140} />
  </Stage>
);

// 5 · Origen: el hero de Nosotros con su animación de aparición, grande y apenas inclinado
export const W5Origen: React.FC = () => (
  <Stage horizon={0.4}>
    <Stack lines={[{ t: "De dónde" }, { t: "viene cada" }, { t: "grano.", gold: true }]} y={90} size={115} />
    <Piece src={W("page-nosotros-hero")} crop={{ x: 0, y: 0, w: 2160, h: 1350 }} x={-40} y={520} w={1160} rx={10} ry={-8} rz={-1} />
  </Stage>
);

// 6 · Celular: tres teléfonos en escalera con la versión móvil (ref. 1)
export const W6Movil: React.FC = () => (
  <Stage>
    <Stack lines={[{ t: "Igual de bien" }, { t: "en tu celular.", gold: true }]} y={90} size={110} />
    <Phone x={40} y={470} w={300} rz={-8} ry={18} src={W("m-intro")} />
    <Phone x={390} y={420} w={310} rz={-4} ry={10} src={W("m-products")} />
    <Phone x={740} y={470} w={300} rz={0} ry={2} src={W("m-origin")} />
  </Stage>
);

// 7 · 5 páginas en un carrusel cilíndrico (ref. 2 + 3)
export const W7Paginas: React.FC = () => {
  const f = useCurrentFrame();
  const pages = ["page-producto", "page-productos", "d-hero-1", "page-nosotros", "page-promociones"].map(W);
  return (
    <Stage>
      <Stack lines={[{ t: "5 páginas.", gold: true }, { t: "1 sistema." }]} y={100} size={140} />
      <Cylinder pages={pages} w={600} h={375} y={640} angle={76 - f * 0.25} step={46} />
    </Stage>
  );
};

// 8 · Shopify: el carrito real como panel flotante y el botón de checkout a punto de presionarse
export const W8Shopify: React.FC = () => (
  <Stage beam={1.1}>
    <Stack lines={[{ t: "Lista para" }, { t: "Shopify.", gold: true }]} y={100} size={140} />
    <Piece src={W("page-producto")} crop={{ x: 0, y: 60, w: 2160, h: 1290 }} x={-260} y={520} w={980} ry={22} rz={-3} glow="rgba(0,0,0,0)" />
    <Piece src={W("d-cart")} crop={{ x: 1500, y: 0, w: 660, h: 720 }} x={440} y={420} w={600} ry={-12} rz={2} />
    <GlassChip x={560} y={1120} label="Total" value="S/ 7.90" />
  </Stage>
);

// 9 · Firma con la marca luismiguel.pe (azul y negro)
export const W9Firma: React.FC = () => {
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
          top: 560,
          color: LM.ink,
          opacity: p,
          filter: `blur(${(1 - p) * 14}px)`,
          transform: `translateY(${(1 - p) * 30 - f * 0.15}px) scale(${1 + f * 0.0005})`,
          lineHeight: 0.9,
        }}
      >
        <div style={{ fontFamily: LMF.sans, fontWeight: 500, fontSize: 250, letterSpacing: "-0.04em" }}>Luis</div>
        <div style={{ fontFamily: LMF.serif, fontStyle: "italic", fontSize: 280, textAlign: "right", letterSpacing: "-0.03em" }}>
          Miguel<span style={{ color: LM.red }}>.</span>
        </div>
        <div style={{ fontFamily: LMF.mono, fontSize: 32, letterSpacing: "0.06em", color: LM.ink, opacity: 0.75, marginTop: 44 }}>
          kalpa.pe
        </div>
      </div>
      <Grain opacity={0.08} />
    </AbsoluteFill>
  );
};

export const KALPAWEB_SCENES = [
  { id: "KWeb-1-Busca", component: W1Busca },
  { id: "KWeb-2-Revela", component: W2Revela },
  { id: "KWeb-3-Hero", component: W3Hero },
  { id: "KWeb-4-Tienda", component: W4Tienda },
  { id: "KWeb-5-Origen", component: W5Origen },
  { id: "KWeb-6-Movil", component: W6Movil },
  { id: "KWeb-7-Paginas", component: W7Paginas },
  { id: "KWeb-8-Shopify", component: W8Shopify },
  { id: "KWeb-9-Firma", component: W9Firma },
];
