import { useMemo, useState } from "react";
import { Sparkles, ArrowRight, Check, AlertTriangle, Download, RefreshCw, BadgeCheck } from "lucide-react";
import { Section, Badge, Card, Button } from "../components/ui";
import { generatePlan, type EventPlan, type PlannerInput } from "../lib/aiPlanner";

const eventTypes = ["Wedding", "Birthday", "Corporate", "Custom"];
const styles: PlannerInput["style"][] = ["Luxury", "Standard", "Budget"];
const locations = ["Lagos, Nigeria", "Abuja, Nigeria", "Accra, Ghana", "Nairobi, Kenya", "London, UK"];

export default function Planner() {
  const [input, setInput] = useState<PlannerInput>({
    eventType: "Wedding",
    location: "Lagos, Nigeria",
    date: "2026-09-14",
    guests: 180,
    budget: 22000,
    style: "Luxury",
  });
  const [submitted, setSubmitted] = useState(false);
  const [planning, setPlanning] = useState(false);

  const plan = useMemo(() => (submitted ? generatePlan(input) : null), [submitted, input]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPlanning(true);
    setTimeout(() => {
      setPlanning(false);
      setSubmitted(true);
      setTimeout(() => {
        document.getElementById("plan-output")?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    }, 1400);
  };

  return (
    <div className="bg-cream pb-24">
      <Section className="pt-12 md:pt-20">
        <div className="grid gap-10 md:grid-cols-[1.2fr_1fr] md:items-end">
          <div>
            <Badge variant="coral">
              <Sparkles className="h-3 w-3" /> Planner Agent online
            </Badge>
            <h1 className="mt-4 font-display text-5xl leading-[1.02] md:text-6xl">
              Build your event
              <br />
              <span className="italic text-coral">blueprint in 30 seconds.</span>
            </h1>
            <p className="mt-4 max-w-xl text-ink/60">
              Answer 6 questions. Get a budget breakdown, vendor recommendations, timeline, risk warnings, and a cheaper alternative plan.
            </p>
          </div>
          <Card className="p-5">
            <div className="flex items-center gap-2 text-xs">
              <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
              <span className="font-semibold text-ink/70">Live agent activity</span>
            </div>
            <div className="mt-3 space-y-1.5 font-mono text-[11px] text-ink/60">
              <div>• Planner agent: 47 plans generated today</div>
              <div>• Pricing agent: 1,284 vendor prices validated</div>
              <div>• Matcher agent: avg response 180ms</div>
              <div>• Emergency agent: 0 cancellations unhandled</div>
            </div>
          </Card>
        </div>
      </Section>

      <Section className="mt-12">
        <div className="grid gap-8 md:grid-cols-[1fr_1.4fr]">
          <Card className="h-fit p-6 md:sticky md:top-24">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <Label>Event type</Label>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  {eventTypes.map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setInput((s) => ({ ...s, eventType: t }))}
                      className={`rounded-xl border px-3 py-2.5 text-sm font-medium transition ${
                        input.eventType === t
                          ? "border-ink bg-ink text-cream"
                          : "border-ink/10 hover:border-ink/30"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <Label>Style</Label>
                <div className="mt-2 grid grid-cols-3 gap-2">
                  {styles.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setInput((v) => ({ ...v, style: s }))}
                      className={`rounded-xl border px-3 py-2.5 text-sm font-medium transition ${
                        input.style === s
                          ? "border-coral bg-coral text-white"
                          : "border-ink/10 hover:border-ink/30"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <Field
                label="Location"
                type="select"
                options={locations}
                value={input.location}
                onChange={(v) => setInput((s) => ({ ...s, location: v }))}
              />

              <Field
                label="Event date"
                type="date"
                value={input.date}
                onChange={(v) => setInput((s) => ({ ...s, date: v }))}
              />

              <div className="grid grid-cols-2 gap-3">
                <Field
                  label="Guests"
                  type="number"
                  value={String(input.guests)}
                  onChange={(v) => setInput((s) => ({ ...s, guests: Math.max(10, Number(v) || 10) }))}
                />
                <Field
                  label="Budget (USD)"
                  type="number"
                  value={String(input.budget)}
                  onChange={(v) => setInput((s) => ({ ...s, budget: Math.max(500, Number(v) || 500) }))}
                />
              </div>

              <div className="rounded-xl bg-cream-2 p-3 text-xs text-ink/60">
                💡 Higher budget = more vendor options. Budget under $5,000 works best with 50 guests or fewer.
              </div>

              <Button type="submit" variant="primary" className="w-full" disabled={planning}>
                {planning ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    Generating blueprint…
                  </>
                ) : (
                  <>
                    Generate my plan <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </form>
          </Card>

          <div id="plan-output">
            {!submitted && !planning && <EmptyState />}
            {planning && <PlanningState />}
            {plan && <PlanOutput plan={plan} input={input} onRegenerate={() => { setSubmitted(false); setPlanning(true); setTimeout(() => { setPlanning(false); setSubmitted(true); }, 1000); }} />}
          </div>
        </div>
      </Section>
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <div className="text-xs font-semibold uppercase tracking-[0.14em] text-ink/50">{children}</div>;
}

function Field({
  label,
  type,
  value,
  options,
  onChange,
}: {
  label: string;
  type: "number" | "date" | "select";
  value: string;
  options?: string[];
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <Label>{label}</Label>
      {type === "select" ? (
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="mt-2 w-full rounded-xl border border-ink/10 bg-white px-3 py-2.5 text-sm font-medium outline-none focus:border-ink"
        >
          {options!.map((o) => (
            <option key={o}>{o}</option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="mt-2 w-full rounded-xl border border-ink/10 bg-white px-3 py-2.5 text-sm font-medium outline-none focus:border-ink"
        />
      )}
    </div>
  );
}

function EmptyState() {
  return (
    <Card className="grid-pattern flex min-h-[500px] flex-col items-center justify-center p-12 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-coral/10 text-coral">
        <Sparkles className="h-7 w-7" />
      </div>
      <h3 className="mt-6 font-display text-3xl">Your blueprint will appear here</h3>
      <p className="mt-2 max-w-sm text-sm text-ink/60">
        Fill in the form on the left and our Planner Agent will generate a full event plan with budget breakdown, vendor matches, and timeline.
      </p>
    </Card>
  );
}

function PlanningState() {
  return (
    <Card className="p-8">
      <div className="flex items-center gap-3">
        <RefreshCw className="h-5 w-5 animate-spin text-coral" />
        <span className="text-sm font-semibold">Planner Agent is thinking…</span>
      </div>
      <div className="mt-6 space-y-3">
        {["Analyzing budget constraints", "Matching vendors from 2,400+ database", "Building timeline & milestones", "Generating alternative plan"].map((s, i) => (
          <div key={s} className="flex items-center gap-3 opacity-0 animate-[fadeIn_0.3s_ease-out_forwards]" style={{ animationDelay: `${i * 250}ms` }}>
            <div className="h-2 w-2 animate-pulse rounded-full bg-coral" />
            <span className="text-sm text-ink/60">{s}</span>
          </div>
        ))}
      </div>
      <div className="mt-6 h-2 overflow-hidden rounded-full bg-ink/5">
        <div className="h-full w-1/2 animate-pulse bg-gradient-to-r from-coral to-amber" />
      </div>
    </Card>
  );
}

function PlanOutput({ plan, input, onRegenerate }: { plan: EventPlan; input: PlannerInput; onRegenerate: () => void }) {
  return (
    <div className="space-y-5">
      <Card className="overflow-hidden">
        <div className="bg-ink p-6 text-cream">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-coral">
            <Sparkles className="h-3.5 w-3.5" /> Generated blueprint
          </div>
          <h2 className="mt-2 font-display text-4xl">{plan.title}</h2>
          <p className="mt-2 max-w-xl text-sm text-cream/60">{plan.summary}</p>
          <div className="mt-5 flex flex-wrap gap-3 text-xs">
            <div className="rounded-full bg-cream/10 px-3 py-1.5">
              <span className="text-cream/50">Confidence:</span>{" "}
              <span className="font-semibold text-cream">{plan.confidence}%</span>
            </div>
            <div className="rounded-full bg-cream/10 px-3 py-1.5">
              <span className="text-cream/50">Budget:</span>{" "}
              <span className="font-semibold text-cream">${input.budget.toLocaleString()}</span>
            </div>
            <div className="rounded-full bg-cream/10 px-3 py-1.5">
              <span className="text-cream/50">Guests:</span>{" "}
              <span className="font-semibold text-cream">{input.guests}</span>
            </div>
            <div className="rounded-full bg-cream/10 px-3 py-1.5">
              <span className="text-cream/50">Style:</span>{" "}
              <span className="font-semibold text-cream">{input.style}</span>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-display text-xl">Budget breakdown</h3>
            <Button variant="ghost" onClick={onRegenerate}>
              <RefreshCw className="h-3.5 w-3.5" /> Regenerate
            </Button>
          </div>
          <div className="space-y-3">
            {plan.lineItems.map((item) => (
              <div key={item.category} className="rounded-xl border border-ink/5 p-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{item.emoji}</span>
                      <div className="font-semibold">{item.category}</div>
                      <Badge variant={item.priority === "Must-have" ? "coral" : item.priority === "Nice-to-have" ? "amber" : "neutral"}>
                        {item.priority}
                      </Badge>
                    </div>
                    <div className="mt-1 flex items-center gap-1.5 text-xs text-ink/60">
                      <BadgeCheck className="h-3 w-3 text-sage" />
                      Recommended: <span className="font-semibold text-ink">{item.vendorSuggestion}</span>
                    </div>
                    {item.note && <div className="mt-1 text-xs text-ink/50">💡 {item.note}</div>}
                  </div>
                  <div className="text-right">
                    <div className="font-display text-2xl">${item.amount.toLocaleString()}</div>
                    <div className="text-xs text-ink/40">{item.allocation}%</div>
                  </div>
                </div>
                <div className="mt-2 h-1 overflow-hidden rounded-full bg-ink/5">
                  <div
                    className="h-full bg-gradient-to-r from-coral to-amber"
                    style={{ width: `${item.allocation * 3}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      <div className="grid gap-5 md:grid-cols-2">
        <Card className="p-6">
          <h3 className="font-display text-xl">Timeline</h3>
          <p className="mt-1 text-xs text-ink/50">Countdown to event day</p>
          <div className="mt-5 space-y-4">
            {plan.timeline.map((t, i) => (
              <div key={i} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className={`flex h-7 w-7 items-center justify-center rounded-full ${t.done ? "bg-sage text-white" : "bg-ink/10 text-ink/60"}`}>
                    {t.done ? <Check className="h-4 w-4" /> : <span className="text-xs font-semibold">{i + 1}</span>}
                  </div>
                  {i < plan.timeline.length - 1 && <div className="mt-1 w-px flex-1 bg-ink/10" />}
                </div>
                <div className="flex-1 pb-3">
                  <div className="flex items-center justify-between">
                    <div className="font-semibold text-sm">{t.task}</div>
                    <div className="text-xs text-ink/50">{t.date}</div>
                  </div>
                  <div className="text-xs text-ink/50">{t.phase}</div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <div className="space-y-5">
          <Card className="p-6">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber" />
              <h3 className="font-display text-xl">Risk warnings</h3>
            </div>
            <div className="mt-4 space-y-2">
              {plan.risks.map((r, i) => (
                <div key={i} className="rounded-lg bg-amber/10 p-3 text-xs text-ink/70">
                  {r}
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-2">
              <RefreshCw className="h-4 w-4 text-sage" />
              <h3 className="font-display text-xl">Backup vendors</h3>
            </div>
            <p className="mt-1 text-xs text-ink/50">Auto-suggested by Emergency Agent</p>
            <div className="mt-4 space-y-3">
              {plan.backupVendors.map((b) => (
                <div key={b.name} className="flex items-start gap-3 rounded-lg border border-ink/5 p-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sage/10 text-xs font-bold text-sage">
                    {b.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-semibold">
                      {b.name} <span className="text-ink/40">· {b.category}</span>
                    </div>
                    <div className="text-xs text-ink/50">{b.reason}</div>
                  </div>
                  <button className="text-xs font-semibold text-coral hover:underline">One-click book</button>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      <Card className="overflow-hidden">
        <div className="grid gap-0 md:grid-cols-2">
          <div className="p-6">
            <Badge variant="sage">Save ${(input.budget - plan.cheaperTotal).toLocaleString()}</Badge>
            <h3 className="mt-3 font-display text-2xl">Cheaper alternative plan</h3>
            <p className="mt-1 text-sm text-ink/60">
              Same vendors, strategic trade-offs on optional items.
            </p>
          </div>
          <div className="border-t border-ink/5 p-6 md:border-l md:border-t-0">
            <div className="mb-3 flex items-end justify-between">
              <div className="text-xs text-ink/40">Alternative total</div>
              <div className="font-display text-3xl">${plan.cheaperTotal.toLocaleString()}</div>
            </div>
            <div className="space-y-1.5">
              {plan.cheaperPlan.slice(0, 5).map((i) => (
                <div key={i.category} className="flex items-center justify-between text-xs">
                  <span className="text-ink/60">
                    {i.emoji} {i.category}
                  </span>
                  <span className="font-mono font-semibold">${i.amount.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Button variant="primary" className="flex-1">
          Book all vendors · $3,360 deposit <ArrowRight className="h-4 w-4" />
        </Button>
        <Button variant="outline">
          <Download className="h-4 w-4" /> Download PDF
        </Button>
      </div>
    </div>
  );
}
