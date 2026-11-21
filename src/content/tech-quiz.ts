// The tech repair quiz on /computer-repair-tampa (and the phone sheet opened from any "Fix my tech" button):
// big tap tiles, then a filled-in text to our phone (or a name + number on a computer).
// Kept as data so the page, the quiz and the tests agree.
import { ALL_SETUP_CITIES } from "@/content/service-areas";

export const DEVICES = [
  { id: "laptop", label: "Windows laptop", short: "Windows laptop" },
  { id: "desktop", label: "Windows desktop or gaming PC", short: "Windows desktop" },
] as const;

/** Windows computers only: no Macs, phones, tablets or laptop screen replacements. */
export const NOT_FIXED = "We only fix Windows laptops and desktops. No Macs, phones, tablets or laptop screens.";

export const PROBLEMS = [
  { id: "slow", label: "Slow or freezing: make it faster" },
  { id: "crash", label: "Blue screen or crashing" },
  { id: "dead", label: "Won't turn on or won't start" },
  { id: "virus", label: "Virus, pop-ups or scam warnings" },
  { id: "upgrade", label: "Upgrade (SSD, memory, parts)" },
  { id: "setup", label: "Software, printer or email help" },
  { id: "data", label: "Move files or photos" },
  { id: "other", label: "Something else" },
] as const;

/** The problems offered for a device, in order. */
export const problemsFor = (_device?: string) => PROBLEMS;

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

/** Remote support: every picked computer has only software problems (slow, pop-ups, software/email). Anything else needs a visit. */
export const remoteOk = (a: Pick<TechAnswers, "devices" | "problems">) =>
  a.devices.length > 0 &&
  a.devices.every((d) => {
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
