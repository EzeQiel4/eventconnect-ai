import {
  Calendar,
  DollarSign,
  ShoppingBag,
  Lock,
  Users,
  TrendingUp,
  ArrowUpRight,
  Sparkles,
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
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Section, Badge, Card } from "../components/ui";
import { usePlatformStore } from "../store/usePlatformStore";
import { useApp } from "../context/AppContext";
import { vendors } from "../data/vendors";

const monthly = [
  { m: "Jul", revenue: 84000, bookings: 102, vendors: 312, customers: 412 },
  { m: "Aug", revenue: 112000, bookings: 138, vendors: 348, customers: 524 },
  { m: "Sep", revenue: 156000, bookings: 187, vendors: 395, customers: 671 },
  { m: "Oct", revenue: 198000, bookings: 234, vendors: 442, customers: 812 },
  { m: "Nov", revenue: 247000, bookings: 289, vendors: 498, customers: 968 },
  { m: "Dec", revenue: 312000, bookings: 358, vendors: 562, customers: 1185 },
  { m: "Jan", revenue: 384000, bookings: 421, vendors: 627, customers: 1412 },
];

const categoryMix = [
  { name: "Wedding", value: 42, color: "#ff5b3a" },
  { name: "Birthday", value: 18, color: "#f5b038" },
  { name: "Corporate", value: 26, color: "#2f6b4e" },
  { name: "Custom", value: 14, color: "#0b0b0f" },
];

export default function Analytics() {
  const { escrow, installments } = usePlatformStore();
  const { events } = useApp();

  const totalEscrow = escrow.reduce((s, e) => s + e.amount, 0);
  const totalInstallments = installments.reduce((s, p) => s + p.totalAmount, 0);

  return (
    <div className="bg-cream pb-20">
      <Section className="pt-10">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <Badge variant="coral">
              <TrendingUp className="h-3 w-3" /> Executive dashboard · Live
            </Badge>
            <h1 className="mt-3 font-display text-4xl md:text-5xl">Platform analytics</h1>
            <p className="mt-1 text-ink/60">Revenue, bookings, escrow volume, vendor & customer growth.</p>
          </div>
        </div>

        {/* KPI row */}
        <div className="mt-8 grid gap-3 md:grid-cols-3 lg:grid-cols-6">
          <KPI icon={<DollarSign />} label="Revenue (30d)" value="$384k" delta="+23%" color="text-coral" />
          <KPI icon={<ShoppingBag />} label="Bookings" value="421" delta="+18%" color="text-sage" />
          <KPI icon={<Lock />} label="Escrow volume" value={`$${(totalEscrow / 1000).toFixed(0)}k`} delta="+31%" color="text-amber-700" />
          <KPI icon={<Users />} label="Active vendors" value={`${vendors.length * 89}`} delta="+12%" color="text-violet-700" />
          <KPI icon={<Users />} label="Customers" value="1,412" delta="+19%" color="text-coral" />
          <KPI icon={<Calendar />} label="Events" value={`${events.length + 1247}`} delta="+27%" color="text-sage" />
        </div>

        {/* Revenue chart */}
        <Card className="mt-6 p-6">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-xl">Revenue & bookings · last 7 months</h3>
            <div className="hidden gap-1 md:flex">
              <span className="rounded-full bg-coral/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-coral">Revenue</span>
              <span className="rounded-full bg-sage/15 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-sage">Bookings</span>
            </div>
          </div>
          <div className="mt-4 h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthly}>
                <defs>
                  <linearGradient id="rev2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ff5b3a" stopOpacity={0.5} />
                    <stop offset="95%" stopColor="#ff5b3a" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(11,11,15,0.06)" />
                <XAxis dataKey="m" stroke="rgba(11,11,15,0.5)" fontSize={11} />
                <YAxis yAxisId="left" stroke="rgba(11,11,15,0.5)" fontSize={11} tickFormatter={(v) => `$${v / 1000}k`} />
                <YAxis yAxisId="right" orientation="right" stroke="rgba(11,11,15,0.5)" fontSize={11} />
                <Tooltip
                  contentStyle={{ borderRadius: 12, border: "1px solid rgba(11,11,15,0.1)", fontSize: 12 }}
                  formatter={(value, name) =>
                    (name === "revenue"
                      ? [`$${Number(value).toLocaleString()}`, "Revenue"]
                      : [String(value), "Bookings"]) as [string, string]
                  }
                />
                <Area yAxisId="left" type="monotone" dataKey="revenue" stroke="#ff5b3a" fill="url(#rev2)" strokeWidth={2} />
                <Line yAxisId="right" type="monotone" dataKey="bookings" stroke="#2f6b4e" strokeWidth={2} dot={{ r: 3 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Lower row */}
        <div className="mt-4 grid gap-4 lg:grid-cols-3">
          <Card className="p-6 lg:col-span-2">
            <h3 className="font-display text-xl">Vendor & customer growth</h3>
            <div className="mt-4 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthly}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(11,11,15,0.06)" />
                  <XAxis dataKey="m" stroke="rgba(11,11,15,0.5)" fontSize={11} />
                  <YAxis stroke="rgba(11,11,15,0.5)" fontSize={11} />
                  <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid rgba(11,11,15,0.1)", fontSize: 12 }} />
                  <Line type="monotone" dataKey="vendors" stroke="#0b0b0f" strokeWidth={2} dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="customers" stroke="#ff5b3a" strokeWidth={2} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="font-display text-xl">Event categories</h3>
            <div className="mt-4 h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={categoryMix} dataKey="value" innerRadius={48} outerRadius={80} paddingAngle={3}>
                    {categoryMix.map((c) => (
                      <Cell key={c.name} fill={c.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid rgba(11,11,15,0.1)", fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-2 space-y-1.5">
              {categoryMix.map((c) => (
                <div key={c.name} className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ background: c.color }} />
                    {c.name}
                  </span>
                  <span className="font-semibold">{c.value}%</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Bookings bar */}
        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          <Card className="p-6">
            <h3 className="font-display text-xl">Bookings per month</h3>
            <div className="mt-4 h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthly}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(11,11,15,0.06)" />
                  <XAxis dataKey="m" stroke="rgba(11,11,15,0.5)" fontSize={11} />
                  <YAxis stroke="rgba(11,11,15,0.5)" fontSize={11} />
                  <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid rgba(11,11,15,0.1)", fontSize: 12 }} />
                  <Bar dataKey="bookings" fill="#f5b038" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="font-display text-xl">Financial breakdown</h3>
            <div className="mt-4 space-y-3 text-sm">
              <Row label="Total escrow under management" value={`$${totalEscrow.toLocaleString()}`} pct={84} color="bg-coral" />
              <Row label="Installments outstanding" value={`$${totalInstallments.toLocaleString()}`} pct={45} color="bg-amber" />
              <Row label="Subscription MRR" value="$24,650" pct={68} color="bg-sage" />
              <Row label="Featured listing fees" value="$8,120" pct={32} color="bg-violet-500" />
              <Row label="AI Premium subscribers" value="412" pct={56} color="bg-ink" />
            </div>
            <div className="mt-5 rounded-xl bg-cream-2 p-4 text-sm">
              <div className="flex items-center gap-2 font-semibold">
                <Sparkles className="h-4 w-4 text-coral" /> AI-powered insight
              </div>
              <p className="mt-1 text-xs text-ink/60">
                Installments are growing 2.3× faster than direct payments. Recommend promoting BNPL on the booking confirmation page.
              </p>
            </div>
          </Card>
        </div>
      </Section>
    </div>
  );
}

function KPI({ icon, label, value, delta, color }: { icon: React.ReactNode; label: string; value: string; delta: string; color: string }) {
  return (
    <Card className="p-4">
      <div className={`${color}`}>{icon}</div>
      <div className="mt-2 text-[10px] font-semibold uppercase tracking-wider text-ink/50">{label}</div>
      <div className="font-display text-2xl">{value}</div>
      <div className="flex items-center gap-0.5 text-[10px] font-semibold text-sage">
        <ArrowUpRight className="h-2.5 w-2.5" /> {delta}
      </div>
    </Card>
  );
}

function Row({ label, value, pct, color }: { label: string; value: string; pct: number; color: string }) {
  return (
    <div>
      <div className="flex items-center justify-between text-xs">
        <span className="text-ink/60">{label}</span>
        <span className="font-semibold">{value}</span>
      </div>
      <div className="mt-1 h-2 overflow-hidden rounded-full bg-ink/5">
        <div className={`h-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
