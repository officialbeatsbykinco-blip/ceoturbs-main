// Cities served in person: everywhere within about 40 miles of Temple Terrace (Tampa Bay). Remote help works anywhere in the world.
export const SETUP_AREAS: { region: string; note?: string; cities: string[] }[] = [
  { region: "Tampa", note: "Home base", cities: ["Tampa", "Temple Terrace", "Carrollwood", "Town 'n' Country", "Westchase", "Lutz", "Citrus Park", "Northdale", "Thonotosassa", "Seffner"] },
  { region: "Pinellas County", cities: ["St. Petersburg", "Clearwater", "Largo", "Pinellas Park", "Seminole", "Dunedin", "Palm Harbor", "Oldsmar", "Safety Harbor", "Tarpon Springs", "Gulfport", "Kenneth City", "St. Pete Beach", "Treasure Island", "Madeira Beach", "Indian Rocks Beach", "Belleair"] },
  { region: "Pasco County", cities: ["Wesley Chapel", "Land O' Lakes", "New Port Richey", "Port Richey", "Holiday", "Hudson", "Zephyrhills", "Dade City", "San Antonio", "Odessa", "Trinity"] },
  { region: "East & South Hillsborough", cities: ["Brandon", "Riverview", "Valrico", "Dover", "Lithia", "FishHawk", "Plant City", "Apollo Beach", "Ruskin", "Sun City Center", "Wimauma", "Gibsonton"] },
  { region: "Hernando County", note: "Edge of the 40-mile radius", cities: ["Spring Hill", "Brooksville"] },
  { region: "Polk County", note: "Edge of the 40-mile radius", cities: ["Lakeland", "Mulberry", "Polk City", "Auburndale", "Bartow"] },
  { region: "Manatee County", note: "Edge of the 40-mile radius", cities: ["Parrish", "Ellenton", "Palmetto", "Bradenton"] },
];
export const ALL_SETUP_CITIES = SETUP_AREAS.flatMap((r) => r.cities);
