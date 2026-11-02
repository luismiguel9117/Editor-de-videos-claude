import type { TransitionPresentation, TransitionPresentationComponentProps } from "@remotion/transitions";
import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

// Movimiento "premium" (ver .claude/skills/motion-premium/SKILL.md)

/** Flotar: vaivén vertical lento + leve rotación, con fase propia para no ser mecánico */
export const useFloat = (seed = 0, amp = 14, period = 3.6) => {
  const t = useCurrentFrame() / useVideoConfig().fps;
  const w = (2 * Math.PI) / period;
  return {
    y: Math.sin(t * w + seed) * amp,
    x: Math.sin(t * w * 0.6 + seed * 2.1) * amp * 0.3,
    rot: Math.sin(t * w * 0.77 + seed * 1.7) * 1.4,
  };
};

/** Entrada que asienta: spring con un pequeño rebote amortiguado (0 → 1) */
export const useSettle = (delay = 0, damping = 14) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - delay, fps, config: { damping, mass: 1, stiffness: 90 } });
};

/** Sombra que responde a la altura del objeto (sube → sombra más lejana y difusa) */
export const liftShadow = (y: number) =>
  `drop-shadow(0 ${Math.round(60 - y * 1.4)}px ${Math.round(70 - y)}px rgba(0,0,0,${(0.6 + y * 0.006).toFixed(2)})) drop-shadow(0 0 50px rgba(29,78,216,.35))`;

/** Cámara viva: acercamiento lento durante toda la escena */
export const Drift: React.FC<{ children: React.ReactNode; amount?: number }> = ({ children, amount = 0.0005 }) => {
  const frame = useCurrentFrame();
  return <AbsoluteFill style={{ transform: `scale(${1 + frame * amount})` }}>{children}</AbsoluteFill>;
};

/** Transición: la escena que sale crece y se desenfoca; la que entra llega desde atrás y se enfoca */
const BlurZoom: React.FC<TransitionPresentationComponentProps<Record<string, never>>> = ({
  children,
  presentationDirection,
  presentationProgress: p,
}) => {
  const entering = presentationDirection === "entering";
  const style: React.CSSProperties = entering
    ? {
        opacity: interpolate(p, [0, 0.55], [0, 1], { extrapolateRight: "clamp" }),
        transform: `scale(${0.94 + 0.06 * p})`,
        filter: `blur(${(1 - p) * 16}px)`,
      }
    : {
        opacity: interpolate(p, [0.45, 1], [1, 0], { extrapolateLeft: "clamp" }),
        transform: `scale(${1 + 0.08 * p})`,
        filter: `blur(${p * 16}px)`,
      };
  return <AbsoluteFill style={style}>{children}</AbsoluteFill>;
};

export const blurZoom = (): TransitionPresentation<Record<string, never>> => ({ component: BlurZoom, props: {} });

/** Bloom de luz: un resplandor azul-blanco que sube y baja (en vez de un flash) */
export const Bloom: React.FC<{ duration?: number }> = ({ duration = 14 }) => {
  const frame = useCurrentFrame();
  const a = interpolate(frame, [0, duration / 2, duration], [0, 0.85, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill
      style={{
        background: "radial-gradient(60% 40% at 50% 50%, rgba(235,242,255,1) 0%, rgba(59,108,240,.8) 40%, rgba(5,16,42,0) 80%)",
        opacity: a,
        mixBlendMode: "screen",
      }}
    />
  );
};
