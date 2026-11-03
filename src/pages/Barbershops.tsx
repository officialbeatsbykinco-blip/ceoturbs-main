// /barbershops — barbershop landing page (walk-ins, cold outreach, ads). Template: NichePage.
import { NichePage } from "@/pages/NichePage";
import { NICHES } from "@/content/niches";

export default function Barbershops() {
  return <NichePage niche={NICHES.barbershops} />;
}
