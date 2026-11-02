#!/usr/bin/env node
// Masteriza el audio de un render para redes: -14 LUFS integrados, picos <= -1 dBTP
// (loudnorm en dos pasadas). El video se copia sin recomprimir.
// Uso: npm run master -- out/video.mp4 [out/video-master.mp4]
import { execFileSync, spawnSync } from "node:child_process";

const [input, output = input.replace(/\.mp4$/, "-master.mp4")] = process.argv.slice(2);
if (!input) {
  console.error("Uso: npm run master -- entrada.mp4 [salida.mp4]");
  process.exit(1);
}
const target = "I=-14:TP=-1.5:LRA=11";
const pass1 = spawnSync("ffmpeg", ["-hide_banner", "-i", input, "-af", `loudnorm=${target}:print_format=json`, "-f", "null", "-"], {
  encoding: "utf8",
});
const m = JSON.parse(pass1.stderr.slice(pass1.stderr.lastIndexOf("{")));
const filter = `loudnorm=${target}:measured_I=${m.input_i}:measured_TP=${m.input_tp}:measured_LRA=${m.input_lra}:measured_thresh=${m.input_thresh}:offset=${m.target_offset}:linear=true,aresample=48000`;
execFileSync("ffmpeg", ["-v", "error", "-y", "-i", input, "-c:v", "copy", "-af", filter, "-c:a", "aac", "-b:a", "256k", "-movflags", "+faststart", output]);
console.log(`Listo: ${output} (antes ${m.input_i} LUFS, pico ${m.input_tp} dBTP)`);
