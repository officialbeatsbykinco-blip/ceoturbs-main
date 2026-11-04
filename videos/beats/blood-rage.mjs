// "BLOOD (RAGE)": original rage / EDM-trap beat, 160 BPM, C# minor, synthesized from scratch (no samples).
// Distorted supersaw hook, overdriven gliding 808, sidechain pump, builds into each drop.
//   node blood-rage.mjs   → renders/blood-rage-type-beat.wav and .mp3 (mp3 needs ffmpeg)
// Form: intro 8 · build 4 · drop 16 · verse 16 · build 4 · drop 16 · outro 8 bars.
import { mkdirSync, writeFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const SR = 44100, BPM = 160, BEAT = 60 / BPM, BAR = 4 * BEAT, S16 = BEAT / 4, BARS = 72;
const N = Math.ceil((BARS * BAR + 5) * SR);
// two buses: hits (drums, 808) and synths (ducked by the kick), plus reverb / delay sends
const HL = new Float32Array(N), HR = new Float32Array(N), SL = new Float32Array(N), SR_ = new Float32Array(N);
const REV = new Float32Array(N), DLY = new Float32Array(N), DUCK = new Float32Array(N).fill(1);

let seed = 666;
const rand = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296);
const mtof = (m) => 440 * 2 ** ((m - 69) / 12);
const mk = (d, f) => { const o = new Float32Array(Math.floor(d * SR)); for (let i = 0; i < o.length; i++) o[i] = f(i / SR, i); return o; };
const noise = (d) => mk(d, () => rand() * 2 - 1);
const hp = (x) => { const o = new Float32Array(x.length); let p = 0; for (let i = 0; i < x.length; i++) { o[i] = x[i] - p; p = x[i]; } return o; };
const lp = (x, fc) => { const a = 1 - Math.exp((-2 * Math.PI * fc) / SR); let y = 0; return x.map((v) => (y += a * (v - y))); };
const env = (x, f) => x.map((v, i) => v * f(i / SR));
const crush = (x, bits) => { const q = 2 ** (bits - 1); return x.map((v) => Math.round(v * q) / q); };

const add = (sig, t, g = 1, { pan = 0, rev = 0, dly = 0, synth = false } = {}) => {
  const i0 = Math.round(t * SR), gl = g * Math.cos(((pan + 1) * Math.PI) / 4) * Math.SQRT2, gr = g * Math.sin(((pan + 1) * Math.PI) / 4) * Math.SQRT2;
  const [bl, br] = synth ? [SL, SR_] : [HL, HR];
  for (let k = 0; k < sig.length; k++) { const i = i0 + k; if (i < 0 || i >= N) continue; const s = sig[k]; bl[i] += s * gl; br[i] += s * gr; REV[i] += s * g * rev; DLY[i] += s * g * dly; }
};
const addLR = (sl, sr, t, g, rev = 0) => {
  const i0 = Math.round(t * SR);
  for (let k = 0; k < sl.length; k++) { const i = i0 + k; if (i >= N) break; SL[i] += sl[k] * g; SR_[i] += sr[k] * g; REV[i] += (sl[k] + sr[k]) * 0.5 * g * rev; }
};
const duck = (t, depth = 0.7) => { const i0 = Math.round(t * SR); for (let k = 0; k < 0.3 * SR && i0 + k < N; k++) DUCK[i0 + k] = Math.min(DUCK[i0 + k], 1 - depth * Math.exp(-k / SR / 0.07)); };

// ---- drums ----
const KICK = (() => { let ph = 0; const body = mk(0.3, (t) => { ph += (2 * Math.PI * (50 + 180 * Math.exp(-t * 45))) / SR; return Math.tanh(Math.sin(ph) * 4) * Math.exp(-t * 12); }); const click = env(hp(noise(0.008)), (t) => Math.exp(-t * 500)); for (let i = 0; i < click.length; i++) body[i] += click[i] * 0.7; return body; })();
const CLAP = (() => { const o = new Float32Array(Math.floor(0.35 * SR)); for (const off of [0, 0.01, 0.021]) { const b = env(hp(hp(noise(0.33))), (t) => Math.exp(-t * (off < 0.02 ? 70 : 11))); const i0 = Math.floor(off * SR); for (let k = 0; k + i0 < o.length && k < b.length; k++) o[k + i0] += b[k]; } let ph = 0; for (let i = 0; i < 0.12 * SR; i++) { const t = i / SR; ph += (2 * Math.PI * (220 + 80 * Math.exp(-t * 50))) / SR; o[i] += Math.sin(ph) * Math.exp(-t * 30) * 0.5; } return o.map((v) => Math.tanh(v * 2)); })();
const SNARE = env(lp(hp(noise(0.2)), 8000), (t) => Math.exp(-t * 25));
const HAT = env(hp(hp(hp(noise(0.04)))), (t) => Math.exp(-t * 90));
const OHAT = env(hp(hp(hp(noise(0.35)))), (t) => Math.exp(-t * 8));
const RISER = (d) => { const x = hp(noise(d)); let ph = 0; return x.map((v, i) => { const p = i / x.length; ph += (2 * Math.PI * (200 + 1800 * p * p)) / SR; return (v * 0.7 + Math.sign(Math.sin(ph)) * 0.25) * p ** 2.2; }); };
const IMPACT = (() => { let ph = 0; return mk(2.5, (t) => { ph += (2 * Math.PI * (60 + 90 * Math.exp(-t * 8))) / SR; return Math.tanh(Math.sin(ph) * 3) * Math.exp(-t * 1.6); }); })();

// overdriven 808: square-ish grit on top of a clean sub, glides when sliding
function e808(m, dur, from) {
  const f1 = mtof(m), f0 = from == null ? f1 : mtof(from);
  let ph = 0;
  return mk(dur + 0.03, (t) => {
    const f = from == null ? f1 * (1 + 1.8 * Math.exp(-t * 60)) : f0 + (f1 - f0) * Math.min(t / 0.07, 1);
    ph += (2 * Math.PI * f) / SR;
    const a = Math.min(t / 0.002, 1) * Math.exp(-t * 0.5) * (t < dur ? 1 : Math.max(0, 1 - (t - dur) / 0.03));
    const s = Math.sin(ph) + 0.35 * Math.sin(2 * ph);
    return (Math.tanh(s * a * 7) * 0.6 + Math.sin(ph) * a * 0.55);
  });
}

// supersaw: 7 detuned saws per side, driven and partly bit-crushed
function supersaw(m, d, { cutoff = 6000, drive = 4, attack = 0.004, release = 0.06, sustain = true } = {}) {
  const f = mtof(m), det = [-24, -15, -7, 0, 7, 15, 24];
  const side = (sgn) => {
    const ph = det.map(() => rand());
    const x = mk(d + release, (t) => {
      let s = 0;
      for (let v = 0; v < 7; v++) { ph[v] = (ph[v] + (f * 2 ** ((det[v] * (v === 3 ? 1 : sgn)) / 1200)) / SR) % 1; s += 2 * ph[v] - 1; }
      const a = Math.min(t / attack, 1) * (sustain ? 1 : Math.exp(-t * 3)) * (t < d ? 1 : Math.max(0, 1 - (t - d) / release));
      return Math.tanh((s / 3.5) * drive) * a;
    });
    const c = crush(x, 7);
    return lp(lp(x.map((v, i) => v * 0.75 + c[i] * 0.25), cutoff), cutoff * 1.4);
  };
  return [side(1), side(-1)];
}

// ---- music ----
// C#m · A · E · B, one bar each
const CH = [[73, 76, 80], [69, 73, 76], [76, 80, 83], [71, 75, 78]];
const ROOT = [25 + 12, 21 + 12, 28, 23 + 12];
// the hook: [step, chord tone (3 = root up an octave), length in 16ths]; bar 4 answers the first three
const HOOK = [[0, 2, 2], [2, 2, 1], [3, 1, 2], [6, 2, 2], [8, 0, 2], [10, 1, 2], [12, 3, 3]];
const HOOK_END = [[0, 3, 2], [2, 2, 1], [3, 3, 2], [6, 2, 2], [8, 1, 2], [10, 2, 1], [11, 1, 1], [12, 0, 4]];
const VERSE = [[0, 2, 3], [6, 1, 2], [10, 0, 3]];
const B808 = {
  drop: [[0, 0, 3], [3, 0, 3], [6, 12, 2, 1], [8, 0, 2], [10, 0, 2], [11, 7, 1, 1], [12, 0, 4]],
  verse: [[0, 0, 6], [6, 0, 4], [10, 12, 2, 1], [12, 0, 4]],
};
const sec = (b) => (b < 8 ? "intro" : b < 12 ? "build" : b < 28 ? "drop" : b < 44 ? "verse" : b < 48 ? "build" : b < 64 ? "drop" : "outro");

let prev808 = null;
for (let b = 0; b < BARS; b++) {
  const t0 = b * BAR, s = sec(b), c = b % 4, at = (step) => t0 + step * S16;
  const drop = s === "drop", lastOfSec = sec(b + 1) !== s;
  const fade = s === "outro" ? 1 - (b - 64) / 8 : 1;

  // sustained supersaw chords: pumping under the drop, filtered in the intro / build
  if (s !== "verse") {
    const cut = s === "intro" ? 500 + 120 * b : s === "build" ? 1500 + 900 * (b % 4) : s === "outro" ? 1800 : 3500;
    const [pl, pr] = CH[c].map((n) => supersaw(n - 12, BAR, { cutoff: cut, drive: 2, attack: 0.02, release: 0.1 })).reduce(([al, ar], [l, r]) => [al.map((v, i) => v + l[i]), ar.map((v, i) => v + r[i])]);
    addLR(pl, pr, t0, (drop ? 0.09 : 0.075) * fade, 0.25);
  }

  // the lead hook: plays everywhere except the verse, which gets a sparse version
  const notes = s === "verse" ? VERSE : c === 3 ? HOOK_END : HOOK;
  const lg = { intro: 0.15, build: 0.17, drop: 0.22, verse: 0.13, outro: 0.16 }[s] * fade;
  const lcut = s === "intro" ? 900 + 250 * b : s === "build" ? 2500 + 1200 * (b % 4) : 7000;
  for (const [st, idx, len] of notes) {
    if (lastOfSec && s !== "outro" && st >= 14) continue;
    const m = idx === 3 ? CH[c][0] + 12 : CH[c][idx];
    const [l, r] = supersaw(m, len * S16 * 0.85, { cutoff: lcut, drive: 5 });
    addLR(l, r, at(st), lg, 0.3);
    const i0 = Math.round(at(st) * SR); // echo the lead's mid through the delay only
    for (let k = 0; k < l.length && i0 + k < N; k++) DLY[i0 + k] += (l[k] + r[k]) * 0.5 * lg * 0.25;
    if (drop) { const [l2, r2] = supersaw(m - 12, len * S16 * 0.85, { cutoff: 2500, drive: 6 }); addLR(l2, r2, at(st), lg * 0.55, 0.1); }
  }

  // 808 + kick (+ sidechain)
  const pat = drop ? B808.drop : s === "verse" ? B808.verse : null;
  if (pat) for (const [st, off, len, slide] of pat) {
    if (lastOfSec && st >= 14) continue;
    const m = ROOT[c] + off;
    add(e808(m, len * S16, slide ? prev808 : null), at(st), 0.34);
    if (!slide) { add(KICK, at(st), 0.42); duck(at(st)); }
    prev808 = m;
  }
  // four-on-the-floor kick ramps the builds
  if (s === "build") for (let st = 0; st < 16; st += b % 4 === 3 ? 2 : 4) { add(KICK, at(st), 0.36); duck(at(st), 0.5); }

  if (drop || s === "verse") {
    add(CLAP, at(8), 0.4, { rev: 0.3 }); add(SNARE, at(8), 0.18);
    if (drop && b % 2) add(CLAP, at(14), 0.18, { pan: -0.2, rev: 0.3 });
    // 16th hats with rolls: triplets / 32nds / a 64th stutter on rotating bars
    const hats = [];
    const roll = b % 4 === 1 ? 6 : b % 4 === 3 ? 8 : 0;
    for (let st = 0; st < 16; st++) if (!(roll && st >= 12)) hats.push([st * S16, st % 2 ? 0.5 : 1]);
    for (let k = 0; k < roll; k++) hats.push([12 * S16 + (k * 4 * S16) / roll, 0.4 + (0.6 * k) / roll]);
    if (drop && b % 8 === 6) for (let k = 0; k < 8; k++) hats.push([6 * S16 + (k * S16) / 4, 0.5]);
    for (const [t, g] of hats) if (!(lastOfSec && t >= 14 * S16)) add(HAT, t0 + t, 0.1 * g, { pan: 0.3 });
    if (drop) { add(OHAT, at(2), 0.05, { pan: -0.3 }); add(OHAT, at(10), 0.05, { pan: -0.3 }); }
  }

  // builds: snare roll accelerating, riser, silence, then an impact on the drop
  if (s === "build") {
    const div = [4, 2, 1, 0.5][b % 4];
    for (let st = 0; st < 16; st += div) if (!(b % 4 === 3 && st >= 14)) add(SNARE, at(st), 0.1 + 0.25 * ((b % 4) / 4 + st / 64), { rev: 0.3 });
    if (b % 4 === 0) add(RISER(4 * BAR - 2 * S16), t0, 0.07, { rev: 0.4 });
  }
  if (lastOfSec && sec(b + 1) === "drop") add(IMPACT, (b + 1) * BAR, 0.4, { rev: 0.5 });
}

// ---- effects: stereo reverb, 3/16 ping-pong delay ----
function reverb(x, combs, aps) {
  const out = new Float32Array(x.length);
  for (const d of combs) { const buf = new Float32Array(d); let j = 0, z = 0; for (let i = 0; i < x.length; i++) { const y = buf[j]; z = y * 0.5 + z * 0.5; buf[j] = x[i] + z * 0.84; j = (j + 1) % d; out[i] += y; } }
  for (const d of aps) { const buf = new Float32Array(d); let j = 0; for (let i = 0; i < x.length; i++) { const v = buf[j], y = -out[i] * 0.5 + v; buf[j] = out[i] + v * 0.5; j = (j + 1) % d; out[i] = y; } }
  return out;
}
const rl = reverb(REV, [1557, 1617, 1491, 1422, 1277], [556, 441]), rr = reverb(REV, [1580, 1640, 1514, 1445, 1300], [579, 464]);
const dt = Math.round(3 * S16 * SR), dl = new Float32Array(N), dr = new Float32Array(N);
const dsend = lp(hp(DLY), 4000);
for (let i = dt; i < N; i++) { dl[i] = dsend[i - dt] + dr[i - dt] * 0.4; dr[i] = dl[i - dt]; }

// ---- master: pump the synths, drive the whole thing, normalize, write ----
const n = Math.ceil((BARS * BAR + 3) * SR);
const outL = new Float32Array(n), outR = new Float32Array(n);
let pk = 0;
for (let i = 0; i < n; i++) {
  const tail = i > BARS * BAR * SR ? Math.max(0, 1 - (i - BARS * BAR * SR) / (3 * SR)) : 1;
  const d = DUCK[i];
  outL[i] = Math.tanh((HL[i] + (SL[i] + rl[i] * 0.12 + dl[i] * 0.3) * d) * 1.8) * tail;
  outR[i] = Math.tanh((HR[i] + (SR_[i] + rr[i] * 0.12 + dr[i] * 0.3) * d) * 1.8) * tail;
  pk = Math.max(pk, Math.abs(outL[i]), Math.abs(outR[i]));
}
const pcm = Buffer.alloc(44 + n * 4);
pcm.write("RIFF", 0); pcm.writeUInt32LE(36 + n * 4, 4); pcm.write("WAVEfmt ", 8); pcm.writeUInt32LE(16, 16); pcm.writeUInt16LE(1, 20); pcm.writeUInt16LE(2, 22);
pcm.writeUInt32LE(SR, 24); pcm.writeUInt32LE(SR * 4, 28); pcm.writeUInt16LE(4, 32); pcm.writeUInt16LE(16, 34); pcm.write("data", 36); pcm.writeUInt32LE(n * 4, 40);
for (let i = 0; i < n; i++) { pcm.writeInt16LE(Math.round((outL[i] / pk) * 0.95 * 32767), 44 + i * 4); pcm.writeInt16LE(Math.round((outR[i] / pk) * 0.95 * 32767), 46 + i * 4); }

const dir = path.join(HERE, "renders");
mkdirSync(dir, { recursive: true });
const wav = path.join(dir, "blood-rage-type-beat.wav");
writeFileSync(wav, pcm);
console.log(`wrote ${wav} (${(n / SR).toFixed(1)}s)`);
try {
  execFileSync("ffmpeg", ["-y", "-v", "error", "-i", wav, "-af", "loudnorm=I=-8:TP=-0.8:LRA=8", "-ar", "44100", "-b:a", "320k", path.join(dir, "blood-rage-type-beat.mp3")]);
  console.log("wrote blood-rage-type-beat.mp3");
} catch { console.log("ffmpeg not found, skipped mp3"); }
