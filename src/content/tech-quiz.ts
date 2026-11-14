// The tech repair quiz on /computer-repair-tampa (and the phone sheet opened from any "Fix my tech" button):
// big tap tiles, then a filled-in text to our phone (or a name + number on a computer).
// Kept as data so the page, the quiz and the tests agree.
import { ALL_SETUP_CITIES } from "@/content/service-areas";

export const DEVICES = [
  { id: "windows", label: "Windows PC or laptop", short: "Windows PC" },
  { id: "mac", label: "Mac or MacBook", short: "Mac" },
  { id: "iphone", label: "iPhone", short: "iPhone" },
  { id: "android", label: "Android phone", short: "Android phone" },
  { id: "tablet", label: "iPad or tablet", short: "Tablet" },
  { id: "other", label: "Printer, Wi-Fi or TV", short: "Printer / Wi-Fi / TV" },
] as const;

type Group = "computer" | "mobile" | "home";
/** Which problem list a device gets: a phone never sees "blue screen", a printer never sees "cracked screen". Phones and tablets: screens and batteries only. */
export const deviceGroup = (d?: string): Group => (d === "iphone" || d === "android" || d === "tablet" ? "mobile" : d === "other" ? "home" : "computer");

export const PROBLEMS = [
  { id: "slow", label: "Slow or freezing", for: ["computer"] },
  { id: "crash", label: "Crashing or error screens", for: ["computer"] },
  { id: "dead", label: "Won't turn on", for: ["computer"] },
  { id: "virus", label: "Virus, pop-ups or scam warnings", for: ["computer"] },
  { id: "screen", label: "Cracked or broken screen", for: ["computer", "mobile"] },
  { id: "battery", label: "Battery dies fast or won't charge", for: ["computer", "mobile"] },
  { id: "upgrade", label: "Upgrade (SSD, memory, parts)", for: ["computer"] },
  { id: "setup", label: "Printer, software or email help", for: ["computer"] },
  { id: "data", label: "Move files or photos", for: ["computer"] },
  { id: "printer", label: "Printer not working", for: ["home"] },
  { id: "wifi", label: "Wi-Fi slow or dropping", for: ["home"] },
  { id: "tv", label: "TV mounting or setup", for: ["home"] },
  { id: "other", label: "Something else", for: ["computer", "home"] },
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

/** Problems on a Windows computer we can fix over the internet, anywhere in the world (software only, no parts). */
export const REMOTE_PROBLEMS: readonly ProblemId[] = ["slow", "virus", "setup"];

/** Remote support: one Windows computer whose problems are all software (slow, pop-ups, software/email). Anything else needs a visit. */
export const remoteOk = (a: Pick<TechAnswers, "devices" | "problems">) => {
  const win = a.problems.windows ?? [];
  return a.devices.length === 1 && a.devices[0] === "windows" && win.length > 0 && win.every((p) => REMOTE_PROBLEMS.includes(p));
};

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

/** One line per device: "iPhone: Cracked or broken screen, Battery dies fast". No pick yet reads "not sure, will explain". */
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
    "Hi Chris! I'd like a repair price.",
    ...(lines.length > 1 ? [`${lines.length} devices:`, ...lines.map((x) => `- ${x}`)] : lines),
    a.details.trim() && `Details: ${a.details.trim()}`,
    l.when && `When: ${l.when}`,
    `Where: ${where}`,
    `Name: ${a.name.trim() || "-"}`,
  ]
    .filter(Boolean)
    .join("\n");
}
