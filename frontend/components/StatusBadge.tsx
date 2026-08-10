import { STATUS_LABELS } from "@/lib/format";
import type { VideoStatus } from "@/lib/types/event";
import { cn } from "@/lib/utils";

const STATUS_STYLES: Record<VideoStatus, string> = {
  queued: "border-slate-700 bg-slate-800/60 text-slate-300",
  processing: "border-[#f59e0b]/40 bg-[#f59e0b]/10 text-[#f59e0b]",
  complete: "border-[#22c55e]/40 bg-[#22c55e]/10 text-[#22c55e]",
  failed: "border-[#ff3333]/40 bg-[#ff3333]/10 text-[#ff3333]",
};

export function StatusBadge({
  status,
  className,
}: {
  status: VideoStatus;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 font-mono text-[0.6875rem] uppercase tracking-[0.08em]",
        STATUS_STYLES[status],
        className
      )}
    >
      {/* Only in-flight work pulses — a finished job shouldn't read as live. */}
      <span
        aria-hidden="true"
        className={cn(
          "size-1.5 rounded-full bg-current",
          status === "processing" && "animate-pulse"
        )}
      />
      {STATUS_LABELS[status]}
    </span>
  );
}