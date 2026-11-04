import { loadFont } from "@remotion/fonts";
import React from "react";
import { AbsoluteFill, Easing, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { useFloat } from "../../brand/motion";
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
const V = (n: string) => staticFile(`footage/${n}.mp4`);
const useSpring = (delay: number, damping = 15) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: f - delay, fps, config: { damping, stiffness: 90 } });
};

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

const Small: React.FC<{ children: React.ReactNode; x?: number; y: number; color?: string; size?: number; align?: "left" | "right"; delay?: number }> = ({
  children,
  x = 80,
  y,
  color = K.muted,
  size = 40,
  align = "left",
  delay = 0,
}) => (
  <T x={x} y={y} size={size} color={color} weight={600} italic={false} align={align} delay={delay} style={{ textTransform: "none", letterSpacing: "0", lineHeight: 1.2 }}>
    {children}
  </T>
);

/** Texto apilado de 2–3 palabras (ref. 3): bloque alineado a un lado */
const Stack: React.FC<{ lines: { t: string; gold?: boolean; outline?: boolean }[]; x?: number; y: number; size: number; align?: "left" | "right"; delay?: number }> = ({
  lines,
  x = 80,
  y,
  size,
  align = "left",
  delay = 0,
}) => (
  <>
    {lines.map((l, i) => (
      <T key={l.t} x={x} y={y + i * size * 0.9} size={size} color={l.gold ? K.gold : K.text} outline={l.outline} align={align} delay={delay + i * 6}>
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

// 1 · Gancho: el círculo dorado aparece, se estira en barra, se teclea kalpa.pe y se aplana (ref. 1 + 3)
export const W1Busca: React.FC = () => {
  const f = useCurrentFrame();
  const pop = useSpring(0, 10);
  const morph = ease(f, 12, 30);
  const typed = Math.max(0, Math.min(8, Math.floor((f - 32) / 3.2)));
  const press = interpolate(f, [62, 65, 70], [0, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const flat = ease(f, 70, 84);
  return (
    <Stage horizon={0.7}>
      <div style={{ position: "absolute", inset: 0, transform: `scale(${0.4 + pop * 0.6})`, transformOrigin: "540px 616px", opacity: Math.min(1, pop * 2) }}>
        <SearchBar text="kalpa.pe" typed={typed} w={760} x={160} y={560} color={K.gold} morph={morph} flat={flat} press={press} />
      </div>
      <div style={{ opacity: 1 - flat }}>
        <Small x={0} y={740} delay={34}>
          <span style={{ display: "block", width: 1080, textAlign: "center" }}>Este mes diseñé una nueva web.</span>
        </Small>
      </div>
    </Stage>
  );
};

// 2 · La franja dorada se abre y la web (intro real) se levanta en 3D desde el plano (ref. 3)
export const W2Revela: React.FC = () => {
  const f = useCurrentFrame();
  const open = ease(f, 0, 16);
  const lift = useSpring(4, 18);
  const fl = useFloat(0.7, 8, 4.2);
  return (
    <Stage>
      {/* franja dorada que se abre */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 608 - open * 300, height: 16 + open * 600, background: K.gold, opacity: 1 - ease(f, 8, 20) }} />
      <div
        style={{
          position: "absolute",
          left: -120,
          top: 380 + fl.y,
          width: 1320,
          height: 825,
          perspective: 1500,
          clipPath: `inset(${(1 - open) * 50}% 0 ${(1 - open) * 50}% 0)`,
        }}
      >
        <div
          style={{
            width: 1320,
            height: 825,
            transform: `rotateX(${70 - lift * 46}deg) rotateY(${-16 + fl.rot}deg) rotateZ(${4 - f * 0.02}deg) scale(${1 + f * 0.0006})`,
            transformOrigin: "50% 100%",
            borderRadius: 10,
            overflow: "hidden",
            boxShadow: "0 80px 140px rgba(0,0,0,.75), 0 0 80px rgba(253,181,21,.15)",
          }}
        >
          <Piece src={W("d-intro")} video={V("kweb-intro")} crop={{ x: 0, y: 0, w: 2160, h: 1350 }} x={0} y={0} w={1320} glow="rgba(0,0,0,0)" radius={0} />
        </div>
      </div>
      <Stack lines={[{ t: "Nueva" }, { t: "web.", gold: true }]} x={80} y={110} size={170} align="right" delay={18} />
    </Stage>
  );
};

// 3 · El hero se arma: la web con sus slides reales y datos flotando delante (ref. 2)
export const W3Hero: React.FC = () => {
  const f = useCurrentFrame();
  const enter = useSpring(0, 16);
  const c1 = useSpring(26, 12);
  const c2 = useSpring(36, 12);
  const fl = useFloat(1.5, 9, 3.8);
  const fa = useFloat(2.6, 14, 3.2);
  const fb = useFloat(3.9, 12, 3.6);
  return (
    <Stage beam={1.2}>
      <T y={120} size={330} align="center" color="rgba(242,245,248,.08)" italic>
        KALPA
      </T>
      <Piece
        src={W("d-hero-1")}
        video={V("kweb-hero")}
        crop={{ x: 0, y: 70, w: 2160, h: 1280 }}
        x={60}
        y={380 + (1 - enter) * 120 + fl.y}
        w={960}
        rx={8 + (1 - enter) * 20}
        ry={-10 + f * 0.04 + fl.rot}
        style={{ opacity: Math.min(1, enter * 1.5) }}
      />
      <div style={{ position: "absolute", inset: 0, transform: `translate(${(1 - c1) * -80}px, ${fa.y}px) scale(${0.8 + c1 * 0.2})`, opacity: c1, transformOrigin: "200px 1040px" }}>
        <GlassChip x={40} y={980} label="Cafeína natural" value="280 mg" />
      </div>
      <div style={{ position: "absolute", inset: 0, transform: `translate(${(1 - c2) * 80}px, ${fb.y}px) scale(${0.8 + c2 * 0.2})`, opacity: c2, transformOrigin: "850px 390px" }}>
        <GlassChip x={700} y={330} label="Macerado" value="24 h" />
      </div>
      <Stack lines={[{ t: "Con" }, { t: "energía.", gold: true }]} x={80} y={1060} size={120} align="right" delay={14} />
    </Stage>
  );
};

// 4 · Tienda: primer plano macro; la cámara se desliza del precio al botón (ref. 3)
export const W4Tienda: React.FC = () => {
  const f = useCurrentFrame();
  const t = ease(f, 0, 90);
  return (
    <Stage horizon={0}>
      <Macro src={W("page-producto")} scale={1.9 + t * 0.35} ox={240 + t * 140} oy={40 + t * 160} rx={34 - t * 6} rz={-12 + t * 3} />
      <AbsoluteFill style={{ background: "linear-gradient(to bottom, rgba(7,8,10,.85) 0%, rgba(7,8,10,0) 30%, rgba(7,8,10,0) 75%, rgba(7,8,10,.8) 100%)" }} />
      <Stack lines={[{ t: "Comprar" }, { t: "en 2 clics.", gold: true }]} y={90} size={140} delay={6} />
    </Stage>
  );
};

// 5 · Origen: el hero de Nosotros con su animación real de aparición
export const W5Origen: React.FC = () => {
  const enter = useSpring(0, 18);
  const fl = useFloat(4.4, 8, 4.4);
  const f = useCurrentFrame();
  return (
    <Stage horizon={0.4}>
      <Stack lines={[{ t: "De dónde" }, { t: "viene cada" }, { t: "grano.", gold: true }]} y={90} size={115} delay={10} />
      <Piece
        src={W("page-nosotros-hero")}
        video={V("kweb-nosotros")}
        crop={{ x: 0, y: 0, w: 2160, h: 1350 }}
        x={-40}
        y={520 + (1 - enter) * 160 + fl.y}
        w={1160}
        rx={10 + (1 - enter) * 30}
        ry={-8 + f * 0.03}
        rz={-1}
        style={{ opacity: Math.min(1, enter * 1.5) }}
      />
    </Stage>
  );
};

// 6 · Celular: tres teléfonos entran escalonados y flotan (ref. 1)
const FloatingPhone: React.FC<{ i: number; x: number; y: number; w: number; rz: number; ry: number; src: string }> = ({ i, x, y, w, rz, ry, src }) => {
  const e = useSpring(i * 6, 14);
  const fl = useFloat(i * 1.7, 12, 3.6);
  const f = useCurrentFrame();
  return (
    <div style={{ position: "absolute", inset: 0, transform: `translateY(${(1 - e) * 500 + fl.y}px)`, opacity: Math.min(1, e * 2) }}>
      <Phone x={x} y={y} w={w} rz={rz + (1 - e) * 12 + fl.rot} ry={ry - f * 0.05} src={src} />
    </div>
  );
};
export const W6Movil: React.FC = () => (
  <Stage>
    <Stack lines={[{ t: "Igual de bien" }, { t: "en tu celular.", gold: true }]} y={90} size={110} delay={8} />
    <FloatingPhone i={0} x={40} y={470} w={300} rz={-8} ry={18} src={W("m-intro")} />
    <FloatingPhone i={1} x={390} y={420} w={310} rz={-4} ry={10} src={W("m-products")} />
    <FloatingPhone i={2} x={740} y={470} w={300} rz={0} ry={2} src={W("m-origin")} />
  </Stage>
);

// 7 · 5 páginas en un carrusel cilíndrico que gira (ref. 2 + 3)
export const W7Paginas: React.FC = () => {
  const f = useCurrentFrame();
  const enter = useSpring(0, 18);
  const pages = ["page-producto", "page-productos", "d-hero-1", "page-nosotros", "page-promociones"].map(W);
  return (
    <Stage>
      <Stack lines={[{ t: "5 páginas.", gold: true }, { t: "1 sistema." }]} y={100} size={140} delay={8} />
      <div style={{ position: "absolute", inset: 0, transform: `scale(${0.85 + enter * 0.15})`, opacity: enter, transformOrigin: "540px 830px" }}>
        <Cylinder pages={pages} w={600} h={375} y={640} angle={150 - ease(f, 0, 110) * 150} step={46} />
      </div>
    </Stage>
  );
};

// 8 · Shopify: la ficha entra por la izquierda, el carrito por la derecha y aparece el total
export const W8Shopify: React.FC = () => {
  const a = useSpring(0, 16);
  const b = useSpring(8, 15);
  const c = useSpring(24, 11);
  const fa = useFloat(5.5, 8, 4);
  const fb = useFloat(6.3, 10, 3.6);
  return (
    <Stage beam={1.1}>
      <Stack lines={[{ t: "Lista para" }, { t: "Shopify.", gold: true }]} y={100} size={140} delay={10} />
      <Piece src={W("page-producto")} crop={{ x: 0, y: 60, w: 2160, h: 1290 }} x={-260 - (1 - a) * 500} y={520 + fa.y} w={980} ry={22} rz={-3} glow="rgba(0,0,0,0)" style={{ opacity: a }} />
      <Piece src={W("d-cart")} crop={{ x: 1500, y: 0, w: 660, h: 720 }} x={440 + (1 - b) * 600} y={420 + fb.y} w={600} ry={-12} rz={2} style={{ opacity: b }} />
      <div style={{ position: "absolute", inset: 0, transform: `scale(${0.7 + c * 0.3})`, opacity: c, transformOrigin: "700px 1180px" }}>
        <GlassChip x={560} y={1120} label="Total" value="S/ 7.90" />
      </div>
    </Stage>
  );
};

// 9 · Firma con la marca luismiguel.pe: el círculo dorado se encoge en el punto rojo
export const W9Firma: React.FC = () => {
  const f = useCurrentFrame();
  const p = ease(f, 6, 26);
  const dot = ease(f, 0, 22);
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
      {/* círculo dorado de KALPA que se encoge y se vuelve el punto rojo */}
      <div
        style={{
          position: "absolute",
          left: interpolate(dot, [0, 1], [540, 985]) - interpolate(dot, [0, 1], [70, 0]),
          top: interpolate(dot, [0, 1], [616, 1012]) - interpolate(dot, [0, 1], [70, 0]),
          width: interpolate(dot, [0, 1], [140, 0]),
          height: interpolate(dot, [0, 1], [140, 0]),
          borderRadius: "50%",
          background: dot < 0.6 ? K.gold : LM.red,
          opacity: 1 - ease(f, 18, 24),
        }}
      />
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
