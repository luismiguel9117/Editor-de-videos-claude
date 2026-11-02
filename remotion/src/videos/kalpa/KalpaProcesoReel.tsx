import { Audio } from "@remotion/media";
import { linearTiming, TransitionSeries } from "@remotion/transitions";
import React from "react";
import { AbsoluteFill, Easing, interpolate, Sequence, staticFile } from "remotion";
import { Bloom, blurZoom, Drift } from "../../brand/motion";
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
const TR = 20; // frames de cada transición (largas y solapadas)
const f = (s: number) => Math.round(s * FPS);

type Key = Exclude<keyof typeof ESTIMATED, "end">;
const ORDER: Key[] = ["intro", "plano", "capas", "girar", "chispa", "energia", "probar", "firma"];

// Frames de la transición que sale de cada escena (chispa → energía es más corta, con bloom)
const OUT: Partial<Record<Key, number>> = { chispa: 14 };
const outFrames = (k: Key) => (k === "firma" ? 0 : (OUT[k] ?? TR));

// Cada escena dura hasta el inicio de la siguiente + la transición (que se solapa),
// así cada escena empieza exactamente en su segundo de TIMING
const sceneFrames = (k: Key) => {
  const i = ORDER.indexOf(k);
  const next = i === ORDER.length - 1 ? TIMING.end : TIMING[ORDER[i + 1]];
  return f(next - TIMING[k]) + outFrames(k);
};

export const KALPA_PROCESO_REEL = { fps: FPS, width: 1080, height: 1920, durationInFrames: f(TIMING.end) };

const SCENES: Record<Key, React.ReactNode> = {
  intro: <S1Intro />,
  plano: <S2Plano />,
  capas: <S3Capas closeAt={sceneFrames("capas") - 34} />,
  girar: <S4Girar />,
  chispa: <S5Chispa />,
  energia: <S6Energia />,
  probar: <S7Probar />,
  firma: <S8Firma />,
};

export const KalpaProcesoReel: React.FC = () => {
  const s = (k: Key) => f(TIMING[k]);
  // Centro de la transición que entra a la escena k
  const mid = (k: Key) => s(k) + Math.round(outFrames(ORDER[ORDER.indexOf(k) - 1]) / 2);
  const music = (fr: number) => {
    const fadeOut = interpolate(fr, [f(TIMING.end) - 60, f(TIMING.end)], [1, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    // Con voz, la música baja para dejarla al frente
    return (HAS_VOICE ? 0.28 : 0.6) * fadeOut;
  };

  return (
    <AbsoluteFill style={{ background: C.black }}>
      <TransitionSeries>
        {ORDER.map((k, i) => (
          <React.Fragment key={k}>
            {i > 0 && (
              <TransitionSeries.Transition
                presentation={blurZoom()}
                timing={linearTiming({ durationInFrames: outFrames(ORDER[i - 1]), easing: Easing.inOut(Easing.cubic) })}
              />
            )}
            <TransitionSeries.Sequence durationInFrames={sceneFrames(k)} name={k}>
              <Drift>{SCENES[k]}</Drift>
            </TransitionSeries.Sequence>
          </React.Fragment>
        ))}
      </TransitionSeries>

      {/* Bloom de luz azul al pasar de "chispa" a "energía" */}
      <Sequence from={mid("energia") - 8} durationInFrames={16} name="Bloom">
        <Bloom duration={16} />
      </Sequence>

      {/* Música propia: pad con reverb y beat a medio tiempo (tramos 3.5–14 s y 15.5–20 s) */}
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

      {/* Efectos premium: pocos, graves y con reverb (skill motion-premium) */}
      <Sfx id="ambient-sounds/night-air" at={0} volume={0.22} />
      <Sfx id="bass-impacts/sub-swell" at={0} volume={0.45} />
      <Sfx id="cinematic-whooshes/silk-sweep" at={0} volume={0.45} />
      <Sfx id="cinematic-whooshes/deep-pass" at={mid("plano") - 17} volume={0.5} />
      <Sfx id="transitions/air-transition" at={mid("capas") - 11} volume={0.45} />
      <Sfx id="cinematic-whooshes/silk-sweep" at={s("capas") + 6} volume={0.3} />
      <Sfx id="bass-impacts/soft-impact" at={s("capas") + sceneFrames("capas") - 34 + 12} volume={0.35} />
      <Sfx id="cinematic-whooshes/silk-sweep" at={mid("girar") - 20} volume={0.5} />
      <Sfx id="transitions/air-transition" at={mid("chispa") - 11} volume={0.35} />
      <Sfx id="product-sounds/glint" at={s("chispa") + 6} volume={0.55} />
      <Sfx id="risers/reverse-swell" at={mid("energia") - 48} volume={0.55} />
      <Sfx id="bass-impacts/soft-impact" at={mid("energia")} volume={0.75} />
      <Sfx id="product-sounds/electric-hum" at={mid("energia") + 2} volume={0.4} />
      <Sfx id="cinematic-whooshes/deep-pass" at={mid("probar") - 17} volume={0.5} />
      <Sfx id="bass-impacts/sub-swell" at={s("probar")} volume={0.35} />
      <Sfx id="transitions/air-transition" at={mid("firma") - 11} volume={0.4} />
      <Sfx id="bass-impacts/soft-impact" at={mid("firma")} volume={0.6} />
      <Sfx id="product-sounds/glint" at={mid("firma") + 8} volume={0.3} />
    </AbsoluteFill>
  );
};
