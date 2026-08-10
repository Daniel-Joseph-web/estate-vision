import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  /** Usually a single primary Button. */
  action?: ReactNode;
  className?: string;
}

/** Shared "nothing here yet" panel for videos, events and reports. */
export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-800 bg-slate-900/70 px-6 py-16 text-center backdrop-blur-md",
        className
      )}
    >
      {Icon && (
        <span className="mb-4 flex size-12 items-center justify-center rounded-full border border-slate-800 bg-slate-900">
          <Icon aria-hidden="true" className="size-5 text-[#00f0ff]" />
        </span>
      )}
      <h2 className="text-base font-semibold text-slate-50">{title}</h2>
      <p className="mt-2 max-w-sm text-sm text-slate-400">{description}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
