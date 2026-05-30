import { useMemo, useState } from "react";
import { Search, SlidersHorizontal, MapPin, Star, BadgeCheck, X } from "lucide-react";
import { Section, Badge } from "../components/ui";
import { VendorCard } from "../components/VendorCard";
import { vendors, categoryEmojis, verificationLabels, type VendorCategory } from "../data/vendors";

export default function Marketplace() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("All");
  const [city, setCity] = useState<string>("All");
  const [budget, setBudget] = useState(10000);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [sort, setSort] = useState<"rating" | "trust" | "price">("rating");
  const [showFilters, setShowFilters] = useState(false);

  const cities = ["All", ...Array.from(new Set(vendors.map((v) => v.city)))];
  const categories = ["All", ...Object.keys(categoryEmojis)];

  const filtered = useMemo(() => {
    let list = vendors.filter((v) => {
      if (category !== "All" && v.category !== category) return false;
      if (city !== "All" && v.city !== city) return false;
      if (verifiedOnly && v.verified < 3) return false;
      if (v.priceFrom > budget) return false;
      if (query) {
        const q = query.toLowerCase();
        return (
          v.name.toLowerCase().includes(q) ||
          v.category.toLowerCase().includes(q) ||
          v.tagline.toLowerCase().includes(q)
        );
      }
      return true;
    });
    if (sort === "rating") list = list.sort((a, b) => b.rating - a.rating);
    if (sort === "trust") list = list.sort((a, b) => b.trustScore - a.trustScore);
    if (sort === "price") list = list.sort((a, b) => a.priceFrom - b.priceFrom);
    return list;
  }, [query, category, city, budget, verifiedOnly, sort]);

  return (
    <div className="bg-cream pb-24">
      <div className="bg-ink py-14 text-cream">
        <Section>
          <Badge variant="coral">2,419 verified vendors</Badge>
          <h1 className="mt-3 font-display text-5xl md:text-6xl">
            Find your perfect
            <br />
            <span className="italic text-coral">vendor match.</span>
          </h1>
          <p className="mt-3 max-w-xl text-cream/60">
            Search by category, location, budget, and trust level. Every vendor is ranked by the Matcher Agent.
          </p>

          <div className="mt-8 flex flex-col gap-3 md:flex-row">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-cream/40" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search photographers, caterers, venues…"
                className="w-full rounded-full border border-cream/10 bg-ink-2 py-3.5 pl-11 pr-4 text-sm text-cream placeholder:text-cream/40 focus:border-coral focus:outline-none"
              />
            </div>
            <button
              onClick={() => setShowFilters((v) => !v)}
              className="flex items-center justify-center gap-2 rounded-full border border-cream/10 bg-ink-2 px-5 py-3.5 text-sm font-semibold text-cream transition hover:border-coral md:hidden"
            >
              <SlidersHorizontal className="h-4 w-4" /> Filters
            </button>
          </div>
        </Section>
      </div>

      <Section className="mt-10">
        <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
          {/* Sidebar */}
          <aside className={`${showFilters ? "block" : "hidden"} lg:block`}>
            <div className="sticky top-24 space-y-6 rounded-2xl border border-ink/10 bg-white p-5">
              <div className="flex items-center justify-between">
                <div className="text-sm font-semibold">Filters</div>
                <button
                  onClick={() => {
                    setCategory("All");
                    setCity("All");
                    setBudget(10000);
                    setVerifiedOnly(false);
                  }}
                  className="text-xs text-ink/50 hover:text-ink"
                >
                  Clear all
                </button>
              </div>

              <FilterGroup label="Category">
                <div className="flex flex-wrap gap-1.5">
                  {categories.map((c) => (
                    <button
                      key={c}
                      onClick={() => setCategory(c)}
                      className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                        category === c ? "border-ink bg-ink text-cream" : "border-ink/10 hover:border-ink/30"
                      }`}
                    >
                      {c === "All" ? "All" : `${categoryEmojis[c as VendorCategory] ?? ""} ${c}`}
                    </button>
                  ))}
                </div>
              </FilterGroup>

              <FilterGroup label="City">
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full rounded-xl border border-ink/10 bg-white px-3 py-2 text-sm"
                >
                  {cities.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </FilterGroup>

              <FilterGroup label={`Max budget · $${budget.toLocaleString()}`}>
                <input
                  type="range"
                  min={500}
                  max={30000}
                  step={500}
                  value={budget}
                  onChange={(e) => setBudget(Number(e.target.value))}
                  className="w-full accent-coral"
                />
                <div className="flex justify-between text-[10px] text-ink/40">
                  <span>$500</span>
                  <span>$30k</span>
                </div>
              </FilterGroup>

              <FilterGroup label="Verification">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={verifiedOnly}
                    onChange={(e) => setVerifiedOnly(e.target.checked)}
                    className="h-4 w-4 accent-coral"
                  />
                  KYC-verified only
                </label>
              </FilterGroup>

              <FilterGroup label="Sort by">
                <div className="grid grid-cols-3 gap-1.5">
                  {(["rating", "trust", "price"] as const).map((s) => (
                    <button
                      key={s}
                      onClick={() => setSort(s)}
                      className={`rounded-lg py-1.5 text-xs font-semibold capitalize transition ${
                        sort === s ? "bg-ink text-cream" : "bg-cream-2 text-ink/70"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </FilterGroup>
            </div>
          </aside>

          {/* Results */}
          <div>
            <div className="mb-4 flex items-center justify-between text-sm text-ink/60">
              <span>
                <span className="font-semibold text-ink">{filtered.length}</span> vendors found
              </span>
              {query && (
                <button
                  onClick={() => setQuery("")}
                  className="flex items-center gap-1 rounded-full bg-ink/5 px-3 py-1 text-xs"
                >
                  <X className="h-3 w-3" /> Clear search
                </button>
              )}
            </div>

            {filtered.length === 0 ? (
              <div className="flex min-h-[400px] items-center justify-center rounded-2xl border border-dashed border-ink/20 bg-white">
                <div className="text-center">
                  <div className="text-4xl">🔎</div>
                  <div className="mt-3 font-display text-xl">No vendors match those filters</div>
                  <div className="text-sm text-ink/50">Try widening your budget or location.</div>
                </div>
              </div>
            ) : (
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {filtered.map((v) => (
                  <VendorCard key={v.id} vendor={v} />
                ))}
              </div>
            )}
          </div>
        </div>
      </Section>
    </div>
  );
}

function FilterGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-ink/50">{label}</div>
      {children}
    </div>
  );
}

export const _unused = { MapPin, Star, BadgeCheck, verificationLabels };
