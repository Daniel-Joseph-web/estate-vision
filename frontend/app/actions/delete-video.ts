"use server";

import { getAdminDb, requireUser } from "@/lib/firebase/admin";

const USE_MOCKS = process.env.NEXT_PUBLIC_USE_MOCKS === "true";

// Mock storage for demo mode
let mockVideos: string[] = [];
let mockEvents: string[] = [];

export type DeleteVideoResult =
  | { ok: true }
  | { ok: false; message: string };

/**
 * Deletes a video and all its events using Admin SDK BulkWriter.
 *
 * Firestore has no DELETE WHERE and no cascade, so deleting hundreds of event
 * docs from the browser is slow and partially fails. BulkWriter handles
 * batching (500 ops/batch) and retries automatically.
 */
export async function deleteVideo(input: {
  idToken: string;
  videoId: string;
}): Promise<DeleteVideoResult> {
  try {
    if (USE_MOCKS) {
      // Track deletes in session so mock mode reflects changes
      mockVideos.push(input.videoId);
      return { ok: true };
    }

    const user = await requireUser(input.idToken);
    const db = getAdminDb();

    // Verify ownership before deleting
    const videoRef = db.collection("videos").doc(input.videoId);
    const videoSnap = await videoRef.get();

    if (!videoSnap.exists) {
      return { ok: false, message: "That video isn't in your library." };
    }

    const videoData = videoSnap.data();
    if (videoData?.user_id !== user.uid) {
      return { ok: false, message: "That video doesn't belong to your account." };
    }

    // Delete all events for this video using BulkWriter
    const bulk = db.bulkWriter();

    const eventsQuery = db
      .collection("events")
      .where("video_id", "==", input.videoId);
    const eventsSnapshot = await eventsQuery.get();

    // Events first: if the video went first and this failed, events would be
    // orphaned with no way to reach them.
    eventsSnapshot.docs.forEach((doc) => {
      bulk.delete(doc.ref);
    });

    await bulk.close();

    // Now delete the video document itself
    await videoRef.delete();

    return { ok: true };
  } catch (error) {
    return {
      ok: false,
      message:
        error instanceof Error
          ? error.message
          : "We couldn't delete this video.",
    };
  }
}
