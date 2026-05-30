import { useState } from "react";
import {
  ShoppingBag,
  TrendingUp,
  Star,
  Calendar,
  DollarSign,
  Check,
  X,
  Eye,
  Upload,
  BarChart3,
  MessageSquare,
  Clock,
  CheckCircle2,
  Image as ImageIcon,
} from "lucide-react";
import { Section, Badge, Card, Button } from "../components/ui";
import { useApp } from "../context/AppContext";
import { vendors } from "../data/vendors";

export default function VendorDashboard() {
  const [tab, setTab] = useState<"overview" | "requests" | "bookings" | "calendar" | "portfolio" | "analytics">("overview");
  const vendor = vendors.find((v) => v.id === "v5")!; // Glow by Ronke as the demo vendor

  return (
    <div className="bg-cream pb-24">
      {/* Header with vendor profile */}
      <div className="bg-gradient-to-br from-ink via-ink-2 to-ink text-cream">
        <Section className="py-10">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <div className={`flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${vendor.cover} text-3xl`}>
                {vendor.emoji}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="font-display text-3xl">{vendor.name}</h1>
                  <Badge variant="coral">Elite Vendor</Badge>
                </div>
                <div className="mt-1 flex items-center gap-3 text-sm text-cream/60">
                  <span className="flex items-center gap-1">
                    <Star className="h-3.5 w-3.5 fill-amber text-amber" />
                    {vendor.rating} ({vendor.reviewCount})
                  </span>
                  <span>·</span>
                  <span>{vendor.category}</span>
                  <span>·</span>
                  <span>{vendor.city}</span>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" className="border border-cream/20 text-cream hover:bg-cream/10">
                <Upload className="h-4 w-4" /> Update portfolio
              </Button>
              <Button variant="primary">
                <Eye className="h-4 w-4" /> View public profile
              </Button>
            </div>
          </div>

          {/* Tabs */}
          <div className="mt-8 flex gap-1 overflow-x-auto">
            {[
              { k: "overview", label: "Overview", icon: <TrendingUp className="h-4 w-4" /> },
              { k: "requests", label: "Requests", icon: <ShoppingBag className="h-4 w-4" />, badge: 3 },
              { k: "bookings", label: "Bookings", icon: <Calendar className="h-4 w-4" /> },
              { k: "calendar", label: "Calendar", icon: <Calendar className="h-4 w-4" /> },
              { k: "portfolio", label: "Portfolio", icon: <ImageIcon className="h-4 w-4" /> },
              { k: "analytics", label: "Analytics", icon: <BarChart3 className="h-4 w-4" /> },
            ].map((t) => (
              <button
                key={t.k}
                onClick={() => setTab(t.k as typeof tab)}
                className={`flex items-center gap-2 whitespace-nowrap rounded-full px-4 py-2.5 text-sm font-semibold transition ${
                  tab === t.k ? "bg-coral text-white" : "bg-cream/5 text-cream/70 hover:bg-cream/10"
                }`}
              >
                {t.icon} {t.label}
                {t.badge && (
                  <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-cream px-1.5 text-[10px] font-bold text-ink">
                    {t.badge}
                  </span>
                )}
              </button>
            ))}
          </div>
        </Section>
      </div>

      <Section className="mt-10">
        {tab === "overview" && <Overview vendor={vendor} />}
        {tab === "requests" && <Requests />}
        {tab === "bookings" && <ActiveBookings />}
        {tab === "calendar" && <CalendarView />}
        {tab === "portfolio" && <Portfolio />}
        {tab === "analytics" && <Analytics vendor={vendor} />}
      </Section>
    </div>
  );
}

function Overview({ vendor }: { vendor: typeof vendors[0] }) {
  const { bookings } = useApp();
  const pending = bookings.filter((b) => b.status === "Pending").length;
  const active = bookings.filter((b) => ["Escrowed", "In progress"].includes(b.status)).length;
  const completed = bookings.filter((b) => b.status === "Completed").length;
  const revenue = bookings.filter((b) => b.status !== "Cancelled").reduce((s, b) => s + b.amount, 0);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        {[
          { label: "Pending requests", value: pending, icon: <ShoppingBag className="h-5 w-5" />, color: "bg-coral/10 text-coral" },
          { label: "Active bookings", value: active, icon: <Calendar className="h-5 w-5" />, color: "bg-amber/15 text-amber-700" },
          { label: "Completed", value: completed, icon: <CheckCircle2 className="h-5 w-5" />, color: "bg-sage/15 text-sage" },
          { label: "Lifetime revenue", value: `$${revenue.toLocaleString()}`, icon: <DollarSign className="h-5 w-5" />, color: "bg-ink/5 text-ink" },
        ].map((s) => (
          <Card key={s.label} className="p-5">
            <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${s.color}`}>
              {s.icon}
            </div>
            <div className="mt-3 text-xs font-semibold uppercase tracking-wider text-ink/50">{s.label}</div>
            <div className="mt-1 font-display text-3xl">{s.value}</div>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-[1.3fr_1fr]">
        <Card className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-display text-xl">Earnings · Last 6 months</h3>
            <Badge variant="sage">+24% YoY</Badge>
          </div>
          <div className="flex h-56 items-end gap-3">
            {[42, 58, 65, 78, 72, 92].map((h, i) => (
              <div key={i} className="flex flex-1 flex-col items-center gap-2">
                <div
                  className="w-full rounded-t-lg bg-gradient-to-t from-sage to-sage/60"
                  style={{ height: `${h}%` }}
                />
                <div className="text-[10px] text-ink/50">{["Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][i]}</div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="font-display text-xl">Trust metrics</h3>
          <div className="mt-4 space-y-4">
            {[
              { label: "Completion rate", value: vendor.completionRate, suffix: "%", target: 95 },
              { label: "Response time", value: 95, suffix: "%", target: 90 },
              { label: "Rating", value: Math.round((vendor.rating / 5) * 100), suffix: "%", target: 90 },
              { label: "Trust score", value: vendor.trustScore, suffix: "/100", target: 90 },
            ].map((m) => (
              <div key={m.label}>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-ink/60">{m.label}</span>
                  <span className="font-semibold">{m.value}{m.suffix}</span>
                </div>
                <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-ink/5">
                  <div
                    className={`h-full ${m.value >= m.target ? "bg-sage" : "bg-amber"}`}
                    style={{ width: `${Math.min(100, m.value)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-xl">Upcoming bookings</h3>
          <button className="text-xs font-semibold text-coral hover:underline">View all →</button>
        </div>
        <div className="mt-4 divide-y divide-ink/5">
          {bookings.slice(0, 3).map((b) => (
            <div key={b.id} className="flex items-center gap-4 py-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-coral to-amber text-sm font-bold text-white">
                {(b.clientName ?? "C").charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold">{b.clientName ?? "Client"}</div>
                <div className="text-xs text-ink/50">{b.id} · {new Date(b.date).toLocaleDateString()}</div>
              </div>
              <StatusPill status={b.status} />
              <div className="text-right">
                <div className="font-display text-lg">${b.amount.toLocaleString()}</div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function Requests() {
  const { bookings, respondBooking } = useApp();
  const pending = bookings.filter((b) => b.status === "Pending");

  if (pending.length === 0) {
    return (
      <Card className="flex min-h-[400px] flex-col items-center justify-center p-12 text-center">
        <div className="text-5xl">✨</div>
        <h3 className="mt-4 font-display text-2xl">No pending requests</h3>
        <p className="mt-2 max-w-sm text-sm text-ink/60">
          New booking requests will appear here. Make sure your availability calendar is up to date.
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {pending.map((b) => (
        <Card key={b.id} className="overflow-hidden">
          <div className="grid gap-0 md:grid-cols-[auto_1fr_auto]">
            <div className="flex h-32 items-center justify-center bg-gradient-to-br from-coral to-amber p-6 md:h-auto md:w-32">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 text-2xl font-bold text-white backdrop-blur">
                {(b.clientName ?? "C").charAt(0)}
              </div>
            </div>
            <div className="p-6">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="coral">New request</Badge>
                <span className="font-mono text-xs text-ink/50">{b.id}</span>
              </div>
              <h3 className="mt-2 font-display text-2xl">{b.clientName ?? "Client"}</h3>
              <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-ink/60">
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5" />
                  {new Date(b.date).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
                </span>
                <span>·</span>
                <span>{b.category}</span>
              </div>
              {b.message && (
                <div className="mt-4 rounded-xl bg-cream-2 p-3">
                  <div className="flex items-center gap-1.5 text-xs text-ink/50">
                    <MessageSquare className="h-3 w-3" /> Client message
                  </div>
                  <p className="mt-1 text-sm text-ink/80">"{b.message}"</p>
                </div>
              )}
              <div className="mt-4 grid grid-cols-3 gap-2">
                {b.installments.map((i) => (
                  <div key={i.label} className="rounded-lg border border-ink/5 p-2.5 text-xs">
                    <div className="text-ink/40">{i.label}</div>
                    <div className="mt-0.5 font-semibold">${Math.round(b.amount * (i.pct / 100)).toLocaleString()}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="border-t border-ink/5 p-6 md:border-l md:border-t-0 md:min-w-[220px]">
              <div className="text-right">
                <div className="text-xs text-ink/50">Total</div>
                <div className="font-display text-3xl">${b.amount.toLocaleString()}</div>
                <div className="mt-1 text-xs text-ink/50">
                  Deposit: ${Math.round(b.amount * 0.3).toLocaleString()}
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1 !rounded-xl !py-2"
                  onClick={() => respondBooking(b.id, "Rejected")}
                >
                  <X className="h-4 w-4" /> Decline
                </Button>
                <Button
                  variant="primary"
                  className="flex-1 !rounded-xl !py-2"
                  onClick={() => respondBooking(b.id, "Accepted")}
                >
                  <Check className="h-4 w-4" /> Accept
                </Button>
              </div>
              <p className="mt-3 text-[10px] text-ink/50 text-center">
                Accepting locks deposit in escrow instantly.
              </p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

function ActiveBookings() {
  const { bookings } = useApp();
  const active = bookings.filter((b) => ["Accepted", "Escrowed", "In progress"].includes(b.status));

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="p-5">
          <div className="text-xs font-semibold uppercase tracking-wider text-ink/50">In escrow</div>
          <div className="mt-1 font-display text-3xl">
            ${active.reduce((s, b) => s + b.amount, 0).toLocaleString()}
          </div>
        </Card>
        <Card className="p-5">
          <div className="text-xs font-semibold uppercase tracking-wider text-ink/50">Next milestone</div>
          <div className="mt-1 font-display text-xl">Mid-payment</div>
          <div className="text-xs text-ink/50">Mar 9, 2026</div>
        </Card>
        <Card className="p-5">
          <div className="text-xs font-semibold uppercase tracking-wider text-ink/50">Avg payout time</div>
          <div className="mt-1 font-display text-3xl">1.2 days</div>
        </Card>
      </div>

      {active.map((b) => (
        <Card key={b.id} className="p-5">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-coral to-amber text-sm font-bold text-white">
                {(b.clientName ?? "C").charAt(0)}
              </div>
              <div>
                <div className="font-semibold">{b.clientName}</div>
                <div className="text-xs text-ink/50">{b.id} · {new Date(b.date).toLocaleDateString()}</div>
              </div>
            </div>
            <StatusPill status={b.status} />
          </div>
          <div className="mt-4">
            <div className="mb-2 flex justify-between text-xs">
              <span className="text-ink/60">Escrow schedule</span>
              <span className="font-semibold">${b.amount.toLocaleString()} total</span>
            </div>
            <div className="flex gap-1">
              {b.installments.map((i, idx) => (
                <div key={idx} className="flex-1">
                  <div className={`h-2 rounded-full ${i.status === "Paid" ? "bg-sage" : i.status === "Upcoming" ? "bg-amber" : "bg-ink/10"}`} />
                  <div className="mt-1.5 text-[10px] text-ink/50">
                    {i.label} · ${Math.round(b.amount * (i.pct / 100)).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <Button variant="outline" className="!rounded-lg !py-2 text-xs">
              <MessageSquare className="h-3 w-3" /> Message
            </Button>
            <Button variant="primary" className="!rounded-lg !py-2 text-xs">
              Release milestone
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
}

function CalendarView() {
  const today = new Date();
  const month = today.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1).getDay();

  const booked = [5, 12, 14, 19, 23, 27];
  const available = [3, 8, 10, 15, 17, 21, 24, 28];

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <Card className="p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-display text-2xl">{month}</h3>
          <div className="flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-coral" /> Booked
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-sage" /> Available
            </span>
          </div>
        </div>
        <div className="grid grid-cols-7 gap-1">
          {["S", "M", "T", "W", "T", "F", "S"].map((d) => (
            <div key={d} className="py-2 text-center text-[10px] font-semibold uppercase tracking-wider text-ink/40">
              {d}
            </div>
          ))}
          {Array.from({ length: firstDay }).map((_, i) => <div key={`e-${i}`} />)}
          {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((d) => {
            const isBooked = booked.includes(d);
            const isAvail = available.includes(d);
            const isToday = d === today.getDate();
            return (
              <div
                key={d}
                className={`aspect-square rounded-lg p-1 text-xs transition ${
                  isBooked
                    ? "bg-coral/15 text-coral font-semibold"
                    : isAvail
                    ? "bg-sage/10 text-sage"
                    : "text-ink/60 hover:bg-ink/5"
                } ${isToday ? "ring-2 ring-ink" : ""}`}
              >
                {d}
                {isBooked && <div className="mt-0.5 text-[9px]">booked</div>}
              </div>
            );
          })}
        </div>
      </Card>

      <div className="space-y-4">
        <Card className="p-5">
          <h3 className="font-display text-lg">Availability settings</h3>
          <div className="mt-4 space-y-3 text-sm">
            {[
              { label: "Min notice", value: "14 days" },
              { label: "Max bookings / week", value: "3" },
              { label: "Blackout dates", value: "4 set" },
              { label: "Auto-accept threshold", value: "Trust > 85" },
            ].map((s) => (
              <div key={s.label} className="flex items-center justify-between">
                <span className="text-ink/60">{s.label}</span>
                <span className="font-semibold">{s.value}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-5">
          <h3 className="font-display text-lg">Pricing</h3>
          <div className="mt-4 space-y-3 text-sm">
            {[
              { label: "Bridal glam", price: "$250–$900" },
              { label: "Bridesmaids (per head)", price: "$80–$150" },
              { label: "Trial session", price: "$120" },
            ].map((s) => (
              <div key={s.label} className="flex items-center justify-between">
                <span className="text-ink/60">{s.label}</span>
                <span className="font-semibold">{s.price}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

function Portfolio() {
  const items = Array.from({ length: 12 }).map((_, i) => ({
    emoji: ["💄", "✨", "👰", "💋", "🪞", "🌸"][i % 6],
    title: ["Bridal look", "Editorial", "Glam", "Natural", "Evening", "Traditional"][i % 6],
    cover: ["from-pink-200 via-rose-200 to-orange-200", "from-violet-200 via-pink-200 to-rose-200", "from-amber-200 via-orange-200 to-rose-200", "from-emerald-200 via-teal-200 to-cyan-200"][i % 4],
  }));

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-display text-2xl">Portfolio gallery</h3>
          <p className="text-sm text-ink/60">{items.length} looks · Updated 2 days ago</p>
        </div>
        <Button variant="primary">
          <Upload className="h-4 w-4" /> Upload
        </Button>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {items.map((it, i) => (
          <div key={i} className={`group relative aspect-[3/4] overflow-hidden rounded-2xl bg-gradient-to-br ${it.cover}`}>
            <div className="flex h-full items-center justify-center text-7xl">{it.emoji}</div>
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-3">
              <div className="text-xs font-semibold text-white">{it.title}</div>
            </div>
            <div className="absolute top-2 right-2 flex gap-1 opacity-0 transition group-hover:opacity-100">
              <button className="flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-ink">
                <Eye className="h-3 w-3" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Analytics({ vendor }: { vendor: typeof vendors[0] }) {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        {[
          { label: "Bookings (30d)", value: "28" },
          { label: "Conversion", value: "42%" },
          { label: "Avg rating", value: vendor.rating },
          { label: "Repeat clients", value: "38%" },
        ].map((s) => (
          <Card key={s.label} className="p-5">
            <div className="text-xs font-semibold uppercase tracking-wider text-ink/50">{s.label}</div>
            <div className="mt-1 font-display text-3xl">{s.value}</div>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="p-6">
          <h3 className="font-display text-xl">Client sources</h3>
          <div className="mt-4 space-y-3">
            {[
              { label: "AI Planner Agent", pct: 48, color: "bg-coral" },
              { label: "Marketplace search", pct: 32, color: "bg-sage" },
              { label: "Package bundles", pct: 14, color: "bg-amber" },
              { label: "Direct", pct: 6, color: "bg-ink" },
            ].map((s) => (
              <div key={s.label}>
                <div className="flex justify-between text-xs">
                  <span className="text-ink/60">{s.label}</span>
                  <span className="font-semibold">{s.pct}%</span>
                </div>
                <div className="mt-1 h-2 overflow-hidden rounded-full bg-ink/5">
                  <div className={`h-full ${s.color}`} style={{ width: `${s.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="font-display text-xl">Top services booked</h3>
          <div className="mt-4 space-y-3 text-sm">
            {vendor.services.map((s, i) => (
              <div key={s} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-5 text-xs font-bold text-ink/40">#{i + 1}</span>
                  <span>{s}</span>
                </div>
                <span className="text-ink/60">{Math.floor(Math.random() * 30) + 10} bookings</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
  const map: Record<string, string> = {
    Pending: "bg-coral/10 text-coral",
    Accepted: "bg-sage/15 text-sage",
    Escrowed: "bg-coral/10 text-coral",
    "In progress": "bg-amber/15 text-amber-700",
    Completed: "bg-sage/15 text-sage",
    Rejected: "bg-rose-100 text-rose-700",
    Cancelled: "bg-slate-200 text-slate-700",
  };
  return <span className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider ${map[status] ?? "bg-ink/10 text-ink"}`}>{status}</span>;
}

// Prevent unused import warnings
export const _unused = { Clock };
