"use server";

import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

import { requireUser } from "@/lib/firebase/admin";

const USE_MOCKS = process.env.NEXT_PUBLIC_USE_MOCKS === "true";

export type PlaybackUrlResult =
  | { ok: true; url: string | null }
  | { ok: false; message: string };

/**
 * Presigns a short-lived GET so the player can stream the raw recording.
 * Returns `url: null` when playback isn't available in this environment —
 * the detail page degrades to the event data alone.
 */
export async function getPlaybackUrl(input: {
  idToken: string;
  storageKey: string;
}): Promise<PlaybackUrlResult> {
  try {
    // Mock mode has no object store, so there is nothing to stream.
    if (USE_MOCKS) return { ok: true, url: null };

    const user = await requireUser(input.idToken);

    if (!input.storageKey.startsWith(`${user.uid}/`)) {
      return { ok: false, message: "That video doesn't belong to your account." };
    }

    const bucket = process.env.S3_BUCKET;
    const region = process.env.AWS_REGION;
    const endpoint = process.env.AWS_ENDPOINT;
    
    if (!bucket || !region || !endpoint) return { ok: true, url: null };

    // Pass the endpoint so the SDK routes to Cloudflare R2 instead of Amazon S3
    const s3 = new S3Client({ 
      region,
      endpoint 
    });

    const url = await getSignedUrl(
      s3,
      new GetObjectCommand({ Bucket: bucket, Key: input.storageKey }),
      { expiresIn: 3600 }
    );

    return { ok: true, url };
  } catch (error) {
    return {
      ok: false,
      message:
        error instanceof Error
          ? error.message
          : "We couldn't open this recording.",
    };
  }
}