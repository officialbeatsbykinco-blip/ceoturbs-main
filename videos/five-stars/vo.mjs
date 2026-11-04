// Generates every voice line of an episode with the local Kokoro model (hyperframes tts), 4 at a time.
// Cached by voice + speed + text, so editing one line only re-voices that line.
//   node vo.mjs ep1        (HF_BIN=/path/to/hyperframes to skip npx)
import { existsSync, mkdirSync } from "node:fs";
import { spawn } from "node:child_process";
import { createHash } from "node:crypto";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));

export const VOICES = {
  narr: ["bm_george", 0.95],
  dale: ["am_michael", 1.0],
  okafor: ["bf_isabella", 0.92],
  juno: ["af_sky", 1.0],
  gary: ["am_adam", 1.0],
  banker: ["am_adam", 0.9],
  customer: ["af_heart", 1.0],
  brenda: ["af_heart", 1.08],
  driver: ["af_nova", 0.88],
  frank: ["am_adam", 1.08],
  mayor: ["am_adam", 0.85],
  chorus: ["af_nova", 1.05],
  halo: ["bf_emma", 0.95],
};

export const voPath = (ep, line) => {
  const [voice, speed] = VOICES[line.who];
  const key = createHash("sha1").update(`${voice}|${speed}|${line.say ?? line.t}`).digest("hex").slice(0, 12);
  return path.join(HERE, "vo", ep, `${line.who}-${key}.wav`);
};

async function main() {
  const ep = process.argv[2] || "ep1";
  const { SHOTS } = await import(`./${ep}.mjs`);
  mkdirSync(path.join(HERE, "vo", ep), { recursive: true });
  const jobs = SHOTS.flatMap((s) => s.lines.filter((l) => l.who)).filter((l) => !existsSync(voPath(ep, l)));
  console.log(`${jobs.length} lines to voice`);
  const bin = process.env.HF_BIN;
  const run = (l) =>
    new Promise((ok, fail) => {
      const [voice, speed] = VOICES[l.who];
      const args = ["tts", l.say ?? l.t, "-v", voice, "-s", String(speed), "-o", voPath(ep, l)];
      const p = bin ? spawn(bin, args, { stdio: "ignore" }) : spawn("npx", ["--yes", "hyperframes@0.8.157", ...args], { stdio: "ignore" });
      p.on("exit", (c) => (c ? fail(new Error(`tts failed: ${l.t}`)) : ok()));
    });
  let i = 0;
  await Promise.all(Array.from({ length: 4 }, async () => { while (i < jobs.length) { const l = jobs[i++]; await run(l); console.log(`✓ ${l.who}: ${l.t}`); } }));
}

if (process.argv[1] === fileURLToPath(import.meta.url)) await main();
