import type { VideoStatus } from "@/lib/types/event";

/** Bytes → "450 KB", "412.5 MB", "1.2 GB". */
export function formatBytes(bytes: number, decimals = 1): string {
  if (bytes <= 0) return "0 MB";
  
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(decimals))} ${sizes[i]}`;
}

/** Seconds → "31:07" or "1:02:11". */
export function formatDuration(seconds: number): string {
  if (!seconds) return "—";
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  const pad = (n: number) => String(n).padStart(2, "0");
  return hours > 0
    ? `${hours}:${pad(minutes)}:${pad(secs)}`
    : `${minutes}:${pad(secs)}`;
}

/** ISO timestamp → "4 Aug 2026, 18:42" in the viewer's locale. */
export function formatDateTime(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/** Large counts → "94,213". */
export function formatCount(value: number): string {
  return value.toLocaleString();
}

export const STATUS_LABELS: Record<VideoStatus, string> = {
  queued: "Queued",
  processing: "Processing",
  complete: "Complete",
  failed: "Failed",
};