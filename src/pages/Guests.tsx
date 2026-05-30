import { useState } from "react";
import { Link } from "react-router-dom";
import { QrCode, Plus, Check, X, Search, UserPlus, Download, Share2, Mail } from "lucide-react";
import { Section, Badge, Card, Button } from "../components/ui";
import { useApp } from "../context/AppContext";

function QRGrid({ pattern }: { pattern: string }) {
  const size = 7;
  const cells = pattern.split("").map((c) => c === "1");
  return (
    <div className="grid aspect-square grid-cols-7 gap-[1px] rounded-lg bg-white p-1">
      {cells.slice(0, size * size).map((filled, i) => (
        <div key={i} className={`rounded-[1px] ${filled ? "bg-ink" : "bg-transparent"}`} />
      ))}
    </div>
  );
}

export default function Guests() {
  const { guests, events, addGuest, toggleCheckIn, toggleRsvp } = useApp();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "checked-in" | "pending">("all");
  const [showAdd, setShowAdd] = useState(false);
  const [selectedQR, setSelectedQR] = useState<string | null>(null);

  const filtered = guests.filter((g) => {
    if (search && !g.name.toLowerCase().includes(search.toLowerCase())) return false;
    if (filter === "checked-in") return g.checkedIn;
    if (filter === "pending") return g.rsvp === "Pending";
    return true;
  });

  const counts = {
    yes: guests.filter((g) => g.rsvp === "Yes").length,
    maybe: guests.filter((g) => g.rsvp === "Maybe").length,
    no: guests.filter((g) => g.rsvp === "No").length,
    pending: guests.filter((g) => g.rsvp === "Pending").length,
    checkedIn: guests.filter((g) => g.checkedIn).length,
  };

  const event = events[0];

  return (
    <div className="bg-cream pb-24">
      <Section className="pt-10">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <Badge variant="coral">
              <QrCode className="h-3 w-3" /> QR check-in enabled
            </Badge>
            <h1 className="mt-3 font-display text-4xl md:text-5xl">Guest list</h1>
            <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-ink/60">
              <span>{event?.name}</span>
              <span>·</span>
              <span>{guests.length} invited</span>
              <span>·</span>
              <span className="text-sage font-semibold">{counts.checkedIn} checked in</span>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Share2 className="h-4 w-4" /> Share invitations
            </Button>
            <Button variant="outline">
              <Download className="h-4 w-4" /> Export CSV
            </Button>
            <Button variant="primary" onClick={() => setShowAdd(true)}>
              <Plus className="h-4 w-4" /> Add guest
            </Button>
          </div>
        </div>

        <div className="mt-8 grid gap-3 md:grid-cols-5">
          {[
            { label: "RSVP Yes", value: counts.yes, color: "bg-sage" },
            { label: "RSVP Maybe", value: counts.maybe, color: "bg-amber" },
            { label: "RSVP No", value: counts.no, color: "bg-rose-500" },
            { label: "Pending", value: counts.pending, color: "bg-ink/40" },
            { label: "Checked in", value: counts.checkedIn, color: "bg-coral" },
          ].map((s) => (
            <Card key={s.label} className="p-4">
              <div className="flex items-center gap-2 text-xs text-ink/50">
                <span className={`h-2 w-2 rounded-full ${s.color}`} />
                {s.label}
              </div>
              <div className="mt-1 font-display text-3xl">{s.value}</div>
            </Card>
          ))}
        </div>

        <Card className="mt-6 overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-ink/5 p-4">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-ink/40" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search guests…"
                className="w-full rounded-full border border-ink/10 bg-cream-2 py-2 pl-9 pr-4 text-sm outline-none focus:border-ink"
              />
            </div>
            <div className="flex gap-1 rounded-full bg-cream-2 p-1">
              {(["all", "checked-in", "pending"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`rounded-full px-3 py-1 text-xs font-semibold capitalize transition ${
                    filter === f ? "bg-ink text-cream" : "text-ink/60"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div className="divide-y divide-ink/5">
            <div className="hidden grid-cols-[1fr_100px_60px_100px_120px_180px] gap-3 bg-cream-2 px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-ink/50 md:grid">
              <span>Guest</span>
              <span>RSVP</span>
              <span>Table</span>
              <span>Plus one</span>
              <span>Check-in</span>
              <span className="text-right">QR</span>
            </div>
            {filtered.map((g) => (
              <div key={g.id} className="grid grid-cols-1 gap-3 px-5 py-4 md:grid-cols-[1fr_100px_60px_100px_120px_180px] md:items-center">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-coral to-amber text-sm font-bold text-white">
                    {g.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-semibold">{g.name}</div>
                    <div className="text-xs text-ink/50">{g.email}</div>
                  </div>
                </div>
                <div>
                  <button
                    onClick={() => toggleRsvp(g.id)}
                    className={`rounded-full px-3 py-1 text-[10px] font-semibold ${
                      g.rsvp === "Yes" ? "bg-sage/15 text-sage" :
                      g.rsvp === "No" ? "bg-rose-100 text-rose-700" :
                      g.rsvp === "Maybe" ? "bg-amber/15 text-amber-700" :
                      "bg-ink/10 text-ink/60"
                    }`}
                  >
                    {g.rsvp}
                  </button>
                </div>
                <span className="text-ink/60 text-sm">{g.table}</span>
                <span className="text-sm">{g.plusOne ? <Check className="h-4 w-4 text-sage" /> : <X className="h-4 w-4 text-ink/30" />}</span>
                <button
                  onClick={() => toggleCheckIn(g.id)}
                  className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                    g.checkedIn ? "bg-sage text-white" : "bg-ink/5 text-ink/60 hover:bg-ink/10"
                  }`}
                >
                  {g.checkedIn ? <><Check className="h-3 w-3" /> Checked in</> : "Mark check-in"}
                </button>
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setSelectedQR(g.id)}
                    className="flex h-10 w-10 items-center justify-center rounded-lg border border-ink/10 hover:bg-ink/5"
                    aria-label="Show QR"
                  >
                    <QRGrid pattern={g.qrCode} />
                  </button>
                  <button className="flex h-10 w-10 items-center justify-center rounded-lg border border-ink/10 hover:bg-ink/5">
                    <Mail className="h-4 w-4 text-ink/60" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="mt-6 overflow-hidden">
          <div className="grid gap-0 md:grid-cols-2">
            <div className="p-6">
              <Badge variant="sage">Event-day check-in</Badge>
              <h3 className="mt-3 font-display text-3xl">QR-powered entry.</h3>
              <p className="mt-2 max-w-md text-sm text-ink/60">
                Every guest gets a unique QR code sent to their email. On event day, your team scans with any phone — guests check in instantly and table assignments update in real-time.
              </p>
              <div className="mt-5 space-y-2 text-sm">
                {[
                  "Offline-capable scanning (no internet needed)",
                  "Real-time headcount dashboard",
                  "Plus-one validation",
                  "VIP & backstage access tiers",
                ].map((f) => (
                  <div key={f} className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 text-sage" />
                    <span>{f}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-ink p-6 text-cream">
              <div className="text-xs uppercase tracking-wider text-cream/50">Sample guest QR</div>
              <div className="mt-3 flex items-center gap-4">
                <div className="w-32">
                  <div className="rounded-xl bg-white p-2">
                    <QRGrid pattern={guests[0]?.qrCode ?? "0".repeat(49)} />
                  </div>
                </div>
                <div>
                  <div className="font-display text-xl">{guests[0]?.name}</div>
                  <div className="text-xs text-cream/50">Table {guests[0]?.table} · +1 guest</div>
                  <div className="mt-3 rounded-lg bg-cream/10 p-2 text-xs">
                    Scan at entry · auto-syncs to dashboard
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </Section>

      {/* QR modal */}
      {selectedQR && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/60 p-4" onClick={() => setSelectedQR(null)}>
          <div className="w-full max-w-sm" onClick={(e: React.MouseEvent) => e.stopPropagation()}>
            <Card className="p-6">
            {(() => {
              const guest = guests.find((g) => g.id === selectedQR);
              if (!guest) return null;
              return (
                <div className="text-center">
                  <div className="text-xs font-semibold uppercase tracking-wider text-ink/50">Guest QR code</div>
                  <h3 className="mt-1 font-display text-2xl">{guest.name}</h3>
                  <div className="mx-auto mt-5 w-48">
                    <div className="rounded-2xl bg-white p-3 shadow-lg">
                      <QRGrid pattern={guest.qrCode} />
                    </div>
                  </div>
                  <div className="mt-4 rounded-xl bg-cream-2 p-3 text-xs">
                    <div className="font-semibold">{guest.email}</div>
                    <div className="mt-1 text-ink/50">Table {guest.table} · {guest.plusOne ? "+1" : "Solo"}</div>
                  </div>
                  <div className="mt-5 flex gap-2">
                    <Button variant="outline" className="flex-1">
                      <Mail className="h-4 w-4" /> Email
                    </Button>
                    <Button variant="primary" className="flex-1">
                      <Download className="h-4 w-4" /> Download
                    </Button>
                  </div>
                  <button onClick={() => setSelectedQR(null)} className="mt-3 text-xs text-ink/50 hover:text-ink">
                    Close
                  </button>
                </div>
              );
            })()}
            </Card>
          </div>
        </div>
      )}

      {/* Add guest modal */}
      {showAdd && (
        <AddGuestModal
          onClose={() => setShowAdd(false)}
          onAdd={(g) => { addGuest(g); setShowAdd(false); }}
        />
      )}
    </div>
  );
}

function AddGuestModal({ onClose, onAdd }: { onClose: () => void; onAdd: (g: { name: string; email: string; phone: string; rsvp: "Pending" | "Yes" | "Maybe" | "No"; table: string; plusOne: boolean; checkedIn: boolean }) => void }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [table, setTable] = useState("");
  const [plusOne, setPlusOne] = useState(false);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/60 p-4" onClick={onClose}>
      <div className="w-full max-w-md" onClick={(e: React.MouseEvent) => e.stopPropagation()}>
        <Card className="p-6">
        <div className="flex items-center gap-2">
          <UserPlus className="h-5 w-5 text-coral" />
          <h3 className="font-display text-2xl">Add guest</h3>
        </div>
        <div className="mt-5 space-y-3">
          <Field label="Full name" value={name} onChange={setName} placeholder="Adaeze Okonkwo" />
          <div className="grid grid-cols-2 gap-3">
            <Field label="Email" value={email} onChange={setEmail} placeholder="guest@email.com" type="email" />
            <Field label="Phone" value={phone} onChange={setPhone} placeholder="+234…" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Table" value={table} onChange={setTable} placeholder="e.g. 3" />
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-ink/50">Plus one</label>
              <button
                onClick={() => setPlusOne((v) => !v)}
                className={`mt-1.5 w-full rounded-xl border px-3 py-2.5 text-sm font-medium transition ${
                  plusOne ? "border-ink bg-ink text-cream" : "border-ink/10"
                }`}
              >
                {plusOne ? "Yes" : "No"}
              </button>
            </div>
          </div>
        </div>
        <div className="mt-6 flex gap-2">
          <Button variant="outline" className="flex-1" onClick={onClose}>Cancel</Button>
          <Button
            variant="primary"
            className="flex-1"
            disabled={!name || !email}
            onClick={() => onAdd({ name, email, phone, rsvp: "Pending", table: table || "-", plusOne, checkedIn: false })}
          >
            Add & send QR
          </Button>
        </div>
        </Card>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, placeholder, type = "text" }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string }) {
  return (
    <div>
      <label className="text-xs font-semibold uppercase tracking-wider text-ink/50">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="mt-1.5 w-full rounded-xl border border-ink/10 bg-white px-3.5 py-2.5 text-sm outline-none focus:border-ink"
      />
    </div>
  );
}

export const _unused = { Link };
