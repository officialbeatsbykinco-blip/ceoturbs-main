// "BLOOD": an original dark trap type beat, 142 BPM, F minor, synthesized from scratch (no samples).
//   node blood.mjs   → renders/blood-type-beat.wav and .mp3 (mp3 needs ffmpeg)
// Form: intro 8 · hook 16 · verse 16 · hook 16 · bridge 8 · outro 8 bars.
import { mkdirSync, writeFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const SR = 44100, BPM = 142, BEAT = 60 / BPM, BAR = 4 * BEAT, S16 = BEAT / 4, BARS = 72;
const N = Math.ceil((BARS * BAR + 5) * SR);
const L = new Float32Array(N), R = new Float32Array(N), REV = new Float32Array(N), DLY = new Float32Array(N);

let seed = 1312;
const rand = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296);
const mtof = (m) => 440 * 2 ** ((m - 69) / 12);
const mk = (d, f) => { const o = new Float32Array(Math.floor(d * SR)); for (let i = 0; i < o.length; i++) o[i] = f(i / SR, i); return o; };
const noise = (d) => mk(d, () => rand() * 2 - 1);
const hp = (x) => { const o = new Float32Array(x.length); let p = 0; for (let i = 0; i < x.length; i++) { o[i] = x[i] - p; p = x[i]; } return o; };
const lp = (x, fc) => { const a = 1 - Math.exp((-2 * Math.PI * fc) / SR); let y = 0; return x.map((v) => (y += a * (v - y))); };
const env = (x, f) => x.map((v, i) => v * f(i / SR));

// place a mono sound: pan -1..1, rev/dly = send amounts
const add = (sig, t, g = 1, { pan = 0, rev = 0, dly = 0 } = {}) => {
  const i0 = Math.round(t * SR), gl = g * Math.cos(((pan + 1) * Math.PI) / 4) * Math.SQRT2, gr = g * Math.sin(((pan + 1) * Math.PI) / 4) * Math.SQRT2;
  for (let k = 0; k < sig.length; k++) { const i = i0 + k; if (i < 0 || i >= N) continue; const s = sig[k]; L[i] += s * gl; R[i] += s * gr; REV[i] += s * g * rev; DLY[i] += s * g * dly; }
};
const addLR = (sl, sr, t, g, rev = 0) => {
  const i0 = Math.round(t * SR);
  for (let k = 0; k < sl.length; k++) { const i = i0 + k; if (i >= N) break; L[i] += sl[k] * g; R[i] += sr[k] * g; REV[i] += (sl[k] + sr[k]) * 0.5 * g * rev; }
};

// ---- instruments ----
const KICK = (() => { let ph = 0; const body = mk(0.32, (t) => { ph += (2 * Math.PI * (48 + 120 * Math.exp(-t * 38))) / SR; return Math.tanh(Math.sin(ph) * 2) * Math.exp(-t * 11); }); const click = env(hp(noise(0.006)), (t) => Math.exp(-t * 600)); for (let i = 0; i < click.length; i++) body[i] += click[i] * 0.5; return body; })();
const SNARE = (() => { const n = env(lp(hp(noise(0.3)), 7000), (t) => Math.exp(-t * 16)); let ph = 0; const tone = mk(0.3, (t) => { ph += (2 * Math.PI * (190 + 60 * Math.exp(-t * 40))) / SR; return Math.sin(ph) * Math.exp(-t * 22); }); return n.map((v, i) => v * 0.9 + tone[i] * 0.6); })();
const CLAP = (() => { const o = new Float32Array(Math.floor(0.35 * SR)); for (const off of [0, 0.011, 0.023]) { const b = env(hp(hp(noise(0.33))), (t) => Math.exp(-t * (off < 0.02 ? 70 : 13))); const i0 = Math.floor(off * SR); for (let k = 0; k + i0 < o.length && k < b.length; k++) o[k + i0] += b[k]; } return o; })();
const HAT = env(hp(hp(hp(noise(0.05)))), (t) => Math.exp(-t * 70));
const OHAT = env(hp(hp(hp(noise(0.4)))), (t) => Math.exp(-t * 7));
const RISER = (d) => { const x = hp(noise(d)); return x.map((v, i) => v * (i / x.length) ** 2.5); };

// 808 with punch on a fresh hit, glide when it slides from the previous note
function e808(m, dur, from) {
  const f1 = mtof(m), f0 = from == null ? f1 : mtof(from);
  let ph = 0;
  const dec = Math.exp(-dur * 0.7);
  return mk(dur + 0.04, (t) => {
    const f = (from == null ? f1 * (1 + 1.5 * Math.exp(-t * 55)) : f0 + (f1 - f0) * Math.min(t / 0.08, 1));
    ph += (2 * Math.PI * f) / SR;
    const a = Math.min(t / 0.003, 1) * (t < dur ? Math.exp(-t * 0.7) : dec * Math.max(0, 1 - (t - dur) / 0.04));
    return Math.tanh(Math.sin(ph) * a * 2.6) / Math.tanh(2.6);
  });
}

// dark FM bell with a sine body underneath
const bell = (m, d = 1.5) => { const f = mtof(m); return mk(d, (t) => (Math.sin(2 * Math.PI * f * t + 1.9 * Math.exp(-t * 5) * Math.sin(2 * Math.PI * f * 2 * t)) * 0.8 + 0.35 * Math.sin(Math.PI * f * t)) * Math.exp(-t * 2.6) * Math.min(t / 0.002, 1)); };

// wide choir-ish pad: detuned saws, darkened
const padVoice = (m, d, cents) => { const f = mtof(m) * 2 ** (cents / 1200); let ph = rand(); return mk(d, (t) => { ph = (ph + f / SR) % 1; return (2 * ph - 1) * Math.min(t / 0.9, 1, (d - t) / 0.5); }); };
function pad(notes, d) {
  const mix = (cents) => { const o = new Float32Array(Math.floor(d * SR)); for (const n of notes) for (const c of cents) { const v = padVoice(n, d, c); for (let i = 0; i < o.length; i++) o[i] += v[i]; } return lp(lp(o, 900), 900); };
  return [mix([-9, 4]), mix([9, -4])];
}

// ---- music ----
// Fm · Db · Bbm · C (harmonic-minor V for the sinister lift), two bars each
const CH = [[77, 80, 84], [73, 77, 80], [70, 73, 77], [72, 76, 79]];
const ROOT = [29, 37, 34, 36];
// bell motif over two bars: [step, chord tone index] (3 = root an octave up)
const MOTIF = [[[0, 2], [3, 1], [6, 0], [10, 1], [12, 2]], [[0, 3], [3, 2], [6, 1], [8, 2], [11, 1], [14, 0]]];
// 808 patterns: [step, semitones over root, length in steps, slide?]
const B808 = {
  hookA: [[0, 0, 3], [3, 0, 3], [7, 0, 3], [10, 0, 2], [12, 12, 2, 1], [14, 7, 2, 1]],
  hookB: [[0, 0, 5], [6, 0, 4], [10, 0, 2], [12, 3, 4, 1]],
  verse: [[0, 0, 6], [7, 0, 3], [10, 0, 6]],
  bridge: [[0, 0, 15]],
};
const sec = (b) => (b < 8 ? "intro" : b < 24 ? "hook" : b < 40 ? "verse" : b < 56 ? "hook2" : b < 64 ? "bridge" : "outro");

let prev808 = null;
for (let b = 0; b < BARS; b++) {
  const t0 = b * BAR, s = sec(b), c = (b >> 1) % 4, second = b % 2, at = (step) => t0 + step * S16;
  const drums = s === "hook" || s === "verse" || s === "hook2";
  const drop = b === 7 || b === 23 || b === 39 || b === 55; // last two 16ths go silent before a section lands
  const fade = s === "outro" ? 1 - (b - 64) / 8 : 1;

  if (!second) { const [pl, pr] = pad([...CH[c].map((n) => n - 24), ROOT[c] + 24], 2 * BAR); addLR(pl, pr, t0, 0.028 * fade * (s === "intro" ? 0.7 : 1), 0.6); }

  // bells: muffled in the intro, a touch softer under the verse, doubled an octave up in hook 2
  const bg = { intro: 0.3, hook: 0.36, verse: 0.25, hook2: 0.36, bridge: 0.3, outro: 0.32 }[s] * fade;
  for (const [st, idx] of MOTIF[second]) {
    if (drop && st >= 14) continue;
    const m = idx === 3 ? CH[c][0] + 12 : CH[c][idx];
    const pan = st % 2 ? 0.3 : -0.3;
    add(s === "intro" ? lp(bell(m), 1100) : bell(m), at(st), bg, { pan, rev: 0.45, dly: 0.35 });
    if (s === "hook2") add(bell(m + 12, 0.9), at(st), bg * 0.28, { pan: -pan, rev: 0.5 });
  }

  // 808 + kick
  const pat = s === "bridge" ? B808.bridge : drums ? (s === "verse" ? B808.verse : second ? B808.hookB : B808.hookA) : null;
  if (pat) for (const [st, off, len, slide] of pat) {
    if (drop && st >= 14) continue;
    const m = ROOT[c] + off;
    add(e808(m, len * S16, slide ? prev808 : null), at(st), s === "bridge" ? 0.28 : 0.38);
    if (!slide && s !== "bridge") add(KICK, at(st), 0.42);
    prev808 = m;
  }

  if (drums) {
    // clap + snare on 3, ghost clap at the end of every 4th bar in the hooks
    add(SNARE, at(8), 0.3, { rev: 0.2 }); add(CLAP, at(8), 0.32, { rev: 0.35 });
    if (s !== "verse" && b % 4 === 3 && !drop) add(CLAP, at(15), 0.12, { pan: 0.2, rev: 0.4 });

    // hats: 16ths in the hooks (triplet / 32nd rolls on odd bars), 8ths in the verse
    const hats = [];
    for (let st = 0; st < 16; st += s === "verse" ? 2 : 1) hats.push([st * S16, st % 2 ? 0.55 : 1]);
    if (b % 2) {
      const roll = s === "verse" ? 2 : 4, start = 16 - roll, n = b % 4 === 1 ? roll * 1.5 : roll * 2;
      hats.splice(0, hats.length, ...hats.filter(([t]) => t < start * S16));
      for (let k = 0; k < n; k++) hats.push([start * S16 + (k * roll * S16) / n, 0.45 + (0.55 * k) / n]);
    }
    for (const [t, g] of hats) if (!(drop && t >= 14 * S16)) add(HAT, t0 + t, 0.11 * g, { pan: 0.25 });
    if (s !== "verse" && !second) add(OHAT, at(6), 0.05, { pan: -0.2, rev: 0.2 });
  }

  // bridge builds back up: 8th hats, then a snare roll into the outro
  if (s === "bridge" && b >= 60) {
    for (let st = 0; st < 16; st += 2) add(HAT, at(st), 0.08, { pan: 0.25 });
    if (b === 63) for (let st = 0; st < 14; st++) add(SNARE, at(st), 0.08 + (0.22 * st) / 14, { rev: 0.3 });
  }
  if (drop) add(RISER(BAR), t0, 0.06, { rev: 0.3 });
}

// ---- effects: stereo reverb (comb + allpass), dotted-8th ping-pong delay ----
function reverb(x, combs, aps) {
  const out = new Float32Array(x.length);
  for (const d of combs) { const buf = new Float32Array(d); let j = 0, z = 0; for (let i = 0; i < x.length; i++) { const y = buf[j]; z = y * 0.55 + z * 0.45; buf[j] = x[i] + z * 0.86; j = (j + 1) % d; out[i] += y; } }
  for (const d of aps) { const buf = new Float32Array(d); let j = 0; for (let i = 0; i < x.length; i++) { const v = buf[j], y = -out[i] * 0.5 + v; buf[j] = out[i] + v * 0.5; j = (j + 1) % d; out[i] = y; } }
  return out;
}
const rl = reverb(REV, [1557, 1617, 1491, 1422, 1277], [556, 441]), rr = reverb(REV, [1580, 1640, 1514, 1445, 1300], [579, 464]);
const dt = Math.round(0.75 * BEAT * SR), dl = new Float32Array(N), dr = new Float32Array(N);
const dsend = lp(DLY, 3500);
for (let i = dt; i < N; i++) { dl[i] = dsend[i - dt] + dr[i - dt] * 0.42; dr[i] = dl[i - dt]; }

// ---- master: sum, soft clip, normalize, write ----
const n = Math.ceil((BARS * BAR + 3) * SR);
const outL = new Float32Array(n), outR = new Float32Array(n);
let pk = 0;
for (let i = 0; i < n; i++) {
  const tail = i > BARS * BAR * SR ? Math.max(0, 1 - (i - BARS * BAR * SR) / (3 * SR)) : 1;
  outL[i] = Math.tanh((L[i] + rl[i] * 0.14 + dl[i] * 0.45) * 1.25) * tail;
  outR[i] = Math.tanh((R[i] + rr[i] * 0.14 + dr[i] * 0.45) * 1.25) * tail;
  pk = Math.max(pk, Math.abs(outL[i]), Math.abs(outR[i]));
}
const pcm = Buffer.alloc(44 + n * 4);
pcm.write("RIFF", 0); pcm.writeUInt32LE(36 + n * 4, 4); pcm.write("WAVEfmt ", 8); pcm.writeUInt32LE(16, 16); pcm.writeUInt16LE(1, 20); pcm.writeUInt16LE(2, 22);
pcm.writeUInt32LE(SR, 24); pcm.writeUInt32LE(SR * 4, 28); pcm.writeUInt16LE(4, 32); pcm.writeUInt16LE(16, 34); pcm.write("data", 36); pcm.writeUInt32LE(n * 4, 40);
for (let i = 0; i < n; i++) { pcm.writeInt16LE(Math.round((outL[i] / pk) * 0.95 * 32767), 44 + i * 4); pcm.writeInt16LE(Math.round((outR[i] / pk) * 0.95 * 32767), 46 + i * 4); }

const dir = path.join(HERE, "renders");
mkdirSync(dir, { recursive: true });
const wav = path.join(dir, "blood-type-beat.wav");
writeFileSync(wav, pcm);
console.log(`wrote ${wav} (${(n / SR).toFixed(1)}s)`);
try {
  execFileSync("ffmpeg", ["-y", "-v", "error", "-i", wav, "-af", "loudnorm=I=-10:TP=-1:LRA=9", "-ar", "44100", "-b:a", "320k", path.join(dir, "blood-type-beat.mp3")]);
  console.log("wrote blood-type-beat.mp3");
} catch { console.log("ffmpeg not found, skipped mp3"); }
