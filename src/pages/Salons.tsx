// /salons — hair & beauty salon landing page (walk-ins, cold outreach, ads). Template: NichePage.
import { NichePage } from "@/pages/NichePage";
import { NICHES } from "@/content/niches";

export default function Salons() {
  return <NichePage niche={NICHES.salons} />;
}
