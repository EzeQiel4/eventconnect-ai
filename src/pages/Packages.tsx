import { Link } from "react-router-dom";
import { ArrowRight, Star, Check } from "lucide-react";
import { Section, Badge, Card, Button } from "../components/ui";
import { packages } from "../data/packages";

export default function Packages() {
  return (
    <div className="bg-cream pb-24">
      <div className="bg-gradient-to-br from-ink via-ink-2 to-ink py-14 text-cream">
        <Section>
          <Badge variant="coral">All-inclusive bundles</Badge>
          <h1 className="mt-3 font-display text-5xl md:text-6xl">
            One click, fully planned.
            <br />
            <span className="italic text-coral">Seriously.</span>
          </h1>
          <p className="mt-3 max-w-xl text-cream/60">
            Bundled vendors, single contract, single escrow. We coordinate everything — you show up and enjoy.
          </p>
        </Section>
      </div>

      <Section className="mt-10">
        <div className="grid gap-6 md:grid-cols-2">
          {packages.map((p) => (
            <Card key={p.id} className="overflow-hidden">
              <div className={`relative flex h-48 items-center justify-center bg-gradient-to-br ${p.cover}`}>
                <span className="text-8xl drop-shadow-sm">{p.emoji}</span>
                <div className="absolute top-4 left-4">
                  <Badge variant={p.tier === "Luxury" ? "coral" : p.tier === "Premium" ? "sage" : "neutral"}>
                    {p.tier}
                  </Badge>
                </div>
                <div className="absolute top-4 right-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold backdrop-blur">
                  {Math.round((1 - p.price / p.originalPrice) * 100)}% off
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-display text-2xl">{p.name}</h3>
                    <div className="mt-1 text-sm text-ink/60">
                      {p.eventType} · {p.guestCount} guests · {p.duration}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-ink/40 line-through">${p.originalPrice.toLocaleString()}</div>
                    <div className="font-display text-3xl">${p.price.toLocaleString()}</div>
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-1.5 text-xs text-ink/60">
                  <Star className="h-3.5 w-3.5 fill-amber text-amber" />
                  {p.rating} · {p.bookings} booked · by <span className="font-semibold text-ink">{p.plannerName}</span>
                </div>

                <div className="mt-5 border-t border-ink/5 pt-5">
                  <div className="text-xs font-semibold uppercase tracking-wider text-ink/50">Includes</div>
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    {p.includes.map((i) => (
                      <div key={i} className="flex items-start gap-2 text-sm">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-sage" />
                        <span className="text-ink/70">{i}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 flex gap-3">
                  <Button variant="primary" className="flex-1">
                    Book package <ArrowRight className="h-4 w-4" />
                  </Button>
                  <Button variant="outline">Customize</Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <Card className="mt-8 overflow-hidden">
          <div className="grid gap-0 md:grid-cols-[1.2fr_1fr]">
            <div className="p-8">
              <Badge variant="coral">Need something bespoke?</Badge>
              <h3 className="mt-3 font-display text-3xl">Build a custom package</h3>
              <p className="mt-2 text-sm text-ink/60">
                Mix and match from 2,400+ vendors. The AI Planner Agent will negotiate availability and bundle pricing for you.
              </p>
              <Link to="/planner" className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-coral hover:underline">
                Start with the AI Planner <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="bg-cream-2 p-8">
              <div className="grid grid-cols-3 gap-3">
                {["📸", "🍽️", "🎧", "💐", "💄", "🏛️"].map((e, i) => (
                  <div key={i} className="flex aspect-square items-center justify-center rounded-2xl bg-white text-4xl">
                    {e}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>
      </Section>
    </div>
  );
}
