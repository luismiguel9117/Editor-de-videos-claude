#!/usr/bin/env node
// Busca en el catálogo local de efectos.
// Uso: npm run sfx:search -- [texto] [--category=bass-impacts] [--commercial] [--max=2] [--json]
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const { sounds } = JSON.parse(readFileSync(join(root, "src/sfx/catalog.json"), "utf8"));
const args = process.argv.slice(2);
const flag = (k) => args.find((a) => a.startsWith(`--${k}`))?.split("=")[1] ?? (args.includes(`--${k}`) ? true : undefined);
const terms = args.filter((a) => !a.startsWith("--")).join(" ").toLowerCase().split(/\s+/).filter(Boolean);
const category = flag("category");
const max = flag("max") ? Number(flag("max")) : undefined;

const results = sounds.filter((s) => {
  if (category && s.category !== category) return false;
  if (flag("commercial") && !s.license.commercialUse) return false;
  if (max && s.durationSec > max) return false;
  const hay = `${s.id} ${s.name} ${s.tags.join(" ")}`.toLowerCase();
  return terms.every((t) => hay.includes(t));
});

if (flag("json")) {
  console.log(JSON.stringify(results, null, 2));
} else {
  for (const s of results) {
    console.log(`${s.id.padEnd(48)} ${String(s.durationSec ?? "?").padStart(5)}s  ${s.license.name.padEnd(10)} ${s.tags.join(", ")}`);
  }
  console.log(`\n${results.length} resultado(s) de ${sounds.length}`);
}
