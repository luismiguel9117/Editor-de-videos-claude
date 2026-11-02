#!/usr/bin/env node
// Importa efectos de sonido a la biblioteca local (public/sfx/<categoría>/).
//
// Uso:  node scripts/sfx-import.mjs manifest.json
//
// manifest.json es un array de objetos:
// {
//   "url": "https://...wav|mp3",       // archivo a descargar (obligatorio)
//   "name": "Deep Cinematic Whoosh",   // obligatorio
//   "category": "cinematic-whooshes",  // una de categories.json (obligatorio)
//   "tags": ["whoosh", "air", "fast"],
//   "source": "sfxmint",
//   "sourceUrl": "https://...",        // página del sonido
//   "license": {                       // obligatorio
//     "name": "CC0-1.0", "url": "https://creativecommons.org/publicdomain/zero/1.0/",
//     "author": "...", "commercialUse": true, "attributionRequired": false
//   }
// }
//
// Cada archivo se guarda en WAV (se convierte con ffmpeg si hace falta),
// junto a un <id>.license.json, y se añade a src/sfx/catalog.json.
// También se regenera public/sfx/LICENSES.md.

import { execFileSync } from "node:child_process";
import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const catalogPath = join(root, "src/sfx/catalog.json");
const categories = JSON.parse(readFileSync(join(root, "src/sfx/categories.json"), "utf8"));
const validCategories = new Set(categories.map((c) => c.slug));

const manifestPath = process.argv[2];
if (!manifestPath) {
  console.error("Uso: node scripts/sfx-import.mjs manifest.json");
  process.exit(1);
}
const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
const catalog = JSON.parse(readFileSync(catalogPath, "utf8"));

const slugify = (s) =>
  s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60);

const probeDuration = (file) =>
  Number(
    execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", file])
      .toString()
      .trim(),
  );

let added = 0;
for (const item of manifest) {
  const { url, name, category, license } = item;
  if (!url || !name || !license?.name) {
    console.warn(`Omitido (falta url, name o license): ${name ?? url}`);
    continue;
  }
  if (!validCategories.has(category)) {
    console.warn(`Omitido "${name}": categoría inválida "${category}"`);
    continue;
  }
  let id = `${category}/${slugify(name)}`;
  if (catalog.sounds.some((s) => s.originalUrl === url)) {
    console.log(`Ya existe: ${name}`);
    continue;
  }
  for (let n = 2; catalog.sounds.some((s) => s.id === id); n++) id = `${category}/${slugify(name)}-${n}`;

  const dir = join(root, "public/sfx", category);
  mkdirSync(dir, { recursive: true });
  const base = id.split("/")[1];
  const wavPath = join(dir, `${base}.wav`);
  const tmpPath = join(dir, `.${base}.download`);

  console.log(`Descargando ${name} …`);
  const res = await fetch(url);
  if (!res.ok) {
    console.warn(`  Error HTTP ${res.status}, omitido`);
    continue;
  }
  writeFileSync(tmpPath, Buffer.from(await res.arrayBuffer()));
  // Normaliza a WAV PCM 16 bit 48 kHz (formato que Remotion mezcla sin problemas)
  execFileSync("ffmpeg", ["-v", "error", "-y", "-i", tmpPath, "-c:a", "pcm_s16le", "-ar", "48000", wavPath]);
  rmSync(tmpPath);

  const entry = {
    id,
    name,
    category,
    tags: item.tags ?? [],
    durationSec: Math.round(probeDuration(wavPath) * 100) / 100,
    file: `sfx/${category}/${base}.wav`,
    source: item.source ?? "unknown",
    sourceUrl: item.sourceUrl,
    originalUrl: url,
    license: {
      name: license.name,
      url: license.url,
      author: license.author,
      commercialUse: Boolean(license.commercialUse),
      attributionRequired: Boolean(license.attributionRequired),
    },
    importedAt: new Date().toISOString(),
  };
  writeFileSync(join(dir, `${base}.license.json`), JSON.stringify(entry, null, 2) + "\n");
  catalog.sounds.push(entry);
  added++;
}

catalog.sounds.sort((a, b) => a.id.localeCompare(b.id));
writeFileSync(catalogPath, JSON.stringify(catalog, null, 2) + "\n");

// LICENSES.md con todas las licencias y atribuciones
const lines = ["# Licencias de efectos de sonido", "", "Generado por `scripts/sfx-import.mjs`. No editar a mano.", ""];
for (const c of categories) {
  const sounds = catalog.sounds.filter((s) => s.category === c.slug);
  if (sounds.length === 0) continue;
  lines.push(`## ${c.label}`, "", "| Archivo | Licencia | Autor | Uso comercial | Atribución | Fuente |", "|---|---|---|---|---|---|");
  for (const s of sounds) {
    const lic = s.license.url ? `[${s.license.name}](${s.license.url})` : s.license.name;
    const src = s.sourceUrl ? `[${s.source}](${s.sourceUrl})` : s.source;
    lines.push(
      `| \`${s.file}\` | ${lic} | ${s.license.author ?? "—"} | ${s.license.commercialUse ? "sí" : "no"} | ${s.license.attributionRequired ? "sí" : "no"} | ${src} |`,
    );
  }
  lines.push("");
}
writeFileSync(join(root, "public/sfx/LICENSES.md"), lines.join("\n"));

console.log(`\n${added} efecto(s) importado(s). Catálogo: ${catalog.sounds.length} sonidos.`);
