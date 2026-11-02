import { Audio } from "@remotion/media";
import { linearTiming, TransitionSeries } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import React from "react";
import { AbsoluteFill, interpolate, Sequence, staticFile } from "remotion";
import { Flash } from "../../brand/elements";
import { C } from "../../brand/tokens";
import { Sfx } from "../../sfx";
import { S1Intro, S2Plano, S3Capas, S4Girar, S5Chispa, S6Energia, S7Probar, S8Firma } from "./scenes";
import voiceTiming from "./voice-timing.json";

// Reel "Proceso de trabajo" de KALPA (1080×1920, 30 fps).
//
// TIMING: segundo en que empieza cada escena. Hoy son estimados; cuando llegue la voz
// se reemplazan por el inicio real de cada frase con scripts/voice-timing.mjs, que escribe
// voice-timing.json; todo lo demás (transiciones, música, efectos) se recalcula solo.
const ESTIMATED = {
  intro: 0,
  plano: 3.5,
  capas: 7,
  girar: 11,
  chispa: 14,
  energia: 15.5,
  probar: 20,
  firma: 23.5,
  end: 26,
};
const VOICE = voiceTiming as Partial<typeof ESTIMATED> & { voiceOffset?: number };
export const TIMING: typeof ESTIMATED = { ...ESTIMATED, ...VOICE };
const HAS_VOICE = VOICE.voiceOffset !== undefined;

const FPS = 30;
const TR = 12; // frames de cada transición
const f = (s: number) => Math.round(s * FPS);

type Key = Exclude<keyof typeof ESTIMATED, "end">;
const ORDER: Key[] = ["intro", "plano", "capas", "girar", "chispa", "energia", "probar", "firma"];

// Frames de la transición que sale de cada escena (chispa → energía es casi un corte)
const OUT: Partial<Record<Key, number>> = { chispa: 4 };
const outFrames = (k: Key) => (k === "firma" ? 0 : (OUT[k] ?? TR));

// Cada escena dura hasta el inicio de la siguiente + la transición (que se solapa),
// así cada escena empieza exactamente en su segundo de TIMING
const sceneFrames = (k: Key) => {
  const i = ORDER.indexOf(k);
  const next = i === ORDER.length - 1 ? TIMING.end : TIMING[ORDER[i + 1]];
  return f(next - TIMING[k]) + outFrames(k);
};

export const KALPA_PROCESO_REEL = { fps: FPS, width: 1080, height: 1920, durationInFrames: f(TIMING.end) };

const timing = linearTiming({ durationInFrames: TR });

export const KalpaProcesoReel: React.FC = () => {
  const s = (k: Key) => f(TIMING[k]);
  const music = (fr: number) => {
    const fadeOut = interpolate(fr, [f(TIMING.end) - 45, f(TIMING.end)], [1, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    // Con voz, la música baja para dejarla al frente
    return (HAS_VOICE ? 0.2 : 0.42) * fadeOut;
  };

  return (
    <AbsoluteFill style={{ background: C.black }}>
      <TransitionSeries>
        <TransitionSeries.Sequence durationInFrames={sceneFrames("intro")}>
          <S1Intro />
        </TransitionSeries.Sequence>
        {/* La lata "cae" y aparece la etiqueta acostada */}
        <TransitionSeries.Transition presentation={slide({ direction: "from-bottom" })} timing={timing} />
        <TransitionSeries.Sequence durationInFrames={sceneFrames("plano")}>
          <S2Plano />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={timing} />
        <TransitionSeries.Sequence durationInFrames={sceneFrames("capas")}>
          <S3Capas closeAt={sceneFrames("capas") - 30} />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={slide({ direction: "from-right" })} timing={timing} />
        <TransitionSeries.Sequence durationInFrames={sceneFrames("girar")}>
          <S4Girar />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={timing} />
        <TransitionSeries.Sequence durationInFrames={sceneFrames("chispa")}>
          <S5Chispa />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: outFrames("chispa") })} />
        <TransitionSeries.Sequence durationInFrames={sceneFrames("energia")}>
          <S6Energia />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={slide({ direction: "from-bottom" })} timing={timing} />
        <TransitionSeries.Sequence durationInFrames={sceneFrames("probar")}>
          <S7Probar />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={timing} />
        <TransitionSeries.Sequence durationInFrames={sceneFrames("firma")}>
          <S8Firma />
        </TransitionSeries.Sequence>
      </TransitionSeries>

      {/* Destello azul en la "chispa" → "energía" */}
      <Sequence from={s("energia") - 2} durationInFrames={12} name="Flash">
        <Flash color={C.blueBright} frames={2} />
      </Sequence>

      {/* Música (beat en 3.5–14 s y 15.5–20 s, impacto final en 23.5 s) */}
      <Audio src={staticFile("music/kalpa-proceso-26s.wav")} volume={music} />

      {/* Voz en off (cuando existe public/voice/kalpa-vo.wav sincronizada) */}
      {HAS_VOICE && (
        <Sequence from={Math.max(0, f(VOICE.voiceOffset ?? 0))} name="Voz">
          <Audio
            src={staticFile("voice/kalpa-vo.wav")}
            trimBefore={Math.max(0, -f(VOICE.voiceOffset ?? 0))}
            volume={1}
          />
        </Sequence>
      )}

      {/* Efectos */}
      <Sfx id="cinematic-whooshes/air-whoosh" at={s("intro") + 6} volume={0.5} />
      <Sfx id="ui-sounds/pop" at={s("intro") + 2} volume={0.3} />
      <Sfx id="transitions/swipe" at={s("plano") - 6} volume={0.6} />
      <Sfx id="cinematic-whooshes/soft-swish" at={s("plano") + 6} volume={0.45} />
      <Sfx id="transitions/flash-cut" at={s("capas") - 4} volume={0.35} />
      <Sfx id="cinematic-whooshes/air-whoosh" at={s("capas") + 8} volume={0.55} />
      <Sfx id="bass-impacts/sub-hit" at={s("girar") - 14} volume={0.55} />
      <Sfx id="transitions/swipe" at={s("girar") - 6} volume={0.6} />
      <Sfx id="cinematic-whooshes/soft-swish" at={s("girar") + 20} volume={0.35} />
      <Sfx id="cinematic-whooshes/soft-swish" at={s("girar") + 55} volume={0.35} />
      <Sfx id="risers/tone-riser" at={s("energia") - 60} volume={0.3} />
      <Sfx id="ui-sounds/soft-click" at={s("chispa") + 4} volume={0.5} />
      <Sfx id="transitions/flash-cut" at={s("energia") - 2} volume={0.6} />
      <Sfx id="bass-impacts/deep-boom" at={s("energia")} volume={0.8} />
      <Sfx id="product-sounds/electric-zap" at={s("energia")} volume={0.65} />
      {[15, 30, 45, 60, 90].map((d) => (
        <Sfx key={d} id="product-sounds/electric-zap" at={s("energia") + d} volume={0.35} />
      ))}
      <Sfx id="product-sounds/electric-crackle" at={s("energia") + 20} volume={0.25} />
      <Sfx id="product-sounds/electric-crackle" at={s("energia") + 70} volume={0.2} />
      <Sfx id="transitions/swipe" at={s("probar") - 6} volume={0.55} />
      <Sfx id="product-sounds/can-open" at={s("probar") + 18} volume={0.5} />
      <Sfx id="ui-sounds/pop" at={s("probar") + 40} volume={0.3} />
      <Sfx id="bass-impacts/sub-hit" at={s("firma")} volume={0.7} />
    </AbsoluteFill>
  );
};
