// The Tampa repositioning: tech repair quiz + its Meta Lead, desktop call clicks kept out of Meta Contact,
// old Georgia ad URLs redirected, and no Atlanta/Duluth left in the site's own copy.
import { describe, it, expect, beforeEach } from "vitest";
import { readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import { techMessage, EMPTY_TECH } from "@/content/tech-quiz";
import { techFields } from "../../api/lead.js";
import { trackPayload } from "../../api/track.js";

type Win = Window & { fbq?: (...a: unknown[]) => void; gtag?: (...a: unknown[]) => void; dataLayer?: unknown[] };
const w = window as Win;

describe("tech repair quiz", () => {
  it("writes the whole request into the text", () => {
    const msg = techMessage({ ...EMPTY_TECH, problem: "slow", device: "windows", where: "home", city: "Brandon", name: "Pat Lee" });
    expect(msg).toBe("Hi Chris, my Windows computer is slow and freezing. Can you come to me? I'm in Brandon. What's the price? – Pat");
  });

  it("leaves the city out of remote requests", () => {
    const msg = techMessage({ ...EMPTY_TECH, problem: "virus", device: "windows", where: "remote", city: "Tampa" });
    expect(msg).toContain("Can you fix it remotely?");
    expect(msg).not.toContain("Tampa");
  });

  it("files the answers as one readable sheet note", () => {
    expect(techFields({ problem: "Won't turn on", device: "Mac", where: "Come to me", city: "Clearwater<script>" }).note).toBe("Problem: Won't turn on | Device: Mac | Where: Come to me | City: Clearwater script");
  });

  it("passes the tech_repair category through to the server ViewContent", () => {
    expect(trackPayload({ event: "view_item", contentName: "Computer repair Tampa", contentCategory: "tech_repair" })?.customData).toMatchObject({ content_name: "Computer repair Tampa", content_category: "tech_repair" });
  });
});

describe("call and text taps", () => {
  // One listener for the whole file (installCallTracking is once per page); the device type is read at click time.
  const fbq: unknown[][] = [];
  let mobile = false;
  beforeEach(async () => {
    fbq.length = 0;
    w.fbq = (...a) => void fbq.push(a);
    w.gtag = () => {};
    w.dataLayer = [];
    window.matchMedia = ((q: string) => ({ matches: mobile && q.includes("coarse"), media: q, addEventListener() {}, removeEventListener() {} })) as unknown as typeof window.matchMedia;
    Object.defineProperty(navigator, "userAgent", { configurable: true, get: () => (mobile ? "Mozilla/5.0 (iPhone)" : "Mozilla/5.0 (Macintosh)") });
    const track = await import("@/lib/track");
    track.metaPixelReady();
    track.installCallTracking();
  });

  function clickTel() {
    const a = document.createElement("a");
    a.href = "tel:+16785584327";
    a.addEventListener("click", (e) => e.preventDefault());
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  it("counts a phone tap as Meta Contact", () => {
    mobile = true;
    clickTel();
    expect(fbq.some((c) => c[0] === "track" && c[1] === "Contact")).toBe(true);
  });

  it("keeps a desktop click (which only shows the number) out of Meta Contact", () => {
    mobile = false;
    clickTel();
    expect(fbq.some((c) => c[1] === "Contact")).toBe(false);
    expect(fbq.some((c) => c[0] === "trackCustom" && c[1] === "ContactIntent")).toBe(true);
  });
});

describe("Tampa move", () => {
  const root = path.resolve(__dirname, "../..");

  it("301s the old Georgia ad pages and /atlanta", () => {
    const vercel = JSON.parse(readFileSync(path.join(root, "vercel.json"), "utf8")) as { redirects: { source: string; destination: string; permanent: boolean }[] };
    const to = (src: string) => vercel.redirects.find((r) => r.source === src);
    expect(to("/it-services-duluth-ga")).toMatchObject({ destination: "/computer-repair-tampa", permanent: true });
    expect(to("/pc-technician-duluth-ga")).toMatchObject({ destination: "/computer-repair-tampa", permanent: true });
    expect(to("/atlanta")).toMatchObject({ destination: "/tampa", permanent: true });
  });

  it("has no Atlanta or Duluth in the site's own copy (client case studies and test fixtures aside)", () => {
    const skip = new Set(["clients.ts", "restaurants.ts", "guides.ts"]);
    const files: string[] = [];
    const walk = (dir: string) => {
      for (const f of readdirSync(dir)) {
        const p = path.join(dir, f);
        if (statSync(p).isDirectory()) {
          if (f !== "test") walk(p);
        } else if (/\.(ts|tsx)$/.test(f) && !skip.has(f)) files.push(p);
      }
    };
    walk(path.join(root, "src"));
    const hits = files.filter((f) => /Atlanta|Duluth|Gwinnett|Dunwoody/.test(readFileSync(f, "utf8")));
    expect(hits.map((f) => path.relative(root, f))).toEqual([]);
  });
});
