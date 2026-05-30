import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, AlertTriangle, Upload, Check, FileText, ArrowRight, ShieldCheck } from "lucide-react";
import { Section, Badge, Card, Button } from "../components/ui";
import { useApp } from "../context/AppContext";

export default function Disputes() {
  const { disputes, bookings, openDispute } = useApp();
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="bg-cream pb-24">
      <Section className="pt-10">
        <div className="flex items-center justify-between">
          <div>
            <Badge variant="coral">
              <ShieldCheck className="h-3 w-3" /> Trust & Safety
            </Badge>
            <h1 className="mt-3 font-display text-4xl md:text-5xl">Disputes</h1>
            <p className="mt-1 max-w-xl text-ink/60">
              When something goes wrong, we freeze the escrow, gather evidence, and resolve fairly. AI summarizes every case for the admin team.
            </p>
          </div>
          <Button variant="primary" onClick={() => setShowForm(true)}>
            Open dispute
          </Button>
        </div>

        {disputes.length > 0 && !showForm && (
          <div className="mt-8 space-y-4">
            {disputes.map((d) => (
              <Card key={d.id} className="p-6">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <Badge variant={d.status === "Resolved" ? "sage" : "amber"}>{d.status}</Badge>
                      <span className="font-mono text-xs text-ink/50">{d.id}</span>
                    </div>
                    <h3 className="mt-2 font-display text-2xl">{d.reason}</h3>
                    <div className="mt-1 text-sm text-ink/60">
                      vs <span className="font-semibold text-ink">{d.vendor}</span> · ${d.amount.toLocaleString()} in escrow · Opened {d.createdAt}
                    </div>
                  </div>
                  {d.outcome && (
                    <div className="rounded-xl bg-sage/10 p-3 text-center">
                      <div className="text-[10px] uppercase tracking-wider text-sage">Outcome</div>
                      <div className="font-display text-lg text-sage">{d.outcome}</div>
                    </div>
                  )}
                </div>
                <div className="mt-5 rounded-xl bg-ink p-4 text-cream">
                  <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-coral">
                    <span className="h-1.5 w-1.5 rounded-full bg-coral pulse-ring" /> Dispute Agent · AI summary
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-cream/90">{d.description}</p>
                </div>
                <div className="mt-4 flex items-center gap-3">
                  <div className="flex items-center gap-1.5 text-xs text-ink/60">
                    <FileText className="h-3.5 w-3.5" /> {d.evidence.length} evidence files
                  </div>
                  <Link to="#" className="text-xs font-semibold text-coral hover:underline">View thread →</Link>
                </div>
              </Card>
            ))}
          </div>
        )}

        {disputes.length === 0 && !showForm && (
          <Card className="mt-8 flex min-h-[300px] flex-col items-center justify-center p-12 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-sage/10 text-sage">
              <ShieldCheck className="h-8 w-8" />
            </div>
            <h3 className="mt-4 font-display text-2xl">No disputes — and we hope it stays that way</h3>
            <p className="mt-2 max-w-sm text-sm text-ink/60">
              If a vendor doesn't deliver as agreed, open a dispute here. Escrow is frozen instantly while we investigate.
            </p>
          </Card>
        )}

        {showForm && <DisputeForm bookings={bookings} onSubmit={(d) => { openDispute(d); setShowForm(false); }} onCancel={() => setShowForm(false)} />}
      </Section>
    </div>
  );
}

function DisputeForm({ bookings, onSubmit, onCancel }: { bookings: ReturnType<typeof useApp>["bookings"]; onSubmit: (d: Parameters<ReturnType<typeof useApp>["openDispute"]>[0]) => void; onCancel: () => void }) {
  const [bookingId, setBookingId] = useState(bookings[0]?.id ?? "");
  const [reason, setReason] = useState("");
  const [description, setDescription] = useState("");
  const [evidence, setEvidence] = useState<string[]>([]);
  const [step, setStep] = useState(1);

  const selected = bookings.find((b) => b.id === bookingId);

  const reasons = [
    "Vendor no-show",
    "Service did not match portfolio",
    "Late delivery",
    "Under-delivered quality",
    "Unprofessional conduct",
    "Other",
  ];

  return (
    <Card className="mt-8 p-8">
      <Link to="/disputes" onClick={(e) => { e.preventDefault(); onCancel(); }} className="inline-flex items-center gap-1.5 text-sm text-ink/60 hover:text-ink">
        <ArrowLeft className="h-4 w-4" /> Cancel
      </Link>

      <div className="mt-4 flex items-center gap-2">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex-1">
            <div className={`h-1 rounded-full ${step >= s ? "bg-coral" : "bg-ink/10"}`} />
            <div className="mt-1.5 text-[10px] font-semibold uppercase tracking-wider text-ink/50">
              {s === 1 ? "Booking" : s === 2 ? "Issue" : "Evidence"}
            </div>
          </div>
        ))}
      </div>

      {step === 1 && (
        <>
          <Badge variant="coral">Step 1 of 3</Badge>
          <h2 className="mt-3 font-display text-3xl">Which booking?</h2>
          <p className="mt-1 text-sm text-ink/60">Select the booking you want to dispute.</p>
          <div className="mt-5 space-y-2">
            {bookings.map((b) => (
              <button
                key={b.id}
                onClick={() => setBookingId(b.id)}
                className={`flex w-full items-center justify-between rounded-xl border p-4 text-left transition ${
                  bookingId === b.id ? "border-ink bg-ink text-cream" : "border-ink/10 hover:border-ink/30"
                }`}
              >
                <div>
                  <div className="font-semibold">{b.vendorName}</div>
                  <div className={`text-xs ${bookingId === b.id ? "text-cream/60" : "text-ink/50"}`}>
                    {b.id} · {b.category} · {new Date(b.date).toLocaleDateString()}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-display text-xl">${b.amount.toLocaleString()}</div>
                  <div className={`text-xs ${bookingId === b.id ? "text-cream/60" : "text-ink/50"}`}>{b.status}</div>
                </div>
              </button>
            ))}
          </div>
          <Button variant="primary" className="mt-6 w-full" disabled={!bookingId} onClick={() => setStep(2)}>
            Continue <ArrowRight className="h-4 w-4" />
          </Button>
        </>
      )}

      {step === 2 && (
        <>
          <Badge variant="coral">Step 2 of 3</Badge>
          <h2 className="mt-3 font-display text-3xl">What went wrong?</h2>
          <div className="mt-5 space-y-3">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-ink/50">Reason</label>
              <div className="mt-1.5 grid grid-cols-2 gap-2">
                {reasons.map((r) => (
                  <button
                    key={r}
                    onClick={() => setReason(r)}
                    className={`rounded-xl border p-3 text-left text-sm font-medium transition ${
                      reason === r ? "border-ink bg-ink text-cream" : "border-ink/10 hover:border-ink/30"
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-ink/50">Describe the issue</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={5}
                placeholder="Please describe what happened, what was agreed, and how it differed…"
                className="mt-1.5 w-full rounded-xl border border-ink/10 bg-white px-4 py-3 text-sm outline-none focus:border-ink"
              />
            </div>
          </div>
          <div className="mt-6 flex gap-3">
            <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
            <Button variant="primary" className="flex-1" disabled={!reason || description.length < 20} onClick={() => setStep(3)}>
              Continue <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </>
      )}

      {step === 3 && (
        <>
          <Badge variant="coral">Step 3 of 3</Badge>
          <h2 className="mt-3 font-display text-3xl">Upload evidence</h2>
          <p className="mt-1 text-sm text-ink/60">Photos, videos, chat logs, contracts — anything that supports your case.</p>

          <div className="mt-5 grid gap-3 md:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].slice(0, Math.max(3, evidence.length + 1)).map((i) => (
              <button
                key={i}
                onClick={() => setEvidence((e) => [...e, `evidence-${i}.jpg`])}
                className="flex aspect-video flex-col items-center justify-center rounded-xl border border-dashed border-ink/20 bg-cream-2 hover:border-ink/40"
              >
                {evidence[i - 1] ? (
                  <div className="flex flex-col items-center gap-1 text-xs text-sage">
                    <Check className="h-5 w-5" />
                    <span>{evidence[i - 1]}</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-1 text-xs text-ink/50">
                    <Upload className="h-5 w-5" />
                    <span>Click to upload</span>
                  </div>
                )}
              </button>
            ))}
          </div>

          <div className="mt-6 rounded-xl bg-amber/10 p-4">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 mt-0.5 text-amber-700" />
              <div className="text-sm text-ink/70">
                <span className="font-semibold text-ink">What happens next?</span> Escrow is frozen immediately. Both you and the vendor will be asked for evidence. The Dispute Agent will summarize the case for our admin team, who will decide within 48 hours.
              </div>
            </div>
          </div>

          <div className="mt-6 flex gap-3">
            <Button variant="outline" onClick={() => setStep(2)}>Back</Button>
            <Button
              variant="primary"
              className="flex-1"
              disabled={!selected}
              onClick={() =>
                onSubmit({
                  bookingId,
                  vendor: selected!.vendorName,
                  amount: selected!.amount,
                  reason,
                  description,
                  evidence,
                })
              }
            >
              Submit dispute & freeze escrow
            </Button>
          </div>
        </>
      )}
    </Card>
  );
}
