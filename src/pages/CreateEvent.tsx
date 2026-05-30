import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, ArrowLeft, Check, Sparkles, Calendar, MapPin, Users, Wallet, Palette } from "lucide-react";
import { Section, Badge, Card, Button } from "../components/ui";
import { useApp } from "../context/AppContext";

const eventTypes = [
  { k: "Wedding", emoji: "💍", desc: "Ceremonies, receptions, traditional" },
  { k: "Birthday", emoji: "🎂", desc: "Sweet 16, 21, 30, 40, 50…" },
  { k: "Corporate", emoji: "🏢", desc: "Launches, galas, conferences" },
  { k: "Custom", emoji: "✨", desc: "Bespoke event, any vibe" },
];

const styles = [
  { k: "Luxury", emoji: "👑", desc: "No budget spared. Premium everything." },
  { k: "Standard", emoji: "⭐", desc: "Great quality, smart spending." },
  { k: "Budget", emoji: "💡", desc: "Beautiful on a budget." },
] as const;

const palettes = [
  { name: "Warm Sunset", colors: ["#f5b038", "#ff5b3a", "#ec4899"] },
  { name: "Garden Sage", colors: ["#2f6b4e", "#a3e635", "#f5b038"] },
  { name: "Royal Night", colors: ["#0b0b0f", "#8b5cf6", "#f5b038"] },
  { name: "Coastal Blue", colors: ["#0891b2", "#f1f5f9", "#f5b038"] },
];

export default function CreateEvent() {
  const navigate = useNavigate();
  const { addEvent } = useApp();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    name: "",
    type: "Wedding",
    date: "2026-09-14",
    location: "",
    guests: 150,
    budget: 20000,
    style: "Standard" as "Luxury" | "Standard" | "Budget",
    palette: 0,
    notes: "",
  });

  const canNext = () => {
    if (step === 1) return form.name.trim().length > 0 && form.type;
    if (step === 2) return form.date && form.location.trim().length > 0;
    if (step === 3) return form.guests >= 10 && form.budget >= 500;
    return true;
  };

  const finish = () => {
    addEvent({
      name: form.name,
      type: form.type,
      date: form.date,
      location: form.location,
      guests: form.guests,
      budget: form.budget,
      style: form.style,
      status: "Planning",
      cover: "from-amber-200 via-orange-200 to-rose-200",
      emoji: eventTypes.find((t) => t.k === form.type)?.emoji ?? "✨",
    });
    navigate("/planner");
  };

  return (
    <div className="min-h-screen bg-cream">
      <Section className="pt-8 md:pt-12">
        <Link to="/dashboard" className="inline-flex items-center gap-1.5 text-sm text-ink/60 hover:text-ink">
          <ArrowLeft className="h-4 w-4" /> Back to dashboard
        </Link>

        <div className="mt-6 grid gap-10 md:grid-cols-[1fr_1.3fr] md:items-start">
          <div className="md:sticky md:top-24">
            <Badge variant="coral">New event</Badge>
            <h1 className="mt-3 font-display text-4xl md:text-5xl">
              Let's plan
              <br />
              <span className="italic text-coral">something amazing.</span>
            </h1>
            <p className="mt-3 max-w-sm text-sm text-ink/60">
              Answer a few questions and our AI planner will generate a full blueprint with vendors, budget, and timeline.
            </p>

            <div className="mt-8 space-y-3">
              {[
                { n: 1, label: "Basics", desc: "Name, type" },
                { n: 2, label: "When & where", desc: "Date, location" },
                { n: 3, label: "Guests & budget", desc: "Scale of the event" },
                { n: 4, label: "Vibe & details", desc: "Style, palette, notes" },
              ].map((s) => (
                <div key={s.n} className="flex items-center gap-3">
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${
                      step > s.n ? "bg-sage text-white" : step === s.n ? "bg-coral text-white" : "bg-ink/10 text-ink/40"
                    }`}
                  >
                    {step > s.n ? <Check className="h-4 w-4" /> : s.n}
                  </div>
                  <div>
                    <div className={`text-sm font-semibold ${step >= s.n ? "text-ink" : "text-ink/40"}`}>{s.label}</div>
                    <div className="text-xs text-ink/50">{s.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Card className="p-8">
            {step === 1 && (
              <div className="space-y-5">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-ink/50">Event name</div>
                  <input
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    placeholder="e.g. Tunde & Adaeze"
                    className="mt-1.5 w-full rounded-xl border border-ink/10 bg-white px-4 py-3 font-display text-2xl outline-none focus:border-ink"
                  />
                </div>

                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-ink/50">Event type</div>
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    {eventTypes.map((t) => (
                      <button
                        key={t.k}
                        onClick={() => setForm((f) => ({ ...f, type: t.k }))}
                        className={`rounded-xl border p-4 text-left transition ${
                          form.type === t.k ? "border-ink bg-ink text-cream" : "border-ink/10 hover:border-ink/30"
                        }`}
                      >
                        <div className="text-2xl">{t.emoji}</div>
                        <div className="mt-1 font-semibold">{t.k}</div>
                        <div className={`text-xs ${form.type === t.k ? "text-cream/60" : "text-ink/50"}`}>{t.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-5">
                <div>
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-ink/50">
                    <Calendar className="h-3.5 w-3.5" /> Event date
                  </div>
                  <input
                    type="date"
                    value={form.date}
                    onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
                    className="mt-1.5 w-full rounded-xl border border-ink/10 bg-white px-4 py-3 font-display text-xl outline-none focus:border-ink"
                  />
                  <p className="mt-2 text-xs text-ink/50">
                    💡 Peak season (Dec–Feb) books 9+ months out.
                  </p>
                </div>

                <div>
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-ink/50">
                    <MapPin className="h-3.5 w-3.5" /> Location
                  </div>
                  <input
                    value={form.location}
                    onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
                    placeholder="e.g. The Grand Orchid Estate, Lagos"
                    className="mt-1.5 w-full rounded-xl border border-ink/10 bg-white px-4 py-3 text-sm outline-none focus:border-ink"
                  />
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {["Lagos", "Abuja", "Accra", "Nairobi", "London"].map((c) => (
                      <button
                        key={c}
                        onClick={() => setForm((f) => ({ ...f, location: `${c}, ${c === "London" ? "UK" : c === "Accra" ? "Ghana" : c === "Nairobi" ? "Kenya" : "Nigeria"}` }))}
                        className="rounded-full border border-ink/10 px-3 py-1 text-xs hover:border-ink/30"
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-ink/50">
                      <Users className="h-3.5 w-3.5" /> Guest count
                    </div>
                    <div className="font-display text-2xl">{form.guests}</div>
                  </div>
                  <input
                    type="range"
                    min={10}
                    max={1000}
                    step={10}
                    value={form.guests}
                    onChange={(e) => setForm((f) => ({ ...f, guests: Number(e.target.value) }))}
                    className="mt-2 w-full accent-coral"
                  />
                  <div className="flex justify-between text-[10px] text-ink/40">
                    <span>Intimate (10)</span>
                    <span>Grand (1,000)</span>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-ink/50">
                      <Wallet className="h-3.5 w-3.5" /> Total budget (USD)
                    </div>
                    <div className="font-display text-2xl">${form.budget.toLocaleString()}</div>
                  </div>
                  <input
                    type="range"
                    min={500}
                    max={100000}
                    step={500}
                    value={form.budget}
                    onChange={(e) => setForm((f) => ({ ...f, budget: Number(e.target.value) }))}
                    className="mt-2 w-full accent-coral"
                  />
                  <div className="mt-2 flex justify-between text-[10px] text-ink/40">
                    <span>$500</span>
                    <span>$100k</span>
                  </div>
                  <div className="mt-3 rounded-xl bg-cream-2 p-3 text-xs text-ink/60">
                    💡 <span className="font-semibold">Per guest:</span> ${Math.round(form.budget / form.guests).toLocaleString()}
                    {form.budget / form.guests > 200 && " · Luxury tier"}
                    {form.budget / form.guests >= 80 && form.budget / form.guests <= 200 && " · Standard tier"}
                    {form.budget / form.guests < 80 && " · Budget tier"}
                  </div>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-5">
                <div>
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-ink/50">
                    <Sparkles className="h-3.5 w-3.5" /> Style
                  </div>
                  <div className="mt-2 grid grid-cols-3 gap-2">
                    {styles.map((s) => (
                      <button
                        key={s.k}
                        onClick={() => setForm((f) => ({ ...f, style: s.k }))}
                        className={`rounded-xl border p-3 text-left transition ${
                          form.style === s.k ? "border-ink bg-ink text-cream" : "border-ink/10 hover:border-ink/30"
                        }`}
                      >
                        <div className="text-xl">{s.emoji}</div>
                        <div className="mt-1 text-sm font-semibold">{s.k}</div>
                        <div className={`text-[10px] leading-tight ${form.style === s.k ? "text-cream/60" : "text-ink/50"}`}>
                          {s.desc}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-ink/50">
                    <Palette className="h-3.5 w-3.5" /> Color palette
                  </div>
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    {palettes.map((p, i) => (
                      <button
                        key={p.name}
                        onClick={() => setForm((f) => ({ ...f, palette: i }))}
                        className={`rounded-xl border p-3 transition ${form.palette === i ? "border-ink" : "border-ink/10 hover:border-ink/30"}`}
                      >
                        <div className="flex gap-1">
                          {p.colors.map((c) => (
                            <div key={c} className="h-8 flex-1 first:rounded-l-lg last:rounded-r-lg" style={{ background: c }} />
                          ))}
                        </div>
                        <div className="mt-2 text-xs font-semibold">{p.name}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-ink/50">Additional notes (optional)</div>
                  <textarea
                    value={form.notes}
                    onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                    placeholder="Any preferences, must-haves, cultural requirements…"
                    rows={3}
                    className="mt-1.5 w-full rounded-xl border border-ink/10 bg-white px-4 py-3 text-sm outline-none focus:border-ink"
                  />
                </div>
              </div>
            )}

            <div className="mt-8 flex gap-3 border-t border-ink/5 pt-6">
              {step > 1 && (
                <Button variant="outline" onClick={() => setStep((s) => s - 1)}>
                  <ArrowLeft className="h-4 w-4" /> Back
                </Button>
              )}
              {step < 4 ? (
                <Button variant="primary" className="flex-1" disabled={!canNext()} onClick={() => setStep((s) => s + 1)}>
                  Continue <ArrowRight className="h-4 w-4" />
                </Button>
              ) : (
                <Button variant="primary" className="flex-1" onClick={finish}>
                  <Sparkles className="h-4 w-4" /> Generate AI blueprint
                </Button>
              )}
            </div>
          </Card>
        </div>
      </Section>
    </div>
  );
}
