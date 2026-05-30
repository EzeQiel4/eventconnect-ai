export interface EventPackage {
  id: string;
  name: string;
  tier: "Standard" | "Premium" | "Luxury";
  price: number;
  originalPrice: number;
  eventType: string;
  guestCount: string;
  duration: string;
  emoji: string;
  cover: string;
  includes: string[];
  plannerName: string;
  rating: number;
  bookings: number;
}

export const packages: EventPackage[] = [
  {
    id: "p1",
    name: "Royal Wedding — All Inclusive",
    tier: "Luxury",
    price: 42000,
    originalPrice: 51000,
    eventType: "Wedding",
    guestCount: "300–500",
    duration: "2 days",
    emoji: "👑",
    cover: "from-amber-200 via-orange-200 to-rose-200",
    includes: [
      "Venue (Grand Orchid Estate)",
      "Catering (3-course plated)",
      "Photography & videography",
      "Full décor & florals",
      "Live band + DJ",
      "Bridal glam for bride + 4",
      "Event planner",
      "MC",
    ],
    plannerName: "Platinum Event Co.",
    rating: 4.9,
    bookings: 48,
  },
  {
    id: "p2",
    name: "Sweet 21 Birthday Bash",
    tier: "Premium",
    price: 8500,
    originalPrice: 10200,
    eventType: "Birthday",
    guestCount: "80–150",
    duration: "1 evening",
    emoji: "🎂",
    cover: "from-pink-200 via-fuchsia-200 to-violet-200",
    includes: [
      "Venue",
      "Catering (buffet)",
      "DJ + lighting",
      "Balloon décor",
      "Photographer",
      "Cake",
    ],
    plannerName: "Platinum Event Co.",
    rating: 4.8,
    bookings: 92,
  },
  {
    id: "p3",
    name: "Corporate Launch — Executive",
    tier: "Premium",
    price: 14500,
    originalPrice: 17000,
    eventType: "Corporate",
    guestCount: "150–300",
    duration: "Half day",
    emoji: "🏢",
    cover: "from-slate-200 via-zinc-200 to-sky-200",
    includes: [
      "Conference venue",
      "Cocktail catering",
      "AV & staging",
      "Photographer",
      "MC",
      "Branding setup",
    ],
    plannerName: "Platinum Event Co.",
    rating: 4.9,
    bookings: 63,
  },
  {
    id: "p4",
    name: "Intimate Garden Wedding",
    tier: "Standard",
    price: 11000,
    originalPrice: 13500,
    eventType: "Wedding",
    guestCount: "80–150",
    duration: "1 day",
    emoji: "🌿",
    cover: "from-emerald-200 via-lime-200 to-amber-200",
    includes: [
      "Garden venue",
      "Catering",
      "Photography",
      "Floral décor",
      "DJ",
      "Day-of coordinator",
    ],
    plannerName: "Platinum Event Co.",
    rating: 4.8,
    bookings: 71,
  },
];
