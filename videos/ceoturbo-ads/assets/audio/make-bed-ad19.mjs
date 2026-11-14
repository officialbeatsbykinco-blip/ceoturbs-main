// Synthesizes the ad19 sound bed (16:9 "Tampa tech help") + SFX (no dependencies): node make-bed-ad19.mjs
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const SR = 44100, DUR = 20, N = SR * DUR;
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
  const hook = t < 3.4, build = t >= 13.2 && t < 15.2, lvl = hook ? 0.6 : 1;
  if (!hook && !(build && t >= 14.7)) { kick(t, 0.5); hat(t + beat / 2, 0.07); if (b % 2) clap(t, 0.11); }
  if (build) hat(t, 0.05);
  add(sine(root, 0.45, 6), t, 0.2 * lvl); add(sine(root * 2, 0.2, 14), t + beat * 0.75, 0.07 * lvl);
  for (let k = 0; k < 2; k++) { const f = root * 4 * arpN[(b * 2 + k) % 8]; add(sine(f, 0.18, 16), t + k * beat / 2, 0.07 * lvl); add(sine(f * 2.005, 0.12, 22), t + k * beat / 2, 0.025 * lvl); }
}
// A - hook: laptop lands, error pops, screen dies
whoosh(0.0, 0.4, 0.4); stamp(0.4);
[0.9, 1.22, 1.54, 1.86].forEach((t, i) => { add(sine(330 - i * 30, 0.18, 12), t, 0.22); add(sine(247 - i * 20, 0.2, 10), t + 0.08, 0.18); });
add(sweep(400, 40, 0.5, 4), 2.55, 0.5); stamp(2.55);
// B - drop, chips land, each flips to FIXED with a rising ding
riser(2.9, 0.5, 0.2); stamp(3.4); add(sweep(90, 40, 0.7, 4), 3.4, 0.5);
for (let i = 0; i < 6; i++) { tap(3.6 + i * 0.08, 0.15); whoosh(4.55 + i * 0.42, 0.3, 0.22); ding(1046 * 1.122 ** i, 4.9 + i * 0.42, 0.2, 0.5); }
// C - map slides in, pin drops, van drives two routes, icons pop
whoosh(8.15, 0.5, 0.45); stamp(8.55); add(sweep(500, 120, 0.4, 6), 8.8, 0.25); stamp(9.2); ding(1568, 9.25, 0.18, 0.6);
[9.6, 10.9].forEach((t) => add(shape(sweep(70, 95, 1.0, 0.5, true), (_, p) => Math.sin(Math.PI * p)), t, 0.08));
ding(1318, 10.6, 0.22, 0.6); ding(1760, 11.9, 0.22, 0.6); tap(11.6, 0.2);
// D - three stamps on the beat, then the badge slam
[13.25, 13.75, 14.25].forEach((t) => { whoosh(t - 0.15, 0.2, 0.3); stamp(t + 0.25); });
riser(14.3, 0.9, 0.18); stamp(15.18); add(sweep(90, 38, 0.9, 3), 15.18, 0.6);
// E - laptop lands, check, CTA chime
whoosh(16.15, 0.5, 0.45); stamp(16.75); ding(2093, 16.8, 0.25, 0.8); ding(2637, 16.95, 0.22, 0.8); ding(3136, 17.25, 0.25, 1.0);

// fade out, soft clip, normalize
const f = SR * 1.2; for (let i = 0; i < f; i++) y[N - 1 - i] *= i / f;
let pk = 0; for (let i = 0; i < N; i++) { y[i] = Math.tanh(y[i]); pk = Math.max(pk, Math.abs(y[i])); }
const pcm = Buffer.alloc(44 + N * 2);
pcm.write("RIFF", 0); pcm.writeUInt32LE(36 + N * 2, 4); pcm.write("WAVEfmt ", 8); pcm.writeUInt32LE(16, 16); pcm.writeUInt16LE(1, 20); pcm.writeUInt16LE(1, 22);
pcm.writeUInt32LE(SR, 24); pcm.writeUInt32LE(SR * 2, 28); pcm.writeUInt16LE(2, 32); pcm.writeUInt16LE(16, 34); pcm.write("data", 36); pcm.writeUInt32LE(N * 2, 40);
for (let i = 0; i < N; i++) pcm.writeInt16LE(Math.round((y[i] / pk) * 0.9 * 32767), 44 + i * 2);
writeFileSync(join(dirname(fileURLToPath(import.meta.url)), "ad19bed.wav"), pcm);
console.log("ok");
