import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Wallet,
  Calendar,
  Bell,
  ShoppingBag,
  TrendingUp,
  Clock,
  Users,
  CheckCircle2,
  AlertTriangle,
  Lock,
  ArrowUpRight,
  Plus,
  Sparkles,
  ShieldCheck,
  Eye,
  EyeOff,
} from "lucide-react";
import { Section, Badge, Card, Button } from "../components/ui";
import { useApp } from "../context/AppContext";

export default function Dashboard() {
  const [tab, setTab] = useState<"overview" | "bookings" | "wallet" | "guests">("overview");
  return (
    <div className="bg-cream pb-24">
      <Section className="pt-10">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <Badge variant="coral">
              <span className="h-1.5 w-1.5 rounded-full bg-coral pulse-ring" /> Event in progress
            </Badge>
            <h1 className="mt-3 font-display text-5xl">Tunde & Adaeze</h1>
            <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-ink/60">
              <span>Wedding · Luxury</span>
              <span>·</span>
              <Calendar className="h-4 w-4" />
              <span>March 14, 2026</span>
              <span>·</span>
              <span>180 guests</span>
              <span>·</span>
              <span>Lagos</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link to="/matching">
              <Button variant="outline">
                <Sparkles className="h-4 w-4" /> AI Match
              </Button>
            </Link>
            <Link to="/copilot">
              <Button variant="outline">
                <Sparkles className="h-4 w-4" /> Copilot
              </Button>
            </Link>
            <Link to="/escrow">
              <Button variant="outline">
                <ShieldCheck className="h-4 w-4" /> Escrow
              </Button>
            </Link>
            <Link to="/installments">
              <Button variant="outline">
                <Users className="h-4 w-4" /> Installments
              </Button>
            </Link>
            <Link to="/create-event">
              <Button variant="primary">
                <Plus className="h-4 w-4" /> New event
              </Button>
            </Link>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-8 flex gap-1 overflow-x-auto border-b border-ink/10">
          {[
            { k: "overview", label: "Overview", icon: <TrendingUp className="h-4 w-4" /> },
            { k: "bookings", label: "Bookings", icon: <ShoppingBag className="h-4 w-4" /> },
            { k: "wallet", label: "Wallet", icon: <Wallet className="h-4 w-4" /> },
          ].map((t) => (
            <button
              key={t.k}
              onClick={() => setTab(t.k as typeof tab)}
              className={`flex items-center gap-2 whitespace-nowrap border-b-2 px-4 py-3 text-sm font-semibold transition ${
                tab === t.k
                  ? "border-ink text-ink"
                  : "border-transparent text-ink/50 hover:text-ink"
              }`}
            >
              {t.icon} {t.label}
            </button>
          ))}
        </div>
      </Section>

      <Section className="mt-8">
        {tab === "overview" && <OverviewTab />}
        {tab === "bookings" && <BookingsTab />}
        {tab === "wallet" && <WalletTab />}
        {tab === "guests" && <GuestsTab />}
      </Section>
    </div>
  );
}

function OverviewTab() {
  const { bookings, walletBalance, notifications } = useApp();
  const totalBudget = 24000;
  const spent = bookings.reduce((s, b) => s + b.amount, 0);
  const escrowed = bookings.filter((b) => b.status === "Escrowed" || b.status === "In progress").reduce((s, b) => s + b.amount, 0);

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
      <div className="space-y-6">
        {/* Budget tracker */}
        <Card className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-ink/50">Total budget</div>
              <div className="mt-1 font-display text-4xl">${totalBudget.toLocaleString()}</div>
            </div>
            <Badge variant={spent > totalBudget ? "coral" : "sage"}>
              {spent > totalBudget ? "Over budget" : "On track"}
            </Badge>
          </div>
          <div className="mt-5">
            <div className="mb-2 flex justify-between text-xs">
              <span className="text-ink/60">Spent: ${spent.toLocaleString()}</span>
              <span className="text-ink/60">Remaining: ${(totalBudget - spent).toLocaleString()}</span>
            </div>
            <div className="h-2.5 overflow-hidden rounded-full bg-ink/5">
              <div
                className="h-full bg-gradient-to-r from-coral via-amber to-sage"
                style={{ width: `${Math.min(100, (spent / totalBudget) * 100)}%` }}
              />
            </div>
            <div className="mt-4 grid grid-cols-3 gap-3 text-center">
              <MiniStat label="Booked" value={`$${spent.toLocaleString()}`} color="bg-coral" />
              <MiniStat label="In escrow" value={`$${escrowed.toLocaleString()}`} color="bg-amber" />
              <MiniStat label="Available" value={`$${(totalBudget - spent).toLocaleString()}`} color="bg-sage" />
            </div>
          </div>
        </Card>

        {/* Timeline */}
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl">Event timeline</h2>
            <span className="text-xs text-ink/50">67 days to go</span>
          </div>
          <div className="mt-6 space-y-5">
            {[
              { phase: "Foundation", date: "Jun 2025", task: "Locked venue & date", done: true },
              { phase: "Foundation", date: "Jul 2025", task: "Booked photographer & planner", done: true },
              { phase: "Design", date: "Sep 2025", task: "Finalized palette, guest list", done: true },
              { phase: "Design", date: "Oct 2025", task: "Caterer + décor confirmed", done: false, current: true },
              { phase: "Build", date: "Dec 2025", task: "Send invitations, RSVPs", done: false },
              { phase: "Execute", date: "Mar 14, 2026", task: "Wedding day 🎉", done: false },
            ].map((t, i, arr) => (
              <div key={i} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full ${
                      t.done
                        ? "bg-sage text-white"
                        : t.current
                        ? "bg-coral text-white pulse-ring"
                        : "bg-ink/10 text-ink/50"
                    }`}
                  >
                    {t.done ? <CheckCircle2 className="h-4 w-4" /> : <span className="text-xs font-bold">{i + 1}</span>}
                  </div>
                  {i < arr.length - 1 && <div className={`mt-1 w-px flex-1 ${t.done ? "bg-sage" : "bg-ink/10"}`} />}
                </div>
                <div className="flex-1 pb-5">
                  <div className="flex items-center justify-between">
                    <div className="font-semibold">{t.task}</div>
                    <div className="text-xs text-ink/50">{t.date}</div>
                  </div>
                  <div className="text-xs text-ink/50">{t.phase}</div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Bookings */}
        <Card className="overflow-hidden">
          <div className="flex items-center justify-between border-b border-ink/5 p-5">
            <h2 className="font-display text-xl">Active bookings</h2>
            <Link to="/marketplace" className="text-xs font-semibold text-coral hover:underline">
              Browse more vendors →
            </Link>
          </div>
          <div className="divide-y divide-ink/5">
            {bookings.map((b) => (
              <div key={b.id} className="flex items-center gap-4 p-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-ink to-ink-2 text-sm font-bold text-cream">
                  {b.vendorName.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <div className="font-semibold">{b.vendorName}</div>
                    <span className="text-xs text-ink/40">· {b.id}</span>
                  </div>
                  <div className="text-xs text-ink/50">{b.category} · {new Date(b.date).toLocaleDateString()}</div>
                </div>
                <div className="hidden sm:block">
                  <StatusPill status={b.status} />
                </div>
                <div className="text-right">
                  <div className="font-display text-lg">${b.amount.toLocaleString()}</div>
                  <div className="text-[10px] uppercase tracking-wider text-ink/40">Total</div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Right column */}
      <div className="space-y-6">
        <Card className="overflow-hidden p-0">
          <div className="bg-ink p-6 text-cream">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-cream/50">
                <Wallet className="h-3.5 w-3.5" /> Wallet
              </div>
              <WalletBalance />
            </div>
            <div className="mt-3 font-display text-4xl">${walletBalance.toLocaleString()}</div>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <button className="rounded-lg bg-cream text-ink py-2 text-xs font-semibold hover:bg-cream/90">
                Deposit
              </button>
              <button className="rounded-lg bg-cream/10 text-cream py-2 text-xs font-semibold hover:bg-cream/20">
                Withdraw
              </button>
            </div>
          </div>
          <div className="p-5">
            <div className="text-xs font-semibold uppercase tracking-wider text-ink/50">Recent</div>
            <div className="mt-3 space-y-3">
              {[
                { label: "Escrow · Lumière Studios", amount: "-$720", date: "2h ago", kind: "out" },
                { label: "Deposit", amount: "+$5,000", date: "1d ago", kind: "in" },
                { label: "Refund · backup DJ", amount: "+$350", date: "4d ago", kind: "in" },
              ].map((t, i) => (
                <div key={i} className="flex items-center justify-between text-sm">
                  <div>
                    <div className="font-medium">{t.label}</div>
                    <div className="text-xs text-ink/50">{t.date}</div>
                  </div>
                  <div className={`font-semibold ${t.kind === "in" ? "text-sage" : "text-ink"}`}>{t.amount}</div>
                </div>
              ))}
            </div>
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              <h3 className="font-display text-lg">Notifications</h3>
            </div>
            <span className="text-xs text-ink/40">{notifications.filter((n) => !n.read).length} new</span>
          </div>
          <div className="mt-4 space-y-3">
            {notifications.slice(0, 4).map((n) => (
              <div key={n.id} className={`rounded-xl p-3 ${n.read ? "bg-cream-2" : "bg-coral/5 ring-1 ring-coral/20"}`}>
                <div className="flex items-start gap-2">
                  <div className={`mt-1 h-1.5 w-1.5 rounded-full ${n.read ? "bg-ink/30" : "bg-coral"}`} />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold">{n.title}</div>
                    <div className="mt-0.5 text-xs text-ink/60 line-clamp-2">{n.body}</div>
                    <div className="mt-1 text-[10px] text-ink/40">{n.time}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-coral" />
            <h3 className="font-display text-lg">Emergency Agent</h3>
          </div>
          <p className="mt-2 text-xs text-ink/60">
            Active. Monitoring 3 bookings. 2 backup vendors on standby for critical services.
          </p>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <div className="rounded-lg bg-sage/10 p-2 text-center">
              <div className="font-display text-xl text-sage">0</div>
              <div className="text-[10px] text-ink/50">Failures</div>
            </div>
            <div className="rounded-lg bg-coral/10 p-2 text-center">
              <div className="font-display text-xl text-coral">2</div>
              <div className="text-[10px] text-ink/50">Backups</div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

function WalletBalance() {
  const [hide, setHide] = useState(false);
  return (
    <button onClick={() => setHide((v) => !v)} className="text-cream/50 hover:text-cream">
      {hide ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
    </button>
  );
}

function BookingsTab() {
  const { bookings } = useApp();
  return (
    <div className="space-y-4">
      {bookings.map((b) => (
        <Card key={b.id} className="overflow-hidden p-0">
          <div className="grid gap-0 md:grid-cols-[auto_1fr_auto] md:items-center">
            <div className={`flex aspect-square w-full items-center justify-center bg-gradient-to-br from-ink to-ink-2 text-3xl font-display text-cream md:w-32`}>
              {b.vendorName.charAt(0)}
            </div>
            <div className="p-5">
              <div className="flex items-center gap-2">
                <h3 className="font-display text-xl">{b.vendorName}</h3>
                <StatusPill status={b.status} />
              </div>
              <div className="text-xs text-ink/50">
                {b.category} · {b.id} · {new Date(b.date).toLocaleDateString()}
              </div>
              <div className="mt-4 grid grid-cols-3 gap-2">
                {b.installments.map((i) => (
                  <div key={i.label} className="rounded-lg border border-ink/10 p-2.5">
                    <div className="text-[10px] uppercase tracking-wider text-ink/40">{i.label}</div>
                    <div className="mt-1 text-sm font-semibold">${Math.round(b.amount * (i.pct / 100)).toLocaleString()}</div>
                    <div className="mt-1.5 flex items-center gap-1 text-[10px]">
                      {i.status === "Paid" ? (
                        <><CheckCircle2 className="h-3 w-3 text-sage" /><span className="text-sage">Paid</span></>
                      ) : i.status === "Upcoming" ? (
                        <><Clock className="h-3 w-3 text-amber-600" /><span className="text-amber-600">Upcoming</span></>
                      ) : (
                        <><Lock className="h-3 w-3 text-ink/40" /><span className="text-ink/50">Due</span></>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="border-t border-ink/5 p-5 text-right md:border-l md:border-t-0">
              <div className="text-xs text-ink/50">Total</div>
              <div className="font-display text-2xl">${b.amount.toLocaleString()}</div>
              <Button variant="outline" className="mt-3">
                <ArrowUpRight className="h-3 w-3" /> View details
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

function WalletTab() {
  const { walletBalance } = useApp();
  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_400px]">
      <Card className="overflow-hidden p-0">
        <div className="bg-ink p-8 text-cream">
          <div className="text-xs uppercase tracking-wider text-cream/50">Available balance</div>
          <div className="mt-2 font-display text-6xl">${walletBalance.toLocaleString()}</div>
          <div className="mt-6 flex gap-3">
            <Button variant="primary">Deposit funds</Button>
            <Button variant="ghost" className="border border-cream/20 text-cream hover:bg-cream/10">
              Withdraw
            </Button>
          </div>
        </div>
        <div className="p-6">
          <h3 className="font-display text-xl">Transaction history</h3>
          <div className="mt-4 divide-y divide-ink/5">
            {[
              { id: "TX-4821", desc: "Escrow deposit · Lumière Studios", amount: -720, date: "Dec 28, 2025 14:02", method: "Card ****4821" },
              { id: "TX-4819", desc: "Wallet deposit", amount: 5000, date: "Dec 27, 2025 09:14", method: "Bank transfer" },
              { id: "TX-4781", desc: "Refund · backup DJ cancellation", amount: 350, date: "Dec 24, 2025 11:30", method: "Auto-refund" },
              { id: "TX-4760", desc: "Escrow · Saffron & Thyme deposit", amount: -2460, date: "Dec 20, 2025 16:45", method: "Card ****4821" },
              { id: "TX-4722", desc: "Escrow · Grand Orchid Estate deposit", amount: -3750, date: "Dec 15, 2025 10:20", method: "Card ****4821" },
            ].map((t) => (
              <div key={t.id} className="flex items-center justify-between py-3">
                <div>
                  <div className="text-sm font-semibold">{t.desc}</div>
                  <div className="text-xs text-ink/50">
                    {t.id} · {t.date} · {t.method}
                  </div>
                </div>
                <div className="text-right">
                  <div className={`font-display text-lg ${t.amount > 0 ? "text-sage" : "text-ink"}`}>
                    {t.amount > 0 ? "+" : ""}${Math.abs(t.amount).toLocaleString()}
                  </div>
                  <button className="text-[10px] uppercase tracking-wider text-ink/40 hover:text-ink">Receipt ↓</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      <div className="space-y-6">
        <Card className="p-6">
          <div className="flex items-center gap-2">
            <Lock className="h-5 w-5 text-coral" />
            <h3 className="font-display text-lg">Escrow summary</h3>
          </div>
          <div className="mt-4 space-y-3 text-sm">
            <Row label="Total escrowed" value="$13,100" />
            <Row label="Pending release" value="$4,920" />
            <Row label="Released this month" value="$7,440" />
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-sage" />
            <h3 className="font-display text-lg">Payment methods</h3>
          </div>
          <div className="mt-4 space-y-2">
            <div className="flex items-center justify-between rounded-xl border border-ink/10 p-3">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-12 items-center justify-center rounded bg-ink text-[10px] font-bold text-cream">VISA</div>
                <div>
                  <div className="text-sm font-semibold">•••• 4821</div>
                  <div className="text-xs text-ink/50">Expires 08/28</div>
                </div>
              </div>
              <Badge variant="sage">Default</Badge>
            </div>
            <button className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-ink/20 py-3 text-sm text-ink/60 hover:border-ink/40">
              <Plus className="h-4 w-4" /> Add payment method
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
}

function GuestsTab() {
  const guests = [
    { name: "Adaeze Okonkwo", rsvp: "Yes", table: "1", email: "adaeze@…" },
    { name: "Femi Adeleke", rsvp: "Yes", table: "1", email: "femi@…" },
    { name: "Ngozi Eze", rsvp: "Maybe", table: "3", email: "ngozi@…" },
    { name: "Tunde Bakare", rsvp: "Yes", table: "2", email: "tunde@…" },
    { name: "Ifeoma Uzoma", rsvp: "No", table: "-", email: "ifeoma@…" },
    { name: "Seun Kolade", rsvp: "Yes", table: "2", email: "seun@…" },
    { name: "Bola Thompson", rsvp: "Pending", table: "-", email: "bola@…" },
    { name: "Yinka Adebayo", rsvp: "Yes", table: "4", email: "yinka@…" },
  ];
  const counts = {
    yes: guests.filter((g) => g.rsvp === "Yes").length,
    maybe: guests.filter((g) => g.rsvp === "Maybe").length,
    no: guests.filter((g) => g.rsvp === "No").length,
    pending: guests.filter((g) => g.rsvp === "Pending").length,
  };
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <MiniStat label="Yes" value={counts.yes} color="bg-sage" />
        <MiniStat label="Maybe" value={counts.maybe} color="bg-amber" />
        <MiniStat label="No" value={counts.no} color="bg-rose-500" />
        <MiniStat label="Pending" value={counts.pending} color="bg-ink/40" />
      </div>
      <Card className="overflow-hidden">
        <div className="flex items-center justify-between border-b border-ink/5 p-5">
          <h3 className="font-display text-xl">Guest list</h3>
          <div className="flex gap-2">
            <Button variant="outline">Invite</Button>
            <Button variant="primary">
              <Plus className="h-4 w-4" /> Add guest
            </Button>
          </div>
        </div>
        <div className="divide-y divide-ink/5">
          <div className="grid grid-cols-[1fr_80px_60px_1fr_auto] gap-4 bg-cream-2 px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-ink/50">
            <span>Name</span>
            <span>RSVP</span>
            <span>Table</span>
            <span className="hidden md:block">Email</span>
            <span></span>
          </div>
          {guests.map((g) => (
            <div key={g.name} className="grid grid-cols-[1fr_80px_60px_1fr_auto] items-center gap-4 px-5 py-3 text-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-coral to-amber text-sm font-bold text-white">
                  {g.name.charAt(0)}
                </div>
                <span className="font-medium">{g.name}</span>
              </div>
              <RsvpBadge rsvp={g.rsvp} />
              <span className="text-ink/60">{g.table}</span>
              <span className="hidden text-xs text-ink/50 md:block">{g.email}</span>
              <button className="text-xs font-semibold text-coral hover:underline">Edit</button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
  const map: Record<string, string> = {
    Escrowed: "bg-coral/10 text-coral",
    "In progress": "bg-amber/15 text-amber-700",
    Completed: "bg-sage/15 text-sage",
    Refunded: "bg-slate-200 text-slate-700",
    "Under review": "bg-violet-100 text-violet-700",
  };
  return <span className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider ${map[status] ?? "bg-ink/10 text-ink"}`}>{status}</span>;
}

function RsvpBadge({ rsvp }: { rsvp: string }) {
  const map: Record<string, string> = {
    Yes: "bg-sage/15 text-sage",
    No: "bg-rose-100 text-rose-700",
    Maybe: "bg-amber/15 text-amber-700",
    Pending: "bg-ink/10 text-ink/60",
  };
  return <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${map[rsvp]}`}>{rsvp}</span>;
}

function MiniStat({ label, value, color }: { label: string; value: React.ReactNode; color: string }) {
  return (
    <div className="rounded-xl border border-ink/10 bg-white p-4">
      <div className="flex items-center gap-2 text-xs text-ink/50">
        <span className={`h-2 w-2 rounded-full ${color}`} />
        {label}
      </div>
      <div className="mt-1 font-display text-2xl">{value}</div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-ink/60">{label}</span>
      <span className="font-display text-lg">{value}</span>
    </div>
  );
}

export const _unused = { AlertTriangle };
