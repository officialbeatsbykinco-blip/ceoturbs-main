// Synthesizes the ad9 sound bed (16:9 "One Tap") + SFX (no dependencies): node make-bed-ad9.mjs
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const SR = 44100, DUR = 30, N = SR * DUR;
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
// Hook (0-2.5s) is filtered down to bass + arp, the full beat drops in on the card reveal; D builds into 16.2s.
const beat = 0.5, kick = (t, g) => { add(sweep(150, 45, 0.22, 12), t, g); };
const hat = (t, g = 0.06) => add(hp(noise(0.05)).map((v, i) => v * Math.exp(-i / SR * 80)), t, g);
const clap = (t, g = 0.12) => add(shape(hp(noise(0.14)), (tt) => Math.exp(-tt * 28)), t, g);
const prog = [110, 87, 98, 82]; // A F G E-ish bass roots (bars of 4 beats)
const arpN = [1, 1.5, 2, 3, 2, 1.5, 2, 1.5];
for (let b = 0; b * beat < DUR; b++) {
  const t = b * beat, bar = (b / 4) | 0, root = prog[bar % 4];
  const hook = t < 2.5, build = t >= 13 && t < 16.2, lvl = hook ? 0.6 : 1;
  if (!hook && !(build && t >= 15.5)) { kick(t, 0.5); hat(t + beat / 2, 0.07); if (b % 2) clap(t, 0.11); }
  if (build) hat(t, 0.05);
  add(sine(root, 0.45, 6), t, 0.2 * lvl); add(sine(root * 2, 0.2, 14), t + beat * 0.75, 0.07 * lvl);
  for (let k = 0; k < 2; k++) { const f = root * 4 * arpN[(b * 2 + k) % 8]; add(sine(f, 0.18, 16), t + k * beat / 2, 0.07 * lvl); add(sine(f * 2.005, 0.12, 22), t + k * beat / 2, 0.025 * lvl); }
}
// A - hook: chat pop, footsteps out the door, door chime, "NO REVIEW" slam
ding(1318, 0.15, 0.2, 0.4); walk(0.5, 2.3, 0.32, 0.2); ding(1760, 1.0, 0.18, 0.9); ding(1318, 1.25, 0.18, 1.0);
whoosh(1.15, 0.3, 0.35); stamp(1.5); add(sweep(90, 40, 0.6, 4), 1.5, 0.4);
// B - card drop, flips, rings
whoosh(2.35, 0.5, 0.5); stamp(3.5); add(sweep(90, 40, 0.7, 4), 3.5, 0.5);
[4.5, 5.5].forEach((t) => whoosh(t - 0.05, 0.5, 0.35));
[3.5, 4.0, 4.5, 5.0, 5.5, 6.0].forEach((t, i) => ding(2093 * 1.06 ** (i % 3), t + 0.05, 0.08, 0.5));
// C - panels slide in, three taps, stars, +1s
[7.0, 7.5, 8.0].forEach((t) => whoosh(t - 0.15, 0.35, 0.35));
[8.75, 9.25, 9.75].forEach((t, i) => { tap(t, 0.45); ding(1568 * 1.26 ** i, t + 0.05, 0.22, 0.6); for (let k = 0; k < 5; k++) ding(2093 * 1.122 ** k, t + 0.55 + k * 0.12, 0.09, 0.3); ding(3136, t + 1.25, 0.16, 0.6); });
// D - counter ticks into the build, hit when YOUR shop jumps
riser(13.0, 3.2, 0.2); for (let t = 13.6; t < 16.2; t += Math.max(0.03, 0.16 - (t - 13.6) * 0.05)) tick(t);
stamp(16.2); add(sweep(90, 38, 0.9, 3), 16.2, 0.6); ding(2093, 16.3, 0.25, 0.9); ding(2637, 16.45, 0.22, 0.9); ding(3136, 16.6, 0.2, 1.0);
// E - stamps on the beat, JUST TAP
[19.5, 20.25, 21.0].forEach((t) => { whoosh(t - 0.2, 0.2, 0.3); stamp(t); });
riser(21.5, 1.0, 0.18); stamp(22.5); add(sweep(90, 38, 0.9, 3), 22.5, 0.6); tap(22.5, 0.4);
// F - card lands, price, CTA
whoosh(24.15, 0.5, 0.45); stamp(25.15); ding(2093, 25.2, 0.25, 0.8); ding(2637, 25.35, 0.22, 0.8); ding(3136, 26.0, 0.25, 1.0); ring(27.2, 0.1);

// fade out, soft clip, normalize
const f = SR * 1.2; for (let i = 0; i < f; i++) y[N - 1 - i] *= i / f;
let pk = 0; for (let i = 0; i < N; i++) { y[i] = Math.tanh(y[i]); pk = Math.max(pk, Math.abs(y[i])); }
const pcm = Buffer.alloc(44 + N * 2);
pcm.write("RIFF", 0); pcm.writeUInt32LE(36 + N * 2, 4); pcm.write("WAVEfmt ", 8); pcm.writeUInt32LE(16, 16); pcm.writeUInt16LE(1, 20); pcm.writeUInt16LE(1, 22);
pcm.writeUInt32LE(SR, 24); pcm.writeUInt32LE(SR * 2, 28); pcm.writeUInt16LE(2, 32); pcm.writeUInt16LE(16, 34); pcm.write("data", 36); pcm.writeUInt32LE(N * 2, 40);
for (let i = 0; i < N; i++) pcm.writeInt16LE(Math.round((y[i] / pk) * 0.9 * 32767), 44 + i * 2);
writeFileSync(join(dirname(fileURLToPath(import.meta.url)), "ad9bed.wav"), pcm);
console.log("ok");
