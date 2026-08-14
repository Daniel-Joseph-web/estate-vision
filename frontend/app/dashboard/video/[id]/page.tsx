"use client";

import { AlertTriangleIcon, ArrowLeftIcon, Trash2Icon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { use, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { ChatAnalyst } from "@/components/ChatAnalyst";
import { StatusBadge } from "@/components/StatusBadge";
import { VideoPlayer } from "@/components/VideoPlayer";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { getPlaybackUrl } from "@/app/actions/get-playback-url";
import { getIdToken } from "@/lib/firebase/client";
import { formatBytes, formatDateTime, formatDuration } from "@/lib/format";
import { useUiStore } from "@/lib/store/uiStore";
import { useVideoDetailStore } from "@/lib/store/videoDetailStore";

export default function VideoDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();

  const video = useVideoDetailStore((s) => s.video);
  const loading = useVideoDetailStore((s) => s.loading);
  const error = useVideoDetailStore((s) => s.error);
  const removeVideo = useVideoDetailStore((s) => s.removeVideo);
  const load = useVideoDetailStore((s) => s.load);
  const reset = useVideoDetailStore((s) => s.reset);

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
      .then((idToken) => getPlaybackUrl({ idToken: idToken ?? "", storageKey: video.storage_key }))
      .then((result) => { if (!cancelled && result.ok) setPlaybackUrl(result.url); })
      .catch(() => {});

    return () => { cancelled = true; };
  }, [video?.storage_key]);

  function seek(seconds: number) {
    const element = videoRef.current;
    if (!element) return;
    element.currentTime = seconds;
    void element.play().catch(() => {});
  }

  function confirmDelete() {
    if (!video) return;
    requestConfirmation({
      title: "Delete this video?",
      description: `"${video.name}" will be removed permanently. This can't be undone.`,
      confirmLabel: "Delete Video",
      destructive: true,
      onConfirm: async () => {
        try {
          await removeVideo(video.id);
          toast.success("Video deleted");
          router.push("/dashboard");
        } catch (caught) {
          toast.error(caught instanceof Error ? caught.message : "We couldn't delete this video.");
          throw caught;
        }
      },
    });
  }

  if (loading) {
    return (
      <div className="mx-auto w-full max-w-full space-y-6">
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm text-neutral-400">
          <ArrowLeftIcon className="size-4" /> Back to dashboard
        </Link>
        <Skeleton className="h-8 w-64 bg-neutral-800" />
        <Skeleton className="aspect-video w-full rounded-2xl bg-neutral-800" />
      </div>
    );
  }

  if (error || !video) {
    return (
      <div className="mx-auto w-full max-w-full">
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm text-neutral-400">
          <ArrowLeftIcon className="size-4" /> Back to dashboard
        </Link>
        <div className="mt-6 flex flex-col items-center rounded-2xl border border-[#ff3333]/30 bg-neutral-900/70 px-6 py-14 text-center">
          <AlertTriangleIcon className="size-6 text-[#ff3333]" />
          <h2 className="mt-4 text-base font-semibold text-neutral-50">We couldn&apos;t open this video</h2>
          <Button variant="outline" className="mt-6" onClick={() => void load(id)}>Try again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-[1800px]">
      {/* 
        GRID LAYOUT: 
        1 column on mobile (stacked). 
        2 columns on desktop (Video takes 1fr, Chat takes 450px) 
      */}
      <div className="grid gap-6 lg:grid-cols-[1fr_400px] xl:grid-cols-[1fr_450px]">
        
        {/* LEFT COLUMN: Video & Details */}
        <div className="flex flex-col gap-4">
          <div>
            <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm text-neutral-400 hover:text-neutral-100">
              <ArrowLeftIcon className="size-4" /> Back to dashboard
            </Link>

            <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
              <div className="min-w-0">
                <h1 className="truncate text-2xl font-semibold tracking-tight text-neutral-50">{video.name}</h1>
                <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-2">
                  <StatusBadge status={video.status} />
                  <span className="font-mono text-xs text-neutral-500">
                    {formatDateTime(video.created_at)} · {formatBytes(video.size_bytes)}
                    {video.duration_seconds > 0 && ` · ${formatDuration(video.duration_seconds)}`}
                  </span>
                </div>
              </div>

              <Button variant="destructive" size="lg" onClick={confirmDelete}>
                <Trash2Icon /> Delete Video
              </Button>
            </div>
          </div>

          {/* Sticky wrapper for Mobile users */}
          <div className="sticky top-16 z-30 -mx-4 bg-[#0A0A0A] px-4 py-2 lg:static lg:mx-0 lg:bg-transparent lg:p-0">
            <VideoPlayer src={playbackUrl} poster={video.thumbnail_url} videoRef={videoRef} />
          </div>
        </div>

        {/* RIGHT COLUMN: AI Chat Analyst */}
        <div className="relative">
          {/* Sticks to the screen on desktop so it doesn't scroll away */}
          <div className="sticky top-20 h-[calc(100vh-6.5rem)]">
            <ChatAnalyst videoId={video.id} storageKey={video.storage_key} onSeek={seek} />
          </div>
        </div>

      </div>
    </div>
  );
}