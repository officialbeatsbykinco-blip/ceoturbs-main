// The tech repair quiz on /computer-repair-tampa (and the phone sheet opened from any "Fix my tech" button):
// big tap tiles, then a filled-in text to our phone (or a name + number on a computer).
// Kept as data so the page, the quiz and the tests agree.
import { ALL_SETUP_CITIES } from "@/content/service-areas";

export const DEVICES = [
  { id: "laptop", label: "Windows laptop", short: "Windows laptop" },
  { id: "desktop", label: "Windows desktop or gaming PC", short: "Windows desktop" },
  { id: "mobile", label: "Phone or tablet setup", short: "Phone or tablet" },
  { id: "camera", label: "Cameras or Ring doorbell", short: "Cameras / doorbell" },
] as const;

/** Windows computers are the only thing we repair. Phones, tablets and cameras we set up; Macs and laptop screens we don't touch. */
export const NOT_FIXED = "We repair Windows laptops and desktops only. Phones, tablets and cameras we set up, not repair. No Macs or laptop screens.";

type Group = "computer" | "mobile" | "camera";
/** Which list a device gets: a phone never sees "blue screen", a camera never sees "SSD upgrade". */
export const deviceGroup = (d?: string): Group => (d === "mobile" ? "mobile" : d === "camera" ? "camera" : "computer");
const isComputer = (d: string) => deviceGroup(d) === "computer";

export const PROBLEMS = [
  { id: "slow", label: "Slow or freezing: make it faster", short: "Slow or freezing", for: ["computer"] },
  { id: "crash", label: "Blue screen or crashing", short: "Blue screen or crashing", for: ["computer"] },
  { id: "dead", label: "Won't turn on or won't start", short: "Won't turn on", for: ["computer"] },
  { id: "virus", label: "Virus, pop-ups or scam warnings", short: "Virus or pop-ups", for: ["computer"] },
  { id: "upgrade", label: "Upgrade (SSD, memory, parts)", short: "Upgrade parts", for: ["computer"] },
  { id: "setup", label: "Software, printer or email help", short: "Printer, email, apps", for: ["computer"] },
  { id: "data", label: "Move files or photos", short: "Move files or photos", for: ["computer"] },
  { id: "phone-setup", label: "Set up a new phone or tablet", short: "Set up a new phone", for: ["mobile"] },
  { id: "phone-transfer", label: "Move photos, contacts and texts", short: "Move photos and contacts", for: ["mobile"] },
  { id: "phone-email", label: "Email, apps and work accounts", short: "Email and apps", for: ["mobile"] },
  { id: "cam-install", label: "Install Wi-Fi cameras", short: "Install cameras", for: ["camera"] },
  { id: "cam-doorbell", label: "Install a Ring or video doorbell", short: "Ring or video doorbell", for: ["camera"] },
  { id: "cam-app", label: "Get cameras working on my phone", short: "Cameras on my phone", for: ["camera"] },
  { id: "other", label: "Something else", short: "Something else", for: ["computer", "mobile", "camera"] },
] as const;

/** The problems offered for a device, in order. */
export const problemsFor = (device?: string) => PROBLEMS.filter((p) => (p.for as readonly string[]).includes(deviceGroup(device)));

export const WHEN = [
  { id: "asap", label: "ASAP" },
  { id: "week", label: "This week" },
  { id: "flexible", label: "No rush" },
] as const;

export const WHERE = [
  { id: "home", label: "Come to me", sub: "Home or business" },
  { id: "remote", label: "Fix it remotely", sub: "Over the internet" },
] as const;

/** Problems we can fix over the internet, anywhere in the world (software only, no parts). */
export const REMOTE_PROBLEMS: readonly ProblemId[] = ["slow", "virus", "setup"];

/** Remote support: only Windows computers, each with only software problems (slow, pop-ups, software/email). Anything else needs a visit. */
export const remoteOk = (a: Pick<TechAnswers, "devices" | "problems">) =>
  a.devices.length > 0 &&
  a.devices.every((d) => {
    if (!isComputer(d)) return false;
    const probs = a.problems[d] ?? [];
    return probs.length > 0 && probs.every((p) => REMOTE_PROBLEMS.includes(p));
  });

/** Longest free-text note we accept (the quiz box, the text and the lead sheet all agree). */
export const DETAILS_MAX = 1000;

export type DeviceId = (typeof DEVICES)[number]["id"];
export type ProblemId = (typeof PROBLEMS)[number]["id"];
export type WhenId = (typeof WHEN)[number]["id"];
export type WhereId = (typeof WHERE)[number]["id"];

/** Several broken devices in one request: each picked device keeps its own list of problems. */
export type TechAnswers = {
  devices: DeviceId[];
  problems: Partial<Record<DeviceId, ProblemId[]>>;
  when: WhenId;
  where: WhereId;
  details: string;
  zip: string;
  name: string;
  phone: string;
  smsOptIn: boolean;
};
export const EMPTY_TECH: TechAnswers = { devices: [], problems: {}, when: "asap", where: "home", details: "", zip: "", name: "", phone: "", smsOptIn: false };

/** Cities we come to (the full in-person list, Tampa first). */
export const TECH_CITIES = ALL_SETUP_CITIES;

const pick = <T extends { id: string; label: string }>(list: readonly T[], id?: string) => list.find((o) => o.id === id)?.label ?? "";

/** Every picked problem across every device, deduplicated (for analytics). */
export const allProblems = (a: Pick<TechAnswers, "devices" | "problems">) => [...new Set(a.devices.flatMap((d) => a.problems[d] ?? []))];

/** One line per device: "Windows laptop: Blue screen or crashing, Slow or freezing". No pick yet reads "not sure, will explain". */
const deviceLines = (a: TechAnswers) =>
  a.devices.map((d) => {
    const probs = (a.problems[d] ?? []).map((id) => pick(PROBLEMS, id)).filter(Boolean);
    return `${pick(DEVICES, d)}: ${probs.length ? probs.join(", ") : "not sure, will explain"}`;
  });

export const techLabels = (a: TechAnswers) => ({
  device: a.devices.map((d) => pick(DEVICES, d)).join(", "),
  problem: deviceLines(a).join("; "),
  when: pick(WHEN, a.when),
  where: pick(WHERE, a.where),
});

/** A US ZIP code (5 digits). Only needed when we're coming to them. */
export const zipOk = (zip: string) => /^\d{5}$/.test(zip.trim());

/** The text a phone sends us: one line per device and per answer, so it reads at a glance on the owner's phone. */
export function techMessage(a: TechAnswers) {
  const l = techLabels(a);
  const where = a.where === "remote" && remoteOk(a) ? "Remote" : `Come to me${a.zip.trim() ? `, ZIP ${a.zip.trim()}` : ""}`;
  const lines = deviceLines(a);
  return [
    "Hi Chris! I'd like a price.",
    ...(lines.length > 1 ? [`${lines.length} devices:`, ...lines.map((x) => `- ${x}`)] : lines),
    a.details.trim() && `Details: ${a.details.trim()}`,
    l.when && `When: ${l.when}`,
    `Where: ${where}`,
    `Name: ${a.name.trim() || "-"}`,
  ]
    .filter(Boolean)
    .join("\n");
}
