// Renders every ad built by build.mjs to ads/hyperframes/out/<id>.mp4 with the HyperFrames CLI.
// Uses Chromium from PLAYWRIGHT_BROWSERS_PATH / HYPERFRAMES_BROWSER_PATH when set; otherwise
// HyperFrames finds or downloads Chrome itself (npx hyperframes browser ensure).
import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { ADS } from "./build.mjs";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const env = { ...process.env, HYPERFRAMES_NO_TELEMETRY: "1", DO_NOT_TRACK: "1" };
if (!env.HYPERFRAMES_BROWSER_PATH && env.PLAYWRIGHT_BROWSERS_PATH && existsSync(env.PLAYWRIGHT_BROWSERS_PATH)) {
  const shell = readdirSync(env.PLAYWRIGHT_BROWSERS_PATH).find((d) => d.startsWith("chromium_headless_shell"));
  const bin = shell && path.join(env.PLAYWRIGHT_BROWSERS_PATH, shell, "chrome-linux", "headless_shell");
  if (bin && existsSync(bin)) env.HYPERFRAMES_BROWSER_PATH = bin;
}
mkdirSync(path.join(HERE, "out"), { recursive: true });
const only = process.argv.slice(2);
for (const ad of ADS.filter((a) => !only.length || only.includes(a.id))) {
  console.log(`\n▶ ${ad.id}`);
  const r = spawnSync("npx", ["--yes", "hyperframes@0.8.157", "render", "-o", path.join(HERE, "out", `${ad.id}.mp4`), "--quality", "high"], { cwd: path.join(HERE, ad.id), env, stdio: "inherit" });
  if (r.status !== 0) process.exit(r.status ?? 1);
}
