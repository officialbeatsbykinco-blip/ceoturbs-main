// Cities served in person (Tampa Bay, about 40 miles from Temple Terrace). Remote help works anywhere in the world.
export const SETUP_AREAS: { region: string; note?: string; cities: string[] }[] = [
  { region: "Tampa", note: "Home base", cities: ["Tampa", "Carrollwood", "Town 'n' Country", "Westchase", "Temple Terrace", "Lutz", "Citrus Park", "Seffner"] },
  { region: "Pinellas County", cities: ["St. Petersburg", "Clearwater", "Largo", "Pinellas Park", "Seminole", "Dunedin", "Palm Harbor", "Oldsmar", "Safety Harbor", "Tarpon Springs"] },
  { region: "Pasco County", cities: ["Wesley Chapel", "Land O' Lakes", "New Port Richey", "Zephyrhills", "Odessa", "Trinity"] },
  { region: "East & South Hillsborough", cities: ["Brandon", "Riverview", "Valrico", "Plant City", "Apollo Beach", "Ruskin", "Sun City Center", "Gibsonton"] },
  { region: "Polk & Manatee", note: "Edge of the 40-mile radius", cities: ["Lakeland", "Parrish", "Palmetto"] },
];
export const ALL_SETUP_CITIES = SETUP_AREAS.flatMap((r) => r.cities);
