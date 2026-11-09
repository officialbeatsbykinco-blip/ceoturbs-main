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
/** Which problem list a device gets: a phone never sees "blue screen", a printer never sees "cracked screen". */
export const deviceGroup = (d?: string): Group => (d === "iphone" || d === "android" || d === "tablet" ? "mobile" : d === "other" ? "home" : "computer");

export const PROBLEMS = [
  { id: "slow", label: "Slow or freezing", for: ["computer", "mobile"] },
  { id: "crash", label: "Crashing or error screens", for: ["computer"] },
  { id: "dead", label: "Won't turn on", for: ["computer", "mobile"] },
  { id: "virus", label: "Virus, pop-ups or scam warnings", for: ["computer"] },
  { id: "screen", label: "Cracked or broken screen", for: ["computer", "mobile"] },
  { id: "battery", label: "Battery dies fast or won't charge", for: ["computer", "mobile"] },
  { id: "setup", label: "Printer, software or email help", for: ["computer"] },
  { id: "data", label: "Move files, photos or contacts", for: ["computer", "mobile"] },
  { id: "printer", label: "Printer not working", for: ["home"] },
  { id: "wifi", label: "Wi-Fi slow or dropping", for: ["home"] },
  { id: "tv", label: "TV mounting or setup", for: ["home"] },
  { id: "other", label: "Something else", for: ["computer", "mobile", "home"] },
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
  { id: "remote", label: "Speed it up remotely", sub: "Over the internet" },
] as const;

/** Remote is only a speed-up for a slow Windows computer (the it-remote price). Anything else needs a visit. */
export const remoteOk = (a: Pick<TechAnswers, "device" | "problems">) => a.device === "windows" && a.problems.length > 0 && a.problems.every((p) => p === "slow");

export type DeviceId = (typeof DEVICES)[number]["id"];
export type ProblemId = (typeof PROBLEMS)[number]["id"];
export type WhenId = (typeof WHEN)[number]["id"];
export type WhereId = (typeof WHERE)[number]["id"];

export type TechAnswers = {
  device?: DeviceId;
  problems: ProblemId[];
  when: WhenId;
  where: WhereId;
  details: string;
  zip: string;
  name: string;
  phone: string;
  smsOptIn: boolean;
};
export const EMPTY_TECH: TechAnswers = { problems: [], when: "asap", where: "home", details: "", zip: "", name: "", phone: "", smsOptIn: false };

/** Cities we come to (the full in-person list, Tampa first). */
export const TECH_CITIES = ALL_SETUP_CITIES;

const pick = <T extends { id: string; label: string }>(list: readonly T[], id?: string) => list.find((o) => o.id === id)?.label ?? "";

export const techLabels = (a: TechAnswers) => ({
  device: pick(DEVICES, a.device),
  problem: a.problems.map((id) => pick(PROBLEMS, id)).filter(Boolean).join(", "),
  when: pick(WHEN, a.when),
  where: pick(WHERE, a.where),
});

/** A US ZIP code (5 digits). Only needed when we're coming to them. */
export const zipOk = (zip: string) => /^\d{5}$/.test(zip.trim());

/** The text a phone sends us: one line per answer, so it reads at a glance on the owner's phone. */
export function techMessage(a: TechAnswers) {
  const l = techLabels(a);
  const where = a.where === "remote" && remoteOk(a) ? "Remote" : `Come to me${a.zip.trim() ? `, ZIP ${a.zip.trim()}` : ""}`;
  return [
    "Hi Chris! I'd like a repair price.",
    l.device && `Device: ${l.device}`,
    l.problem && `${a.problems.length > 1 ? "Problems" : "Problem"}: ${l.problem}`,
    a.details.trim() && `Details: ${a.details.trim()}`,
    l.when && `When: ${l.when}`,
    `Where: ${where}`,
    `Name: ${a.name.trim() || "-"}`,
  ]
    .filter(Boolean)
    .join("\n");
}
