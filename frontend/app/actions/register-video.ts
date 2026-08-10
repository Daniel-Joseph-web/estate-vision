"use server";

import { getAdminDb, requireUser } from "@/lib/firebase/admin";
import type { RegisteredVideo } from "@/lib/types/event";

const USE_MOCKS = process.env.NEXT_PUBLIC_USE_MOCKS === "true";

export interface RegisterVideoInput {
  idToken: string;
  name: string;
  sizeBytes: number;
  contentType: string;
}

export type RegisterVideoResult =
  | { ok: true; video: RegisteredVideo }
  | { ok: false; message: string };

/** Filesystem-safe, collision-resistant key segment derived from the filename. */
function safeName(name: string): string {
  const cleaned = name.replace(/[^a-zA-Z0-9._-]/g, "_").slice(-120);
  return cleaned || "upload";
}

/**
 * Creates the `videos` doc for a pending upload and returns the id the client
 * redirects to plus the storage key it will PUT the file to.
 *
 * Firestore pre-generates doc IDs, so this is a single write instead of the
 * old insert-then-update pattern. Removes a failure mode: a failed second write
 * would have left a row with no storage_key, which the worker rejects.
 */
export async function registerVideo(
  input: RegisterVideoInput
): Promise<RegisterVideoResult> {
  try {
    if (USE_MOCKS) {
      const id = `vid_mock_${Math.random().toString(36).slice(2, 10)}`;
      return {
        ok: true,
        video: { id, storage_key: `mock-user/${id}/${safeName(input.name)}` },
      };
    }

    const user = await requireUser(input.idToken);
    const db = getAdminDb();

    // Pre-generate the doc ID so storage_key can reference it
    const ref = db.collection("videos").doc();
    const storage_key = `${user.uid}/${ref.id}/${safeName(input.name)}`;

    await ref.set({
      user_id: user.uid,
      name: input.name,
      storage_key,
      status: "queued",
      created_at: new Date().toISOString(),
      size_bytes: input.sizeBytes,
      duration_seconds: 0,
      event_count: 0,
      thumbnail_url: null,
      error_message: null,
    });

    // The worker is notified separately, by startProcessing, once the browser
    // has actually finished PUTting the file. Notifying here would race the
    // upload and the worker would 404 on an object that doesn't exist yet.
    return { ok: true, video: { id: ref.id, storage_key } };
  } catch (error) {
    return {
      ok: false,
      message:
        error instanceof Error
          ? error.message
          : "We couldn't start this upload. Try again.",
    };
  }
}
