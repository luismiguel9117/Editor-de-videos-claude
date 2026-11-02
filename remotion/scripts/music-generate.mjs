#!/usr/bin/env node
// Sintetiza una pista musical propia (sin muestras de terceros) a 120 BPM,
// con secciones que caen en los cortes del video.
//
// Uso: node scripts/music-generate.mjs <salida.wav> [duraciónSeg] [drops...]
//   drops: segundos donde entra el beat completo, p. ej. "3 13"; el beat se corta en
//   la sección "break" (entre el fin del primer drop y el segundo) y en el final.
//
// Estructura por defecto (reel de 24 s): intro 0–3 · drop 3–10 · break 10–13 ·
// drop 13–19 · outro 19–24 (impacto final en 21).

import { writeFileSync } from "node:fs";

const out = process.argv[2] ?? "music.wav";
const DUR = Number(process.argv[3] ?? 24);
const SR = 48000;
const BPM = 120;
const BEAT = 60 / BPM;
const N = Math.round(DUR * SR);
const L = new Float32Array(N);
const R = new Float32Array(N);

const SECTIONS = { drop1: [3, 10], drop2: [13, 19], outroHit: 21 };
const inRange = (t, [a, b]) => t >= a && t < b;
const beatOn = (t) => inRange(t, SECTIONS.drop1) || inRange(t, SECTIONS.drop2);

// Progresión en Re menor: Dm – Bb – F – C (un acorde por compás de 4 tiempos)
const mtof = (m) => 440 * 2 ** ((m - 69) / 12);
const CHORDS = [
  [50, 53, 57, 62], // Dm
  [46, 50, 53, 58], // Bb
  [53, 57, 60, 65], // F
  [48, 52, 55, 60], // C
];
const chordAt = (t) => CHORDS[Math.floor(t / (BEAT * 4)) % CHORDS.length];

// Pseudoaleatorio determinista
let seed = 1234567;
const rnd = () => ((seed = (seed * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff) * 2 - 1;

const add = (i, l, r = l) => {
  if (i >= 0 && i < N) {
    L[i] += l;
    R[i] += r;
  }
};

// 1) Pad: sierra con banda limitada (6 armónicos), 2 voces desafinadas, filtrado suave
{
  let lpL = 0, lpR = 0;
  for (let i = 0; i < N; i++) {
    const t = i / SR;
    const chord = chordAt(t);
    let sL = 0, sR = 0;
    for (const m of chord) {
      const f = mtof(m);
      for (let h = 1; h <= 6; h++) {
        sL += Math.sin(2 * Math.PI * f * 1.003 * h * t) / h;
        sR += Math.sin(2 * Math.PI * f * 0.997 * h * t) / h;
      }
    }
    // Filtro que se abre en los drops
    const open = beatOn(t) ? 0.09 : 0.04;
    lpL += (sL - lpL) * open;
    lpR += (sR - lpR) * open;
    // "Sidechain": el pad respira con el bombo
    const phase = (t % BEAT) / BEAT;
    const pump = beatOn(t) ? 0.35 + 0.65 * Math.min(1, phase * 2.2) : 1;
    const fade = Math.min(1, t / 2) * Math.min(1, (DUR - t) / 2.5);
    add(i, lpL * 0.03 * pump * fade, lpR * 0.03 * pump * fade);
  }
}

// 2) Arpegio pluck en semicorcheas (intro, break y outro), con eco estéreo
{
  const step = BEAT / 4;
  for (let k = 0; k * step < DUR; k++) {
    const t0 = k * step;
    if (inRange(t0, SECTIONS.drop1) && k % 2) continue; // menos denso en los drops
    const chord = chordAt(t0);
    const m = chord[[0, 2, 1, 3, 2, 1, 3, 2][k % 8]] + 12;
    const f = mtof(m);
    const amp = (beatOn(t0) ? 0.05 : 0.08) * Math.min(1, (DUR - t0) / 3);
    const len = Math.round(0.35 * SR);
    const s0 = Math.round(t0 * SR);
    for (let j = 0; j < len; j++) {
      const tt = j / SR;
      const v = (Math.sin(2 * Math.PI * f * tt) + 0.3 * Math.sin(4 * Math.PI * f * tt)) * Math.exp(-tt * 11) * amp;
      add(s0 + j, v * 0.9, v * 0.6);
      // eco a 3/8 de tiempo, rebotando
      add(s0 + j + Math.round(BEAT * 0.75 * SR), v * 0.25, v * 0.4);
      add(s0 + j + Math.round(BEAT * 1.5 * SR), v * 0.15, v * 0.08);
    }
  }
}

// 3) Bombo, bajo y hats en los drops
for (let b = 0; b * BEAT < DUR; b++) {
  const t0 = b * BEAT;
  if (!beatOn(t0)) continue;
  const s0 = Math.round(t0 * SR);
  // Bombo
  for (let j = 0; j < 0.45 * SR; j++) {
    const tt = j / SR;
    const ph = 2 * Math.PI * (45 * tt + (110 / 28) * (1 - Math.exp(-tt * 28)));
    add(s0 + j, Math.sin(ph) * Math.exp(-tt * 7) * 0.55);
  }
  // Bajo: raíz del acorde, en corcheas después del bombo
  const root = mtof(chordAt(t0)[0] - 12);
  for (let half = 0; half < 2; half++) {
    const sb = s0 + Math.round((half * BEAT) / 2 * SR) + Math.round(0.02 * SR);
    for (let j = 0; j < 0.22 * SR; j++) {
      const tt = j / SR;
      const v = (Math.sin(2 * Math.PI * root * tt) + 0.25 * Math.sin(4 * Math.PI * root * tt)) * Math.exp(-tt * 6) * 0.16;
      add(sb + j, v);
    }
  }
  // Hat en el contratiempo y uno suave en semicorchea
  for (const [off, a] of [[0.5, 0.06], [0.75, 0.025]]) {
    const sh = s0 + Math.round(off * BEAT * SR);
    let prev = 0;
    for (let j = 0; j < 0.06 * SR; j++) {
      const n = rnd();
      const hp = n - prev; // paso alto
      prev = n;
      const v = hp * Math.exp(-(j / SR) * 70) * a;
      add(sh + j, v * 0.8, v);
    }
  }
}

// 4) Barridos de ruido hacia cada drop y un impacto final
for (const target of [SECTIONS.drop1[0], SECTIONS.drop2[0]]) {
  const len = 1.6;
  const s0 = Math.round((target - len) * SR);
  let lp = 0;
  for (let j = 0; j < len * SR; j++) {
    const p = j / (len * SR);
    lp += (rnd() - lp) * (0.02 + p * 0.5);
    add(s0 + j, lp * p * p * 0.12, lp * p * p * 0.12);
  }
}
{
  const s0 = Math.round(SECTIONS.outroHit * SR);
  for (let j = 0; j < 2.5 * SR; j++) {
    const tt = j / SR;
    const v = Math.sin(2 * Math.PI * (40 * tt + (90 / 20) * (1 - Math.exp(-tt * 20)))) * Math.exp(-tt * 1.8) * 0.5;
    add(s0 + j, v);
  }
}

// Normaliza a -3 dBFS y escribe WAV 16 bit estéreo
let peak = 0;
for (let i = 0; i < N; i++) peak = Math.max(peak, Math.abs(L[i]), Math.abs(R[i]));
const gain = (10 ** (-3 / 20)) / peak;
const buf = Buffer.alloc(44 + N * 4);
buf.write("RIFF", 0);
buf.writeUInt32LE(36 + N * 4, 4);
buf.write("WAVEfmt ", 8);
buf.writeUInt32LE(16, 16);
buf.writeUInt16LE(1, 20);
buf.writeUInt16LE(2, 22);
buf.writeUInt32LE(SR, 24);
buf.writeUInt32LE(SR * 4, 28);
buf.writeUInt16LE(4, 32);
buf.writeUInt16LE(16, 34);
buf.write("data", 36);
buf.writeUInt32LE(N * 4, 40);
for (let i = 0; i < N; i++) {
  buf.writeInt16LE(Math.round(Math.max(-1, Math.min(1, L[i] * gain)) * 32767), 44 + i * 4);
  buf.writeInt16LE(Math.round(Math.max(-1, Math.min(1, R[i] * gain)) * 32767), 46 + i * 4);
}
writeFileSync(out, buf);
console.log(`Música generada: ${out} (${DUR} s, ${BPM} BPM)`);
