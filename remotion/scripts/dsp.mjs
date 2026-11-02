// Utilidades de síntesis y procesamiento de audio (sin dependencias).
import { writeFileSync } from "node:fs";

export const SR = 48000;

let seed = 987654321;
export const rnd = () => ((seed = (seed * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff) * 2 - 1;
export const reseed = (s) => (seed = s);

export const buffer = (sec) => [new Float32Array(Math.round(sec * SR)), new Float32Array(Math.round(sec * SR))];

/** Filtro biquad (RBJ). type: lowpass | highpass | bandpass. `freq` puede ser función del tiempo. */
export const biquad = (x, type, freq, q = 0.707) => {
  const y = new Float32Array(x.length);
  let x1 = 0, x2 = 0, y1 = 0, y2 = 0;
  let b0, b1, b2, a1, a2;
  const update = (f) => {
    const w = (2 * Math.PI * Math.min(f, SR * 0.45)) / SR;
    const cs = Math.cos(w), al = Math.sin(w) / (2 * q);
    let n0, n1, n2;
    if (type === "lowpass") [n0, n1, n2] = [(1 - cs) / 2, 1 - cs, (1 - cs) / 2];
    else if (type === "highpass") [n0, n1, n2] = [(1 + cs) / 2, -(1 + cs), (1 + cs) / 2];
    else [n0, n1, n2] = [al, 0, -al];
    const a0 = 1 + al;
    b0 = n0 / a0; b1 = n1 / a0; b2 = n2 / a0; a1 = (-2 * cs) / a0; a2 = (1 - al) / a0;
  };
  const dynamic = typeof freq === "function";
  if (!dynamic) update(freq);
  for (let i = 0; i < x.length; i++) {
    if (dynamic && i % 32 === 0) update(freq(i / SR));
    const v = b0 * x[i] + b1 * x1 + b2 * x2 - a1 * y1 - a2 * y2;
    x2 = x1; x1 = x[i]; y2 = y1; y1 = v;
    y[i] = v;
  }
  return y;
};

/** Reverb tipo Freeverb (8 combs + 4 allpass por canal), estéreo. */
export const reverb = (L, R, { room = 0.86, damp = 0.35, wet = 0.35, dry = 1, width = 1, predelay = 0.012 } = {}) => {
  const combs = [1116, 1188, 1277, 1356, 1422, 1491, 1557, 1617].map((n) => Math.round((n * SR) / 44100));
  const aps = [556, 441, 341, 225].map((n) => Math.round((n * SR) / 44100));
  const pd = Math.round(predelay * SR);
  const run = (x, spread) => {
    const out = new Float32Array(x.length);
    const cbuf = combs.map((n) => ({ b: new Float32Array(n + spread), i: 0, f: 0 }));
    const abuf = aps.map((n) => ({ b: new Float32Array(n + spread), i: 0 }));
    for (let i = 0; i < x.length; i++) {
      const inp = (i >= pd ? x[i - pd] : 0) * 0.015;
      let s = 0;
      for (const c of cbuf) {
        const o = c.b[c.i];
        c.f = o * (1 - damp) + c.f * damp;
        c.b[c.i] = inp + c.f * room;
        c.i = (c.i + 1) % c.b.length;
        s += o;
      }
      for (const a of abuf) {
        const o = a.b[a.i];
        a.b[a.i] = s + o * 0.5;
        a.i = (a.i + 1) % a.b.length;
        s = o - s;
      }
      out[i] = s;
    }
    return out;
  };
  const mono = L.map((v, i) => (v + R[i]) / 2);
  const wl = run(mono, 0), wr = run(mono, 23);
  const w1 = wet * (width / 2 + 0.5), w2 = wet * ((1 - width) / 2);
  return [
    L.map((v, i) => v * dry + wl[i] * w1 + wr[i] * w2),
    R.map((v, i) => v * dry + wr[i] * w1 + wl[i] * w2),
  ];
};

/** Saturación suave (calidez) */
export const soft = (x, drive = 1.5) => x.map((v) => Math.tanh(v * drive) / Math.tanh(drive));

export const normalize = (L, R, db = -3) => {
  let peak = 1e-9;
  for (let i = 0; i < L.length; i++) peak = Math.max(peak, Math.abs(L[i]), Math.abs(R[i]));
  const g = 10 ** (db / 20) / peak;
  return [L.map((v) => v * g), R.map((v) => v * g)];
};

export const writeWav = (file, L, R) => {
  const N = L.length;
  const buf = Buffer.alloc(44 + N * 4);
  buf.write("RIFF", 0); buf.writeUInt32LE(36 + N * 4, 4); buf.write("WAVEfmt ", 8);
  buf.writeUInt32LE(16, 16); buf.writeUInt16LE(1, 20); buf.writeUInt16LE(2, 22);
  buf.writeUInt32LE(SR, 24); buf.writeUInt32LE(SR * 4, 28); buf.writeUInt16LE(4, 32); buf.writeUInt16LE(16, 34);
  buf.write("data", 36); buf.writeUInt32LE(N * 4, 40);
  for (let i = 0; i < N; i++) {
    buf.writeInt16LE(Math.round(Math.max(-1, Math.min(1, L[i])) * 32767), 44 + i * 4);
    buf.writeInt16LE(Math.round(Math.max(-1, Math.min(1, R[i])) * 32767), 46 + i * 4);
  }
  writeFileSync(file, buf);
};
