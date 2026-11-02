#!/usr/bin/env node
// Sincroniza un reel con la voz en off.
//
// Uso: node scripts/voice-timing.mjs <audio-de-voz> [frases=7]
//
// 1. Limpia la voz (filtro de graves, reducción de ruido, nivel) → public/voice/kalpa-vo.wav
// 2. Detecta las pausas y encuentra el inicio de cada frase (se asume una pausa clara
//    entre frase y frase, como en las indicaciones de grabación).
// 3. Escribe src/videos/kalpa/voice-timing.json con el segundo de inicio de cada escena.
// 4. Regenera la música con el beat cayendo en esos cortes.

import { execFileSync, spawnSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const [input, nArg] = process.argv.slice(2);
const N = Number(nArg ?? 7);
if (!input) {
  console.error("Uso: node scripts/voice-timing.mjs <audio-de-voz> [frases]");
  process.exit(1);
}

mkdirSync(join(root, "public/voice"), { recursive: true });
const clean = join(root, "public/voice/kalpa-vo.wav");
// Voz limpia: quita graves y ruido de fondo, comprime suave y nivela
execFileSync("ffmpeg", [
  "-v", "error", "-y", "-i", input,
  "-af", "highpass=f=80,afftdn=nf=-25,acompressor=threshold=-20dB:ratio=3:attack=5:release=80,loudnorm=I=-16:TP=-2",
  "-ac", "1", "-ar", "48000", clean,
]);

// Busca un umbral de silencio que separe exactamente N frases
const segmentsAt = (noise, minSil) => {
  const r = spawnSync("ffmpeg", ["-hide_banner", "-i", clean, "-af", `silencedetect=n=${noise}dB:d=${minSil}`, "-f", "null", "-"], {
    encoding: "utf8",
  });
  const starts = [...r.stderr.matchAll(/silence_start: ([\d.]+)/g)].map((m) => Number(m[1]));
  const ends = [...r.stderr.matchAll(/silence_end: ([\d.]+)/g)].map((m) => Number(m[1]));
  const dur = Number(
    execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", clean]).toString(),
  );
  // Voz = huecos entre silencios
  const speech = [];
  let cursor = 0;
  for (let i = 0; i < starts.length; i++) {
    if (starts[i] - cursor > 0.25) speech.push([cursor, starts[i]]);
    cursor = ends[i] ?? dur;
  }
  if (dur - cursor > 0.25) speech.push([cursor, dur]);
  return speech;
};

let speech = null;
search: for (const minSil of [0.9, 0.7, 0.6, 0.5, 1.2, 0.4]) {
  for (const noise of [-35, -40, -30, -45, -28]) {
    const s = segmentsAt(noise, minSil);
    if (s.length === N) {
      speech = s;
      console.log(`Frases detectadas con silencio < ${noise} dB durante ${minSil} s`);
      break search;
    }
  }
}
if (!speech) {
  console.error(`No pude separar ${N} frases. Revisa que haya ~2 s de pausa entre frase y frase.`);
  process.exit(1);
}

// La primera frase empieza 0.4 s después del inicio del video
const offset = 0.4 - speech[0][0];
const at = speech.map(([a, b]) => [a + offset, b + offset]);
const keys = ["intro", "plano", "capas", "girar", "chispa", "energia", "probar"];
const round = (x) => Math.round(x * 2) / 2; // los cortes caen en el beat (120 BPM = 0.5 s)
const timing = { intro: 0, voiceOffset: Math.round(offset * 1000) / 1000 };
keys.forEach((k, i) => {
  if (i > 0) timing[k] = round(at[i][0] - 0.25);
});
timing.firma = round(at[N - 1][1] + 0.5);
timing.end = timing.firma + 2.5;

writeFileSync(join(root, "src/videos/kalpa/voice-timing.json"), JSON.stringify(timing, null, 2) + "\n");
console.log("Tiempos de escena:", timing);

execFileSync("node", [
  join(root, "scripts/music-generate.mjs"),
  join(root, "public/music/kalpa-proceso-26s.wav"),
  String(timing.end),
  `${timing.plano}-${timing.chispa}`,
  `${timing.energia}-${timing.probar}`,
  String(timing.firma),
], { stdio: "inherit" });
console.log("Listo. Vuelve a renderizar KalpaProcesoReel.");
