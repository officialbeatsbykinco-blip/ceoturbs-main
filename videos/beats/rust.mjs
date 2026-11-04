// "RUST": original swaggy dark grunge rage beat, 160 BPM, G minor (Gm · Ab), synthesized from scratch (no samples).
// The 808 leads: blown-out, sliding everywhere. Over it, a slow eerie bell loop, a dark pad, crunchy drums, glitch stutters.
//   node rust.mjs   → renders/rust-type-beat.wav and .mp3 (mp3 needs ffmpeg)
// Form: intro 8 · drop 16 · verse 16 · drop 16 · verse 16 · drop 8 · outro 4 bars.
import { mkdirSync, writeFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const SR = 44100, BPM = 160, BEAT = 60 / BPM, BAR = 4 * BEAT, S16 = BEAT / 4;
const FORM = [["intro", 8], ["drop", 16], ["verse", 16], ["drop", 16], ["verse", 16], ["drop", 8], ["outro", 4]];
const BARS = FORM.reduce((a, [, n]) => a + n, 0);
const N = Math.ceil((BARS * BAR + 6) * SR);
const HL = new Float32Array(N), HR = new Float32Array(N), SL = new Float32Array(N), SR_ = new Float32Array(N);
const REV = new Float32Array(N), DLY = new Float32Array(N), DUCK = new Float32Array(N).fill(1);

let seed = 2077;
const rand = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296);
const mtof = (m) => 440 * 2 ** ((m - 69) / 12);
const mk = (d, f) => { const o = new Float32Array(Math.floor(d * SR)); for (let i = 0; i < o.length; i++) o[i] = f(i / SR, i); return o; };
const noise = (d) => mk(d, () => rand() * 2 - 1);
const hp = (x) => { const o = new Float32Array(x.length); let p = 0; for (let i = 0; i < x.length; i++) { o[i] = x[i] - p; p = x[i]; } return o; };
const lp = (x, fc) => { const a = 1 - Math.exp((-2 * Math.PI * fc) / SR); let y = 0; return x.map((v) => (y += a * (v - y))); };
const env = (x, f) => x.map((v, i) => v * f(i / SR));
const crush = (x, bits) => { const q = 2 ** (bits - 1); return x.map((v) => Math.round(v * q) / q); };
const hold = (x, k) => x.map((_, i) => x[i - (i % k)]);

const add = (sig, t, g = 1, { pan = 0, rev = 0, dly = 0, synth = false } = {}) => {
  const i0 = Math.round(t * SR), gl = g * Math.cos(((pan + 1) * Math.PI) / 4) * Math.SQRT2, gr = g * Math.sin(((pan + 1) * Math.PI) / 4) * Math.SQRT2;
  const [bl, br] = synth ? [SL, SR_] : [HL, HR];
  for (let k = 0; k < sig.length; k++) { const i = i0 + k; if (i < 0 || i >= N) continue; const s = sig[k]; bl[i] += s * gl; br[i] += s * gr; REV[i] += s * g * rev; DLY[i] += s * g * dly; }
};
const addLR = (sl, sr, t, g, rev = 0, dly = 0) => {
  const i0 = Math.round(t * SR);
  for (let k = 0; k < sl.length; k++) { const i = i0 + k; if (i < 0 || i >= N) continue; SL[i] += sl[k] * g; SR_[i] += sr[k] * g; const m = (sl[k] + sr[k]) * 0.5 * g; REV[i] += m * rev; DLY[i] += m * dly; }
};
const duck = (t, depth = 0.5) => { const i0 = Math.round(t * SR); for (let k = 0; k < 0.3 * SR && i0 + k < N; k++) DUCK[i0 + k] = Math.min(DUCK[i0 + k], 1 - depth * Math.exp(-k / SR / 0.09)); };

// ---- drums ----
const KICK = (() => { let ph = 0; return mk(0.3, (t) => { ph += (2 * Math.PI * (48 + 190 * Math.exp(-t * 45))) / SR; return Math.tanh(Math.sin(ph) * 7) * Math.exp(-t * 11) + (t < 0.005 ? (rand() - 0.5) : 0); }); })();
const CLAP = crush((() => { const o = new Float32Array(Math.floor(0.4 * SR)); for (const off of [0, 0.01, 0.022]) { const b = env(hp(hp(noise(0.38))), (t) => Math.exp(-t * (off < 0.02 ? 65 : 10))); const i0 = Math.floor(off * SR); for (let k = 0; k + i0 < o.length && k < b.length; k++) o[k + i0] += b[k]; } let ph = 0; for (let i = 0; i < 0.1 * SR; i++) { const t = i / SR; ph += (2 * Math.PI * (210 + 90 * Math.exp(-t * 50))) / SR; o[i] += Math.sin(ph) * Math.exp(-t * 28) * 0.6; } return o.map((v) => Math.tanh(v * 3)); })(), 7);
const HAT = crush(env(hp(hp(hp(noise(0.045)))), (t) => Math.exp(-t * 85)), 7);
const OHAT = crush(env(hp(hp(hp(noise(0.4)))), (t) => Math.exp(-t * 7)), 7);
const PERC = (() => { let ph = 0; return mk(0.12, (t) => { ph += (2 * Math.PI * (900 + 500 * Math.exp(-t * 60))) / SR; return Math.sin(ph) * Math.exp(-t * 40); }); })();
const CRASH = crush(env(hp(hp(noise(2.4))), (t) => Math.exp(-t * 1.5)), 7);
const IMPACT = (() => { let ph = 0; return mk(2.6, (t) => { ph += (2 * Math.PI * (40 + 90 * Math.exp(-t * 7))) / SR; return Math.tanh(Math.sin(ph) * 6) * Math.exp(-t * 1.3); }); })();
const SWELL = (d) => { const x = lp(hp(noise(d)), 6000); return x.map((v, i) => v * (i / x.length) ** 3); };

// the 808: clean sub + a hard-clipped, crushed top that screams when it slides
function e808(m, dur, from) {
  const f1 = mtof(m), f0 = from == null ? f1 : mtof(from);
  let ph = 0;
  const sub = mk(dur + 0.03, (t) => {
    const f = from == null ? f1 * (1 + 1.7 * Math.exp(-t * 55)) : f0 + (f1 - f0) * Math.min(t / 0.1, 1);
    ph += (2 * Math.PI * f) / SR;
    return Math.sin(ph) * Math.min(t / 0.002, 1) * Math.exp(-t * 0.3) * (t < dur ? 1 : Math.max(0, 1 - (t - dur) / 0.03));
  });
  const top = crush(hold(sub.map((v) => Math.tanh((v + 0.3 * v * v) * 16)), 2), 8);
  return sub.map((v, i) => top[i] * 0.5 + v * 0.65);
}

// eerie bell: detuned FM pair with a little downward "plink" at the attack, slightly crushed
function bell(m, d) {
  const f = mtof(m);
  const side = (det) => crush(mk(d + 1.2, (t) => {
    const ff = f * 2 ** (det / 1200) * (1 - 0.012 * Math.exp(-t * 30));
    const a = Math.min(t / 0.003, 1) * Math.exp(-t * 1.6) * (t < d ? 1 : Math.max(0, 1 - (t - d) / 1.2));
    return Math.sin(2 * Math.PI * ff * t + 2.4 * Math.exp(-t * 3.5) * Math.sin(2 * Math.PI * ff * 2.01 * t)) * a;
  }), 9);
  return [side(-8), side(8)];
}

// dark pad: detuned saws, low-passed, slow in and out
const pad = (notes, d) => { const side = (det) => { const ph = notes.map(() => rand()); return lp(lp(mk(d, (t) => notes.reduce((s, n, v) => { ph[v] = (ph[v] + (mtof(n) * 2 ** (det / 1200)) / SR) % 1; return s + 2 * ph[v] - 1; }, 0) * Math.min(t / 0.8, 1, (d - t) / 0.5)), 1100), 1100); }; return [side(-10), side(10)]; };

// siren: a distorted detuned saw that bends down an octave, for the second-half drops
const siren = (m, d) => { const side = (det) => { let p1 = rand(), p2 = rand(); return lp(mk(d, (t) => { const f = mtof(m) * 2 ** (-(Math.min(t / d, 1) ** 2)); p1 = (p1 + (f * 2 ** (det / 1200)) / SR) % 1; p2 = (p2 + (f * 2 ** (-det / 1200)) / SR) % 1; return Math.tanh((2 * p1 - 1 + 2 * p2 - 1) * 2) * Math.min(t / 0.05, 1) * (1 - t / d); }), 4000); }; return [side(15), side(-15)]; };

// ---- music: Gm · Ab, two bars each ----
const CH = [[55, 58, 62], [56, 60, 63]];
const ROOT = [31, 32];
// slow eerie bell loop over four bars: [step, 16ths, midi]
const LOOP = [
  [[0, 4, 86], [6, 2, 82], [8, 8, 79]],
  [[4, 2, 81], [6, 2, 82], [8, 6, 79]],
  [[0, 4, 84], [6, 2, 82], [8, 4, 80], [12, 4, 79]],
  [[0, 6, 77], [8, 4, 79], [12, 2, 80], [14, 2, 82]],
];
const B808 = {
  drop: [[0, 0, 3], [3, 0, 3], [6, 12, 2, 1], [8, 0, 2], [10, 0, 2], [12, -2, 2, 1], [14, 0, 2, 1]],
  dropB: [[0, 0, 4], [4, 0, 2], [6, 0, 2], [8, 12, 3, 1], [11, 7, 1, 1], [12, 0, 4]],
  verse: [[0, 0, 6], [7, 0, 3], [10, 12, 2, 1], [12, 0, 4]],
};

const BAR_SEC = [];
{ const seen = {}; for (const [s, len] of FORM) { seen[s] = (seen[s] || 0) + 1; for (let k = 0; k < len; k++) BAR_SEC.push({ s, k, len, nth: seen[s] }); } }
const STUTTERS = [];

let prev808 = null;
for (let b = 0; b < BARS; b++) {
  const { s, k, len, nth } = BAR_SEC[b], t0 = b * BAR, c = (b >> 1) % 2, at = (step) => t0 + step * S16;
  const drop = s === "drop", verse = s === "verse", lastOfSec = k === len - 1, next = BAR_SEC[b + 1]?.s;
  const fade = s === "outro" ? 1 - k / 4 : 1;
  const gap = (st) => lastOfSec && next && st >= 14;

  // pad under everything, bell loop over it (sparser in the verses: every other bar)
  if (b % 2 === 0) { const [l, r] = pad([...CH[c].map((n) => n - 12), ROOT[c] + 24], 2 * BAR); addLR(l, r, t0, (verse ? 0.022 : 0.03) * fade, 0.5); }
  if (!verse || k % 2 === 0) {
    const g = { intro: 0.2, drop: 0.24, verse: 0.16, outro: 0.2 }[s] * fade;
    for (const [st, l16, m] of LOOP[b % 4]) {
      if (gap(st)) continue;
      const [l, r] = bell(m, l16 * S16);
      addLR(s === "intro" && k < 4 ? lp(l, 1500) : l, s === "intro" && k < 4 ? lp(r, 1500) : r, at(st), g, 0.55, 0.35);
      if (drop) { const [l2, r2] = bell(m - 12, l16 * S16); addLR(l2, r2, at(st), g * 0.35, 0.3); }
    }
  }
  // siren bends in the second and third drops, once every four bars
  if (drop && nth > 1 && k % 4 === 0) { const [l, r] = siren(CH[c][2] + 12, 2 * BAR); addLR(l, r, t0, 0.035, 0.4, 0.2); }

  // 808 + kick
  const pat = drop ? (b % 2 ? B808.dropB : B808.drop) : verse ? B808.verse : null;
  if (pat) for (const [st, off, l16, slide] of pat) {
    if (gap(st)) continue;
    const m = ROOT[c] + off;
    add(e808(m, l16 * S16, slide ? prev808 : null), at(st), 0.36);
    if (!slide) { add(KICK, at(st), 0.4); duck(at(st)); }
    prev808 = m;
  }

  if (drop || verse) {
    add(CLAP, at(8), 0.38, { rev: 0.3 });
    if (drop && b % 4 === 3) add(CLAP, at(15), 0.15, { pan: 0.2, rev: 0.3 });
    // hats: 16ths, accented, with triplet and 32nd rolls and the odd skip for swing
    const hats = [];
    const roll = b % 4 === 1 ? 6 : b % 4 === 3 ? 8 : 0;
    for (let st = 0; st < 16; st++) { if (roll && st >= 12) continue; if (verse && st % 2 && st !== 7 && st !== 15) continue; hats.push([st * S16, st % 4 === 0 ? 1 : st % 2 ? 0.45 : 0.7]); }
    for (let j = 0; j < roll; j++) hats.push([12 * S16 + (j * 4 * S16) / roll, 0.35 + (0.65 * j) / roll]);
    for (const [t, g] of hats) if (!gap(t / S16)) add(HAT, t0 + t, 0.12 * g, { pan: 0.25 });
    if (drop) add(OHAT, at(b % 2 ? 14 : 6), 0.05, { pan: -0.3, rev: 0.15 });
    for (const st of [3, 11]) if (!gap(st)) add(PERC, at(st), 0.05, { pan: -0.35, rev: 0.25 });
    if (k % 8 === 0) add(CRASH, t0, drop ? 0.1 : 0.06, { rev: 0.4 });
    // glitch: stutter the last beat every 8 bars in the drops
    if (drop && k % 8 === 7 && !lastOfSec) STUTTERS.push(at(12));
  }
  if (lastOfSec && next === "drop") { add(SWELL(BAR), t0, 0.09, { rev: 0.4 }); add(IMPACT, (b + 1) * BAR, 0.33, { rev: 0.5 }); }
  if (lastOfSec && next === "verse") STUTTERS.push(at(12));
}

// vinyl bed
{
  const hiss = lp(hp(noise(BARS * BAR + 3)), 5000);
  for (let i = 0; i < hiss.length && i < N; i++) { HL[i] += hiss[i] * 0.005; HR[i] += hiss[(i + 911) % hiss.length] * 0.005; }
  for (let t = 0; t < BARS * BAR; t += rand() * 0.15) { const i = Math.round(t * SR), g = (rand() < 0.1 ? 0.2 : 0.05) * (rand() - 0.5); for (let k = 0; k < 30 && i + k < N; k++) (rand() < 0.5 ? HL : HR)[i + k] += g * Math.exp(-k / 6); }
}

// ---- effects ----
function reverb(x, combs, aps) {
  const out = new Float32Array(x.length);
  for (const d of combs) { const buf = new Float32Array(d); let j = 0, z = 0; for (let i = 0; i < x.length; i++) { const y = buf[j]; z = y * 0.4 + z * 0.6; buf[j] = x[i] + z * 0.87; j = (j + 1) % d; out[i] += y; } }
  for (const d of aps) { const buf = new Float32Array(d); let j = 0; for (let i = 0; i < x.length; i++) { const v = buf[j], y = -out[i] * 0.5 + v; buf[j] = out[i] + v * 0.5; j = (j + 1) % d; out[i] = y; } }
  return out;
}
const rl = reverb(REV, [1557, 1617, 1491, 1422, 1277, 1356], [556, 441]), rr = reverb(REV, [1580, 1640, 1514, 1445, 1300, 1379], [579, 464]);
const dt = Math.round(3 * S16 * SR), dl = new Float32Array(N), dr = new Float32Array(N);
const dsend = lp(hp(DLY), 3000);
for (let i = dt; i < N; i++) { dl[i] = dsend[i - dt] + dr[i - dt] * 0.45; dr[i] = dl[i - dt]; }

// ---- master: pump, drive, a little crunch, glitch stutters, normalize, write ----
const n = Math.ceil((BARS * BAR + 3) * SR);
const outL = new Float32Array(n), outR = new Float32Array(n);
for (let i = 0; i < n; i++) {
  const tail = i > BARS * BAR * SR ? Math.max(0, 1 - (i - BARS * BAR * SR) / (3 * SR)) : 1;
  const d = DUCK[i];
  outL[i] = Math.tanh((HL[i] + (SL[i] + rl[i] * 0.13 + dl[i] * 0.33) * d) * 2.1) * tail;
  outR[i] = Math.tanh((HR[i] + (SR_[i] + rr[i] * 0.13 + dr[i] * 0.33) * d) * 2.1) * tail;
}
for (const o of [outL, outR]) { const c = crush(o, 9); for (let i = 0; i < n; i++) o[i] = o[i] * 0.75 + c[i] * 0.25; }
// stutter: repeat the first 32nd of the beat across the whole beat, getting shorter
for (const t of STUTTERS) for (const o of [outL, outR]) {
  const i0 = Math.round(t * SR), beat = Math.round(BEAT * SR), slice = o.slice(i0, i0 + Math.round((S16 / 2) * SR));
  for (let k = 0, pos = 0, len = slice.length; pos < beat; k++) { for (let j = 0; j < len && pos < beat; j++, pos++) o[i0 + pos] = slice[j] * Math.min(1, (len - j) / 40); if (k === 3) len = Math.round(len / 2); }
}
let pk = 0;
for (let i = 0; i < n; i++) pk = Math.max(pk, Math.abs(outL[i]), Math.abs(outR[i]));
const pcm = Buffer.alloc(44 + n * 4);
pcm.write("RIFF", 0); pcm.writeUInt32LE(36 + n * 4, 4); pcm.write("WAVEfmt ", 8); pcm.writeUInt32LE(16, 16); pcm.writeUInt16LE(1, 20); pcm.writeUInt16LE(2, 22);
pcm.writeUInt32LE(SR, 24); pcm.writeUInt32LE(SR * 4, 28); pcm.writeUInt16LE(4, 32); pcm.writeUInt16LE(16, 34); pcm.write("data", 36); pcm.writeUInt32LE(n * 4, 40);
for (let i = 0; i < n; i++) { pcm.writeInt16LE(Math.round((outL[i] / pk) * 0.95 * 32767), 44 + i * 4); pcm.writeInt16LE(Math.round((outR[i] / pk) * 0.95 * 32767), 46 + i * 4); }

const dir = path.join(HERE, "renders");
mkdirSync(dir, { recursive: true });
const wav = path.join(dir, "rust-type-beat.wav");
writeFileSync(wav, pcm);
console.log(`wrote ${wav} (${(n / SR).toFixed(1)}s)`);
try {
  execFileSync("ffmpeg", ["-y", "-v", "error", "-i", wav, "-af", "loudnorm=I=-7.5:TP=-0.8:LRA=8", "-ar", "44100", "-b:a", "320k", path.join(dir, "rust-type-beat.mp3")]);
  console.log("wrote rust-type-beat.mp3");
} catch { console.log("ffmpeg not found, skipped mp3"); }
