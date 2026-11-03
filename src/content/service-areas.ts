// Cities served by the home office & computer setup service (Atlanta metro, Gwinnett, Athens, ~50-mile radius).
export const SETUP_AREAS: { region: string; note?: string; cities: string[] }[] = [
  { region: "Atlanta & inner ring", cities: ["Atlanta", "Buckhead", "Midtown", "Decatur", "Brookhaven", "Sandy Springs", "Dunwoody", "Chamblee", "Doraville", "Tucker", "East Point", "College Park", "Hapeville", "Forest Park", "Stone Mountain", "Lithonia"] },
  { region: "Gwinnett County", note: "Home base: Duluth", cities: ["Duluth", "Norcross", "Peachtree Corners", "Lawrenceville", "Suwanee", "Sugar Hill", "Buford", "Snellville", "Lilburn", "Dacula", "Grayson", "Loganville"] },
  { region: "North Fulton & Cobb", cities: ["Alpharetta", "Roswell", "Johns Creek", "Milton", "Marietta", "Smyrna", "Vinings", "Kennesaw", "Acworth", "Woodstock", "Canton", "Mableton", "Austell", "Powder Springs"] },
  { region: "South & west metro", cities: ["Morrow", "Jonesboro", "Riverdale", "Stockbridge", "McDonough", "Fayetteville", "Peachtree City", "Newnan", "Douglasville", "Union City", "Fairburn"] },
  { region: "Athens & east", note: "Athens and up to 2 hours from Duluth for larger jobs", cities: ["Athens", "Winder", "Monroe", "Covington", "Conyers", "Oconee County", "Watkinsville", "Madison"] },
];
export const ALL_SETUP_CITIES = SETUP_AREAS.flatMap((r) => r.cities);
