// Warm lo-fi bed + UI sound effects for the long-form videos, synthesized from scratch (no samples, no licensing).
// synthBed(cues, sfx, total, out): cues = [{ t, n: "soft" | "pulse" }] (one per scene), sfx = [{ t, n }].
// "soft" is electric piano + pad; "pulse" adds a quiet kick, rim and shaker. Everything runs through a small reverb.
import { writeFileSync } from "node:fs";

const SR = 44100;
const BPM = 78;
const BEAT = 60 / BPM;
const BAR = BEAT * 4;
// Fmaj9 · Em7 · Dm9 · Cmaj7 (+ bass roots)
const PROG = [
  [[174.6, 220, 261.6, 329.6, 392], 87.3],
  [[164.8, 196, 246.9, 293.7], 82.4],
  [[146.8, 174.6, 220, 261.6, 329.6], 73.4],
  [[130.8, 196, 246.9, 329.6], 65.4],
];

export function synthBed(cues, sfx, total, out) {
  const N = Math.ceil((total + 3) * SR);
  const mus = new Float32Array(N);
  const fx = new Float32Array(N);
  let seed = 11;
  const rand = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296);
  const add = (buf, sig, t, g = 1) => { const i0 = Math.floor(t * SR); for (let k = 0; k < sig.length; k++) { const i = i0 + k; if (i >= 0 && i < buf.length) buf[i] += sig[k] * g; } };
  const mk = (d, f) => Float32Array.from({ length: Math.floor(d * SR) }, (_, i) => f(i / SR, i));
  const env = (t, a, dec) => Math.min(t / a, 1) * Math.exp(-t * dec);
  const noise = (d) => Float32Array.from({ length: Math.floor(d * SR) }, () => rand() * 2 - 1);
  const hp = (x) => { const o = new Float32Array(x.length); for (let i = 1; i < x.length; i++) o[i] = x[i] - x[i - 1]; return o; };
  const lp1 = (x, a) => { const o = new Float32Array(x.length); let s = 0; for (let i = 0; i < x.length; i++) o[i] = s += a * (x[i] - s); return o; };
  const sine = (f, d, dec = 5, a = 0.004) => mk(d, (t) => Math.sin(2 * Math.PI * f * t) * env(t, a, dec));
  const sweep = (f0, f1, d, dec = 3) => { let ph = 0; return mk(d, (t) => { ph += (2 * Math.PI * (f0 + (f1 - f0) * Math.min(1, t / d))) / SR; return Math.sin(ph) * env(t, 0.003, dec); }); };
  // Electric piano: soft attack, bell-ish 2nd/3rd harmonics that fade faster, slow tremolo.
  const ep = (f, d) => mk(d, (t) => (Math.sin(2 * Math.PI * f * t) + 0.35 * Math.sin(4 * Math.PI * f * t) * Math.exp(-t * 3) + 0.12 * Math.sin(6 * Math.PI * f * t) * Math.exp(-t * 6)) * env(t, 0.012, 1.1) * (1 + 0.12 * Math.sin(2 * Math.PI * 4.5 * t)));
  const pad = (fs, d) => mk(d, (t) => fs.reduce((s, f) => s + Math.sin(2 * Math.PI * f * t) + 0.5 * Math.sin(2 * Math.PI * f * 1.004 * t + 1), 0) / fs.length * Math.min(t / 1.2, 1, Math.max(0, (d - t) / 1.2)));

  // ---- music: sections are runs of equal cues; a gentle 1.5 s crossfade between them ----
  const secs = [];
  for (const c of cues) { if (secs.length && secs.at(-1).n === c.n) continue; secs.push({ ...c }); }
  secs.forEach((s, i) => (s.e = i + 1 < secs.length ? secs[i + 1].t : total + 2));
  for (const s of secs) {
    const b = new Float32Array(N);
    const bar0 = Math.floor(s.t / BAR), bar1 = Math.ceil(s.e / BAR) + 1;
    for (let bar = Math.max(0, bar0 - 1); bar < bar1; bar++) {
      const t0 = bar * BAR, [ch, root] = PROG[bar % 4];
      add(b, pad(ch.map((f) => f / 2), BAR + 0.6), t0, 0.05);
      add(b, sine(root, BAR, 1.2, 0.02), t0, 0.16);
      // broken-chord piano: two hits a bar, top voices drifting
      ch.forEach((f, k) => add(b, ep(f, 2.6), t0 + k * 0.035, 0.055));
      ch.slice(1).forEach((f, k) => add(b, ep(f * (k === 2 ? 2 : 1), 2.2), t0 + BEAT * 2.5 + k * 0.05, 0.04));
      add(b, ep(ch.at(-1) * 2, 1.6), t0 + BEAT * 1.5, 0.03);
      if (s.n === "pulse") {
        for (let k = 0; k < 4; k++) {
          const t = t0 + k * BEAT;
          if (k === 0 || k === 2) add(b, sweep(110, 42, 0.32, 9), t, 0.32);
          if (k === 2 && bar % 2) add(b, sweep(110, 42, 0.32, 9), t + BEAT * 0.75, 0.2);
          if (k === 1 || k === 3) add(b, lp1(hp(noise(0.08)), 0.5).map((v, i) => v * Math.exp(-i / SR * 60)), t, 0.12);
          for (let j = 0; j < 2; j++) add(b, hp(hp(noise(0.05))).map((v, i) => v * Math.exp(-i / SR * 90)), t + j * BEAT / 2 + 0.012, j ? 0.035 : 0.02);
        }
      }
    }
    const f = 1.5 * SR, i0 = Math.floor(s.t * SR), i1 = Math.floor(s.e * SR);
    for (let i = Math.max(0, i0 - f); i < Math.min(N, i1 + f); i++) {
      const g = Math.min(1, (i - (i0 - f)) / f, (i1 + f - i) / f);
      mus[i] += b[i] * Math.max(0, g);
    }
  }
  // music fades in and out with the video
  for (let i = 0; i < N; i++) { const t = i / SR; mus[i] *= Math.min(1, t / 1.5, Math.max(0, (total + 0.5 - t) / 3)); }

  // ---- sound effects ----
  const FX = {
    ding: (t) => { add(fx, sine(1318.5, 0.9, 5), t, 0.1); add(fx, sine(1975.5, 0.7, 7), t + 0.07, 0.06); },
    chime: (t) => { add(fx, sine(1046.5, 1.4, 2.5), t, 0.08); add(fx, sine(784, 1.6, 2.2), t + 0.3, 0.08); },
    thud: (t) => { add(fx, sweep(120, 40, 0.35, 9), t, 0.4); add(fx, lp1(noise(0.15), 0.05).map((v, i) => v * Math.exp(-i / SR * 30)), t, 0.4); },
    whoosh: (t) => { const d = 0.7; add(fx, lp1(noise(d), 0.12).map((v, i) => v * Math.sin(Math.PI * i / (d * SR)) ** 2), t, 0.5); },
    tap: (t) => { add(fx, hp(noise(0.03)).map((v, i) => v * Math.exp(-i / SR * 140)), t, 0.25); add(fx, sine(2600, 0.1, 35), t, 0.08); },
    tick: (t) => add(fx, sine(2200, 0.05, 80), t, 0.07),
    pop: (t) => add(fx, sweep(300, 900, 0.09, 30), t, 0.18),
    buzz: (t) => add(fx, mk(0.4, (tt) => Math.sin(2 * Math.PI * 160 * tt) * (tt % 0.2 < 0.15 ? 1 : 0) * Math.min(1, (0.4 - tt) * 20)), t, 0.07),
    ring: (t) => { for (let k = 0; k < 2; k++) for (let j = 0; j < 14; j++) add(fx, mk(0.05, (tt) => (Math.sin(2 * Math.PI * 1320 * tt) + Math.sin(2 * Math.PI * 1650 * tt)) * 0.5), t + k * 0.5 + j * 0.025, 0.035); },
  };
  for (const s of sfx) FX[s.n]?.(s.t);

  // ---- small Schroeder reverb on the music, a little on the effects ----
  const wet = new Float32Array(N);
  const src = Float32Array.from(mus, (v, i) => v + fx[i] * 0.4);
  for (const [dl, g] of [[1557, 0.8], [1617, 0.79], [1491, 0.81], [1422, 0.8]]) {
    const buf = new Float32Array(dl); let p = 0, s = 0;
    for (let i = 0; i < N; i++) { const o = buf[p]; s += 0.35 * (o - s); buf[p] = src[i] + s * g; p = (p + 1) % dl; wet[i] += o * 0.25; }
  }
  for (const dl of [225, 556]) {
    const buf = new Float32Array(dl); let p = 0;
    for (let i = 0; i < N; i++) { const b0 = buf[p], x = wet[i]; const y = -0.5 * x + b0; buf[p] = x + 0.5 * y; wet[i] = y; p = (p + 1) % dl; }
  }
  const y = new Float32Array(N);
  let pk = 0;
  for (let i = 0; i < N; i++) { y[i] = Math.tanh((mus[i] * 0.8 + wet[i] * 0.45 + fx[i]) * 1.3); pk = Math.max(pk, Math.abs(y[i])); }

  const n = Math.ceil(total * SR);
  const pcm = Buffer.alloc(44 + n * 2);
  pcm.write("RIFF", 0); pcm.writeUInt32LE(36 + n * 2, 4); pcm.write("WAVEfmt ", 8); pcm.writeUInt32LE(16, 16); pcm.writeUInt16LE(1, 20); pcm.writeUInt16LE(1, 22);
  pcm.writeUInt32LE(SR, 24); pcm.writeUInt32LE(SR * 2, 28); pcm.writeUInt16LE(2, 32); pcm.writeUInt16LE(16, 34); pcm.write("data", 36); pcm.writeUInt32LE(n * 2, 40);
  for (let i = 0; i < n; i++) pcm.writeInt16LE(Math.round((y[i] / (pk || 1)) * 0.9 * 32767), 44 + i * 2);
  writeFileSync(out, pcm);
}
