import { Audio } from "@remotion/media";
import React from "react";
import { AbsoluteFill, Easing, interpolate, Sequence, staticFile, useCurrentFrame } from "remotion";
import "../brand/fonts";
import {
  BlurWipe,
  DashedGrid,
  EmberGlow,
  Flash,
  Grain,
  MonoLabel,
  Signature,
  Sparks,
  WordByWord,
} from "../brand/elements";
import { FootageCard } from "../brand/FootageCard";
import { C, F } from "../brand/tokens";
import { Sfx } from "../sfx";

// Reel vertical 1080×1920 @30fps: animaciones para Kallpa (carrusel 3D + lata eléctrica)
export const KALLPA_REEL = { fps: 30, width: 1080, height: 1920, durationInFrames: 696 };

const T = {
  intro: 0,
  kallpa: 78,
  bridge: 282,
  electric: 356,
  question: 546,
  signature: 606,
  end: 696,
};

// Destellos de la lata eléctrica (frames relativos a T.electric)
const ZAPS = [22, 70, 112, 148];
// Impactos donde se baja la música
const HITS = [T.kallpa, T.electric, T.signature];

const CardScene: React.FC<{
  index: string;
  title: string;
  tech: string;
  src: string;
  zoom?: number;
  flareAt?: number[];
  rotateY?: [number, number];
}> = ({ index, title, tech, src, zoom, flareAt = [], rotateY }) => {
  const frame = useCurrentFrame();
  const flare = flareAt.reduce((m, z) => Math.max(m, frame >= z ? Math.exp(-(frame - z) / 4) : 0), 0);
  const labelIn = interpolate(frame, [10, 24], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ background: C.surface }}>
      <EmberGlow intensity={1 + flare * 0.8} />
      <DashedGrid opacity={0.18} />
      <Sparks seed={index} />
      <AbsoluteFill style={{ alignItems: "center", top: 270 }}>
        <FootageCard src={src} width={880} height={1060} zoom={zoom} flare={flare} rotateY={rotateY} />
      </AbsoluteFill>
      <div style={{ position: "absolute", top: 180, width: "100%", textAlign: "center", opacity: labelIn }}>
        <MonoLabel color={C.ember}>{index}</MonoLabel>
      </div>
      <div
        style={{
          position: "absolute",
          top: 1420,
          width: "100%",
          textAlign: "center",
          opacity: labelIn,
          transform: `translateY(${(1 - labelIn) * 16}px)`,
        }}
      >
        <div style={{ fontFamily: F.sans, fontWeight: 500, fontSize: 64, color: C.ink, letterSpacing: "-0.02em" }}>
          {title}
        </div>
        <MonoLabel style={{ marginTop: 14 }}>{tech}</MonoLabel>
      </div>
    </AbsoluteFill>
  );
};

const LightSweep: React.FC = () => {
  const frame = useCurrentFrame();
  const x = interpolate(frame, [0, 60], [-40, 120], { easing: Easing.inOut(Easing.quad) });
  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(115deg, transparent ${x - 25}%, rgba(240,236,244,.16) ${x}%, transparent ${x + 25}%)`,
        filter: "blur(20px)",
      }}
    />
  );
};

export const KallpaReel: React.FC = () => {
  const music = (f: number) => {
    const duck = HITS.reduce((m, h) => Math.min(m, f >= h && f < h + 10 ? 0.45 : 1), 1);
    const fadeOut = interpolate(f, [T.end - 40, T.end], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    return 0.32 * duck * fadeOut;
  };

  return (
    <AbsoluteFill style={{ background: C.surface }}>
      {/* 1. Papel: "Dos / animaciones / para Kallpa" */}
      <Sequence from={T.intro} durationInFrames={T.kallpa - T.intro} name="Intro">
        <AbsoluteFill style={{ background: C.paper }}>
          <WordByWord
            every={26}
            size={104}
            groups={[[{ text: "Dos" }], [{ text: "animaciones" }], [{ text: "para" }, { text: "Kallpa", accent: "both" }]]}
          />
        </AbsoluteFill>
      </Sequence>

      {/* 2. Brasa: carrusel 3D */}
      <Sequence from={T.kallpa} durationInFrames={T.bridge - T.kallpa} name="Carrusel Kallpa">
        <CardScene index="01 — Carrusel 3D" title="Kallpa" tech="Three.js · WebGL" src="footage/kallpa.mp4" zoom={1.12} />
        <Flash />
      </Sequence>

      {/* 3. Papel: "Y luego, / le dimos / energía" */}
      <Sequence from={T.bridge} durationInFrames={T.electric - T.bridge} name="Puente">
        <AbsoluteFill style={{ background: C.surface }} />
        <BlurWipe duration={10}>
          <WordByWord
            every={24}
            size={104}
            groups={[[{ text: "Y luego," }], [{ text: "le dimos" }], [{ text: "energía", accent: "both" }]]}
          />
        </BlurWipe>
      </Sequence>

      {/* 4. Brasa: lata eléctrica */}
      <Sequence from={T.electric} durationInFrames={T.question - T.electric} name="Lata eléctrica">
        <CardScene
          index="02 — Lata eléctrica"
          title="Kallpa"
          tech="Canvas · Three.js"
          src="footage/electricidad.mp4"
          zoom={1.9}
          flareAt={ZAPS}
          rotateY={[8, -8]}
        />
        <Flash />
      </Sequence>

      {/* 5. Negro: pregunta */}
      <Sequence from={T.question} durationInFrames={T.signature - T.question} name="Pregunta">
        <AbsoluteFill style={{ background: C.surface }}>
          <LightSweep />
          <WordByWord
            every={30}
            size={72}
            color={C.ink}
            groups={[[{ text: "¿Tienes un proyecto" }], [{ text: "en" }, { text: "mente?", accent: "serif" }]]}
          />
        </AbsoluteFill>
      </Sequence>

      {/* 6. Firma */}
      <Sequence from={T.signature} durationInFrames={T.end - T.signature} name="Firma">
        <AbsoluteFill style={{ background: C.surface }}>
          <Signature size={150} />
        </AbsoluteFill>
      </Sequence>

      <Grain opacity={0.07} />

      {/* Sonido */}
      <Audio src={staticFile("sfx/ambient-sounds/pulse-bed-110-bpm.wav")} volume={music} />
      <Sfx id="cinematic-whooshes/soft-swish" at={0} volume={0.5} />
      <Sfx id="cinematic-whooshes/soft-swish" at={26} volume={0.5} />
      <Sfx id="cinematic-whooshes/air-whoosh" at={52} volume={0.6} />
      <Sfx id="risers/noise-riser" at={T.kallpa - 60} volume={0.35} />
      <Sfx id="transitions/flash-cut" at={T.kallpa} volume={0.7} />
      <Sfx id="bass-impacts/sub-hit" at={T.kallpa} volume={0.9} />
      <Sfx id="ui-sounds/pop" at={T.kallpa + 12} volume={0.35} />
      <Sfx id="transitions/swipe" at={T.bridge} volume={0.7} />
      <Sfx id="cinematic-whooshes/soft-swish" at={T.bridge + 24} volume={0.45} />
      <Sfx id="risers/tone-riser" at={T.electric - 60} volume={0.3} />
      <Sfx id="bass-impacts/deep-boom" at={T.electric} volume={0.85} />
      <Sfx id="product-sounds/electric-zap" at={T.electric} volume={0.7} />
      {ZAPS.map((z) => (
        <Sfx key={z} id="product-sounds/electric-zap" at={T.electric + z} volume={0.45} />
      ))}
      <Sfx id="product-sounds/electric-crackle" at={T.electric + 60} volume={0.25} />
      <Sfx id="cinematic-whooshes/air-whoosh" at={T.question} volume={0.45} />
      <Sfx id="bass-impacts/sub-hit" at={T.signature} volume={0.8} />
    </AbsoluteFill>
  );
};
