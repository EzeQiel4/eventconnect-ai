import { Link } from "react-router-dom";
import { Bell, BellOff, Check, CheckCheck, BellRing, ArrowRight, MessageSquare, Wallet, AlertTriangle, Users, ShieldCheck } from "lucide-react";
import { Section, Badge, Card, Button } from "../components/ui";
import { useApp } from "../context/AppContext";

export default function Notifications() {
  const { notifications, markNotificationRead, markAllRead } = useApp();
  const unread = notifications.filter((n) => !n.read).length;

  const kindIcons: Record<string, { icon: React.ReactNode; color: string }> = {
    booking: { icon: <MessageSquare className="h-4 w-4" />, color: "bg-coral/10 text-coral" },
    payment: { icon: <Wallet className="h-4 w-4" />, color: "bg-sage/15 text-sage" },
    alert: { icon: <AlertTriangle className="h-4 w-4" />, color: "bg-amber/15 text-amber-700" },
    guest: { icon: <Users className="h-4 w-4" />, color: "bg-violet-100 text-violet-700" },
    dispute: { icon: <ShieldCheck className="h-4 w-4" />, color: "bg-rose-100 text-rose-700" },
  };

  return (
    <div className="bg-cream pb-24">
      <Section className="pt-10">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <Badge variant="coral">
              <BellRing className="h-3 w-3" /> {unread} unread
            </Badge>
            <h1 className="mt-3 font-display text-4xl md:text-5xl">Notifications</h1>
            <p className="mt-1 text-ink/60">Everything that needs your attention, in one place.</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={markAllRead} disabled={unread === 0}>
              <CheckCheck className="h-4 w-4" /> Mark all read
            </Button>
            <Button variant="outline">
              <BellOff className="h-4 w-4" /> Settings
            </Button>
          </div>
        </div>

        <div className="mt-8 grid gap-3">
          {notifications.length === 0 && (
            <Card className="flex min-h-[300px] flex-col items-center justify-center p-12 text-center">
              <Bell className="h-10 w-10 text-ink/30" />
              <h3 className="mt-4 font-display text-xl">You're all caught up</h3>
            </Card>
          )}
          {notifications.map((n) => {
            const k = kindIcons[n.kind];
            return (
              <Card
                key={n.id}
                className={`flex gap-4 p-5 transition ${!n.read ? "ring-1 ring-coral/30" : ""}`}
              >
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${k.color}`}>
                  {k.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <div className="font-semibold">{n.title}</div>
                        {!n.read && <span className="h-1.5 w-1.5 rounded-full bg-coral" />}
                      </div>
                      <p className="mt-0.5 text-sm text-ink/60">{n.body}</p>
                    </div>
                    <div className="shrink-0 text-xs text-ink/40">{n.time}</div>
                  </div>
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    {n.link && (
                      <Link
                        to={n.link}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-coral hover:underline"
                      >
                        View <ArrowRight className="h-3 w-3" />
                      </Link>
                    )}
                    {!n.read && (
                      <button
                        onClick={() => markNotificationRead(n.id)}
                        className="inline-flex items-center gap-1 rounded-full bg-ink/5 px-2.5 py-1 text-xs font-semibold hover:bg-ink/10"
                      >
                        <Check className="h-3 w-3" /> Mark read
                      </button>
                    )}
                    <Badge variant="neutral" className="capitalize">{n.kind}</Badge>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        <Card className="mt-8 p-6">
          <h3 className="font-display text-xl">Notification channels</h3>
          <p className="mt-1 text-sm text-ink/60">Control how you receive updates.</p>
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {[
              { label: "Push notifications", desc: "Mobile + browser alerts", on: true },
              { label: "Email digest", desc: "Daily summary at 9am", on: true },
              { label: "SMS alerts", desc: "Critical booking & payment updates", on: true },
              { label: "WhatsApp", desc: "Guest RSVPs & reminders", on: false },
            ].map((c) => (
              <div key={c.label} className="flex items-center justify-between rounded-xl border border-ink/10 p-4">
                <div>
                  <div className="text-sm font-semibold">{c.label}</div>
                  <div className="text-xs text-ink/50">{c.desc}</div>
                </div>
                <button
                  className={`relative h-6 w-11 rounded-full transition ${c.on ? "bg-coral" : "bg-ink/20"}`}
                >
                  <span
                    className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition ${
                      c.on ? "left-5" : "left-0.5"
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </Card>
      </Section>
    </div>
  );
}
