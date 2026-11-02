#!/usr/bin/env node
// Sintetiza una pista musical propia, sobria y "premium" (sin muestras de terceros):
// pad cálido con reverb larga, sub bajo, beat a medio tiempo con bombo suave y
// un pluck espaciado. 120 BPM de grilla (los cortes caen cada 0.5 s), sensación de 60.
//
// Uso: node scripts/music-generate.mjs <salida.wav> [duraciónSeg] [drop1] [drop2] [impacto]
//   drop1 y drop2: tramos con beat, "inicio-fin" en segundos (p. ej. "3.5-14").
//   impacto: segundo del golpe final (p. ej. 23.5).

import { biquad, buffer, normalize, reseed, reverb, rnd, soft, SR, writeWav } from "./dsp.mjs";

const out = process.argv[2] ?? "music.wav";
const DUR = Number(process.argv[3] ?? 24);
const range = (arg, def) => (arg ? arg.split("-").map(Number) : def);
const SECTIONS = {
  drop1: range(process.argv[4], [3, 10]),
  drop2: range(process.argv[5], [13, 19]),
  outroHit: Number(process.argv[6] ?? 21),
};
const BEAT = 0.5;
const N = Math.round(DUR * SR);
const inRange = (t, [a, b]) => t >= a && t < b;
const beatOn = (t) => inRange(t, SECTIONS.drop1) || inRange(t, SECTIONS.drop2);
const mtof = (m) => 440 * 2 ** ((m - 69) / 12);
reseed(2024);

// Re menor, voicings abiertos y cálidos: Dm9 – Bbmaj7 – Fmaj9 – C(add9), 2 compases cada uno
const CHORDS = [
  [38, 50, 57, 60, 64, 65],
  [34, 50, 53, 57, 62, 65],
  [41, 52, 57, 60, 64, 67],
  [36, 52, 55, 60, 62, 67],
];
const BAR = BEAT * 4;
const chordAt = (t) => CHORDS[Math.floor(t / (BAR * 2)) % CHORDS.length];

const [pL, pR] = buffer(DUR); // pad + pluck (va a la reverb grande)
const [dL, dR] = buffer(DUR); // batería y bajo (reverb corta)

// 1) Pad: senos + triángulo suave, dos voces desafinadas, envolvente lenta por acorde
for (let i = 0; i < N; i++) {
  const t = i / SR;
  const chord = chordAt(t).slice(1);
  const local = t % (BAR * 2);
  const env = Math.min(1, local / 0.9) * (0.75 + 0.25 * Math.cos((2 * Math.PI * local) / (BAR * 2)));
  let l = 0, r = 0;
  for (const m of chord) {
    const f = mtof(m);
    const tri = (ph) => (2 / Math.PI) * Math.asin(Math.sin(ph));
    l += 0.6 * Math.sin(2 * Math.PI * f * 1.002 * t) + 0.25 * tri(2 * Math.PI * f * 0.999 * t);
    r += 0.6 * Math.sin(2 * Math.PI * f * 0.998 * t) + 0.25 * tri(2 * Math.PI * f * 1.001 * t);
  }
  const fade = Math.min(1, t / 2.5) * Math.min(1, (DUR - t) / 3);
  const lift = beatOn(t) ? 1 : 0.8;
  pL[i] += l * 0.018 * env * fade * lift;
  pR[i] += r * 0.018 * env * fade * lift;
}
{
  const f = (t) => (beatOn(t) ? 2600 : 1400);
  const l = biquad(pL, "lowpass", f, 0.6), r = biquad(pR, "lowpass", f, 0.6);
  pL.set(l); pR.set(r);
}

// 2) Pluck espaciado (felt): notas del acorde en 1 y 3, solo fuera de los drops y suave dentro
for (let k = 0; k * BEAT < DUR; k += 2) {
  const t0 = k * BEAT;
  const chord = chordAt(t0);
  const m = chord[[3, 4, 5, 4][(k / 2) % 4]] + 12;
  const f = mtof(m);
  const amp = (beatOn(t0) ? 0.035 : 0.06) * Math.min(1, (DUR - t0) / 3);
  const s0 = Math.round(t0 * SR);
  for (let j = 0; j < 1.6 * SR && s0 + j < N; j++) {
    const tt = j / SR;
    const e = Math.min(1, tt / 0.008) * Math.exp(-tt * 3.2);
    const v = (Math.sin(2 * Math.PI * f * tt) + 0.18 * Math.sin(4 * Math.PI * f * tt) * Math.exp(-tt * 8)) * e * amp;
    pL[s0 + j] += v * 0.8;
    pR[s0 + j] += v;
  }
}

// 3) Medio tiempo: bombo suave en 1 y 3, sub bajo, shaker muy bajo en corcheas
for (let b = 0; b * BEAT < DUR; b++) {
  const t0 = b * BEAT;
  if (!beatOn(t0)) continue;
  const s0 = Math.round(t0 * SR);
  if (b % 2 === 0) {
    for (let j = 0; j < 0.6 * SR && s0 + j < N; j++) {
      const tt = j / SR;
      const ph = 2 * Math.PI * (42 * tt + (70 / 22) * (1 - Math.exp(-tt * 22)));
      const v = Math.sin(ph) * Math.exp(-tt * 6) * Math.min(1, tt / 0.003) * 0.5;
      dL[s0 + j] += v; dR[s0 + j] += v;
    }
    const root = mtof(chordAt(t0)[0]);
    for (let j = 0; j < 0.95 * SR && s0 + j < N; j++) {
      const tt = j / SR;
      const v = Math.sin(2 * Math.PI * root * tt) * Math.min(1, tt / 0.03) * Math.exp(-tt * 2.2) * 0.22;
      dL[s0 + j] += v; dR[s0 + j] += v;
    }
  }
  // Shaker: ruido filtrado, contratiempo con un poco de swing
  const sh = s0 + Math.round((BEAT / 2 + 0.018) * SR);
  for (let j = 0; j < 0.07 * SR && sh + j < N; j++) {
    const v = rnd() * Math.exp(-(j / SR) * 55) * 0.03;
    dL[sh + j] += v * 0.7; dR[sh + j] += v;
  }
}
{
  // El shaker pasa por un paso alto para que sea aire, no "tss"
  const l = biquad(dL, "highpass", 30), r = biquad(dR, "highpass", 30);
  dL.set(l); dR.set(r);
}

// 4) Swell hacia cada drop (aire filtrado que se abre) e impacto final con cola
for (const target of [SECTIONS.drop1[0], SECTIONS.drop2[0]]) {
  const len = 1.8, s0 = Math.round((target - len) * SR);
  const n = new Float32Array(Math.round(len * SR)).map(() => rnd());
  const x = biquad(n, "bandpass", (t) => 300 + 3200 * (t / len) ** 2, 0.8);
  for (let j = 0; j < x.length; j++) {
    const p = j / x.length;
    pL[s0 + j] += x[j] * p * p * 0.05;
    pR[s0 + j] += x[j] * p * p * 0.05;
  }
}
{
  const s0 = Math.round(SECTIONS.outroHit * SR);
  for (let j = 0; j < 3 * SR && s0 + j < N; j++) {
    const tt = j / SR;
    const v = Math.sin(2 * Math.PI * (34 * tt + (18 / 9) * (1 - Math.exp(-tt * 9)))) * Math.exp(-tt * 1.7) * 0.45;
    dL[s0 + j] += v; dR[s0 + j] += v;
  }
}

// Mezcla: reverb grande al pad, corta a la batería, saturación suave
const [rpL, rpR] = reverb(pL, pR, { wet: 0.55, room: 0.9, damp: 0.3, width: 1 });
const [rdL, rdR] = reverb(dL, dR, { wet: 0.12, room: 0.6, damp: 0.5 });
const L = soft(rpL.map((v, i) => v + rdL[i]), 1.2);
const R = soft(rpR.map((v, i) => v + rdR[i]), 1.2);
writeWav(out, ...normalize(L, R, -3));
console.log(`Música generada: ${out} (${DUR} s)`);
