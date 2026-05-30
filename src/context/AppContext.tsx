import { createContext, useContext, useState, type ReactNode } from "react";

export interface Booking {
  id: string;
  vendorId: string;
  vendorName: string;
  category: string;
  amount: number;
  date: string;
  status: "Pending" | "Accepted" | "Rejected" | "Escrowed" | "In progress" | "Completed" | "Refunded" | "Cancelled";
  installments: { label: string; pct: number; status: "Paid" | "Upcoming" | "Due" }[];
  clientName?: string;
  clientEmail?: string;
  message?: string;
  eventId?: string;
}

export interface Event {
  id: string;
  name: string;
  type: string;
  date: string;
  location: string;
  guests: number;
  budget: number;
  style: string;
  status: "Planning" | "In Progress" | "Completed";
  cover: string;
  emoji: string;
}

export interface Guest {
  id: string;
  name: string;
  email: string;
  phone: string;
  rsvp: "Yes" | "No" | "Maybe" | "Pending";
  table: string;
  plusOne: boolean;
  checkedIn: boolean;
  qrCode: string;
}

export interface Dispute {
  id: string;
  bookingId: string;
  vendor: string;
  amount: number;
  reason: string;
  description: string;
  evidence: string[];
  status: "Submitted" | "Under review" | "Resolved";
  outcome?: "Refund" | "Vendor paid" | "Split" | null;
  createdAt: string;
}

export interface Notification {
  id: string;
  title: string;
  body: string;
  time: string;
  read: boolean;
  kind: "booking" | "payment" | "alert" | "guest" | "dispute" | "message";
  link?: string;
}

export interface ChatMessage {
  id: string;
  from: "me" | "them";
  text: string;
  time: string;
  kind?: "text" | "image" | "file" | "quote";
  meta?: { fileName?: string; amount?: number; label?: string };
}

export interface Conversation {
  id: string;
  vendorId: string;
  name: string;
  category: string;
  avatar: string;
  cover: string;
  online: boolean;
  verified: boolean;
  typing?: boolean;
  unread: number;
  messages: ChatMessage[];
}

export interface Review {
  id: string;
  bookingId: string;
  vendorId: string;
  vendorName: string;
  rating: number;
  title: string;
  body: string;
  photos: number;
  author: string;
  date: string;
}

interface AppState {
  walletBalance: number;
  bookings: Booking[];
  events: Event[];
  guests: Guest[];
  disputes: Dispute[];
  notifications: Notification[];
  conversations: Conversation[];
  reviews: Review[];
}

interface AppContextValue extends AppState {
  confirmBooking: (b: Omit<Booking, "id" | "installments">) => void;
  respondBooking: (id: string, response: "Accepted" | "Rejected") => void;
  addEvent: (e: Omit<Event, "id">) => void;
  addGuest: (g: Omit<Guest, "id" | "qrCode">) => void;
  toggleCheckIn: (id: string) => void;
  toggleRsvp: (id: string) => void;
  openDispute: (d: Omit<Dispute, "id" | "createdAt" | "status" | "outcome">) => void;
  resolveDispute: (id: string, outcome: Dispute["outcome"]) => void;
  markNotificationRead: (id: string) => void;
  markAllRead: () => void;
  sendMessage: (conversationId: string, text: string, kind?: ChatMessage["kind"], meta?: ChatMessage["meta"]) => void;
  openConversation: (id: string) => void;
  addReview: (r: Omit<Review, "id" | "date">) => void;
}

function generateQR(seed: string): string {
  // Deterministic pseudo-QR pattern (7x7 grid) based on seed hash
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) & 0xffffffff;
  const cells: boolean[] = [];
  for (let i = 0; i < 49; i++) {
    hash = (hash * 1103515245 + 12345) & 0x7fffffff;
    cells.push((hash & 1) === 1);
  }
  // Force corner markers
  const corners = [0, 1, 2, 7, 9, 14, 16, 21, 23, 4, 5, 6, 11, 13, 18, 20, 25, 26, 27, 32, 34, 39, 41, 46, 47, 48];
  corners.forEach((i) => (cells[i] = true));
  return cells.map((c) => (c ? "1" : "0")).join("");
}

const initialState: AppState = {
  walletBalance: 12840,
  events: [
    {
      id: "E-001",
      name: "Tunde & Adaeze",
      type: "Wedding",
      date: "2026-03-14",
      location: "The Grand Orchid Estate, Lagos",
      guests: 180,
      budget: 24000,
      style: "Luxury",
      status: "In Progress",
      cover: "from-amber-200 via-orange-200 to-rose-200",
      emoji: "💍",
    },
    {
      id: "E-002",
      name: "Sweet 21 — Zara",
      type: "Birthday",
      date: "2026-05-22",
      location: "The Rooftop, Victoria Island",
      guests: 80,
      budget: 8500,
      style: "Premium",
      status: "Planning",
      cover: "from-pink-200 via-fuchsia-200 to-violet-200",
      emoji: "🎂",
    },
  ],
  bookings: [
    {
      id: "BK-0041",
      vendorId: "v1",
      vendorName: "Lumière Studios",
      category: "Photographer",
      amount: 2400,
      date: "2026-03-14",
      status: "Escrowed",
      clientName: "Adaeze Okonkwo",
      message: "Looking forward to working with you on our special day!",
      eventId: "E-001",
      installments: [
        { label: "Deposit (30%)", pct: 30, status: "Paid" },
        { label: "Mid-payment (30%)", pct: 30, status: "Upcoming" },
        { label: "Completion (40%)", pct: 40, status: "Due" },
      ],
    },
    {
      id: "BK-0038",
      vendorId: "v2",
      vendorName: "Saffron & Thyme Catering",
      category: "Caterer",
      amount: 8200,
      date: "2026-03-14",
      status: "In progress",
      clientName: "Adaeze Okonkwo",
      eventId: "E-001",
      installments: [
        { label: "Deposit (30%)", pct: 30, status: "Paid" },
        { label: "Mid-payment (30%)", pct: 30, status: "Paid" },
        { label: "Completion (40%)", pct: 40, status: "Due" },
      ],
    },
    {
      id: "BK-0045",
      vendorId: "v3",
      vendorName: "DJ Rhythm Kings",
      category: "DJ / MC",
      amount: 1800,
      date: "2026-03-14",
      status: "Pending",
      clientName: "Adaeze Okonkwo",
      message: "We want a mix of afrobeats and amapiano. Can you share your set list?",
      eventId: "E-001",
      installments: [
        { label: "Deposit (30%)", pct: 30, status: "Due" },
        { label: "Mid-payment (30%)", pct: 30, status: "Due" },
        { label: "Completion (40%)", pct: 40, status: "Due" },
      ],
    },
    {
      id: "BK-0029",
      vendorId: "v6",
      vendorName: "The Grand Orchid Estate",
      category: "Venue",
      amount: 12500,
      date: "2026-03-14",
      status: "Completed",
      clientName: "Adaeze Okonkwo",
      eventId: "E-001",
      installments: [
        { label: "Deposit (30%)", pct: 30, status: "Paid" },
        { label: "Mid-payment (30%)", pct: 30, status: "Paid" },
        { label: "Completion (40%)", pct: 40, status: "Paid" },
      ],
    },
  ],
  guests: [
    { id: "g1", name: "Adaeze Okonkwo", email: "adaeze@…", phone: "+234 801 234 0001", rsvp: "Yes", table: "1", plusOne: true, checkedIn: false, qrCode: generateQR("g1-adaeze") },
    { id: "g2", name: "Femi Adeleke", email: "femi@…", phone: "+234 801 234 0002", rsvp: "Yes", table: "1", plusOne: false, checkedIn: true, qrCode: generateQR("g2-femi") },
    { id: "g3", name: "Ngozi Eze", email: "ngozi@…", phone: "+234 801 234 0003", rsvp: "Maybe", table: "3", plusOne: false, checkedIn: false, qrCode: generateQR("g3-ngozi") },
    { id: "g4", name: "Tunde Bakare", email: "tunde@…", phone: "+234 801 234 0004", rsvp: "Yes", table: "2", plusOne: true, checkedIn: false, qrCode: generateQR("g4-tunde") },
    { id: "g5", name: "Ifeoma Uzoma", email: "ifeoma@…", phone: "+234 801 234 0005", rsvp: "No", table: "-", plusOne: false, checkedIn: false, qrCode: generateQR("g5-ifeoma") },
    { id: "g6", name: "Seun Kolade", email: "seun@…", phone: "+234 801 234 0006", rsvp: "Yes", table: "2", plusOne: false, checkedIn: true, qrCode: generateQR("g6-seun") },
    { id: "g7", name: "Bola Thompson", email: "bola@…", phone: "+234 801 234 0007", rsvp: "Pending", table: "-", plusOne: true, checkedIn: false, qrCode: generateQR("g7-bola") },
    { id: "g8", name: "Yinka Adebayo", email: "yinka@…", phone: "+234 801 234 0008", rsvp: "Yes", table: "4", plusOne: false, checkedIn: false, qrCode: generateQR("g8-yinka") },
  ],
  disputes: [
    {
      id: "DSP-001",
      bookingId: "BK-0025",
      vendor: "Lagos Blooms",
      amount: 640,
      reason: "Décor did not match portfolio",
      description: "The floral arrangements delivered differed significantly from what was shown in the portfolio and agreed upon during consultation.",
      evidence: ["photo1.jpg", "photo2.jpg", "chat-log.pdf"],
      status: "Under review",
      createdAt: "2025-12-24",
    },
  ],
  notifications: [
    { id: "n1", title: "Payment released from escrow", body: "$4,980 released to The Grand Orchid Estate after your confirmation.", time: "2h ago", read: false, kind: "payment", link: "/dashboard" },
    { id: "n2", title: "New booking request", body: "Adaeze O. requested DJ Rhythm Kings for Mar 14. $1,800.", time: "3h ago", read: false, kind: "booking", link: "/vendor" },
    { id: "n3", title: "Mid-payment due in 5 days", body: "Saffron & Thyme Catering — 30% installment ($2,460) is due Mar 9.", time: "4h ago", read: false, kind: "payment", link: "/dashboard" },
    { id: "n4", title: "New RSVP: Bola Thompson", body: "Responded with +1 guest. Update table assignments?", time: "6h ago", read: true, kind: "guest", link: "/guests" },
    { id: "n5", title: "New message from Lumière Studios", body: "\"Hi! Can we schedule the pre-wedding shoot for this Saturday?\"", time: "1d ago", read: true, kind: "booking", link: "/dashboard" },
    { id: "n6", title: "Backup vendor alert", body: "Your original DJ cancelled — 3 same-tier alternatives are available.", time: "3d ago", read: true, kind: "alert", link: "/marketplace" },
    { id: "n7", title: "Dispute update · DSP-001", body: "Lagos Blooms responded to your evidence. Admin review scheduled.", time: "4d ago", read: true, kind: "dispute", link: "/disputes" },
  ],
  conversations: [
    {
      id: "c1",
      vendorId: "v1",
      name: "Lumière Studios",
      category: "Photographer",
      avatar: "LS",
      cover: "from-amber-200 via-orange-200 to-rose-200",
      online: true,
      verified: true,
      unread: 2,
      messages: [
        { id: "m1", from: "them", text: "Hi Adaeze! Thank you for booking Lumière for your big day 🎉", time: "9:02 AM", kind: "text" },
        { id: "m2", from: "me", text: "We're so excited! Can we schedule the pre-wedding shoot?", time: "9:05 AM", kind: "text" },
        { id: "m3", from: "them", text: "Absolutely. Here's our updated package quote for the full-day coverage + film.", time: "9:06 AM", kind: "text" },
        { id: "m4", from: "them", text: "", time: "9:06 AM", kind: "quote", meta: { amount: 2400, label: "Full-day coverage + cinematic film" } },
        { id: "m5", from: "them", text: "Does this Saturday at 4pm work for the pre-shoot?", time: "9:07 AM", kind: "text" },
      ],
    },
    {
      id: "c2",
      vendorId: "v2",
      name: "Saffron & Thyme Catering",
      category: "Caterer",
      avatar: "ST",
      cover: "from-emerald-200 via-teal-200 to-cyan-200",
      online: false,
      verified: true,
      unread: 0,
      messages: [
        { id: "m1", from: "me", text: "Hi! Could you confirm the tasting menu for 180 guests?", time: "Yesterday", kind: "text" },
        { id: "m2", from: "them", text: "Of course! I've attached the full tasting menu and dietary options.", time: "Yesterday", kind: "text" },
        { id: "m3", from: "them", text: "", time: "Yesterday", kind: "file", meta: { fileName: "tasting-menu-v2.pdf" } },
        { id: "m4", from: "me", text: "Perfect, this looks amazing. Let's proceed 🙌", time: "Yesterday", kind: "text" },
      ],
    },
    {
      id: "c3",
      vendorId: "v3",
      name: "DJ Rhythm Kings",
      category: "DJ / MC",
      avatar: "RK",
      cover: "from-violet-200 via-purple-200 to-fuchsia-200",
      online: true,
      verified: false,
      unread: 1,
      messages: [
        { id: "m1", from: "me", text: "We want a mix of afrobeats and amapiano. Can you share your set list?", time: "2:14 PM", kind: "text" },
        { id: "m2", from: "them", text: "Say less 🔥 I'll send a custom set list tailored to your vibe today.", time: "2:20 PM", kind: "text" },
      ],
    },
  ],
  reviews: [
    {
      id: "rv1",
      bookingId: "BK-0029",
      vendorId: "v6",
      vendorName: "The Grand Orchid Estate",
      rating: 5,
      title: "Absolutely breathtaking venue",
      body: "The gardens were stunning and the staff went above and beyond. Our guests are still talking about it!",
      photos: 3,
      author: "Adaeze O.",
      date: "2026-03-18",
    },
  ],
};

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(initialState);

  const confirmBooking: AppContextValue["confirmBooking"] = (b) => {
    const newBooking: Booking = {
      ...b,
      id: `BK-${String(Math.floor(Math.random() * 9000) + 1000)}`,
      installments: [
        { label: "Deposit (30%)", pct: 30, status: "Paid" },
        { label: "Mid-payment (30%)", pct: 30, status: "Due" },
        { label: "Completion (40%)", pct: 40, status: "Due" },
      ],
    };
    setState((s) => ({
      ...s,
      bookings: [newBooking, ...s.bookings],
      walletBalance: Math.max(0, s.walletBalance - Math.round(b.amount * 0.3)),
      notifications: [
        {
          id: `n${Date.now()}`,
          title: "Booking request sent",
          body: `${b.vendorName} — $${Math.round(b.amount * 0.3).toLocaleString()} will be escrowed on acceptance.`,
          time: "just now",
          read: false,
          kind: "booking",
          link: "/dashboard",
        },
        ...s.notifications,
      ],
    }));
  };

  const respondBooking: AppContextValue["respondBooking"] = (id, response) => {
    setState((s) => ({
      ...s,
      bookings: s.bookings.map((b) => (b.id === id ? { ...b, status: response, installments: response === "Accepted" ? b.installments.map((i, idx) => idx === 0 ? { ...i, status: "Paid" as const } : i) : b.installments } : b)),
      notifications: [
        {
          id: `n${Date.now()}`,
          title: response === "Accepted" ? "Booking accepted · funds escrowed" : "Booking declined",
          body: response === "Accepted" ? `Client deposit has been locked in escrow.` : `You can suggest alternatives to the client.`,
          time: "just now",
          read: false,
          kind: "booking",
          link: "/vendor",
        },
        ...s.notifications,
      ],
    }));
  };

  const addEvent: AppContextValue["addEvent"] = (e) => {
    const newEvent: Event = { ...e, id: `E-${String(Math.floor(Math.random() * 900) + 100)}` };
    setState((s) => ({
      ...s,
      events: [newEvent, ...s.events],
      notifications: [
        {
          id: `n${Date.now()}`,
          title: "Event created",
          body: `${newEvent.name} · ${newEvent.type} · ${newEvent.guests} guests`,
          time: "just now",
          read: false,
          kind: "alert",
          link: "/dashboard",
        },
        ...s.notifications,
      ],
    }));
  };

  const addGuest: AppContextValue["addGuest"] = (g) => {
    const id = `g${Date.now()}`;
    setState((s) => ({
      ...s,
      guests: [...s.guests, { ...g, id, qrCode: generateQR(id + g.name) }],
    }));
  };

  const toggleCheckIn: AppContextValue["toggleCheckIn"] = (id) => {
    setState((s) => ({
      ...s,
      guests: s.guests.map((g) => (g.id === id ? { ...g, checkedIn: !g.checkedIn } : g)),
    }));
  };

  const toggleRsvp: AppContextValue["toggleRsvp"] = (id) => {
    const cycle: Guest["rsvp"][] = ["Pending", "Yes", "Maybe", "No"];
    setState((s) => ({
      ...s,
      guests: s.guests.map((g) => {
        if (g.id !== id) return g;
        const next = cycle[(cycle.indexOf(g.rsvp) + 1) % cycle.length];
        return { ...g, rsvp: next };
      }),
    }));
  };

  const openDispute: AppContextValue["openDispute"] = (d) => {
    const newDispute: Dispute = {
      ...d,
      id: `DSP-${String(Math.floor(Math.random() * 900) + 100)}`,
      status: "Submitted",
      createdAt: new Date().toISOString().slice(0, 10),
    };
    setState((s) => ({
      ...s,
      disputes: [newDispute, ...s.disputes],
      bookings: s.bookings.map((b) => (b.id === d.bookingId ? { ...b, status: "Escrowed" as const } : b)),
      notifications: [
        {
          id: `n${Date.now()}`,
          title: "Dispute opened · escrow frozen",
          body: `Dispute ${newDispute.id} vs ${newDispute.vendor}. ${newDispute.evidence.length} evidence files uploaded.`,
          time: "just now",
          read: false,
          kind: "dispute",
          link: "/disputes",
        },
        ...s.notifications,
      ],
    }));
  };

  const resolveDispute: AppContextValue["resolveDispute"] = (id, outcome) => {
    setState((s) => ({
      ...s,
      disputes: s.disputes.map((d) => (d.id === id ? { ...d, status: "Resolved" as const, outcome: outcome ?? null } : d)),
    }));
  };

  const markNotificationRead = (id: string) => {
    setState((s) => ({
      ...s,
      notifications: s.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
    }));
  };

  const markAllRead = () => {
    setState((s) => ({
      ...s,
      notifications: s.notifications.map((n) => ({ ...n, read: true })),
    }));
  };

  const autoReplies = [
    "Sounds great! Let me check my calendar and confirm 👍",
    "Perfect — I'll put that together and send it over shortly.",
    "Thank you! Looking forward to making your event unforgettable ✨",
    "Noted. I'll update the quote and share the details today.",
    "Yes, that works for us. I'll lock it in.",
  ];

  const sendMessage: AppContextValue["sendMessage"] = (conversationId, text, kind = "text", meta) => {
    const now = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const msg: ChatMessage = { id: `m${Date.now()}`, from: "me", text, time: now, kind, meta };
    setState((s) => ({
      ...s,
      conversations: s.conversations.map((c) =>
        c.id === conversationId ? { ...c, messages: [...c.messages, msg], typing: true, unread: 0 } : c
      ),
    }));

    // Simulate real-time vendor reply (Socket.io style)
    window.setTimeout(() => {
      const reply: ChatMessage = {
        id: `m${Date.now() + 1}`,
        from: "them",
        text: autoReplies[Math.floor(Math.random() * autoReplies.length)],
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        kind: "text",
      };
      setState((s) => ({
        ...s,
        conversations: s.conversations.map((c) =>
          c.id === conversationId ? { ...c, messages: [...c.messages, reply], typing: false } : c
        ),
      }));
    }, 1800);
  };

  const openConversation: AppContextValue["openConversation"] = (id) => {
    setState((s) => ({
      ...s,
      conversations: s.conversations.map((c) => (c.id === id ? { ...c, unread: 0 } : c)),
    }));
  };

  const addReview: AppContextValue["addReview"] = (r) => {
    const review: Review = { ...r, id: `rv${Date.now()}`, date: new Date().toISOString().slice(0, 10) };
    setState((s) => ({
      ...s,
      reviews: [review, ...s.reviews],
      notifications: [
        {
          id: `n${Date.now()}`,
          title: "Review submitted",
          body: `You rated ${r.vendorName} ${r.rating}★ — thank you for your feedback!`,
          time: "just now",
          read: false,
          kind: "alert",
          link: "/dashboard",
        },
        ...s.notifications,
      ],
    }));
  };

  return (
    <AppContext.Provider
      value={{
        ...state,
        confirmBooking,
        respondBooking,
        addEvent,
        addGuest,
        toggleCheckIn,
        toggleRsvp,
        openDispute,
        resolveDispute,
        markNotificationRead,
        markAllRead,
        sendMessage,
        openConversation,
        addReview,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
