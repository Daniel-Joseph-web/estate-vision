"use client";

import { UploadCloudIcon } from "lucide-react";
import { useRef, useState, type DragEvent } from "react";

import { ACCEPTED_EXTENSIONS } from "@/lib/store/uploadStore";
import { cn } from "@/lib/utils";

interface DropzoneProps {
  onFile: (file: File) => void;
  disabled?: boolean;
}

/**
 * Dashed drop target for a single recording. The file input stays visually
 * hidden but keyboard-focusable, and the label is its visible face — so the
 * control is reachable by tab, space and click alike.
 */
export function Dropzone({ onFile, disabled = false }: DropzoneProps) {
  const [dragging, setDragging] = useState(false);
  // Drag events fire on children too; count enters and leaves to stay accurate.
  const dragDepth = useRef(0);

  function handleDragEnter(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    if (disabled) return;
    dragDepth.current += 1;
    setDragging(true);
  }

  function handleDragLeave(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    dragDepth.current = Math.max(0, dragDepth.current - 1);
    if (dragDepth.current === 0) setDragging(false);
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    dragDepth.current = 0;
    setDragging(false);
    if (disabled) return;

    // One recording at a time — extra files are ignored rather than queued.
    const file = event.dataTransfer.files?.[0];
    if (file) onFile(file);
  }

  return (
    <div
      onDragEnter={handleDragEnter}
      onDragOver={(event) => event.preventDefault()}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      aria-disabled={disabled}
      className={cn(
        "flex flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-16 text-center transition-colors",
        dragging
          ? "border-red-500 bg-red-500/5"
          : "border-neutral-800 bg-neutral-900/70 backdrop-blur-md",
        disabled && "opacity-60"
      )}
    >
      <UploadCloudIcon
        aria-hidden="true"
        className={cn(
          "size-8 transition-colors",
          dragging ? "text-red-500" : "text-neutral-500"
        )}
      />

      <p className="mt-4 text-sm text-neutral-300">
        Drag a recording here, or pick one from your computer
      </p>
      <p className="ev-label mt-2 text-neutral-500">MP4 · MOV · AVI — up to 500 MB</p>

      <input
        id="ev-file-input"
        type="file"
        className="peer sr-only"
        accept={[...ACCEPTED_EXTENSIONS, "video/*"].join(",")}
        disabled={disabled}
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) onFile(file);
          // Reset so re-picking the same file after a Remove still fires change.
          event.target.value = "";
        }}
      />
      <label
        htmlFor="ev-file-input"
        className={cn(
          "mt-6 inline-flex h-10 cursor-pointer items-center rounded-lg bg-red-600 px-5 text-sm font-semibold text-white transition-colors hover:bg-red-700",
          "peer-focus-visible:ring-2 peer-focus-visible:ring-red-500/70 peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-[#0A0A0A]",
          disabled && "pointer-events-none"
        )}
      >
        Browse Files
      </label>
    </div>
  );
}