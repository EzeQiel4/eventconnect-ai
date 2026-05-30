import { useMemo, useState } from "react";
import { Sparkles, TrendingDown, AlertTriangle, ArrowRight, Wallet, Lightbulb, Check } from "lucide-react";
import { Section, Badge, Card, Button } from "../components/ui";
import { findSavings, type MatchInput } from "../lib/vendorMatching";

const defaults: MatchInput = {
  eventType: "Wedding",
  location: "Lagos, Nigeria",
  guests: 300,
  budget: 15000,
  date: "2026-09-14",
};

export default function BudgetOptimizer() {
  const [input, setInput] = useState<MatchInput>(defaults);
  const [appliedIds, setAppliedIds] = useState<Set<string>>(new Set());

  const { opportunities, totalSavings, warnings } = useMemo(() => findSavings(input), [input]);

  const applied = opportunities.filter((o) => appliedIds.has(o.id));
  const appliedSavings = applied.reduce((s, o) => s + o.saves, 0);
  const optimizedBudget = input.budget - appliedSavings;

  const toggle = (id: string) =>
    setAppliedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  return (
    <div className="bg-cream pb-20">
      <Section className="pt-10">
        <Badge variant="coral">
          <Sparkles className="h-3 w-3" /> AI Budget Intelligence
        </Badge>
        <h1 className="mt-3 font-display text-4xl md:text-5xl">Save more, spend smarter.</h1>
        <p className="mt-1 max-w-xl text-ink/60">
          AI analyzes your event budget against thousands of similar bookings to surface savings opportunities — without compromising quality.
        </p>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_1.5fr]">
          {/* Inputs + summary */}
          <div className="space-y-5">
            <Card className="p-5">
              <h3 className="font-display text-lg">Your event</h3>
              <div className="mt-4 space-y-3 text-sm">
                <Slider
                  label="Budget"
                  value={input.budget}
                  min={1000}
                  max={100000}
                  step={500}
                  format={(v) => `$${v.toLocaleString()}`}
                  onChange={(v) => setInput({ ...input, budget: v })}
                />
                <Slider
                  label="Guests"
                  value={input.guests}
                  min={20}
                  max={2000}
                  step={10}
                  format={(v) => `${v}`}
                  onChange={(v) => setInput({ ...input, guests: v })}
                />
                <div className="mt-2 rounded-xl bg-cream-2 p-3 text-xs text-ink/60">
                  <span className="font-semibold">Per guest:</span> ${Math.round(input.budget / input.guests)}
                  {input.budget / input.guests < 60 && " · Budget tier"}
                  {input.budget / input.guests >= 60 && input.budget / input.guests < 150 && " · Standard tier"}
                  {input.budget / input.guests >= 150 && " · Luxury tier"}
                </div>
              </div>
            </Card>

            <Card className="bg-gradient-to-br from-coral to-amber p-5 text-white">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider">
                <TrendingDown className="h-3.5 w-3.5" /> Potential savings
              </div>
              <div className="mt-2 font-display text-4xl">${totalSavings.toLocaleString()}</div>
              <div className="text-xs text-white/80">{opportunities.length} opportunities identified</div>
              <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/20">
                <div
                  className="h-full bg-white transition-all"
                  style={{ width: `${Math.min(100, (appliedSavings / Math.max(1, totalSavings)) * 100)}%` }}
                />
              </div>
              <div className="mt-1 text-[11px] text-white/80">
                ${appliedSavings.toLocaleString()} saved · {applied.length} of {opportunities.length} applied
              </div>
            </Card>

            <Card className="p-5">
              <div className="flex items-center justify-between text-sm">
                <span className="text-ink/60">Original budget</span>
                <span className="font-display text-lg">${input.budget.toLocaleString()}</span>
              </div>
              <div className="mt-2 flex items-center justify-between text-sm">
                <span className="text-ink/60">Applied savings</span>
                <span className="font-display text-lg text-sage">−${appliedSavings.toLocaleString()}</span>
              </div>
              <div className="mt-2 border-t border-ink/10 pt-2 flex items-center justify-between">
                <span className="text-sm font-semibold">Optimized budget</span>
                <span className="font-display text-2xl text-coral">${optimizedBudget.toLocaleString()}</span>
              </div>
            </Card>
          </div>

          {/* Opportunities */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-2xl">Recommendations</h3>
              <Badge variant="sage">{opportunities.length} found</Badge>
            </div>

            {opportunities.length === 0 && (
              <Card className="p-8 text-center text-sm text-ink/60">
                Your budget looks well-optimized! Try adjusting inputs for more recommendations.
              </Card>
            )}

            {opportunities.map((o) => {
              const isApplied = appliedIds.has(o.id);
              return (
                <Card
                  key={o.id}
                  className={`overflow-hidden transition ${isApplied ? "ring-2 ring-sage" : ""}`}
                >
                  <div className="grid gap-0 md:grid-cols-[1fr_auto]">
                    <div className="p-5">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant="amber">{o.category}</Badge>
                        <span className="text-xs font-semibold uppercase tracking-wider text-sage">
                          Save ${o.saves.toLocaleString()}
                        </span>
                      </div>
                      <div className="mt-3 grid gap-3 md:grid-cols-[1fr_auto_1fr] md:items-center">
                        <div>
                          <div className="text-xs text-ink/50">Current</div>
                          <div className="font-semibold line-through decoration-coral/40">{o.current}</div>
                        </div>
                        <ArrowRight className="hidden h-4 w-4 text-ink/30 md:block" />
                        <div>
                          <div className="text-xs text-ink/50">Recommended</div>
                          <div className="font-semibold text-coral">{o.recommended}</div>
                        </div>
                      </div>
                      <p className="mt-3 text-sm text-ink/60">
                        <Lightbulb className="mr-1 inline h-3.5 w-3.5 text-amber-600" />
                        {o.rationale}
                      </p>
                    </div>
                    <div className="flex items-center justify-end gap-2 border-t border-ink/5 p-4 md:border-l md:border-t-0">
                      <Button
                        variant={isApplied ? "outline" : "primary"}
                        className="!rounded-xl"
                        onClick={() => toggle(o.id)}
                      >
                        {isApplied ? (
                          <>
                            <Check className="h-4 w-4" /> Applied
                          </>
                        ) : (
                          "Apply"
                        )}
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })}

            {warnings.length > 0 && (
              <Card className="border-amber-300/40 bg-amber-50 p-5">
                <div className="flex items-center gap-2 text-sm font-semibold text-amber-900">
                  <AlertTriangle className="h-4 w-4" /> Budget warnings
                </div>
                <ul className="mt-2 space-y-1.5 text-sm text-amber-900/80">
                  {warnings.map((w) => (
                    <li key={w}>· {w}</li>
                  ))}
                </ul>
              </Card>
            )}

            <Card className="bg-ink p-5 text-cream">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider">
                <Wallet className="h-3.5 w-3.5 text-coral" /> Cost forecast
              </div>
              <div className="mt-2 grid grid-cols-3 gap-3 text-sm">
                <div>
                  <div className="text-cream/60">Conservative</div>
                  <div className="font-display text-xl">${Math.round(optimizedBudget * 1.08).toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-cream/60">Expected</div>
                  <div className="font-display text-xl text-coral">${optimizedBudget.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-cream/60">Stretch goal</div>
                  <div className="font-display text-xl">${Math.round(optimizedBudget * 0.92).toLocaleString()}</div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </Section>
    </div>
  );
}

function Slider({
  label,
  value,
  min,
  max,
  step,
  format,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  format: (v: number) => string;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-ink/50">{label}</span>
        <span className="font-display text-lg">{format(value)}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-1 w-full accent-coral"
      />
    </div>
  );
}
