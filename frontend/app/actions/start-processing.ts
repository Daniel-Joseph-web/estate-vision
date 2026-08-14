"use server";

import { getAdminDb, requireUser } from "@/lib/firebase/admin";

const USE_MOCKS = process.env.NEXT_PUBLIC_USE_MOCKS === "true";

export type StartProcessingResult =
  | { ok: true }
  | { ok: false; message: string };

/**
 * Called right after a video finishes uploading to storage.
 *
 * There is no more Python/Modal worker to hand this off to — analysis is
 * now on-demand, driven by the ChatAnalyst drawer calling
 * analyzeVideoSubject() per question, not a batch pipeline that runs once
 * on upload. So this action no longer POSTs anywhere; it just flips the
 * video's status so the detail page stops showing "Analysing footage…"
 * and unlocks the UI (filters, delete, etc).
 */
export async function startProcessing(input: {
  idToken: string;
  videoId: string;
}): Promise<StartProcessingResult> {
  try {
    if (USE_MOCKS) {
      return { ok: true };
    }

    const user = await requireUser(input.idToken);
    const db = getAdminDb();

    const videoRef = db.collection("videos").doc(input.videoId);
    const videoSnap = await videoRef.get();

    if (!videoSnap.exists) {
      return { ok: false, message: "That video isn't in your library." };
    }

    const videoData = videoSnap.data();
    if (videoData?.user_id !== user.uid) {
      return { ok: false, message: "That video doesn't belong to your account." };
    }

    await videoRef.update({
      status: "complete",
      error_message: null,
    });

    return { ok: true };
  } catch (error) {
    return {
      ok: false,
      message:
        error instanceof Error
          ? error.message
          : "We couldn't finish setting up this video.",
    };
  }
}