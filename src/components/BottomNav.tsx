import { NavLink, useLocation } from "react-router-dom";
import { Home, Sparkles, MessageCircle, Wallet, LayoutDashboard } from "lucide-react";
import { useApp } from "../context/AppContext";

const items = [
  { to: "/", label: "Home", icon: Home, end: true },
  { to: "/matching", label: "Match", icon: Sparkles, end: false },
  { to: "/messages", label: "Chat", icon: MessageCircle, end: false, badgeKey: "messages" as const },
  { to: "/escrow", label: "Wallet", icon: Wallet, end: false },
  { to: "/dashboard", label: "Me", icon: LayoutDashboard, end: false },
];

export function BottomNav() {
  const { conversations } = useApp();
  const messagesBadge = conversations.reduce((s, c) => s + c.unread, 0);
  const location = useLocation();

  // Hide on auth/onboarding routes
  const hidden = ["/login", "/signup", "/forgot-password"].includes(location.pathname);
  if (hidden) return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-white/8 bg-cream/85 backdrop-blur-2xl md:hidden"
         style={{ paddingBottom: "env(safe-area-inset-bottom)" }}>
      <div className="grid grid-cols-5">
        {items.map(({ to, label, icon: Icon, end, badgeKey }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `relative flex flex-col items-center gap-0.5 py-2.5 text-[10px] font-semibold transition ${
                isActive ? "text-coral" : "text-ink-2"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <span className="relative">
                  <Icon className={`h-5 w-5 ${isActive ? "stroke-[2.4]" : ""}`} />
                  {badgeKey === "messages" && messagesBadge > 0 && (
                    <span className="absolute -top-1 -right-2 flex h-3.5 min-w-3.5 items-center justify-center rounded-full aurora-bg px-1 text-[8px] font-bold text-[#0a0a12]">
                      {messagesBadge}
                    </span>
                  )}
                </span>
                {label}
                {isActive && <span className="absolute -bottom-px h-0.5 w-8 rounded-full aurora-bg" />}
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
