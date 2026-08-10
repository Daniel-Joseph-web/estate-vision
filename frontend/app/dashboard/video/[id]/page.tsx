"use client";

import { AlertTriangleIcon, ArrowLeftIcon, Trash2Icon, Loader2Icon, RefreshCwIcon, SearchIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { use, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";

import { EmptyState } from "@/components/EmptyState";
import { EventTable } from "@/components/EventTable";
import { EventTimeline } from "@/components/EventTimeline";
import { SkeletonRows } from "@/components/SkeletonLoader";
import { StatusBadge } from "@/components/StatusBadge";
import { VideoPlayer } from "@/components/VideoPlayer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { getPlaybackUrl } from "@/app/actions/get-playback-url";
import { getIdToken } from "@/lib/firebase/client";
import { formatBytes, formatDateTime, formatDuration } from "@/lib/format";
import { useUiStore } from "@/lib/store/uiStore";
import {
  filterEvents,
  useVideoDetailStore,
} from "@/lib/store/videoDetailStore";
import type { EventSeverity } from "@/lib/types/event";
import { cn } from "@/lib/utils";

export default function VideoDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();

  const video = useVideoDetailStore((s) => s.video);
  const loading = useVideoDetailStore((s) => s.loading);
  const error = useVideoDetailStore((s) => s.error);
  const flaggedIds = useVideoDetailStore((s) => s.flaggedIds);
  const severityFilter = useVideoDetailStore((s) => s.severityFilter);
  const classFilter = useVideoDetailStore((s) => s.classFilter);
  const flaggedOnly = useVideoDetailStore((s) => s.flaggedOnly);
  const searchQuery = useVideoDetailStore((s) => s.searchQuery);
  const setSeverityFilter = useVideoDetailStore((s) => s.setSeverityFilter);
  const setClassFilter = useVideoDetailStore((s) => s.setClassFilter);
  const setFlaggedOnly = useVideoDetailStore((s) => s.setFlaggedOnly);
  const setSearchQuery = useVideoDetailStore((s) => s.setSearchQuery);
  const clearFilters = useVideoDetailStore((s) => s.clearFilters);
  const toggleFlag = useVideoDetailStore((s) => s.toggleFlag);
  const removeVideo = useVideoDetailStore((s) => s.removeVideo);
  const retryProcessing = useVideoDetailStore((s) => s.retryProcessing);
  const retrying = useVideoDetailStore((s) => s.retrying);
  const load = useVideoDetailStore((s) => s.load);
  const reset = useVideoDetailStore((s) => s.reset);

  const allEvents = useVideoDetailStore((s) => s.events);

  const visibleEvents = useMemo(
    () =>
      filterEvents({
        events: allEvents,
        severityFilter,
        classFilter,
        flaggedOnly,
        flaggedIds,
        searchQuery,
      }),
    [allEvents, severityFilter, classFilter, flaggedOnly, flaggedIds, searchQuery]
  );

  const requestConfirmation = useUiStore((s) => s.requestConfirmation);

  const videoRef = useRef<HTMLVideoElement>(null);
  const [playbackUrl, setPlaybackUrl] = useState<string | null>(null);

  useEffect(() => {
    void load(id);
    return reset;
  }, [id, load, reset]);

  useEffect(() => {
    if (!video?.storage_key) return;
    let cancelled = false;

    getIdToken()
      .then((idToken) =>
        getPlaybackUrl({ idToken: idToken ?? "", storageKey: video.storage_key })
      )
      .then((result) => {
        if (!cancelled && result.ok) setPlaybackUrl(result.url);
      })
      .catch(() => {
        /* The player already renders a "preview unavailable" state. */
      });

    return () => {
      cancelled = true;
    };
  }, [video?.storage_key]);

  const objectClasses = useMemo(
    () => [...new Set(allEvents.map((event) => event.object_class))].sort(),
    [allEvents]
  );

  const processing = video?.status === "processing" || video?.status === "queued";
  const filtersActive =
    severityFilter !== "all" || classFilter !== "all" || flaggedOnly || searchQuery.length > 0;

  function seek(seconds: number) {
    const element = videoRef.current;
    if (!element) return;
    element.currentTime = seconds;
    void element.play().catch(() => {
      /* Autoplay can be blocked; the seek still landed. */
    });
  }

  function confirmDelete() {
    if (!video) return;

    requestConfirmation({
      title: "Delete this video?",
      description: `"${video.name}" and its ${allEvents.length} detection${allEvents.length === 1 ? "" : "s"} will be removed permanently. This can't be undone.`,
      confirmLabel: "Delete Video",
      destructive: true,
      onConfirm: async () => {
        try {
          await removeVideo(video.id);
          toast.success("Video deleted");
          router.push("/dashboard");
        } catch (caught) {
          toast.error(
            caught instanceof Error
              ? caught.message
              : "We couldn't delete this video."
          );
          throw caught;
        }
      },
    });
  }

  if (loading) return <LoadingView />;

  if (error || !video) {
    return (
      <div className="mx-auto w-full max-w-5xl">
        <BackLink />
        <div
          role="alert"
          className="mt-6 flex flex-col items-center rounded-2xl border border-[#ff3333]/30 bg-neutral-900/70 px-6 py-14 text-center backdrop-blur-md"
        >
          <AlertTriangleIcon aria-hidden="true" className="size-6 text-[#ff3333]" />
          <h2 className="mt-4 text-base font-semibold text-neutral-50">
            We couldn&apos;t open this video
          </h2>
          <p className="mt-2 max-w-sm text-sm text-neutral-400">
            {error ?? "That video isn't in your library."}
          </p>
          <Button
            size="lg"
            variant="outline"
            className="mt-6 border-neutral-700 text-neutral-200 hover:bg-neutral-800"
            onClick={() => void load(id)}
          >
            Try again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6">
      <div>
        <BackLink />

        <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <h1 className="truncate text-2xl font-semibold tracking-tight text-neutral-50">
              {video.name}
            </h1>
            <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-2">
              <StatusBadge status={video.status} />
              <span className="font-mono text-xs text-neutral-500">
                {formatDateTime(video.created_at)} · {formatBytes(video.size_bytes)}
                {video.duration_seconds > 0 &&
                  ` · ${formatDuration(video.duration_seconds)}`}
              </span>
            </div>
          </div>

          <Button
            variant="destructive"
            size="lg"
            disabled={processing}
            onClick={confirmDelete}
          >
            <Trash2Icon aria-hidden="true" />
            Delete Video
          </Button>
        </div>
      </div>

      {video.status === "failed" && video.error_message && (
        <div
          role="alert"
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-[#ff3333]/30 bg-neutral-900/70 p-5 backdrop-blur-md"
        >
          <div>
            <p className="ev-label text-[#ff3333]">Processing failed</p>
            <p className="mt-2 text-sm text-neutral-300">{video.error_message}</p>
          </div>
          <Button
            variant="outline"
            disabled={retrying || processing}
            onClick={async () => {
              try {
                await retryProcessing(video.id);
                toast.success("Analysis restarted");
              } catch (caught) {
                toast.error(
                  caught instanceof Error
                    ? caught.message
                    : "We couldn't restart the analysis."
                );
              }
            }}
            className="shrink-0 border-neutral-700 text-neutral-200 hover:bg-neutral-800"
          >
            {retrying ? (
              <Loader2Icon aria-hidden="true" className="animate-spin size-4" />
            ) : (
              <RefreshCwIcon aria-hidden="true" className="size-4" />
            )}
            Retry Analysis
          </Button>
        </div>
      )}

      <VideoPlayer
        src={playbackUrl}
        poster={video.thumbnail_url}
        videoRef={videoRef}
      />

      <div className="relative">
        <EventTimeline
          events={visibleEvents}
          durationSeconds={video.duration_seconds}
          onSeek={seek}
          disabled={processing}
        />
        {processing && <ProcessingOverlay />}
      </div>

      <section className="relative">
        <div className="mb-3 flex flex-wrap items-end justify-between gap-3">
          <h2 className="text-sm font-semibold text-neutral-200">Detections</h2>
          <span className="ev-label">
            {visibleEvents.length} of {allEvents.length}
          </span>
        </div>

        <div className="mb-4 flex flex-wrap items-center gap-3 rounded-2xl border border-neutral-800 bg-neutral-900/70 p-4 backdrop-blur-md">
          
          <div className="relative flex-1 min-w-[200px]">
            <SearchIcon aria-hidden="true" className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-neutral-500" />
            <Input
              placeholder="Search events or subjects..."
              value={searchQuery}
              disabled={processing}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 border-neutral-800 bg-neutral-950/60 focus-visible:ring-red-500/40 focus-visible:border-red-500/60"
            />
          </div>

          <FilterSelect
            label="Severity"
            value={severityFilter}
            disabled={processing}
            onChange={(value) =>
              setSeverityFilter(value as EventSeverity | "all")
            }
            options={[
              { value: "all", label: "All severities" },
              { value: "safe", label: "Safe" },
              { value: "warning", label: "Warning" },
              { value: "threat", label: "Threat" },
            ]}
          />

          <FilterSelect
            label="Class"
            value={classFilter}
            disabled={processing || objectClasses.length === 0}
            onChange={setClassFilter}
            options={[
              { value: "all", label: "All classes" },
              ...objectClasses.map((value) => ({ value, label: value })),
            ]}
          />

          <label
            className={cn(
              "flex items-center gap-2 text-xs text-neutral-300",
              processing && "opacity-50"
            )}
          >
            <input
              type="checkbox"
              checked={flaggedOnly}
              disabled={processing}
              onChange={(event) => setFlaggedOnly(event.target.checked)}
              className="size-4 rounded border-neutral-700 bg-neutral-950 accent-red-500"
            />
            Flagged only
          </label>

          <Button
            variant="ghost"
            size="sm"
            className="ml-auto text-neutral-300 hover:text-neutral-50 hover:bg-neutral-800"
            disabled={!filtersActive || processing}
            onClick={clearFilters}
          >
            Clear filters
          </Button>
        </div>

        {allEvents.length === 0 ? (
          <EmptyState
            title={processing ? "Analysis in progress" : "No detections"}
            description={
              processing
                ? "We're working through this recording. Detections appear here as soon as it finishes."
                : "This recording finished processing without any detections."
            }
          />
        ) : visibleEvents.length === 0 ? (
          <EmptyState
            title="No matching detections"
            description="No detection matches the filters you've applied. Clear them to see the full list."
            action={
              <Button variant="outline" size="lg" onClick={clearFilters} className="border-neutral-700 text-neutral-200 hover:bg-neutral-800">
                Clear filters
              </Button>
            }
          />
        ) : (
          <EventTable
            events={visibleEvents}
            flaggedIds={flaggedIds}
            onSeek={seek}
            onToggleFlag={toggleFlag}
            disabled={processing}
          />
        )}

        {processing && <ProcessingOverlay />}
      </section>
    </div>
  );
}

function BackLink() {
  return (
    <Link
      href="/dashboard"
      className="inline-flex items-center gap-2 rounded-md text-sm text-neutral-400 transition-colors hover:text-neutral-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-500"
    >
      <ArrowLeftIcon aria-hidden="true" className="size-4" />
      Back to dashboard
    </Link>
  );
}

function ProcessingOverlay() {
  return (
    <div className="absolute inset-0 z-10 flex items-center justify-center rounded-2xl bg-[#0A0A0A]/60 backdrop-blur-[2px]">
      <p className="flex items-center gap-2 rounded-full border border-neutral-800 bg-neutral-900/90 px-4 py-2 text-xs text-neutral-300 shadow-sm">
        <span
          aria-hidden="true"
          className="size-1.5 animate-pulse rounded-full bg-[#f59e0b]"
        />
        Analysing footage…
      </p>
    </div>
  );
}

function FilterSelect({
  label,
  value,
  options,
  disabled,
  onChange,
}: {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  disabled?: boolean;
  onChange: (value: string) => void;
}) {
  return (
    <label className="flex items-center gap-2">
      <span className="ev-label">{label}</span>
      <select
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
        className="h-8 rounded-lg border border-neutral-800 bg-neutral-950/60 px-2 text-xs text-neutral-200 outline-none focus-visible:border-red-500/60 focus-visible:ring-2 focus-visible:ring-red-500/40 disabled:opacity-50"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function LoadingView() {
  return (
    <div className="mx-auto w-full max-w-5xl space-y-6">
      <BackLink />
      <Skeleton className="h-8 w-64 bg-neutral-800" />
      <Skeleton className="aspect-video w-full rounded-2xl bg-neutral-800" />
      <SkeletonRows rows={5} />
    </div>
  );
}