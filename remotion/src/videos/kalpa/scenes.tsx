import React from "react";
import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  OffthreadVideo,
  staticFile,
  useCurrentFrame,
} from "remotion";
import "../../brand/fonts";
import { BlueGlow, BlueWaves, Grain, Sparks } from "../../brand/elements";
import { C, EASE_OUT, F } from "../../brand/tokens";

// Reel "Proceso de trabajo" de KALPA. Cada escena: un fondo, el producto real integrado
// (sin marcos) y una palabra gigante que interactúa con él.

const easeOut = Easing.bezier(...EASE_OUT);
const ease = (f: number, a: number, b: number) =>
  interpolate(f, [a, b], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: easeOut });

const CAN = "kalpa/kalpa-can-original.png";
const CAN_SHADOW = "drop-shadow(0 60px 70px rgba(0,0,0,.6)) drop-shadow(0 0 50px rgba(29,78,216,.35))";

/** Frase pequeña de apoyo (Inter) */
const Line: React.FC<{ children: React.ReactNode; top?: number; left?: number; align?: "left" | "right"; delay?: number }> = ({
  children,
  top = 250,
  left = 90,
  align = "left",
  delay = 0,
}) => {
  const p = ease(useCurrentFrame(), delay, delay + 14);
  return (
    <div
      style={{
        position: "absolute",
        top,
        left: align === "left" ? left : undefined,
        right: align === "right" ? left : undefined,
        fontFamily: F.sans,
        fontWeight: 500,
        fontSize: 60,
        lineHeight: 1.15,
        letterSpacing: "-0.02em",
        color: C.ink,
        opacity: p,
        filter: `blur(${(1 - p) * 10}px)`,
        maxWidth: 900,
        textAlign: align,
      }}
    >
      {children}
    </div>
  );
};

/** Palabra gigante */
const Giant: React.FC<{
  children: React.ReactNode;
  size: number;
  top: number;
  serif?: boolean;
  style?: React.CSSProperties;
}> = ({ children, size, top, serif = true, style }) => (
  <div
    style={{
      position: "absolute",
      top,
      width: "100%",
      textAlign: "center",
      fontFamily: serif ? F.serif : F.sans,
      fontStyle: serif ? "italic" : "normal",
      fontWeight: serif ? 400 : 600,
      fontSize: size,
      lineHeight: 1,
      letterSpacing: serif ? "-0.03em" : "-0.05em",
      color: C.ink,
      whiteSpace: "nowrap",
      ...style,
    }}
  >
    {children}
  </div>
);

const Night: React.FC<{ children: React.ReactNode; glow?: number }> = ({ children, glow = 1 }) => (
  <AbsoluteFill style={{ background: C.black }}>
    <BlueGlow intensity={glow} />
    {children}
    <Grain opacity={0.08} />
  </AbsoluteFill>
);

const Blue: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AbsoluteFill>
    <BlueWaves />
    {children}
    <Grain opacity={0.08} />
  </AbsoluteFill>
);

// 1 · "Un poco del trabajo que hice este mes para KALPA"
export const S1Intro: React.FC = () => {
  const f = useCurrentFrame();
  const can = ease(f, 6, 30);
  return (
    <Blue>
      <Line>
        Un poco del trabajo
        <br />
        de este mes para
      </Line>
      <Giant size={340} top={430} serif={false} style={{ opacity: ease(f, 0, 16) }}>
        KALPA
      </Giant>
      <Img
        src={staticFile(CAN)}
        style={{
          position: "absolute",
          width: 1150,
          left: -35,
          top: 560,
          transform: `translateY(${(1 - can) * 200}px) rotate(${-7 + (1 - can) * -6}deg)`,
          opacity: can,
          filter: CAN_SHADOW,
        }}
      />
    </Blue>
  );
};

// 2 · "Antes de tener forma, la etiqueta fue un diseño plano"
export const S2Plano: React.FC = () => {
  const f = useCurrentFrame();
  const lay = ease(f, 4, 34);
  return (
    <Night>
      <Line>Antes de tener forma, la etiqueta fue un diseño</Line>
      <Giant size={460} top={520} style={{ transform: `scaleY(${1 - lay * 0.55})`, transformOrigin: "50% 100%" }}>
        plano
      </Giant>
      <div style={{ position: "absolute", left: -260, top: 1020, width: 1600, perspective: 1400 }}>
        <Img
          src={staticFile("kalpa/kalpa-label.png")}
          style={{
            width: 1600,
            transform: `rotateX(${58 * lay}deg) rotateZ(${-6 * lay}deg)`,
            transformOrigin: "50% 30%",
            borderRadius: 6,
            boxShadow: "0 60px 90px rgba(0,0,0,.7), 0 0 80px rgba(29,78,216,.35)",
          }}
        />
      </div>
    </Night>
  );
};

// 3 · "Luego la construí capa por capa: la lata, la etiqueta y las gotas"
export const S3Capas: React.FC = () => {
  const f = useCurrentFrame();
  const open = ease(f, 6, 36);
  return (
    <Blue>
      <Line>Luego la construí</Line>
      {/* Texto en capas desfasadas, como la lata */}
      {[2, 1, 0].map((i) => (
        <Giant
          key={i}
          size={200}
          top={360 - i * 14 * open}
          style={{
            left: i * 14 * open,
            color: i === 0 ? C.ink : "transparent",
            WebkitTextStroke: i === 0 ? undefined : `2px rgba(240,236,244,${0.5 - i * 0.12})`,
          }}
        >
          capa por capa
        </Giant>
      ))}
      {/* Vista explotada: las capas reales de la lata separadas en profundidad */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 700, height: 1100, perspective: 2000 }}>
        <div
          style={{
            position: "absolute",
            left: 300,
            top: 0,
            width: 480,
            height: 960,
            transformStyle: "preserve-3d",
            transform: `rotateY(${-34 * open}deg) rotateX(4deg)`,
          }}
        >
          {[
            {
              label: "lata",
              node: <Img src={staticFile("kalpa/kalpa-can-clean.png")} style={{ width: 480, height: 960, filter: CAN_SHADOW }} />,
            },
            {
              label: "etiqueta",
              node: (
                <Img
                  src={staticFile("kalpa/kalpa-label.png")}
                  style={{ position: "absolute", left: -40, top: 260, width: 560, borderRadius: 4, boxShadow: "0 30px 60px rgba(0,0,0,.6)" }}
                />
              ),
            },
            {
              label: "gotas",
              node: (
                <>
                  <Img src={staticFile("kalpa/kalpa-can-clean.png")} style={{ position: "absolute", width: 480, height: 960, opacity: 0.12 }} />
                  <Img src={staticFile("kalpa/kalpa-can-droplets.png")} style={{ position: "absolute", width: 480, height: 960, filter: "brightness(1.6)" }} />
                </>
              ),
            },
          ].map((l, i) => (
            <div key={l.label} style={{ position: "absolute", inset: 0, transform: `translateZ(${(i - 1) * 380 * open}px)` }}>
              {l.node}
              <div
                style={{
                  position: "absolute",
                  top: 990,
                  width: 480,
                  textAlign: "center",
                  fontFamily: F.serif,
                  fontStyle: "italic",
                  fontSize: 60,
                  color: C.ink,
                  opacity: open,
                }}
              >
                {l.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Blue>
  );
};

// 4 · "Y la puse a girar" (carrusel real con fondo transparente)
export const S4Girar: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <Blue>
      <Sparks seed="girar" count={14} />
      <Giant size={470} top={420} style={{ opacity: ease(f, 6, 20) }}>
        girar
      </Giant>
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <OffthreadVideo
          src={staticFile("footage/kallpa-alpha.webm")}
          transparent
          muted
          style={{ width: 1060, height: 1325, marginTop: 470, filter: CAN_SHADOW }}
        />
      </AbsoluteFill>
      <Line>Y la puse a</Line>
    </Blue>
  );
};

/** Chispa luminosa */
const Spark: React.FC<{ x: number; y: number; size: number }> = ({ x, y, size }) => {
  const f = useCurrentFrame();
  const flick = 0.75 + 0.25 * Math.sin(f * 1.7) * Math.sin(f * 0.9);
  return (
    <div style={{ position: "absolute", left: x - size / 2, top: y - size / 2, width: size, height: size }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "50%",
          background: "radial-gradient(circle, #ffffff 0%, #cfe0ff 22%, rgba(59,108,240,.85) 45%, rgba(29,78,216,0) 72%)",
          transform: `scale(${flick})`,
          filter: "blur(2px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          width: size * 3.2,
          height: 4,
          marginLeft: (-size * 3.2) / 2,
          background: "linear-gradient(90deg, transparent, #e6eeff, transparent)",
          transform: `rotate(${18 + f * 2}deg) scaleX(${flick})`,
        }}
      />
    </div>
  );
};

// 5 · "Pero le faltaba chispa…"
export const S5Chispa: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <Night glow={0.7}>
      <Line>Pero le faltaba</Line>
      <Giant size={360} top={600} style={{ opacity: ease(f, 2, 16) }}>
        ch<span style={{ position: "relative" }}>ı</span>spa…
      </Giant>
      <Spark x={402} y={690} size={120} />
      <Img
        src={staticFile(CAN)}
        style={{
          position: "absolute",
          width: 1000,
          left: 260,
          top: 1180,
          transform: "rotate(14deg)",
          filter: `${CAN_SHADOW} brightness(.8)`,
        }}
      />
    </Night>
  );
};

// 6 · "Así que le di toda la energía" (lata eléctrica real con fondo transparente)
export const S6Energia: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <Night glow={1.3}>
      <Sparks seed="energia" count={24} />
      <Giant size={330} top={330} style={{ opacity: ease(f, 4, 18), textShadow: "0 0 40px rgba(59,108,240,.8)" }}>
        energía
      </Giant>
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <OffthreadVideo
          src={staticFile("footage/electricidad-alpha.webm")}
          transparent
          muted
          style={{ width: 2300, height: 2875, marginTop: 260, filter: "drop-shadow(0 0 40px rgba(29,78,216,.45))" }}
        />
      </AbsoluteFill>
      <Line top={200}>Así que le di toda la</Line>
    </Night>
  );
};

// 7 · "¿Y tú, ya quieres probar una?"
export const S7Probar: React.FC = () => {
  const f = useCurrentFrame();
  const can = ease(f, 4, 28);
  return (
    <Blue>
      <Line>¿Y tú, ya quieres</Line>
      <Giant size={400} top={440} style={{ opacity: ease(f, 8, 22) }}>
        probar
      </Giant>
      <Img
        src={staticFile(CAN)}
        style={{
          position: "absolute",
          width: 1250,
          left: -90,
          top: 660,
          transform: `scale(${0.9 + can * 0.1}) rotate(${10 - can * 4}deg)`,
          filter: CAN_SHADOW,
        }}
      />
      <Line top={1600} align="right">
        una?
      </Line>
    </Blue>
  );
};

// 8 · Firma, como el hero de luismiguel.pe
export const S8Firma: React.FC = () => {
  const f = useCurrentFrame();
  const p = ease(f, 0, 20);
  return (
    <Blue>
      <div
        style={{
          position: "absolute",
          left: 80,
          right: 80,
          top: 1080,
          color: C.ink,
          opacity: p,
          filter: `blur(${(1 - p) * 14}px)`,
          lineHeight: 0.9,
        }}
      >
        <div style={{ fontFamily: F.sans, fontWeight: 500, fontSize: 300, letterSpacing: "-0.04em" }}>Luis</div>
        <div style={{ fontFamily: F.serif, fontStyle: "italic", fontSize: 330, textAlign: "right", letterSpacing: "-0.03em" }}>
          Miguel<span style={{ color: C.red }}>.</span>
        </div>
      </div>
    </Blue>
  );
};

export const KALPA_SCENES = [
  { id: "Kalpa-1-Intro", component: S1Intro },
  { id: "Kalpa-2-Plano", component: S2Plano },
  { id: "Kalpa-3-Capas", component: S3Capas },
  { id: "Kalpa-4-Girar", component: S4Girar },
  { id: "Kalpa-5-Chispa", component: S5Chispa },
  { id: "Kalpa-6-Energia", component: S6Energia },
  { id: "Kalpa-7-Probar", component: S7Probar },
  { id: "Kalpa-8-Firma", component: S8Firma },
];
