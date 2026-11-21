// The Tampa repositioning: tech repair quiz + its Meta Lead, desktop call clicks kept out of Meta Contact,
// old Georgia ad URLs redirected, and no Atlanta/Duluth left in the site's own copy.
import { describe, it, expect, beforeEach } from "vitest";
import { readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import { techMessage, techLabels, allProblems, DEVICES, EMPTY_TECH, zipOk, remoteOk, problemsFor } from "@/content/tech-quiz";
import { techFields } from "../../api/lead.js";
import { trackPayload } from "../../api/track.js";

type Win = Window & { fbq?: (...a: unknown[]) => void; gtag?: (...a: unknown[]) => void; dataLayer?: unknown[] };
const w = window as Win;

describe("tech repair quiz", () => {
  it("writes the whole request into the text, one answer per line", () => {
    const msg = techMessage({ ...EMPTY_TECH, devices: ["laptop"], problems: { laptop: ["slow", "virus"] }, when: "asap", where: "home", zip: "33511", details: "Dell, started last week", name: "Pat Lee" });
    expect(msg).toBe("Hi Chris! I'd like a price.\nWindows laptop: Slow or freezing: make it faster, Virus, pop-ups or scam warnings\nDetails: Dell, started last week\nWhen: ASAP\nWhere: Come to me, ZIP 33511\nName: Pat Lee");
  });

  it("takes a laptop and a desktop, each with its own problems, and loses none of them", () => {
    const a = { ...EMPTY_TECH, devices: ["laptop", "desktop"] as const, problems: { laptop: ["virus", "crash"], desktop: ["dead"] }, zip: "33602", name: "Ana", details: "x".repeat(900) } as unknown as Parameters<typeof techMessage>[0];
    const msg = techMessage(a);
    expect(msg).toContain("2 devices:");
    expect(msg).toContain("- Windows laptop: Virus, pop-ups or scam warnings, Blue screen or crashing");
    expect(msg).toContain("- Windows desktop or gaming PC: Won't turn on or won't start");
    expect(msg).toContain("x".repeat(900));
    expect(allProblems(a)).toEqual(["virus", "crash", "dead"]);
    const l = techLabels(a);
    expect(l.device).toBe("Windows laptop, Windows desktop or gaming PC");
    // The lead sheet keeps every device and the full note, not a 300-character stub.
    const f = techFields({ problem: l.problem, device: l.device, details: a.details });
    expect(f.note).toContain("Windows desktop or gaming PC: Won't turn on");
    expect(f.note).toContain("x".repeat(900));
  });

  it("only allows remote when every computer has software problems only", () => {
    expect(remoteOk({ devices: ["laptop"], problems: { laptop: ["slow"] } })).toBe(true);
    expect(remoteOk({ devices: ["desktop"], problems: { desktop: ["slow", "virus", "setup"] } })).toBe(true);
    expect(remoteOk({ devices: ["laptop", "desktop"], problems: { laptop: ["slow"], desktop: ["virus"] } })).toBe(true);
    expect(remoteOk({ devices: ["laptop"], problems: { laptop: ["slow", "dead"] } })).toBe(false);
    expect(remoteOk({ devices: ["laptop"], problems: { laptop: ["upgrade"] } })).toBe(false);
    expect(remoteOk({ devices: ["laptop", "desktop"], problems: { laptop: ["slow"] } })).toBe(false);
    expect(remoteOk({ devices: [], problems: {} })).toBe(false);
    expect(remoteOk({ devices: ["mobile"], problems: { mobile: ["phone-email"] } })).toBe(false);
    expect(remoteOk({ devices: ["laptop", "camera"], problems: { laptop: ["slow"], camera: ["cam-app"] } })).toBe(false);
    const remote = techMessage({ ...EMPTY_TECH, devices: ["laptop"], problems: { laptop: ["slow"] }, where: "remote", zip: "33602" });
    expect(remote).toContain("Where: Remote");
    expect(remote).not.toContain("33602");
    expect(remote).not.toContain("Details");
    // A remote answer left over from earlier answers can't slip through for a visit-only job.
    expect(techMessage({ ...EMPTY_TECH, devices: ["desktop"], problems: { desktop: ["dead"] }, where: "remote" })).toContain("Where: Come to me");
  });

  it("repairs Windows computers only; phones, tablets and cameras are setup, never repair; no Macs", () => {
    expect(DEVICES.map((d) => d.id)).toEqual(["laptop", "desktop", "mobile", "camera"]);
    const all = [...DEVICES, ...problemsFor("laptop"), ...problemsFor("mobile"), ...problemsFor("camera")].map((x) => x.label).join(" ");
    expect(all).not.toMatch(/\bmacs?\b|macbook|cracked|broken screen|battery/i);
    expect(problemsFor("desktop").map((p) => p.id)).toEqual(expect.arrayContaining(["slow", "crash", "dead"]));
    expect(problemsFor("mobile").map((p) => p.id)).toEqual(["phone-setup", "phone-transfer", "phone-email", "other"]);
    expect(problemsFor("camera").map((p) => p.id)).toEqual(["cam-install", "cam-doorbell", "cam-app", "other"]);
    expect(problemsFor("mobile").map((p) => p.id)).not.toContain("crash");
  });

  it("only accepts a 5-digit ZIP", () => {
    expect(zipOk("33602")).toBe(true);
    expect(zipOk("3360")).toBe(false);
    expect(zipOk("abcde")).toBe(false);
  });

  it("files the answers as one readable sheet note", () => {
    expect(techFields({ problem: "Won't turn on", device: "Mac", where: "Come to me", zip: "33755", when: "ASAP", details: "Fell<script>" }).note).toBe("Problem: Won't turn on | Device: Mac | When: ASAP | Where: Come to me | ZIP: 33755 | Details: Fell script");
  });

  it("sends the repair quiz start and last step to the Conversions API under the Pixel's names", () => {
    expect(trackPayload({ event: "tech_quiz_start", contentName: "Computer repair Tampa", contentCategory: "tech_repair" })).toMatchObject({ eventName: "QuizStart", customData: { content_category: "tech_repair" } });
    expect(trackPayload({ event: "tech_quiz_last_step" })?.eventName).toBe("QuizLastStep");
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

  it("counts the \"Call us\" link inside a quiz as a call (only the quiz's own text button is skipped)", () => {
    mobile = true;
    for (const location of ["text quiz call", "office quiz call"]) {
      fbq.length = 0;
      const a = document.createElement("a");
      a.href = "tel:+16785584327";
      a.dataset.callLocation = location;
      a.addEventListener("click", (e) => e.preventDefault());
      document.body.appendChild(a);
      a.click();
      a.remove();
      expect(fbq.some((c) => c[0] === "track" && c[1] === "Contact"), location).toBe(true);
    }
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

describe("Tampa install pages", () => {
  it("has a page for computer setup, security cameras and Wi-Fi, each with per-unit prices", async () => {
    const { INSTALL_PAGES } = await import("@/content/install-pages");
    expect(INSTALL_PAGES.map((p) => p.path)).toEqual(["/computer-setup-tampa", "/security-camera-installation-tampa", "/wifi-installation-tampa", "/business-tech-setup-tampa", "/gaming-pc-fps-boost"]);
    for (const p of INSTALL_PAGES) expect(p.prices.length, p.path).toBeGreaterThan(1);
    const cams = INSTALL_PAGES[1];
    expect(cams.prices.map((x) => x.id)).toEqual(["cam-doorbell", "cam-wifi"]);
    // No ladder work: the camera page never offers wired, roofline or recorder systems.
    expect(cams.priceNote).toContain("No second-story, roofline or wired systems");
  });

  it("FPS boost: own Cal.com event, remote needs no ZIP, in person does, and every answer reaches the text", async () => {
    const { INSTALL_PAGES, installMessage, needsZip, EMPTY_INSTALL } = await import("@/content/install-pages");
    const fps = INSTALL_PAGES.find((p) => p.path === "/gaming-pc-fps-boost")!;
    expect(fps.booking?.calLink).toBe("ceoturbo/ceo-turbo-fps-boost");
    expect(fps.seo.title.length).toBeGreaterThanOrEqual(50);
    expect(fps.seo.title.length).toBeLessThanOrEqual(60);
    expect(fps.seo.description.length).toBeLessThanOrEqual(155);
    const remote = { ...EMPTY_INSTALL, jobs: ["lowfps", "stutter"], picks: { how: "remote", pc: "desktop", game: "fortnite" }, name: "Jay", details: "RTX 3060, drops to 40 in fights" };
    expect(needsZip(fps, remote)).toBe(false);
    const msg = installMessage(fps, remote);
    expect(msg).toContain("Need: Low FPS, Stutter or lag spikes");
    expect(msg).toContain("How: Remote, over the internet");
    expect(msg).toContain("Plays: Fortnite");
    expect(msg).toContain("Details: RTX 3060, drops to 40 in fights");
    expect(msg).not.toContain("ZIP");
    expect(needsZip(fps, { picks: { how: "inperson" } })).toBe(true);
    expect(installMessage(fps, { ...remote, picks: { how: "inperson" }, zip: "33617" })).toContain("ZIP: 33617");
    // Every other install page still always asks for a ZIP.
    for (const p of INSTALL_PAGES.filter((x) => !x.remote)) expect(needsZip(p, { picks: {} })).toBe(true);
  });

  it("keeps the Google Ads business page clear of consumer tech-support wording", async () => {
    // Google bans ads for consumer tech support/repair/installation but allows services sold only to businesses.
    const { INSTALL_PAGES } = await import("@/content/install-pages");
    const biz = INSTALL_PAGES.find((p) => p.audience === "business")!;
    const text = JSON.stringify(biz).toLowerCase();
    for (const w of ["repair", "fix", "virus", "troubleshoot", "tech support", "technical support", "remote", "your home", "homeowner"]) expect(text, w).not.toContain(w);
  });

  it("writes the install request into the text, one answer per line", async () => {
    const { INSTALL_PAGES, EMPTY_INSTALL, installMessage } = await import("@/content/install-pages");
    const msg = installMessage(INSTALL_PAGES[1], { ...EMPTY_INSTALL, jobs: ["doorbell", "porch"], picks: { brand: "ring", count: "2-3", place: "home" }, zip: "33617", name: "Pat" });
    expect(msg).toBe("Hi Chris! I'd like a price for doorbell and camera installation.\nNeed: Install a video doorbell, Porch, garage or patio cameras\nBrand: Ring\nDevices: 2–3\nFor: Home\nWhen: ASAP\nZIP: 33617\nName: Pat");
  });

  it("files install leads as one readable sheet note", async () => {
    const { installFields } = await import("../../api/lead.js");
    expect(installFields({ contentName: "Security cameras Tampa", jobs: "Install new cameras", answers: "Cameras: 3–4 | For: Home", when: "ASAP", zip: "33511" }).note).toBe("Service: Security cameras Tampa | Need: Install new cameras | Cameras: 3–4 | For: Home | When: ASAP | ZIP: 33511");
  });
});
