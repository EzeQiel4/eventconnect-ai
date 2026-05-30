import { vendors, type Vendor } from "../data/vendors";
import { computeTrust, usePlatformStore } from "../store/usePlatformStore";

export interface MatchInput {
  eventType: string;
  location: string;
  guests: number;
  budget: number;
  date: string;
  preferences?: string[];
}

export interface VendorMatch {
  vendor: Vendor;
  category: string;
  matchPct: number;
  estimatedCost: number;
  available: boolean;
  reasons: string[];
}

// Category allocations for AI matching (% of total budget per category)
const allocationByCategory: Record<string, number> = {
  Venue: 28,
  Caterer: 26,
  Photographer: 11,
  Videographer: 6,
  Decorator: 12,
  "DJ / MC": 7,
  "Makeup Artist": 4,
  "Event Planner": 5,
};

function locationScore(v: Vendor, target: string): number {
  if (!target) return 0.85;
  const targetCity = target.split(",")[0].trim().toLowerCase();
  return v.city.toLowerCase() === targetCity ? 1 : 0.55;
}

function budgetScore(v: Vendor, budgetForCategory: number): { score: number; estimated: number } {
  if (budgetForCategory <= 0) return { score: 0, estimated: v.priceFrom };
  // Estimate vendor cost in the band — clamp to vendor range
  const estimated = Math.max(v.priceFrom, Math.min(v.priceTo, budgetForCategory));
  if (v.priceFrom > budgetForCategory * 1.3) return { score: 0.35, estimated }; // over budget
  if (v.priceFrom > budgetForCategory) return { score: 0.7, estimated };
  if (v.priceTo < budgetForCategory * 0.6) return { score: 0.85, estimated }; // very cheap
  return { score: 1, estimated };
}

function availabilityScore(v: Vendor, date: string): boolean {
  if (!date) return true;
  return v.availability.includes(date);
}

function guestFitScore(v: Vendor, guests: number): number {
  // Larger vendors handle bigger guest counts better; use review count as a proxy
  if (guests > 400 && v.reviewCount < 100) return 0.75;
  if (guests < 50 && v.priceFrom > 5000) return 0.7;
  return 1;
}

export function matchVendors(input: MatchInput, topPerCategory = 2): VendorMatch[] {
  const subs = usePlatformStore.getState().subscriptions;

  const results: VendorMatch[] = [];

  for (const [category, pct] of Object.entries(allocationByCategory)) {
    const pool = vendors.filter((v) => v.category === category);
    if (pool.length === 0) continue;
    const catBudget = (input.budget * pct) / 100;

    const scored = pool.map((v) => {
      const loc = locationScore(v, input.location);
      const { score: bud, estimated } = budgetScore(v, catBudget);
      const avail = availabilityScore(v, input.date) ? 1 : 0.5;
      const guest = guestFitScore(v, input.guests);
      const trust = computeTrust(v.id).total / 100;
      const sub = subs.find((s) => s.vendorId === v.id);
      const priorityBoost = sub?.priorityRanking ? 1.06 : sub?.featuredListing ? 1.03 : 1;
      // weighted match score
      const raw =
        (loc * 0.18 + bud * 0.24 + avail * 0.18 + guest * 0.1 + trust * 0.3) * priorityBoost;
      const matchPct = Math.max(45, Math.min(99, Math.round(raw * 100)));
      const reasons: string[] = [];
      if (loc === 1) reasons.push("Local to your event city");
      if (bud === 1) reasons.push("Fits your category budget");
      if (avail === 1) reasons.push("Available on your date");
      if (trust > 0.9) reasons.push("Top trust score");
      if (sub?.featuredListing) reasons.push("Featured partner");
      return {
        vendor: v,
        category,
        matchPct,
        estimatedCost: Math.round(estimated),
        available: availabilityScore(v, input.date),
        reasons,
      } as VendorMatch;
    });

    scored.sort((a, b) => b.matchPct - a.matchPct);
    results.push(...scored.slice(0, topPerCategory));
  }

  return results;
}

// Smart marketplace ranking — used everywhere a list of vendors is shown
export function rankVendors(input: { vendors: Vendor[]; date?: string; budget?: number }): Vendor[] {
  const subs = usePlatformStore.getState().subscriptions;
  return [...input.vendors].sort((a, b) => {
    const subA = subs.find((s) => s.vendorId === a.id);
    const subB = subs.find((s) => s.vendorId === b.id);
    const boostA = subA?.priorityRanking ? 12 : subA?.featuredListing ? 6 : 0;
    const boostB = subB?.priorityRanking ? 12 : subB?.featuredListing ? 6 : 0;
    const trustA = computeTrust(a.id).total + boostA;
    const trustB = computeTrust(b.id).total + boostB;
    return trustB - trustA;
  });
}

// Savings opportunities — drives the Budget Optimizer page
export interface SavingsOpportunity {
  id: string;
  category: string;
  current: string;
  recommended: string;
  saves: number;
  rationale: string;
}

export function findSavings(input: MatchInput): { opportunities: SavingsOpportunity[]; totalSavings: number; warnings: string[] } {
  const opportunities: SavingsOpportunity[] = [];
  const warnings: string[] = [];

  for (const [category, pct] of Object.entries(allocationByCategory)) {
    const pool = vendors.filter((v) => v.category === category);
    if (pool.length < 2) continue;
    const ranked = [...pool].sort((a, b) => a.priceFrom - b.priceFrom);
    const premium = [...pool].sort((a, b) => b.priceFrom - a.priceFrom)[0];
    const value = ranked[0];
    const trustValue = computeTrust(value.id).total;
    if (premium.priceFrom - value.priceFrom < 200 || trustValue < 80) continue;
    const catBudget = (input.budget * pct) / 100;
    if (premium.priceFrom > catBudget) {
      opportunities.push({
        id: `op-${category}`,
        category,
        current: premium.name,
        recommended: value.name,
        saves: Math.round(premium.priceFrom - value.priceFrom),
        rationale: `Same category, trust score ${trustValue}+, available on your date.`,
      });
    }
  }

  // Guest-count optimization
  if (input.guests > 250) {
    opportunities.push({
      id: "op-guests",
      category: "Guest list",
      current: `${input.guests} guests`,
      recommended: `${Math.round(input.guests * 0.85)} guests`,
      saves: Math.round(input.budget * 0.06),
      rationale: "Trim guest list 15% — biggest lever on catering and venue.",
    });
  }

  if (input.budget / input.guests < 60) {
    warnings.push(`Tight budget per head ($${Math.round(input.budget / input.guests)}). Consider increasing budget or reducing guest count.`);
  }
  if (input.budget > 50000 && input.guests < 100) {
    warnings.push("High budget per guest — consider redirecting savings to experiences or favors.");
  }

  const totalSavings = opportunities.reduce((s, o) => s + o.saves, 0);
  return { opportunities, totalSavings, warnings };
}
