import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Sparkles,
  Users,
  Wallet,
  Star,
  ShieldCheck,
  Check,
  ArrowRight,
  Zap,
  TrendingUp,
} from "lucide-react";
import { Section, Badge, Card, Button } from "../components/ui";
import { matchVendors, type MatchInput, type VendorMatch } from "../lib/vendorMatching";
import { computeTrust } from "../store/usePlatformStore";
import { useApp } from "../context/AppContext";

const defaults: MatchInput = {
  eventType: "Wedding",
  location: "Lagos, Nigeria",
  guests: 300,
  budget: 15000,
  date: "2026-09-14",
};

export default function VendorMatching() {
  const { confirmBooking } = useApp();
  const [input, setInput] = useState<MatchInput>(defaults);
  const [matching, setMatching] = useState(false);
  const [generated, setGenerated] = useState(true);
  const [picks, setPicks] = useState<Record<string, string>>({});

  const matches = useMemo(() => (generated ? matchVendors(input, 3) : []), [generated, input]);
  const byCategory = useMemo(() => {
    const map: Record<string, VendorMatch[]> = {};
    for (const m of matches) (map[m.category] ??= []).push(m);
    return map;
  }, [matches]);

  const selectedMatches = matches.filter((m) => picks[m.category] === m.vendor.id);
  const selectedTotal = selectedMatches.reduce((s, m) => s + m.estimatedCost, 0);

  const regenerate = () => {
    setMatching(true);
    setTimeout(() => {
      setMatching(false);
      setGenerated(true);
    }, 900);
  };

  const bookAll = () => {
    for (const m of selectedMatches) {
      confirmBooking({
        vendorId: m.vendor.id,
        vendorName: m.vendor.name,
        category: m.category,
        amount: m.estimatedCost,
        date: input.date,
        status: "Pending",
        clientName: "You",
      });
    }
    setPicks({});
  };

  return (
    <div className="bg-cream pb-20">
      <Section className="pt-10">
        <div className="grid gap-8 lg:grid-cols-[1fr_1.4fr]">
          <div>
            <Badge variant="coral">
              <Sparkles className="h-3 w-3" /> AI Vendor Matching
            </Badge>
            <h1 className="mt-3 font-display text-4xl md:text-5xl">
              Your event,
              <br />
              <span className="italic text-coral">curated by AI.</span>
            </h1>
            <p className="mt-2 max-w-md text-ink/60">
              Tell us about your event. We rank thousands of vendors by budget fit, location, availability, trust score, and reviews — instantly.
            </p>

            <div className="mt-8 space-y-6">
              <div className="rounded-2xl border border-slate-200 bg-white shadow-lg shadow-slate-200/50 dark:border-slate-800 dark:bg-slate-900 dark:shadow-none overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr_auto_1fr] items-center p-2">
                  
                  {/* Event Type */}
                  <div className="p-4 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors group">
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 group-hover:text-indigo-500 transition-colors">Event Type</label>
                    <select
                      value={input.eventType}
                      onChange={(e) => setInput({ ...input, eventType: e.target.value })}
                      className="w-full mt-1 bg-transparent text-sm font-semibold text-slate-900 dark:text-white outline-none cursor-pointer appearance-none"
                    >
                      {["Wedding", "Birthday", "Corporate", "Custom"].map((t) => (
                        <option key={t} className="text-slate-900">{t}</option>
                      ))}
                    </select>
                  </div>

                  <div className="hidden md:block h-8 w-px bg-slate-200 dark:bg-slate-700" />

                  {/* Location */}
                  <div className="p-4 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors group">
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 group-hover:text-indigo-500 transition-colors">Where</label>
                    <input
                      value={input.location}
                      onChange={(e) => setInput({ ...input, location: e.target.value })}
                      placeholder="City or Venue"
                      className="w-full mt-1 bg-transparent text-sm font-semibold text-slate-900 dark:text-white outline-none placeholder:text-slate-300"
                    />
                  </div>

                  <div className="hidden md:block h-8 w-px bg-slate-200 dark:bg-slate-700" />

                  {/* Date */}
                  <div className="p-4 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors group">
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 group-hover:text-indigo-500 transition-colors">When</label>
                    <input
                      type="date"
                      value={input.date}
                      onChange={(e) => setInput({ ...input, date: e.target.value })}
                      className="w-full mt-1 bg-transparent text-sm font-semibold text-slate-900 dark:text-white outline-none cursor-pointer"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr_auto_auto] items-center p-2 border-t border-slate-100 dark:border-slate-800">
                  {/* Guests */}
                  <div className="p-4 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors group">
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 group-hover:text-indigo-500 transition-colors">Guests</label>
                    <div className="flex items-center gap-2 mt-1">
                      <input
                        type="number"
                        value={input.guests}
                        onChange={(e) => setInput({ ...input, guests: Number(e.target.value) })}
                        className="w-full bg-transparent text-sm font-semibold text-slate-900 dark:text-white outline-none"
                      />
                      <Users className="h-3.5 w-3.5 text-slate-300" />
                    </div>
                  </div>

                  <div className="hidden md:block h-8 w-px bg-slate-200 dark:bg-slate-700" />

                  {/* Budget */}
                  <div className="p-4 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors group">
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 group-hover:text-indigo-500 transition-colors">Budget (USD)</label>
                    <div className="flex items-center gap-2 mt-1">
                      <input
                        type="number"
                        value={input.budget}
                        onChange={(e) => setInput({ ...input, budget: Number(e.target.value) })}
                        className="w-full bg-transparent text-sm font-semibold text-slate-900 dark:text-white outline-none"
                      />
                      <Wallet className="h-3.5 w-3.5 text-slate-300" />
                    </div>
                  </div>

                  <div className="p-2">
                    <Button 
                      variant="primary" 
                      size="lg"
                      className="w-full md:w-auto h-12 px-8 shadow-indigo-200 dark:shadow-none"
                      onClick={regenerate}
                    >
                      {matching ? (
                        <div className="flex items-center gap-2">
                          <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>Matching...</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Sparkles className="h-4 w-4" />
                          <span>Find Vendors</span>
                        </div>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {selectedMatches.length > 0 && (
              <Card className="mt-4 bg-ink p-5 text-cream">
                <div className="flex items-center gap-2 text-xs">
                  <Check className="h-3.5 w-3.5 text-coral" /> {selectedMatches.length} vendor{selectedMatches.length > 1 ? "s" : ""} selected
                </div>
                <div className="mt-2 font-display text-3xl">${selectedTotal.toLocaleString()}</div>
                <div className="mt-1 text-xs text-cream/60">
                  {((selectedTotal / input.budget) * 100).toFixed(0)}% of your ${input.budget.toLocaleString()} budget
                </div>
                <Button variant="primary" className="mt-4 w-full !bg-coral" onClick={bookAll}>
                  Book all selected <ArrowRight className="h-4 w-4" />
                </Button>
              </Card>
            )}
          </div>

          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-display text-2xl">AI-recommended stack</h2>
                <p className="text-sm text-ink/60">{matches.length} vendors across {Object.keys(byCategory).length} categories.</p>
              </div>
              <Link to="/marketplace" className="text-xs font-semibold text-coral hover:underline">
                Browse all vendors →
              </Link>
            </div>

            {Object.entries(byCategory).map(([category, list]) => (
              <Card key={category} className="overflow-hidden">
                <div className="flex items-center justify-between border-b border-ink/10 bg-cream-2 px-5 py-3">
                  <div className="flex items-center gap-2 text-sm font-semibold">
                    {category}
                  </div>
                  <div className="text-xs text-ink/50">{list.length} match{list.length > 1 ? "es" : ""}</div>
                </div>
                <div className="divide-y divide-ink/5">
                  {list.map((m) => {
                    const trust = computeTrust(m.vendor.id);
                    const isPicked = picks[m.category] === m.vendor.id;
                    return (
                      <div
                        key={m.vendor.id}
                        className={`grid gap-4 p-4 transition md:grid-cols-[auto_1fr_auto] md:items-center ${
                          isPicked ? "bg-coral/5" : ""
                        }`}
                      >
                        <div className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${m.vendor.cover} text-2xl`}>
                          {m.vendor.emoji}
                        </div>
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-semibold">{m.vendor.name}</span>
                            <span className="rounded-full bg-coral/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-coral">
                              {m.matchPct}% match
                            </span>
                            <span className="flex items-center gap-0.5 text-xs text-ink/60">
                              <Star className="h-3 w-3 fill-amber text-amber" /> {m.vendor.rating}
                            </span>
                            {trust.total >= 90 && (
                              <span className="flex items-center gap-0.5 text-xs text-sage">
                                <ShieldCheck className="h-3 w-3" /> {trust.total}
                              </span>
                            )}
                          </div>
                          <div className="mt-0.5 text-xs text-ink/50">
                            {m.vendor.city} · {m.vendor.tagline}
                          </div>
                          <div className="mt-1.5 flex flex-wrap gap-1">
                            {m.reasons.map((r) => (
                              <span key={r} className="rounded-full bg-ink/5 px-2 py-0.5 text-[10px] text-ink/60">
                                {r}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="flex items-center gap-3 md:flex-col md:items-end">
                          <div className="text-right">
                            <div className="font-display text-lg">${m.estimatedCost.toLocaleString()}</div>
                            <div className={`text-[10px] ${m.available ? "text-sage" : "text-amber-700"}`}>
                              {m.available ? "Available" : "Check dates"}
                            </div>
                          </div>
                          <button
                            onClick={() => setPicks((p) => ({ ...p, [m.category]: isPicked ? "" : m.vendor.id }))}
                            className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                              isPicked ? "bg-ink text-cream" : "bg-coral text-white hover:-translate-y-0.5"
                            }`}
                          >
                            {isPicked ? "Selected" : "Pick"}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card>
            ))}

            <Card className="bg-cream-2 p-5">
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-coral text-white">
                  <Zap className="h-4 w-4" />
                </div>
                <div className="text-sm">
                  <div className="font-semibold">How AI matching works</div>
                  <p className="mt-1 text-ink/60">
                    We weight trust score (30%), budget fit (24%), availability (18%), location (18%), and guest-count fit (10%). Vendors on Pro/Premium subscriptions get small ranking boosts. <Link to="/budget-optimizer" className="font-semibold text-coral hover:underline">Optimize my budget →</Link>
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-5">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-ink/50">
                <TrendingUp className="h-3.5 w-3.5" /> Total recommended stack
              </div>
              <div className="mt-2 flex items-end justify-between">
                <div>
                  <div className="font-display text-3xl">${matches.reduce((s, m) => s + m.estimatedCost, 0).toLocaleString()}</div>
                  <div className="text-xs text-ink/50">All {matches.length} recommendations</div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-ink/50">Your budget</div>
                  <div className="font-display text-2xl">${input.budget.toLocaleString()}</div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </Section>
    </div>
  );
}

function Field({ label, icon, children }: { label: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-ink/10 bg-cream-2 px-3 py-2">
      <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-ink/50">
        {icon} {label}
      </div>
      <div className="mt-1 text-sm">{children}</div>
    </div>
  );
}
