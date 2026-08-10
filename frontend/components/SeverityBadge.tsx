import type { EventSeverity } from "@/lib/types/event";
import { cn } from "@/lib/utils";

const SEVERITY_STYLES: Record<EventSeverity, string> = {
  safe: "border-[#00f0ff]/40 bg-[#00f0ff]/10 text-[#00f0ff]",
  warning: "border-[#f59e0b]/40 bg-[#f59e0b]/10 text-[#f59e0b]",
  threat: "border-[#ff3333]/40 bg-[#ff3333]/10 text-[#ff3333]",
};

export const SEVERITY_LABELS: Record<EventSeverity, string> = {
  safe: "Safe",
  warning: "Warning",
  threat: "Threat",
};

/** Marker colour for the timeline, keyed to the same palette. */
export const SEVERITY_DOT: Record<EventSeverity, string> = {
  safe: "bg-[#00f0ff]",
  warning: "bg-[#f59e0b]",
  threat: "bg-[#ff3333]",
};

export function SeverityBadge({
  severity,
  className,
}: {
  severity: EventSeverity;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 font-mono text-[0.6875rem] uppercase tracking-[0.08em]",
        SEVERITY_STYLES[severity],
        className
      )}
    >
      <span aria-hidden="true" className="size-1.5 rounded-full bg-current" />
      {SEVERITY_LABELS[severity]}
    </span>
  );
}
