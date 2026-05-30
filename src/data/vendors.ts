export type VendorCategory =
  | "Photographer"
  | "Caterer"
  | "DJ / MC"
  | "Decorator"
  | "Makeup Artist"
  | "Venue"
  | "Event Planner";

export interface Vendor {
  id: string;
  name: string;
  category: VendorCategory;
  location: string;
  city: string;
  tagline: string;
  description: string;
  rating: number;
  reviewCount: number;
  priceFrom: number;
  priceTo: number;
  verified: 1 | 2 | 3 | 4;
  completionRate: number;
  cancellationRate: number;
  responseTime: string;
  trustScore: number;
  avatar: string;
  cover: string;
  palette: [string, string];
  emoji: string;
  availability: string[]; // ISO dates
  services: string[];
  reviews: { name: string; rating: number; comment: string; date: string }[];
  portfolio: string[];
}

export const vendors: Vendor[] = [
  {
    id: "v1",
    name: "Lumière Studios",
    category: "Photographer",
    location: "Victoria Island",
    city: "Lagos",
    tagline: "Cinematic wedding photography & films",
    description:
      "Award-winning wedding photographers specializing in cinematic storytelling. 400+ weddings shot across West Africa.",
    rating: 4.9,
    reviewCount: 287,
    priceFrom: 850,
    priceTo: 3200,
    verified: 4,
    completionRate: 99,
    cancellationRate: 0,
    responseTime: "< 10 min",
    trustScore: 98,
    avatar: "LS",
    cover: "from-amber-200 via-orange-200 to-rose-200",
    palette: ["#f5b038", "#ff5b3a"],
    emoji: "📸",
    availability: generateAvailability(),
    services: ["Full-day coverage", "Drone footage", "Same-day edit", "Album design"],
    reviews: [
      { name: "Adaeze O.", rating: 5, comment: "Absolutely breathtaking photos. Worth every penny.", date: "2 weeks ago" },
      { name: "Tunde B.", rating: 5, comment: "Professional, punctual, and creative.", date: "1 month ago" },
      { name: "Chika N.", rating: 5, comment: "Made our day magical.", date: "2 months ago" },
    ],
    portfolio: ["🎞️", "📷", "🎥", "🖼️"],
  },
  {
    id: "v2",
    name: "Saffron & Thyme Catering",
    category: "Caterer",
    location: "Lekki Phase 1",
    city: "Lagos",
    tagline: "Contemporary African cuisine for 50–2,000 guests",
    description:
      "Premium catering blending West African flavors with modern technique. Michelin-trained head chef.",
    rating: 4.8,
    reviewCount: 164,
    priceFrom: 45,
    priceTo: 180,
    verified: 4,
    completionRate: 97,
    cancellationRate: 1,
    responseTime: "< 30 min",
    trustScore: 95,
    avatar: "S&T",
    cover: "from-emerald-200 via-lime-200 to-amber-200",
    palette: ["#2f6b4e", "#f5b038"],
    emoji: "🍽️",
    availability: generateAvailability(),
    services: ["Buffet", "Plated service", "Cocktail reception", "Custom menus"],
    reviews: [
      { name: "Ngozi E.", rating: 5, comment: "Food was the highlight of our wedding.", date: "3 weeks ago" },
      { name: "Femi A.", rating: 5, comment: "Impeccable service and presentation.", date: "1 month ago" },
    ],
    portfolio: ["🥘", "🍷", "🍰", "🥂"],
  },
  {
    id: "v3",
    name: "DJ Rhythm Kings",
    category: "DJ / MC",
    location: "Ikoyi",
    city: "Lagos",
    tagline: "Afrobeats, Amapiano & global hits — any crowd, any vibe",
    description:
      "The duo behind 500+ unforgettable nights. Full PA, lighting, and smoke machine included.",
    rating: 4.9,
    reviewCount: 312,
    priceFrom: 600,
    priceTo: 2400,
    verified: 3,
    completionRate: 100,
    cancellationRate: 0,
    responseTime: "< 15 min",
    trustScore: 96,
    avatar: "RK",
    cover: "from-violet-200 via-fuchsia-200 to-pink-200",
    palette: ["#8b5cf6", "#ec4899"],
    emoji: "🎧",
    availability: generateAvailability(),
    services: ["DJ set (6h)", "MC services", "Lighting rig", "Wireless mics"],
    reviews: [
      { name: "Seun K.", rating: 5, comment: "Kept the dancefloor packed till 4am!", date: "1 week ago" },
      { name: "Bola T.", rating: 5, comment: "Perfect song selection for every moment.", date: "3 weeks ago" },
    ],
    portfolio: ["🎤", "🎛️", "🔊", "💿"],
  },
  {
    id: "v4",
    name: "Maison Fleur Decor",
    category: "Decorator",
    location: "Maitama",
    city: "Abuja",
    tagline: "Luxury floral installations & event design",
    description:
      "Transforming spaces into living art. Bespoke installations using fresh & preserved florals.",
    rating: 4.9,
    reviewCount: 198,
    priceFrom: 2500,
    priceTo: 12000,
    verified: 4,
    completionRate: 98,
    cancellationRate: 0,
    responseTime: "< 1 hour",
    trustScore: 97,
    avatar: "MF",
    cover: "from-rose-200 via-pink-200 to-fuchsia-200",
    palette: ["#ec4899", "#f5b038"],
    emoji: "💐",
    availability: generateAvailability(),
    services: ["Ceremony arch", "Reception design", "Hanging installations", "Centerpieces"],
    reviews: [
      { name: "Amaka I.", rating: 5, comment: "Exceeded every expectation. Pure magic.", date: "2 weeks ago" },
    ],
    portfolio: ["🌸", "🌺", "🌷", "🏵️"],
  },
  {
    id: "v5",
    name: "Glow by Ronke",
    category: "Makeup Artist",
    location: "Gbagada",
    city: "Lagos",
    tagline: "Bridal glam that photographs flawlessly",
    description:
      "Celebrity MUA with 10+ years. Specializing in melanin-rich skin and long-wear bridal looks.",
    rating: 4.8,
    reviewCount: 421,
    priceFrom: 250,
    priceTo: 900,
    verified: 3,
    completionRate: 99,
    cancellationRate: 0,
    responseTime: "< 20 min",
    trustScore: 93,
    avatar: "GR",
    cover: "from-pink-200 via-rose-200 to-orange-200",
    palette: ["#f43f5e", "#ff5b3a"],
    emoji: "💄",
    availability: generateAvailability(),
    services: ["Bridal glam", "Bridesmaids", "Trial session", "Touch-up kit"],
    reviews: [
      { name: "Ifeoma U.", rating: 5, comment: "Still glowing 12 hours later!", date: "1 month ago" },
    ],
    portfolio: ["✨", "👰", "💋", "🪞"],
  },
  {
    id: "v6",
    name: "The Grand Orchid Estate",
    category: "Venue",
    location: "Epe",
    city: "Lagos",
    tagline: "1,200-guest garden estate on the lagoon",
    description:
      "Stunning outdoor + indoor venue with bridal suite, generator, and on-site coordination.",
    rating: 4.7,
    reviewCount: 89,
    priceFrom: 8000,
    priceTo: 25000,
    verified: 4,
    completionRate: 100,
    cancellationRate: 0,
    responseTime: "< 2 hours",
    trustScore: 94,
    avatar: "GO",
    cover: "from-emerald-200 via-teal-200 to-cyan-200",
    palette: ["#059669", "#0891b2"],
    emoji: "🏛️",
    availability: generateAvailability(),
    services: ["Ceremony lawn", "Reception hall", "Bridal suite", "Parking (500 cars)"],
    reviews: [
      { name: "Kemi D.", rating: 5, comment: "The most beautiful venue in Lagos, hands down.", date: "1 month ago" },
    ],
    portfolio: ["🌳", "🏛️", "💒", "🌊"],
  },
  {
    id: "v7",
    name: "Platinum Event Co.",
    category: "Event Planner",
    location: "Banana Island",
    city: "Lagos",
    tagline: "Full-service planning for luxury weddings",
    description:
      "End-to-end planning, design, and coordination. 8 years, 600+ events, zero no-shows.",
    rating: 5.0,
    reviewCount: 134,
    priceFrom: 3000,
    priceTo: 15000,
    verified: 4,
    completionRate: 100,
    cancellationRate: 0,
    responseTime: "< 1 hour",
    trustScore: 99,
    avatar: "PE",
    cover: "from-slate-200 via-zinc-200 to-neutral-200",
    palette: ["#0b0b0f", "#f5b038"],
    emoji: "🎩",
    availability: generateAvailability(),
    services: ["Full planning", "Day-of coordination", "Design & styling", "Vendor management"],
    reviews: [
      { name: "Yinka A.", rating: 5, comment: "They took all the stress away. Flawless execution.", date: "2 months ago" },
    ],
    portfolio: ["📋", "💎", "🎯", "🏆"],
  },
  {
    id: "v8",
    name: "AfroBeats Live Band",
    category: "DJ / MC",
    location: "Ikeja",
    city: "Lagos",
    tagline: "9-piece live band — highlife to amapiano",
    description:
      "A full live experience with sax, percussion, and lead vocalists. Unforgettable energy.",
    rating: 4.9,
    reviewCount: 76,
    priceFrom: 3500,
    priceTo: 8000,
    verified: 3,
    completionRate: 96,
    cancellationRate: 2,
    responseTime: "< 1 hour",
    trustScore: 91,
    avatar: "AB",
    cover: "from-amber-200 via-yellow-200 to-orange-200",
    palette: ["#f59e0b", "#f97316"],
    emoji: "🎺",
    availability: generateAvailability(),
    services: ["3-hour set", "6-hour set", "MC included", "Custom song list"],
    reviews: [
      { name: "Dayo O.", rating: 5, comment: "Gave our reception that live-music magic.", date: "3 weeks ago" },
    ],
    portfolio: ["🎷", "🎸", "🥁", "🎹"],
  },
];

function generateAvailability(): string[] {
  const dates: string[] = [];
  const today = new Date();
  for (let i = 3; i < 90; i += 4) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    dates.push(d.toISOString().slice(0, 10));
  }
  return dates;
}

export const categoryEmojis: Record<VendorCategory, string> = {
  Photographer: "📸",
  Caterer: "🍽️",
  "DJ / MC": "🎧",
  Decorator: "💐",
  "Makeup Artist": "💄",
  Venue: "🏛️",
  "Event Planner": "🎩",
};

export const verificationLabels: Record<number, { name: string; color: string }> = {
  1: { name: "Verified", color: "bg-slate-100 text-slate-700" },
  2: { name: "ID Verified", color: "bg-sky-100 text-sky-700" },
  3: { name: "KYC Verified", color: "bg-violet-100 text-violet-700" },
  4: { name: "Elite Vendor", color: "bg-amber-100 text-amber-800 ring-1 ring-amber-300" },
};
