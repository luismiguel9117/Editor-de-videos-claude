#!/usr/bin/env node
// Busca en la biblioteca de prompts de videos de Opus 5.5 (referencias/awesome-opus5-5-videos).
// Uso: npm run prompts -- [palabras] [--cat=motion|3d|explainer|interactive] [--tag=threejs] [--completos] [--n=15]
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const base = join(dirname(fileURLToPath(import.meta.url)), "../../referencias/awesome-opus5-5-videos");
const data = JSON.parse(readFileSync(join(base, "data/videos.json"), "utf8"));
const args = process.argv.slice(2);
const opt = (k) => args.find((a) => a.startsWith(`--${k}=`))?.split("=")[1];
const words = args.filter((a) => !a.startsWith("--")).map((w) => w.toLowerCase());
const n = Number(opt("n") ?? 15);

const res = data
  .filter((x) => x.prompt)
  .filter((x) => !opt("cat") || x.category === opt("cat"))
  .filter((x) => !opt("tag") || (x.tech_tags ?? []).includes(opt("tag")))
  .filter((x) => !args.includes("--completos") || !x.prompt_partial)
  .map((x) => {
    const p = x.prompt.toLowerCase();
    const score = words.reduce((s, w) => s + (p.split(w).length - 1), 0);
    return { x, score };
  })
  .filter((r) => words.length === 0 || r.score > 0)
  .sort((a, b) => b.score - a.score || b.x.prompt.length - a.x.prompt.length)
  .slice(0, n);

for (const { x, score } of res) {
  const first = x.prompt.replace(/\s+/g, " ").slice(0, 100);
  console.log(`${x.slug.padEnd(28)} ${x.category.padEnd(12)} [${(x.tech_tags ?? []).join(",")}] (${score}) ${first}…`);
  console.log(`  → referencias/awesome-opus5-5-videos/prompts/${x.slug}.md`);
}
console.log(`\n${res.length} resultado(s) de ${data.length}`);
