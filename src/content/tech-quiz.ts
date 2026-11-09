// The tech repair quiz on /computer-repair-tampa: three taps, then a filled-in text to our phone
// (or a name + number on a computer). Kept as data so the page, the quiz and the tests agree.
import { ALL_SETUP_CITIES } from "@/content/service-areas";

export const PROBLEMS = [
  { id: "slow", label: "Slow or freezing", text: "is slow and freezing" },
  { id: "crash", label: "Crashing or blue screen", text: "keeps crashing" },
  { id: "dead", label: "Won't turn on", text: "won't turn on" },
  { id: "virus", label: "Virus or pop-ups", text: "has a virus or pop-ups" },
  { id: "screen", label: "Cracked screen or bad battery", text: "has a cracked screen or bad battery" },
  { id: "setup", label: "Printer, software or email", text: "needs printer, software or email help" },
  { id: "other", label: "Something else", text: "needs help" },
] as const;

export const DEVICES = [
  { id: "windows", label: "Windows PC or laptop", text: "Windows computer" },
  { id: "mac", label: "Mac", text: "Mac" },
  { id: "iphone", label: "iPhone", text: "iPhone" },
  { id: "android", label: "Android phone", text: "Android phone" },
  { id: "tablet", label: "iPad or tablet", text: "tablet" },
] as const;

export const WHERE = [
  { id: "home", label: "Come to me", sub: "In-home or at my business" },
  { id: "remote", label: "Fix it remotely", sub: "Windows speed-ups and software" },
  { id: "unsure", label: "Not sure yet", sub: "Tell me what's best" },
] as const;

export type ProblemId = (typeof PROBLEMS)[number]["id"];
export type DeviceId = (typeof DEVICES)[number]["id"];
export type WhereId = (typeof WHERE)[number]["id"];

export type TechAnswers = { problem?: ProblemId; device?: DeviceId; where?: WhereId; city: string; name: string; phone: string; smsOptIn: boolean };
export const EMPTY_TECH: TechAnswers = { city: "", name: "", phone: "", smsOptIn: false };

/** Cities offered in the picker (the full in-person list, Tampa first). */
export const TECH_CITIES = ALL_SETUP_CITIES;

const label = <T extends { id: string; label: string }>(list: readonly T[], id?: string) => list.find((o) => o.id === id)?.label ?? "";

export const techLabels = (a: TechAnswers) => ({
  problem: label(PROBLEMS, a.problem),
  device: label(DEVICES, a.device),
  where: label(WHERE, a.where),
});

/** The text a phone sends us, e.g. "Hi Chris, my Windows computer is slow and freezing. Can you come to me? I'm in Brandon. – Pat". */
export function techMessage(a: TechAnswers) {
  const device = DEVICES.find((d) => d.id === a.device)?.text ?? "device";
  const problem = PROBLEMS.find((p) => p.id === a.problem)?.text ?? "needs help";
  const ask = a.where === "remote" ? "Can you fix it remotely?" : a.where === "home" ? "Can you come to me?" : "What do you recommend?";
  const city = a.where !== "remote" && a.city.trim() ? ` I'm in ${a.city.trim()}.` : "";
  const name = a.name.trim() ? ` – ${a.name.trim().split(/\s+/)[0]}` : "";
  return `Hi Chris, my ${device} ${problem}. ${ask}${city} What's the price?${name}`;
}
