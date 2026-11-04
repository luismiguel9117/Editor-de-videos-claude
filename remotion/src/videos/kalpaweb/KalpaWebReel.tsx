import { Audio } from "@remotion/media";
import { linearTiming, TransitionSeries } from "@remotion/transitions";
import React from "react";
import { AbsoluteFill, Easing, interpolate, Sequence, staticFile } from "remotion";
import { Bloom, blurZoom, Drift } from "../../brand/motion";
import { Sfx } from "../../sfx";
import { W1Busca, W2Revela, W3Hero, W4Tienda, W5Origen, W6Movil, W7Paginas, W8Shopify, W9Firma } from "./scenes";
import voiceTiming from "./voice-timing.json";

// Presentación de kalpa.pe (1080×1350, 30 fps). TIMING = segundo en que empieza cada escena;
// con voz, se reemplaza por voice-timing.json y todo se recalcula.
const ESTIMATED = {
  busca: 0,
  revela: 3.7,
  hero: 6.35,
  tienda: 9.45,
  origen: 13.6,
  movil: 17.1,
  paginas: 19.75,
  shopify: 23,
  firma: 25.8,
  end: 28.8,
};
const VOICE = voiceTiming as Partial<typeof ESTIMATED> & { voiceOffset?: number };
export const TIMING: typeof ESTIMATED = { ...ESTIMATED, ...VOICE };
const HAS_VOICE = VOICE.voiceOffset !== undefined;

const FPS = 30;
const TR = 18;
const f = (s: number) => Math.round(s * FPS);
type Key = Exclude<keyof typeof ESTIMATED, "end">;
const ORDER: Key[] = ["busca", "revela", "hero", "tienda", "origen", "movil", "paginas", "shopify", "firma"];
// La barra dorada pasa a la web casi sin transición (la franja es la transición)
const OUT: Partial<Record<Key, number>> = { busca: 4 };
const outFrames = (k: Key) => (k === "firma" ? 0 : (OUT[k] ?? TR));
const sceneFrames = (k: Key) => {
  const i = ORDER.indexOf(k);
  const next = i === ORDER.length - 1 ? TIMING.end : TIMING[ORDER[i + 1]];
  return f(next - TIMING[k]) + outFrames(k);
};
export const KALPA_WEB_REEL = { fps: FPS, width: 1080, height: 1350, durationInFrames: f(TIMING.end) };

const SCENES: Record<Key, React.ReactNode> = {
  busca: <W1Busca />,
  revela: <W2Revela />,
  hero: <W3Hero />,
  tienda: <W4Tienda />,
  origen: <W5Origen />,
  movil: <W6Movil />,
  paginas: <W7Paginas />,
  shopify: <W8Shopify />,
  firma: <W9Firma />,
};

export const KalpaWebReel: React.FC = () => {
  const s = (k: Key) => f(TIMING[k]);
  const mid = (k: Key) => s(k) + Math.round(outFrames(ORDER[ORDER.indexOf(k) - 1]) / 2);
  const music = (fr: number) => {
    const fadeIn = interpolate(fr, [0, 20], [0.5, 1], { extrapolateRight: "clamp" });
    const fadeOut = interpolate(fr, [f(TIMING.end) - 60, f(TIMING.end)], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    return (HAS_VOICE ? 0.28 : 0.6) * fadeIn * fadeOut;
  };
  return (
    <AbsoluteFill style={{ background: "#07080a" }}>
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
              {k === "busca" || k === "revela" ? SCENES[k] : <Drift>{SCENES[k]}</Drift>}
            </TransitionSeries.Sequence>
          </React.Fragment>
        ))}
      </TransitionSeries>

      {/* Bloom dorado al revelar la web y al llegar a la firma */}
      <Sequence from={s("revela") - 4} durationInFrames={18} name="Bloom web">
        <Bloom duration={18} />
      </Sequence>

      <Audio src={staticFile("music/kalpa-web-29s.wav")} volume={music} />
      {HAS_VOICE && (
        <Sequence from={Math.max(0, f(VOICE.voiceOffset ?? 0))} name="Voz">
          <Audio src={staticFile("voice/kalpa-web-vo.wav")} trimBefore={Math.max(0, -f(VOICE.voiceOffset ?? 0))} />
        </Sequence>
      )}

      {/* Efectos premium (skill motion-premium) */}
      <Sfx id="ambient-sounds/night-air" at={0} volume={0.2} />
      <Sfx id="product-sounds/glint" at={2} volume={0.45} />
      <Sfx id="transitions/air-transition" at={12} volume={0.35} />
      <Sfx id="transitions/air-transition" at={88} volume={0.3} />
      <Sfx id="risers/reverse-swell" at={s("revela") - 48} volume={0.5} />
      <Sfx id="bass-impacts/soft-impact" at={s("revela")} volume={0.7} />
      <Sfx id="cinematic-whooshes/silk-sweep" at={mid("hero") - 20} volume={0.45} />
      <Sfx id="product-sounds/glint" at={s("hero") + 26} volume={0.3} />
      <Sfx id="cinematic-whooshes/deep-pass" at={mid("tienda") - 17} volume={0.45} />
      <Sfx id="transitions/air-transition" at={s("tienda") + 58} volume={0.35} />
      <Sfx id="transitions/air-transition" at={mid("origen") - 11} volume={0.4} />
      <Sfx id="bass-impacts/sub-swell" at={s("origen")} volume={0.35} />
      <Sfx id="cinematic-whooshes/silk-sweep" at={mid("movil") - 20} volume={0.45} />
      <Sfx id="cinematic-whooshes/deep-pass" at={mid("paginas") - 17} volume={0.45} />
      <Sfx id="transitions/air-transition" at={mid("shopify") - 11} volume={0.4} />
      <Sfx id="product-sounds/glint" at={s("shopify") + 24} volume={0.35} />
      <Sfx id="bass-impacts/soft-impact" at={mid("firma")} volume={0.6} />
      <Sfx id="product-sounds/glint" at={mid("firma") + 18} volume={0.3} />
    </AbsoluteFill>
  );
};
