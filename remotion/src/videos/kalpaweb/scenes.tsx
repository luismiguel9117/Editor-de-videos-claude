import { loadFont } from "@remotion/fonts";
import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
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
        right: align === "right" ? -x : undefined,
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

const Night: React.FC<{ children: React.ReactNode; glow?: string }> = ({ children, glow = "rgba(152,22,8,.35)" }) => (
  <AbsoluteFill style={{ background: "#07080a", overflow: "hidden" }}>
    <AbsoluteFill style={{ background: `radial-gradient(60% 40% at 60% 60%, ${glow} 0%, rgba(7,8,10,0) 70%)`, filter: "blur(40px)" }} />
    {children}
    <Grain opacity={0.06} />
  </AbsoluteFill>
);

// 1 · "Este mes diseñé la nueva web de KALPA." — palabras gigantes que se salen del cuadro
export const W1Intro: React.FC = () => (
  <Night>
    <Small y={250}>Este mes,</Small>
    <T x={-30} y={330} size={360}>Nueva</T>
    <T x={60} y={640} size={360} outline color={K.gold} delay={6} align="right">
      web.
    </T>
    <T x={80} y={1110} size={72} color={K.gold} delay={14} italic={false} weight={600} style={{ textTransform: "none" }}>
      kalpa.pe
    </T>
  </Night>
);

// 2 · "Una web que se siente como la marca: con energía." — la palabra rellena con la web real
export const W2Energia: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <Night glow="rgba(253,181,21,.18)">
      <Small y={330} x={0} align="left">
        <span style={{ display: "block", width: 1080, textAlign: "center" }}>Una web que se siente como la marca.</span>
      </Small>
      <div
        style={{
          position: "absolute",
          top: 470,
          width: "100%",
          textAlign: "center",
          fontFamily: FG,
          fontWeight: 900,
          fontStyle: "italic",
          fontSize: 300,
          lineHeight: 1,
          letterSpacing: "-0.03em",
          // La imagen se precarga con el <Img> oculto de abajo (Remotion espera a que cargue)
          // eslint-disable-next-line @remotion/no-background-image
          backgroundImage: `url(${W("d-intro")})`,
          backgroundSize: "1500px auto",
          backgroundPosition: `${-180 - f * 0.6}px 40%`,
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          color: "transparent",
          opacity: ease(f, 0, 18),
        }}
      >
        ENERGÍA
      </div>
      <Img src={W("d-intro")} style={{ position: "absolute", width: 1, height: 1, opacity: 0 }} />
      <Small y={860} x={0}>
        <span style={{ display: "block", width: 1080, textAlign: "center", color: K.gold }}>— real, para tu día.</span>
      </Small>
    </Night>
  );
};

// 3 · El hero: una sola lámina grande y la lista de slides como especificaciones
export const W3Hero: React.FC = () => (
  <Night>
    <Sheet src={W("d-hero-1")} x={40} y={190} w={1000} h={625} seed={0.6} />
    {[
      ["01", "Café de VRAEM", true],
      ["02", "Cold Brew", false],
      ["03", "Sin crash", false],
    ].map(([n, t, on], i) => (
      <div key={String(n)} style={{ position: "absolute", left: 80, top: 900 + i * 92, display: "flex", gap: 28, alignItems: "baseline", opacity: on ? 1 : 0.35 }}>
        <span style={{ fontFamily: FG, fontWeight: 600, fontSize: 34, color: on ? K.gold : K.muted }}>{n}</span>
        <span style={{ fontFamily: FG, fontWeight: 900, fontStyle: "italic", fontSize: 64, textTransform: "uppercase", color: K.text }}>{t}</span>
      </div>
    ))}
  </Night>
);

/** Cursor de mouse simple */
const Cursor: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <svg style={{ position: "absolute", left: x, top: y, filter: "drop-shadow(0 6px 10px rgba(0,0,0,.6))" }} width="54" height="64" viewBox="0 0 27 32">
    <path d="M2 2 L2 26 L8.5 20 L13 30 L17 28.5 L12.6 18.8 L21.5 18.8 Z" fill="#fff" stroke="#000" strokeWidth="1.6" strokeLinejoin="round" />
  </svg>
);

// 4 · "…comprar en dos clics." — un número enorme como dato
export const W4Clics: React.FC = () => (
  <Night glow="rgba(253,181,21,.16)">
    <T x={10} y={120} size={760} color={K.gold} italic>
      2
    </T>
    <T x={520} y={300} size={120} delay={8}>
      clics
    </T>
    <Small x={526} y={430} size={44} color={K.text}>
      para comprar.
    </Small>
    <Sheet src={W("page-producto")} x={330} y={720} w={1000} h={625} pos="0% 0%" seed={1.2} />
    <Cursor x={760} y={1110} />
  </Night>
);

// 5 · "Que cuenta de dónde viene cada grano." — texto en columna, la web se sale por la derecha
export const W5Origen: React.FC = () => (
  <Night>
    {["De dónde", "viene", "cada"].map((w, i) => (
      <T key={w} x={80} y={250 + i * 120} size={110} delay={i * 4}>
        {w}
      </T>
    ))}
    <T x={74} y={610} size={200} color={K.gold} delay={14}>
      grano.
    </T>
    <Sheet src={W("d-origin")} x={560} y={330} w={1100} h={688} ry={-16} seed={2.2} />
  </Night>
);

// 6 · "Y que se ve igual de bien en tu celular." — texto vertical junto a la versión móvil
export const W6Movil: React.FC = () => (
  <Night>
    <div style={{ position: "absolute", left: 120, top: 1240, transform: "rotate(-90deg)", transformOrigin: "0 0" }}>
      <T x={0} y={0} size={210} outline color={K.text}>
        igual de bien
      </T>
    </div>
    <Sheet src={W("m-origin")} x={560} y={110} w={460} h={997} rz={2} seed={3.3} />
    <Small x={560} y={1170} color={K.gold} size={46}>
      en tu celular.
    </Small>
  </Night>
);

// 7 · "Cinco páginas, un solo sistema." — dos datos como en una ficha técnica
export const W7Paginas: React.FC = () => (
  <Night>
    <T x={60} y={140} size={520} color={K.gold}>
      5
    </T>
    <Small x={400} y={420} size={56} color={K.text}>
      páginas.
    </Small>
    <div style={{ position: "absolute", left: 80, right: 80, top: 700, height: 2, background: "rgba(242,245,248,.15)" }} />
    <T x={60} y={760} size={520} delay={10}>
      1
    </T>
    <Small x={300} y={1040} size={56} color={K.text}>
      solo sistema.
    </Small>
    <Sheet src={W("page-nosotros")} x={560} y={780} w={640} h={400} ry={-14} seed={4.4} dim={0.15} />
  </Night>
);

// 8 · "Lista para vender en Shopify." — el carrito real al centro
export const W8Shopify: React.FC = () => (
  <Night glow="rgba(253,181,21,.14)">
    <Small y={150} x={0}>
      <span style={{ display: "block", width: 1080, textAlign: "center" }}>Lista para vender en</span>
    </Small>
    <T y={210} size={200} align="center">
      Shopify.
    </T>
    <Sheet src={W("d-cart")} x={250} y={480} w={580} h={780} pos="100% 0%" seed={5} />
  </Night>
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
  { id: "KWeb-1-NuevaWeb", component: W1Intro },
  { id: "KWeb-2-Energia", component: W2Energia },
  { id: "KWeb-3-Hero", component: W3Hero },
  { id: "KWeb-4-Clics", component: W4Clics },
  { id: "KWeb-5-Origen", component: W5Origen },
  { id: "KWeb-6-Movil", component: W6Movil },
  { id: "KWeb-7-Paginas", component: W7Paginas },
  { id: "KWeb-8-Shopify", component: W8Shopify },
  { id: "KWeb-9-Firma", component: W9Firma },
];
