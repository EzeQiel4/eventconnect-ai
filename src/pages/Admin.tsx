import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { audit } from "../lib/db";
import {
  ShieldCheck,
  AlertTriangle,
  DollarSign,
  Users,
  Store,
  Check,
  X,
  Eye,
  Search,
  TrendingUp,
  ArrowUp,
  ArrowDown,
  FileText,
} from "lucide-react";
import { Section, Badge, Card, Button } from "../components/ui";
import { vendors } from "../data/vendors";

type AdminTab = "overview" | "kyc" | "disputes" | "transactions" | "audit";

export default function Admin() {
  const [tab, setTab] = useState<AdminTab>("overview");

  return (
    <div className="bg-cream pb-24">
      <div className="bg-ink py-10 text-cream">
        <Section>
          <Badge variant="coral">Admin console · Restricted access</Badge>
          <h1 className="mt-3 font-display text-5xl">Platform operations</h1>
          <p className="mt-2 max-w-xl text-cream/60">
            Monitor vendors, KYC, disputes, and transactions across the EventConnect network.
          </p>

          <div className="mt-6 flex gap-1 overflow-x-auto">
            {[
              { k: "overview", label: "Overview", icon: <TrendingUp className="h-4 w-4" /> },
              { k: "kyc", label: "KYC queue", icon: <ShieldCheck className="h-4 w-4" /> },
              { k: "disputes", label: "Disputes", icon: <AlertTriangle className="h-4 w-4" /> },
              { k: "transactions", label: "Transactions", icon: <DollarSign className="h-4 w-4" /> },
              { k: "audit", label: "Audit log", icon: <FileText className="h-4 w-4" /> },
            ].map((t) => (
              <button
                key={t.k}
                onClick={() => setTab(t.k as AdminTab)}
                className={`flex items-center gap-2 whitespace-nowrap rounded-full px-4 py-2.5 text-sm font-semibold transition ${
                  tab === t.k ? "bg-coral text-white" : "bg-cream/5 text-cream/70 hover:bg-cream/10"
                }`}
              >
                {t.icon} {t.label}
              </button>
            ))}
          </div>
        </Section>
      </div>

      <Section className="mt-10">
        {tab === "overview" && <Overview />}
        {tab === "kyc" && <KYCQueue />}
        {tab === "disputes" && <Disputes />}
        {tab === "transactions" && <Transactions />}
        {tab === "audit" && <AuditLog />}
      </Section>
    </div>
  );
}

function Overview() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        {[
          { label: "GMV (30d)", value: "$1.24M", change: "+18%", up: true, icon: <DollarSign className="h-5 w-5" /> },
          { label: "Active vendors", value: "2,419", change: "+47", up: true, icon: <Store className="h-5 w-5" /> },
          { label: "Open disputes", value: "12", change: "-3", up: false, icon: <AlertTriangle className="h-5 w-5" /> },
          { label: "KYC queue", value: "34", change: "+8", up: true, icon: <ShieldCheck className="h-5 w-5" /> },
        ].map((s) => (
          <Card key={s.label} className="p-5">
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-ink/5 text-ink/60">
                {s.icon}
              </div>
              <span className={`flex items-center gap-1 text-xs font-semibold ${s.up ? "text-sage" : "text-rose-500"}`}>
                {s.up ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                {s.change}
              </span>
            </div>
            <div className="mt-4">
              <div className="text-xs font-semibold uppercase tracking-wider text-ink/50">{s.label}</div>
              <div className="font-display text-3xl">{s.value}</div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
        <Card className="p-6">
          <div className="mb-5 flex items-center justify-between">
            <h3 className="font-display text-xl">GMV · Last 7 days</h3>
            <Badge variant="sage">+18% WoW</Badge>
          </div>
          <div className="flex h-56 items-end gap-2">
            {[62, 78, 54, 88, 92, 74, 100].map((h, i) => (
              <div key={i} className="flex flex-1 flex-col items-center gap-2">
                <div
                  className="w-full rounded-t-lg bg-gradient-to-t from-coral to-amber transition hover:opacity-80"
                  style={{ height: `${h}%` }}
                />
                <div className="text-[10px] text-ink/50">{["M", "T", "W", "T", "F", "S", "S"][i]}</div>
              </div>
            ))}
          </div>
          <div className="mt-4 grid grid-cols-3 gap-3 border-t border-ink/5 pt-4">
            <div>
              <div className="text-xs text-ink/50">Avg booking</div>
              <div className="font-display text-xl">$3,420</div>
            </div>
            <div>
              <div className="text-xs text-ink/50">Conversion</div>
              <div className="font-display text-xl">24.8%</div>
            </div>
            <div>
              <div className="text-xs text-ink/50">Refund rate</div>
              <div className="font-display text-xl">0.8%</div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="font-display text-xl">Top vendors this week</h3>
          <div className="mt-4 space-y-3">
            {vendors.slice(0, 5).map((v, i) => (
              <div key={v.id} className="flex items-center gap-3">
                <span className="w-4 text-xs font-bold text-ink/40">{i + 1}</span>
                <div className={`flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br ${v.cover} text-lg`}>
                  {v.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="truncate text-sm font-semibold">{v.name}</div>
                  <div className="text-xs text-ink/50">{v.category}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold">${(Math.round(v.priceFrom * 2.5)).toLocaleString()}</div>
                  <div className="text-[10px] text-ink/50">{Math.floor(Math.random() * 8) + 2} bookings</div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-xl">System health</h3>
          <span className="flex items-center gap-1.5 text-xs text-sage">
            <span className="h-2 w-2 animate-pulse rounded-full bg-sage" /> All systems operational
          </span>
        </div>
        <div className="mt-5 grid gap-3 md:grid-cols-4">
          {[
            { name: "Payment gateway", status: "99.99%", color: "bg-sage" },
            { name: "AI agent cluster", status: "99.97%", color: "bg-sage" },
            { name: "Search API", status: "182ms avg", color: "bg-sage" },
            { name: "Notification service", status: "99.98%", color: "bg-sage" },
          ].map((s) => (
            <div key={s.name} className="rounded-xl border border-ink/10 p-4">
              <div className="flex items-center gap-2 text-xs">
                <span className={`h-2 w-2 rounded-full ${s.color}`} />
                <span className="text-ink/60">{s.name}</span>
              </div>
              <div className="mt-2 font-display text-xl">{s.status}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function KYCQueue() {
  const [filter, setFilter] = useState<"all" | "pending" | "approved">("pending");
  const queue = [
    { id: "KYC-2841", vendor: "Ivory Events Decor", city: "Lagos", level: 3, submitted: "2h ago", docs: 4, flag: null },
    { id: "KYC-2839", vendor: "DJ Smooth T", city: "Abuja", level: 2, submitted: "5h ago", docs: 2, flag: "ID mismatch" },
    { id: "KYC-2837", vendor: "Flavour Catering Co.", city: "Lagos", level: 4, submitted: "1d ago", docs: 6, flag: null },
    { id: "KYC-2835", vendor: "Royal Shots Photography", city: "Port Harcourt", level: 3, submitted: "1d ago", docs: 4, flag: null },
    { id: "KYC-2832", vendor: "Elite MC Services", city: "Ibadan", level: 2, submitted: "2d ago", docs: 3, flag: "Liveness retry" },
    { id: "KYC-2830", vendor: "Lagos Grand Venue", city: "Lagos", level: 4, submitted: "3d ago", docs: 8, flag: null },
  ];

  const filtered = queue.filter((q) => {
    if (filter === "pending") return !q.flag;
    return true;
  });

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-1 rounded-full bg-white p-1 border border-ink/10">
          {(["pending", "all", "approved"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-full px-4 py-1.5 text-xs font-semibold capitalize transition ${
                filter === f ? "bg-ink text-cream" : "text-ink/60"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
        <div className="relative">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-ink/40" />
          <input
            placeholder="Search vendor…"
            className="rounded-full border border-ink/10 bg-white py-2 pl-9 pr-4 text-sm outline-none focus:border-ink"
          />
        </div>
      </div>


      <Card className="overflow-hidden">
        <div className="hidden grid-cols-[1fr_140px_100px_100px_1fr_180px] gap-3 border-b border-ink/5 bg-cream-2 px-5 py-3 text-xs font-semibold uppercase tracking-wider text-ink/50 md:grid">
          <span>Vendor</span>
          <span>ID</span>
          <span>Level</span>
          <span>Docs</span>
          <span>Status</span>
          <span className="text-right">Action</span>
        </div>
        <div className="divide-y divide-ink/5">
          {filtered.map((q) => (
            <div key={q.id} className="grid grid-cols-1 gap-3 px-5 py-4 md:grid-cols-[1fr_140px_100px_100px_1fr_180px] md:items-center">
              <div>
                <div className="font-semibold">{q.vendor}</div>
                <div className="text-xs text-ink/50">{q.city} · {q.submitted}</div>
              </div>
              <div className="font-mono text-xs text-ink/60">{q.id}</div>
              <div>
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                  q.level === 4 ? "bg-amber/20 text-amber-800" :
                  q.level === 3 ? "bg-violet-100 text-violet-700" :
                  "bg-sky-100 text-sky-700"
                }`}>
                  Level {q.level}
                </span>
              </div>
              <div className="text-sm text-ink/70">{q.docs} docs</div>
              <div className="text-xs">
                {q.flag ? (
                  <span className="flex items-center gap-1 text-rose-600">
                    <AlertTriangle className="h-3 w-3" /> {q.flag}
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-sage">
                    <Check className="h-3 w-3" /> Auto-verified
                  </span>
                )}
              </div>
              <div className="flex justify-end gap-2">
                <button className="flex h-9 w-9 items-center justify-center rounded-lg border border-ink/10 hover:bg-ink/5">
                  <Eye className="h-4 w-4" />
                </button>
                <button className="flex h-9 w-9 items-center justify-center rounded-lg bg-sage text-white hover:opacity-90">
                  <Check className="h-4 w-4" />
                </button>
                <button className="flex h-9 w-9 items-center justify-center rounded-lg bg-rose-500 text-white hover:opacity-90">
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function Disputes() {
  const disputes = [
    { id: "DSP-182", client: "Adaeze O.", vendor: "DJ Smooth T", amount: 1200, reason: "Vendor no-show on event day", stage: "Evidence collection", aiSummary: "Client provided photos of empty stage at 9pm. Vendor claims car breakdown. Both parties uploaded evidence.", urgency: "High" },
    { id: "DSP-181", client: "Tunde B.", vendor: "Lagos Blooms", amount: 640, reason: "Décor did not match portfolio", stage: "Admin review", aiSummary: "Client provided 14 photos showing color mismatch. Vendor uploaded mood board. AI confidence: 78% in favor of client.", urgency: "Medium" },
    { id: "DSP-179", client: "Kemi D.", vendor: "Royal Catering", amount: 2100, reason: "Under-delivered portions", stage: "Final decision", aiSummary: "Guest count was 180, food ran out at 120. Vendor served 2 extra trays. AI recommends 50% refund.", urgency: "Low" },
  ];

  return (
    <div className="space-y-5">
      <div className="grid gap-3 md:grid-cols-3">
        <Card className="p-5">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-ink/50">
            <AlertTriangle className="h-4 w-4 text-rose-500" /> Open disputes
          </div>
          <div className="mt-2 font-display text-3xl">12</div>
          <div className="mt-1 text-xs text-ink/50">3 high urgency</div>
        </Card>
        <Card className="p-5">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-ink/50">
            <DollarSign className="h-4 w-4" /> Escrow frozen
          </div>
          <div className="mt-2 font-display text-3xl">$18,240</div>
          <div className="mt-1 text-xs text-ink/50">Across 12 cases</div>
        </Card>
        <Card className="p-5">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-ink/50">
            <TrendingUp className="h-4 w-4 text-sage" /> Avg resolution
          </div>
          <div className="mt-2 font-display text-3xl">2.4 days</div>
          <div className="mt-1 text-xs text-ink/50">-18% vs last month</div>
        </Card>
      </div>

      <div className="space-y-4">
        {disputes.map((d) => (
          <Card key={d.id} className="p-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <Badge variant={d.urgency === "High" ? "coral" : d.urgency === "Medium" ? "amber" : "neutral"}>
                    {d.urgency} urgency
                  </Badge>
                  <span className="font-mono text-xs text-ink/50">{d.id}</span>
                </div>
                <h3 className="mt-2 font-display text-2xl">{d.reason}</h3>
                <div className="mt-1 text-sm text-ink/60">
                  {d.client} vs {d.vendor} · <span className="font-semibold">${d.amount.toLocaleString()}</span> in escrow
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <Badge variant="sage">{d.stage}</Badge>
                <div className="flex gap-2">
                  <Button variant="outline">Request info</Button>
                  <Button variant="primary">Decide</Button>
                </div>
              </div>
            </div>
            <div className="mt-5 rounded-xl bg-ink p-4 text-cream">
              <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-coral">
                <span className="h-1.5 w-1.5 rounded-full bg-coral pulse-ring" /> Dispute Agent · AI summary
              </div>
              <p className="mt-2 text-sm leading-relaxed text-cream/90">{d.aiSummary}</p>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <button className="inline-flex items-center gap-1.5 rounded-full border border-ink/10 px-3 py-1.5 text-xs font-semibold hover:bg-ink/5">
                <FileText className="h-3 w-3" /> 14 evidence files
              </button>
              <button className="inline-flex items-center gap-1.5 rounded-full border border-ink/10 px-3 py-1.5 text-xs font-semibold hover:bg-ink/5">
                <Users className="h-3 w-3" /> View thread
              </button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function Transactions() {
  const txns = [
    { id: "TX-9821", date: "Dec 28, 14:02", client: "Adaeze O.", vendor: "Lumière Studios", amount: 720, status: "Escrowed", method: "Card" },
    { id: "TX-9820", date: "Dec 28, 12:41", client: "Femi A.", vendor: "Grand Orchid Estate", amount: 4980, status: "Completed", method: "Transfer" },
    { id: "TX-9819", date: "Dec 28, 11:15", client: "Ngozi E.", vendor: "Saffron & Thyme", amount: 2460, status: "Escrowed", method: "Card" },
    { id: "TX-9818", date: "Dec 28, 09:03", client: "Tunde B.", vendor: "DJ Rhythm Kings", amount: 1200, status: "Refunded", method: "Card" },
    { id: "TX-9817", date: "Dec 27, 22:18", client: "Seun K.", vendor: "Platinum Event Co.", amount: 3500, status: "Completed", method: "Transfer" },
    { id: "TX-9816", date: "Dec 27, 18:44", client: "Kemi D.", vendor: "Maison Fleur Decor", amount: 4200, status: "In progress", method: "Card" },
  ];
  const color: Record<string, string> = {
    Escrowed: "bg-coral/10 text-coral",
    Completed: "bg-sage/15 text-sage",
    Refunded: "bg-slate-200 text-slate-700",
    "In progress": "bg-amber/15 text-amber-700",
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="text-sm text-ink/60">
          Showing <span className="font-semibold text-ink">{txns.length}</span> of 8,412 transactions
        </div>
        <div className="flex gap-2">
          <Button variant="outline">Export CSV</Button>
          <Button variant="primary">Advanced filters</Button>
        </div>
      </div>
      <Card className="overflow-hidden">
        <div className="hidden grid-cols-[100px_1fr_1fr_100px_100px_80px] gap-3 border-b border-ink/5 bg-cream-2 px-5 py-3 text-xs font-semibold uppercase tracking-wider text-ink/50 md:grid">
          <span>Tx ID</span>
          <span>Client</span>
          <span>Vendor</span>
          <span>Amount</span>
          <span>Status</span>
          <span>Method</span>
        </div>
        <div className="divide-y divide-ink/5">
          {txns.map((t) => (
            <div key={t.id} className="grid grid-cols-1 gap-2 px-5 py-4 md:grid-cols-[100px_1fr_1fr_100px_100px_80px] md:items-center">
              <div className="font-mono text-xs text-ink/60">{t.id}</div>
              <div>
                <div className="text-sm font-semibold">{t.client}</div>
                <div className="text-[10px] text-ink/40 md:hidden">{t.date}</div>
              </div>
              <div className="text-sm">{t.vendor}</div>
              <div className="font-display text-lg">${t.amount.toLocaleString()}</div>
              <div>
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${color[t.status]}`}>{t.status}</span>
              </div>
              <div className="text-xs text-ink/50">{t.method}</div>
            </div>
          ))}
        </div>
      </Card>

      <Link to="/" className="inline-block text-sm text-coral hover:underline">← Return to customer view</Link>
    </div>
  );
}

function AuditLog() {
  const [entries, setEntries] = useState(audit.list());

  useEffect(() => {
    const onUpdate = () => setEntries(audit.list());
    window.addEventListener("audit:update", onUpdate);
    return () => window.removeEventListener("audit:update", onUpdate);
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl">Audit log</h2>
          <p className="text-sm text-ink/60">Immutable record of every privileged action.</p>
        </div>
        <Button variant="outline" onClick={() => { audit.clear(); setEntries([]); }}>
          Clear log
        </Button>
      </div>
      <Card className="overflow-hidden">
        <div className="hidden grid-cols-[120px_120px_160px_1fr_180px] gap-3 border-b border-ink/10 bg-cream-2 px-5 py-3 text-[10px] font-semibold uppercase tracking-wider text-ink/50 md:grid">
          <span>Actor</span>
          <span>Action</span>
          <span>Entity</span>
          <span>Details</span>
          <span>Timestamp</span>
        </div>
        <div className="divide-y divide-ink/5">
          {entries.length === 0 && (
            <div className="p-10 text-center text-sm text-ink/50">
              No audit entries yet. Actions like creating escrow, approving milestones, or upgrading subscriptions will appear here.
            </div>
          )}
          {entries.map((e) => (
            <div key={e.id} className="grid grid-cols-1 gap-1 px-5 py-3 text-sm md:grid-cols-[120px_120px_160px_1fr_180px] md:items-center">
              <span className={`inline-block w-fit rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
                e.actor === "admin" ? "bg-coral/10 text-coral" : e.actor === "vendor" ? "bg-sage/15 text-sage" : "bg-ink/10 text-ink"
              }`}>{e.actor}</span>
              <span className="font-mono text-xs">{e.action}</span>
              <span className="truncate font-mono text-xs text-ink/60">{e.entity}</span>
              <span className="text-xs text-ink/70">{e.details ?? "—"}</span>
              <span className="text-[10px] text-ink/50">{new Date(e.ts).toLocaleString()}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
