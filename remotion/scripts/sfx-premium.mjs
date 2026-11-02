#!/usr/bin/env node
// Efectos de sonido "premium" sintetizados: suaves, graves, con paneo y reverb larga.
// Obra propia (sin muestras de terceros). Uso: npm run sfx:premium

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { biquad, buffer, normalize, reseed, reverb, rnd, soft, SR, writeWav } from "./dsp.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const catalogPath = join(root, "src/sfx/catalog.json");
const catalog = JSON.parse(readFileSync(catalogPath, "utf8"));

const env = (t, a, r, total) => (t < a ? (t / a) ** 2 : Math.max(0, 1 - (t - a) / r) ** 2) * (t < total ? 1 : 0);
const noise = (n, color = "pink") => {
  const x = new Float32Array(n);
  let b0 = 0, b1 = 0, b2 = 0, br = 0;
  for (let i = 0; i < n; i++) {
    const w = rnd();
    if (color === "white") x[i] = w;
    else if (color === "brown") x[i] = br = (br + 0.02 * w) / 1.02;
    else {
      b0 = 0.99765 * b0 + w * 0.099; b1 = 0.963 * b1 + w * 0.2965; b2 = 0.57 * b2 + w * 1.0526;
      x[i] = (b0 + b1 + b2 + w * 0.1848) * 0.25;
    }
  }
  return x;
};
const pan = (mono, p) => {
  const L = new Float32Array(mono.length), R = new Float32Array(mono.length);
  for (let i = 0; i < mono.length; i++) {
    const a = ((p(i / SR) + 1) * Math.PI) / 4;
    L[i] = mono[i] * Math.cos(a);
    R[i] = mono[i] * Math.sin(a);
  }
  return [L, R];
};

const SOUNDS = {
  "cinematic-whooshes/silk-sweep": {
    name: "Silk Sweep", tags: ["whoosh", "sweep", "air", "transition", "premium"],
    make: () => {
      const d = 1.8, a = 0.65, r = 0.95;
      const n = noise(Math.round(d * SR));
      let x = biquad(n, "bandpass", (t) => 300 + 2400 * Math.sin(Math.PI * Math.min(1, t / (a + r))), 1.2);
      x = x.map((v, i) => v * env(i / SR, a, r, d));
      return reverb(...pan(x, (t) => -0.8 + 1.6 * (t / d)), { wet: 0.5, room: 0.88 });
    },
  },
  "cinematic-whooshes/deep-pass": {
    name: "Deep Pass", tags: ["whoosh", "deep", "low", "transition", "premium"],
    make: () => {
      const d = 1.6, a = 0.55, r = 0.9;
      const n = noise(Math.round(d * SR), "brown");
      let x = biquad(n, "lowpass", (t) => 150 + 900 * Math.sin(Math.PI * Math.min(1, t / (a + r))), 0.9);
      x = x.map((v, i) => v * env(i / SR, a, r, d) * 6);
      return reverb(...pan(x, (t) => 0.7 - 1.4 * (t / d)), { wet: 0.4 });
    },
  },
  "transitions/air-transition": {
    name: "Air Transition", tags: ["transition", "air", "soft", "premium"],
    make: () => {
      const d = 1.1, a = 0.35, r = 0.55;
      let x = biquad(noise(Math.round(d * SR)), "highpass", (t) => 1500 + 2500 * (t / d), 0.7);
      x = x.map((v, i) => v * env(i / SR, a, r, d));
      return reverb(...pan(x, (t) => -0.5 + t / d), { wet: 0.55, room: 0.9 });
    },
  },
  "risers/reverse-swell": {
    name: "Reverse Swell", tags: ["riser", "swell", "reverse", "build", "premium"],
    make: () => {
      const d = 1.6;
      const [L0, R0] = buffer(d);
      const burst = biquad(noise(Math.round(0.08 * SR)), "lowpass", 2500);
      burst.forEach((v, i) => { L0[i] = v * 3; R0[i] = v * 3; });
      const [L, R] = reverb(L0, R0, { wet: 1, dry: 0, room: 0.93, damp: 0.25 });
      return [L.reverse(), R.reverse()];
    },
  },
  "bass-impacts/soft-impact": {
    name: "Soft Impact", tags: ["impact", "boom", "soft", "logo", "premium"],
    make: () => {
      const d = 3.2;
      const x = new Float32Array(Math.round(d * SR));
      for (let i = 0; i < x.length; i++) {
        const t = i / SR;
        const ph = 2 * Math.PI * (34 * t + (18 / 9) * (1 - Math.exp(-t * 9)));
        x[i] = Math.sin(ph) * Math.exp(-t * 1.9) * Math.min(1, t / 0.004);
      }
      const tr = biquad(noise(x.length, "brown"), "lowpass", 280);
      for (let i = 0; i < x.length; i++) x[i] += tr[i] * 4 * Math.exp(-(i / SR) * 18);
      const s = soft(x, 1.6);
      return reverb(s, s.slice(), { wet: 0.3, room: 0.9, damp: 0.5 });
    },
  },
  "bass-impacts/sub-swell": {
    name: "Sub Swell", tags: ["sub", "swell", "low", "tension", "premium"],
    make: () => {
      const d = 2.2;
      const x = new Float32Array(Math.round(d * SR));
      for (let i = 0; i < x.length; i++) {
        const t = i / SR;
        const e = t < 1.3 ? (t / 1.3) ** 2 : Math.exp(-(t - 1.3) * 4);
        x[i] = (Math.sin(2 * Math.PI * 41 * t) + 0.25 * Math.sin(2 * Math.PI * 82 * t)) * e;
      }
      return reverb(x, x.slice(), { wet: 0.2 });
    },
  },
  "product-sounds/glint": {
    name: "Glint", tags: ["glint", "shimmer", "spark", "sparkle", "premium"],
    make: () => {
      const d = 2.2;
      const x = new Float32Array(Math.round(d * SR));
      const parts = [[2349, 1], [3520, 0.6], [4699, 0.4], [7040, 0.15]];
      for (let i = 0; i < x.length; i++) {
        const t = i / SR;
        const e = Math.min(1, t / 0.012) * Math.exp(-t * 3.2);
        x[i] = parts.reduce((s, [f, a]) => s + a * Math.sin(2 * Math.PI * f * t + Math.sin(2 * Math.PI * 5 * t) * 0.3), 0) * e;
      }
      return reverb(...pan(x, (t) => -0.3 + 0.6 * Math.min(1, t)), { wet: 0.65, room: 0.92, damp: 0.2 });
    },
  },
  "product-sounds/electric-hum": {
    name: "Electric Hum", tags: ["electric", "hum", "energy", "current", "premium"],
    make: () => {
      const d = 4.5;
      const x = new Float32Array(Math.round(d * SR));
      let crack = 0;
      for (let i = 0; i < x.length; i++) {
        const t = i / SR;
        const e = Math.min(1, t / 0.8) * Math.min(1, (d - t) / 1.2);
        if (rnd() > 0.9993) crack = 1;
        crack *= 0.9975;
        x[i] = (0.5 * Math.sin(2 * Math.PI * 55 * t) + 0.3 * Math.sin(2 * Math.PI * 110 * t) + 0.12 * Math.sin(2 * Math.PI * 165 * t)) * e * (0.85 + 0.15 * Math.sin(2 * Math.PI * 0.7 * t));
        x[i] += rnd() * crack * 0.12 * e;
      }
      const y = biquad(x, "lowpass", 1800);
      return reverb(y, y.slice(), { wet: 0.25, width: 0.8 });
    },
  },
  "ambient-sounds/night-air": {
    name: "Night Air", tags: ["ambient", "room", "air", "bed", "premium"],
    make: () => {
      const d = 10;
      let x = biquad(noise(Math.round(d * SR)), "lowpass", (t) => 500 + 250 * Math.sin(2 * Math.PI * 0.08 * t), 0.6);
      x = x.map((v, i) => v * Math.min(1, i / SR / 2) * Math.min(1, (d - i / SR) / 2));
      return reverb(x, x.slice(), { wet: 0.4, width: 1 });
    },
  },
};

reseed(424242);
for (const [id, s] of Object.entries(SOUNDS)) {
  const [category, base] = id.split("/");
  const dir = join(root, "public/sfx", category);
  mkdirSync(dir, { recursive: true });
  const [L, R] = normalize(...s.make(), id.startsWith("bass") ? -3 : -6);
  const file = join(dir, `${base}.wav`);
  writeWav(file, L, R);
  const entry = {
    id, name: s.name, category, tags: s.tags,
    durationSec: Math.round((L.length / SR) * 100) / 100,
    file: `sfx/${category}/${base}.wav`,
    source: "generated", sourceUrl: "scripts/sfx-premium.mjs",
    license: { name: "Obra propia (síntesis)", author: "Luis Miguel", commercialUse: true, attributionRequired: false },
  };
  writeFileSync(join(dir, `${base}.license.json`), JSON.stringify(entry, null, 2) + "\n");
  catalog.sounds = catalog.sounds.filter((x) => x.id !== id);
  catalog.sounds.push(entry);
}
catalog.sounds.sort((a, b) => a.id.localeCompare(b.id));
writeFileSync(catalogPath, JSON.stringify(catalog, null, 2) + "\n");
console.log(`${Object.keys(SOUNDS).length} efectos premium generados.`);
