import { Link, NavLink, useLocation } from "react-router-dom";
import { useState } from "react";
import { Sparkles, Menu, X, Bell, LogOut, User as UserIcon, MessageSquare, Moon, Sun } from "lucide-react";
import { useApp } from "../context/AppContext";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [userMenu, setUserMenu] = useState(false);
  const { notifications, conversations } = useApp();
  const { user, logout, switchRole } = useAuth();
  const { theme, toggle } = useTheme();
  const unread = notifications.filter((n) => !n.read).length;
  const unreadMessages = conversations.reduce((sum, c) => sum + c.unread, 0);
  const location = useLocation();
  const isAuth = location.pathname === "/login" || location.pathname === "/signup";

  if (isAuth) return null;

  const clientLinks = [
    { to: "/", label: "Home" },
    { to: "/matching", label: "AI Match" },
    { to: "/copilot", label: "Copilot" },
    { to: "/marketplace", label: "Vendors" },
    { to: "/escrow", label: "Escrow" },
    { to: "/dashboard", label: "Dashboard" },
  ];

  const vendorLinks = [
    { to: "/vendor-crm", label: "CRM" },
    { to: "/vendor", label: "Dashboard" },
    { to: "/marketplace", label: "Browse" },
    { to: "/messages", label: "Messages" },
    { to: "/subscriptions", label: "Plans" },
  ];

  const links =
    user?.role === "vendor"
      ? vendorLinks
      : user?.role === "admin"
      ? [
          { to: "/admin", label: "Admin" },
          { to: "/analytics", label: "Analytics" },
          { to: "/escrow", label: "Escrow" },
        ]
      : clientLinks;

  const roleColors: Record<string, string> = {
    client: "bg-coral/15 text-coral",
    vendor: "bg-sage/15 text-sage",
    planner: "bg-amber/15 text-amber",
    admin: "aurora-bg text-[#0a0a12]",
  };

  return (
    <header className="sticky top-0 z-40 border-b border-white/5 bg-cream/70 backdrop-blur-2xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3.5 md:px-8">
        <Link
          to={user?.role === "vendor" ? "/vendor" : user?.role === "admin" ? "/admin" : "/"}
          className="flex items-center gap-2.5"
        >
          <div className="relative flex h-9 w-9 items-center justify-center rounded-xl aurora-bg shadow-[0_0_24px_-2px_rgba(167,139,250,0.6)]">
            <Sparkles className="h-4 w-4 text-[#0a0a12]" />
          </div>
          <div className="leading-tight">
            <div className="font-display text-lg tracking-tight">EventConnect<span className="text-coral">.</span>AI</div>
            <div className="mono text-[9px] uppercase tracking-[0.22em] text-ink-2/70">
              {user?.role === "admin"
                ? "ADMIN_OS"
                : user?.role === "vendor"
                ? "VENDOR_PORTAL"
                : "EVENT_OS"}
            </div>
          </div>
        </Link>

        <nav className="hidden items-center gap-0.5 rounded-full border border-white/8 bg-white/[0.03] p-1 md:flex">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === "/" || l.to === "/admin" || l.to === "/vendor"}
              className={({ isActive }) =>
                `rounded-full px-3.5 py-1.5 text-[13px] font-medium transition ${
                  isActive ? "bg-ink text-cream shadow-sm" : "text-ink-2 hover:bg-white/5 hover:text-ink"
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            onClick={toggle}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-ink-2 transition hover:bg-white/5 hover:text-ink"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          {user ? (
            <>
              <Link
                to="/messages"
                className="relative hidden h-9 w-9 items-center justify-center rounded-full border border-white/10 text-ink-2 transition hover:bg-white/5 hover:text-ink md:flex"
                aria-label="Messages"
              >
                <MessageSquare className="h-4 w-4" />
                {unreadMessages > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-coral px-1 text-[10px] font-bold text-[#0a0a12]">
                    {unreadMessages}
                  </span>
                )}
              </Link>
              <Link
                to="/notifications"
                className="relative hidden h-9 w-9 items-center justify-center rounded-full border border-white/10 text-ink-2 transition hover:bg-white/5 hover:text-ink md:flex"
                aria-label="Notifications"
              >
                <Bell className="h-4 w-4" />
                {unread > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-coral px-1 text-[10px] font-bold text-[#0a0a12]">
                    {unread}
                  </span>
                )}
              </Link>

              <div className="relative">
                <button
                  onClick={() => setUserMenu((v) => !v)}
                  className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] py-1 pl-1 pr-3 transition hover:border-white/25"
                >
                  <div className="flex h-7 w-7 items-center justify-center rounded-full aurora-bg text-[10px] font-bold text-[#0a0a12]">
                    {user.avatar}
                  </div>
                  <div className="hidden text-left md:block">
                    <div className="text-xs font-semibold leading-tight">{user.name.split(" ")[0]}</div>
                    <div className={`inline-block rounded px-1 text-[9px] font-bold uppercase tracking-wider ${roleColors[user.role]}`}>
                      {user.role}
                    </div>
                  </div>
                </button>

                {userMenu && (
                  <>
                    <div className="fixed inset-0 z-30" onClick={() => setUserMenu(false)} />
                    <div className="absolute right-0 top-full mt-2 w-64 overflow-hidden rounded-2xl border border-ink/10 bg-white shadow-xl z-40">
                      <div className="border-b border-ink/5 p-4">
                        <div className="font-semibold">{user.name}</div>
                        <div className="text-xs text-ink/50">{user.email}</div>
                      </div>
                      <div className="p-2">
                        <div className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-ink/40">
                          Switch view (demo)
                        </div>
                        {(["client", "vendor", "planner", "admin"] as const).map((r) => (
                          <button
                            key={r}
                            onClick={() => { switchRole(r); setUserMenu(false); }}
                            className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm capitalize transition ${
                              user.role === r ? "bg-ink text-cream" : "hover:bg-ink/5"
                            }`}
                          >
                            <UserIcon className="h-3.5 w-3.5" /> {r}
                          </button>
                        ))}
                      </div>
                      <div className="border-t border-ink/5 p-2">
                        <Link
                          to="/messages"
                          onClick={() => setUserMenu(false)}
                          className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-ink/5 md:hidden"
                        >
                          <MessageSquare className="h-3.5 w-3.5" /> Messages {unreadMessages > 0 && <span className="ml-auto text-xs text-coral">{unreadMessages}</span>}
                        </Link>
                        <Link
                          to="/notifications"
                          onClick={() => setUserMenu(false)}
                          className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-ink/5 md:hidden"
                        >
                          <Bell className="h-3.5 w-3.5" /> Notifications {unread > 0 && <span className="ml-auto text-xs text-coral">{unread}</span>}
                        </Link>
                        <button
                          onClick={() => { logout(); setUserMenu(false); }}
                          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-ink/5"
                        >
                          <LogOut className="h-3.5 w-3.5" /> Sign out
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="hidden rounded-full px-4 py-2 text-sm font-semibold text-ink-2 hover:text-ink md:inline-block"
              >
                Sign in
              </Link>
              <Link
                to="/signup"
                className="hidden rounded-full aurora-bg px-4 py-2 text-sm font-semibold text-[#0a0a12] transition hover:-translate-y-0.5 md:inline-block"
              >
                Get started
              </Link>
            </>
          )}
          <button className="md:hidden" onClick={() => setOpen((v) => !v)} aria-label="Menu">
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-ink/5 bg-cream md:hidden">
          <div className="space-y-1 p-4">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === "/" || l.to === "/admin" || l.to === "/vendor"}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `block rounded-xl px-3 py-2.5 text-sm font-medium ${
                    isActive ? "bg-ink text-cream" : "text-ink/70 hover:bg-ink/5"
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}
            {!user && (
              <>
                <Link to="/login" onClick={() => setOpen(false)} className="block rounded-xl px-3 py-2.5 text-sm font-medium">
                  Sign in
                </Link>
                <Link to="/signup" onClick={() => setOpen(false)} className="mt-2 block rounded-xl bg-coral px-3 py-2.5 text-center text-sm font-semibold text-white">
                  Get started
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

export function Footer() {
  return (
    <footer className="relative mt-24 overflow-hidden border-t border-white/8">
      {/* Aurora glow */}
      <div className="pointer-events-none absolute inset-x-0 -top-32 h-64 opacity-30 blur-3xl aurora-bg" />
      <div className="relative mx-auto max-w-7xl px-5 py-14 md:px-8">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl aurora-bg">
                <Sparkles className="h-4 w-4 text-[#0a0a12]" />
              </div>
              <span className="font-display text-2xl tracking-tight">EventConnect<span className="text-coral">.</span>AI</span>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-ink-2">
              The AI-powered event operating system. Plan, book, pay, and track — all in one place.
            </p>
            <div className="mt-4 flex items-center gap-2">
              <span className="chip mono text-[9px]">v2.0 · AURORA</span>
              <span className="chip mono text-[9px]"><span className="h-1.5 w-1.5 rounded-full bg-sage" /> ALL_SYSTEMS_OK</span>
            </div>
          </div>
          <FooterCol
            title="Product"
            items={["AI Planner", "Vendor Matching", "Escrow Wallet", "Installments", "AI Copilot"]}
          />
          <FooterCol
            title="For Vendors"
            items={["List business", "Verification tiers", "Trust score", "Vendor CRM", "Subscriptions"]}
          />
          <FooterCol
            title="Company"
            items={["About", "Trust & Safety", "Dispute policy", "Audit log", "Press"]}
          />
        </div>
        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-white/10 pt-6 md:flex-row md:items-center">
          <p className="mono text-[10px] text-ink-2/70">© 2026 EVENTCONNECT_TECH · ALL_RIGHTS_RESERVED</p>
          <div className="flex gap-5 text-xs text-ink-2">
            <a className="hover:text-coral" href="#">Privacy</a>
            <a className="hover:text-coral" href="#">Terms</a>
            <a className="hover:text-coral" href="#">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <h4 className="mono text-[10px] font-semibold uppercase tracking-[0.22em] text-ink-2/70">{title}</h4>
      <ul className="mt-4 space-y-2.5">
        {items.map((i) => (
          <li key={i}>
            <a href="#" className="text-sm text-ink-2 hover:text-coral">
              {i}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
