// Synthesizes the ad22 sound bed (16:9 "Get found") + SFX (no dependencies): node make-bed-ad22.mjs
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const SR = 44100, DUR = 24, N = SR * DUR;
const y = new Float32Array(N);
let seed = 909;
const rand = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; };
const noise = (d) => Float32Array.from({ length: Math.floor(d * SR) }, () => rand() * 2 - 1);
const add = (sig, t, g = 1) => { const i = Math.floor(t * SR); for (let k = 0; k < sig.length && i + k < N; k++) if (i + k >= 0) y[i + k] += sig[k] * g; };
const mk = (d, f) => Float32Array.from({ length: Math.floor(d * SR) }, (_, i) => f(i / SR, i));
const env = (t, a, dec) => Math.min(t / a, 1) * Math.exp(-t * dec);
const sine = (f, d, dec = 5) => mk(d, (t) => Math.sin(2 * Math.PI * f * t) * env(t, 0.004, dec));
const sweep = (f0, f1, d, dec = 3, saw = false) => { let ph = 0; return mk(d, (t) => { ph += (2 * Math.PI * (f0 + (f1 - f0) * (t / d))) / SR; const s = saw ? 2 * ((ph / (2 * Math.PI)) % 1) - 1 : Math.sin(ph); return s * env(t, 0.004, dec); }); };
const lp = (x, k) => { const o = new Float32Array(x.length); let s = 0; for (let i = 0; i < x.length; i++) { s += x[i]; if (i >= k) s -= x[i - k]; o[i] = s / k; } return o; };
const hp = (x) => { const o = new Float32Array(x.length); for (let i = 1; i < x.length; i++) o[i] = x[i] - x[i - 1]; return o; };
const shape = (x, f) => Float32Array.from(x, (v, i) => v * f(i / SR, i / x.length));

const whoosh = (t, d = 0.45, g = 0.4) => add(shape(hp(noise(d)), (_, p) => Math.sin(Math.PI * p) ** 2), t, g);
const step = (t, g = 0.3) => { add(shape(lp(noise(0.07), 60), (tt) => Math.exp(-tt * 55)), t, g); add(sweep(130, 60, 0.08, 40), t, g * 0.6); };
const walk = (t0, t1, gap = 0.34, g = 0.26) => { for (let t = t0, k = 0; t < t1; t += gap, k++) step(t, g * (k % 2 ? 0.85 : 1)); };
const ding = (f, t, g = 0.3, d = 0.6) => { add(sine(f, d, 7), t, g); add(sine(f * 2.01, d, 9), t, g * 0.35); };
const tap = (t, g = 0.35) => { add(shape(hp(noise(0.03)), (tt) => Math.exp(-tt * 140)), t, g); add(sine(2400, 0.08, 40), t, g * 0.5); };
const ring = (t, g = 0.22) => { for (let k = 0; k < 2; k++) { const s = mk(0.38, (tt) => (Math.sin(2 * Math.PI * 880 * tt) + Math.sin(2 * Math.PI * 1320 * tt)) * 0.5 * (0.6 + 0.4 * Math.sin(2 * Math.PI * 22 * tt)) * env(tt, 0.01, 2.5)); add(s, t + k * 0.5, g); } };
const stamp = (t) => { add(sweep(140, 45, 0.3, 8), t, 0.5); add(shape(lp(noise(0.12), 14), (tt) => Math.exp(-tt * 30)), t, 0.35); };
const riser = (t, d, g = 0.18) => { add(shape(hp(noise(d)), (_, p) => p ** 2), t, g); add(sweep(200, 1400, d, 0.2, true).map((v, i, a) => v * (i / a.length) ** 2), t, g * 0.25); };
const tick = (t, g = 0.08) => add(sine(3200, 0.03, 120), t, g);
// upbeat original bed: 120 bpm, kick + offbeat hat + clap + bass + pluck arp. Fully synthesized = no copyright.
// Hook (0-3.4s) is filtered down to bass + arp, the full beat drops in on 'We fix all of it'; D builds into the 15.2s badge slam.
const beat = 0.5, kick = (t, g) => { add(sweep(150, 45, 0.22, 12), t, g); };
const hat = (t, g = 0.06) => add(hp(noise(0.05)).map((v, i) => v * Math.exp(-i / SR * 80)), t, g);
const clap = (t, g = 0.12) => add(shape(hp(noise(0.14)), (tt) => Math.exp(-tt * 28)), t, g);
const prog = [110, 87, 98, 82]; // A F G E-ish bass roots (bars of 4 beats)
const arpN = [1, 1.5, 2, 3, 2, 1.5, 2, 1.5];
for (let b = 0; b * beat < DUR; b++) {
  const t = b * beat, bar = (b / 4) | 0, root = prog[bar % 4];
  const hook = t < 4.2, build = t >= 13.4 && t < 14.4, lvl = hook ? 0.6 : 1;
  if (!hook && !(build && t >= 14.0)) { kick(t, 0.5); hat(t + beat / 2, 0.07); if (b % 2) clap(t, 0.11); }
  if (build) hat(t, 0.05);
  add(sine(root, 0.45, 6), t, 0.2 * lvl); add(sine(root * 2, 0.2, 14), t + beat * 0.75, 0.07 * lvl);
  for (let k = 0; k < 2; k++) { const f = root * 4 * arpN[(b * 2 + k) % 8]; add(sine(f, 0.18, 16), t + k * beat / 2, 0.07 * lvl); add(sine(f * 2.005, 0.12, 22), t + k * beat / 2, 0.025 * lvl); }
}
// A - typing, results drop in, "not found" buzz
whoosh(0.0, 0.4, 0.4); stamp(0.5);
for (let k = 0; k < 15; k++) tap(0.45 + k * 0.06, 0.12 + (k % 3) * 0.03);
[1.45, 1.63, 1.81, 1.99].forEach((t) => whoosh(t - 0.05, 0.2, 0.15));
stamp(2.5); add(sweep(90, 40, 0.6, 4), 2.5, 0.45); add(sweep(220, 200, 0.35, 3, true), 2.5, 0.12);
// B - AI chat: send, typing dots, answer, NOT ON THE LIST stamp
riser(3.7, 0.5, 0.18); stamp(4.2); add(sweep(90, 40, 0.7, 4), 4.2, 0.5);
add(sweep(900, 1400, 0.12, 12), 4.8, 0.2); [5.35, 5.6, 5.85].forEach((t) => tick(t, 0.1));
ding(1046, 6.1, 0.18, 0.5); [6.35, 6.5, 6.65].forEach((t, i) => tap(t, 0.15));
whoosh(7.0, 0.25, 0.3); stamp(7.48); add(sweep(90, 38, 0.9, 3), 7.48, 0.55);
// C - profile pops, six fixes dock with rising dings
riser(8.3, 0.5, 0.2); stamp(8.8); add(sweep(90, 40, 0.7, 4), 8.8, 0.5);
for (let i = 0; i < 6; i++) { whoosh(9.55 + i * 0.5, 0.3, 0.22); ding(1046 * 1.122 ** i, 10.0 + i * 0.5, 0.22, 0.5); }
ding(2093, 12.7, 0.2, 0.9); ding(2637, 12.85, 0.18, 0.9);
// D - your listing slides in, tap Call, phone rings
riser(13.4, 1.0, 0.18); stamp(14.4); add(sweep(90, 38, 0.9, 3), 14.4, 0.55);
whoosh(15.2, 0.4, 0.35); ding(1568, 15.6, 0.2, 0.6); tap(16.55, 0.4); ring(17.0, 0.18); ring(18.0, 0.14);
// E - end card, price slam, CTA chime
whoosh(19.15, 0.5, 0.45); stamp(20.15); ding(2093, 20.2, 0.25, 0.8); ding(2637, 20.35, 0.22, 0.8); ding(3136, 20.65, 0.25, 1.0);

// fade out, soft clip, normalize
const f = SR * 1.2; for (let i = 0; i < f; i++) y[N - 1 - i] *= i / f;
let pk = 0; for (let i = 0; i < N; i++) { y[i] = Math.tanh(y[i]); pk = Math.max(pk, Math.abs(y[i])); }
const pcm = Buffer.alloc(44 + N * 2);
pcm.write("RIFF", 0); pcm.writeUInt32LE(36 + N * 2, 4); pcm.write("WAVEfmt ", 8); pcm.writeUInt32LE(16, 16); pcm.writeUInt16LE(1, 20); pcm.writeUInt16LE(1, 22);
pcm.writeUInt32LE(SR, 24); pcm.writeUInt32LE(SR * 2, 28); pcm.writeUInt16LE(2, 32); pcm.writeUInt16LE(16, 34); pcm.write("data", 36); pcm.writeUInt32LE(N * 2, 40);
for (let i = 0; i < N; i++) pcm.writeInt16LE(Math.round((y[i] / pk) * 0.9 * 32767), 44 + i * 2);
writeFileSync(join(dirname(fileURLToPath(import.meta.url)), "ad22bed.wav"), pcm);
console.log("ok");
