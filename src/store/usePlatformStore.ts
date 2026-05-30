import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { audit } from "../lib/db";

// ---------- Types ----------
export type EscrowStatus =
  | "Pending"
  | "Funded"
  | "In Progress"
  | "Completed"
  | "Released"
  | "Disputed"
  | "Refunded";

export interface Milestone {
  id: string;
  label: string;
  pct: number;
  amount: number;
  status: "Locked" | "Funded" | "Pending Approval" | "Released" | "Disputed";
  approvedAt?: number;
}

export interface EscrowAccount {
  id: string;
  bookingId: string;
  vendorId: string;
  vendorName: string;
  amount: number;
  currency: string;
  status: EscrowStatus;
  milestones: Milestone[];
  createdAt: number;
}

export interface InstallmentPlan {
  id: string;
  bookingId: string;
  vendorName: string;
  totalAmount: number;
  deposit: number;
  monthly: number;
  months: number;
  paidMonths: number;
  apr: number;
  nextDue: string;
  status: "Active" | "Completed" | "Late";
  createdAt: number;
}

export interface CopilotMessage {
  id: string;
  role: "user" | "assistant" | "system";
  text: string;
  ts: number;
}

export interface CopilotThread {
  id: string;
  title: string;
  context?: { eventId?: string; eventType?: string };
  messages: CopilotMessage[];
  createdAt: number;
  updatedAt: number;
}

export type SubscriptionTier = "Basic" | "Pro" | "Premium";

export interface VendorSubscription {
  vendorId: string;
  tier: SubscriptionTier;
  featuredListing: boolean;
  priorityRanking: boolean;
  premiumAnalytics: boolean;
  premiumBadge: boolean;
  renewsOn: string;
  monthlyFee: number;
}

export interface TrustBreakdown {
  vendorId: string;
  identity: number; // 0-100
  business: number;
  reviews: number;
  responseRate: number;
  completion: number;
  disputeFree: number;
  total: number;
}

// ---------- Helpers ----------
function uid(prefix: string) {
  return `${prefix}_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
}

function buildMilestones(amount: number): Milestone[] {
  return [
    { id: uid("ms"), label: "Deposit", pct: 30, amount: Math.round(amount * 0.3), status: "Funded" },
    { id: uid("ms"), label: "Setup Stage", pct: 40, amount: Math.round(amount * 0.4), status: "Locked" },
    { id: uid("ms"), label: "Completion", pct: 30, amount: Math.round(amount * 0.3), status: "Locked" },
  ];
}

// ---------- Store ----------
interface PlatformState {
  escrow: EscrowAccount[];
  installments: InstallmentPlan[];
  copilotThreads: CopilotThread[];
  activeThreadId: string | null;
  subscriptions: VendorSubscription[];

  // Escrow actions
  createEscrow: (input: { bookingId: string; vendorId: string; vendorName: string; amount: number }) => EscrowAccount;
  fundMilestone: (escrowId: string, milestoneId: string) => void;
  approveMilestone: (escrowId: string, milestoneId: string) => void;
  releaseEscrow: (escrowId: string) => void;
  disputeEscrow: (escrowId: string, reason: string) => void;
  refundEscrow: (escrowId: string) => void;

  // Installment actions
  createInstallmentPlan: (input: { bookingId: string; vendorName: string; total: number; months: number; depositPct?: number }) => InstallmentPlan;
  payNextInstallment: (planId: string) => void;

  // Copilot actions
  newThread: (title: string, context?: CopilotThread["context"]) => string;
  setActiveThread: (id: string | null) => void;
  appendMessage: (threadId: string, msg: Omit<CopilotMessage, "id" | "ts">) => void;
  deleteThread: (id: string) => void;

  // Subscriptions
  upgradeSubscription: (vendorId: string, tier: SubscriptionTier) => void;
}

const tierConfig: Record<SubscriptionTier, Omit<VendorSubscription, "vendorId" | "renewsOn">> = {
  Basic: { tier: "Basic", featuredListing: false, priorityRanking: false, premiumAnalytics: false, premiumBadge: false, monthlyFee: 0 },
  Pro: { tier: "Pro", featuredListing: true, priorityRanking: false, premiumAnalytics: true, premiumBadge: false, monthlyFee: 49 },
  Premium: { tier: "Premium", featuredListing: true, priorityRanking: true, premiumAnalytics: true, premiumBadge: true, monthlyFee: 149 },
};

export const usePlatformStore = create<PlatformState>()(
  persist(
    (set) => ({
      escrow: [],
      installments: [],
      copilotThreads: [],
      activeThreadId: null,
      subscriptions: [
        { vendorId: "v1", ...tierConfig.Premium, renewsOn: "2026-12-01" },
        { vendorId: "v4", ...tierConfig.Pro, renewsOn: "2026-09-15" },
      ],

      createEscrow: ({ bookingId, vendorId, vendorName, amount }) => {
        const milestones = buildMilestones(amount);
        const account: EscrowAccount = {
          id: uid("esc"),
          bookingId,
          vendorId,
          vendorName,
          amount,
          currency: "USD",
          status: "Funded",
          milestones,
          createdAt: Date.now(),
        };
        set((s) => ({ escrow: [account, ...s.escrow] }));
        audit.log({ actor: "client", action: "escrow:create", entity: account.id, details: `${vendorName} · $${amount.toLocaleString()}` });
        return account;
      },

      fundMilestone: (escrowId, milestoneId) => {
        set((s) => ({
          escrow: s.escrow.map((e) =>
            e.id !== escrowId
              ? e
              : {
                  ...e,
                  milestones: e.milestones.map((m) => (m.id === milestoneId ? { ...m, status: "Funded" as const } : m)),
                  status: "Funded" as const,
                }
          ),
        }));
        audit.log({ actor: "client", action: "milestone:fund", entity: escrowId });
      },

      approveMilestone: (escrowId, milestoneId) => {
        set((s) => ({
          escrow: s.escrow.map((e) => {
            if (e.id !== escrowId) return e;
            const milestones = e.milestones.map((m) =>
              m.id === milestoneId ? { ...m, status: "Released" as const, approvedAt: Date.now() } : m
            );
            const allReleased = milestones.every((m) => m.status === "Released");
            return {
              ...e,
              milestones,
              status: allReleased ? ("Released" as const) : ("In Progress" as const),
            };
          }),
        }));
        audit.log({ actor: "client", action: "milestone:approve", entity: escrowId });
      },

      releaseEscrow: (escrowId) => {
        set((s) => ({
          escrow: s.escrow.map((e) =>
            e.id !== escrowId
              ? e
              : {
                  ...e,
                  status: "Released" as const,
                  milestones: e.milestones.map((m) => ({ ...m, status: "Released" as const })),
                }
          ),
        }));
        audit.log({ actor: "admin", action: "escrow:release-all", entity: escrowId });
      },

      disputeEscrow: (escrowId, reason) => {
        set((s) => ({
          escrow: s.escrow.map((e) => (e.id !== escrowId ? e : { ...e, status: "Disputed" as const })),
        }));
        audit.log({ actor: "client", action: "escrow:dispute", entity: escrowId, details: reason });
      },

      refundEscrow: (escrowId) => {
        set((s) => ({
          escrow: s.escrow.map((e) => (e.id !== escrowId ? e : { ...e, status: "Refunded" as const })),
        }));
        audit.log({ actor: "admin", action: "escrow:refund", entity: escrowId });
      },

      createInstallmentPlan: ({ bookingId, vendorName, total, months, depositPct = 20 }) => {
        const deposit = Math.round(total * (depositPct / 100));
        const financed = total - deposit;
        const apr = 0; // 0% APR — platform absorbs cost via vendor fees
        const monthly = Math.round(financed / months);
        const next = new Date();
        next.setMonth(next.getMonth() + 1);
        const plan: InstallmentPlan = {
          id: uid("ins"),
          bookingId,
          vendorName,
          totalAmount: total,
          deposit,
          monthly,
          months,
          paidMonths: 0,
          apr,
          nextDue: next.toISOString().slice(0, 10),
          status: "Active",
          createdAt: Date.now(),
        };
        set((s) => ({ installments: [plan, ...s.installments] }));
        audit.log({ actor: "client", action: "installment:create", entity: plan.id, details: `${months} months · $${monthly}/mo` });
        return plan;
      },

      payNextInstallment: (planId) => {
        set((s) => ({
          installments: s.installments.map((p) => {
            if (p.id !== planId) return p;
            const paidMonths = Math.min(p.months, p.paidMonths + 1);
            const next = new Date(p.nextDue);
            next.setMonth(next.getMonth() + 1);
            return {
              ...p,
              paidMonths,
              nextDue: next.toISOString().slice(0, 10),
              status: paidMonths >= p.months ? "Completed" : "Active",
            };
          }),
        }));
        audit.log({ actor: "client", action: "installment:pay", entity: planId });
      },

      newThread: (title, context) => {
        const thread: CopilotThread = {
          id: uid("th"),
          title,
          context,
          messages: [],
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };
        set((s) => ({ copilotThreads: [thread, ...s.copilotThreads], activeThreadId: thread.id }));
        return thread.id;
      },

      setActiveThread: (id) => set({ activeThreadId: id }),

      appendMessage: (threadId, msg) => {
        const m: CopilotMessage = { ...msg, id: uid("m"), ts: Date.now() };
        set((s) => ({
          copilotThreads: s.copilotThreads.map((t) =>
            t.id === threadId ? { ...t, messages: [...t.messages, m], updatedAt: Date.now() } : t
          ),
        }));
      },

      deleteThread: (id) => {
        set((s) => ({
          copilotThreads: s.copilotThreads.filter((t) => t.id !== id),
          activeThreadId: s.activeThreadId === id ? null : s.activeThreadId,
        }));
      },

      upgradeSubscription: (vendorId, tier) => {
        const cfg = tierConfig[tier];
        const renewsOn = new Date();
        renewsOn.setMonth(renewsOn.getMonth() + 1);
        const sub: VendorSubscription = { vendorId, ...cfg, renewsOn: renewsOn.toISOString().slice(0, 10) };
        set((s) => {
          const others = s.subscriptions.filter((x) => x.vendorId !== vendorId);
          return { subscriptions: [...others, sub] };
        });
        audit.log({ actor: "vendor", action: "subscription:upgrade", entity: vendorId, details: tier });
      },
    }),
    {
      name: "ec2-platform",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

// ---------- Trust score helper (selector) ----------
import { vendors } from "../data/vendors";

export function computeTrust(vendorId: string): TrustBreakdown {
  const v = vendors.find((x) => x.id === vendorId);
  if (!v) {
    return { vendorId, identity: 0, business: 0, reviews: 0, responseRate: 0, completion: 0, disputeFree: 0, total: 0 };
  }
  const identity = v.verified >= 3 ? 100 : v.verified >= 2 ? 80 : v.verified >= 1 ? 60 : 0;
  const business = v.verified >= 4 ? 100 : v.verified >= 3 ? 90 : v.verified >= 2 ? 70 : 40;
  const reviews = Math.min(100, Math.round((v.rating / 5) * 100));
  const responseRate = v.responseTime.includes("min") ? 98 : v.responseTime.includes("hour") ? 88 : 75;
  const completion = v.completionRate;
  const disputeFree = Math.max(0, 100 - v.cancellationRate * 12);
  const total = Math.round(
    identity * 0.18 + business * 0.18 + reviews * 0.2 + responseRate * 0.14 + completion * 0.18 + disputeFree * 0.12
  );
  return { vendorId, identity, business, reviews, responseRate, completion, disputeFree, total };
}
