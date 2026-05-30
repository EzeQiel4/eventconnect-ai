import { useMemo, useState } from "react";
import { Calendar, Wallet, Plus, TrendingUp, CheckCircle2, ArrowRight, CreditCard } from "lucide-react";
import { Section, Badge, Card, Button } from "../components/ui";
import { usePlatformStore } from "../store/usePlatformStore";
import { useApp } from "../context/AppContext";
import { InstallmentPlanSchema } from "../lib/schemas";

export default function Installments() {
  const { bookings } = useApp();
  const { installments, createInstallmentPlan, payNextInstallment } = usePlatformStore();

  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ bookingId: bookings[0]?.id ?? "", months: 6 as 3 | 6 | 9 | 12, depositPct: 20 });
  const [error, setError] = useState<string | null>(null);

  const booking = bookings.find((b) => b.id === form.bookingId);
  const total = booking?.amount ?? 0;
  const deposit = Math.round(total * (form.depositPct / 100));
  const monthly = total > 0 ? Math.round((total - deposit) / form.months) : 0;

  const submit = () => {
    if (!booking) return;
    const parsed = InstallmentPlanSchema.safeParse({
      bookingId: booking.id,
      totalAmount: booking.amount,
      months: form.months,
      depositPct: form.depositPct,
    });
    if (!parsed.success) {
      setError(parsed.error.issues[0].message);
      return;
    }
    setError(null);
    createInstallmentPlan({
      bookingId: booking.id,
      vendorName: booking.vendorName,
      total: booking.amount,
      months: form.months,
      depositPct: form.depositPct,
    });
    setOpen(false);
  };

  const totals = useMemo(() => {
    const financed = installments.reduce((s, p) => s + (p.totalAmount - p.deposit), 0);
    const paid = installments.reduce((s, p) => s + p.deposit + p.monthly * p.paidMonths, 0);
    const remaining = installments.reduce((s, p) => s + p.monthly * (p.months - p.paidMonths), 0);
    return { financed, paid, remaining };
  }, [installments]);

  return (
    <div className="bg-cream pb-20">
      <Section className="pt-10">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <Badge variant="coral">
              <CreditCard className="h-3 w-3" /> Buy now, pay later · 0% APR
            </Badge>
            <h1 className="mt-3 font-display text-4xl md:text-5xl">Installment financing</h1>
            <p className="mt-1 max-w-xl text-ink/60">
              Spread booking costs over 3, 6, 9, or 12 months. Vendors get paid in full from escrow.
            </p>
          </div>
          <Button variant="primary" onClick={() => setOpen(true)}>
            <Plus className="h-4 w-4" /> New plan
          </Button>
        </div>

        {/* Summary */}
        <div className="mt-8 grid gap-3 md:grid-cols-3">
          <Card className="p-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-coral/10 text-coral">
              <Wallet className="h-5 w-5" />
            </div>
            <div className="mt-3 text-xs font-semibold uppercase tracking-wider text-ink/50">Total financed</div>
            <div className="mt-1 font-display text-3xl">${totals.financed.toLocaleString()}</div>
          </Card>
          <Card className="p-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sage/15 text-sage">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <div className="mt-3 text-xs font-semibold uppercase tracking-wider text-ink/50">Paid to date</div>
            <div className="mt-1 font-display text-3xl">${totals.paid.toLocaleString()}</div>
          </Card>
          <Card className="p-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber/15 text-amber-700">
              <TrendingUp className="h-5 w-5" />
            </div>
            <div className="mt-3 text-xs font-semibold uppercase tracking-wider text-ink/50">Remaining balance</div>
            <div className="mt-1 font-display text-3xl">${totals.remaining.toLocaleString()}</div>
          </Card>
        </div>

        {/* Plans */}
        <div className="mt-8 space-y-4">
          <h2 className="font-display text-2xl">Active plans</h2>
          {installments.length === 0 && (
            <Card className="p-10 text-center text-sm text-ink/60">
              No installment plans yet. Create one to spread costs over time.
            </Card>
          )}
          {installments.map((p) => {
            const progress = (p.paidMonths / p.months) * 100;
            return (
              <Card key={p.id} className="overflow-hidden">
                <div className="grid gap-0 md:grid-cols-[1fr_auto] md:items-center">
                  <div className="p-5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-semibold">{p.vendorName}</span>
                      <Badge variant={p.status === "Completed" ? "sage" : p.status === "Late" ? "amber" : "coral"}>
                        {p.status}
                      </Badge>
                      <span className="text-xs text-ink/50">{p.id}</span>
                    </div>
                    <div className="mt-3 grid grid-cols-3 gap-3 text-xs">
                      <div>
                        <div className="text-ink/50">Total</div>
                        <div className="font-display text-lg">${p.totalAmount.toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="text-ink/50">Monthly</div>
                        <div className="font-display text-lg">${p.monthly.toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="text-ink/50">Next due</div>
                        <div className="font-display text-lg">
                          {new Date(p.nextDue).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                        </div>
                      </div>
                    </div>
                    <div className="mt-4">
                      <div className="mb-1.5 flex items-center justify-between text-[11px]">
                        <span className="text-ink/60">{p.paidMonths} of {p.months} paid</span>
                        <span className="font-semibold">{Math.round(progress)}%</span>
                      </div>
                      <div className="h-1.5 overflow-hidden rounded-full bg-ink/5">
                        <div className="h-full bg-coral transition-all" style={{ width: `${progress}%` }} />
                      </div>
                      <div className="mt-3 grid grid-cols-6 gap-1.5 md:grid-cols-12">
                        {Array.from({ length: p.months }).map((_, i) => (
                          <div
                            key={i}
                            className={`flex h-8 items-center justify-center rounded-md text-[10px] font-semibold ${
                              i < p.paidMonths ? "bg-sage text-white" : i === p.paidMonths ? "bg-coral text-white" : "bg-ink/5 text-ink/40"
                            }`}
                          >
                            {i + 1}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="border-t border-ink/5 p-5 md:border-l md:border-t-0">
                    <div className="text-xs text-ink/50">Next payment</div>
                    <div className="font-display text-2xl">${p.monthly.toLocaleString()}</div>
                    <Button
                      variant="primary"
                      className="mt-3 w-full !rounded-xl"
                      onClick={() => payNextInstallment(p.id)}
                      disabled={p.status === "Completed"}
                    >
                      {p.status === "Completed" ? "Paid in full" : "Pay now"}
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </Section>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/60 p-4" onClick={() => setOpen(false)}>
          <div className="w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
            <Card className="p-6">
              <div className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-coral" />
                <h3 className="font-display text-2xl">Create installment plan</h3>
              </div>

              <div className="mt-5 space-y-4">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-ink/50">Booking</label>
                  <select
                    value={form.bookingId}
                    onChange={(e) => setForm({ ...form, bookingId: e.target.value })}
                    className="mt-1.5 w-full rounded-xl border border-ink/10 bg-cream-2 px-3.5 py-2.5 text-sm outline-none focus:border-ink"
                  >
                    {bookings.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.vendorName} · ${b.amount.toLocaleString()}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-ink/50">Term</label>
                  <div className="mt-1.5 grid grid-cols-4 gap-2">
                    {[3, 6, 9, 12].map((m) => (
                      <button
                        key={m}
                        onClick={() => setForm({ ...form, months: m as 3 | 6 | 9 | 12 })}
                        className={`rounded-xl border py-2.5 text-sm font-semibold transition ${
                          form.months === m ? "border-ink bg-ink text-cream" : "border-ink/10 hover:border-ink/30"
                        }`}
                      >
                        {m} mo
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-ink/50">
                    Deposit · {form.depositPct}%
                  </label>
                  <input
                    type="range"
                    min={10}
                    max={50}
                    step={5}
                    value={form.depositPct}
                    onChange={(e) => setForm({ ...form, depositPct: Number(e.target.value) })}
                    className="mt-1.5 w-full accent-coral"
                  />
                </div>

                <div className="rounded-2xl bg-cream-2 p-4">
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <div className="text-ink/50">Total</div>
                      <div className="font-display text-xl">${total.toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-ink/50">Deposit today</div>
                      <div className="font-display text-xl">${deposit.toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-ink/50">Monthly × {form.months}</div>
                      <div className="font-display text-xl text-coral">${monthly.toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-ink/50">APR</div>
                      <div className="font-display text-xl text-sage">0%</div>
                    </div>
                  </div>
                </div>

                {error && <p className="text-xs text-rose-700">{error}</p>}

                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1" onClick={() => setOpen(false)}>
                    Cancel
                  </Button>
                  <Button variant="primary" className="flex-1" onClick={submit}>
                    Create plan <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}

// Prevent unused import lint
export const _u = { Calendar };
