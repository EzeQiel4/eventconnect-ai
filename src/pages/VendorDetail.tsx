import { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Star,
  MapPin,
  ShieldCheck,
  Clock,
  CheckCircle2,
  XCircle,
  BadgeCheck,
  Calendar,
  MessageSquare,
  Heart,
  Share2,
  Lock,
} from "lucide-react";
import { Section, Badge, Card, Button } from "../components/ui";
import { vendors, verificationLabels } from "../data/vendors";
import { useApp } from "../context/AppContext";

export default function VendorDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const vendor = vendors.find((v) => v.id === id);
  const { confirmBooking, walletBalance } = useApp();
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [showBooking, setShowBooking] = useState(false);
  const [booked, setBooked] = useState(false);

  if (!vendor) {
    return (
      <Section className="py-20 text-center">
        <div className="text-6xl">🫠</div>
        <h2 className="mt-4 font-display text-3xl">Vendor not found</h2>
        <Link to="/marketplace" className="mt-4 inline-block text-coral hover:underline">
          ← Back to marketplace
        </Link>
      </Section>
    );
  }

  const v = verificationLabels[vendor.verified];
  const deposit = Math.round(vendor.priceFrom * 0.3);

  const handleBook = () => {
    confirmBooking({
      vendorId: vendor.id,
      vendorName: vendor.name,
      category: vendor.category,
      amount: vendor.priceFrom,
      date: new Date(Date.now() + 60 * 86400000).toISOString().slice(0, 10),
      status: "Escrowed",
    });
    setBooked(true);
    setTimeout(() => navigate("/dashboard"), 1500);
  };

  const availableDates = useMemo(() => vendor.availability.slice(0, 8), [vendor]);

  return (
    <div className="bg-cream pb-24">
      <Section className="pt-8">
        <Link to="/marketplace" className="inline-flex items-center gap-1.5 text-sm text-ink/60 hover:text-ink">
          <ArrowLeft className="h-4 w-4" /> Back to marketplace
        </Link>
      </Section>

      <Section className="mt-6">
        <div className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${vendor.cover} p-8 md:p-14`}>
          <div className="absolute inset-0 grain opacity-30" />
          <div className="relative grid gap-8 md:grid-cols-[1fr_auto] md:items-end">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="ink">
                  <BadgeCheck className="h-3 w-3" /> {v.name}
                </Badge>
                <Badge variant="neutral" className="bg-white/60 text-ink">
                  {vendor.category}
                </Badge>
              </div>
              <h1 className="mt-3 font-display text-5xl text-ink md:text-6xl">{vendor.name}</h1>
              <p className="mt-2 max-w-xl text-lg text-ink/70">{vendor.tagline}</p>
              <div className="mt-5 flex flex-wrap items-center gap-4 text-sm text-ink/70">
                <span className="flex items-center gap-1.5">
                  <Star className="h-4 w-4 fill-amber text-amber" />
                  <span className="font-semibold">{vendor.rating}</span> ({vendor.reviewCount} reviews)
                </span>
                <span className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4" /> {vendor.location}, {vendor.city}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4" /> Responds {vendor.responseTime}
                </span>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="flex h-11 w-11 items-center justify-center rounded-full bg-white/80 text-ink backdrop-blur transition hover:bg-white">
                <Heart className="h-5 w-5" />
              </button>
              <button className="flex h-11 w-11 items-center justify-center rounded-full bg-white/80 text-ink backdrop-blur transition hover:bg-white">
                <Share2 className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </Section>

      <Section className="mt-8">
        <div className="grid gap-8 md:grid-cols-[1fr_380px]">
          <div className="space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              {[
                { label: "Completion", value: `${vendor.completionRate}%`, icon: <CheckCircle2 className="h-4 w-4 text-sage" /> },
                { label: "Cancellation", value: `${vendor.cancellationRate}%`, icon: <XCircle className="h-4 w-4 text-ink/40" /> },
                { label: "Trust score", value: `${vendor.trustScore}/100`, icon: <ShieldCheck className="h-4 w-4 text-coral" /> },
                { label: "Response", value: vendor.responseTime, icon: <Clock className="h-4 w-4 text-amber-600" /> },
              ].map((s) => (
                <Card key={s.label} className="p-4">
                  <div className="flex items-center gap-2 text-xs text-ink/50">
                    {s.icon}
                    {s.label}
                  </div>
                  <div className="mt-2 font-display text-2xl">{s.value}</div>
                </Card>
              ))}
            </div>

            {/* About */}
            <Card className="p-6">
              <h2 className="font-display text-2xl">About</h2>
              <p className="mt-3 text-ink/70 leading-relaxed">{vendor.description}</p>

              <h3 className="mt-6 font-display text-lg">Services</h3>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                {vendor.services.map((s) => (
                  <label key={s} className="flex cursor-pointer items-center gap-3 rounded-xl border border-ink/10 p-3 transition hover:border-ink/30">
                    <input
                      type="radio"
                      name="service"
                      checked={selectedService === s}
                      onChange={() => setSelectedService(s)}
                      className="h-4 w-4 accent-coral"
                    />
                    <span className="text-sm">{s}</span>
                  </label>
                ))}
              </div>
            </Card>

            {/* Portfolio */}
            <Card className="p-6">
              <h2 className="font-display text-2xl">Portfolio</h2>
              <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
                {vendor.portfolio.concat(vendor.portfolio).map((p, i) => (
                  <div
                    key={i}
                    className={`flex aspect-square items-center justify-center rounded-2xl bg-gradient-to-br ${vendor.cover} text-5xl`}
                  >
                    {p}
                  </div>
                ))}
              </div>
            </Card>

            {/* Availability */}
            <Card className="p-6">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-sage" />
                <h2 className="font-display text-2xl">Availability</h2>
              </div>
              <p className="mt-1 text-sm text-ink/50">Next open dates (next 90 days)</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {availableDates.map((d) => (
                  <div key={d} className="rounded-lg border border-sage/20 bg-sage/5 px-3 py-2 text-sm font-medium text-sage">
                    {new Date(d).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
                  </div>
                ))}
              </div>
            </Card>

            {/* Reviews */}
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-2xl">Reviews</h2>
                <div className="flex items-center gap-1 text-sm">
                  <Star className="h-4 w-4 fill-amber text-amber" />
                  <span className="font-semibold">{vendor.rating}</span>
                  <span className="text-ink/50">· {vendor.reviewCount}</span>
                </div>
              </div>
              <div className="mt-5 space-y-4">
                {vendor.reviews.map((r, i) => (
                  <div key={i} className="border-b border-ink/5 pb-4 last:border-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-ink text-xs font-semibold text-cream">
                          {r.name.charAt(0)}
                        </div>
                        <div>
                          <div className="text-sm font-semibold">{r.name}</div>
                          <div className="text-xs text-ink/50">{r.date}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} className={`h-3 w-3 ${i < r.rating ? "fill-amber text-amber" : "text-ink/10"}`} />
                        ))}
                      </div>
                    </div>
                    <p className="mt-2 text-sm text-ink/70">{r.comment}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Booking panel */}
          <aside>
            <div className="sticky top-24 space-y-4">
              <Card className="p-6">
                <div className="flex items-baseline justify-between">
                  <div>
                    <div className="text-xs text-ink/50">Starting from</div>
                    <div className="font-display text-4xl">
                      ${vendor.priceFrom.toLocaleString()}
                      {vendor.category === "Caterer" && <span className="text-base text-ink/50">/guest</span>}
                    </div>
                  </div>
                  <Badge variant="sage">{v.name}</Badge>
                </div>

                {!showBooking ? (
                  <>
                    <Button variant="primary" className="mt-5 w-full" onClick={() => setShowBooking(true)}>
                      Book this vendor
                    </Button>
                    <Button variant="outline" className="mt-2 w-full">
                      <MessageSquare className="h-4 w-4" /> Message
                    </Button>
                  </>
                ) : booked ? (
                  <div className="mt-5 rounded-xl bg-sage/10 p-4 text-center text-sm text-sage">
                    <CheckCircle2 className="mx-auto mb-2 h-8 w-8" />
                    <div className="font-semibold">Booking confirmed!</div>
                    <div className="text-xs">Redirecting to dashboard…</div>
                  </div>
                ) : (
                  <div className="mt-5 space-y-3">
                    <div className="rounded-xl bg-cream-2 p-3 text-xs">
                      <div className="font-semibold">Escrow-protected payment</div>
                      <div className="mt-1 text-ink/60">30% deposit · 30% mid · 40% on completion</div>
                    </div>
                    <div className="space-y-2 text-sm">
                      <Row label="Total" value={`$${vendor.priceFrom.toLocaleString()}`} bold />
                      <Row label="Deposit (30%)" value={`$${deposit.toLocaleString()}`} />
                      <Row label="Wallet balance" value={`$${walletBalance.toLocaleString()}`} />
                    </div>
                    <Button variant="primary" className="w-full" onClick={handleBook}>
                      <Lock className="h-4 w-4" /> Pay ${deposit.toLocaleString()} deposit
                    </Button>
                    <button
                      onClick={() => setShowBooking(false)}
                      className="w-full text-xs text-ink/50 hover:text-ink"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </Card>

              <div className="rounded-2xl border border-ink/10 bg-white p-4 text-xs text-ink/60">
                <div className="flex items-center gap-2 font-semibold text-ink">
                  <ShieldCheck className="h-4 w-4 text-coral" /> Backup guarantee
                </div>
                <p className="mt-2">
                  If this vendor cancels, the Emergency Agent instantly finds a same-tier replacement — no extra cost.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </Section>
    </div>
  );
}

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-ink/60">{label}</span>
      <span className={bold ? "font-display text-xl font-semibold" : "font-semibold"}>{value}</span>
    </div>
  );
}
