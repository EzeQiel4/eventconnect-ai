import { Link } from "react-router-dom";
import {
  ArrowRight,
  Check,
  ShieldCheck,
  Wallet,
  Sparkles,
  Store,
  Calendar,
  Bell,
  Users,
  Zap,
  Star,
  TrendingUp,
  Lock,
} from "lucide-react";
import { Section, Badge, Card, Button } from "../components/ui";
import { vendors, categoryEmojis, type VendorCategory } from "../data/vendors";
import { packages } from "../data/packages";

export default function Landing() {
  return (
    <div className="bg-cream">
      <Hero />
      <LogoBar />
      <QuickAccess />
      <HowItWorks />
      <AIPreview />
      <CategoriesStrip />
      <MarketplacePreview />
      <PackagesPreview />
      <EscrowSection />
      <TrustSection />
      <StatsSection />
      <FinalCTA />
    </div>
  );
}

function Hero() {
  return (
    <Section className="relative pt-16 pb-24 md:pt-24 md:pb-32">
      {/* Ambient orbs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="orb h-[420px] w-[420px] -top-20 -left-20" style={{ background: "var(--aurora-1)" }} />
        <div className="orb h-[380px] w-[380px] top-10 right-0" style={{ background: "var(--aurora-2)" }} />
        <div className="orb h-[300px] w-[300px] bottom-0 left-1/3 opacity-40" style={{ background: "var(--aurora-3)" }} />
      </div>
      <div className="pointer-events-none absolute inset-0 grid-pattern opacity-30" />

      <div className="relative grid gap-14 md:grid-cols-[1.2fr_1fr] md:items-center">
        <div>
          <div className="chip mb-6">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-coral opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-coral"></span>
            </span>
            <span className="mono text-[10px]">AGENTS_ONLINE · 47_EVENTS_TODAY</span>
          </div>
          <h1 className="font-display text-5xl leading-[0.95] tracking-tight md:text-7xl lg:text-[5.5rem]">
            Plan any event.
            <br />
            <span className="aurora-text font-display">Without the chaos.</span>
          </h1>
          <p className="mt-7 max-w-xl text-lg text-ink-2 md:text-xl">
            The AI operating system for weddings, birthdays, and corporate events.
            Generate a plan in 30 seconds, book verified vendors, pay in installments —
            and track everything in escrow.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Link to="/signup">
              <Button variant="primary" size="lg">
                Plan my event <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link to="/matching">
              <Button variant="outline" size="lg">
                Try AI matching
              </Button>
            </Link>
            <Link to="/login" className="text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200">
              Sign in →
            </Link>
          </div>
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-ink-2">
            <span className="flex items-center gap-2">
              <Check className="h-4 w-4 text-sage" /> Escrow-protected
            </span>
            <span className="flex items-center gap-2">
              <Check className="h-4 w-4 text-sage" /> 0% APR installments
            </span>
            <span className="flex items-center gap-2">
              <Check className="h-4 w-4 text-sage" /> Backup-vendor guarantee
            </span>
          </div>
        </div>

        <HeroMockup />
      </div>
    </Section>
  );
}

function HeroMockup() {
  return (
    <div className="relative">
      {/* Glow halo */}
      <div className="absolute -inset-10 rounded-[3rem] aurora-bg opacity-30 blur-3xl" />
      <div className="aurora-border noise relative overflow-hidden p-5">
        {/* Window chrome */}
        <div className="mb-4 flex items-center gap-2 border-b border-white/8 pb-3">
          <div className="flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-rose-400/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-amber/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-sage/80" />
          </div>
          <div className="ml-3 mono text-[10px] text-ink-2/60">eventconnect.app /matching</div>
          <span className="chip ml-auto text-[9px]">LIVE</span>
        </div>

        {/* AI Planner card */}
        <div className="rounded-xl border border-white/8 bg-black/50 p-5">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-coral">
            <Sparkles className="h-3.5 w-3.5" /> AI Planner Agent
          </div>
          <div className="mt-3 space-y-2 text-sm">
            <div className="text-ink-2 mono text-[11px]">budget: $18,000 · 150 · Lagos · Wedding</div>
            <div className="caret font-display text-2xl text-ink">
              Building your luxury blueprint…
            </div>
          </div>
          <div className="mt-4 space-y-2">
            {[
              { cat: "Venue", pct: 30, amt: 5400 },
              { cat: "Catering", pct: 22, amt: 3960 },
              { cat: "Photography", pct: 10, amt: 1800 },
              { cat: "Décor & Florals", pct: 14, amt: 2520 },
            ].map((r) => (
              <div key={r.cat} className="flex items-center gap-3">
                <div className="w-28 text-xs text-ink-2">{r.cat}</div>
                <div className="flex-1 overflow-hidden rounded-full bg-white/5">
                  <div className="h-1.5 rounded-full aurora-bg" style={{ width: `${r.pct * 2}%` }} />
                </div>
                <div className="w-16 text-right mono text-xs text-ink">${r.amt.toLocaleString()}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-white/8 bg-white/[0.02] p-3">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-sage/15 text-sage">
                <ShieldCheck className="h-4 w-4" />
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-wider text-ink-2/70">Escrow</div>
                <div className="text-sm font-semibold tabular">$5,400 locked</div>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-white/8 bg-white/[0.02] p-3">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-coral/15 text-coral">
                <Zap className="h-4 w-4" />
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-wider text-ink-2/70">Next</div>
                <div className="text-sm font-semibold">Vendor match</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function LogoBar() {
  const logos = ["Paystack", "Flutterwave", "Stripe", "OpenAI", "AWS", "MongoDB", "CrewAI", "Twilio"];
  return (
    <Section className="border-y border-white/8 py-6">
      <div className="flex flex-col items-center gap-3 md:flex-row md:justify-between">
        <p className="mono text-[10px] uppercase tracking-[0.22em] text-ink-2/70">
          POWERED_BY · ENTERPRISE_INFRA
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 md:gap-x-12">
          {logos.map((l, i) => (
            <span key={i} className="text-sm font-medium text-slate-500 dark:text-slate-400">
              {l}
            </span>
          ))}
        </div>
      </div>
    </Section>
  );
}

function HowItWorks() {
  const steps = [
    {
      n: "01",
      title: "Tell the AI your vision",
      body: "Type, budget, date, guest count, vibe. The Planner Agent builds a full blueprint in seconds.",
      icon: <Sparkles className="h-5 w-5" />,
    },
    {
      n: "02",
      title: "Match with verified vendors",
      body: "Our matching engine ranks vendors by fit, trust score, and availability — then shows alternatives if they cancel.",
      icon: <Store className="h-5 w-5" />,
    },
    {
      n: "03",
      title: "Book & pay in installments",
      body: "30/30/40 escrow schedule. Funds only release when you confirm the service was delivered.",
      icon: <Wallet className="h-5 w-5" />,
    },
    {
      n: "04",
      title: "Track everything in real time",
      body: "One dashboard for budget, bookings, guest list, timeline, and live vendor coordination.",
      icon: <Calendar className="h-5 w-5" />,
    },
  ];
  return (
    <Section className="py-20 md:py-28">
      <div className="grid gap-10 md:grid-cols-[1fr_1.5fr] md:gap-16">
        <div className="md:sticky md:top-28 md:self-start">
          <Badge variant="primary">How it works</Badge>
          <h2 className="mt-4 font-display text-4xl md:text-5xl">
            Four steps.
            <br />
            <span className="aurora-text font-display">Zero spreadsheet chaos.</span>
          </h2>
          <p className="mt-4 text-ink-2">
            Replace 12 tools, 4 group chats, and a prayer with one operating system designed for real events.
          </p>
        </div>
        <div className="space-y-4">
          {steps.map((s) => (
            <Card key={s.n} className="lift flex gap-5 p-6">
              <div className="flex flex-col items-start gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl aurora-bg text-[#0a0a12]">
                  {s.icon}
                </div>
                <div className="mono text-xs text-ink-2/70">{s.n}</div>
              </div>
              <div>
                <h3 className="font-display text-2xl">{s.title}</h3>
                <p className="mt-1.5 text-sm text-ink-2">{s.body}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </Section>
  );
}

function AIPreview() {
  return (
    <Section className="py-20 md:py-28">
      <div className="grid gap-12 md:grid-cols-2 md:items-center">
        <div>
          <Badge variant="primary">AI-Powered</Badge>
          <h2 className="mt-4 font-display text-4xl md:text-5xl text-slate-900 dark:text-slate-100">
            Intelligent planning,
            <br />
            <span className="text-indigo-600 dark:text-indigo-400">automated execution.</span>
          </h2>
          <p className="mt-4 max-w-md text-slate-600 dark:text-slate-400">
            Eight specialized AI agents work together to plan, book, and manage your event from start to finish.
          </p>
          <div className="mt-8 grid grid-cols-2 gap-4">
            {[
              { n: "Planner", d: "Builds blueprints" },
              { n: "Matcher", d: "Finds vendors" },
              { n: "Booking", d: "Manages reservations" },
              { n: "Payment", d: "Handles escrow" },
              { n: "Dispute", d: "Resolves issues" },
              { n: "Emergency", d: "Backup vendors" },
              { n: "Pricing", d: "Optimizes costs" },
              { n: "Notify", d: "Sends updates" },
            ].map((a) => (
              <Card key={a.n} className="p-4 card-lift">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-indigo-500" />
                  <div className="text-sm font-medium text-slate-900 dark:text-slate-100">{a.n} Agent</div>
                </div>
                <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">{a.d}</div>
              </Card>
            ))}
          </div>
        </div>
        <Card className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </div>
              <span className="text-xs font-medium text-slate-600 dark:text-slate-400">Live activity</span>
            </div>
            <Badge variant="success">Operational</Badge>
          </div>
          <div className="space-y-3 text-sm">
            {[
              { t: "14:02", a: "Planner", m: "Generated wedding blueprint · 200 guests" },
              { t: "14:02", a: "Matcher", m: "Ranked 14 photographers" },
              { t: "14:03", a: "Pricing", m: "Flagged overpriced caterer" },
              { t: "14:04", a: "Booking", m: "Confirmed Grand Orchid Estate" },
              { t: "14:04", a: "Payment", m: "$7,200 escrowed" },
              { t: "14:05", a: "Notify", m: "Sent confirmation email" },
              { t: "14:06", a: "Emergency", m: "Queued 2 backup DJs" },
            ].map((l, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="tabular text-xs text-slate-400">{l.t}</span>
                <Badge variant="primary" className="text-[10px]">{l.a}</Badge>
                <span className="truncate text-slate-600 dark:text-slate-400">{l.m}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </Section>
  );
}

function QuickAccess() {
  return (
    <Section className="py-14">
      <div className="aurora-border noise relative p-6 md:p-10">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <Badge variant="primary">Quick Access</Badge>
            <h3 className="mt-2 font-display text-3xl md:text-4xl">Jump into the platform</h3>
            <p className="mt-1 text-sm text-ink-2">Explore every flow without signing up — or create a free account to save your events.</p>
          </div>
          <div className="hidden items-center gap-1.5 md:flex">
            <span className="chip mono"><span className="h-1.5 w-1.5 rounded-full bg-sage" /> 14 MODULES</span>
            <span className="chip mono">v2.0 AURORA</span>
          </div>
        </div>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {[
            { to: "/matching", emoji: "🧠", title: "AI Matching", desc: "Auto vendor stack" },
            { to: "/copilot", emoji: "🤖", title: "AI Copilot", desc: "Persistent chats" },
            { to: "/budget-optimizer", emoji: "💰", title: "Budget Optimizer", desc: "Save more" },
            { to: "/marketplace", emoji: "🏪", title: "Marketplace", desc: "Verified vendors" },
            { to: "/escrow", emoji: "🔐", title: "Escrow", desc: "Milestone payments" },
            { to: "/installments", emoji: "💳", title: "Installments", desc: "0% APR plans" },
            { to: "/messages", emoji: "💬", title: "Messages", desc: "Real-time chat" },
            { to: "/dashboard", emoji: "📋", title: "Dashboard", desc: "Track everything" },
            { to: "/guests", emoji: "📱", title: "Guests & QR", desc: "Check-in system" },
            { to: "/reviews", emoji: "⭐", title: "Reviews", desc: "Rate vendors" },
            { to: "/vendor-crm", emoji: "📊", title: "Vendor CRM", desc: "Analytics & growth" },
            { to: "/analytics", emoji: "📈", title: "Analytics", desc: "Executive view" },
            { to: "/subscriptions", emoji: "👑", title: "Subscriptions", desc: "Pro & Premium" },
            { to: "/admin", emoji: "⚙️", title: "Admin", desc: "Platform ops" },
          ].map((c) => (
            <Link
              key={c.to}
              to={c.to}
              className="group glass lift flex items-center gap-3 rounded-xl p-4 transition hover:border-coral/40"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.05] text-xl">
                {c.emoji}
              </div>
              <div className="min-w-0">
                <div className="text-sm font-semibold">{c.title}</div>
                <div className="mono text-[10px] text-ink-2/80">{c.desc}</div>
              </div>
              <ArrowRight className="ml-auto h-4 w-4 text-ink-2/60 transition group-hover:translate-x-0.5 group-hover:text-coral" />
            </Link>
          ))}
        </div>
      </div>
    </Section>
  );
}

function CategoriesStrip() {
  const cats = Object.keys(categoryEmojis) as VendorCategory[];
  const items = [...cats, ...cats, ...cats];
  return (
    <Section className="overflow-hidden py-14">
      <div className="fade-x relative overflow-hidden">
        <div className="marquee-track flex gap-3 whitespace-nowrap">
          {items.map((c, i) => (
            <div
              key={i}
              className="glass flex items-center gap-3 rounded-full px-5 py-3"
            >
              <span className="text-xl">{categoryEmojis[c]}</span>
              <span className="text-sm font-medium text-ink">{c}</span>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}

function MarketplacePreview() {
  const topVendors = vendors.slice(0, 4);
  return (
    <Section className="py-20">
      <div className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <Badge variant="sage">Marketplace</Badge>
          <h2 className="mt-4 font-display text-4xl md:text-5xl">
            2,400+ verified vendors,
            <br />
            <span className="italic text-coral">AI-ranked for your event.</span>
          </h2>
        </div>
        <Link to="/marketplace" className="group flex items-center gap-1.5 text-sm font-semibold text-ink">
          Browse all
          <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
        </Link>
      </div>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {topVendors.map((v) => (
          <Link
            key={v.id}
            to={`/marketplace/${v.id}`}
            className="lift group flex flex-col overflow-hidden rounded-2xl border border-white/8 bg-white/[0.03] backdrop-blur-xl"
          >
            <div className={`relative flex h-36 items-center justify-center bg-gradient-to-br ${v.cover}`}>
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              <span className="relative text-6xl">{v.emoji}</span>
              <div className="absolute top-2 right-2 flex items-center gap-1 rounded-full bg-black/60 px-2 py-0.5 text-xs font-semibold text-white backdrop-blur">
                <Star className="h-3 w-3 fill-amber text-amber" />
                <span className="tabular">{v.rating}</span>
              </div>
              <div className="absolute bottom-2 left-2 chip mono text-[9px]">{v.category}</div>
            </div>
            <div className="p-4">
              <div className="font-semibold">{v.name}</div>
              <div className="mt-1 flex items-center justify-between text-xs">
                <span className="text-ink-2">{v.city}</span>
                <span className="mono text-sage">TRUST_{v.trustScore}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </Section>
  );
}

function PackagesPreview() {
  return (
    <div className="relative py-20">
      <div className="pointer-events-none absolute inset-0 grid-pattern opacity-25" />
      <Section className="relative">
        <div className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <Badge variant="amber">Packages</Badge>
            <h2 className="mt-4 font-display text-4xl md:text-5xl">
              One click, fully planned.
              <br />
              <span className="italic text-coral">Bundles that actually work.</span>
            </h2>
          </div>
          <Link to="/packages" className="group flex items-center gap-1.5 text-sm font-semibold text-ink">
            See all packages
            <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
          </Link>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {packages.slice(0, 3).map((p) => (
            <Card key={p.id} className="overflow-hidden">
              <div className={`flex h-40 items-center justify-center bg-gradient-to-br ${p.cover}`}>
                <span className="text-6xl">{p.emoji}</span>
              </div>
              <div className="p-5">
                <Badge variant="ink">{p.tier}</Badge>
                <h3 className="mt-3 font-display text-2xl">{p.name}</h3>
                <div className="mt-1 text-sm text-ink/60">
                  {p.eventType} · {p.guestCount} guests
                </div>
                <div className="mt-4 flex items-end justify-between border-t border-ink/5 pt-4">
                  <div>
                    <div className="text-xs text-ink/40 line-through">${p.originalPrice.toLocaleString()}</div>
                    <div className="font-display text-3xl">${p.price.toLocaleString()}</div>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-ink/60">
                    <Star className="h-3.5 w-3.5 fill-amber text-amber" />
                    {p.rating} · {p.bookings} booked
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Section>
    </div>
  );
}

function EscrowSection() {
  return (
    <Section className="py-20 md:py-28">
      <div className="grid gap-12 md:grid-cols-[1fr_1.1fr] md:items-center">
        <div>
          <Badge variant="sage">
            <Lock className="h-3 w-3" /> Escrow-protected
          </Badge>
          <h2 className="mt-4 font-display text-4xl md:text-5xl">
            Your money stays safe
            <br />
            <span className="italic text-coral">until the work is done.</span>
          </h2>
          <p className="mt-4 max-w-md text-ink/60">
            Three installments, one escrow account, zero risk. If a vendor cancels, we refund instantly — and the Emergency Agent finds a same-tier replacement within minutes.
          </p>
          <div className="mt-6 space-y-3">
            {[
              "30% deposit locks the booking",
              "30% released mid-project at agreed milestone",
              "40% released only after you confirm completion",
              "Instant refund if vendor cancels or no-shows",
            ].map((i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-sage/15 text-sage">
                  <Check className="h-3 w-3" />
                </div>
                <span className="text-sm text-ink/70">{i}</span>
              </div>
            ))}
          </div>
        </div>

        <Card className="overflow-hidden p-0">
          <div className="border-b border-ink/5 p-5">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs text-ink/40">Booking BK-0041 · Lumière Studios</div>
                <div className="font-display text-2xl">$2,400 total</div>
              </div>
              <Badge variant="coral">Escrowed</Badge>
            </div>
          </div>
          <div className="p-5">
            {[
              { label: "Deposit", pct: 30, status: "Paid", amount: 720, color: "bg-sage" },
              { label: "Mid-payment", pct: 30, status: "Upcoming", amount: 720, color: "bg-amber" },
              { label: "Completion", pct: 40, status: "Due on event day", amount: 960, color: "bg-ink/10" },
            ].map((i, idx) => (
              <div key={i.label} className={`${idx < 2 ? "border-b border-ink/5 pb-3" : ""} mb-3`}>
                <div className="flex items-center justify-between text-sm">
                  <div>
                    <div className="font-semibold">{i.label} · {i.pct}%</div>
                    <div className="text-xs text-ink/50">{i.status}</div>
                  </div>
                  <div className="font-mono font-semibold">${i.amount.toLocaleString()}</div>
                </div>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-ink/5">
                  <div className={`h-full ${i.color}`} style={{ width: i.status === "Paid" ? "100%" : "0%" }} />
                </div>
              </div>
            ))}
          </div>
          <div className="border-t border-ink/5 bg-cream-2 p-4 text-center text-xs text-ink/50">
            Protected by EventConnect Escrow · Licensed PSP
          </div>
        </Card>
      </div>
    </Section>
  );
}

function TrustSection() {
  const tiers = [
    { level: 1, name: "Verified", desc: "Phone + email confirmation", color: "bg-slate-100 text-slate-700" },
    { level: 2, name: "ID Verified", desc: "Government ID document check", color: "bg-sky-100 text-sky-700" },
    { level: 3, name: "KYC Verified", desc: "BVN + NIN + bank matching + liveness", color: "bg-violet-100 text-violet-700" },
    { level: 4, name: "Elite Vendor", desc: "Physical audit + portfolio review", color: "bg-amber-100 text-amber-800" },
  ];
  const auroraColors = ["bg-white/10 text-ink", "bg-amber/15 text-amber", "bg-coral/20 text-coral", "bg-sage/20 text-sage"];
  return (
    <div className="relative overflow-hidden py-20 md:py-28">
      <div className="pointer-events-none absolute inset-0">
        <div className="orb h-[400px] w-[400px] top-0 -right-20" style={{ background: "var(--aurora-2)", opacity: 0.2 }} />
        <div className="orb h-[400px] w-[400px] bottom-0 -left-20" style={{ background: "var(--aurora-3)", opacity: 0.15 }} />
      </div>
      <Section className="relative">
        <div className="grid gap-10 md:grid-cols-[1fr_1.3fr]">
          <div>
            <Badge variant="primary">Trust & Safety</Badge>
            <h2 className="mt-4 font-display text-4xl md:text-5xl">
              Every vendor is
              <br />
              <span className="aurora-text">vetted before listing.</span>
            </h2>
            <p className="mt-4 max-w-md text-ink-2">
              Trust scores combine verification, completion rate, cancellation history, and response time. Vendors below 60/100 are automatically suspended.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {tiers.map((t, i) => (
              <div key={t.level} className="glass lift rounded-2xl p-5">
                <div className="flex items-center gap-2">
                  <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${auroraColors[i]}`}>
                    <span className="text-sm font-bold tabular">{t.level}</span>
                  </div>
                  <span className="font-display text-2xl">{t.name}</span>
                </div>
                <p className="mt-3 text-sm text-ink-2">{t.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>
    </div>
  );
}

function StatsSection() {
  const stats = [
    { label: "EVENTS_PLANNED", value: "12,480", hint: "This year", accent: "ink" as const },
    { label: "VERIFIED_VENDORS", value: "2,419", hint: "7 countries", accent: "sage" as const },
    { label: "ESCROW_PROTECTED", value: "$18.4M", hint: "All-time", accent: "coral" as const },
    { label: "AVG_RATING", value: "4.86", hint: "Out of 5.0", accent: "amber" as const },
  ];
  return (
    <Section className="py-20">
      <div className="grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-white/8 bg-white/[0.04] md:grid-cols-4">
        {stats.map((s, i) => (
          <div key={s.label} className="relative bg-cream p-6 md:p-8">
            <div className="mono text-[10px] uppercase tracking-[0.18em] text-ink-2/70">{s.label}</div>
            <div className={`mt-2 font-display text-4xl tabular md:text-5xl ${s.accent === "coral" ? "text-coral" : s.accent === "sage" ? "text-sage" : s.accent === "amber" ? "text-amber" : "text-ink"}`}>
              {s.value}
            </div>
            <div className="mt-1 text-xs text-ink-2">{s.hint}</div>
            {i < stats.length - 1 && <div className="pointer-events-none absolute top-1/2 right-0 hidden h-12 w-px -translate-y-1/2 bg-white/8 md:block" />}
          </div>
        ))}
      </div>
    </Section>
  );
}

function FinalCTA() {
  return (
    <Section className="pb-20">
      <div className="aurora-border noise relative overflow-hidden p-10 md:p-16">
        <div className="absolute -right-10 -bottom-10 h-80 w-80 rounded-full aurora-bg opacity-30 blur-3xl" />
        <div className="absolute -top-10 -left-10 h-60 w-60 rounded-full bg-coral/40 blur-3xl" />
        <div className="relative max-w-2xl">
          <Badge variant="primary" className="mb-5">Get started</Badge>
          <h2 className="font-display text-4xl md:text-6xl">
            Your next event
            <br />
            <span className="aurora-text">starts with one question.</span>
          </h2>
          <p className="mt-4 text-lg text-ink-2">
            What are we planning? Tell the AI — we'll do the rest.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/signup">
              <Button variant="primary" size="lg">
                Plan my event <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link to="/marketplace">
              <Button variant="outline" size="lg">
                Explore vendors
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </Section>
  );
}

// Re-export icons so unused imports don't cause issues
export const _icons = { Bell, Users, TrendingUp };
