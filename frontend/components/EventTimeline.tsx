"use client";

import { formatDuration } from "@/lib/format";
import type { DetectionEvent } from "@/lib/types/event";
import { cn } from "@/lib/utils";

interface EventTimelineProps {
  events: DetectionEvent[];
  durationSeconds: number;
  onSeek: (seconds: number) => void;
  disabled?: boolean;
}

export function EventTimeline({
  events,
  durationSeconds,
  onSeek,
  disabled = false,
}: EventTimelineProps) {
  // Deduplicate events that happen at the exact same second so the dots don't overlap awkwardly
  const uniqueSeconds = Array.from(
    new Set(events.map((e) => e.timestamp_seconds))
  );

  return (
    <div className="flex w-full flex-col justify-between overflow-hidden rounded-2xl border border-white/5 bg-black/20 p-6 backdrop-blur-xl shadow-2xl">
      <div className="mb-6 flex items-center justify-between text-xs font-semibold tracking-widest text-neutral-500 uppercase">
        <span>Timeline</span>
        <span className="font-mono">{formatDuration(durationSeconds)}</span>
      </div>

      <div className="relative h-1.5 w-full rounded-full bg-neutral-800/60">
        {/* The event dots */}
        {uniqueSeconds.map((seconds) => {
          // Prevent division by zero or dots flowing outside the bounding box
          const safeDuration = Math.max(durationSeconds, 1);
          const leftPercent = Math.min((seconds / safeDuration) * 100, 100);

          return (
            <button
              key={seconds}
              type="button"
              disabled={disabled}
              onClick={() => onSeek(seconds)}
              className={cn(
                "absolute top-1/2 -translate-x-1/2 -translate-y-1/2",
                "size-3.5 rounded-full border-2 border-neutral-950 bg-red-500",
                "shadow-[0_0_12px_rgba(239,68,68,0.7)] transition-all duration-200 ease-out",
                "hover:scale-150 hover:bg-red-400 hover:shadow-[0_0_20px_rgba(239,68,68,1)]",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950",
                disabled && "cursor-not-allowed opacity-50 grayscale"
              )}
              style={{ left: `${leftPercent}%` }}
              aria-label={`Seek to ${formatDuration(seconds)}`}
              title={`Jump to ${formatDuration(seconds)}`}
            />
          );
        })}
      </div>
    </div>
  );
}