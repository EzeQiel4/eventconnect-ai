import { useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Lock,
  Unlock,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Wallet,
  Clock,
  RotateCcw,
  ArrowRight,
} from "lucide-react";
import { Section, Badge, Card, Button } from "../components/ui";
import { usePlatformStore, type Milestone } from "../store/usePlatformStore";
import { useApp } from "../context/AppContext";

export default function Escrow() {
  const { bookings } = useApp();
  const {
    escrow,
    createEscrow,
    fundMilestone,
    approveMilestone,
    releaseEscrow,
    disputeEscrow,
    refundEscrow,
  } = usePlatformStore();

  // Auto-seed escrow for any "Escrowed" booking that doesn't have an account yet
  useMemo(() => {
    const haveBookings = new Set(escrow.map((e) => e.bookingId));
    bookings
      .filter((b) => (b.status === "Escrowed" || b.status === "In progress" || b.status === "Completed") && !haveBookings.has(b.id))
      .forEach((b) =>
        createEscrow({ bookingId: b.id, vendorId: b.vendorId, vendorName: b.vendorName, amount: b.amount })
      );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const totals = useMemo(() => {
    const held = escrow
      .filter((e) => ["Funded", "In Progress", "Disputed"].includes(e.status))
      .reduce((s, e) => s + e.milestones.filter((m) => m.status === "Funded" || m.status === "Pending Approval").reduce((x, m) => x + m.amount, 0), 0);
    const released = escrow.reduce(
      (s, e) => s + e.milestones.filter((m) => m.status === "Released").reduce((x, m) => x + m.amount, 0),
      0
    );
    const pending = escrow.filter((e) => e.status === "Pending").reduce((s, e) => s + e.amount, 0);
    const disputed = escrow.filter((e) => e.status === "Disputed").length;
    return { held, released, pending, disputed };
  }, [escrow]);

  return (
    <div className="bg-cream pb-20">
      <Section className="pt-10">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <Badge variant="coral">
              <ShieldCheck className="h-3 w-3" /> Escrow Wallet · PCI-compliant
            </Badge>
            <h1 className="mt-3 font-display text-4xl md:text-5xl">Escrow & milestones</h1>
            <p className="mt-1 max-w-xl text-ink/60">
              Every payment is held until you confirm the work is done. Milestones unlock funds in three stages.
            </p>
          </div>
          <Link to="/installments">
            <Button variant="outline">
              Installment plans <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        {/* Top metrics */}
        <div className="mt-8 grid gap-3 md:grid-cols-4">
          <Stat icon={<Lock className="h-5 w-5" />} label="Held in escrow" value={`$${totals.held.toLocaleString()}`} color="bg-coral/10 text-coral" />
          <Stat icon={<CheckCircle2 className="h-5 w-5" />} label="Released" value={`$${totals.released.toLocaleString()}`} color="bg-sage/10 text-sage" />
          <Stat icon={<Clock className="h-5 w-5" />} label="Pending funding" value={`$${totals.pending.toLocaleString()}`} color="bg-amber/15 text-amber-700" />
          <Stat icon={<AlertTriangle className="h-5 w-5" />} label="Active disputes" value={totals.disputed.toString()} color="bg-rose-100 text-rose-700" />
        </div>

        {/* Workflow */}
        <Card className="mt-6 overflow-hidden bg-ink text-cream">
          <div className="grid gap-0 md:grid-cols-5">
            {[
              { label: "Customer pays", icon: <Wallet className="h-4 w-4" /> },
              { label: "Funds held", icon: <Lock className="h-4 w-4" /> },
              { label: "Milestone completed", icon: <Clock className="h-4 w-4" /> },
              { label: "Customer approves", icon: <CheckCircle2 className="h-4 w-4" /> },
              { label: "Funds released", icon: <Unlock className="h-4 w-4" /> },
            ].map((s, i) => (
              <div key={s.label} className="relative flex items-center gap-3 border-t border-cream/10 p-4 md:border-l md:border-t-0">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-coral/20 text-coral">
                  {s.icon}
                </div>
                <div className="text-xs">
                  <div className="text-cream/50">Step {i + 1}</div>
                  <div className="font-semibold">{s.label}</div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Accounts */}
        <div className="mt-6 space-y-4">
          <h2 className="font-display text-2xl">Escrow accounts</h2>
          {escrow.length === 0 && (
            <Card className="p-10 text-center">
              <ShieldCheck className="mx-auto h-10 w-10 text-ink/30" />
              <h3 className="mt-3 font-display text-xl">No escrow accounts yet</h3>
              <p className="mt-1 text-sm text-ink/60">Bookings you fund will appear here as escrow accounts.</p>
            </Card>
          )}
          {escrow.map((e) => (
            <Card key={e.id} className="overflow-hidden">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-ink/10 p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-coral to-amber text-sm font-bold text-white">
                    {e.vendorName.charAt(0)}
                  </div>
                  <div>
                    <div className="font-semibold">{e.vendorName}</div>
                    <div className="text-xs text-ink/50">
                      {e.id} · ${e.amount.toLocaleString()} {e.currency} · created {new Date(e.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <EscrowStatusPill status={e.status} />
              </div>

              {/* Milestones */}
              <div className="divide-y divide-ink/5">
                {e.milestones.map((m, i) => (
                  <MilestoneRow
                    key={m.id}
                    index={i}
                    milestone={m}
                    onFund={() => fundMilestone(e.id, m.id)}
                    onApprove={() => approveMilestone(e.id, m.id)}
                  />
                ))}
              </div>

              {/* Actions */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-t border-ink/10 bg-cream-2 p-4">
                <div className="text-xs text-ink/60">
                  Progress: {e.milestones.filter((m) => m.status === "Released").length}/{e.milestones.length} milestones released
                </div>
                <div className="flex gap-2">
                  {e.status !== "Disputed" && e.status !== "Released" && e.status !== "Refunded" && (
                    <Button
                      variant="outline"
                      className="!rounded-xl !py-2 text-xs"
                      onClick={() => disputeEscrow(e.id, "Service quality dispute")}
                    >
                      <AlertTriangle className="h-3.5 w-3.5" /> Open dispute
                    </Button>
                  )}
                  {e.status === "Disputed" && (
                    <>
                      <Button variant="outline" className="!rounded-xl !py-2 text-xs" onClick={() => refundEscrow(e.id)}>
                        <RotateCcw className="h-3.5 w-3.5" /> Refund client
                      </Button>
                      <Button variant="primary" className="!rounded-xl !py-2 text-xs" onClick={() => releaseEscrow(e.id)}>
                        <Unlock className="h-3.5 w-3.5" /> Release to vendor
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Section>
    </div>
  );
}

function MilestoneRow({
  index,
  milestone,
  onFund,
  onApprove,
}: {
  index: number;
  milestone: Milestone;
  onFund: () => void;
  onApprove: () => void;
}) {
  const colors: Record<Milestone["status"], string> = {
    Locked: "bg-ink/10 text-ink/60",
    Funded: "bg-coral/10 text-coral",
    "Pending Approval": "bg-amber/15 text-amber-700",
    Released: "bg-sage/15 text-sage",
    Disputed: "bg-rose-100 text-rose-700",
  };
  return (
    <div className="grid gap-3 p-5 md:grid-cols-[auto_1fr_auto_auto] md:items-center">
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cream-2 text-sm font-bold text-ink/60">
        {index + 1}
      </div>
      <div>
        <div className="font-semibold">{milestone.label}</div>
        <div className="text-xs text-ink/50">{milestone.pct}% · ${milestone.amount.toLocaleString()}</div>
      </div>
      <span className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider ${colors[milestone.status]}`}>
        {milestone.status}
      </span>
      <div className="flex gap-2">
        {milestone.status === "Locked" && (
          <Button variant="outline" className="!rounded-lg !px-3 !py-1.5 text-xs" onClick={onFund}>
            <Wallet className="h-3 w-3" /> Fund
          </Button>
        )}
        {milestone.status === "Funded" && (
          <Button variant="primary" className="!rounded-lg !px-3 !py-1.5 text-xs" onClick={onApprove}>
            <CheckCircle2 className="h-3 w-3" /> Approve & release
          </Button>
        )}
        {milestone.status === "Released" && (
          <span className="flex items-center gap-1 text-xs text-sage">
            <CheckCircle2 className="h-3 w-3" /> Released {milestone.approvedAt ? new Date(milestone.approvedAt).toLocaleDateString() : ""}
          </span>
        )}
      </div>
    </div>
  );
}

function EscrowStatusPill({ status }: { status: string }) {
  const map: Record<string, string> = {
    Pending: "bg-amber/15 text-amber-700",
    Funded: "bg-coral/10 text-coral",
    "In Progress": "bg-violet-100 text-violet-700",
    Completed: "bg-sage/15 text-sage",
    Released: "bg-sage text-white",
    Disputed: "bg-rose-100 text-rose-700",
    Refunded: "bg-ink/10 text-ink/60",
  };
  return (
    <span className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${map[status] ?? "bg-ink/10 text-ink"}`}>
      {status}
    </span>
  );
}

function Stat({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: string; color: string }) {
  return (
    <Card className="p-5">
      <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${color}`}>{icon}</div>
      <div className="mt-3 text-xs font-semibold uppercase tracking-wider text-ink/50">{label}</div>
      <div className="mt-1 font-display text-3xl">{value}</div>
    </Card>
  );
}
