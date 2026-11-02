// Tokens de marca luismiguel.pe (ver ESTILO-LUISMIGUEL.md)
export const C = {
  surface: "#0a090f",
  ink: "#f0ecf4",
  dim: "#8e889b",
  line: "rgba(255,255,255,0.08)",
  card: "#13101c",
  paper: "#eae6de",
  paperInk: "#0a090f",
  paperDim: "#646070",
  red: "#ff3b30",
  // Azules de la web (GradientWaves en app/layout.tsx)
  black: "#000000",
  navy: "#05102a",
  blue: "#1d4ed8",
  blueBright: "#3b6cf0",
  blueGlow: "rgba(29,78,216,0.9)",
  blueSoft: "rgba(140,170,255,0.9)",
  // Heredados de la v1 (ya no se usan en videos nuevos)
  ember: "rgba(255,130,80,0.95)",
  emberHot: "rgba(255,60,30,0.9)",
  violet: "#5e45e3",
} as const;

export const F = {
  sans: "Inter, sans-serif",
  serif: "'Instrument Serif', serif",
  mono: "'Space Mono', monospace",
} as const;

// Easings de la guía
export const EASE_OUT = [0.16, 1, 0.3, 1] as const;
export const EASE_IN = [0.7, 0, 0.84, 0] as const;
