import * as remotionSfx from "@remotion/sfx";
import { staticFile } from "remotion";
import categoriesJson from "./categories.json";
import catalogJson from "./catalog.json";

export type SfxCategory =
  | "cinematic-whooshes"
  | "bass-impacts"
  | "risers"
  | "transitions"
  | "ui-sounds"
  | "product-sounds"
  | "ambient-sounds"
  | "nature"
  | "sports"
  | "memes";

export type SfxLicense = {
  /** Nombre corto, p. ej. "CC0-1.0". "unknown" si no está verificada. */
  name: string;
  url?: string;
  author?: string;
  /** Si la licencia permite uso en anuncios comerciales (verificado). */
  commercialUse: boolean;
  attributionRequired: boolean;
};

export type SfxEntry = {
  id: string;
  name: string;
  category: SfxCategory;
  tags: string[];
  durationSec?: number;
  /** Ruta relativa a public/ (archivo local) */
  file?: string;
  /** URL remota (solo @remotion/sfx) */
  url?: string;
  source: "sfxmint" | "remotion-sfx" | string;
  sourceUrl?: string;
  license: SfxLicense;
};

export const SFX_CATEGORIES = categoriesJson as { slug: SfxCategory; label: string }[];

const localSounds = (catalogJson as { sounds: SfxEntry[] }).sounds;

// @remotion/sfx: los efectos útiles para publicidad se asignan a categorías;
// el resto (memes) se marca aparte. Las licencias de estos archivos no están
// documentadas por sonido, así que no se marcan como aptos para uso comercial.
const REMOTION_CATEGORY: Record<string, SfxCategory> = {
  whoosh: "cinematic-whooshes",
  whip: "transitions",
  pageTurn: "transitions",
  recordScratch: "transitions",
  uiSwitch: "ui-sounds",
  mouseClick: "ui-sounds",
  ding: "ui-sounds",
  snapchatNotification: "ui-sounds",
  shutterModern: "product-sounds",
  shutterOld: "product-sounds",
};

const toWords = (key: string) => key.replace(/([A-Z])/g, " $1").toLowerCase();

const remotionSounds: SfxEntry[] = Object.entries(remotionSfx)
  .filter(([, v]) => typeof v === "string" && v.startsWith("http"))
  .map(([key, url]) => ({
    id: `remotion/${key}`,
    name: toWords(key),
    category: REMOTION_CATEGORY[key] ?? "memes",
    tags: toWords(key).split(" "),
    url: url as string,
    source: "remotion-sfx",
    sourceUrl: "https://www.remotion.dev/docs/sfx",
    license: {
      name: "unknown",
      url: "https://www.remotion.dev/docs/sfx",
      commercialUse: false,
      attributionRequired: false,
    },
  }));

export const SFX_CATALOG: SfxEntry[] = [...localSounds, ...remotionSounds];

export const getSfx = (id: string): SfxEntry => {
  const entry = SFX_CATALOG.find((s) => s.id === id);
  if (!entry) throw new Error(`Efecto de sonido no encontrado: "${id}"`);
  return entry;
};

export const sfxSrc = (entry: SfxEntry): string => {
  if (entry.file) return staticFile(entry.file);
  if (entry.url) return entry.url;
  throw new Error(`El efecto "${entry.id}" no tiene archivo ni URL`);
};

export type SfxQuery = {
  text?: string;
  category?: SfxCategory;
  /** Solo efectos con licencia verificada para anuncios */
  commercialOnly?: boolean;
  maxDurationSec?: number;
  /** Incluir los efectos remotos de @remotion/sfx (por defecto sí) */
  includeRemote?: boolean;
};

export const searchSfx = (q: SfxQuery = {}): SfxEntry[] => {
  const terms = (q.text ?? "").toLowerCase().split(/\s+/).filter(Boolean);
  return SFX_CATALOG.filter((s) => {
    if (q.category && s.category !== q.category) return false;
    if (q.commercialOnly && !s.license.commercialUse) return false;
    if (q.includeRemote === false && !s.file) return false;
    if (q.maxDurationSec && s.durationSec && s.durationSec > q.maxDurationSec) return false;
    const hay = `${s.name} ${s.tags.join(" ")} ${s.category}`.toLowerCase();
    return terms.every((t) => hay.includes(t));
  });
};

/**
 * Elige un efecto de forma determinista (mismo seed → mismo sonido en cada
 * render). Prefiere archivos locales con licencia comercial verificada.
 */
export const pickSfx = (q: SfxQuery, seed: string | number = 0): SfxEntry | null => {
  const preferred = searchSfx({ ...q, commercialOnly: true, includeRemote: false });
  const pool = preferred.length > 0 ? preferred : searchSfx(q);
  if (pool.length === 0) return null;
  const n = String(seed)
    .split("")
    .reduce((acc, ch) => (acc * 31 + ch.charCodeAt(0)) >>> 0, 7);
  return pool[n % pool.length];
};
