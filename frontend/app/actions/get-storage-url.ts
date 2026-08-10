"use server";

import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

import { requireUser } from "@/lib/firebase/admin";

const USE_MOCKS = process.env.NEXT_PUBLIC_USE_MOCKS === "true";

export interface StorageUrlInput {
  idToken: string;
  storageKey: string;
  contentType: string;
}

export type StorageUrlResult =
  | { ok: true; url: string }
  | { ok: false; message: string };

/**
 * Presigns a direct PUT so the browser uploads to storage without the file
 * passing through the Next.js server.
 */
export async function getStorageUrl(
  input: StorageUrlInput
): Promise<StorageUrlResult> {
  try {
    if (USE_MOCKS) {
      return { ok: true, url: `mock://upload/${input.storageKey}` };
    }

    const user = await requireUser(input.idToken);

    // The key is `${uid}/${videoId}/${filename}` — refuse anything outside the
    // caller's own prefix so a forged POST can't presign someone else's object.
    if (!input.storageKey.startsWith(`${user.uid}/`)) {
      return { ok: false, message: "That upload doesn't belong to your account." };
    }

    const bucket = process.env.S3_BUCKET;
    const region = process.env.AWS_REGION;
    const endpoint = process.env.AWS_ENDPOINT;

    if (!bucket || !region || !endpoint) {
      return {
        ok: false,
        message: "Storage isn't configured yet. Contact your administrator.",
      };
    }

    // Pass the endpoint so the SDK routes to Cloudflare R2 instead of Amazon S3
    const s3 = new S3Client({ 
      region,
      endpoint 
    });
    
    const url = await getSignedUrl(
      s3,
      new PutObjectCommand({
        Bucket: bucket,
        Key: input.storageKey,
        ContentType: input.contentType,
      }),
      { expiresIn: 900 }
    );

    return { ok: true, url };
  } catch (error) {
    return {
      ok: false,
      message:
        error instanceof Error
          ? error.message
          : "We couldn't prepare the upload. Try again.",
    };
  }
}