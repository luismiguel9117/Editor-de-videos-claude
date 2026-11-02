import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  OffthreadVideo,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import "../brand/fonts";
import { BlueGlow, BlueWaves, DashedGrid, Grain, Sparks } from "../brand/elements";
import { FootageCard } from "../brand/FootageCard";
import { C, EASE_OUT, F } from "../brand/tokens";

// Reel "Proceso de trabajo" de Kallpa — versión azul y negro (en construcción).
// Escena 03: carrusel 3D con la frase "Y la puse a girar".

const easeOut = Easing.bezier(...EASE_OUT);

/** "girar" entra y da una vuelta completa en 3D, como las latas */
const SpinWord: React.FC<{ text: string; delay: number; size: number }> = ({ text, delay, size }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - delay, fps, config: { damping: 18, mass: 0.9 } });
  const appear = interpolate(frame - delay, [0, 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <span style={{ display: "inline-block", perspective: 900 }}>
      <span
        style={{
          display: "inline-block",
          fontFamily: F.serif,
          fontStyle: "italic",
          fontSize: size,
          color: C.ink,
          opacity: appear,
          transform: `rotateY(${(1 - p) * -360}deg)`,
          textShadow: "0 0 28px rgba(59,108,240,.65)",
        }}
      >
        {text}
      </span>
    </span>
  );
};

export const CarouselScene: React.FC = () => {
  const frame = useCurrentFrame();
  const textIn = interpolate(frame, [12, 26], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: easeOut });
  return (
    <AbsoluteFill style={{ background: C.black }}>
      <BlueGlow />
      <DashedGrid opacity={0.12} />
      <Sparks seed="carrusel" count={22} />
      <AbsoluteFill style={{ alignItems: "center", top: 250 }}>
        <FootageCard src="footage/kallpa.mp4" width={880} height={1040} zoom={1.3} focus={{ x: 50, y: 38 }} />
      </AbsoluteFill>
      <div
        style={{
          position: "absolute",
          top: 1370,
          width: "100%",
          textAlign: "center",
          color: C.ink,
          fontFamily: F.sans,
          fontWeight: 500,
          fontSize: 72,
          letterSpacing: "-0.02em",
          opacity: textIn,
          filter: `blur(${(1 - textIn) * 10}px)`,
          transform: `translateY(${(1 - textIn) * 14}px)`,
        }}
      >
        Y la puse a <SpinWord text="girar" delay={20} size={92} />
      </div>
      <Grain opacity={0.07} />
    </AbsoluteFill>
  );
};

/**
 * Escena 03 integrada: las latas (captura con fondo transparente) flotan a sangre sobre
 * las olas azules y la palabra "girar" gigante queda detrás de ellas, como el hero de la web.
 */
export const CarouselStory: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const lineIn = interpolate(frame, [4, 18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: easeOut });
  const spin = spring({ frame: frame - 10, fps, config: { damping: 20, mass: 1.1 } });
  const drift = interpolate(frame, [0, 135], [30, -30]);
  return (
    <AbsoluteFill>
      <BlueWaves />
      <Sparks seed="girar" count={14} />
      {/* Palabra gigante detrás de las latas */}
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", perspective: 1400 }}>
        <div
          style={{
            fontFamily: F.serif,
            fontStyle: "italic",
            fontSize: 470,
            lineHeight: 1,
            color: C.ink,
            letterSpacing: "-0.03em",
            marginTop: -640,
            opacity: interpolate(spin, [0, 0.3], [0, 1], { extrapolateRight: "clamp" }),
            transform: `translateX(${drift}px) rotateY(${(1 - spin) * -300}deg)`,
          }}
        >
          girar
        </div>
      </AbsoluteFill>
      {/* Latas integradas, sin marco */}
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <OffthreadVideo
          src={staticFile("footage/kallpa-alpha.webm")}
          transparent
          muted
          style={{
            width: 1060,
            height: 1325,
            marginTop: 470,
            filter: "drop-shadow(0 50px 60px rgba(0,0,0,.55)) drop-shadow(0 0 40px rgba(29,78,216,.35))",
          }}
        />
      </AbsoluteFill>
      {/* Frase pequeña */}
      <div
        style={{
          position: "absolute",
          left: 90,
          top: 250,
          fontFamily: F.sans,
          fontWeight: 500,
          fontSize: 64,
          letterSpacing: "-0.02em",
          color: C.ink,
          opacity: lineIn,
          filter: `blur(${(1 - lineIn) * 10}px)`,
        }}
      >
        Y la puse a
      </div>
      <Grain opacity={0.08} />
    </AbsoluteFill>
  );
};

export const KALLPA_PROCESO_CAROUSEL = { fps: 30, width: 1080, height: 1920, durationInFrames: 135 };
