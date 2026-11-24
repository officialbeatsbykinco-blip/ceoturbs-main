// Cities served in person: everywhere within about 1.5 hours' drive of Temple Terrace, Florida (Tampa Bay,
// Orlando, Lakeland, Sarasota, Ocala and the Nature Coast). Remote help works anywhere in the world.
export const SETUP_AREAS: { region: string; note?: string; cities: string[] }[] = [
  { region: "Tampa & Temple Terrace", note: "Home base", cities: ["Tampa", "Temple Terrace", "Carrollwood", "Town 'n' Country", "Westchase", "Lutz", "Citrus Park", "Northdale", "Thonotosassa", "Seffner"] },
  { region: "St. Pete & Clearwater", cities: ["St. Petersburg", "Clearwater", "Largo", "Pinellas Park", "Seminole", "Dunedin", "Palm Harbor", "Oldsmar", "Safety Harbor", "Tarpon Springs", "Gulfport", "Kenneth City", "St. Pete Beach", "Treasure Island", "Madeira Beach", "Indian Rocks Beach", "Belleair"] },
  { region: "Pasco County", cities: ["Wesley Chapel", "Land O' Lakes", "New Port Richey", "Port Richey", "Holiday", "Hudson", "Zephyrhills", "Dade City", "San Antonio", "Odessa", "Trinity"] },
  { region: "East & South Hillsborough", cities: ["Brandon", "Riverview", "Valrico", "Dover", "Lithia", "FishHawk", "Plant City", "Apollo Beach", "Ruskin", "Sun City Center", "Wimauma", "Gibsonton"] },
  { region: "Orlando & Kissimmee", note: "About 1.5 hours", cities: ["Orlando", "Kissimmee", "Celebration", "Clermont", "Winter Garden", "Ocoee", "Davenport"] },
  { region: "Lakeland & Polk County", cities: ["Lakeland", "Winter Haven", "Bartow", "Auburndale", "Haines City", "Lake Wales", "Mulberry", "Polk City"] },
  { region: "Sarasota & Bradenton", cities: ["Bradenton", "Palmetto", "Parrish", "Ellenton", "Lakewood Ranch", "Sarasota", "Venice", "North Port"] },
  { region: "Ocala & The Villages", note: "About 1.5 hours", cities: ["Ocala", "The Villages", "Leesburg", "Wildwood"] },
  { region: "Nature Coast", cities: ["Spring Hill", "Brooksville", "Weeki Wachee", "Crystal River", "Homosassa", "Inverness"] },
];
export const ALL_SETUP_CITIES = SETUP_AREAS.flatMap((r) => r.cities);

/** How we describe where we work in person, everywhere on the site. */
export const AREA = {
  /** Headline form: "Tampa Bay & Central Florida". */
  name: "Tampa Bay & Central Florida",
  /** Sentence form with the big cities people search for. */
  cities: "Tampa, St. Pete, Clearwater, Orlando, Lakeland and Sarasota",
  /** The rule: how far we drive. */
  reach: "within about 1.5 hours of Temple Terrace, Florida",
} as const;
