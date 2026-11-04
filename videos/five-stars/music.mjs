// Original score + sound effects for FIVE STARS, synthesized from scratch (no samples, no licensing).
// synthBed(cues, sfx, total, out): cues = [{ t, n: mood }] (one per shot), sfx = [{ t, n: effect }].
import { writeFileSync } from "node:fs";

const SR = 44100;

export function synthBed(cues, sfx, total, out) {
  const N = Math.ceil(total * SR) + SR;
  const y = new Float32Array(N);
  let seed = 77;
  const rand = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296);
  const noise = (d) => Float32Array.from({ length: Math.floor(d * SR) }, () => rand() * 2 - 1);
  const mk = (d, f) => Float32Array.from({ length: Math.floor(d * SR) }, (_, i) => f(i / SR, i));
  const env = (t, a, dec) => Math.min(t / a, 1) * Math.exp(-t * dec);
  const add = (buf, sig, t, g = 1) => { const i0 = Math.floor(t * SR); for (let k = 0; k < sig.length; k++) { const i = i0 + k; if (i >= 0 && i < buf.length) buf[i] += sig[k] * g; } };
  const sine = (f, d, dec = 5, a = 0.004) => mk(d, (t) => Math.sin(2 * Math.PI * f * t) * env(t, a, dec));
  const saw = (f, d, dec = 6) => mk(d, (t) => (2 * ((f * t) % 1) - 1) * env(t, 0.003, dec));
  const sweep = (f0, f1, d, dec = 3) => { let ph = 0; return mk(d, (t) => { ph += (2 * Math.PI * (f0 + (f1 - f0) * (t / d))) / SR; return Math.sin(ph) * env(t, 0.004, dec); }); };
  const lp = (x, k) => { const o = new Float32Array(x.length); let s = 0; for (let i = 0; i < x.length; i++) { s += x[i]; if (i >= k) s -= x[i - k]; o[i] = s / k; } return o; };
  const hp = (x) => { const o = new Float32Array(x.length); for (let i = 1; i < x.length; i++) o[i] = x[i] - x[i - 1]; return o; };
  const shape = (x, f) => Float32Array.from(x, (v, i) => v * f(i / SR, i / x.length));
  const pad = (fs, d, g) => mk(d, (t) => fs.reduce((s, f) => s + Math.sin(2 * Math.PI * f * t) + 0.3 * Math.sin(2 * Math.PI * f * 2.003 * t), 0) / fs.length * Math.min(t / 1.5, 1, (d - t) / 1.5) * g);

  // ---- music, one section per run of equal cues ----
  const secs = [];
  for (const c of cues) { if (secs.length && secs.at(-1).n === c.n) continue; secs.push({ ...c }); }
  secs.forEach((s, i) => (s.e = i + 1 < secs.length ? secs[i + 1].t : total));
  const C = [261.6, 293.7, 329.6, 349.2, 392, 440, 493.9];
  for (const s of secs) {
    const d = s.e - s.t;
    const b = new Float32Array(Math.ceil((d + 2) * SR));
    if (s.n === "quirky") {
      const beat = 0.6, arp = [0, 2, 4, 2, 5, 4, 2, 4];
      for (let k = 0; k * beat / 2 < d; k++) {
        const t = (k * beat) / 2, bar = (k / 8) | 0, root = [0, 3, 4, 3][bar % 4];
        add(b, sine(C[(root + arp[k % 8]) % 7] * 2, 0.22, 18), t, 0.11);
        if (k % 4 === 0) add(b, sine(C[root] / 2, 0.4, 7), t, 0.22);
        if (k % 2) add(b, hp(noise(0.03)).map((v, i) => v * Math.exp(-i / SR * 90)), t, 0.04);
      }
    } else if (s.n === "montage") {
      const beat = 0.5, prog = [110, 87.3, 98, 82.4], arpN = [1, 1.5, 2, 3, 2, 1.5, 2, 1.5];
      for (let k = 0; k * beat < d; k++) {
        const t = k * beat, root = prog[((k / 4) | 0) % 4];
        add(b, sweep(150, 45, 0.22, 12), t, 0.4); add(b, hp(noise(0.05)).map((v, i) => v * Math.exp(-i / SR * 80)), t + beat / 2, 0.06);
        if (k % 2) add(b, shape(hp(noise(0.14)), (tt) => Math.exp(-tt * 28)), t, 0.09);
        add(b, sine(root, 0.45, 6), t, 0.18);
        for (let j = 0; j < 2; j++) add(b, sine(root * 4 * arpN[(k * 2 + j) % 8], 0.18, 16), t + (j * beat) / 2, 0.06);
      }
    } else if (s.n === "regal") {
      const beat = 0.66, D = [293.7, 370, 440, 587.3, 440, 370];
      for (let k = 0; k * beat / 2 < d; k++) { const t = (k * beat) / 2; add(b, saw(D[k % 6], 0.25, 14), t, 0.05); if (k % 8 === 0) add(b, sine(1174.7, 1.6, 2.5), t, 0.07); if (k % 4 === 0) add(b, sine(146.8, 0.6, 5), t, 0.2); }
    } else if (s.n === "tense") {
      add(b, mk(d, (t) => (Math.sin(2 * Math.PI * 55 * t) + 0.6 * Math.sin(2 * Math.PI * 82.4 * t)) * (0.6 + 0.4 * Math.sin(2 * Math.PI * 0.5 * t)) * Math.min(t / 1, 1)), 0, 0.12);
      for (let t = 0; t < d; t += 0.5) add(b, sine(t % 1 ? 1800 : 2400, 0.03, 120), t, 0.06);
    } else if (s.n === "night") {
      add(b, pad([220, 261.6, 329.6], d, 0.07), 0, 1);
      const box = [880, 1046.5, 1318.5, 1568, 1760];
      for (let t = 0.4, k = 0; t < d; t += 1.2, k++) add(b, sine(box[(k * 3) % 5], 1.0, 4), t, 0.05);
    } else if (s.n === "eerie") {
      add(b, mk(d, (t) => (Math.sin(2 * Math.PI * 49 * t) + Math.sin(2 * Math.PI * 49.6 * t) + 0.5 * Math.sin(2 * Math.PI * 73.4 * t)) * Math.min(t / 2, 1, (d - t) / 1)), 0, 0.07);
      const mel = [659.3, 622.3, 659.3, 493.9, 587.3, 523.3, 440];
      for (let t = 0.3, k = 0; t < d; t += 0.9, k++) add(b, sine(mel[k % 7] * 2, 1.2, 3.5), t, 0.035);
      for (let t = 2; t < d; t += 4) { add(b, sweep(70, 40, 0.18, 14), t, 0.25); add(b, sweep(70, 40, 0.18, 14), t + 0.28, 0.18); }
    } else if (s.n === "riser") {
      add(b, shape(hp(noise(d)), (_, p) => p ** 2), 0, 0.12); add(b, mk(d, (t) => Math.sin(2 * Math.PI * (100 + 900 * (t / d) ** 2) * t) * (t / d) ** 2), 0, 0.08);
    } else if (s.n === "title") {
      add(b, pad([130.8, 196, 261.6, 329.6], d, 0.12), 0, 1);
    }
    const f = 0.3 * SR;
    for (let i = 0; i < b.length; i++) { const g = Math.min(1, i / f, Math.max(0, (d * SR - i) / f)); y[Math.floor(s.t * SR) + i] += b[i] * g; }
  }

  // ---- sound effects ----
  const FX = {
    ding: (t) => { add(y, sine(1568, 0.6, 7), t, 0.18); add(y, sine(3136, 0.4, 9), t, 0.06); },
    buzz: (t) => add(y, mk(0.45, (tt) => Math.sign(Math.sin(2 * Math.PI * 140 * tt)) * (0.5 + 0.5 * Math.sign(Math.sin(2 * Math.PI * 14 * tt))) * env(tt, 0.01, 3)), t, 0.07),
    buzzes: (t) => { for (let k = 0; k < 18; k++) FX.buzz(t + rand() * 2.2); },
    boom: (t) => { add(y, sweep(90, 30, 1.6, 2.2), t, 0.6); add(y, shape(lp(noise(0.5), 30), (tt) => Math.exp(-tt * 6)), t, 0.5); },
    chime: (t) => { add(y, sine(1318.5, 1.4, 2.5), t, 0.16); add(y, sine(1046.5, 1.6, 2.2), t + 0.35, 0.16); },
    splat: (t) => { add(y, shape(lp(noise(0.35), 8), (tt) => Math.exp(-tt * 12)), t, 0.6); add(y, sweep(200, 60, 0.2, 14), t, 0.3); },
    thud: (t) => { add(y, sweep(120, 40, 0.3, 10), t, 0.5); add(y, shape(lp(noise(0.15), 20), (tt) => Math.exp(-tt * 30)), t, 0.4); },
    stamp: (t) => { add(y, sweep(140, 45, 0.3, 8), t, 0.5); add(y, shape(lp(noise(0.12), 14), (tt) => Math.exp(-tt * 30)), t, 0.35); },
    slam: (t) => { FX.boom(t); FX.stamp(t); },
    riser: (t) => add(y, shape(hp(noise(3)), (_, p) => p ** 2 * (p < 0.95 ? 1 : (1 - p) * 20)), t, 0.1),
    heart: (t) => { for (let k = 0; k < 3; k++) { add(y, sweep(70, 40, 0.18, 14), t + k * 0.8, 0.35); add(y, sweep(70, 40, 0.18, 14), t + k * 0.8 + 0.26, 0.25); } },
    whoosh: (t) => add(y, shape(hp(noise(0.45)), (_, p) => Math.sin(Math.PI * p) ** 2), t, 0.3),
    car: (t) => add(y, mk(1.8, (tt) => (Math.sin(2 * Math.PI * (60 + 40 * Math.exp(-tt * 2)) * tt) + 0.4 * (rand() - 0.5)) * Math.min(tt / 0.2, 1) * Math.exp(-tt * 1.2)), t, 0.2),
    van: (t) => add(y, mk(1.8, (tt) => (Math.sin(2 * Math.PI * 45 * tt) + 0.5 * Math.sin(2 * Math.PI * 90 * tt) + 0.3 * (rand() - 0.5)) * Math.sin(Math.PI * tt / 1.8)), t, 0.22),
    tap: (t) => { add(y, shape(hp(noise(0.03)), (tt) => Math.exp(-tt * 140)), t, 0.35); add(y, sine(2400, 0.08, 40), t, 0.15); },
    steps: (t) => { for (let k = 0; k < 6; k++) add(y, shape(lp(noise(0.07), 60), (tt) => Math.exp(-tt * 55)), t + k * 0.3, 0.3); },
    creak: (t) => add(y, mk(1.6, (tt) => Math.sin(2 * Math.PI * (300 + 120 * Math.sin(tt * 9)) * tt) * (0.5 + 0.5 * Math.sin(tt * 37)) * Math.sin(Math.PI * tt / 1.6)), t, 0.05),
  };
  for (const s of sfx) FX[s.n]?.(s.t);

  let pk = 0;
  for (let i = 0; i < N; i++) { y[i] = Math.tanh(y[i] * 1.2); pk = Math.max(pk, Math.abs(y[i])); }
  const n = Math.ceil(total * SR);
  const pcm = Buffer.alloc(44 + n * 2);
  pcm.write("RIFF", 0); pcm.writeUInt32LE(36 + n * 2, 4); pcm.write("WAVEfmt ", 8); pcm.writeUInt32LE(16, 16); pcm.writeUInt16LE(1, 20); pcm.writeUInt16LE(1, 22);
  pcm.writeUInt32LE(SR, 24); pcm.writeUInt32LE(SR * 2, 28); pcm.writeUInt16LE(2, 32); pcm.writeUInt16LE(16, 34); pcm.write("data", 36); pcm.writeUInt32LE(n * 2, 40);
  for (let i = 0; i < n; i++) pcm.writeInt16LE(Math.round((y[i] / (pk || 1)) * 0.9 * 32767), 44 + i * 2);
  writeFileSync(out, pcm);
}
