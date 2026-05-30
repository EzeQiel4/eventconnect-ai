import { useMemo } from "react";
import {
  TrendingUp,
  Calendar,
  DollarSign,
  Clock,
  Target,
  Star,
  ShieldCheck,
  Award,
  Crown,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  RadialBarChart,
  RadialBar,
  PolarAngleAxis,
} from "recharts";
import { Section, Badge, Card, Button } from "../components/ui";
import { vendors } from "../data/vendors";
import { computeTrust, usePlatformStore } from "../store/usePlatformStore";
import { Link } from "react-router-dom";

const revenueSeries = [
  { month: "Jul", revenue: 6800, bookings: 4 },
  { month: "Aug", revenue: 8400, bookings: 5 },
  { month: "Sep", revenue: 12200, bookings: 7 },
  { month: "Oct", revenue: 10100, bookings: 6 },
  { month: "Nov", revenue: 14600, bookings: 9 },
  { month: "Dec", revenue: 18900, bookings: 11 },
  { month: "Jan", revenue: 21500, bookings: 13 },
];

const sourceSeries = [
  { name: "AI Matching", value: 48 },
  { name: "Marketplace", value: 32 },
  { name: "Packages", value: 14 },
  { name: "Direct", value: 6 },
];

export default function VendorCRM() {
  const vendor = vendors.find((v) => v.id === "v5")!;
  const trust = useMemo(() => computeTrust(vendor.id), [vendor.id]);
  const { subscriptions } = usePlatformStore();
  const sub = subscriptions.find((s) => s.vendorId === vendor.id);

  return (
    <div className="bg-cream pb-20">
      <Section className="pt-10">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <Badge variant="coral">
              <TrendingUp className="h-3 w-3" /> Vendor CRM · Live analytics
            </Badge>
            <h1 className="mt-3 font-display text-4xl md:text-5xl">{vendor.name}</h1>
            <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-ink/60">
              <span className="flex items-center gap-1">
                <Star className="h-3.5 w-3.5 fill-amber text-amber" />
                {vendor.rating} ({vendor.reviewCount} reviews)
              </span>
              <span>·</span>
              <span>{vendor.category}</span>
              <span>·</span>
              <span>{vendor.city}</span>
              {sub && (
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${sub.tier === "Premium" ? "bg-coral text-white" : "bg-sage/15 text-sage"}`}>
                  {sub.tier === "Premium" && <Crown className="-mt-0.5 mr-1 inline h-3 w-3" />}
                  {sub.tier}
                </span>
              )}
            </div>
          </div>
          <Link to="/subscriptions">
            <Button variant="primary">
              <Crown className="h-4 w-4" /> Manage subscription
            </Button>
          </Link>
        </div>

        {/* KPI cards */}
        <div className="mt-8 grid gap-3 md:grid-cols-4">
          <Stat icon={<DollarSign className="h-5 w-5" />} label="Revenue (30d)" value="$21.5k" delta="+24% YoY" color="bg-coral/10 text-coral" />
          <Stat icon={<Calendar className="h-5 w-5" />} label="Bookings" value="13" delta="+8 from last month" color="bg-sage/15 text-sage" />
          <Stat icon={<Target className="h-5 w-5" />} label="Lead conversion" value="42%" delta="+5pp" color="bg-amber/15 text-amber-700" />
          <Stat icon={<Clock className="h-5 w-5" />} label="Avg response" value="14m" delta="−3m faster" color="bg-violet-100 text-violet-700" />
        </div>

        {/* Charts row */}
        <div className="mt-6 grid gap-4 lg:grid-cols-[1.4fr_1fr]">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-xl">Revenue & bookings · 7 months</h3>
              <Badge variant="sage">+216% growth</Badge>
            </div>
            <div className="mt-4 h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueSeries}>
                  <defs>
                    <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ff5b3a" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#ff5b3a" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(11,11,15,0.06)" />
                  <XAxis dataKey="month" stroke="rgba(11,11,15,0.5)" fontSize={11} />
                  <YAxis stroke="rgba(11,11,15,0.5)" fontSize={11} tickFormatter={(v) => `$${v / 1000}k`} />
                  <Tooltip
                    contentStyle={{ borderRadius: 12, border: "1px solid rgba(11,11,15,0.1)", fontSize: 12 }}
                    formatter={(value) => [`$${Number(value).toLocaleString()}`, "Revenue"] as [string, string]}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="#ff5b3a" fill="url(#rev)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="font-display text-xl">Trust score</h3>
            <p className="text-xs text-ink/50">Multi-factor reputation</p>
            <div className="relative mt-2 h-44">
              <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart innerRadius="65%" outerRadius="100%" data={[{ name: "trust", value: trust.total, fill: "#ff5b3a" }]} startAngle={90} endAngle={-270}>
                  <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
                  <RadialBar dataKey="value" cornerRadius={10} background={{ fill: "rgba(11,11,15,0.06)" }} />
                </RadialBarChart>
              </ResponsiveContainer>
              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                <div className="font-display text-4xl">{trust.total}</div>
                <div className="text-[10px] uppercase tracking-wider text-ink/50">Elite</div>
              </div>
            </div>
            <div className="mt-3 space-y-1.5 text-xs">
              {[
                { l: "Identity", v: trust.identity },
                { l: "Business", v: trust.business },
                { l: "Reviews", v: trust.reviews },
                { l: "Response", v: trust.responseRate },
                { l: "Completion", v: trust.completion },
                { l: "Dispute-free", v: trust.disputeFree },
              ].map((m) => (
                <div key={m.l}>
                  <div className="flex items-center justify-between text-ink/60">
                    <span>{m.l}</span>
                    <span className="font-semibold text-ink">{m.v}</span>
                  </div>
                  <div className="mt-0.5 h-1 overflow-hidden rounded-full bg-ink/5">
                    <div className={`h-full ${m.v >= 90 ? "bg-sage" : m.v >= 70 ? "bg-amber" : "bg-rose-400"}`} style={{ width: `${m.v}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Bookings bar + sources */}
        <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_1fr]">
          <Card className="p-6">
            <h3 className="font-display text-xl">Bookings per month</h3>
            <div className="mt-4 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueSeries}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(11,11,15,0.06)" />
                  <XAxis dataKey="month" stroke="rgba(11,11,15,0.5)" fontSize={11} />
                  <YAxis stroke="rgba(11,11,15,0.5)" fontSize={11} />
                  <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid rgba(11,11,15,0.1)", fontSize: 12 }} />
                  <Bar dataKey="bookings" fill="#2f6b4e" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="font-display text-xl">Lead sources</h3>
            <div className="mt-4 space-y-3">
              {sourceSeries.map((s) => (
                <div key={s.name}>
                  <div className="flex justify-between text-xs">
                    <span className="text-ink/60">{s.name}</span>
                    <span className="font-semibold">{s.value}%</span>
                  </div>
                  <div className="mt-1 h-2 overflow-hidden rounded-full bg-ink/5">
                    <div
                      className="h-full bg-gradient-to-r from-coral to-amber"
                      style={{ width: `${s.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 rounded-xl bg-cream-2 p-4 text-sm">
              <div className="flex items-center gap-2 font-semibold">
                <ShieldCheck className="h-4 w-4 text-sage" /> AI Matching is your #1 source
              </div>
              <p className="mt-1 text-xs text-ink/60">
                Pro tip: respond within 15 minutes to boost AI ranking by 12%.
              </p>
            </div>
          </Card>
        </div>

        <Card className="mt-4 overflow-hidden">
          <div className="border-b border-ink/10 p-5">
            <h3 className="font-display text-xl">Performance summary</h3>
          </div>
          <div className="grid grid-cols-2 gap-0 md:grid-cols-4">
            {[
              { icon: <Award className="h-4 w-4" />, label: "Completed events", value: "287" },
              { icon: <Clock className="h-4 w-4" />, label: "Response rate", value: "98%" },
              { icon: <Star className="h-4 w-4 fill-amber text-amber" />, label: "Avg rating", value: vendor.rating.toFixed(1) },
              { icon: <Target className="h-4 w-4" />, label: "Repeat clients", value: "38%" },
            ].map((s, i) => (
              <div key={s.label} className={`p-5 ${i < 3 ? "border-b border-ink/5 md:border-b-0 md:border-r" : ""} ${i < 2 ? "border-r border-ink/5 md:border-r-0 md:border-r" : ""}`}>
                <div className="flex items-center gap-2 text-xs text-ink/50">{s.icon} {s.label}</div>
                <div className="mt-1 font-display text-2xl">{s.value}</div>
              </div>
            ))}
          </div>
        </Card>
      </Section>
    </div>
  );
}

function Stat({ icon, label, value, delta, color }: { icon: React.ReactNode; label: string; value: string; delta: string; color: string }) {
  return (
    <Card className="p-5">
      <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${color}`}>{icon}</div>
      <div className="mt-3 text-xs font-semibold uppercase tracking-wider text-ink/50">{label}</div>
      <div className="mt-1 flex items-baseline gap-2">
        <span className="font-display text-3xl">{value}</span>
        <span className="text-[10px] font-semibold text-sage">{delta}</span>
      </div>
    </Card>
  );
}
