import { createContext, useContext, useState, type ReactNode } from "react";

export type Role = "client" | "vendor" | "planner" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar: string;
  verifiedLevel: number;
  joined: string;
}

const mockUsers: Record<Role, User> = {
  client: {
    id: "u-client-01",
    name: "Adaeze Okonkwo",
    email: "adaeze@eventconnect.app",
    role: "client",
    avatar: "AO",
    verifiedLevel: 2,
    joined: "Mar 2025",
  },
  vendor: {
    id: "u-vendor-01",
    name: "Ronke Adeyemi",
    email: "ronke@glowbyronke.com",
    role: "vendor",
    avatar: "RA",
    verifiedLevel: 3,
    joined: "Jan 2024",
  },
  planner: {
    id: "u-planner-01",
    name: "Platinum Event Co.",
    email: "team@platinum.co",
    role: "planner",
    avatar: "PE",
    verifiedLevel: 4,
    joined: "Nov 2022",
  },
  admin: {
    id: "u-admin-01",
    name: "Platform Admin",
    email: "admin@eventconnect.app",
    role: "admin",
    avatar: "PA",
    verifiedLevel: 4,
    joined: "Jan 2023",
  },
};

interface AuthContextValue {
  user: User | null;
  login: (role: Role) => void;
  logout: () => void;
  switchRole: (role: Role) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = (role: Role) => setUser(mockUsers[role]);
  const logout = () => setUser(null);
  const switchRole = (role: Role) => setUser(mockUsers[role]);

  return (
    <AuthContext.Provider value={{ user, login, logout, switchRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
