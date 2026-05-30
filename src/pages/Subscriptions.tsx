import { Check, Crown, Sparkles, TrendingUp, Award, Eye, ArrowRight } from "lucide-react";
import { Section, Badge, Card, Button } from "../components/ui";
import { usePlatformStore, type SubscriptionTier } from "../store/usePlatformStore";

const tiers: {
  key: SubscriptionTier;
  price: number;
  desc: string;
  highlight?: boolean;
  features: { label: string; included: boolean }[];
}[] = [
  {
    key: "Basic",
    price: 0,
    desc: "Get listed on the marketplace. Pay only when you book.",
    features: [
      { label: "Marketplace listing", included: true },
      { label: "Booking management", included: true },
      { label: "Customer messaging", included: true },
      { label: "Standard support", included: true },
      { label: "Featured listing", included: false },
      { label: "Priority ranking", included: false },
      { label: "Premium analytics", included: false },
      { label: "Premium badge", included: false },
    ],
  },
  {
    key: "Pro",
    price: 49,
    desc: "Stand out with featured placement and deeper insights.",
    highlight: true,
    features: [
      { label: "Everything in Basic", included: true },
      { label: "Featured listing", included: true },
      { label: "Premium analytics", included: true },
      { label: "Priority support", included: true },
      { label: "Lower escrow fees (1.8%)", included: true },
      { label: "Priority ranking", included: false },
      { label: "Premium badge", included: false },
      { label: "Premium API access", included: false },
    ],
  },
  {
    key: "Premium",
    price: 149,
    desc: "Top of search, premium badge, and AI matching boost.",
    features: [
      { label: "Everything in Pro", included: true },
      { label: "Priority ranking in AI matching", included: true },
      { label: "Premium verified badge", included: true },
      { label: "Lowest escrow fees (1.2%)", included: true },
      { label: "Dedicated account manager", included: true },
      { label: "Custom branded profile page", included: true },
      { label: "Bulk-quote tools", included: true },
      { label: "API access", included: true },
    ],
  },
];

const revenueSources = [
  { label: "Escrow fees", desc: "1.2% – 2.5% per transaction", icon: <TrendingUp className="h-4 w-4" /> },
  { label: "Vendor subscriptions", desc: "$0 – $149/mo recurring", icon: <Crown className="h-4 w-4" /> },
  { label: "Featured listings", desc: "$29/week boost slots", icon: <Eye className="h-4 w-4" /> },
  { label: "AI Premium", desc: "$19/mo unlimited Copilot", icon: <Sparkles className="h-4 w-4" /> },
];

export default function Subscriptions() {
  const { subscriptions, upgradeSubscription } = usePlatformStore();
  const vendorId = "v5"; // demo vendor
  const current = subscriptions.find((s) => s.vendorId === vendorId)?.tier ?? "Basic";

  return (
    <div className="bg-cream pb-20">
      <Section className="pt-10">
        <div className="text-center">
          <Badge variant="coral">
            <Crown className="h-3 w-3" /> Vendor subscriptions
          </Badge>
          <h1 className="mt-3 font-display text-4xl md:text-6xl">
            Grow your business
            <br />
            <span className="italic text-coral">on EventConnect.</span>
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-ink/60">
            Choose the tier that matches your ambition. Cancel anytime. All plans include zero-setup onboarding.
          </p>
        </div>

        {/* Tier cards */}
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {tiers.map((t) => {
            const isCurrent = current === t.key;
            return (
              <Card
                key={t.key}
                className={`relative overflow-hidden p-6 ${t.highlight ? "ring-2 ring-coral md:scale-[1.03]" : ""}`}
              >
                {t.highlight && (
                  <div className="absolute -right-10 top-5 rotate-45 bg-coral px-12 py-1 text-[10px] font-bold uppercase tracking-widest text-white">
                    Most popular
                  </div>
                )}
                <div className="flex items-center gap-2">
                  {t.key === "Premium" ? (
                    <Crown className="h-5 w-5 text-coral" />
                  ) : t.key === "Pro" ? (
                    <Award className="h-5 w-5 text-amber-600" />
                  ) : (
                    <Sparkles className="h-5 w-5 text-ink/40" />
                  )}
                  <h3 className="font-display text-2xl">{t.key}</h3>
                </div>
                <p className="mt-1 text-sm text-ink/60">{t.desc}</p>
                <div className="mt-5 flex items-baseline gap-1">
                  <span className="font-display text-5xl">${t.price}</span>
                  <span className="text-sm text-ink/50">/mo</span>
                </div>
                <Button
                  variant={isCurrent ? "outline" : t.highlight ? "primary" : "dark"}
                  className="mt-4 w-full"
                  disabled={isCurrent}
                  onClick={() => upgradeSubscription(vendorId, t.key)}
                >
                  {isCurrent ? "Current plan" : <>Upgrade to {t.key} <ArrowRight className="h-4 w-4" /></>}
                </Button>
                <ul className="mt-6 space-y-2.5 text-sm">
                  {t.features.map((f) => (
                    <li key={f.label} className="flex items-start gap-2">
                      <span
                        className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full ${
                          f.included ? "bg-sage text-white" : "bg-ink/10 text-ink/40"
                        }`}
                      >
                        {f.included && <Check className="h-3 w-3" />}
                      </span>
                      <span className={f.included ? "text-ink" : "text-ink/40 line-through"}>{f.label}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            );
          })}
        </div>

        {/* Revenue model */}
        <div className="mt-12 rounded-3xl bg-ink p-8 text-cream md:p-12">
          <Badge variant="coral">Platform revenue</Badge>
          <h2 className="mt-3 font-display text-3xl md:text-5xl">How EventConnect earns.</h2>
          <p className="mt-2 max-w-2xl text-cream/60">
            We align with your success — fees scale with transactions, never with vanity metrics.
          </p>
          <div className="mt-8 grid gap-4 md:grid-cols-4">
            {revenueSources.map((r) => (
              <div key={r.label} className="rounded-2xl bg-cream/5 p-5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-coral/20 text-coral">{r.icon}</div>
                <div className="mt-3 font-semibold">{r.label}</div>
                <div className="text-xs text-cream/60">{r.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </Section>
    </div>
  );
}
