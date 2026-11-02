import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  random,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { C, EASE_IN, EASE_OUT, F } from "./tokens";

const easeOut = Easing.bezier(...EASE_OUT);
const easeIn = Easing.bezier(...EASE_IN);

/** Grano de película animado (como .em-grain de la web) */
export const Grain: React.FC<{ opacity?: number }> = ({ opacity = 0.06 }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ pointerEvents: "none", opacity, mixBlendMode: "overlay" }}>
      <svg width="100%" height="100%">
        <filter id={`grain-${frame % 8}`}>
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves={3} seed={frame % 8} stitchTiles="stitch" />
        </filter>
        <rect width="100%" height="100%" filter={`url(#grain-${frame % 8})`} />
      </svg>
    </AbsoluteFill>
  );
};

/** Chispas que suben (como .em-spark). Deterministas: mismo render siempre. */
export const Sparks: React.FC<{ count?: number; seed?: string }> = ({ count = 18, seed = "s" }) => {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {new Array(count).fill(0).map((_, i) => {
        const dur = (8 + random(`${seed}d${i}`) * 6) * fps;
        const t = ((frame + random(`${seed}o${i}`) * dur) % dur) / dur;
        const size = 2 + random(`${seed}s${i}`) * 4;
        const x = random(`${seed}x${i}`) * width + t * 35;
        const y = height + 20 - t * height * 1.15;
        const op = interpolate(t, [0, 0.15, 0.85, 1], [0, 0.75, 0.75, 0]);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: size,
              height: size,
              borderRadius: "50%",
              background: C.ember,
              opacity: op,
              boxShadow: `0 0 10px ${C.emberHot}, 0 0 4px rgba(255,200,100,.8)`,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

/** Luz de fondo difusa del mundo Brasa */
export const EmberGlow: React.FC<{ intensity?: number }> = ({ intensity = 1 }) => {
  const frame = useCurrentFrame();
  const drift = Math.sin(frame / 40) * 4;
  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(60% 40% at ${50 + drift}% 55%, rgba(255,90,40,${0.32 * intensity}) 0%, rgba(140,35,210,${0.16 * intensity}) 45%, rgba(10,9,15,0) 75%)`,
        filter: "blur(30px)",
      }}
    />
  );
};

/** Retícula de líneas discontinuas 3×3 */
export const DashedGrid: React.FC<{ opacity?: number }> = ({ opacity = 1 }) => {
  const { width, height } = useVideoConfig();
  const line = (style: React.CSSProperties, key: string) => (
    <div key={key} style={{ position: "absolute", ...style }} />
  );
  const dash = `repeating-linear-gradient(var(--dir), ${C.dim} 0 10px, transparent 10px 18px)`;
  return (
    <AbsoluteFill style={{ opacity }}>
      {[1, 2].map((i) =>
        line(
          { left: (width / 3) * i, top: 0, width: 2, height, background: dash.replace("var(--dir)", "180deg") },
          `v${i}`,
        ),
      )}
      {[1, 2].map((i) =>
        line(
          { top: (height / 3) * i, left: 0, height: 2, width, background: dash.replace("var(--dir)", "90deg") },
          `h${i}`,
        ),
      )}
    </AbsoluteFill>
  );
};

export type Word = { text: string; accent?: "red" | "serif" | "both" };

/**
 * Frase palabra por palabra (mundo Papel u oscuro). Cada grupo entra con desenfoque
 * → nítido y sale con desenfoque antes del siguiente.
 */
export const WordByWord: React.FC<{
  groups: Word[][];
  every: number;
  color?: string;
  size?: number;
  lastHolds?: boolean;
}> = ({ groups, every, color = C.paperInk, size = 96, lastHolds = true }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      {groups.map((g, i) => {
        const start = i * every;
        const end = start + every;
        const isLast = i === groups.length - 1;
        const inP = interpolate(frame, [start, start + 11], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: easeOut,
        });
        const outP =
          isLast && lastHolds
            ? 0
            : interpolate(frame, [end - 4, end + 3], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
                easing: easeIn,
              });
        if (frame < start || outP >= 1) return null;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              fontFamily: F.sans,
              fontWeight: 500,
              fontSize: size,
              letterSpacing: "-0.02em",
              color,
              opacity: inP * (1 - outP),
              filter: `blur(${(1 - inP) * 12 + outP * 10}px)`,
              transform: `translateY(${(1 - inP) * 12}px) scale(${0.94 + inP * 0.06 + (frame - start) * 0.0006})`,
              whiteSpace: "nowrap",
            }}
          >
            {g.map((w, j) => (
              <span
                key={j}
                style={{
                  fontFamily: w.accent === "serif" || w.accent === "both" ? F.serif : undefined,
                  fontStyle: w.accent === "serif" || w.accent === "both" ? "italic" : undefined,
                  fontWeight: w.accent === "serif" || w.accent === "both" ? 400 : undefined,
                  fontSize: w.accent === "serif" || w.accent === "both" ? size * 1.12 : undefined,
                  color: w.accent === "red" || w.accent === "both" ? C.red : undefined,
                }}
              >
                {j > 0 ? " " : ""}
                {w.text}
              </span>
            ))}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

/** Etiqueta en Space Mono */
export const MonoLabel: React.FC<{ children: React.ReactNode; color?: string; style?: React.CSSProperties }> = ({
  children,
  color = C.dim,
  style,
}) => (
  <div
    style={{
      fontFamily: F.mono,
      fontSize: 26,
      letterSpacing: "0.08em",
      textTransform: "uppercase",
      color,
      ...style,
    }}
  >
    {children}
  </div>
);

/** Firma "Luis Miguel." con resplandor suave */
export const Signature: React.FC<{ size?: number }> = ({ size = 150 }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [0, 18], [0, 1], { extrapolateRight: "clamp", easing: easeOut });
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      <div
        style={{
          fontSize: size,
          lineHeight: 0.9,
          color: C.ink,
          letterSpacing: "-0.02em",
          opacity: p,
          filter: `blur(${(1 - p) * 14}px)`,
          transform: `scale(${0.96 + p * 0.04 + frame * 0.0004})`,
          textShadow: "0 0 24px rgba(240,236,244,.35)",
          whiteSpace: "nowrap",
        }}
      >
        <span style={{ fontFamily: F.sans, fontWeight: 500 }}>Luis </span>
        <span style={{ fontFamily: F.serif, fontStyle: "italic" }}>Miguel</span>
        <span style={{ fontFamily: F.serif, color: C.red }}>.</span>
      </div>
    </AbsoluteFill>
  );
};

/** Flash de color sólido (transición Papel → Brasa) */
export const Flash: React.FC<{ color?: string; frames?: number }> = ({ color = C.red, frames = 3 }) => {
  const frame = useCurrentFrame();
  const op = interpolate(frame, [0, frames, frames + 4], [1, 1, 0], { extrapolateRight: "clamp" });
  return <AbsoluteFill style={{ background: color, opacity: op }} />;
};

/** Wipe de desenfoque desde la izquierda (Brasa → Papel) */
export const BlurWipe: React.FC<{ color?: string; duration?: number; children: React.ReactNode }> = ({
  color = C.paper,
  duration = 10,
  children,
}) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [0, duration], [0, 1], { extrapolateRight: "clamp", easing: easeOut });
  return (
    <AbsoluteFill
      style={{
        background: color,
        WebkitMaskImage: `linear-gradient(90deg, #000 ${p * 130 - 30}%, transparent ${p * 130}%)`,
        maskImage: `linear-gradient(90deg, #000 ${p * 130 - 30}%, transparent ${p * 130}%)`,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};
