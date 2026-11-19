// Our own tech-repair ads, shown on the site as the pictures until real job photos replace them.
// Each card opens the repair price flow: the tap-question text sheet on phones, the repair page on computers.
import { FixMyTechLink } from "@/components/tech/FixMyTechLink";
import { cn } from "@/lib/utils";

export const TECH_ADS = [
  { slug: "slow-computer", alt: "Slow computer? Don't buy a new one. Speed-up at your door from $149, price before we start, no fix no charge. Call or text (678) 558-4327." },
  { slug: "skip-the-drive", alt: "Broken computer? Skip the drive. A repair store makes you drive it in and wait days; CEO Turbo comes to your door, usually same or next day, price before we start. Diagnosis $79, credited to the repair." },
  { slug: "text-for-price", alt: "Text us what's broken and get a price in minutes: a customer texts Chris that a Windows laptop won't turn on, and Chris replies he can come today." },
] as const;

export const OFFICE_AD = {
  src: "/img/tech/office-ready-day-one-full.webp",
  srcSet: "/img/tech/office-ready-day-one-540.webp 540w, /img/tech/office-ready-day-one-full.webp 1080w",
  width: 1080,
  height: 565,
  alt: "New office? Ready day one. Workstations, business Wi-Fi, printers and shared files, Microsoft 365. Workstation setup $169 per desk, flat price in writing before we start.",
};

export function TechAdGallery({ where, className }: { where: string; className?: string }) {
  return (
    <ul className={cn("grid grid-cols-1 gap-4 sm:grid-cols-3", className)}>
      {TECH_ADS.map((a) => (
        <li key={a.slug}>
          <FixMyTechLink source={`${where} ad ${a.slug}`} className="group block overflow-hidden rounded-2xl ring-1 ring-border shadow-[0_20px_50px_-30px_rgb(20_40_90/0.5)] transition-transform duration-300 hover:-translate-y-1">
            <img
              src={`/img/tech/${a.slug}-full.webp`}
              srcSet={`/img/tech/${a.slug}-540.webp 540w, /img/tech/${a.slug}-full.webp 1080w`}
              sizes="(min-width: 640px) 33vw, 100vw"
              width={1080}
              height={1350}
              loading="lazy"
              decoding="async"
              alt={a.alt}
              className="aspect-[4/5] w-full object-cover"
            />
          </FixMyTechLink>
        </li>
      ))}
    </ul>
  );
}
