import { Audio } from "@remotion/media";
import React from "react";
import { Sequence } from "remotion";
import { getSfx, pickSfx, sfxSrc, type SfxCategory, type SfxEntry } from "./catalog";

type CommonProps = {
  /** Frame en el que suena el efecto */
  at?: number;
  /** Volumen 0–1 */
  volume?: number;
  /** Duración máxima en frames (por defecto, el archivo completo) */
  durationInFrames?: number;
};

const Play: React.FC<CommonProps & { entry: SfxEntry }> = ({
  entry,
  at = 0,
  volume = 1,
  durationInFrames,
}) => (
  <Sequence from={at} durationInFrames={durationInFrames} layout="none" name={`SFX ${entry.id}`}>
    <Audio src={sfxSrc(entry)} volume={volume} />
  </Sequence>
);

/** Reproduce un efecto concreto del catálogo: <Sfx id="transitions/swoosh-01" at={30} /> */
export const Sfx: React.FC<CommonProps & { id: string }> = ({ id, ...rest }) => (
  <Play entry={getSfx(id)} {...rest} />
);

/**
 * Elige automáticamente un efecto de una categoría (y texto opcional):
 * <SfxCue category="bass-impacts" at={45} seed="logo" />
 */
export const SfxCue: React.FC<
  CommonProps & { category?: SfxCategory; text?: string; seed?: string | number }
> = ({ category, text, seed, ...rest }) => {
  const entry = pickSfx({ category, text }, seed ?? `${category}-${text}-${rest.at ?? 0}`);
  if (!entry) return null;
  return <Play entry={entry} {...rest} />;
};

export type SfxEvent =
  | "scene-change"
  | "text-in"
  | "logo-reveal"
  | "build-up"
  | "button"
  | "product-shot"
  | "ambience";

/** Qué categoría suena en cada tipo de evento del video */
export const EVENT_CATEGORY: Record<SfxEvent, SfxCategory> = {
  "scene-change": "transitions",
  "text-in": "cinematic-whooshes",
  "logo-reveal": "bass-impacts",
  "build-up": "risers",
  button: "ui-sounds",
  "product-shot": "product-sounds",
  ambience: "ambient-sounds",
};

/**
 * Pista de efectos automática a partir de una lista de eventos:
 * <SfxTrack events={[{ type: "build-up", at: 0 }, { type: "logo-reveal", at: 60 }]} />
 */
export const SfxTrack: React.FC<{
  events: { type: SfxEvent; at: number; volume?: number; id?: string }[];
}> = ({ events }) => (
  <>
    {events.map((e, i) =>
      e.id ? (
        <Sfx key={i} id={e.id} at={e.at} volume={e.volume} />
      ) : (
        <SfxCue
          key={i}
          category={EVENT_CATEGORY[e.type]}
          at={e.at}
          volume={e.volume}
          seed={`${e.type}-${i}`}
        />
      ),
    )}
  </>
);
