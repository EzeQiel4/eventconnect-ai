// Production-style "database" simulator.
// In production, swap this for fetch() calls to your Express/MongoDB API.
// All data persists in localStorage and emits change events for live UI.

const PREFIX = "ec2_";

export const db = {
  get<T>(key: string, fallback: T): T {
    try {
      const raw = localStorage.getItem(PREFIX + key);
      if (!raw) return fallback;
      return JSON.parse(raw) as T;
    } catch {
      return fallback;
    }
  },
  set<T>(key: string, value: T) {
    try {
      localStorage.setItem(PREFIX + key, JSON.stringify(value));
    } catch {
      // localStorage full or disabled — ignore
    }
  },
  remove(key: string) {
    localStorage.removeItem(PREFIX + key);
  },
  clear() {
    Object.keys(localStorage)
      .filter((k) => k.startsWith(PREFIX))
      .forEach((k) => localStorage.removeItem(k));
  },
};

// Audit log — every state change writes an entry, viewable in admin
export interface AuditEntry {
  id: string;
  ts: number;
  actor: string;
  action: string;
  entity: string;
  details?: string;
}

export const audit = {
  log(entry: Omit<AuditEntry, "id" | "ts">) {
    const list = db.get<AuditEntry[]>("audit", []);
    const entries = [{ ...entry, id: `a${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, ts: Date.now() }, ...list].slice(0, 500);
    db.set("audit", entries);
    window.dispatchEvent(new CustomEvent("audit:update"));
  },
  list(): AuditEntry[] {
    return db.get<AuditEntry[]>("audit", []);
  },
  clear() {
    db.set("audit", []);
    window.dispatchEvent(new CustomEvent("audit:update"));
  },
};

// Rate-limit helper — tracks calls per key in memory
const calls = new Map<string, number[]>();
export function rateLimit(key: string, maxPerMinute = 30): boolean {
  const now = Date.now();
  const list = (calls.get(key) ?? []).filter((t) => now - t < 60_000);
  if (list.length >= maxPerMinute) return false;
  list.push(now);
  calls.set(key, list);
  return true;
}
