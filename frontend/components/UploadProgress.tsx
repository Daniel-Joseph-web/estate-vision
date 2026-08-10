"use client";

import {
  Progress,
  ProgressLabel,
  ProgressValue,
} from "@/components/ui/progress";

/** Transfer bar shown while a file is being PUT to storage. */
export function UploadProgress({ value }: { value: number }) {
  return (
    <div className="rounded-2xl border border-neutral-800 bg-neutral-900/70 p-5 backdrop-blur-md">
      <Progress
        value={value}
        className="gap-2"
        aria-label="Upload progress"
      >
        <ProgressLabel className="flex items-center gap-2 text-xs text-neutral-300">
          <span
            aria-hidden="true"
            className="size-1.5 animate-pulse rounded-full bg-red-500"
          />
          Uploading
        </ProgressLabel>
        <ProgressValue className="font-mono text-xs tabular-nums text-neutral-400" />
      </Progress>
    </div>
  );
}