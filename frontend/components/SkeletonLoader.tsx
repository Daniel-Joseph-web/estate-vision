import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

/** Placeholder matching the MetricCard footprint in the bento grid. */
export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-neutral-800 bg-neutral-900/70 p-5 backdrop-blur-md",
        className
      )}
    >
      <Skeleton className="h-3 w-24 bg-neutral-800" />
      <Skeleton className="mt-4 h-9 w-20 bg-neutral-800" />
      <Skeleton className="mt-3 h-3 w-32 bg-neutral-800" />
    </div>
  );
}

/** Placeholder rows for list and table surfaces. */
export function SkeletonRows({
  rows = 4,
  className,
}: {
  rows?: number;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "divide-y divide-neutral-800 rounded-2xl border border-neutral-800 bg-neutral-900/70 backdrop-blur-md",
        className
      )}
    >
      {Array.from({ length: rows }, (_, index) => (
        <div key={index} className="flex items-center gap-4 p-4">
          <Skeleton className="h-4 flex-1 bg-neutral-800" />
          <Skeleton className="hidden h-4 w-24 bg-neutral-800 sm:block" />
          <Skeleton className="hidden h-4 w-28 bg-neutral-800 md:block" />
          <Skeleton className="h-8 w-16 bg-neutral-800" />
        </div>
      ))}
    </div>
  );
}

/** Plain stacked lines, for prose-shaped placeholders. */
export function SkeletonText({
  lines = 3,
  className,
}: {
  lines?: number;
  className?: string;
}) {
  return (
    <div className={cn("space-y-2", className)}>
      {Array.from({ length: lines }, (_, index) => (
        <Skeleton
          key={index}
          className={cn(
            "h-3 bg-neutral-800",
            index === lines - 1 ? "w-2/3" : "w-full"
          )}
        />
      ))}
    </div>
  );
}