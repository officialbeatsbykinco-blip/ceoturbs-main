// Pushes every URL in the built sitemap to IndexNow (Bing, Yandex, Seznam, Naver…).
// Run after each deploy:  npm run build && (deploy) && npm run indexnow
// The key file public/<KEY>.txt must be live at https://www.ceoturbo.com/<KEY>.txt first.
import { readFile } from "node:fs/promises";

const KEY = "e46cbbfd6a1fe7d283a53bbc1282109d";
// Must match the host in the sitemap URLs exactly (www), or IndexNow rejects the batch.
const HOST = "www.ceoturbo.com";

const xml = await readFile("dist/sitemap.xml", "utf8");
const urlList = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1]);

const res = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify({ host: HOST, key: KEY, keyLocation: `https://${HOST}/${KEY}.txt`, urlList }),
});

console.log(`IndexNow: submitted ${urlList.length} URLs → HTTP ${res.status} ${res.statusText}`);
if (res.status >= 400) process.exitCode = 1;
