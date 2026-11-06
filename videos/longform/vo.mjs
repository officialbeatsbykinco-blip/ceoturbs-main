// Voices every narration line of a long-form video with the local Kokoro model, 4 at a time.
// One sentence per file so captions and animation land exactly on the words.
// Cached by voice + speed + text, so editing one line only re-voices that line.
//   node vo.mjs stop-asking
import { existsSync, mkdirSync } from "node:fs";
import { spawn } from "node:child_process";
import { createHash } from "node:crypto";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const TTS = path.join(os.homedir(), ".cache/hyperframes/tts");

// af_heart is Kokoro's warmest, least robotic voice; a touch under 1.0 keeps it relaxed.
export const VOICE = ["af_heart", 0.93];

export const voPath = (ep, raw) => {
  const line = typeof raw === "string" ? { t: raw } : raw;
  const [voice, speed] = VOICE;
  const key = createHash("sha1").update(`${voice}|${speed}|${line.say ?? line.t}`).digest("hex").slice(0, 12);
  return path.join(HERE, "vo", ep, `${key}.wav`);
};

async function main() {
  const ep = process.argv[2] || "stop-asking";
  const { SCENES } = await import(`./${ep}.mjs`);
  mkdirSync(path.join(HERE, "vo", ep), { recursive: true });
  const jobs = SCENES.flatMap((s) => s.lines).map((l) => (typeof l === "string" ? { t: l } : l)).filter((l) => !existsSync(voPath(ep, l)));
  console.log(`${jobs.length} lines to voice`);
  const [voice, speed] = VOICE;
  const run = (l) =>
    new Promise((ok, fail) => {
      const args = [path.join(TTS, "synth-v3.py"), path.join(TTS, "models/kokoro-v1.0.onnx"), path.join(TTS, "voices/voices-v1.0.bin"), l.say ?? l.t, voice, String(speed), voPath(ep, l), "en-us"];
      const p = spawn("python3", args, { stdio: "ignore" });
      p.on("exit", (c) => (c ? fail(new Error(`tts failed: ${l.t}`)) : ok()));
    });
  let i = 0;
  await Promise.all(Array.from({ length: 4 }, async () => { while (i < jobs.length) { const l = jobs[i++]; await run(l); console.log(`✓ ${l.t}`); } }));
}

if (process.argv[1] === fileURLToPath(import.meta.url)) await main();
