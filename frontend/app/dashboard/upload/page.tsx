"use client";

import { FileVideoIcon, XIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { Dropzone } from "@/components/Dropzone";
import { UploadProgress } from "@/components/UploadProgress";
import { Button } from "@/components/ui/button";
import { formatBytes } from "@/lib/format";
import { useUploadStore } from "@/lib/store/uploadStore";

// Utility to humanize the remaining time
function formatTimeRemaining(seconds: number) {
  if (!seconds || seconds <= 0 || !Number.isFinite(seconds)) return "Calculating...";
  if (seconds < 1) return "Almost done...";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  if (m > 0) return `${m}m ${s}s remaining`;
  return `${s}s remaining`;
}

export default function UploadPage() {
  const router = useRouter();

  const file = useUploadStore((s) => s.file);
  const status = useUploadStore((s) => s.status);
  const progress = useUploadStore((s) => s.progress);
  const error = useUploadStore((s) => s.error);
  const warning = useUploadStore((s) => s.warning);
  const videoId = useUploadStore((s) => s.videoId);
  const selectFile = useUploadStore((s) => s.selectFile);
  const clearFile = useUploadStore((s) => s.clearFile);
  const startUpload = useUploadStore((s) => s.startUpload);
  const cancelUpload = useUploadStore((s) => s.cancelUpload);
  const reset = useUploadStore((s) => s.reset);

  const retryRef = useRef<HTMLButtonElement>(null);
  const toastedError = useRef<string | null>(null);

  // Local state for the video preview and upload analytics
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploadSpeed, setUploadSpeed] = useState<number>(0);
  const [timeRemaining, setTimeRemaining] = useState<number>(0);

  // References to calculate upload speed over time
  const startTimeRef = useRef<number | null>(null);
  const lastBytesRef = useRef<number>(0);
  const lastTimeRef = useRef<number | null>(null);

  // Start clean whenever the page is opened.
  useEffect(() => reset, [reset]);

  // Handle errors
  useEffect(() => {
    if (status !== "error" || !error) {
      if (status !== "error") toastedError.current = null;
      return;
    }
    if (toastedError.current === error) return;

    toastedError.current = error;
    toast.error(error);
    retryRef.current?.focus();
  }, [status, error]);

  // Handle successful handoff
  useEffect(() => {
    if (status === "success" && videoId && !warning) {
      router.replace(`/dashboard/video/${videoId}`);
    }
  }, [status, videoId, warning, router]);

  // Generate and cleanup the local video preview URL
  useEffect(() => {
    if (!file) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(file);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  // Calculate live byte rate and remaining time during upload
  useEffect(() => {
    if (status === "uploading" && file) {
      const now = Date.now();
      const uploadedBytes = (progress / 100) * file.size;

      if (!startTimeRef.current) {
        startTimeRef.current = now;
        lastTimeRef.current = now;
        lastBytesRef.current = uploadedBytes;
        return;
      }

      // Calculate speed over a 500ms window to prevent UI jitter
      const timeDiff = (now - (lastTimeRef.current || now)) / 1000;
      if (timeDiff > 0.5) {
        const bytesDiff = uploadedBytes - lastBytesRef.current;
        const currentSpeed = Math.max(0, bytesDiff / timeDiff); // Bytes per second

        // eslint-disable-next-line react-hooks/set-state-in-effect
        setUploadSpeed(currentSpeed);

        if (currentSpeed > 0) {
          const remainingBytes = file.size - uploadedBytes;
          // eslint-disable-next-line react-hooks/set-state-in-effect
          setTimeRemaining(remainingBytes / currentSpeed);
        }

        lastTimeRef.current = now;
        lastBytesRef.current = uploadedBytes;
      }
    } else {
      // Reset metrics when not actively uploading
      startTimeRef.current = null;
      lastTimeRef.current = null;
      lastBytesRef.current = 0;
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setUploadSpeed(0);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setTimeRemaining(0);
    }
  }, [progress, status, file]);

  const uploading = status === "uploading";
  const failed = status === "error";

  return (
    <div className="mx-auto w-full max-w-2xl">
      <header className="mb-6">
        <p className="ev-label text-neutral-400">Ingestion zone</p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-neutral-50">
          Upload footage
        </h1>
      </header>

      <div className="space-y-4">
        {!file && <Dropzone onFile={selectFile} disabled={uploading} />}

        {previewUrl && (
          <div className="overflow-hidden rounded-2xl border border-neutral-800 bg-black shadow-lg">
            <video
              src={previewUrl}
              controls
              className="aspect-video w-full object-contain"
            />
          </div>
        )}

        {file && (
          <div className="flex items-center gap-4 rounded-2xl border border-neutral-800 bg-neutral-900/70 p-4 backdrop-blur-md">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-neutral-800 bg-neutral-950">
              <FileVideoIcon aria-hidden="true" className="size-4 text-red-500" />
            </span>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-neutral-100">
                {file.name}
              </p>
              <p className="mt-1 font-mono text-xs text-neutral-500">
                {formatBytes(file.size)}
              </p>
            </div>

            <Button
              variant="ghost"
              size="icon"
              aria-label={`Remove ${file.name}`}
              disabled={uploading}
              onClick={clearFile}
            >
              <XIcon />
            </Button>
          </div>
        )}

        {uploading && (
          <div className="space-y-2">
            <UploadProgress value={progress} />
            <div className="flex justify-between font-mono text-xs text-neutral-400">
              <span>{uploadSpeed > 0 ? `${formatBytes(uploadSpeed)}/s` : "Calculating..."}</span>
              <span>{formatTimeRemaining(timeRemaining)}</span>
            </div>
          </div>
        )}

        {status === "success" && !warning && (
          <p role="status" className="text-sm text-red-500">
            Upload complete — opening your video…
          </p>
        )}

        {status === "success" && warning && (
          <>
            <p role="alert" className="text-sm text-[#f59e0b]">
              {warning}
            </p>
            <Button
              size="lg"
              variant="outline"
              className="h-11 px-6 border-neutral-700 text-neutral-200"
              onClick={() => router.replace(`/dashboard/video/${videoId}`)}
            >
              Open the video anyway
            </Button>
          </>
        )}

        {failed && error && (
          <p role="alert" className="text-sm text-[#ff3333]">
            {error}
          </p>
        )}

        <div className="flex flex-wrap gap-3">
          {uploading && (
            <Button
              size="lg"
              variant="outline"
              className="h-11 px-6 border-neutral-700 text-neutral-200"
              onClick={cancelUpload}
            >
              Cancel Upload
            </Button>
          )}

          {!uploading && file && (
            <Button
              ref={retryRef}
              size="lg"
              disabled={status === "success"}
              onClick={() => void startUpload()}
              className="h-11 bg-red-600 px-6 font-semibold text-white hover:bg-red-700"
            >
              {failed ? "Retry" : "Start Upload"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}