// Synthesizes the "event is in 2 weeks" shirt-ad sound bed + SFX (no dependencies): node make-bed-event.mjs
// Scene starts match ads/hyperframes/build.mjs → event-last-minute: 0, 4.1, 7.7, 10.5, 14.5 (ends 18.3).
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const SR = 44100, DUR = 18.3, N = Math.floor(SR * DUR);
const y = new Float32Array(N);
let seed = 4242;
const rand = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; };
const noise = (d) => Float32Array.from({ length: Math.floor(d * SR) }, () => rand() * 2 - 1);
const add = (sig, t, g = 1) => { const i = Math.floor(t * SR); for (let k = 0; k < sig.length && i + k < N; k++) if (i + k >= 0) y[i + k] += sig[k] * g; };
const mk = (d, f) => Float32Array.from({ length: Math.floor(d * SR) }, (_, i) => f(i / SR, i));
const env = (t, a, dec) => Math.min(t / a, 1) * Math.exp(-t * dec);
const sine = (f, d, dec = 5) => mk(d, (t) => Math.sin(2 * Math.PI * f * t) * env(t, 0.004, dec));
const sweep = (f0, f1, d, dec = 3) => { let ph = 0; return mk(d, (t) => { ph += (2 * Math.PI * (f0 + (f1 - f0) * (t / d))) / SR; return Math.sin(ph) * env(t, 0.004, dec); }); };
const lp = (x, k) => { const o = new Float32Array(x.length); let s = 0; for (let i = 0; i < x.length; i++) { s += x[i]; if (i >= k) s -= x[i - k]; o[i] = s / k; } return o; };
const hp = (x) => { const o = new Float32Array(x.length); for (let i = 1; i < x.length; i++) o[i] = x[i] - x[i - 1]; return o; };
const shape = (x, f) => Float32Array.from(x, (v, i) => v * f(i / SR, i / x.length));

const whoosh = (t, d = 0.35, g = 0.35) => add(shape(hp(noise(d)), (_, p) => Math.sin(Math.PI * p) ** 2), t - d * 0.6, g);
const ding = (f, t, g = 0.3, d = 0.6) => { add(sine(f, d, 7), t, g); add(sine(f * 2.01, d, 9), t, g * 0.35); };
const hat = (t, g) => add(hp(noise(0.04)).map((v, i) => v * Math.exp((-i / SR) * 90)), t, g);

// 120 bpm pulse: anxious minor ticking in S1–S2, lifts to major once the logo is uploaded (S3), bright end card.
const beat = 0.5;
for (let b = 0; b * beat < DUR - 0.6; b++) {
  const t = b * beat;
  const tense = t < 7.7, bright = t >= 14.5;
  const root = tense ? [110, 110, 104, 98][(b >> 1) % 4] : [131, 147, 165, 147][(b >> 1) % 4] * (bright ? 2 : 1);
  add(sweep(110, 45, 0.18, 16), t, tense ? 0.14 : 0.18);
  add(sine(root, 0.45, 4.5), t, tense ? 0.1 : 0.16);
  hat(t + beat / 2, tense ? 0.06 : 0.05);
  if (tense) hat(t + beat / 4, 0.03); // double-time ticking = clock running out
  else add(sine(root * 1.5, 0.25, 10), t + beat * 0.75, 0.06);
}

// S1: alarm-ish double blip on the hook
ding(1760, 0.05, 0.16, 0.25); ding(1760, 0.3, 0.16, 0.25);
// cuts
whoosh(4.1); whoosh(7.7); whoosh(10.5); whoosh(14.5, 0.4, 0.45);
// S2: record-scratch-ish dip on "where's the merch?"
add(sweep(900, 120, 0.3, 6), 5.6, 0.12);
// S3: relief chime when it's done
ding(1319, 9.3, 0.2, 0.8); ding(1568, 9.42, 0.2, 0.8);
// S5: end card sparkle
ding(2093, 14.6, 0.22, 0.9); ding(2637, 14.75, 0.2, 0.9); ding(3136, 14.9, 0.18, 1.0);

// fade out, soft clip, normalize
const f = SR * 1.0; for (let i = 0; i < f; i++) y[N - 1 - i] *= i / f;
let pk = 0; for (let i = 0; i < N; i++) { y[i] = Math.tanh(y[i]); pk = Math.max(pk, Math.abs(y[i])); }
const pcm = Buffer.alloc(44 + N * 2);
pcm.write("RIFF", 0); pcm.writeUInt32LE(36 + N * 2, 4); pcm.write("WAVEfmt ", 8); pcm.writeUInt32LE(16, 16); pcm.writeUInt16LE(1, 20); pcm.writeUInt16LE(1, 22);
pcm.writeUInt32LE(SR, 24); pcm.writeUInt32LE(SR * 2, 28); pcm.writeUInt16LE(2, 32); pcm.writeUInt16LE(16, 34); pcm.write("data", 36); pcm.writeUInt32LE(N * 2, 40);
for (let i = 0; i < N; i++) pcm.writeInt16LE(Math.round((y[i] / pk) * 0.9 * 32767), 44 + i * 2);
writeFileSync(join(dirname(fileURLToPath(import.meta.url)), "eventbed.wav"), pcm);
console.log("ok");
