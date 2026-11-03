// Vector Google review counter stand (the supplier photo is only 620px wide), with a real QR code.
// Shared by the image ads (ads/youtube/build.mjs) and the HD shop images (scripts/review-card-hd.mjs).
// Expects assets/Inter.woff2 next to the HTML it is written into.
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const qrcode = require("qrcode-generator");

export function standHtml(url = "https://www.ceoturbo.com/google-review-cards") {
  const qr = qrcode(0, "M");
  qr.addData(url);
  qr.make();
  const n = qr.getModuleCount();
  let rects = "";
  for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) if (qr.isDark(r, c)) rects += `<rect x="${c}" y="${r}" width="1.02" height="1.02"/>`;
  const G = `<svg viewBox="0 0 48 48" width="100%" height="100%"><path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/><path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/><path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/><path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"/></svg>`;
  const star = `<svg viewBox="0 0 24 24" width="84" height="84"><path fill="#FBBC04" d="M12 1.8l3 6.9 7.5.7-5.7 5 1.7 7.3L12 17.8l-6.5 3.9 1.7-7.3-5.7-5 7.5-.7z"/></svg>`;
  const nfc = `<svg viewBox="0 0 120 120" width="170" height="170" fill="none" stroke="#0a1730" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"><rect x="44" y="18" width="48" height="84" rx="9" fill="#fff"/><path d="M60 26h16"/><text x="68" y="68" font-family="IN" font-weight="800" font-size="15" fill="#0a1730" stroke="none" text-anchor="middle">NFC</text><path d="M28 44a28 28 0 0 0 0 32"/><path d="M18 36a42 42 0 0 0 0 48"/><path d="M8 28a56 56 0 0 0 0 64" opacity=".6"/></svg>`;
  return `<!doctype html><meta charset="utf-8"><style>
@font-face{font-family:IN;src:url(assets/Inter.woff2);font-weight:100 900}
html,body{margin:0;width:1200px;height:1480px;background:transparent;overflow:hidden;font-family:IN,sans-serif}.stage{position:absolute;left:-110px;top:-70px;width:1400px;height:1600px}
.shadow{position:absolute;left:150px;top:1290px;width:1000px;height:130px;border-radius:50%;background:radial-gradient(closest-side,rgba(8,20,45,.32),transparent);filter:blur(10px)}
.base{position:absolute;left:150px;top:1180px;width:980px;height:170px;clip-path:polygon(9% 0,100% 0,93% 100%,0 100%);background:linear-gradient(180deg,#f7f9fc,#d5dfec);}
.base::after{content:"";position:absolute;left:0;right:0;bottom:0;height:26px;background:#bccadd}
.panel{position:absolute;left:230px;top:120px;width:900px;height:1110px;border-radius:40px;background:linear-gradient(140deg,#ffffff 0,#f6f8fc 60%,#eaf0f8 100%);box-shadow:inset 0 0 0 2px rgba(255,255,255,.9),16px 0 0 #dbe5f2,22px 6px 0 #c3d2e6,0 40px 60px rgba(8,20,45,.12);transform:rotateY(-9deg);transform-origin:left center;overflow:hidden}
.t{position:absolute;left:0;right:0;top:78px;text-align:center;font-weight:800;font-size:80px;letter-spacing:-.02em;color:#0a1730}
.g{position:absolute;left:325px;top:210px;width:250px;height:250px}
.stars{position:absolute;left:0;right:0;top:500px;display:flex;justify-content:center;gap:14px}
.nfc{position:absolute;left:70px;top:660px;width:340px;text-align:center}
.or{position:absolute;left:410px;top:790px;width:80px;text-align:center;font-weight:800;font-size:34px;color:#0a1730}
.qr{position:absolute;left:520px;top:640px;width:320px;text-align:center}
.qr svg.q{width:250px;height:250px;display:block;margin:0 auto}
.lbl{font-weight:700;font-size:40px;color:#0a1730;margin-top:6px}
.bar{position:absolute;left:0;right:0;bottom:0;height:34px;display:flex}.bar i{flex:1}
</style>
<div class="stage"><div class="shadow"></div><div class="base"></div>
<div class="panel">
 <div class="t">Rate Your Experience</div>
 <div class="g">${G}</div>
 <div class="stars">${star}${star}${star}${star}${star}</div>
 <div class="nfc">${nfc}<div class="lbl">Tap your phone</div></div>
 <div class="or">OR</div>
 <div class="qr"><svg class="q" viewBox="-1 -1 ${n + 2} ${n + 2}" shape-rendering="crispEdges"><rect x="-1" y="-1" width="${n + 2}" height="${n + 2}" fill="#fff"/><g fill="#0a1730">${rects}</g></svg><div class="lbl">Scan QR Code</div></div>
 <div class="bar"><i style="background:#EA4335"></i><i style="background:#34A853"></i><i style="background:#4285F4"></i><i style="background:#FBBC04"></i></div>
</div></div>`;
}
