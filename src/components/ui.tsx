import { type ReactNode } from "react";
import { cn } from "../utils/cn";

export function Section({
  children,
  className,
  id,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <section id={id} className={cn("mx-auto max-w-7xl px-5 md:px-8", className)}>
      {children}
    </section>
  );
}

export function Badge({
  children,
  variant = "neutral",
  className,
}: {
  children: ReactNode;
  variant?: "neutral" | "primary" | "success" | "warning" | "error" | "coral" | "sage" | "amber" | "ink" | "aurora";
  className?: string;
}) {
  // Map old variant names to new ones
  const variantMap: Record<string, string> = {
    coral: "primary",
    sage: "success",
    amber: "warning",
    ink: "neutral",
    aurora: "primary",
  };
  const resolvedVariant = variantMap[variant] || variant;
  
  const variants: Record<string, string> = {
    neutral: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
    primary: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400",
    success: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
    warning: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
    error: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
        variants[resolvedVariant],
        className
      )}
    >
      {children}
    </span>
  );
}

export function Card({
  children,
  className,
  ...rest
}: React.HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      {...rest}
      className={cn(
        "rounded-xl border border-slate-200 bg-white shadow-subtle",
        "dark:border-slate-800 dark:bg-slate-900",
        className
      )}
    >
      {children}
    </div>
  );
}

export function GlassCard({
  children,
  className,
  ...rest
}: React.HTMLAttributes<HTMLDivElement> & { children: ReactNode; className?: string }) {
  return (
    <div
      {...rest}
      className={cn(
        "rounded-xl border border-slate-200/60 bg-white/60 backdrop-blur-xl",
        "dark:border-slate-800/60 dark:bg-slate-900/60",
        className
      )}
    >
      {children}
    </div>
  );
}

export function Button({
  children,
  variant = "primary",
  size = "md",
  className,
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "outline" | "dark" | "aurora";
  size?: "sm" | "md" | "lg";
}) {
  const sizes: Record<string, string> = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-2.5 text-base",
  };
  // Map old variants
  const variantMap: Record<string, string> = {
    aurora: "primary",
    dark: "secondary",
  };
  const resolvedVariant = variantMap[variant] || variant;
  
  const variants: Record<string, string> = {
    primary:
      "bg-indigo-600 text-white hover:bg-indigo-700 focus-ring",
    secondary:
      "bg-slate-100 text-slate-900 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700",
    ghost:
      "bg-transparent text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800",
    outline:
      "border border-slate-300 text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800",
  };
  return (
    <button
      {...rest}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-fast",
        sizes[size],
        variants[resolvedVariant],
        className
      )}
    >
      {children}
    </button>
  );
}

export function Stat({
  label,
  value,
  hint,
  accent = "default",
}: {
  label: string;
  value: ReactNode;
  hint?: string;
  accent?: "default" | "primary" | "success" | "warning" | "ink" | "coral" | "sage" | "amber";
}) {
  // Map old accent names
  const accentMap: Record<string, string> = {
    ink: "default",
    coral: "primary",
    sage: "success",
    amber: "warning",
  };
  const resolvedAccent = accentMap[accent] || accent;
  
  const colors: Record<string, string> = {
    default: "text-slate-900 dark:text-slate-100",
    primary: "text-indigo-600 dark:text-indigo-400",
    success: "text-emerald-600 dark:text-emerald-400",
    warning: "text-amber-600 dark:text-amber-400",
  };
  return (
    <div>
      <div className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">{label}</div>
      <div className={cn("mt-1 font-semibold text-2xl tabular md:text-3xl", colors[resolvedAccent])}>{value}</div>
      {hint && <div className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">{hint}</div>}
    </div>
  );
}
