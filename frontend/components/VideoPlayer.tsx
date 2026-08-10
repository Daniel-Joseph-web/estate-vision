"use client";

import { FilmIcon } from "lucide-react";
import type { RefObject } from "react";

interface VideoPlayerProps {
  /** Presigned playback URL, or null when the raw file isn't reachable. */
  src: string | null;
  poster: string | null;
  videoRef: RefObject<HTMLVideoElement | null>;
}

/**
 * Raw footage player. Stays usable while a video is still processing — only
 * the derived event data is gated on the pipeline finishing.
 */
export function VideoPlayer({ src, poster, videoRef }: VideoPlayerProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/70 backdrop-blur-md">
      {src ? (
        <video
          ref={videoRef}
          src={src}
          poster={poster ?? undefined}
          controls
          preload="metadata"
          className="aspect-video w-full bg-black"
        />
      ) : (
        // Not aspect-video: an empty 16:9 box is a huge dead panel. The
        // placeholder takes only the room its message needs.
        <div className="flex w-full flex-col items-center justify-center gap-3 bg-black/40 px-6 py-16 text-center">
          <FilmIcon aria-hidden="true" className="size-7 text-slate-600" />
          <p className="text-sm text-slate-400">Preview unavailable</p>
          <p className="max-w-xs text-xs text-slate-500">
            The source file isn&apos;t reachable from this environment. The
            detections below are unaffected.
          </p>
        </div>
      )}
    </div>
  );
}
