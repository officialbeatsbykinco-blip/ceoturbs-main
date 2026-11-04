// "WOUND": original dark grunge rage beat, 155 BPM, E phrygian / minor, synthesized from scratch (no samples).
// Tape-wobbled crushed lead, blown-out 808, distorted power-chord "guitar" in the drops, crunchy drums, vinyl grit.
//   node wound.mjs   → renders/wound-type-beat.wav and .mp3 (mp3 needs ffmpeg)
// Form: intro 8 · drop 16 · verse 16 · drop 16 · break 4 · drop 16 · outro 8 bars.
import { mkdirSync, writeFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const SR = 44100, BPM = 155, BEAT = 60 / BPM, BAR = 4 * BEAT, S16 = BEAT / 4;
const FORM = [["intro", 8], ["drop", 16], ["verse", 16], ["drop", 16], ["break", 4], ["drop", 16], ["outro", 8]];
const BARS = FORM.reduce((a, [, n]) => a + n, 0);
const N = Math.ceil((BARS * BAR + 6) * SR);
// hits bus (drums, 808) and synth bus (ducked by the kick), plus reverb / delay sends
const HL = new Float32Array(N), HR = new Float32Array(N), SL = new Float32Array(N), SR_ = new Float32Array(N);
const REV = new Float32Array(N), DLY = new Float32Array(N), DUCK = new Float32Array(N).fill(1);

let seed = 4040;
const rand = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296);
const mtof = (m) => 440 * 2 ** ((m - 69) / 12);
const mk = (d, f) => { const o = new Float32Array(Math.floor(d * SR)); for (let i = 0; i < o.length; i++) o[i] = f(i / SR, i); return o; };
const noise = (d) => mk(d, () => rand() * 2 - 1);
const hp = (x) => { const o = new Float32Array(x.length); let p = 0; for (let i = 0; i < x.length; i++) { o[i] = x[i] - p; p = x[i]; } return o; };
const lp = (x, fc) => { const a = 1 - Math.exp((-2 * Math.PI * fc) / SR); let y = 0; return x.map((v) => (y += a * (v - y))); };
const env = (x, f) => x.map((v, i) => v * f(i / SR));
const crush = (x, bits) => { const q = 2 ** (bits - 1); return x.map((v) => Math.round(v * q) / q); };
const hold = (x, k) => x.map((_, i) => x[i - (i % k)]); // sample-rate reduction
const grime = (x, bits = 6, k = 3) => crush(hold(x, k), bits);

const add = (sig, t, g = 1, { pan = 0, rev = 0, dly = 0, synth = false } = {}) => {
  const i0 = Math.round(t * SR), gl = g * Math.cos(((pan + 1) * Math.PI) / 4) * Math.SQRT2, gr = g * Math.sin(((pan + 1) * Math.PI) / 4) * Math.SQRT2;
  const [bl, br] = synth ? [SL, SR_] : [HL, HR];
  for (let k = 0; k < sig.length; k++) { const i = i0 + k; if (i < 0 || i >= N) continue; const s = sig[k]; bl[i] += s * gl; br[i] += s * gr; REV[i] += s * g * rev; DLY[i] += s * g * dly; }
};
const addLR = (sl, sr, t, g, rev = 0, dly = 0) => {
  const i0 = Math.round(t * SR);
  for (let k = 0; k < sl.length; k++) { const i = i0 + k; if (i < 0 || i >= N) continue; SL[i] += sl[k] * g; SR_[i] += sr[k] * g; const m = (sl[k] + sr[k]) * 0.5 * g; REV[i] += m * rev; DLY[i] += m * dly; }
};
const duck = (t, depth = 0.6) => { const i0 = Math.round(t * SR); for (let k = 0; k < 0.3 * SR && i0 + k < N; k++) DUCK[i0 + k] = Math.min(DUCK[i0 + k], 1 - depth * Math.exp(-k / SR / 0.08)); };

// ---- drums: everything a little broken ----
const KICK = grime((() => { let ph = 0; return mk(0.32, (t) => { ph += (2 * Math.PI * (45 + 160 * Math.exp(-t * 40))) / SR; return Math.tanh(Math.sin(ph) * 6) * Math.exp(-t * 10) + (t < 0.006 ? (rand() - 0.5) * 0.8 : 0); }); })(), 7, 2);
const SNARE = grime((() => { const n = env(lp(hp(noise(0.35)), 6000), (t) => Math.exp(-t * 11)); let ph = 0; return n.map((v, i) => { const t = i / SR; ph += (2 * Math.PI * (180 + 70 * Math.exp(-t * 40))) / SR; return Math.tanh((v + Math.sin(ph) * Math.exp(-t * 18) * 0.8) * 3); }); })(), 5, 3);
const CLAP = grime((() => { const o = new Float32Array(Math.floor(0.4 * SR)); for (const off of [0, 0.012, 0.025]) { const b = env(hp(hp(noise(0.38))), (t) => Math.exp(-t * (off < 0.02 ? 60 : 9))); const i0 = Math.floor(off * SR); for (let k = 0; k + i0 < o.length && k < b.length; k++) o[k + i0] += b[k]; } return o.map((v) => Math.tanh(v * 2.5)); })(), 6, 2);
const HAT = grime(env(hp(hp(hp(noise(0.05)))), (t) => Math.exp(-t * 75)), 5, 2);
const OHAT = grime(env(hp(hp(noise(0.5))), (t) => Math.exp(-t * 5)), 5, 3);
const CRASH = grime(env(hp(hp(noise(2.5))), (t) => Math.exp(-t * 1.4)), 6, 3);
const IMPACT = (() => { let ph = 0; return mk(3, (t) => { ph += (2 * Math.PI * (38 + 80 * Math.exp(-t * 6))) / SR; return Math.tanh(Math.sin(ph) * 5) * Math.exp(-t * 1.2); }); })();
const REVSWELL = (d) => { const x = lp(hp(noise(d)), 5000); return x.map((v, i) => v * (i / x.length) ** 3); };

// blown-out 808: clipped almost square, crushed, with a clean sub so it still has weight
function render808(m, dur, from) {
  const f1 = mtof(m), f0 = from == null ? f1 : mtof(from);
  let ph = 0;
  const sub = mk(dur + 0.03, (t) => {
    const f = from == null ? f1 * (1 + 1.6 * Math.exp(-t * 50)) : f0 + (f1 - f0) * Math.min(t / 0.09, 1);
    ph += (2 * Math.PI * f) / SR;
    return Math.sin(ph) * Math.min(t / 0.002, 1) * Math.exp(-t * 0.35) * (t < dur ? 1 : Math.max(0, 1 - (t - dur) / 0.03));
  });
  const dirt = grime(sub.map((v) => Math.tanh(v * 14)), 7, 2);
  return sub.map((v, i) => dirt[i] * 0.55 + v * 0.6);
}

// lead: two detuned square/saw voices with tape wow, crushed, then muffled
function lead(m, d, { cutoff = 3200, t0 = 0 } = {}) {
  const f = mtof(m);
  const side = (det) => {
    let p1 = rand(), p2 = rand();
    const x = mk(d + 0.25, (t) => {
      const wow = 2 ** ((0.14 * Math.sin(2 * Math.PI * 0.6 * (t0 + t)) + 0.05 * Math.sin(2 * Math.PI * 5.2 * t)) / 12);
      p1 = (p1 + (f * wow * 2 ** (det / 1200)) / SR) % 1; p2 = (p2 + (f * wow * 2 ** (-det / 1200) * 1.002) / SR) % 1;
      const a = Math.min(t / 0.015, 1) * (t < d ? 1 - 0.3 * Math.min(t / d, 1) : 0.7 * Math.max(0, 1 - (t - d) / 0.25));
      return Math.tanh(((p1 < 0.5 ? 1 : -1) * 0.6 + (2 * p2 - 1) * 0.6) * 2.5) * a;
    });
    return lp(lp(grime(x, 6, 3), cutoff), cutoff * 1.3);
  };
  return [side(9), side(-9)];
}

// grunge "guitar": a clipped power chord through a cab-like band-limit; palm-muted when short
function guitar(root, d, muted) {
  const fs = [root, root + 7, root + 12].map(mtof);
  const side = (det) => {
    const ph = fs.map(() => rand());
    const x = mk(d + 0.05, (t) => {
      let s = 0;
      fs.forEach((f, v) => { ph[v] = (ph[v] + (f * 2 ** (det / 1200)) / SR) % 1; s += 2 * ph[v] - 1; });
      const a = Math.min(t / 0.003, 1) * (muted ? Math.exp(-t * 18) : Math.exp(-t * 0.8)) * (t < d ? 1 : Math.max(0, 1 - (t - d) / 0.05));
      return Math.tanh(s * a * 9);
    });
    return lp(lp(hp(hp(x)).map((v) => v * 6), 2800), 3600);
  };
  return [side(6), side(-6)];
}

// low drone pad
const drone = (notes, d) => { const side = (det) => { const ph = notes.map(() => rand()); return lp(lp(mk(d, (t) => notes.reduce((s, n, v) => { ph[v] = (ph[v] + (mtof(n) * 2 ** (det / 1200)) / SR) % 1; return s + 2 * ph[v] - 1; }, 0) * Math.min(t / 1, 1, (d - t) / 0.6)), 700), 700); }; return [side(-7), side(7)]; };

// ---- music: Em · F · C · B (phrygian bII and a harmonic-minor V) ----
const CH = [[52, 55, 59], [53, 57, 60], [48, 52, 55], [47, 51, 54]];
const ROOT = [28, 29, 36, 35];
const GTR = [40, 41, 36, 35];
// four-bar lead phrase: [step, 16ths, midi]
const PHRASE = [
  [[0, 6, 83], [6, 2, 81], [8, 8, 79]],
  [[0, 4, 77], [4, 4, 79], [8, 8, 81]],
  [[0, 6, 79], [6, 2, 77], [8, 4, 76], [12, 4, 72]],
  [[0, 8, 75], [8, 4, 78], [12, 4, 71]],
];
const VERSE_PHRASE = [[[0, 12, 79]], [[0, 12, 77]], [[0, 12, 76]], [[0, 8, 75], [8, 6, 71]]];
const B808 = {
  drop: [[0, 0, 3], [3, 0, 3], [6, 0, 2], [8, 12, 2, 1], [10, 0, 2], [12, 0, 2], [14, 1, 2, 1]],
  verse: [[0, 0, 6], [6, 0, 4], [10, 0, 2], [12, 7, 4, 1]],
  break: [[0, 0, 16]],
};
const CHUGS = [[0, 1], [1, 1], [3, 1], [4, 1], [6, 2], [8, 1], [9, 1], [11, 1], [12, 4, 1]]; // [step, 16ths, ring?]

const BAR_SEC = [];
{ const seen = {}; for (const [s, len] of FORM) { seen[s] = (seen[s] || 0) + 1; for (let k = 0; k < len; k++) BAR_SEC.push({ s, k, len, nth: seen[s] }); } }

let prev808 = null;
for (let b = 0; b < BARS; b++) {
  const { s, k, len, nth } = BAR_SEC[b], t0 = b * BAR, c = b % 4, at = (step) => t0 + step * S16;
  const drop = s === "drop", verse = s === "verse", lastOfSec = k === len - 1, next = BAR_SEC[b + 1]?.s;
  const fade = s === "outro" ? 1 - k / 8 : 1;
  const gap = (st) => lastOfSec && next && st >= 14; // two 16ths of silence before the next section lands

  // drone under everything
  { const [l, r] = drone([...CH[c].map((n) => n - 12), ROOT[c] + 12], BAR + 0.05); addLR(l, r, t0, (s === "intro" ? 0.03 : 0.04) * fade, 0.4); }

  // lead: full phrase except in the verse, where it hangs long notes out of the vocal's way
  const ph = verse ? VERSE_PHRASE[c] : PHRASE[c];
  const lg = { intro: 0.2, drop: 0.24, verse: 0.13, break: 0.2, outro: 0.2 }[s] * fade;
  const cut = s === "intro" ? 900 + 260 * k : verse ? 1800 : s === "break" ? 1400 : 3400;
  for (const [st, l16, m] of ph) {
    if (gap(st)) continue;
    const [l, r] = lead(m, l16 * S16, { cutoff: cut, t0: at(st) });
    addLR(l, r, at(st), lg, 0.5, 0.25);
    if (drop && nth === 3) { const [l2, r2] = lead(m - 12, l16 * S16, { cutoff: 2000, t0: at(st) + 0.3 }); addLR(l2, r2, at(st), lg * 0.5, 0.3); }
  }
  // reversed swell into each four-bar phrase in the drops
  if ((drop || s === "break") && c === 3) add(REVSWELL(BAR / 2), at(8), 0.06, { rev: 0.4, synth: true });

  // grunge guitar: chugs in drops 2 and 3, ringing chords in the back half of drop 1 and the break
  if (drop && nth > 1) for (const [st, l16, ring] of CHUGS) {
    if (gap(st)) continue;
    const [l, r] = guitar(GTR[c], l16 * S16 * 0.9, !ring);
    addLR(l, r, at(st), ring ? 0.05 : 0.065, 0.15);
  }
  if ((drop && nth === 1 && k >= 8) || s === "break") for (const st of [0, 8]) {
    if (gap(st)) continue;
    const [l, r] = guitar(GTR[c], 8 * S16 * 0.95, false);
    addLR(l, r, at(st), 0.045, 0.3);
  }

  // 808 + kick (+ sidechain)
  const pat = drop ? B808.drop : verse ? B808.verse : s === "break" && k >= 2 ? B808.break : null;
  if (pat) for (const [st, off, l16, slide] of pat) {
    if (gap(st)) continue;
    const m = ROOT[c] + off;
    add(render808(m, l16 * S16, slide ? prev808 : null), at(st), 0.36);
    if (!slide) { add(KICK, at(st), 0.4); duck(at(st)); }
    prev808 = m;
  }

  if (drop || verse) {
    add(CLAP, at(8), 0.32, { rev: 0.35 }); add(SNARE, at(8), 0.3, { rev: 0.2 });
    if (drop && b % 4 === 3) add(SNARE, at(15), 0.14, { rev: 0.3 });
    // hats: 8ths with 16th pickups, rolls on rotating bars, a little lazy
    const hats = [];
    for (let st = 0; st < 16; st += 2) hats.push([st * S16 + (st % 4 ? 0.008 : 0), st % 4 ? 0.6 : 1]);
    if (drop) for (const st of [5, 13]) hats.push([st * S16, 0.45]);
    const roll = b % 4 === 1 ? 6 : b % 4 === 3 ? 8 : 0;
    if (roll) { for (let i = hats.length - 1; i >= 0; i--) if (hats[i][0] >= 12 * S16) hats.splice(i, 1); for (let j = 0; j < roll; j++) hats.push([12 * S16 + (j * 4 * S16) / roll, 0.35 + (0.65 * j) / roll]); }
    for (const [t, g] of hats) if (!gap(t / S16)) add(HAT, t0 + t, 0.15 * g, { pan: 0.25 });
    if (drop && k % 2 === 0) add(OHAT, at(6), 0.045, { pan: -0.3, rev: 0.2 });
    if (k % 8 === 0) add(CRASH, t0, drop ? 0.1 : 0.06, { rev: 0.4 });
  }
  if (s === "break" && k >= 2) for (let st = 0; st < 16; st += k === 3 ? 1 : 2) if (!gap(st)) add(SNARE, at(st), 0.08 + (0.2 * st) / 16, { rev: 0.4 });
  if (lastOfSec && next === "drop") { add(REVSWELL(BAR), t0, 0.1, { rev: 0.3 }); add(IMPACT, (b + 1) * BAR, 0.35, { rev: 0.6 }); }
}

// vinyl bed: hiss + crackle, the whole way through
{
  const hiss = lp(hp(noise(BARS * BAR + 3)), 5000);
  for (let i = 0; i < hiss.length && i < N; i++) { HL[i] += hiss[i] * 0.006; HR[i] += hiss[(i + 777) % hiss.length] * 0.006; }
  for (let t = 0; t < BARS * BAR; t += rand() * 0.12) { const i = Math.round(t * SR), g = (rand() < 0.1 ? 0.25 : 0.06) * (rand() - 0.5); for (let k = 0; k < 30 && i + k < N; k++) { const v = g * Math.exp(-k / 6); (rand() < 0.5 ? HL : HR)[i + k] += v; } }
}

// ---- effects: dark stereo reverb, dotted-8th ping-pong ----
function reverb(x, combs, aps) {
  const out = new Float32Array(x.length);
  for (const d of combs) { const buf = new Float32Array(d); let j = 0, z = 0; for (let i = 0; i < x.length; i++) { const y = buf[j]; z = y * 0.35 + z * 0.65; buf[j] = x[i] + z * 0.88; j = (j + 1) % d; out[i] += y; } }
  for (const d of aps) { const buf = new Float32Array(d); let j = 0; for (let i = 0; i < x.length; i++) { const v = buf[j], y = -out[i] * 0.5 + v; buf[j] = out[i] + v * 0.5; j = (j + 1) % d; out[i] = y; } }
  return out;
}
const rl = reverb(REV, [1557, 1617, 1491, 1422, 1277, 1356], [556, 441]), rr = reverb(REV, [1580, 1640, 1514, 1445, 1300, 1379], [579, 464]);
const dt = Math.round(3 * S16 * SR), dl = new Float32Array(N), dr = new Float32Array(N);
const dsend = lp(hp(DLY), 2500);
for (let i = dt; i < N; i++) { dl[i] = dsend[i - dt] + dr[i - dt] * 0.45; dr[i] = dl[i - dt]; }

// ---- master: pump the synths, drive, darken, normalize, write ----
const n = Math.ceil((BARS * BAR + 3) * SR);
let outL = new Float32Array(n), outR = new Float32Array(n);
for (let i = 0; i < n; i++) {
  const tail = i > BARS * BAR * SR ? Math.max(0, 1 - (i - BARS * BAR * SR) / (3 * SR)) : 1;
  const d = DUCK[i];
  outL[i] = Math.tanh((HL[i] + (SL[i] + rl[i] * 0.13 + dl[i] * 0.35) * d) * 2) * tail;
  outR[i] = Math.tanh((HR[i] + (SR_[i] + rr[i] * 0.13 + dr[i] * 0.35) * d) * 2) * tail;
}
outL = lp(outL, 11000); outR = lp(outR, 11000);
let pk = 0;
for (let i = 0; i < n; i++) pk = Math.max(pk, Math.abs(outL[i]), Math.abs(outR[i]));
const pcm = Buffer.alloc(44 + n * 4);
pcm.write("RIFF", 0); pcm.writeUInt32LE(36 + n * 4, 4); pcm.write("WAVEfmt ", 8); pcm.writeUInt32LE(16, 16); pcm.writeUInt16LE(1, 20); pcm.writeUInt16LE(2, 22);
pcm.writeUInt32LE(SR, 24); pcm.writeUInt32LE(SR * 4, 28); pcm.writeUInt16LE(4, 32); pcm.writeUInt16LE(16, 34); pcm.write("data", 36); pcm.writeUInt32LE(n * 4, 40);
for (let i = 0; i < n; i++) { pcm.writeInt16LE(Math.round((outL[i] / pk) * 0.95 * 32767), 44 + i * 4); pcm.writeInt16LE(Math.round((outR[i] / pk) * 0.95 * 32767), 46 + i * 4); }

const dir = path.join(HERE, "renders");
mkdirSync(dir, { recursive: true });
const wav = path.join(dir, "wound-type-beat.wav");
writeFileSync(wav, pcm);
console.log(`wrote ${wav} (${(n / SR).toFixed(1)}s)`);
try {
  execFileSync("ffmpeg", ["-y", "-v", "error", "-i", wav, "-af", "loudnorm=I=-8:TP=-0.8:LRA=8", "-ar", "44100", "-b:a", "320k", path.join(dir, "wound-type-beat.mp3")]);
  console.log("wrote wound-type-beat.mp3");
} catch { console.log("ffmpeg not found, skipped mp3"); }
