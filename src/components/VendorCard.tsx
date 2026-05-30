import { Link } from "react-router-dom";
import { BadgeCheck, Star, MapPin } from "lucide-react";
import { verificationLabels, type Vendor } from "../data/vendors";

export function VendorCard({ vendor }: { vendor: Vendor }) {
  const v = verificationLabels[vendor.verified];
  return (
    <Link
      to={`/marketplace/${vendor.id}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-ink/10 bg-white transition hover:-translate-y-1 hover:border-ink/20 hover:shadow-xl hover:shadow-ink/5"
    >
      <div className={`relative flex h-44 items-center justify-center bg-gradient-to-br ${vendor.cover}`}>
        <span className="text-7xl drop-shadow-sm">{vendor.emoji}</span>
        <div className="absolute top-3 left-3 flex items-center gap-1.5 rounded-full bg-white/90 px-2.5 py-1 text-xs font-semibold text-ink backdrop-blur">
          <BadgeCheck className="h-3.5 w-3.5 text-coral" />
          {v.name}
        </div>
        <div className="absolute top-3 right-3 flex items-center gap-1 rounded-full bg-ink/80 px-2.5 py-1 text-xs font-semibold text-cream backdrop-blur">
          <Star className="h-3 w-3 fill-amber text-amber" />
          {vendor.rating.toFixed(1)}
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink/50">
            {vendor.category}
          </div>
          <h3 className="mt-0.5 text-lg font-semibold text-ink">{vendor.name}</h3>
          <p className="line-clamp-1 text-sm text-ink/60">{vendor.tagline}</p>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-ink/50">
          <MapPin className="h-3.5 w-3.5" />
          {vendor.location}, {vendor.city}
        </div>
        <div className="mt-auto flex items-center justify-between border-t border-ink/5 pt-3">
          <div>
            <div className="text-[10px] uppercase tracking-wider text-ink/40">From</div>
            <div className="font-semibold text-ink">
              ${vendor.priceFrom.toLocaleString()}
              {vendor.category === "Caterer" ? "/guest" : ""}
            </div>
          </div>
          <div className="text-right">
            <div className="text-[10px] uppercase tracking-wider text-ink/40">Trust</div>
            <div className="font-semibold text-sage">{vendor.trustScore}/100</div>
          </div>
        </div>
      </div>
    </Link>
  );
}
