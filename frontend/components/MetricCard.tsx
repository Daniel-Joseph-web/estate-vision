import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface MetricCardProps {
  label: string;
  /** Rendered large and monospaced. */
  value: string;
  /** Optional secondary line under the value. */
  hint?: string;
  /** Adds the red glow + corner bracket. Reserve for genuinely critical figures. */
  critical?: boolean;
  children?: ReactNode;
  className?: string;
}

/**
 * Pure data display. Deliberately has no hover, cursor or focus affordance —
 * a MetricCard must never look clickable.
 */
export function MetricCard({
  label,
  value,
  hint,
  critical = false,
  children,
  className,
}: MetricCardProps) {
  return (
    <div
      className={cn(
        "relative rounded-2xl border border-slate-800 bg-slate-900/70 p-5 backdrop-blur-md",
        critical && "ev-bracket shadow-[0_0_15px_rgba(239,68,68,0.3)]",
        className
      )}
    >
      <p className="ev-label">{label}</p>
      <p
        className={cn(
          "mt-3 font-mono text-3xl font-semibold tabular-nums",
          critical ? "text-[#ef4444]" : "text-slate-50"
        )}
      >
        {value}
      </p>
      {hint && <p className="mt-2 text-xs text-slate-400">{hint}</p>}
      {children}
    </div>
  );
}