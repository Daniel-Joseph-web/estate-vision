"use server";

import { getAdminDb, requireUser } from "@/lib/firebase/admin";

const USE_MOCKS = process.env.NEXT_PUBLIC_USE_MOCKS === "true";

export type StartProcessingResult =
  | { ok: true }
  | { ok: false; message: string };

/**
 * Hands a finished upload to the worker.
 *
 * Called only after the browser's PUT to storage completes — the worker
 * downloads the object immediately, so notifying it any earlier races the
 * upload and fails on a key that doesn't exist yet.
 */
export async function startProcessing(input: {
  idToken: string;
  videoId: string;
}): Promise<StartProcessingResult> {
  try {
    // Nothing to hand off in mock mode; the fixture is already "processed".
    if (USE_MOCKS) return { ok: true };

    const user = await requireUser(input.idToken);
    const db = getAdminDb();

    // Server Actions are reachable by direct POST, so confirm this caller
    // actually owns the video before asking the worker to touch it. The
    // user_id check is what makes a guessed video ID useless to an attacker.
    const videoRef = db.collection("videos").doc(input.videoId);
    const videoSnap = await videoRef.get();

    if (!videoSnap.exists) {
      return { ok: false, message: "We couldn't find that upload." };
    }
    if (videoSnap.data()?.user_id !== user.uid) {
      return { ok: false, message: "That upload doesn't belong to your account." };
    }

    const workerUrl = process.env.WORKER_URL;
    const workerSecret = process.env.WORKER_SECRET;

    if (!workerUrl || !workerSecret) {
      return {
        ok: false,
        message:
          "Video processing isn't configured yet. Contact your administrator.",
      };
    }

    // We MUST `await` this fetch. Next.js server actions aggressively kill 
    // "fire-and-forget" requests, which causes connection drops and errors.
    // The worker replies instantly (202 Accepted) before starting the heavy YOLO 
    // task, so awaiting this is perfectly safe and extremely fast.
    const response = await fetch(`${workerUrl}/process-video`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Worker-Secret": workerSecret,
      },
      body: JSON.stringify({ video_id: input.videoId }),
      // Extended 30-second timeout to safely absorb brief Google Auth SSL network drops
      signal: AbortSignal.timeout(30_000), 
    });

    if (!response.ok) {
      return {
        ok: false,
        message:
          "Your video uploaded, but analysis couldn't be started. It stays in your library — try again from the dashboard.",
      };
    }

    return { ok: true };
  } catch {
    // The upload itself succeeded; this is recoverable and must say so.
    return {
      ok: false,
      message:
        "Your video uploaded, but analysis couldn't be started. It stays in your library — try again from the dashboard.",
    };
  }
}