import type { Role } from "../context/AuthContext";

// Production-style RBAC matrix.
// Used to gate routes, buttons, and admin actions.

export type Permission =
  | "event:create"
  | "event:read"
  | "vendor:browse"
  | "vendor:edit"
  | "booking:create"
  | "booking:respond"
  | "escrow:release"
  | "messages:send"
  | "review:write"
  | "admin:users"
  | "admin:disputes"
  | "admin:analytics"
  | "audit:read";

const matrix: Record<Role, Permission[]> = {
  client: [
    "event:create",
    "event:read",
    "vendor:browse",
    "booking:create",
    "escrow:release",
    "messages:send",
    "review:write",
  ],
  vendor: ["vendor:edit", "vendor:browse", "booking:respond", "messages:send"],
  planner: [
    "event:create",
    "event:read",
    "vendor:browse",
    "booking:create",
    "messages:send",
    "review:write",
  ],
  admin: [
    "event:read",
    "vendor:browse",
    "vendor:edit",
    "admin:users",
    "admin:disputes",
    "admin:analytics",
    "audit:read",
    "escrow:release",
  ],
};

export function can(role: Role | undefined, perm: Permission): boolean {
  if (!role) return false;
  return matrix[role].includes(perm);
}
