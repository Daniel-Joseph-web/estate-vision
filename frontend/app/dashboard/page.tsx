"use client";

import { AlertTriangleIcon, ChevronRightIcon, Trash2Icon, VideoIcon, SearchIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

import { deleteVideo } from "@/app/actions/delete-video";
import { EmptyState } from "@/components/EmptyState";
import { MetricCard } from "@/components/MetricCard";
import { SkeletonCard, SkeletonRows } from "@/components/SkeletonLoader";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { fetchDashboardSummary, toUserMessage } from "@/lib/api/client";
import { getIdToken } from "@/lib/firebase/client";
import { formatCount, formatDateTime } from "@/lib/format";
import { useUiStore } from "@/lib/store/uiStore";
import type { DashboardSummary, Video } from "@/lib/types/event";

export default function DashboardPage() {
  const router = useRouter();

  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let cancelled = false;

    fetchDashboardSummary()
      .then((data) => {
        if (cancelled) return;
        setSummary(data);
        setError(null);
      })
      .catch((caught: unknown) => {
        if (cancelled) return;
        setSummary(null);
        setError(toUserMessage(caught, "We couldn't load your dashboard."));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [attempt]);

  const retry = useCallback(() => {
    setLoading(true);
    setError(null);
    setAttempt((value) => value + 1);
  }, []);

  const backgroundRefresh = useCallback(() => {
    setAttempt((value) => value + 1);
  }, []);

  return (
    <div className="mx-auto w-full max-w-6xl">
      <header className="mb-8">
        <p className="ev-label text-neutral-400">Executive summary</p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-neutral-50">
          Dashboard
        </h1>
      </header>

      {loading && <LoadingView />}

      {!loading && error && <ErrorView message={error} onRetry={retry} />}

      {!loading && !error && summary && summary.total_videos === 0 && (
        <EmptyState
          icon={VideoIcon}
          title="No footage yet"
          description="Upload your first recording and EstateVision will turn it into a searchable, exportable event log."
          action={
            <Button
              size="lg"
              onClick={() => router.push("/dashboard/upload")}
              className="h-11 bg-red-600 px-6 font-semibold text-white hover:bg-red-700"
            >
              Upload Your First Video
            </Button>
          }
        />
      )}

      {!loading && !error && summary && summary.total_videos > 0 && (
        <PopulatedView summary={summary} onRefresh={backgroundRefresh} />
      )}
    </div>
  );
}

function LoadingView() {
  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-1">
        <SkeletonCard />
      </div>
      <SkeletonRows rows={4} />
    </div>
  );
}

function ErrorView({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <div
      role="alert"
      className="flex flex-col items-center rounded-2xl border border-[#ff3333]/30 bg-neutral-900/40 px-6 py-14 text-center"
    >
      <AlertTriangleIcon aria-hidden="true" className="size-6 text-[#ff3333]" />
      <h2 className="mt-4 text-base font-semibold text-neutral-50">
        We couldn&apos;t load your dashboard
      </h2>
      <p className="mt-2 max-w-sm text-sm text-neutral-400">{message}</p>
      <Button size="lg" variant="outline" className="mt-6" onClick={onRetry}>
        Try again
      </Button>
    </div>
  );
}

function PopulatedView({ 
  summary, 
  onRefresh 
}: { 
  summary: DashboardSummary;
  onRefresh: () => void;
}) {
  const requestConfirmation = useUiStore((s) => s.requestConfirmation);
  const [hiddenIds, setHiddenIds] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");

  const visibleUploads = summary.recent_uploads
    .filter((v) => !hiddenIds.has(v.id))
    .filter((v) => v.name.toLowerCase().includes(searchQuery.toLowerCase()));

  const optimisticTotalVideos = Math.max(0, summary.total_videos - hiddenIds.size);

  function confirmDelete(video: Video) {
    requestConfirmation({
      title: "Delete this video?",
      description: `"${video.name}" and all its detections will be removed permanently. This can't be undone.`,
      confirmLabel: "Delete Video",
      destructive: true,
      onConfirm: () => {
        setHiddenIds((prev) => new Set(prev).add(video.id));
        toast.success("Video deleted");

        (async () => {
          try {
            const idToken = await getIdToken();
            if (!idToken) throw new Error("Please sign in again.");

            const result = await deleteVideo({ idToken, videoId: video.id });
            if (!result.ok) {
              throw new Error(result.message);
            }

            onRefresh(); 
          } catch (caught) {
            setHiddenIds((prev) => {
              const next = new Set(prev);
              next.delete(video.id);
              return next;
            });
            toast.error(
              caught instanceof Error
                ? caught.message
                : "We couldn't delete this video."
            );
          }
        })();
      },
    });
  }

  return (
    <div className="space-y-10">
      <div className="grid items-start gap-4 sm:grid-cols-1">
        <MetricCard
          label="Videos processed"
          value={formatCount(optimisticTotalVideos)}
          hint="Across your whole portfolio"
          className="bg-neutral-900/70 border-neutral-800"
        />
      </div>

      <section>
        <div className="mb-4 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h2 className="text-sm font-semibold text-neutral-200">Video Library</h2>
            <span className="ev-label text-neutral-400 mt-1 block">
              {formatCount(visibleUploads.length)} shown
            </span>
          </div>

          <div className="relative w-full sm:max-w-xs">
            <SearchIcon aria-hidden="true" className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-neutral-500" />
            <Input
              placeholder="Search videos by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 border-neutral-800 bg-neutral-900/70 focus-visible:ring-red-500/40 focus-visible:border-red-500/60"
            />
          </div>
        </div>

        {visibleUploads.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-neutral-800 bg-neutral-900/40 py-12 text-center">
            <SearchIcon className="size-8 text-neutral-600 mb-2" />
            <p className="text-sm text-neutral-400">No videos match your search.</p>
          </div>
        ) : (
          <ul className="divide-y divide-neutral-800/80 overflow-hidden rounded-2xl border border-neutral-800/80 bg-neutral-900/40">
            {visibleUploads.map((video) => (
              <li 
                key={video.id} 
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 transition-colors hover:bg-neutral-800/40"
              >
                <div className="min-w-0 flex-1">
                  <Link
                    href={`/dashboard/video/${video.id}`}
                    className="hover:underline focus-visible:outline-none focus-visible:underline"
                  >
                    <p className="truncate text-sm font-medium text-neutral-100">
                      {video.name}
                    </p>
                  </Link>
                  <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1.5">
                    <StatusBadge status={video.status} />
                    <span className="font-mono text-xs text-neutral-500">
                      {formatDateTime(video.created_at)}
                    </span>
                  </div>
                </div>

                <div className="flex shrink-0 items-center gap-2 self-end sm:self-auto">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => confirmDelete(video)}
                    className="h-8 w-8 text-neutral-500 transition-colors hover:bg-[#ff3333]/10 hover:text-[#ff3333]"
                    aria-label={`Delete ${video.name}`}
                  >
                    <Trash2Icon className="size-4" />
                  </Button>
                  
                  <Link
                    href={`/dashboard/video/${video.id}`}
                    className="inline-flex h-8 shrink-0 items-center gap-1 rounded-lg border border-neutral-700 px-3 text-xs font-medium text-neutral-300 transition-colors hover:border-red-500/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500/70"
                  >
                    View
                    <ChevronRightIcon className="size-3.5" />
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}