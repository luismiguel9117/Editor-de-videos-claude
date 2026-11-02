#!/usr/bin/env node
// Genera efectos de sonido propios con ffmpeg (síntesis, sin muestras de terceros)
// y los añade a la biblioteca local. Licencia: obra propia, libre para uso comercial.
//
// Uso: npm run sfx:generate

import { execFileSync, spawnSync } from "node:child_process";
import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const catalogPath = join(root, "src/sfx/catalog.json");
const catalog = JSON.parse(readFileSync(catalogPath, "utf8"));

// [categoría, nombre, etiquetas, filtro lavfi de ffmpeg]
const SOUNDS = [
  ["cinematic-whooshes", "Air Whoosh", ["whoosh", "air", "fast", "text"],
    "anoisesrc=d=0.9:c=pink:a=0.9,bandpass=f=900:w=1400,afade=t=in:d=0.35:curve=exp,afade=t=out:st=0.35:d=0.55:curve=exp,volume=2.2"],
  ["cinematic-whooshes", "Soft Swish", ["whoosh", "soft", "word", "text"],
    "anoisesrc=d=0.45:c=pink:a=0.7,highpass=f=1200,lowpass=f=7000,afade=t=in:d=0.12,afade=t=out:st=0.12:d=0.33,volume=1.4"],
  ["bass-impacts", "Sub Hit", ["impact", "boom", "sub", "logo", "hit"],
    "aevalsrc='0.95*sin(2*PI*(45*t+55*(1-exp(-t*18))/18))*exp(-t*3.2)':d=1.8:s=48000,alimiter=limit=0.9"],
  ["bass-impacts", "Deep Boom", ["impact", "boom", "cinematic", "trailer"],
    "aevalsrc='0.8*sin(2*PI*(38*t+80*(1-exp(-t*25))/25))*exp(-t*1.6)+0.25*(random(0)*2-1)*exp(-t*30)':d=2.8:s=48000,lowpass=f=900,alimiter=limit=0.9"],
  ["risers", "Noise Riser", ["riser", "build", "tension", "sweep"],
    "anoisesrc=d=2:c=white:a=0.6,highpass=f=300,lowpass=f=9000,afade=t=in:d=1.95:curve=exp,volume=1.6"],
  ["risers", "Tone Riser", ["riser", "build", "tone", "pitch"],
    "aevalsrc='0.35*sin(2*PI*(110*t+180*t*t/2))*(t/2)':d=2:s=48000,afade=t=out:st=1.92:d=0.08"],
  ["transitions", "Swipe", ["transition", "swipe", "slide", "wipe"],
    "anoisesrc=d=0.5:c=brown:a=0.9,bandpass=f=600:w=900,afade=t=in:d=0.15,afade=t=out:st=0.15:d=0.35,volume=2.5"],
  ["transitions", "Flash Cut", ["transition", "flash", "cut", "click"],
    "anoisesrc=d=0.18:c=white:a=0.9,highpass=f=2500,afade=t=out:st=0.01:d=0.17:curve=exp,volume=1.2"],
  ["ui-sounds", "Soft Click", ["ui", "click", "tap", "button"],
    "aevalsrc='0.7*sin(2*PI*1800*t)*exp(-t*90)':d=0.12:s=48000"],
  ["ui-sounds", "Pop", ["ui", "pop", "appear", "bubble"],
    "aevalsrc='0.6*sin(2*PI*(500*t+700*(1-exp(-t*40))/40))*exp(-t*30)':d=0.18:s=48000"],
  ["product-sounds", "Electric Zap", ["electric", "zap", "spark", "energy", "can"],
    "anoisesrc=d=0.35:c=white:a=1,bandpass=f=3200:w=2500,tremolo=f=55:d=1,afade=t=out:st=0.05:d=0.3,volume=1.8"],
  ["product-sounds", "Electric Crackle", ["electric", "crackle", "buzz", "energy"],
    "aevalsrc='0.5*sin(2*PI*100*t)*gt(random(0),0.55)+0.3*sin(2*PI*120*t)':d=1.2:s=48000,highpass=f=80,bandpass=f=1800:w=3000,afade=t=in:d=0.05,afade=t=out:st=0.8:d=0.4,volume=2"],
  ["product-sounds", "Can Open", ["can", "open", "fizz", "drink"],
    "anoisesrc=d=0.9:c=white:a=0.8,highpass=f=4000,afade=t=in:d=0.01,afade=t=out:st=0.06:d=0.84:curve=exp,volume=1.4"],
  ["ambient-sounds", "Dark Drone", ["ambient", "drone", "pad", "dark", "bed"],
    "aevalsrc='0.18*sin(2*PI*55*t)+0.12*sin(2*PI*82.4*t)+0.08*sin(2*PI*110*t+sin(2*PI*0.2*t))':d=12:s=48000,lowpass=f=600,afade=t=in:d=2,afade=t=out:st=10:d=2"],
  ["ambient-sounds", "Pulse Bed 110 BPM", ["music", "bed", "pulse", "beat", "minimal"],
    "aevalsrc='0.55*sin(2*PI*(50*mod(t,0.5454)+90*(1-exp(-mod(t,0.5454)*30))/30))*exp(-mod(t,0.5454)*9)+0.07*sin(2*PI*110*t)*(0.6+0.4*sin(2*PI*0.25*t))+0.05*sin(2*PI*164.8*t)+0.04*sin(2*PI*220*t)*(0.5+0.5*sin(2*PI*1.833*t))':d=24:s=48000,lowpass=f=2500,afade=t=in:d=1.5,afade=t=out:st=22:d=2,alimiter=limit=0.9"],
];

const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
let added = 0;
for (const [category, name, tags, filter] of SOUNDS) {
  const base = slug(name);
  const id = `${category}/${base}`;
  const dir = join(root, "public/sfx", category);
  mkdirSync(dir, { recursive: true });
  const file = join(dir, `${base}.wav`);
  const raw = join(dir, `.${base}.raw.wav`);
  execFileSync("ffmpeg", ["-v", "error", "-y", "-f", "lavfi", "-i", filter, "-ac", "2", "-ar", "48000", "-c:a", "pcm_f32le", raw]);
  // Normaliza el pico a -3 dBFS
  const probe = spawnSync("ffmpeg", ["-hide_banner", "-i", raw, "-af", "volumedetect", "-f", "null", "-"], { encoding: "utf8" });
  const max = Number((probe.stderr.match(/max_volume: (-?[0-9.]+) dB/) ?? [])[1] ?? 0);
  execFileSync("ffmpeg", ["-v", "error", "-y", "-i", raw, "-af", `volume=${(-3 - max).toFixed(2)}dB`, "-c:a", "pcm_s16le", file]);
  rmSync(raw);
  const duration = Number(
    execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", file]).toString(),
  );
  const entry = {
    id,
    name,
    category,
    tags,
    durationSec: Math.round(duration * 100) / 100,
    file: `sfx/${category}/${base}.wav`,
    source: "generated",
    sourceUrl: "scripts/sfx-generate.mjs",
    license: {
      name: "Obra propia (síntesis)",
      author: "Luis Miguel",
      commercialUse: true,
      attributionRequired: false,
    },
  };
  writeFileSync(join(dir, `${base}.license.json`), JSON.stringify(entry, null, 2) + "\n");
  catalog.sounds = catalog.sounds.filter((s) => s.id !== id);
  catalog.sounds.push(entry);
  added++;
}
catalog.sounds.sort((a, b) => a.id.localeCompare(b.id));
writeFileSync(catalogPath, JSON.stringify(catalog, null, 2) + "\n");
console.log(`${added} efectos generados. Catálogo: ${catalog.sounds.length} sonidos.`);
