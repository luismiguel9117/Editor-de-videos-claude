import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

// Fuentes de la web (Inter, Instrument Serif, Space Mono) servidas localmente desde public/fonts
const FONTS = [
  { family: "Inter", file: "inter-latin-500-normal.woff2", weight: "500" },
  { family: "Inter", file: "inter-latin-600-normal.woff2", weight: "600" },
  { family: "Instrument Serif", file: "instrument-serif-latin-400-normal.woff2", weight: "400", style: "normal" },
  { family: "Instrument Serif", file: "instrument-serif-latin-400-italic.woff2", weight: "400", style: "italic" },
  { family: "Space Mono", file: "space-mono-latin-400-normal.woff2", weight: "400" },
];

let loaded: Promise<unknown> | null = null;
export const loadBrandFonts = () => {
  loaded ??= Promise.all(
    FONTS.map((f) =>
      loadFont({ family: f.family, url: staticFile(`fonts/${f.file}`), weight: f.weight, style: f.style ?? "normal" }),
    ),
  );
  return loaded;
};

loadBrandFonts();
