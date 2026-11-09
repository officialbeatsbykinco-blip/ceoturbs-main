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

export const PROBLEMS = [
  { id: "slow", label: "Slow or freezing" },
  { id: "crash", label: "Crashing or blue screen" },
  { id: "dead", label: "Won't turn on" },
  { id: "virus", label: "Virus or pop-ups" },
  { id: "screen", label: "Cracked screen or bad battery" },
  { id: "setup", label: "Printer, software or email" },
  { id: "other", label: "Something else" },
] as const;

export const WHEN = [
  { id: "asap", label: "ASAP" },
  { id: "week", label: "This week" },
  { id: "flexible", label: "No rush" },
] as const;

export const WHERE = [
  { id: "home", label: "Come to me", sub: "Home or business" },
  { id: "remote", label: "Fix it remotely", sub: "Over the internet" },
] as const;

export type DeviceId = (typeof DEVICES)[number]["id"];
export type ProblemId = (typeof PROBLEMS)[number]["id"];
export type WhenId = (typeof WHEN)[number]["id"];
export type WhereId = (typeof WHERE)[number]["id"];

export type TechAnswers = {
  device?: DeviceId;
  problem?: ProblemId;
  when: WhenId;
  where: WhereId;
  details: string;
  zip: string;
  name: string;
  phone: string;
  smsOptIn: boolean;
};
export const EMPTY_TECH: TechAnswers = { when: "asap", where: "home", details: "", zip: "", name: "", phone: "", smsOptIn: false };

/** Cities we come to (the full in-person list, Tampa first). */
export const TECH_CITIES = ALL_SETUP_CITIES;

const pick = <T extends { id: string; label: string }>(list: readonly T[], id?: string) => list.find((o) => o.id === id)?.label ?? "";

export const techLabels = (a: TechAnswers) => ({
  device: pick(DEVICES, a.device),
  problem: pick(PROBLEMS, a.problem),
  when: pick(WHEN, a.when),
  where: pick(WHERE, a.where),
});

/** A US ZIP code (5 digits). Only needed when we're coming to them. */
export const zipOk = (zip: string) => /^\d{5}$/.test(zip.trim());

/** The text a phone sends us: one line per answer, so it reads at a glance on the owner's phone. */
export function techMessage(a: TechAnswers) {
  const l = techLabels(a);
  const where = a.where === "remote" ? "Remote" : `Come to me${a.zip.trim() ? `, ZIP ${a.zip.trim()}` : ""}`;
  return [
    "Hi Chris! I'd like a repair price.",
    l.device && `Device: ${l.device}`,
    l.problem && `Problem: ${l.problem}`,
    a.details.trim() && `Details: ${a.details.trim()}`,
    l.when && `When: ${l.when}`,
    `Where: ${where}`,
    `Name: ${a.name.trim() || "-"}`,
  ]
    .filter(Boolean)
    .join("\n");
}
