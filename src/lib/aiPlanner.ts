// AI Event Planner Agent — deterministic plan generator simulating LLM output
// In production, this would call OpenAI/LangChain with structured prompts

export interface PlannerInput {
  eventType: string;
  location: string;
  date: string;
  guests: number;
  budget: number;
  style: "Luxury" | "Standard" | "Budget";
}

export interface PlanLineItem {
  category: string;
  emoji: string;
  allocation: number; // percentage
  amount: number;
  vendorSuggestion: string;
  priority: "Must-have" | "Nice-to-have" | "Optional";
  note: string;
}

export interface EventPlan {
  title: string;
  summary: string;
  lineItems: PlanLineItem[];
  total: number;
  timeline: { phase: string; date: string; task: string; done: boolean }[];
  risks: string[];
  backupVendors: { category: string; name: string; reason: string }[];
  cheaperPlan: PlanLineItem[];
  cheaperTotal: number;
  confidence: number;
}

// Budget allocation templates by style
const allocations = {
  Luxury: {
    Venue: 30,
    Catering: 22,
    Photography: 10,
    "Décor & Florals": 14,
    Entertainment: 9,
    "Hair & Makeup": 4,
    "Attire & Styling": 5,
    Stationery: 2,
    "Planner fee": 4,
  },
  Standard: {
    Venue: 28,
    Catering: 26,
    Photography: 12,
    "Décor & Florals": 11,
    Entertainment: 8,
    "Hair & Makeup": 4,
    "Attire & Styling": 4,
    Stationery: 2,
    "Planner fee": 5,
  },
  Budget: {
    Venue: 25,
    Catering: 30,
    Photography: 13,
    "Décor & Florals": 9,
    Entertainment: 8,
    "Hair & Makeup": 5,
    "Attire & Styling": 5,
    Stationery: 1,
    "Planner fee": 4,
  },
};

const emojis: Record<string, string> = {
  Venue: "🏛️",
  Catering: "🍽️",
  Photography: "📸",
  "Décor & Florals": "💐",
  Entertainment: "🎧",
  "Hair & Makeup": "💄",
  "Attire & Styling": "👗",
  Stationery: "✉️",
  "Planner fee": "🎩",
};

const vendorSuggestions: Record<string, string[]> = {
  Venue: ["The Grand Orchid Estate", "Eko Gardens", "Terra Kulture"],
  Catering: ["Saffron & Thyme Catering", "The Place Kitchen", "Spice Route"],
  Photography: ["Lumière Studios", "Frame & Focus", "Naija Lens Co."],
  "Décor & Florals": ["Maison Fleur Decor", "Bloom Atelier", "Petal & Pine"],
  Entertainment: ["DJ Rhythm Kings", "AfroBeats Live Band", "Soundwave DJs"],
  "Hair & Makeup": ["Glow by Ronke", "Zara Beauty Co.", "The MUA Collective"],
  "Attire & Styling": ["House of Deola", "Mai Atafo", "Rich Mnina"],
  Stationery: ["Paper & Ink Studio", "Blush Invites"],
  "Planner fee": ["Platinum Event Co.", "The Event Architects"],
};

const priorities: Record<string, PlanLineItem["priority"]> = {
  Venue: "Must-have",
  Catering: "Must-have",
  Photography: "Must-have",
  "Décor & Florals": "Nice-to-have",
  Entertainment: "Must-have",
  "Hair & Makeup": "Nice-to-have",
  "Attire & Styling": "Nice-to-have",
  Stationery: "Optional",
  "Planner fee": "Must-have",
};

const notes: Record<string, string> = {
  Venue: "Confirm capacity matches guest count + 10% buffer",
  Catering: "Includes tasting session and dietary accommodations",
  Photography: "Book 6+ months ahead for peak season",
  "Décor & Florals": "Fresh florals drive cost — silk alternatives cut 40%",
  Entertainment: "Includes lighting rig and MC coordination",
  "Hair & Makeup": "Trial session recommended 4 weeks prior",
  "Attire & Styling": "Allow 3 fittings minimum",
  Stationery: "Digital invites cut cost to ~$200",
  "Planner fee": "Full-service includes day-of coordination",
};

export function generatePlan(input: PlannerInput): EventPlan {
  const template = allocations[input.style] ?? allocations.Standard;
  const cheaperMultiplier = 0.72;

  const lineItems: PlanLineItem[] = Object.entries(template).map(([category, pct]) => {
    const amount = Math.round((input.budget * pct) / 100);
    const suggestions = vendorSuggestions[category] ?? [];
    return {
      category,
      emoji: emojis[category] ?? "•",
      allocation: pct,
      amount,
      vendorSuggestion: suggestions[Math.floor(Math.random() * suggestions.length)] ?? "AI-matched vendor",
      priority: priorities[category] ?? "Optional",
      note: notes[category] ?? "",
    };
  });

  const cheaperPlan: PlanLineItem[] = lineItems.map((item) => {
    if (item.priority === "Must-have") return { ...item, amount: Math.round(item.amount * 0.85) };
    if (item.priority === "Optional") return { ...item, amount: Math.round(item.amount * 0.4) };
    return { ...item, amount: Math.round(item.amount * cheaperMultiplier) };
  });

  const cheaperTotal = cheaperPlan.reduce((sum, i) => sum + i.amount, 0);

  const eventDate = new Date(input.date);
  const timeline = buildTimeline(eventDate, input.eventType);

  const risks = buildRisks(input);

  const backupVendors = [
    { category: "Venue", name: "Eko Gardens", reason: "Available same date, 5% cheaper" },
    { category: "Photography", name: "Frame & Focus", reason: "Same style, backup team of 4" },
    { category: "Catering", name: "The Place Kitchen", reason: "Instant booking confirmation" },
  ];

  const titles: Record<string, string> = {
    Wedding: `${input.style} Wedding Blueprint`,
    Birthday: `${input.style} Birthday Experience`,
    Corporate: `${input.style} Corporate Event Plan`,
  };

  const confidence = input.budget > 20000 ? 94 : input.budget > 5000 ? 89 : 82;

  return {
    title: titles[input.eventType] ?? `${input.style} Event Plan`,
    summary: `Based on ${input.guests} guests in ${input.location}, a ${input.style.toLowerCase()} ${input.eventType.toLowerCase()} typically runs ${formatRange(input.budget, input.style)}. Your ${input.budget.toLocaleString("en-US", { style: "currency", currency: "USD" })} budget supports the plan below with ${confidence}% confidence, with ${cheaperTotal < input.budget ? `${formatUSD(input.budget - cheaperTotal)} buffer` : "tight margin"}.`,
    lineItems,
    total: lineItems.reduce((s, i) => s + i.amount, 0),
    timeline,
    risks,
    backupVendors,
    cheaperPlan,
    cheaperTotal,
    confidence,
  };
}

function buildTimeline(eventDate: Date, _type: string): EventPlan["timeline"] {
  const now = new Date();
  const weeksOut = Math.max(4, Math.ceil((eventDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24 * 7)));

  const fmt = (offsetWeeks: number) => {
    const d = new Date(eventDate);
    d.setDate(eventDate.getDate() - offsetWeeks * 7);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const base = [
    { phase: "Foundation", task: "Lock venue & date", offset: Math.min(weeksOut - 1, 24) },
    { phase: "Foundation", task: "Book planner & photographer", offset: Math.min(weeksOut - 1, 20) },
    { phase: "Design", task: "Finalize theme, palette, guest list", offset: Math.min(weeksOut - 1, 16) },
    { phase: "Design", task: "Book caterer, décor, entertainment", offset: Math.min(weeksOut - 1, 12) },
    { phase: "Build", task: "Send invitations, collect RSVPs", offset: Math.min(weeksOut - 1, 8) },
    { phase: "Build", task: "Final payments & vendor check-ins", offset: 2 },
    { phase: "Execute", task: "Rehearsal & day-of", offset: 0 },
  ];

  return base.map((item, idx) => ({
    phase: item.phase,
    task: item.task,
    date: fmt(item.offset),
    done: idx < 2,
  }));
}

function buildRisks(input: PlannerInput): string[] {
  const risks: string[] = [];
  if (input.budget < 5000 && input.guests > 100) {
    risks.push(`⚠️ Budget may be tight for ${input.guests} guests — consider capping at ${Math.floor(input.budget / 60)} guests or upgrading budget.`);
  }
  if (input.style === "Luxury" && input.budget < 20000) {
    risks.push("⚠️ Luxury tier with this budget will require strategic trade-offs in décor or attire.");
  }
  risks.push("🌧️ Outdoor events need a rain-plan vendor on standby (+3% buffer).");
  risks.push("📅 Peak-season dates (Dec–Feb) book 9+ months out — lock key vendors ASAP.");
  return risks;
}

function formatRange(budget: number, style: string): string {
  if (style === "Luxury") return `$${Math.round(budget * 0.9).toLocaleString()}–$${Math.round(budget * 1.15).toLocaleString()}`;
  if (style === "Standard") return `$${Math.round(budget * 0.85).toLocaleString()}–$${Math.round(budget * 1.05).toLocaleString()}`;
  return `$${Math.round(budget * 0.8).toLocaleString()}–$${Math.round(budget).toLocaleString()}`;
}

function formatUSD(n: number) {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}
