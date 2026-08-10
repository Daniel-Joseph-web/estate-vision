# EstateVision Codebase (single-file reap)

### File: `frontend\.env.example`

```
# Run the entire frontend on the frozen mock fixture — no Firebase or Supabase
# project required. Set to false (or unset) to hit the real services.
NEXT_PUBLIC_USE_MOCKS=true

# --- Firebase Auth (client) ---
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyBQtRolhG4DxW8PTRUGL-tcyjkzxPT5qqs
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=estate-vision-6f9b4.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=estate-vision-6f9b4
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=estate-vision-6f9b4.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=97384727478
NEXT_PUBLIC_FIREBASE_APP_ID=1:97384727478:web:e738408be314bf78ae7717

# --- Firebase Admin (server, verifies ID tokens inside Server Actions) ---
FIREBASE_PROJECT_ID=estate-vision-6f9b4
FIREBASE_CLIENT_EMAIL=
# Paste the full key including the literal \n escapes.
FIREBASE_PRIVATE_KEY=



# --- Worker handoff (server-only) ---
# Base URL of the Python worker, e.g. http://127.0.0.1:8000 in development.
WORKER_URL=
# Must match WORKER_SECRET in worker/.env exactly. Minimum 16 chars.
WORKER_SECRET=

# --- Object storage for direct browser uploads ---
AWS_REGION=
S3_BUCKET=
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=

```

### File: `frontend\.env.local`

```
# Run the entire frontend on the frozen mock fixture — no Firebase project
# required. Set to false (or unset) to hit the real services.
NEXT_PUBLIC_USE_MOCKS=false

# --- Firebase Auth (client) ---
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyBQtRolhG4DxW8PTRUGL-tcyjkzxPT5qqs
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=estate-vision-6f9b4.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=estate-vision-6f9b4
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=estate-vision-6f9b4.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=97384727478
NEXT_PUBLIC_FIREBASE_APP_ID=1:97384727478:web:e738408be314bf78ae7717

# --- Firebase Admin (server, verifies ID tokens inside Server Actions) ---
FIREBASE_PROJECT_ID=estate-vision-6f9b4
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-fbsvc@estate-vision-6f9b4.iam.gserviceaccount.com
# Paste the full key including the literal \n escapes.
FIREBASE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC0EawgkDGFJr4/\nRBuxcs0dpbJQFpQy9SpHFhzPVDxE8H2rAUldYQEUaZZOdSa8ELTZ6v6D9rgYTM9h\nS9QMhOgMfyJb5q49Guh3KGbDjOgHMEPoLDtTvs+GrO+kYbs8s4pK8VW0mrLh//s6\ncVlcLAfCGNYweBD3bt853fr9J2AW52E+moCMyl50XwN9jsU6S0ed1INNRsaPUmB9\ntA1FuimzXOE79xWm2rbgTAtnNCNkXj1pPKphhe53lX7E4aeACSar4caVtuGDujQE\npufUO4gt0Zc0tLkrvsCeypStvovD9bY6R35v5TOEg/QClF+4ViQdEWAFWDMExeuU\nMI5k6KtrAgMBAAECggEADAJBtco9WIvvlCM5VZQ6abJrOebHlhO+Rg9gzH2UUg9X\n0i0RH3vLU/ksClTLHdpfX/PJat5BWMgxQbk04xYvWOYBp0SzH2V0AL5eXBxBknko\nOOD6ST4oc5WE8ImJWyWoy2ayOIvjR38y2gBFMrMdBqzGsWTQfNqVYzPn+99sYRqL\nQP0cxQf5zP0k/dUZwuJGSkxO3jpBaXq7s+nAlfDiVD8Rk4KKr+NTG5sAL89AK150\nxRi1bvjeH3iiCfWq9I0VDvadAvHSnuIg3nXTrLFLUo5/UAZn9i/kWXI0TuIhudv+\nf2t2QkljB+8H/nOEwRD2JV1y7Q1arlWV5PPi+ZbrwQKBgQDYD9PffyjH9vy5tjol\nA5p8f0yCJC8c3aSYu0UqSKbFGo5p56llmCQHPhyVYciIAB/GXg6A5k8NY8eWRI8q\nYflorLupxM747vUsH21goEZwon298IqSS4svJN7nJyrOkYkL5tPJt/2sVjK08poG\nVK+zaqwZQ/vCIrJgmYm2oeTFPwKBgQDVWqUF1AfObauVM5sXs7iIyCkgkB0mlfIz\nnKCa2HDHyozWJLxgubR65y1dVZSH3seYGsqE3273ZKD+D2l5PSRD7eim9JYMxskb\nOpUWmLkc8Q8DrlpqjPWRPd8AZn4mFLmlwKwSQOf/Xz25+jezjmyx7WHStrk8L7BE\n2ycU0yXy1QKBgQDEoxsD1BnMa6e0aPlgCHiIB98crkvGbJ3Jdt5KzlYhGrsz/Wd5\nE87uXIPtHFJCHELO6XkvrOuTVxUlWH4nZ4Vy04nzxy9K9UdjAbMs9pFFH01rGUk0\nPdaNcHQBUe8uktt0Xn6vnmkbeFOrxQOS8W36zwGT+QBeve8z5WilM5AeRwKBgFHK\nYiEN28BDQtf75KT9fOzS7xFQrhwwt50ZmmhCOVoeSEd/5cee6ZWEMlvphvtfaFzj\nSGgPz9Z/eUhsWB7mVZTFC7+VXEChpE8P8j+rZKu3re3XVUorp6h6c5cPs6SdpV3p\nsw18XHQF6v/08I2hOAIt4qaI7hIopgZ/jUfqek3RAoGBAMhF+jmKrFlmDVpD1Tsr\n6X6MImCmbVqW//fEJ8TncjIGrGXjj/OzZXYD3dL2kgG6MQHFQgQlYlVHof6ToW4g\naH4soQSpVQL1Nl3o1hWh2tIe5b6uEPhHSu2ioM8gyVMcRb6hGb9YthKJhag7DzDH\nJNXhrpQG9VbRb5D62MjPjEb2\n-----END PRIVATE KEY-----\n



# --- Worker handoff (server-only) ---
# Base URL of the Python worker, e.g. http://127.0.0.1:8000 in development.
WORKER_URL=http://127.0.0.1:8100
# Must match WORKER_SECRET in worker/.env exactly. Minimum 16 chars.
WORKER_SECRET=03dJBT04DxzRhkq8TraxPxpXtxX6bX50zDDYLDaUM1g

# --- Object storage for direct browser uploads ---
AWS_REGION=auto
S3_BUCKET=estate-vision-videos
AWS_ACCESS_KEY_ID=0d26d9ed82df319a186c9e69f7ee6e54
AWS_SECRET_ACCESS_KEY=51e423253f9037163ef12a1fb5d89d0b095a52061259c9bc17bc9c9dde1e2c47
AWS_ENDPOINT=https://59463590a68ea007c7d65be85484dfbb.r2.cloudflarestorage.com
```

### File: `frontend\.gitignore`

```
# See https://help.github.com/articles/ignoring-files/ for more about ignoring files.

# dependencies
/node_modules
/.pnp
.pnp.*
.yarn/*
!.yarn/patches
!.yarn/plugins
!.yarn/releases
!.yarn/versions

# testing
/coverage

# next.js
/.next/
/out/

# production
/build

# misc
.DS_Store
*.pem

# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*
.pnpm-debug.log*

# env files (can opt-in for committing if needed)
.env*

# vercel
.vercel

# typescript
*.tsbuildinfo
next-env.d.ts

```

### File: `frontend\AGENTS.md`

```markdown
<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

```

### File: `frontend\app\actions\delete-video.ts`

```typescript
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

```

### File: `frontend\app\actions\get-playback-url.ts`

```typescript
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
```

### File: `frontend\app\actions\get-storage-url.ts`

```typescript
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
```

### File: `frontend\app\actions\register-video.ts`

```typescript
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

```

### File: `frontend\app\actions\start-processing.ts`

```typescript
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
```

### File: `frontend\app\dashboard\layout.tsx`

```tsx
"use client";

import { Loader2Icon } from "lucide-react";
import type { ReactNode } from "react";

import { Sidebar } from "@/components/Sidebar";
import { TopBar } from "@/components/TopBar";
import { useAuth } from "@/providers/auth-provider";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();

  // AuthProvider pushes unauthenticated visitors to /login; hold the chrome
  // back until we know, so protected content never paints for a signed-out user.
  if (loading || !user) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-[#0A0A0A]">
        <Loader2Icon
          aria-label="Loading"
          className="size-5 animate-spin text-red-500"
        />
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-[#0A0A0A]">
      <TopBar />
      <Sidebar />
      <main className="px-4 pb-16 pt-20 md:pl-64 md:pr-6">{children}</main>
    </div>
  );
}
```

### File: `frontend\app\dashboard\page.tsx`

```tsx
"use client";

import { AlertTriangleIcon, ChevronRightIcon, Trash2Icon, VideoIcon } from "lucide-react";
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
  /** Bumped by Try again to re-run the fetch effect. */
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
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard className="sm:col-span-2 lg:col-span-1" />
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

  const visibleUploads = summary.recent_uploads.filter((v) => !hiddenIds.has(v.id));
  const optimisticTotalVideos = Math.max(0, summary.total_videos - hiddenIds.size);
  const topCount = summary.top_object_classes[0]?.count ?? 0;

  function confirmDelete(video: Video) {
    requestConfirmation({
      title: "Delete this video?",
      description: `"${video.name}" and all its detections will be removed permanently. This can't be undone.`,
      confirmLabel: "Delete Video",
      destructive: true,
      onConfirm: () => {
        // 1. Optimistic Update: Immediately hide the video and show success toast.
        // Because we aren't awaiting a promise here, the confirmation modal closes instantly.
        setHiddenIds((prev) => new Set(prev).add(video.id));
        toast.success("Video deleted");

        // 2. Perform the actual database deletion asynchronously in the background.
        (async () => {
          try {
            const idToken = await getIdToken();
            if (!idToken) throw new Error("Please sign in again.");

            const result = await deleteVideo({ idToken, videoId: video.id });
            if (!result.ok) {
              throw new Error(result.message);
            }

            // Sync the real data in the background once the server confirms success.
            onRefresh(); 
          } catch (caught) {
            // 3. Rollback: If the server fails, put the video back in the list and show the error.
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
      <div className="grid items-start gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <MetricCard
          label="Videos processed"
          value={formatCount(optimisticTotalVideos)}
          hint="Across your whole portfolio"
          className="bg-neutral-900/70 border-neutral-800"
        />
        <MetricCard
          label="Events extracted"
          value={formatCount(summary.total_events)}
          hint="Detections available to export"
          critical={summary.total_events > 0}
          className="bg-neutral-900/70 border-neutral-800"
        />

        <MetricCard
          label="Top object classes"
          value={
            summary.top_object_classes[0]?.object_class.toUpperCase() ?? "—"
          }
          className="sm:col-span-2 lg:col-span-1 bg-neutral-900/70 border-neutral-800"
        >
          {summary.top_object_classes.length > 0 ? (
            <ul className="mt-4 space-y-2.5">
              {summary.top_object_classes.map(({ object_class, count }) => (
                <li key={object_class}>
                  <div className="flex items-baseline justify-between gap-3">
                    <span className="truncate text-xs text-neutral-300">
                      {object_class}
                    </span>
                    <span className="font-mono text-xs tabular-nums text-neutral-400">
                      {formatCount(count)}
                    </span>
                  </div>
                  <div
                    className="mt-1 h-1 overflow-hidden rounded-full bg-neutral-800"
                    role="presentation"
                  >
                    <div
                      className="h-full rounded-full bg-red-500/70"
                      style={{
                        width: `${topCount ? Math.max((count / topCount) * 100, 4) : 0}%`,
                      }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 text-xs text-neutral-400">
              No detections yet — classes appear once a video finishes processing.
            </p>
          )}
        </MetricCard>
      </div>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-neutral-200">Recent uploads</h2>
          <span className="ev-label text-neutral-400">
            {formatCount(visibleUploads.length)} shown
          </span>
        </div>

        <ul className="divide-y divide-neutral-800/80 overflow-hidden rounded-2xl border border-neutral-800/80 bg-neutral-900/40">
          {visibleUploads.map((video) => (
            <li 
              key={video.id} 
              className="flex items-center justify-between gap-4 p-4 transition-colors hover:bg-neutral-800/40"
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

              <div className="flex shrink-0 items-center gap-2">
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
      </section>
    </div>
  );
}
```

### File: `frontend\app\dashboard\reports\page.tsx`

```tsx
"use client";

import {
  AlertTriangleIcon,
  CalendarIcon,
  ChevronDownIcon,
  DownloadIcon,
  Loader2Icon,
  SearchXIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { EmptyState } from "@/components/EmptyState";
import { MultiSelectFilter } from "@/components/MultiSelectFilter";
import { SkeletonRows } from "@/components/SkeletonLoader";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { fetchReportExport, toUserMessage } from "@/lib/api/client";
import { exportAsCsv, exportAsJson } from "@/lib/export";
import { formatCount } from "@/lib/format";
import { hasActiveFilters, useReportsStore } from "@/lib/store/reportsStore";

export default function ReportsPage() {
  const filters = useReportsStore((s) => s.filters);
  const rows = useReportsStore((s) => s.rows);
  const cursor = useReportsStore((s) => s.cursor);
  const totalEvents = useReportsStore((s) => s.totalEvents);
  const matchingVideos = useReportsStore((s) => s.matchingVideos);
  const options = useReportsStore((s) => s.options);
  const loading = useReportsStore((s) => s.loading);
  const loadingMore = useReportsStore((s) => s.loadingMore);
  const error = useReportsStore((s) => s.error);
  const loaded = useReportsStore((s) => s.loaded);
  const load = useReportsStore((s) => s.load);
  const loadMore = useReportsStore((s) => s.loadMore);
  const loadOptions = useReportsStore((s) => s.loadOptions);
  const setFilters = useReportsStore((s) => s.setFilters);
  const clearFilters = useReportsStore((s) => s.clearFilters);
  const reset = useReportsStore((s) => s.reset);

  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    void loadOptions();
    void load();
    return reset;
  }, [loadOptions, load, reset]);

  const filtersActive = hasActiveFilters(filters);

  async function runExport(format: "csv" | "json") {
    if (exporting) return;
    setExporting(true);
    try {
      const data = await fetchReportExport(filters);
      if (data.length === 0) {
        toast.error("Nothing to export — no detections match these filters.");
        return;
      }
      if (format === "csv") exportAsCsv(data);
      else exportAsJson(data);
      toast.success(
        `Exported ${formatCount(data.length)} detection${data.length === 1 ? "" : "s"} as ${format.toUpperCase()}`
      );
    } catch (caught) {
      toast.error(toUserMessage(caught, "We couldn't generate your export."));
    } finally {
      setExporting(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-6xl">
      <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="ev-label text-neutral-400">Export zone</p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-neutral-50">
            Reports
          </h1>
        </div>

        {/* Split button: CSV is the default action, JSON lives under the caret. */}
        <div className="flex">
          <Button
            size="lg"
            disabled={exporting || loading}
            onClick={() => void runExport("csv")}
            className="h-10 rounded-r-none bg-red-600 px-5 font-semibold text-white hover:bg-red-700"
          >
            {exporting ? (
              <Loader2Icon aria-hidden="true" className="animate-spin" />
            ) : (
              <DownloadIcon aria-hidden="true" />
            )}
            Export to CSV
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger
              aria-label="More export formats"
              disabled={exporting || loading}
              render={
                <Button
                  size="lg"
                  className="h-10 rounded-l-none border-l border-red-700 bg-red-600 px-2 text-white hover:bg-red-700"
                />
              }
            >
              <ChevronDownIcon aria-hidden="true" />
            </DropdownMenuTrigger>

            <DropdownMenuContent 
              align="end" 
              className="w-48 border-neutral-800 bg-neutral-900 text-neutral-200"
            >
              <DropdownMenuItem 
                onClick={() => void runExport("json")}
                className="cursor-pointer focus:bg-neutral-800 focus:text-neutral-50"
              >
                Export as JSON
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Filter bar — every change applies immediately, no Apply button. */}
      <div className="mb-6 flex flex-wrap items-center gap-3 rounded-2xl border border-neutral-800 bg-neutral-900/70 p-4 backdrop-blur-md">
        <DropdownMenu>
          <DropdownMenuTrigger
            render={<Button variant="outline" size="lg" className="h-9 border-neutral-700 text-neutral-200 hover:bg-neutral-800" />}
          >
            <CalendarIcon aria-hidden="true" />
            <span className="ev-label text-neutral-400">Date range</span>
            <span className="text-neutral-200">
              {filters.dateFrom || filters.dateTo
                ? `${filters.dateFrom ?? "Any"} → ${filters.dateTo ?? "Any"}`
                : "All time"}
            </span>
            <ChevronDownIcon aria-hidden="true" />
          </DropdownMenuTrigger>

          <DropdownMenuContent 
            align="start" 
            className="w-72 p-3 border-neutral-800 bg-neutral-900 text-neutral-200"
          >
            <div className="space-y-3">
              <div className="space-y-1.5">
                <label htmlFor="date-from" className="ev-label block text-neutral-400">
                  From
                </label>
                <Input
                  id="date-from"
                  type="date"
                  className="border-neutral-800 bg-neutral-950 text-neutral-200 focus-visible:ring-red-500"
                  value={filters.dateFrom ?? ""}
                  max={filters.dateTo ?? undefined}
                  onChange={(event) =>
                    void setFilters({ dateFrom: event.target.value || null })
                  }
                />
              </div>
              <div className="space-y-1.5">
                <label htmlFor="date-to" className="ev-label block text-neutral-400">
                  To
                </label>
                <Input
                  id="date-to"
                  type="date"
                  className="border-neutral-800 bg-neutral-950 text-neutral-200 focus-visible:ring-red-500"
                  value={filters.dateTo ?? ""}
                  min={filters.dateFrom ?? undefined}
                  onChange={(event) =>
                    void setFilters({ dateTo: event.target.value || null })
                  }
                />
              </div>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        <MultiSelectFilter
          label="Property"
          options={options.videos.map(({ id, name }) => ({
            value: id,
            label: name,
          }))}
          selected={filters.videoIds}
          onChange={(videoIds) => void setFilters({ videoIds })}
        />

        <MultiSelectFilter
          label="Event type"
          options={options.objectClasses.map((value) => ({
            value,
            label: value,
          }))}
          selected={filters.objectClasses}
          onChange={(objectClasses) => void setFilters({ objectClasses })}
        />

        <Button
          variant="ghost"
          size="sm"
          className="ml-auto text-neutral-300 hover:text-white hover:bg-neutral-800"
          disabled={!filtersActive || loading}
          onClick={() => void clearFilters()}
        >
          Clear Filters
        </Button>
      </div>

      {loading && <SkeletonRows rows={6} />}

      {!loading && error && (
        <div
          role="alert"
          className="flex flex-col items-center rounded-2xl border border-[#ff3333]/30 bg-neutral-900/70 px-6 py-14 text-center backdrop-blur-md"
        >
          <AlertTriangleIcon aria-hidden="true" className="size-6 text-[#ff3333]" />
          <h2 className="mt-4 text-base font-semibold text-neutral-50">
            We couldn&apos;t build your report
          </h2>
          <p className="mt-2 max-w-sm text-sm text-neutral-400">{error}</p>
          <Button
            size="lg"
            variant="outline"
            className="mt-6 border-neutral-700 text-neutral-200 hover:bg-neutral-800"
            onClick={() => void load()}
          >
            Try again
          </Button>
        </div>
      )}

      {!loading && !error && loaded && rows.length === 0 && (
        <EmptyState
          icon={SearchXIcon}
          title="No matches"
          description={
            filtersActive
              ? "No detections match these filters. Widen the date range or clear the filters to see more."
              : "There are no detections to report on yet. Upload a recording to get started."
          }
          action={
            filtersActive ? (
              <Button
                variant="outline"
                size="lg"
                className="border-neutral-700 text-neutral-200 hover:bg-neutral-800"
                onClick={() => void clearFilters()}
              >
                Clear Filters
              </Button>
            ) : undefined
          }
        />
      )}

      {!loading && !error && rows.length > 0 && (
        <>
          <div className="mb-3 flex flex-wrap items-center gap-x-4 gap-y-1">
            <p className="text-sm text-neutral-300">
              Matching videos:{" "}
              <span className="font-mono text-neutral-50">
                {formatCount(matchingVideos)}
              </span>
            </p>
            <p className="text-sm text-neutral-400">
              Detections:{" "}
              <span className="font-mono text-neutral-200">
                {formatCount(totalEvents)}
              </span>
            </p>
          </div>

          <div className="overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900/70 backdrop-blur-md">
            <Table>
              <TableHeader>
                <TableRow className="border-neutral-800 hover:bg-transparent">
                  <TableHead className="ev-label px-4 text-neutral-400">Date</TableHead>
                  <TableHead className="ev-label px-4 text-neutral-400">Event type</TableHead>
                  <TableHead className="ev-label px-4 text-right text-neutral-400">
                    Detections
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((row) => (
                  <TableRow
                    key={`${row.date}-${row.object_class}`}
                    className="border-neutral-800 hover:bg-neutral-800/40"
                  >
                    <TableCell className="px-4 font-mono text-neutral-300">
                      {row.date}
                    </TableCell>
                    <TableCell className="px-4 text-neutral-300">
                      {row.object_class}
                    </TableCell>
                    <TableCell className="px-4 text-right font-mono text-neutral-50 tabular-nums">
                      {formatCount(row.count)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Hidden once the last page is in. */}
          {cursor && (
            <div className="mt-4 flex justify-center">
              <Button
                variant="outline"
                size="lg"
                className="border-neutral-700 text-neutral-200 hover:bg-neutral-800"
                disabled={loadingMore}
                onClick={() => void loadMore()}
              >
                {loadingMore && (
                  <Loader2Icon aria-hidden="true" className="animate-spin" />
                )}
                Load More
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
```

### File: `frontend\app\dashboard\upload\page.tsx`

```tsx
"use client";

import { FileVideoIcon, XIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { toast } from "sonner";

import { Dropzone } from "@/components/Dropzone";
import { UploadProgress } from "@/components/UploadProgress";
import { Button } from "@/components/ui/button";
import { formatBytes } from "@/lib/format";
import { useUploadStore } from "@/lib/store/uploadStore";

export default function UploadPage() {
  const router = useRouter();

  const file = useUploadStore((s) => s.file);
  const status = useUploadStore((s) => s.status);
  const progress = useUploadStore((s) => s.progress);
  const error = useUploadStore((s) => s.error);
  const warning = useUploadStore((s) => s.warning);
  const videoId = useUploadStore((s) => s.videoId);
  const selectFile = useUploadStore((s) => s.selectFile);
  const clearFile = useUploadStore((s) => s.clearFile);
  const startUpload = useUploadStore((s) => s.startUpload);
  const cancelUpload = useUploadStore((s) => s.cancelUpload);
  const reset = useUploadStore((s) => s.reset);

  const retryRef = useRef<HTMLButtonElement>(null);
  // The store is a module singleton, so the same error would re-toast on
  // every render until it changes.
  const toastedError = useRef<string | null>(null);

  // Start clean whenever the page is opened.
  useEffect(() => reset, [reset]);

  useEffect(() => {
    if (status !== "error" || !error) {
      if (status !== "error") toastedError.current = null;
      return;
    }
    if (toastedError.current === error) return;

    toastedError.current = error;
    toast.error(error);
    // Send focus to the action that clears the problem.
    retryRef.current?.focus();
  }, [status, error]);

  // Success goes straight to the new video — no extra "Done" step. Unless the
  // worker handoff failed: that warning needs to be read, so the user moves on
  // deliberately instead of being redirected out from under it.
  useEffect(() => {
    if (status === "success" && videoId && !warning) {
      router.replace(`/dashboard/video/${videoId}`);
    }
  }, [status, videoId, warning, router]);

  const uploading = status === "uploading";
  const failed = status === "error";

  return (
    <div className="mx-auto w-full max-w-2xl">
      <header className="mb-6">
        <p className="ev-label text-neutral-400">Ingestion zone</p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-neutral-50">
          Upload footage
        </h1>
      </header>

      <div className="space-y-4">
        {/* The dropzone stays available until a file is queued. */}
        {!file && <Dropzone onFile={selectFile} disabled={uploading} />}

        {file && (
          <div className="flex items-center gap-4 rounded-2xl border border-neutral-800 bg-neutral-900/70 p-4 backdrop-blur-md">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-neutral-800 bg-neutral-950">
              <FileVideoIcon aria-hidden="true" className="size-4 text-red-500" />
            </span>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-neutral-100">
                {file.name}
              </p>
              <p className="mt-1 font-mono text-xs text-neutral-500">
                {formatBytes(file.size)}
              </p>
            </div>

            <Button
              variant="ghost"
              size="icon"
              aria-label={`Remove ${file.name}`}
              disabled={uploading}
              onClick={clearFile}
            >
              <XIcon />
            </Button>
          </div>
        )}

        {uploading && <UploadProgress value={progress} />}

        {status === "success" && !warning && (
          <p role="status" className="text-sm text-red-500">
            Upload complete — opening your video…
          </p>
        )}

        {/* Stored fine, but the worker never picked it up. */}
        {status === "success" && warning && (
          <>
            <p role="alert" className="text-sm text-[#f59e0b]">
              {warning}
            </p>
            <Button
              size="lg"
              variant="outline"
              className="h-11 px-6 border-neutral-700 text-neutral-200"
              onClick={() => router.replace(`/dashboard/video/${videoId}`)}
            >
              Open the video anyway
            </Button>
          </>
        )}

        {failed && error && (
          <p role="alert" className="text-sm text-[#ff3333]">
            {error}
          </p>
        )}

        <div className="flex flex-wrap gap-3">
          {uploading && (
            <Button
              size="lg"
              variant="outline"
              className="h-11 px-6 border-neutral-700 text-neutral-200"
              onClick={cancelUpload}
            >
              Cancel Upload
            </Button>
          )}

          {/* A rejected file leaves nothing queued, so the dropzone is the
              only sensible next step — no dead Start/Retry button. */}
          {!uploading && file && (
            <Button
              ref={retryRef}
              size="lg"
              disabled={status === "success"}
              onClick={() => void startUpload()}
              className="h-11 bg-red-600 px-6 font-semibold text-white hover:bg-red-700"
            >
              {failed ? "Retry" : "Start Upload"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
```

### File: `frontend\app\dashboard\video\[id]\page.tsx`

```tsx
"use client";

import { AlertTriangleIcon, ArrowLeftIcon, Trash2Icon, Loader2Icon, RefreshCwIcon } from "lucide-react";
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
  const setSeverityFilter = useVideoDetailStore((s) => s.setSeverityFilter);
  const setClassFilter = useVideoDetailStore((s) => s.setClassFilter);
  const setFlaggedOnly = useVideoDetailStore((s) => s.setFlaggedOnly);
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
      }),
    [allEvents, severityFilter, classFilter, flaggedOnly, flaggedIds]
  );

  const requestConfirmation = useUiStore((s) => s.requestConfirmation);

  const videoRef = useRef<HTMLVideoElement>(null);
  const [playbackUrl, setPlaybackUrl] = useState<string | null>(null);

  useEffect(() => {
    void load(id);
    return reset;
  }, [id, load, reset]);

  // Playback is a separate concern from the event data: a missing URL must not
  // block the detections from rendering.
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
    severityFilter !== "all" || classFilter !== "all" || flaggedOnly;

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
          className="mt-6 flex flex-col items-center rounded-2xl border border-[#ff3333]/30 bg-slate-900/70 px-6 py-14 text-center backdrop-blur-md"
        >
          <AlertTriangleIcon aria-hidden="true" className="size-6 text-[#ff3333]" />
          <h2 className="mt-4 text-base font-semibold text-slate-50">
            We couldn&apos;t open this video
          </h2>
          <p className="mt-2 max-w-sm text-sm text-slate-400">
            {error ?? "That video isn't in your library."}
          </p>
          <Button
            size="lg"
            variant="outline"
            className="mt-6 border-slate-700 text-slate-200 hover:bg-slate-800"
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
            <h1 className="truncate text-2xl font-semibold tracking-tight text-slate-50">
              {video.name}
            </h1>
            <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-2">
              <StatusBadge status={video.status} />
              <span className="font-mono text-xs text-slate-500">
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
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-[#ff3333]/30 bg-slate-900/70 p-5 backdrop-blur-md"
        >
          <div>
            <p className="ev-label text-[#ff3333]">Processing failed</p>
            <p className="mt-2 text-sm text-slate-300">{video.error_message}</p>
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
            className="shrink-0 border-slate-700 text-slate-200 hover:bg-slate-800"
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

      {/* Raw footage plays regardless of pipeline state. */}
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
        {processing && <ProcessingOverlay progress={video.processing_progress} />}
      </div>

      <section className="relative">
        <div className="mb-3 flex flex-wrap items-end justify-between gap-3">
          <h2 className="text-sm font-semibold text-slate-200">Detections</h2>
          <span className="ev-label">
            {visibleEvents.length} of {allEvents.length}
          </span>
        </div>

        <div className="mb-4 flex flex-wrap items-center gap-3 rounded-2xl border border-slate-800 bg-slate-900/70 p-4 backdrop-blur-md">
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
              "flex items-center gap-2 text-xs text-slate-300",
              processing && "opacity-50"
            )}
          >
            <input
              type="checkbox"
              checked={flaggedOnly}
              disabled={processing}
              onChange={(event) => setFlaggedOnly(event.target.checked)}
              className="size-4 rounded border-slate-700 bg-slate-950 accent-[#00f0ff]"
            />
            Flagged only
          </label>

          <Button
            variant="ghost"
            size="sm"
            className="ml-auto text-slate-300 hover:text-slate-50 hover:bg-slate-800"
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
              <Button variant="outline" size="lg" onClick={clearFilters} className="border-slate-700 text-slate-200 hover:bg-slate-800">
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

        {processing && <ProcessingOverlay progress={video.processing_progress} />}
      </section>
    </div>
  );
}

function BackLink() {
  return (
    <Link
      href="/dashboard"
      className="inline-flex items-center gap-2 rounded-md text-sm text-slate-400 transition-colors hover:text-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500"
    >
      <ArrowLeftIcon aria-hidden="true" className="size-4" />
      Back to dashboard
    </Link>
  );
}

/** Covers derived data while the pipeline is still running. */
function ProcessingOverlay({ progress }: { progress?: number }) {
  return (
    <div className="absolute inset-0 z-10 flex items-center justify-center rounded-2xl bg-[#0A0A0A]/60 backdrop-blur-[2px]">
      <p className="flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900/90 px-4 py-2 text-xs text-slate-300 shadow-sm">
        <span
          aria-hidden="true"
          className="size-1.5 animate-pulse rounded-full bg-[#f59e0b]"
        />
        {progress ? `Analysing footage… ${progress}%` : "Analysing footage…"}
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
        className="h-8 rounded-lg border border-slate-800 bg-slate-950/60 px-2 text-xs text-slate-200 outline-none focus-visible:border-[#00f0ff]/60 focus-visible:ring-2 focus-visible:ring-[#00f0ff]/40 disabled:opacity-50"
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
      <Skeleton className="h-8 w-64 bg-slate-800" />
      <Skeleton className="aspect-video w-full rounded-2xl bg-slate-800" />
      <SkeletonRows rows={5} />
    </div>
  );
}
```

### File: `frontend\app\globals.css`

```css
@import "tailwindcss";
@import "tw-animate-css";

@custom-variant dark (&:is(.dark *));

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --font-sans: var(--font-inter);
  --font-mono: var(--font-jetbrains-mono);
  --font-heading: var(--font-inter);

  /* EstateVision HUD accents */
  --color-hud: var(--hud);
  --color-hud-dim: var(--hud-dim);
  --color-threat: var(--threat);
  --color-warn: var(--warn);

  --color-sidebar-ring: var(--sidebar-ring);
  --color-sidebar-border: var(--sidebar-border);
  --color-sidebar-accent-foreground: var(--sidebar-accent-foreground);
  --color-sidebar-accent: var(--sidebar-accent);
  --color-sidebar-primary-foreground: var(--sidebar-primary-foreground);
  --color-sidebar-primary: var(--sidebar-primary);
  --color-sidebar-foreground: var(--sidebar-foreground);
  --color-sidebar: var(--sidebar);
  --color-chart-5: var(--chart-5);
  --color-chart-4: var(--chart-4);
  --color-chart-3: var(--chart-3);
  --color-chart-2: var(--chart-2);
  --color-chart-1: var(--chart-1);
  --color-ring: var(--ring);
  --color-input: var(--input);
  --color-border: var(--border);
  --color-destructive: var(--destructive);
  --color-accent-foreground: var(--accent-foreground);
  --color-accent: var(--accent);
  --color-muted-foreground: var(--muted-foreground);
  --color-muted: var(--muted);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-secondary: var(--secondary);
  --color-primary-foreground: var(--primary-foreground);
  --color-primary: var(--primary);
  --color-popover-foreground: var(--popover-foreground);
  --color-popover: var(--popover);
  --color-card-foreground: var(--card-foreground);
  --color-card: var(--card);
  --radius-sm: calc(var(--radius) * 0.6);
  --radius-md: calc(var(--radius) * 0.8);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) * 1.4);
  --radius-2xl: calc(var(--radius) * 1.8);
  --radius-3xl: calc(var(--radius) * 2.2);
  --radius-4xl: calc(var(--radius) * 2.6);
}

/*
 * EstateVision is a dark-only surface. `:root` and `.dark` carry the same
 * tokens so shadcn's `dark:` variants resolve correctly while the app never
 * flashes a light theme.
 */
:root,
.dark {
  --radius: 0.625rem;

  --background: #0a0a0a;
  --foreground: #f8fafc;

  /* slate-900 @ 70% — the bento glass surface */
  --card: rgb(15 23 42 / 0.7);
  --card-foreground: #f8fafc;
  --popover: #0f172a;
  --popover-foreground: #f8fafc;

  /* red is the single "act on this" accent */
  --primary: #dc2626;
  --primary-foreground: #ffffff;

  --secondary: #1e293b;
  --secondary-foreground: #f8fafc;
  --muted: #1e293b;
  --muted-foreground: #94a3b8;
  --accent: #1e293b;
  --accent-foreground: #f8fafc;

  /* Kept visually distinct from --primary: brighter and more orange, so a
     real error never reads as just another red button. */
  --destructive: #ff3333;
  --border: #1e293b;
  --input: #1e293b;
  --ring: #ef4444;

  --hud: #ef4444;
  --hud-dim: rgb(239 68 68 / 0.35);
  --threat: #ff3333;
  --warn: #f59e0b;

  --chart-1: #ef4444;
  --chart-2: #f59e0b;
  --chart-3: #ff3333;
  --chart-4: #94a3b8;
  --chart-5: #64748b;

  --sidebar: #0a0a0a;
  --sidebar-foreground: #f8fafc;
  --sidebar-primary: #dc2626;
  --sidebar-primary-foreground: #ffffff;
  --sidebar-accent: #1e293b;
  --sidebar-accent-foreground: #f8fafc;
  --sidebar-border: #1e293b;
  --sidebar-ring: #ef4444;
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
  html {
    @apply font-sans;
    color-scheme: dark;
  }

  /* WCAG AA: every interactive element keeps a visible red focus ring. */
  :focus-visible {
    @apply ring-hud/70 outline-none ring-2 ring-offset-2 ring-offset-[#0a0a0a];
  }
}

@layer components {
  /* The bento glass card used across every dashboard surface. */
  .ev-card {
    @apply rounded-2xl border border-slate-800 bg-slate-900/70 backdrop-blur-md;
  }

  /* Thin neon divider — HUD rule, used sparingly between data groups. */
  .ev-divider {
    @apply h-px w-full border-0 bg-gradient-to-r from-transparent via-[#ef4444]/30 to-transparent;
  }

  /* Monospaced data label above a value. */
  .ev-label {
    @apply font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-slate-400;
  }

  /* Tiny red corner bracket for critical cards. */
  .ev-bracket::before {
    content: "";
    @apply pointer-events-none absolute left-0 top-0 h-4 w-4 rounded-tl-2xl border-l-2 border-t-2 border-[#ef4444]/70;
  }
}

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

### File: `frontend\app\layout.tsx`

```tsx
import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { Toaster } from "sonner";

import { ConfirmationModal } from "@/components/ConfirmationModal";
import { AuthProvider } from "@/providers/auth-provider";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "EstateVision — CCTV footage into structured intelligence",
  description:
    "Turn property CCTV footage into structured, exportable event data. Save hours, export proof, run your property smarter.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      // `dark` is fixed: EstateVision has no light theme, and pinning the class
      // keeps every shadcn `dark:` variant resolved on the first paint.
      className={`dark ${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-[#0A0A0A] text-slate-50">
        <AuthProvider>
          {children}
          <ConfirmationModal />
          <Toaster
            theme="dark"
            position="top-right"
            duration={5000}
            closeButton
            toastOptions={{
              classNames: {
                toast:
                  "!rounded-2xl !border !border-slate-800 !bg-slate-900/90 !text-slate-50 !backdrop-blur-md",
                description: "!text-slate-400",
                error: "!border-[#ff3333]/40",
                success: "!border-[#00f0ff]/40",
                warning: "!border-[#f59e0b]/40",
                closeButton:
                  "!border-slate-700 !bg-slate-800 !text-slate-300 hover:!text-slate-50",
              },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  );
}

```

### File: `frontend\app\login\page.tsx`

```tsx
"use client";

import {
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import {
  Camera,
  Clock3,
  Eye,
  EyeOff,
  FileCheck2,
  Loader2Icon,
  ShieldCheck,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { firebaseAuth, googleProvider } from "@/lib/firebase/client";
import { useAuth } from "@/providers/auth-provider";

type Mode = "signin" | "signup";

const NOT_CONFIGURED =
  "Sign-in isn't configured yet. Add your Firebase keys to .env.local, or run with NEXT_PUBLIC_USE_MOCKS=true.";

const FEATURES = [
  {
    icon: ShieldCheck,
    title: "Live threat detection",
    body: "Every camera watched in real time, with alerts the moment something needs eyes on it.",
  },
  {
    icon: Clock3,
    title: "Minutes, not hours",
    body: "A full day of footage audited in about four minutes, down from three-plus hours by hand.",
  },
  {
    icon: FileCheck2,
    title: "Reports you can hand over",
    body: "Exportable CSV and PDF proof, ready for owners, insurers, or the police.",
  },
  {
    icon: Camera,
    title: "Works with what you have",
    body: "Connects to your existing CCTV setup — no new hardware to install.",
  },
];

/** Firebase error codes → language a property manager can act on. */
function signUpMessage(error: unknown): string {
  const code = (error as { code?: string })?.code ?? "";
  if (code === "auth/email-already-in-use") {
    return "That email already has an account. Sign in instead.";
  }
  if (code === "auth/weak-password") {
    return "Pick a password with at least 6 characters.";
  }
  if (code === "auth/invalid-email") {
    return "That doesn't look like a valid email address.";
  }
  return "We couldn't create your account. Try again.";
}

/** Corner-bracket frame echoing the camera-mark logo and the bounding boxes
 *  the product draws around detected people and vehicles. */
function BracketIcon({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex size-10 shrink-0 items-center justify-center">
      <span className="absolute left-0 top-0 h-3 w-3 border-l-2 border-t-2 border-red-500/70" />
      <span className="absolute right-0 top-0 h-3 w-3 border-r-2 border-t-2 border-red-500/70" />
      <span className="absolute bottom-0 left-0 h-3 w-3 border-b-2 border-l-2 border-red-500/70" />
      <span className="absolute bottom-0 right-0 h-3 w-3 border-b-2 border-r-2 border-red-500/70" />
      <span className="text-red-400">{children}</span>
    </div>
  );
}

function ShowcasePanel() {
  return (
    <div className="relative hidden overflow-hidden bg-[#0A0A0A] lg:block">
      <Image
        src="/login-bg.jpg"
        alt=""
        fill
        priority
        className="object-cover"
      />
      {/* Gradient so the logo and copy stay legible over the photo */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/70 to-[#0A0A0A]/20" />
      <div className="absolute inset-0 bg-[#0A0A0A]/30" />

      <div className="relative flex h-full flex-col justify-between p-12 xl:p-16">
        <Image
          src="/estate-logo-v2.png"
          alt="estateVision"
          width={449}
          height={109}
          className="w-48 h-auto object-contain"
        />

        <div className="max-w-md">
          <span className="inline-flex items-center gap-2 rounded-full border border-red-500/25 bg-black/40 px-3 py-1 font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-red-400 backdrop-blur-sm">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-500" />
            Live detection preview
          </span>

          <h2 className="mt-5 text-3xl font-semibold leading-tight text-slate-50 xl:text-4xl">
            See everything.
            <br />
            Miss nothing.
          </h2>

          <ul className="mt-8 space-y-5">
            {FEATURES.map(({ icon: Icon, title, body }) => (
              <li key={title} className="flex items-start gap-4">
                <BracketIcon>
                  <Icon aria-hidden="true" className="size-4" />
                </BracketIcon>
                <div>
                  <p className="text-sm font-medium text-slate-100">
                    {title}
                  </p>
                  <p className="mt-0.5 text-sm text-slate-400">{body}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const {
    user,
    loading: authLoading,
    isMockSession,
    signInAsMockUser,
  } = useAuth();

  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [googleSubmitting, setGoogleSubmitting] = useState(false);

  const [resetOpen, setResetOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetSending, setResetSending] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  // Already signed in with a real Firebase session — never show the form. In
  // demo mode the stand-in session is ignored here so this page stays
  // reachable and the landing → login → dashboard flow is walkable.
  useEffect(() => {
    if (!authLoading && user && !isMockSession) router.replace("/dashboard");
  }, [authLoading, user, isMockSession, router]);

  function switchMode(next: Mode) {
    setMode(next);
    setConfirmPassword("");
  }

  /** Demo mode has no identity provider; hand straight off to the dashboard. */
  function completeMockSignIn(): boolean {
    if (!isMockSession) return false;
    signInAsMockUser();
    router.replace("/dashboard");
    return true;
  }

  const passwordsReady =
    mode === "signin"
      ? password.length > 0
      : password.length > 0 && confirmPassword.length > 0;
  const busy = submitting || googleSubmitting;
  const canSubmit = email.trim().length > 0 && passwordsReady && !busy;

  async function handleGoogle() {
    if (completeMockSignIn()) return;

    if (!firebaseAuth) {
      toast.error(NOT_CONFIGURED);
      return;
    }

    setGoogleSubmitting(true);
    try {
      await signInWithPopup(firebaseAuth, googleProvider);
      router.replace("/dashboard");
    } catch (error) {
      const code = (error as { code?: string })?.code ?? "";
      // Closing the popup is a deliberate cancel, not an error worth shouting about.
      if (
        code !== "auth/popup-closed-by-user" &&
        code !== "auth/cancelled-popup-request"
      ) {
        toast.error("Google sign-in didn't complete. Try again.");
      }
    } finally {
      setGoogleSubmitting(false);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSubmit) return;

    if (mode === "signup" && password !== confirmPassword) {
      toast.error("Those passwords don't match.");
      return;
    }

    if (completeMockSignIn()) return;

    if (!firebaseAuth) {
      toast.error(NOT_CONFIGURED);
      return;
    }

    setSubmitting(true);
    try {
      if (mode === "signin") {
        await signInWithEmailAndPassword(firebaseAuth, email.trim(), password);
      } else {
        await createUserWithEmailAndPassword(firebaseAuth, email.trim(), password);
      }
      router.replace("/dashboard");
    } catch (error) {
      // Fields stay filled so the user can correct one character and retry.
      toast.error(
        mode === "signin"
          ? "Incorrect email or password"
          : signUpMessage(error)
      );
    } finally {
      setSubmitting(false);
    }
  }

  async function handleReset(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!resetEmail.trim() || resetSending) return;

    // Demo mode has no mail provider; show the same confirmation.
    if (isMockSession) {
      setResetSent(true);
      return;
    }

    if (!firebaseAuth) {
      toast.error(NOT_CONFIGURED);
      return;
    }

    setResetSending(true);
    try {
      await sendPasswordResetEmail(firebaseAuth, resetEmail.trim());
    } catch {
      // Deliberately not surfaced: confirming which emails exist would leak
      // account membership. The confirmation below is shown either way.
    } finally {
      setResetSending(false);
      setResetSent(true);
    }
  }

  // Hold the card back until auth state is known, so a signed-in user never
  // sees the form flash before the redirect.
  if (authLoading || (user && !isMockSession)) {
    return (
      <main className="flex min-h-dvh items-center justify-center bg-[#0A0A0A]">
        <Loader2Icon
          aria-label="Loading"
          className="size-5 animate-spin text-red-500"
        />
      </main>
    );
  }

  return (
    <main className="grid min-h-dvh bg-[#0A0A0A] lg:grid-cols-2">
      <ShowcasePanel />

      <div className="flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-sm">
          <div className="text-center">
            <span className="text-lg font-semibold tracking-tight text-red-500 lg:hidden">
              estate<span className="text-slate-50">Vision</span>
            </span>
            <h1 className="mt-2 text-xl font-semibold text-slate-50 lg:mt-0">
              {mode === "signin" ? "Sign in to your account" : "Create your account"}
            </h1>
            <p className="mt-2 text-sm text-slate-400">
              {mode === "signin"
                ? "Welcome back — your properties are waiting."
                : "Set a password you'll remember. You can change it any time."}
            </p>
          </div>

          <Button
            type="button"
            size="lg"
            variant="outline"
            disabled={busy}
            onClick={() => void handleGoogle()}
            className="mt-8 h-11 w-full justify-center border-slate-700 bg-slate-950/60 text-slate-100 hover:bg-slate-800"
          >
            {googleSubmitting ? (
              <Loader2Icon aria-hidden="true" className="animate-spin" />
            ) : (
              <GoogleMark />
            )}
            Continue with Google
          </Button>

          <div className="my-6 flex items-center gap-3">
            <span className="h-px flex-1 bg-slate-800" />
            <span className="font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-slate-500">
              or
            </span>
            <span className="h-px flex-1 bg-slate-800" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div className="space-y-1.5">
              <label
                htmlFor="email"
                className="text-xs font-medium text-slate-300"
              >
                Email
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="you@property.com"
                value={email}
                disabled={busy}
                onChange={(event) => setEmail(event.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="password"
                className="text-xs font-medium text-slate-300"
              >
                Password
              </label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete={
                    mode === "signin" ? "current-password" : "new-password"
                  }
                  placeholder="••••••••"
                  value={password}
                  disabled={busy}
                  onChange={(event) => setPassword(event.target.value)}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-0 flex w-10 items-center justify-center text-slate-500 hover:text-slate-300"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff aria-hidden="true" className="size-4" />
                  ) : (
                    <Eye aria-hidden="true" className="size-4" />
                  )}
                </button>
              </div>
            </div>

            {mode === "signup" && (
              <div className="space-y-1.5">
                <label
                  htmlFor="confirm-password"
                  className="text-xs font-medium text-slate-300"
                >
                  Confirm password
                </label>
                <Input
                  id="confirm-password"
                  name="confirm-password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  disabled={busy}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                />
                {confirmPassword.length > 0 && confirmPassword !== password && (
                  <p className="text-xs text-red-400">Passwords don&apos;t match yet.</p>
                )}
              </div>
            )}

            <Button
              type="submit"
              size="lg"
              disabled={!canSubmit}
              className="h-11 w-full justify-center bg-red-600 font-semibold text-white hover:bg-red-600/85"
            >
              {submitting && (
                <Loader2Icon aria-hidden="true" className="animate-spin" />
              )}
              {mode === "signin" ? "Sign In" : "Create Account"}
            </Button>
          </form>

          <div className="mt-6 space-y-3 text-center text-sm">
            <p className="text-slate-400">
              {mode === "signin"
                ? "Don't have an account? "
                : "Already have an account? "}
              <button
                type="button"
                disabled={busy}
                onClick={() => switchMode(mode === "signin" ? "signup" : "signin")}
                className="rounded font-medium text-red-500 underline-offset-4 hover:underline disabled:opacity-50"
              >
                {mode === "signin" ? "Sign up" : "Sign in"}
              </button>
            </p>

            {mode === "signin" && !resetOpen && (
              <button
                type="button"
                onClick={() => {
                  setResetEmail(email);
                  setResetOpen(true);
                }}
                className="rounded text-slate-400 underline-offset-4 hover:text-slate-200 hover:underline"
              >
                Forgot password?
              </button>
            )}
          </div>

          {mode === "signin" && resetOpen && (
            <div className="mt-5 rounded-xl border border-slate-800 bg-slate-950/50 p-4">
              {resetSent ? (
                <p className="text-sm text-slate-300">
                  If an account exists for{" "}
                  <span className="font-mono text-slate-100">
                    {resetEmail.trim()}
                  </span>
                  , a reset link is on its way. Check your inbox and spam folder.
                </p>
              ) : (
                <form onSubmit={handleReset} className="space-y-3" noValidate>
                  <label
                    htmlFor="reset-email"
                    className="block text-xs font-medium text-slate-300"
                  >
                    Where should we send the reset link?
                  </label>
                  <Input
                    id="reset-email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@property.com"
                    value={resetEmail}
                    disabled={resetSending}
                    onChange={(event) => setResetEmail(event.target.value)}
                  />
                  <div className="flex gap-2">
                    <Button
                      type="submit"
                      size="lg"
                      disabled={!resetEmail.trim() || resetSending}
                      className="bg-red-600 font-semibold text-white hover:bg-red-600/85"
                    >
                      {resetSending && (
                        <Loader2Icon aria-hidden="true" className="animate-spin" />
                      )}
                      Send reset link
                    </Button>
                    <Button
                      type="button"
                      size="lg"
                      variant="ghost"
                      disabled={resetSending}
                      onClick={() => setResetOpen(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

function GoogleMark() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="size-4">
      <path
        fill="#4285F4"
        d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5a5.6 5.6 0 0 1-2.4 3.6v3h3.9c2.3-2.1 3.5-5.2 3.5-8.8Z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.2 0 5.9-1.1 7.9-2.9l-3.9-3c-1.1.7-2.4 1.2-4 1.2-3.1 0-5.7-2.1-6.6-4.9H1.4v3.1A12 12 0 0 0 12 24Z"
      />
      <path
        fill="#FBBC05"
        d="M5.4 14.4a7.2 7.2 0 0 1 0-4.6V6.7H1.4a12 12 0 0 0 0 10.8l4-3.1Z"
      />
      <path
        fill="#EA4335"
        d="M12 4.8c1.8 0 3.3.6 4.6 1.8l3.4-3.4A12 12 0 0 0 1.4 6.7l4 3.1C6.3 6.9 8.9 4.8 12 4.8Z"
      />
    </svg>
  );
}
```

### File: `frontend\app\page.tsx`

```tsx
import Image from "next/image";
import Link from "next/link";

const TEASER_STATS = [
  { label: "Hours reviewed", value: "12,480", hint: "across 38 properties" },
  { label: "Events extracted", value: "94,213", hint: "person · vehicle · package" },
  { label: "Avg. audit time", value: "4m 12s", hint: "down from 3h 40m" },
  { label: "Threats flagged", value: "1,206", hint: "escalated same day" },
  { label: "Exports generated", value: "7,845", hint: "CSV · PDF" },
  { label: "Cameras connected", value: "512", hint: "live ingest" },
] as const;

function TeaserWall() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      <div className="mx-auto grid h-full max-w-6xl grid-cols-2 gap-4 p-6 opacity-40 md:grid-cols-3">
        {TEASER_STATS.map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 backdrop-blur-sm"
          >
            <p className="text-sm font-medium text-zinc-400">{stat.label}</p>
            <p className="mt-2 font-mono text-3xl font-bold text-zinc-50">
              {stat.value}
            </p>
            <p className="mt-2 flex items-center gap-2 text-xs text-zinc-500">
              {/* Vibrant red pulse to match the 100Pay primary color */}
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-500" />
              {stat.hint}
            </p>
          </div>
        ))}
      </div>
      {/* Uses a radial mask to fade the wall out towards the center, ensuring text readability */}
      <div className="absolute inset-0 bg-zinc-950 [mask-image:radial-gradient(ellipse_at_center,transparent_10%,black_70%)]" />
    </div>
  );
}

function BackgroundVideo() {
  return (
    <div aria-hidden="true" className="fixed inset-0 -z-10 overflow-hidden">
      <video
        autoPlay
        muted
        loop
        playsInline
        className="h-full w-full object-cover"
      >
        <source src="/background.mp4" type="video/mp4" />
      </video>
      {/* Dark overlay so text stays readable over the footage */}
      <div className="absolute inset-0 bg-zinc-950/80" />
    </div>
  );
}

export default function Home() {
  return (
    <div className="relative flex min-h-screen flex-1 flex-col font-sans text-zinc-50">
      <BackgroundVideo />

      <header className="sticky top-0 z-50 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center px-6">
          <Link href="/" className="flex items-center">
            <Image
              src="/estate-logo-v2.png"
              alt="estateVision"
              width={449}
              height={109}
              priority
              className="h-14 w-auto sm:h-16"
            />
          </Link>

          <Link
            href="/login"
            className="ml-auto inline-flex h-9 items-center justify-center rounded-md bg-red-600 px-5 text-sm font-medium text-white transition-colors hover:bg-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
          >
            Login
          </Link>
        </div>
      </header>

      <main className="relative flex flex-1 items-center justify-center px-6 py-24">
        <TeaserWall />

        <div className="relative z-10 flex max-w-3xl flex-col items-center text-center">
          <span className="flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/80 px-4 py-1.5 text-sm font-medium text-zinc-300 backdrop-blur-md">
            <span className="h-2 w-2 animate-pulse rounded-full bg-red-500" />
            Live property intelligence
          </span>

          <h1 className="mt-8 text-4xl font-extrabold tracking-tight text-zinc-50 sm:text-6xl">
            Turn CCTV Footage into Structured Intelligence
          </h1>

          <p className="mt-6 max-w-xl text-lg text-zinc-400">
            Save hours. Export proof. Run your property smarter.
          </p>

          <Link
            href="/login"
            className="mt-10 inline-flex h-12 items-center justify-center rounded-md border border-zinc-700 bg-zinc-900 px-8 text-sm font-medium text-zinc-100 transition-colors hover:border-red-500/50 hover:bg-zinc-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
          >
            Start Auditing
          </Link>
        </div>
      </main>
    </div>
  );
}
```

### File: `frontend\CLAUDE.md`

```markdown
@AGENTS.md

```

### File: `frontend\components\ConfirmationModal.tsx`

```tsx
"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useUiStore } from "@/lib/store/uiStore";
import { cn } from "@/lib/utils";

/**
 * Single app-wide confirmation dialog, driven by `uiStore.requestConfirmation`.
 * Both buttons disable while an async confirm handler is in flight.
 */
export function ConfirmationModal() {
  const confirmation = useUiStore((s) => s.confirmation);
  const confirming = useUiStore((s) => s.confirming);
  const resolveConfirmation = useUiStore((s) => s.resolveConfirmation);
  const dismissConfirmation = useUiStore((s) => s.dismissConfirmation);

  return (
    <Dialog
      open={Boolean(confirmation)}
      onOpenChange={(open) => {
        if (!open) dismissConfirmation();
      }}
    >
      {confirmation && (
        <DialogContent
          showCloseButton={false}
          className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 backdrop-blur-md"
        >
          <DialogHeader>
            <DialogTitle className="text-base text-slate-50">
              {confirmation.title}
            </DialogTitle>
            <DialogDescription className="text-slate-400">
              {confirmation.description}
            </DialogDescription>
          </DialogHeader>

          <div className="mt-2 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button
              variant="outline"
              size="lg"
              disabled={confirming}
              onClick={dismissConfirmation}
            >
              Cancel
            </Button>
            <Button
              size="lg"
              disabled={confirming}
              onClick={() => void resolveConfirmation()}
              className={cn(
                "font-semibold",
                confirmation.destructive
                  ? "bg-[#ff3333] text-slate-50 hover:bg-[#ff3333]/85"
                  : "bg-[#00f0ff] text-[#04141a] hover:bg-[#00f0ff]/85"
              )}
            >
              {confirming
                ? "Working…"
                : (confirmation.confirmLabel ?? "Confirm")}
            </Button>
          </div>
        </DialogContent>
      )}
    </Dialog>
  );
}

```

### File: `frontend\components\Dropzone.tsx`

```tsx
"use client";

import { UploadCloudIcon } from "lucide-react";
import { useRef, useState, type DragEvent } from "react";

import { ACCEPTED_EXTENSIONS } from "@/lib/store/uploadStore";
import { cn } from "@/lib/utils";

interface DropzoneProps {
  onFile: (file: File) => void;
  disabled?: boolean;
}

/**
 * Dashed drop target for a single recording. The file input stays visually
 * hidden but keyboard-focusable, and the label is its visible face — so the
 * control is reachable by tab, space and click alike.
 */
export function Dropzone({ onFile, disabled = false }: DropzoneProps) {
  const [dragging, setDragging] = useState(false);
  // Drag events fire on children too; count enters and leaves to stay accurate.
  const dragDepth = useRef(0);

  function handleDragEnter(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    if (disabled) return;
    dragDepth.current += 1;
    setDragging(true);
  }

  function handleDragLeave(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    dragDepth.current = Math.max(0, dragDepth.current - 1);
    if (dragDepth.current === 0) setDragging(false);
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    dragDepth.current = 0;
    setDragging(false);
    if (disabled) return;

    // One recording at a time — extra files are ignored rather than queued.
    const file = event.dataTransfer.files?.[0];
    if (file) onFile(file);
  }

  return (
    <div
      onDragEnter={handleDragEnter}
      onDragOver={(event) => event.preventDefault()}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      aria-disabled={disabled}
      className={cn(
        "flex flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-16 text-center transition-colors",
        dragging
          ? "border-red-500 bg-red-500/5"
          : "border-neutral-800 bg-neutral-900/70 backdrop-blur-md",
        disabled && "opacity-60"
      )}
    >
      <UploadCloudIcon
        aria-hidden="true"
        className={cn(
          "size-8 transition-colors",
          dragging ? "text-red-500" : "text-neutral-500"
        )}
      />

      <p className="mt-4 text-sm text-neutral-300">
        Drag a recording here, or pick one from your computer
      </p>
      <p className="ev-label mt-2 text-neutral-500">MP4 · MOV · AVI — up to 500 MB</p>

      <input
        id="ev-file-input"
        type="file"
        className="peer sr-only"
        accept={[...ACCEPTED_EXTENSIONS, "video/*"].join(",")}
        disabled={disabled}
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) onFile(file);
          // Reset so re-picking the same file after a Remove still fires change.
          event.target.value = "";
        }}
      />
      <label
        htmlFor="ev-file-input"
        className={cn(
          "mt-6 inline-flex h-10 cursor-pointer items-center rounded-lg bg-red-600 px-5 text-sm font-semibold text-white transition-colors hover:bg-red-700",
          "peer-focus-visible:ring-2 peer-focus-visible:ring-red-500/70 peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-[#0A0A0A]",
          disabled && "pointer-events-none"
        )}
      >
        Browse Files
      </label>
    </div>
  );
}
```

### File: `frontend\components\EmptyState.tsx`

```tsx
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  /** Usually a single primary Button. */
  action?: ReactNode;
  className?: string;
}

/** Shared "nothing here yet" panel for videos, events and reports. */
export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-800 bg-slate-900/70 px-6 py-16 text-center backdrop-blur-md",
        className
      )}
    >
      {Icon && (
        <span className="mb-4 flex size-12 items-center justify-center rounded-full border border-slate-800 bg-slate-900">
          <Icon aria-hidden="true" className="size-5 text-[#00f0ff]" />
        </span>
      )}
      <h2 className="text-base font-semibold text-slate-50">{title}</h2>
      <p className="mt-2 max-w-sm text-sm text-slate-400">{description}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}

```

### File: `frontend\components\EventTable.tsx`

```tsx
"use client";

import { FlagIcon } from "lucide-react";

import { SeverityBadge } from "@/components/SeverityBadge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDuration } from "@/lib/format";
import type { DetectionEvent } from "@/lib/types/event";
import { cn } from "@/lib/utils";

interface EventTableProps {
  events: DetectionEvent[];
  flaggedIds: string[];
  onSeek: (seconds: number) => void;
  onToggleFlag: (eventId: string) => void;
  disabled?: boolean;
}

export function EventTable({
  events,
  flaggedIds,
  onSeek,
  onToggleFlag,
  disabled = false,
}: EventTableProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/70 backdrop-blur-md">
      <Table>
        <TableHeader>
          <TableRow className="border-slate-800 hover:bg-transparent">
            <TableHead className="ev-label px-4">Time</TableHead>
            <TableHead className="ev-label px-4">Class</TableHead>
            <TableHead className="ev-label px-4">Severity</TableHead>
            <TableHead className="ev-label px-4">Detection</TableHead>
            <TableHead className="ev-label px-4 text-right">Conf.</TableHead>
            <TableHead className="ev-label px-4 text-right">Flag</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {events.map((event) => {
            const flagged = flaggedIds.includes(event.id);

            return (
              <TableRow
                key={event.id}
                className="border-slate-800 hover:bg-slate-800/40"
              >
                <TableCell className="px-4">
                  <Button
                    variant="ghost"
                    size="xs"
                    disabled={disabled}
                    onClick={() => onSeek(event.timestamp_seconds)}
                    className="font-mono text-red-500 tabular-nums hover:bg-red-500/10"
                  >
                    {formatDuration(event.timestamp_seconds)}
                    <span className="sr-only"> — jump to this moment</span>
                  </Button>
                </TableCell>

                <TableCell className="px-4 text-slate-300">
                  {event.object_class}
                </TableCell>

                <TableCell className="px-4">
                  <SeverityBadge severity={event.severity} />
                </TableCell>

                <TableCell className="max-w-xs truncate px-4 text-slate-300">
                  {event.label}
                </TableCell>

                <TableCell className="px-4 text-right font-mono text-slate-400 tabular-nums">
                  {Math.round(event.confidence * 100)}%
                </TableCell>

                <TableCell className="px-4 text-right">
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    disabled={disabled}
                    aria-pressed={flagged}
                    aria-label={
                      flagged
                        ? `Remove flag from detection at ${formatDuration(event.timestamp_seconds)}`
                        : `Flag detection at ${formatDuration(event.timestamp_seconds)} for follow-up`
                    }
                    onClick={() => onToggleFlag(event.id)}
                  >
                    <FlagIcon
                      className={cn(
                        flagged ? "fill-[#f59e0b] text-[#f59e0b]" : "text-slate-500"
                      )}
                    />
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
```

### File: `frontend\components\EventTimeline.tsx`

```tsx
"use client";

import { SEVERITY_DOT, SEVERITY_LABELS } from "@/components/SeverityBadge";
import { formatDuration } from "@/lib/format";
import type { DetectionEvent } from "@/lib/types/event";
import { cn } from "@/lib/utils";

interface EventTimelineProps {
  events: DetectionEvent[];
  durationSeconds: number;
  onSeek: (seconds: number) => void;
  disabled?: boolean;
}

/** HUD strip placing each detection along the recording's runtime. */
export function EventTimeline({
  events,
  durationSeconds,
  onSeek,
  disabled = false,
}: EventTimelineProps) {
  // A zero duration would put every marker at the same spot; spread them evenly.
  const usableDuration = durationSeconds > 0 ? durationSeconds : 0;

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 backdrop-blur-md">
      <div className="flex items-baseline justify-between">
        <p className="ev-label">Timeline</p>
        <p className="font-mono text-xs text-slate-500">
          {formatDuration(usableDuration)}
        </p>
      </div>

      <div className="relative mt-5 h-10">
        <div className="ev-divider absolute inset-x-0 top-1/2 -translate-y-1/2" />

        {events.map((event, index) => {
          const position = usableDuration
            ? (event.timestamp_seconds / usableDuration) * 100
            : ((index + 1) / (events.length + 1)) * 100;

          return (
            <button
              key={event.id}
              type="button"
              disabled={disabled}
              onClick={() => onSeek(event.timestamp_seconds)}
              style={{ left: `${Math.min(Math.max(position, 0), 100)}%` }}
              className={cn(
                "absolute top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full p-1.5 transition-transform",
                !disabled && "hover:scale-125",
                disabled && "cursor-not-allowed opacity-60"
              )}
            >
              <span
                className={cn(
                  "block size-2.5 rounded-full ring-2 ring-[#0A0A0A]",
                  SEVERITY_DOT[event.severity]
                )}
              />
              <span className="sr-only">
                {SEVERITY_LABELS[event.severity]} at{" "}
                {formatDuration(event.timestamp_seconds)}: {event.label}. Jump to
                this moment.
              </span>
            </button>
          );
        })}

        {events.length === 0 && (
          <p className="absolute inset-0 flex items-center justify-center text-xs text-slate-500">
            No detections on this timeline
          </p>
        )}
      </div>
    </div>
  );
}

```

### File: `frontend\components\MetricCard.tsx`

```tsx
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface MetricCardProps {
  label: string;
  /** Rendered large and monospaced. */
  value: string;
  /** Optional secondary line under the value. */
  hint?: string;
  /** Adds the red glow + corner bracket. Reserve for genuinely critical figures. */
  critical?: boolean;
  children?: ReactNode;
  className?: string;
}

/**
 * Pure data display. Deliberately has no hover, cursor or focus affordance —
 * a MetricCard must never look clickable.
 */
export function MetricCard({
  label,
  value,
  hint,
  critical = false,
  children,
  className,
}: MetricCardProps) {
  return (
    <div
      className={cn(
        "relative rounded-2xl border border-slate-800 bg-slate-900/70 p-5 backdrop-blur-md",
        critical && "ev-bracket shadow-[0_0_15px_rgba(239,68,68,0.3)]",
        className
      )}
    >
      <p className="ev-label">{label}</p>
      <p
        className={cn(
          "mt-3 font-mono text-3xl font-semibold tabular-nums",
          critical ? "text-[#ef4444]" : "text-slate-50"
        )}
      >
        {value}
      </p>
      {hint && <p className="mt-2 text-xs text-slate-400">{hint}</p>}
      {children}
    </div>
  );
}
```

### File: `frontend\components\MultiSelectFilter.tsx`

```tsx
"use client";

import { ChevronDownIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface MultiSelectFilterProps {
  label: string;
  options: { value: string; label: string }[];
  selected: string[];
  disabled?: boolean;
  onChange: (selected: string[]) => void;
}

/**
 * Checkbox dropdown for the reports filter bar. Selections apply immediately
 * and the menu stays open so several can be toggled in one pass.
 */
export function MultiSelectFilter({
  label,
  options,
  selected,
  disabled = false,
  onChange,
}: MultiSelectFilterProps) {
  const summary =
    selected.length === 0
      ? `All ${label.toLowerCase()}`
      : selected.length === 1
        ? (options.find((option) => option.value === selected[0])?.label ??
          "1 selected")
        : `${selected.length} selected`;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        disabled={disabled || options.length === 0}
        render={
          <Button 
            variant="outline" 
            size="lg" 
            className="h-9 border-neutral-700 text-neutral-200 hover:bg-neutral-800" 
          />
        }
      >
        <span className="ev-label text-neutral-400">{label}</span>
        <span className="max-w-40 truncate text-neutral-200">{summary}</span>
        <ChevronDownIcon aria-hidden="true" />
      </DropdownMenuTrigger>

      <DropdownMenuContent 
        align="start" 
        className="w-64 border-neutral-800 bg-neutral-900 text-neutral-200"
      >
        {options.map((option) => (
          <DropdownMenuCheckboxItem
            key={option.value}
            checked={selected.includes(option.value)}
            closeOnClick={false}
            className="focus:bg-neutral-800 focus:text-neutral-50"
            onCheckedChange={(checked) =>
              onChange(
                checked
                  ? [...selected, option.value]
                  : selected.filter((value) => value !== option.value)
              )
            }
          >
            <span className="truncate">{option.label}</span>
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
```

### File: `frontend\components\SeverityBadge.tsx`

```tsx
import type { EventSeverity } from "@/lib/types/event";
import { cn } from "@/lib/utils";

const SEVERITY_STYLES: Record<EventSeverity, string> = {
  safe: "border-[#00f0ff]/40 bg-[#00f0ff]/10 text-[#00f0ff]",
  warning: "border-[#f59e0b]/40 bg-[#f59e0b]/10 text-[#f59e0b]",
  threat: "border-[#ff3333]/40 bg-[#ff3333]/10 text-[#ff3333]",
};

export const SEVERITY_LABELS: Record<EventSeverity, string> = {
  safe: "Safe",
  warning: "Warning",
  threat: "Threat",
};

/** Marker colour for the timeline, keyed to the same palette. */
export const SEVERITY_DOT: Record<EventSeverity, string> = {
  safe: "bg-[#00f0ff]",
  warning: "bg-[#f59e0b]",
  threat: "bg-[#ff3333]",
};

export function SeverityBadge({
  severity,
  className,
}: {
  severity: EventSeverity;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 font-mono text-[0.6875rem] uppercase tracking-[0.08em]",
        SEVERITY_STYLES[severity],
        className
      )}
    >
      <span aria-hidden="true" className="size-1.5 rounded-full bg-current" />
      {SEVERITY_LABELS[severity]}
    </span>
  );
}

```

### File: `frontend\components\Sidebar.tsx`

```tsx
"use client";

import { FileTextIcon, LayoutDashboardIcon, UploadIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentType } from "react";

const NAV_ITEMS: {
  href: string;
  label: string;
  icon: ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
}[] = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboardIcon },
  { href: "/dashboard/upload", label: "Upload", icon: UploadIcon },
  { href: "/dashboard/reports", label: "Reports", icon: FileTextIcon },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 top-16 hidden w-64 border-r border-slate-800/80 bg-[#0A0A0A] px-3 py-6 md:block">
      <nav className="space-y-1">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active =
            href === "/dashboard" ? pathname === href : pathname.startsWith(href);

          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? "page" : undefined}
              className={
                active
                  ? "flex items-center gap-3 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2.5 text-sm font-medium text-red-400"
                  : "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-400 transition-colors hover:bg-slate-900 hover:text-slate-100"
              }
            >
              <Icon aria-hidden className="size-4" />
              {label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
```

### File: `frontend\components\SkeletonLoader.tsx`

```tsx
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

/** Placeholder matching the MetricCard footprint in the bento grid. */
export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-neutral-800 bg-neutral-900/70 p-5 backdrop-blur-md",
        className
      )}
    >
      <Skeleton className="h-3 w-24 bg-neutral-800" />
      <Skeleton className="mt-4 h-9 w-20 bg-neutral-800" />
      <Skeleton className="mt-3 h-3 w-32 bg-neutral-800" />
    </div>
  );
}

/** Placeholder rows for list and table surfaces. */
export function SkeletonRows({
  rows = 4,
  className,
}: {
  rows?: number;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "divide-y divide-neutral-800 rounded-2xl border border-neutral-800 bg-neutral-900/70 backdrop-blur-md",
        className
      )}
    >
      {Array.from({ length: rows }, (_, index) => (
        <div key={index} className="flex items-center gap-4 p-4">
          <Skeleton className="h-4 flex-1 bg-neutral-800" />
          <Skeleton className="hidden h-4 w-24 bg-neutral-800 sm:block" />
          <Skeleton className="hidden h-4 w-28 bg-neutral-800 md:block" />
          <Skeleton className="h-8 w-16 bg-neutral-800" />
        </div>
      ))}
    </div>
  );
}

/** Plain stacked lines, for prose-shaped placeholders. */
export function SkeletonText({
  lines = 3,
  className,
}: {
  lines?: number;
  className?: string;
}) {
  return (
    <div className={cn("space-y-2", className)}>
      {Array.from({ length: lines }, (_, index) => (
        <Skeleton
          key={index}
          className={cn(
            "h-3 bg-neutral-800",
            index === lines - 1 ? "w-2/3" : "w-full"
          )}
        />
      ))}
    </div>
  );
}
```

### File: `frontend\components\StatusBadge.tsx`

```tsx
import { STATUS_LABELS } from "@/lib/format";
import type { VideoStatus } from "@/lib/types/event";
import { cn } from "@/lib/utils";

const STATUS_STYLES: Record<VideoStatus, string> = {
  queued: "border-slate-700 bg-slate-800/60 text-slate-300",
  processing: "border-[#f59e0b]/40 bg-[#f59e0b]/10 text-[#f59e0b]",
  complete: "border-[#22c55e]/40 bg-[#22c55e]/10 text-[#22c55e]",
  failed: "border-[#ff3333]/40 bg-[#ff3333]/10 text-[#ff3333]",
};

export function StatusBadge({
  status,
  className,
}: {
  status: VideoStatus;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 font-mono text-[0.6875rem] uppercase tracking-[0.08em]",
        STATUS_STYLES[status],
        className
      )}
    >
      {/* Only in-flight work pulses — a finished job shouldn't read as live. */}
      <span
        aria-hidden="true"
        className={cn(
          "size-1.5 rounded-full bg-current",
          status === "processing" && "animate-pulse"
        )}
      />
      {STATUS_LABELS[status]}
    </span>
  );
}
```

### File: `frontend\components\TopBar.tsx`

```tsx
"use client";

import { signOut } from "firebase/auth";
import { LogOutIcon, UploadIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { firebaseAuth } from "@/lib/firebase/client";
import { useAuth } from "@/providers/auth-provider";

/** First letters of the user's name or email, for the avatar. */
function initials(label: string | null | undefined): string {
  if (!label) return "?";
  const base = label.includes("@") ? label.split("@")[0] : label;
  const parts = base.trim().split(/[\s._-]+/).filter(Boolean);
  const letters = parts.length > 1 ? parts[0][0] + parts[1][0] : base.slice(0, 2);
  return letters.toUpperCase();
}

export function TopBar() {
  const router = useRouter();
  const { user } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  async function handleSignOut() {
    setMenuOpen(false);
    if (firebaseAuth) {
      await signOut(firebaseAuth).catch(() => {});
    }
    router.replace("/login");
  }

  const label = user?.displayName ?? user?.email ?? null;

  return (
    <header className="fixed inset-x-0 top-0 z-40 h-16 border-b border-neutral-800/80 bg-[#0A0A0A]/90 backdrop-blur-md">
      <div className="flex h-full items-center gap-4 px-4 md:px-6">
        <Link href="/dashboard" className="flex items-center">
          <Image
            src="/estate-logo-v2.png"
            alt="estateVision"
            width={449}
            height={109}
            priority
            className="h-7 w-auto"
          />
        </Link>

        <div className="ml-auto flex items-center gap-3">
          <Link
            href="/dashboard/upload"
            className="inline-flex h-9 items-center gap-2 rounded-md bg-red-600 px-4 text-sm font-medium text-white transition-colors hover:bg-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
          >
            <UploadIcon aria-hidden="true" className="size-4" />
            Upload Video
          </Link>

          <div ref={menuRef} className="relative">
            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              aria-expanded={menuOpen}
              aria-label="Account menu"
              className="flex size-9 items-center justify-center rounded-full border border-neutral-700 bg-neutral-900 text-xs font-semibold text-neutral-200 transition-colors hover:border-red-500/50"
            >
              {initials(label)}
            </button>

            {menuOpen && (
              <div className="absolute right-0 top-11 w-56 overflow-hidden rounded-xl border border-neutral-800 bg-neutral-900/95 py-1 shadow-xl backdrop-blur-md">
                <div className="border-b border-neutral-800 px-3 py-2.5">
                  <p className="truncate text-sm font-medium text-neutral-100">
                    {label ?? "Signed in"}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => void handleSignOut()}
                  className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm text-neutral-300 transition-colors hover:bg-neutral-800/60 hover:text-red-400"
                >
                  <LogOutIcon aria-hidden="true" className="size-4" />
                  Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
```

### File: `frontend\components\ui\badge.tsx`

```tsx
import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "group/badge inline-flex h-5 w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-4xl border border-transparent px-2 py-0.5 text-xs font-medium whitespace-nowrap transition-all focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&>svg]:pointer-events-none [&>svg]:size-3!",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground [a]:hover:bg-primary/80",
        secondary:
          "bg-secondary text-secondary-foreground [a]:hover:bg-secondary/80",
        destructive:
          "bg-destructive/10 text-destructive focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:focus-visible:ring-destructive/40 [a]:hover:bg-destructive/20",
        outline:
          "border-border text-foreground [a]:hover:bg-muted [a]:hover:text-muted-foreground",
        ghost:
          "hover:bg-muted hover:text-muted-foreground dark:hover:bg-muted/50",
        link: "text-primary underline-offset-4 hover:underline",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant = "default",
  render,
  ...props
}: useRender.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return useRender({
    defaultTagName: "span",
    props: mergeProps<"span">(
      {
        className: cn(badgeVariants({ variant }), className),
      },
      props
    ),
    render,
    state: {
      slot: "badge",
      variant,
    },
  })
}

export { Badge, badgeVariants }

```

### File: `frontend\components\ui\button.tsx`

```tsx
import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-lg border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/80",
        outline:
          "border-border bg-background hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:border-input dark:bg-input/30 dark:hover:bg-input/50",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-[color-mix(in_oklch,var(--secondary),var(--foreground)_5%)] aria-expanded:bg-secondary aria-expanded:text-secondary-foreground",
        ghost:
          "hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:hover:bg-muted/50",
        destructive:
          "bg-destructive/10 text-destructive hover:bg-destructive/20 focus-visible:border-destructive/40 focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:hover:bg-destructive/30 dark:focus-visible:ring-destructive/40",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default:
          "h-8 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
        xs: "h-6 gap-1 rounded-[min(var(--radius-md),10px)] px-2 text-xs in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-7 gap-1 rounded-[min(var(--radius-md),12px)] px-2.5 text-[0.8rem] in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-9 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
        icon: "size-8",
        "icon-xs":
          "size-6 rounded-[min(var(--radius-md),10px)] in-data-[slot=button-group]:rounded-lg [&_svg:not([class*='size-'])]:size-3",
        "icon-sm":
          "size-7 rounded-[min(var(--radius-md),12px)] in-data-[slot=button-group]:rounded-lg",
        "icon-lg": "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }

```

### File: `frontend\components\ui\card.tsx`

```tsx
import * as React from "react"

import { cn } from "@/lib/utils"

function Card({
  className,
  size = "default",
  ...props
}: React.ComponentProps<"div"> & { size?: "default" | "sm" }) {
  return (
    <div
      data-slot="card"
      data-size={size}
      className={cn(
        "group/card flex flex-col gap-(--card-spacing) overflow-hidden rounded-xl bg-card py-(--card-spacing) text-sm text-card-foreground ring-1 ring-foreground/10 [--card-spacing:--spacing(4)] has-data-[slot=card-footer]:pb-0 has-[>img:first-child]:pt-0 data-[size=sm]:[--card-spacing:--spacing(3)] data-[size=sm]:has-data-[slot=card-footer]:pb-0 *:[img:first-child]:rounded-t-xl *:[img:last-child]:rounded-b-xl",
        className
      )}
      {...props}
    />
  )
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "group/card-header @container/card-header grid auto-rows-min items-start gap-1 rounded-t-xl px-(--card-spacing) has-data-[slot=card-action]:grid-cols-[1fr_auto] has-data-[slot=card-description]:grid-rows-[auto_auto] [.border-b]:pb-(--card-spacing)",
        className
      )}
      {...props}
    />
  )
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      className={cn(
        "font-heading text-base leading-snug font-medium group-data-[size=sm]/card:text-sm",
        className
      )}
      {...props}
    />
  )
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  )
}

function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        className
      )}
      {...props}
    />
  )
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn("px-(--card-spacing)", className)}
      {...props}
    />
  )
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn(
        "flex items-center rounded-b-xl border-t bg-muted/50 p-(--card-spacing)",
        className
      )}
      {...props}
    />
  )
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
}

```

### File: `frontend\components\ui\dialog.tsx`

```tsx
"use client"

import * as React from "react"
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { XIcon } from "lucide-react"

function Dialog({ ...props }: DialogPrimitive.Root.Props) {
  return <DialogPrimitive.Root data-slot="dialog" {...props} />
}

function DialogTrigger({ ...props }: DialogPrimitive.Trigger.Props) {
  return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />
}

function DialogPortal({ ...props }: DialogPrimitive.Portal.Props) {
  return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />
}

function DialogClose({ ...props }: DialogPrimitive.Close.Props) {
  return <DialogPrimitive.Close data-slot="dialog-close" {...props} />
}

function DialogOverlay({
  className,
  ...props
}: DialogPrimitive.Backdrop.Props) {
  return (
    <DialogPrimitive.Backdrop
      data-slot="dialog-overlay"
      className={cn(
        "fixed inset-0 isolate z-50 bg-black/10 duration-100 supports-backdrop-filter:backdrop-blur-xs data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0",
        className
      )}
      {...props}
    />
  )
}

function DialogContent({
  className,
  children,
  showCloseButton = true,
  ...props
}: DialogPrimitive.Popup.Props & {
  showCloseButton?: boolean
}) {
  return (
    <DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Popup
        data-slot="dialog-content"
        className={cn(
          "fixed top-1/2 left-1/2 z-50 grid w-full max-w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 gap-4 rounded-xl bg-popover p-4 text-sm text-popover-foreground ring-1 ring-foreground/10 duration-100 outline-none sm:max-w-sm data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
          className
        )}
        {...props}
      >
        {children}
        {showCloseButton && (
          <DialogPrimitive.Close
            data-slot="dialog-close"
            render={
              <Button
                variant="ghost"
                className="absolute top-2 right-2"
                size="icon-sm"
              />
            }
          >
            <XIcon
            />
            <span className="sr-only">Close</span>
          </DialogPrimitive.Close>
        )}
      </DialogPrimitive.Popup>
    </DialogPortal>
  )
}

function DialogHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-header"
      className={cn("flex flex-col gap-2", className)}
      {...props}
    />
  )
}

function DialogFooter({
  className,
  showCloseButton = false,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  showCloseButton?: boolean
}) {
  return (
    <div
      data-slot="dialog-footer"
      className={cn(
        "-mx-4 -mb-4 flex flex-col-reverse gap-2 rounded-b-xl border-t bg-muted/50 p-4 sm:flex-row sm:justify-end",
        className
      )}
      {...props}
    >
      {children}
      {showCloseButton && (
        <DialogPrimitive.Close render={<Button variant="outline" />}>
          Close
        </DialogPrimitive.Close>
      )}
    </div>
  )
}

function DialogTitle({ className, ...props }: DialogPrimitive.Title.Props) {
  return (
    <DialogPrimitive.Title
      data-slot="dialog-title"
      className={cn(
        "font-heading text-base leading-none font-medium",
        className
      )}
      {...props}
    />
  )
}

function DialogDescription({
  className,
  ...props
}: DialogPrimitive.Description.Props) {
  return (
    <DialogPrimitive.Description
      data-slot="dialog-description"
      className={cn(
        "text-sm text-muted-foreground *:[a]:underline *:[a]:underline-offset-3 *:[a]:hover:text-foreground",
        className
      )}
      {...props}
    />
  )
}

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
}

```

### File: `frontend\components\ui\dropdown-menu.tsx`

```tsx
"use client"

import * as React from "react"
import { Menu as MenuPrimitive } from "@base-ui/react/menu"

import { cn } from "@/lib/utils"
import { ChevronRightIcon, CheckIcon } from "lucide-react"

function DropdownMenu({ ...props }: MenuPrimitive.Root.Props) {
  return <MenuPrimitive.Root data-slot="dropdown-menu" {...props} />
}

function DropdownMenuPortal({ ...props }: MenuPrimitive.Portal.Props) {
  return <MenuPrimitive.Portal data-slot="dropdown-menu-portal" {...props} />
}

function DropdownMenuTrigger({ ...props }: MenuPrimitive.Trigger.Props) {
  return <MenuPrimitive.Trigger data-slot="dropdown-menu-trigger" {...props} />
}

function DropdownMenuContent({
  align = "start",
  alignOffset = 0,
  side = "bottom",
  sideOffset = 4,
  className,
  ...props
}: MenuPrimitive.Popup.Props &
  Pick<
    MenuPrimitive.Positioner.Props,
    "align" | "alignOffset" | "side" | "sideOffset"
  >) {
  return (
    <MenuPrimitive.Portal>
      <MenuPrimitive.Positioner
        className="isolate z-50 outline-none"
        align={align}
        alignOffset={alignOffset}
        side={side}
        sideOffset={sideOffset}
      >
        <MenuPrimitive.Popup
          data-slot="dropdown-menu-content"
          className={cn("z-50 max-h-(--available-height) w-(--anchor-width) min-w-32 origin-(--transform-origin) overflow-x-hidden overflow-y-auto rounded-lg bg-popover p-1 text-popover-foreground shadow-md ring-1 ring-foreground/10 duration-100 outline-none data-[side=bottom]:slide-in-from-top-2 data-[side=inline-end]:slide-in-from-left-2 data-[side=inline-start]:slide-in-from-right-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:overflow-hidden data-closed:fade-out-0 data-closed:zoom-out-95", className )}
          {...props}
        />
      </MenuPrimitive.Positioner>
    </MenuPrimitive.Portal>
  )
}

function DropdownMenuGroup({ ...props }: MenuPrimitive.Group.Props) {
  return <MenuPrimitive.Group data-slot="dropdown-menu-group" {...props} />
}

function DropdownMenuLabel({
  className,
  inset,
  ...props
}: MenuPrimitive.GroupLabel.Props & {
  inset?: boolean
}) {
  return (
    <MenuPrimitive.GroupLabel
      data-slot="dropdown-menu-label"
      data-inset={inset}
      className={cn(
        "px-1.5 py-1 text-xs font-medium text-muted-foreground data-inset:pl-7",
        className
      )}
      {...props}
    />
  )
}

function DropdownMenuItem({
  className,
  inset,
  variant = "default",
  ...props
}: MenuPrimitive.Item.Props & {
  inset?: boolean
  variant?: "default" | "destructive"
}) {
  return (
    <MenuPrimitive.Item
      data-slot="dropdown-menu-item"
      data-inset={inset}
      data-variant={variant}
      className={cn(
        "group/dropdown-menu-item relative flex cursor-default items-center gap-1.5 rounded-md px-1.5 py-1 text-sm outline-hidden select-none focus:bg-accent focus:text-accent-foreground not-data-[variant=destructive]:focus:**:text-accent-foreground data-inset:pl-7 data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 data-[variant=destructive]:focus:text-destructive dark:data-[variant=destructive]:focus:bg-destructive/20 data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 data-[variant=destructive]:*:[svg]:text-destructive",
        className
      )}
      {...props}
    />
  )
}

function DropdownMenuSub({ ...props }: MenuPrimitive.SubmenuRoot.Props) {
  return <MenuPrimitive.SubmenuRoot data-slot="dropdown-menu-sub" {...props} />
}

function DropdownMenuSubTrigger({
  className,
  inset,
  children,
  ...props
}: MenuPrimitive.SubmenuTrigger.Props & {
  inset?: boolean
}) {
  return (
    <MenuPrimitive.SubmenuTrigger
      data-slot="dropdown-menu-sub-trigger"
      data-inset={inset}
      className={cn(
        "flex cursor-default items-center gap-1.5 rounded-md px-1.5 py-1 text-sm outline-hidden select-none focus:bg-accent focus:text-accent-foreground not-data-[variant=destructive]:focus:**:text-accent-foreground data-inset:pl-7 data-popup-open:bg-accent data-popup-open:text-accent-foreground data-open:bg-accent data-open:text-accent-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    >
      {children}
      <ChevronRightIcon className="ml-auto" />
    </MenuPrimitive.SubmenuTrigger>
  )
}

function DropdownMenuSubContent({
  align = "start",
  alignOffset = -3,
  side = "right",
  sideOffset = 0,
  className,
  ...props
}: React.ComponentProps<typeof DropdownMenuContent>) {
  return (
    <DropdownMenuContent
      data-slot="dropdown-menu-sub-content"
      className={cn("w-auto min-w-[96px] rounded-lg bg-popover p-1 text-popover-foreground shadow-lg ring-1 ring-foreground/10 duration-100 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95", className )}
      align={align}
      alignOffset={alignOffset}
      side={side}
      sideOffset={sideOffset}
      {...props}
    />
  )
}

function DropdownMenuCheckboxItem({
  className,
  children,
  checked,
  inset,
  ...props
}: MenuPrimitive.CheckboxItem.Props & {
  inset?: boolean
}) {
  return (
    <MenuPrimitive.CheckboxItem
      data-slot="dropdown-menu-checkbox-item"
      data-inset={inset}
      className={cn(
        "relative flex cursor-default items-center gap-1.5 rounded-md py-1 pr-8 pl-1.5 text-sm outline-hidden select-none focus:bg-accent focus:text-accent-foreground focus:**:text-accent-foreground data-inset:pl-7 data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      checked={checked}
      {...props}
    >
      <span
        className="pointer-events-none absolute right-2 flex items-center justify-center"
        data-slot="dropdown-menu-checkbox-item-indicator"
      >
        <MenuPrimitive.CheckboxItemIndicator>
          <CheckIcon
          />
        </MenuPrimitive.CheckboxItemIndicator>
      </span>
      {children}
    </MenuPrimitive.CheckboxItem>
  )
}

function DropdownMenuRadioGroup({ ...props }: MenuPrimitive.RadioGroup.Props) {
  return (
    <MenuPrimitive.RadioGroup
      data-slot="dropdown-menu-radio-group"
      {...props}
    />
  )
}

function DropdownMenuRadioItem({
  className,
  children,
  inset,
  ...props
}: MenuPrimitive.RadioItem.Props & {
  inset?: boolean
}) {
  return (
    <MenuPrimitive.RadioItem
      data-slot="dropdown-menu-radio-item"
      data-inset={inset}
      className={cn(
        "relative flex cursor-default items-center gap-1.5 rounded-md py-1 pr-8 pl-1.5 text-sm outline-hidden select-none focus:bg-accent focus:text-accent-foreground focus:**:text-accent-foreground data-inset:pl-7 data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    >
      <span
        className="pointer-events-none absolute right-2 flex items-center justify-center"
        data-slot="dropdown-menu-radio-item-indicator"
      >
        <MenuPrimitive.RadioItemIndicator>
          <CheckIcon
          />
        </MenuPrimitive.RadioItemIndicator>
      </span>
      {children}
    </MenuPrimitive.RadioItem>
  )
}

function DropdownMenuSeparator({
  className,
  ...props
}: MenuPrimitive.Separator.Props) {
  return (
    <MenuPrimitive.Separator
      data-slot="dropdown-menu-separator"
      className={cn("-mx-1 my-1 h-px bg-border", className)}
      {...props}
    />
  )
}

function DropdownMenuShortcut({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="dropdown-menu-shortcut"
      className={cn(
        "ml-auto text-xs tracking-widest text-muted-foreground group-focus/dropdown-menu-item:text-accent-foreground",
        className
      )}
      {...props}
    />
  )
}

export {
  DropdownMenu,
  DropdownMenuPortal,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
}

```

### File: `frontend\components\ui\input.tsx`

```tsx
import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "flex h-10 w-full rounded-lg border border-slate-800 bg-slate-950/60 px-3 py-2 text-sm text-slate-50 transition-colors outline-none",
        "placeholder:text-slate-500",
        "hover:border-slate-700",
        "focus-visible:border-[#00f0ff]/60 focus-visible:ring-2 focus-visible:ring-[#00f0ff]/40",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "aria-invalid:border-[#ff3333]/60 aria-invalid:ring-2 aria-invalid:ring-[#ff3333]/30",
        className
      )}
      {...props}
    />
  );
}

export { Input };

```

### File: `frontend\components\ui\progress.tsx`

```tsx
"use client"

import { Progress as ProgressPrimitive } from "@base-ui/react/progress"

import { cn } from "@/lib/utils"

function Progress({
  className,
  children,
  value,
  ...props
}: ProgressPrimitive.Root.Props) {
  return (
    <ProgressPrimitive.Root
      value={value}
      data-slot="progress"
      className={cn("flex flex-wrap gap-3", className)}
      {...props}
    >
      {children}
      <ProgressTrack>
        <ProgressIndicator />
      </ProgressTrack>
    </ProgressPrimitive.Root>
  )
}

function ProgressTrack({ className, ...props }: ProgressPrimitive.Track.Props) {
  return (
    <ProgressPrimitive.Track
      className={cn(
        "relative flex h-1 w-full items-center overflow-x-hidden rounded-full bg-muted",
        className
      )}
      data-slot="progress-track"
      {...props}
    />
  )
}

function ProgressIndicator({
  className,
  ...props
}: ProgressPrimitive.Indicator.Props) {
  return (
    <ProgressPrimitive.Indicator
      data-slot="progress-indicator"
      className={cn("h-full bg-primary transition-all", className)}
      {...props}
    />
  )
}

function ProgressLabel({ className, ...props }: ProgressPrimitive.Label.Props) {
  return (
    <ProgressPrimitive.Label
      className={cn("text-sm font-medium", className)}
      data-slot="progress-label"
      {...props}
    />
  )
}

function ProgressValue({ className, ...props }: ProgressPrimitive.Value.Props) {
  return (
    <ProgressPrimitive.Value
      className={cn(
        "ml-auto text-sm text-muted-foreground tabular-nums",
        className
      )}
      data-slot="progress-value"
      {...props}
    />
  )
}

export {
  Progress,
  ProgressTrack,
  ProgressIndicator,
  ProgressLabel,
  ProgressValue,
}

```

### File: `frontend\components\ui\skeleton.tsx`

```tsx
import { cn } from "@/lib/utils"

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn("animate-pulse rounded-md bg-muted", className)}
      {...props}
    />
  )
}

export { Skeleton }

```

### File: `frontend\components\ui\table.tsx`

```tsx
"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

function Table({ className, ...props }: React.ComponentProps<"table">) {
  return (
    <div
      data-slot="table-container"
      className="relative w-full overflow-x-auto"
    >
      <table
        data-slot="table"
        className={cn("w-full caption-bottom text-sm", className)}
        {...props}
      />
    </div>
  )
}

function TableHeader({ className, ...props }: React.ComponentProps<"thead">) {
  return (
    <thead
      data-slot="table-header"
      className={cn("[&_tr]:border-b", className)}
      {...props}
    />
  )
}

function TableBody({ className, ...props }: React.ComponentProps<"tbody">) {
  return (
    <tbody
      data-slot="table-body"
      className={cn("[&_tr:last-child]:border-0", className)}
      {...props}
    />
  )
}

function TableFooter({ className, ...props }: React.ComponentProps<"tfoot">) {
  return (
    <tfoot
      data-slot="table-footer"
      className={cn(
        "border-t bg-muted/50 font-medium [&>tr]:last:border-b-0",
        className
      )}
      {...props}
    />
  )
}

function TableRow({ className, ...props }: React.ComponentProps<"tr">) {
  return (
    <tr
      data-slot="table-row"
      className={cn(
        "border-b transition-colors hover:bg-muted/50 has-aria-expanded:bg-muted/50 data-[state=selected]:bg-muted",
        className
      )}
      {...props}
    />
  )
}

function TableHead({ className, ...props }: React.ComponentProps<"th">) {
  return (
    <th
      data-slot="table-head"
      className={cn(
        "h-10 px-2 text-left align-middle font-medium whitespace-nowrap text-foreground [&:has([role=checkbox])]:pr-0",
        className
      )}
      {...props}
    />
  )
}

function TableCell({ className, ...props }: React.ComponentProps<"td">) {
  return (
    <td
      data-slot="table-cell"
      className={cn(
        "p-2 align-middle whitespace-nowrap [&:has([role=checkbox])]:pr-0",
        className
      )}
      {...props}
    />
  )
}

function TableCaption({
  className,
  ...props
}: React.ComponentProps<"caption">) {
  return (
    <caption
      data-slot="table-caption"
      className={cn("mt-4 text-sm text-muted-foreground", className)}
      {...props}
    />
  )
}

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
}

```

### File: `frontend\components\ui\toast.tsx`

```tsx
"use client"

import * as React from "react"
import { Toast as ToastPrimitive } from "@base-ui/react/toast"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { XIcon, CircleCheckIcon, InfoIcon, TriangleAlertIcon, OctagonXIcon, Loader2Icon } from "lucide-react"

const toast = ToastPrimitive.createToastManager()

function ToastProvider({ ...props }: ToastPrimitive.Provider.Props) {
  return <ToastPrimitive.Provider {...props} />
}

function ToastPortal({ ...props }: ToastPrimitive.Portal.Props) {
  return <ToastPrimitive.Portal data-slot="toast-portal" {...props} />
}

function ToastViewport({ className, ...props }: ToastPrimitive.Viewport.Props) {
  return (
    <ToastPrimitive.Viewport
      data-slot="toast-viewport"
      className={cn(
        "pointer-events-none fixed inset-x-4 bottom-4 z-50 mx-auto w-auto max-w-sm outline-none sm:right-4 sm:left-auto sm:mx-0 sm:w-full",
        className
      )}
      {...props}
    />
  )
}

function Toast({ className, ...props }: ToastPrimitive.Root.Props) {
  return (
    <ToastPrimitive.Root
      data-slot="toast"
      className={cn(
        "group/toast pointer-events-auto absolute right-0 bottom-0 z-[calc(1000-var(--toast-index))] w-full origin-bottom rounded-2xl border bg-popover text-popover-foreground shadow-lg will-change-transform outline-none select-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50",
        "[--gap:0.75rem] [--height:var(--toast-frontmost-height,var(--toast-height))] [--offset-y:calc(var(--toast-offset-y)*-1+calc(var(--toast-index)*var(--gap)*-1)+var(--toast-swipe-movement-y))] [--peek:0.75rem] [--scale:calc(max(0,1-(var(--toast-index)*0.1)))] [--shrink:calc(1-var(--scale))]",
        "h-(--height) [transform:translateX(var(--toast-swipe-movement-x))_translateY(calc(var(--toast-swipe-movement-y)-(var(--toast-index)*var(--peek))-(var(--shrink)*var(--height))))_scale(var(--scale))] [transition:transform_500ms_cubic-bezier(0.22,1,0.36,1),opacity_500ms,height_150ms]",
        "after:absolute after:top-full after:left-0 after:h-[calc(var(--gap)+1px)] after:w-full after:content-['']",
        "data-expanded:h-(--toast-height) data-expanded:[transform:translateX(var(--toast-swipe-movement-x))_translateY(var(--offset-y))]",
        "data-limited:opacity-0 data-starting-style:[transform:translateY(150%)]",
        "[&[data-ending-style]:not([data-limited]):not([data-swipe-direction])]:[transform:translateY(150%)]",
        "data-ending-style:data-[swipe-direction=down]:[transform:translateY(calc(var(--toast-swipe-movement-y)+150%))]",
        "data-ending-style:data-[swipe-direction=left]:[transform:translateX(calc(var(--toast-swipe-movement-x)-150%))_translateY(var(--offset-y))]",
        "data-ending-style:data-[swipe-direction=right]:[transform:translateX(calc(var(--toast-swipe-movement-x)+150%))_translateY(var(--offset-y))]",
        "data-ending-style:data-[swipe-direction=up]:[transform:translateY(calc(var(--toast-swipe-movement-y)-150%))]",
        "data-expanded:data-ending-style:data-[swipe-direction=down]:[transform:translateY(calc(var(--toast-swipe-movement-y)+150%))]",
        "data-expanded:data-ending-style:data-[swipe-direction=left]:[transform:translateX(calc(var(--toast-swipe-movement-x)-150%))_translateY(var(--offset-y))]",
        "data-expanded:data-ending-style:data-[swipe-direction=right]:[transform:translateX(calc(var(--toast-swipe-movement-x)+150%))_translateY(var(--offset-y))]",
        "data-expanded:data-ending-style:data-[swipe-direction=up]:[transform:translateY(calc(var(--toast-swipe-movement-y)-150%))]",
        className
      )}
      {...props}
    />
  )
}

function ToastContent({ className, ...props }: ToastPrimitive.Content.Props) {
  return (
    <ToastPrimitive.Content
      data-slot="toast-content"
      className={cn(
        "flex h-full items-center gap-3 overflow-hidden p-4 transition-opacity duration-250 ease-[cubic-bezier(0.22,1,0.36,1)] data-behind:opacity-0 data-expanded:opacity-100",
        className
      )}
      {...props}
    />
  )
}

function ToastTitle({ className, ...props }: ToastPrimitive.Title.Props) {
  return (
    <ToastPrimitive.Title
      data-slot="toast-title"
      className={cn("text-sm font-medium", className)}
      {...props}
    />
  )
}

function ToastDescription({
  className,
  ...props
}: ToastPrimitive.Description.Props) {
  return (
    <ToastPrimitive.Description
      data-slot="toast-description"
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  )
}

function ToastAction({
  className,
  render = <Button variant="outline" size="sm" />,
  ...props
}: ToastPrimitive.Action.Props) {
  return (
    <ToastPrimitive.Action
      data-slot="toast-action"
      render={render}
      className={cn("shrink-0", className)}
      {...props}
    />
  )
}

function ToastClose({
  className,
  children,
  render = <Button variant="ghost" size="icon-sm" />,
  ...props
}: ToastPrimitive.Close.Props) {
  return (
    <ToastPrimitive.Close
      data-slot="toast-close"
      aria-label="Close toast"
      render={render}
      className={cn(
        "relative shrink-0 text-muted-foreground after:absolute after:-inset-2 after:content-[''] hover:text-foreground",
        className
      )}
      {...props}
    >
      {children ?? (
        <XIcon aria-hidden="true" />
      )}
    </ToastPrimitive.Close>
  )
}

function ToastIcon({ type }: { type: string | undefined }) {
  let icon: React.ReactNode = null

  if (type === "success") {
    icon = (
      <CircleCheckIcon aria-hidden="true" />
    )
  }

  if (type === "info") {
    icon = (
      <InfoIcon aria-hidden="true" />
    )
  }

  if (type === "warning") {
    icon = (
      <TriangleAlertIcon aria-hidden="true" />
    )
  }

  if (type === "error") {
    icon = (
      <OctagonXIcon className="text-destructive" aria-hidden="true" />
    )
  }

  if (type === "loading") {
    icon = (
      <Loader2Icon className="animate-spin" aria-hidden="true" />
    )
  }

  if (!icon) {
    return null
  }

  return (
    <span
      data-slot="toast-icon"
      className="shrink-0 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4"
    >
      {icon}
    </span>
  )
}

function ToastList() {
  const { toasts } = ToastPrimitive.useToastManager()

  return toasts.map((toastItem) => (
    <Toast key={toastItem.id} toast={toastItem}>
      <ToastContent>
        <ToastIcon type={toastItem.type} />
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <ToastTitle />
          <ToastDescription />
        </div>
        <ToastAction />
        <ToastClose />
      </ToastContent>
    </Toast>
  ))
}

function Toaster({
  children,
  toastManager = toast,
  ...props
}: ToastPrimitive.Provider.Props) {
  return (
    <ToastProvider toastManager={toastManager} {...props}>
      {children}
      <ToastPortal>
        <ToastViewport>
          <ToastList />
        </ToastViewport>
      </ToastPortal>
    </ToastProvider>
  )
}

const createToastManager = ToastPrimitive.createToastManager
const useToastManager = ToastPrimitive.useToastManager

export {
  Toaster,
  Toast,
  ToastAction,
  ToastClose,
  ToastContent,
  ToastDescription,
  ToastPortal,
  ToastProvider,
  ToastTitle,
  ToastViewport,
  createToastManager,
  toast,
  useToastManager,
}

```

### File: `frontend\components\UploadProgress.tsx`

```tsx
"use client";

import {
  Progress,
  ProgressLabel,
  ProgressValue,
} from "@/components/ui/progress";

/** Transfer bar shown while a file is being PUT to storage. */
export function UploadProgress({ value }: { value: number }) {
  return (
    <div className="rounded-2xl border border-neutral-800 bg-neutral-900/70 p-5 backdrop-blur-md">
      <Progress
        value={value}
        className="gap-2"
        aria-label="Upload progress"
      >
        <ProgressLabel className="flex items-center gap-2 text-xs text-neutral-300">
          <span
            aria-hidden="true"
            className="size-1.5 animate-pulse rounded-full bg-red-500"
          />
          Uploading
        </ProgressLabel>
        <ProgressValue className="font-mono text-xs tabular-nums text-neutral-400" />
      </Progress>
    </div>
  );
}
```

### File: `frontend\components\VideoPlayer.tsx`

```tsx
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

```

### File: `frontend\components.json`

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "base-nova",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "",
    "css": "app/globals.css",
    "baseColor": "neutral",
    "cssVariables": true,
    "prefix": ""
  },
  "iconLibrary": "lucide",
  "rtl": false,
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  },
  "menuColor": "default",
  "menuAccent": "subtle",
  "registries": {}
}

```

### File: `frontend\eslint.config.mjs`

```
import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;

```

### File: `frontend\lib\api\client.ts`

```typescript
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  getDoc,
  query,
  where,
  orderBy,
  type QueryConstraint,
} from "firebase/firestore";

import { currentUid, getDb } from "@/lib/firebase/client";
import mockData from "@/lib/mocks/events.mock.json";
import type {
  DashboardSummary,
  DetectionEvent,
  ReportExportRow,
  ReportFilters,
  ReportOptions,
  ReportPage,
  ReportRow,
  Video,
} from "@/lib/types/event";

/**
 * The single data gateway for the app. Every page and store reads through
 * these functions so the whole product runs on the frozen mock fixture when
 * NEXT_PUBLIC_USE_MOCKS=true — no Firebase project required.
 */
export const USE_MOCKS = process.env.NEXT_PUBLIC_USE_MOCKS === "true";

/** Error carrying a message that is safe to show a property manager verbatim. */
export class ApiError extends Error {
  constructor(message: string, readonly cause?: unknown) {
    super(message);
    this.name = "ApiError";
  }
}

/**
 * Session-local copies of the fixture. A mock delete mutates these so the
 * change is reflected across the dashboard and reports the way the real
 * backend would behave; a page reload restores the frozen data.
 */
let mockVideos = [...(mockData.videos as Video[])];
let mockEvents = [...(mockData.events as DetectionEvent[])];

/** Small delay so loading states are actually exercised in mock mode. */
function settle<T>(value: T): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), 350));
}

function summarise(videos: Video[], events: DetectionEvent[]): DashboardSummary {
  const counts = new Map<string, number>();
  for (const event of events) {
    counts.set(event.object_class, (counts.get(event.object_class) ?? 0) + 1);
  }

  return {
    total_videos: videos.length,
    total_events: events.length,
    top_object_classes: [...counts.entries()]
      .map(([object_class, count]) => ({ object_class, count }))
      .sort((a, b) => b.count - a.count || a.object_class.localeCompare(b.object_class))
      .slice(0, 5),
    recent_uploads: [...videos]
      .sort((a, b) => Date.parse(b.created_at) - Date.parse(a.created_at))
      .slice(0, 6),
  };
}

/**
 * Runs a scoped Firestore query and returns the documents as plain objects.
 *
 * Every query is forced through here so the mandatory `user_id` filter can
 * never be forgotten: Firestore rules reject a query they can't prove is safe,
 * so an unscoped read fails wholesale rather than returning a filtered subset
 * the way Postgres RLS did.
 */
async function fetchScoped<T>(
  collectionName: "videos" | "events",
  ...constraints: QueryConstraint[]
): Promise<T[]> {
  const snapshot = await getDocs(
    query(
      collection(getDb(), collectionName),
      where("user_id", "==", currentUid()),
      ...constraints
    )
  );

  return snapshot.docs.map((document) => ({
    id: document.id,
    ...document.data(),
  })) as T[];
}

export async function fetchDashboardSummary(): Promise<DashboardSummary> {
  if (USE_MOCKS) return settle(summarise(mockVideos, mockEvents));

  const [videos, events] = await Promise.all([
    fetchScoped<Video>("videos", orderBy("created_at", "desc")),
    fetchScoped<DetectionEvent>("events"),
  ]);

  return summarise(videos, events);
}

export async function fetchVideos(): Promise<Video[]> {
  if (USE_MOCKS) {
    return settle(
      [...mockVideos].sort(
        (a, b) => Date.parse(b.created_at) - Date.parse(a.created_at)
      )
    );
  }

  return fetchScoped<Video>("videos", orderBy("created_at", "desc"));
}

export async function fetchVideo(id: string): Promise<Video | null> {
  if (USE_MOCKS) return settle(mockVideos.find((v) => v.id === id) ?? null);

  const snapshot = await getDoc(doc(getDb(), "videos", id));
  if (!snapshot.exists()) return null;

  const video = { id: snapshot.id, ...snapshot.data() } as Video;

  // A direct document read bypasses the collection query's user_id filter, so
  // ownership is checked here. Reads for someone else's video are rejected by
  // the security rules too; this keeps the client honest either way.
  if (video.user_id !== currentUid()) return null;

  return video;
}

export async function fetchEventsForVideo(
  videoId: string
): Promise<DetectionEvent[]> {
  if (USE_MOCKS) {
    return settle(
      mockEvents
        .filter((e) => e.video_id === videoId)
        .sort((a, b) => a.timestamp_seconds - b.timestamp_seconds)
    );
  }

  return fetchScoped<DetectionEvent>(
    "events",
    where("video_id", "==", videoId),
    orderBy("timestamp_seconds", "asc")
  );
}

export async function fetchAllEvents(): Promise<DetectionEvent[]> {
  if (USE_MOCKS) return settle([...mockEvents]);

  return fetchScoped<DetectionEvent>("events");
}

/**
 * deleteVideo moved to app/actions/delete-video.ts as a Server Action.
 * Firestore has no DELETE WHERE, so deleting hundreds of event docs from the
 * browser is slow and partially fails. The Admin SDK's BulkWriter handles
 * batching and retries.
 */

/** Normalises anything thrown into a message worth showing the user. */
export function toUserMessage(error: unknown, fallback: string): string {
  if (error instanceof ApiError) return error.message;
  if (error instanceof Error && error.message) return error.message;
  return fallback;
}

// --- Reports -------------------------------------------------------------

const REPORT_PAGE_SIZE = 10;

/** Populates the filter bar's multi-selects. */
export async function fetchReportOptions(): Promise<ReportOptions> {
  const [videos, events] = await Promise.all([fetchVideos(), fetchAllEvents()]);

  return {
    videos: videos.map(({ id, name }) => ({ id, name })),
    objectClasses: [...new Set(events.map((e) => e.object_class))].sort(),
  };
}

/**
 * Joins events to their source video, then applies every filter with AND.
 * Kept in one place so the preview and the export can never disagree.
 */
function matchingPairs(
  videos: Video[],
  events: DetectionEvent[],
  filters: ReportFilters
): { video: Video; event: DetectionEvent }[] {
  const byId = new Map(videos.map((video) => [video.id, video]));

  return events.flatMap((event) => {
    const video = byId.get(event.video_id);
    if (!video) return [];

    // Dates compare as `yyyy-mm-dd` strings, which sort correctly.
    const day = video.created_at.slice(0, 10);
    if (filters.dateFrom && day < filters.dateFrom) return [];
    if (filters.dateTo && day > filters.dateTo) return [];
    if (filters.videoIds.length && !filters.videoIds.includes(video.id)) return [];
    if (
      filters.objectClasses.length &&
      !filters.objectClasses.includes(event.object_class)
    ) {
      return [];
    }

    return [{ video, event }];
  });
}

async function loadFilterable(): Promise<{
  videos: Video[];
  events: DetectionEvent[];
}> {
  const [videos, events] = await Promise.all([fetchVideos(), fetchAllEvents()]);
  return { videos, events };
}

/**
 * One page of the aggregated preview.
 *
 * Aggregation runs here rather than in the database: the counts are grouped
 * from a filtered fetch. Firestore has no GROUP BY, so at portfolio scale this
 * should move to a Cloud Function maintaining a rollup collection, or to
 * aggregation queries; the return shape is already the same.
 */
export async function fetchReportPage(
  filters: ReportFilters,
  cursor: string | null = null
): Promise<ReportPage> {
  const { videos, events } = await loadFilterable();
  const pairs = matchingPairs(videos, events, filters);

  const counts = new Map<string, ReportRow>();
  for (const { video, event } of pairs) {
    const date = video.created_at.slice(0, 10);
    const key = `${date}::${event.object_class}`;
    const existing = counts.get(key);
    if (existing) {
      existing.count += 1;
    } else {
      counts.set(key, { date, object_class: event.object_class, count: 1 });
    }
  }

  const allRows = [...counts.values()].sort(
    (a, b) =>
      b.date.localeCompare(a.date) ||
      b.count - a.count ||
      a.object_class.localeCompare(b.object_class)
  );

  const offset = cursor ? Number.parseInt(cursor, 10) || 0 : 0;
  const rows = allRows.slice(offset, offset + REPORT_PAGE_SIZE);
  const nextOffset = offset + rows.length;

  return {
    rows,
    nextCursor: nextOffset < allRows.length ? String(nextOffset) : null,
    totalEvents: pairs.length,
    matchingVideos: new Set(pairs.map(({ video }) => video.id)).size,
  };
}

/** The full filtered detection list, flattened for CSV/JSON export. */
export async function fetchReportExport(
  filters: ReportFilters
): Promise<ReportExportRow[]> {
  const { videos, events } = await loadFilterable();

  return matchingPairs(videos, events, filters)
    .sort(
      (a, b) =>
        Date.parse(b.video.created_at) - Date.parse(a.video.created_at) ||
        a.event.timestamp_seconds - b.event.timestamp_seconds
    )
    .map(({ video, event }) => ({
      video: video.name,
      uploaded_at: video.created_at,
      timestamp: formatClock(event.timestamp_seconds),
      object_class: event.object_class,
      severity: event.severity,
      confidence: Number(event.confidence.toFixed(2)),
      detection: event.label,
    }));
}

/** Seconds → `hh:mm:ss`, the stable form for an exported timestamp. */
function formatClock(seconds: number): string {
  const pad = (n: number) => String(Math.floor(n)).padStart(2, "0");
  return `${pad(seconds / 3600)}:${pad((seconds % 3600) / 60)}:${pad(seconds % 60)}`;
}

```

### File: `frontend\lib\export.ts`

```typescript
import Papa from "papaparse";

import type { ReportExportRow } from "@/lib/types/event";

/** Triggers a browser download for generated file contents. */
function download(filename: string, mimeType: string, contents: string) {
  const url = URL.createObjectURL(new Blob([contents], { type: mimeType }));
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  // Revoking immediately can cancel the download in some browsers.
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/** `estatevision-report-2026-08-06.csv` */
function filename(extension: string): string {
  return `estatevision-report-${new Date().toISOString().slice(0, 10)}.${extension}`;
}

export function exportAsCsv(rows: ReportExportRow[]) {
  download(filename("csv"), "text/csv;charset=utf-8", Papa.unparse(rows));
}

export function exportAsJson(rows: ReportExportRow[]) {
  download(
    filename("json"),
    "application/json",
    JSON.stringify(rows, null, 2)
  );
}

```

### File: `frontend\lib\firebase\admin.ts`

```typescript
import { cert, getApp, getApps, initializeApp } from "firebase-admin/app";
import { getAuth, type DecodedIdToken } from "firebase-admin/auth";
import { getFirestore, type Firestore } from "firebase-admin/firestore";

/**
 * Server-side Firebase, used only to verify ID tokens inside Server Actions.
 * Server Functions are reachable by direct POST, so every action re-verifies
 * the caller rather than trusting anything the client sends.
 */
function adminApp() {
  if (getApps().length) return getApp();

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  // Newlines survive .env round-trips as the literal two characters `\n`.
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error(
      "Firebase Admin is not configured. Set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL and FIREBASE_PRIVATE_KEY."
    );
  }

  return initializeApp({ credential: cert({ projectId, clientEmail, privateKey }) });
}

/** Verifies a Firebase ID token, throwing if it is missing or invalid. */
export async function requireUser(idToken: string | undefined): Promise<DecodedIdToken> {
  if (!idToken) throw new Error("You need to sign in again.");

  try {
    return await getAuth(adminApp()).verifyIdToken(idToken);
  } catch {
    throw new Error("Your session expired. Sign in again and retry.");
  }
}

/** Firestore Admin SDK for server-side data writes in Server Actions. */
export function getAdminDb(): Firestore {
  return getFirestore(adminApp());
}

```

### File: `frontend\lib\firebase\client.ts`

```typescript
import { getApp, getApps, initializeApp, type FirebaseOptions } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";

const firebaseConfig: FirebaseOptions = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

/**
 * True when enough config is present to actually talk to Firebase. In mock mode
 * the project is usually unconfigured, and initialising anyway throws on import
 * and takes the whole app down — so callers check this first.
 */
export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey && firebaseConfig.authDomain && firebaseConfig.projectId
);

export const firebaseApp = isFirebaseConfigured
  ? getApps().length
    ? getApp()
    : initializeApp(firebaseConfig)
  : null;

export const firebaseAuth = firebaseApp ? getAuth(firebaseApp) : null;

export const googleProvider = new GoogleAuthProvider();

/** Current user's Firebase ID token, or null when signed out / unconfigured. */
export async function getIdToken(): Promise<string | null> {
  const user = firebaseAuth?.currentUser;
  if (!user) return null;
  return user.getIdToken();
}

/** Firestore client for reading/writing data from the browser. */
export function getDb(): Firestore {
  if (!firebaseApp) {
    throw new Error(
      "Firebase is not configured. Set the NEXT_PUBLIC_FIREBASE_* env vars, or run with NEXT_PUBLIC_USE_MOCKS=true."
    );
  }
  return getFirestore(firebaseApp);
}

/** Current authenticated user's UID. Throws ApiError when signed out. */
export function currentUid(): string {
  const uid = firebaseAuth?.currentUser?.uid;
  if (!uid) {
    throw new Error("You need to sign in again.");
  }
  return uid;
}

```

### File: `frontend\lib\format.test.ts`

```typescript
import { describe, expect, it } from "vitest";

import { formatBytes, formatCount, formatDateTime, formatDuration } from "@/lib/format";

describe("formatBytes", () => {
  it("scales to a sensible unit", () => {
    expect(formatBytes(1024)).toBe("1 KB");
    expect(formatBytes(1024 * 1024)).toBe("1 MB");
    expect(formatBytes(1.5 * 1024 * 1024 * 1024)).toBe("1.5 GB");
  });

  it("handles the zero and negative cases without NaN", () => {
    // Math.log(0) is -Infinity, which would index sizes[] out of bounds.
    expect(formatBytes(0)).toBe("0 MB");
    expect(formatBytes(-5)).toBe("0 MB");
  });
});

describe("formatDuration", () => {
  it("omits the hour segment under an hour", () => {
    expect(formatDuration(1867)).toBe("31:07");
  });

  it("includes hours when present", () => {
    expect(formatDuration(3731)).toBe("1:02:11");
  });

  it("shows a dash for a video with no known duration", () => {
    // A queued or failed video has duration_seconds = 0.
    expect(formatDuration(0)).toBe("—");
  });
});

describe("formatDateTime", () => {
  it("renders a valid ISO timestamp", () => {
    expect(formatDateTime("2026-08-04T18:42:00.000Z")).not.toBe("—");
  });

  it("degrades to a dash rather than 'Invalid Date'", () => {
    expect(formatDateTime("not-a-date")).toBe("—");
    expect(formatDateTime("")).toBe("—");
  });
});

describe("formatCount", () => {
  it("groups thousands", () => {
    expect(formatCount(94213)).toBe(new Intl.NumberFormat().format(94213));
  });
});

```

### File: `frontend\lib\format.ts`

```typescript
import type { VideoStatus } from "@/lib/types/event";

/** Bytes → "450 KB", "412.5 MB", "1.2 GB". */
export function formatBytes(bytes: number, decimals = 1): string {
  if (bytes <= 0) return "0 MB";
  
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(decimals))} ${sizes[i]}`;
}

/** Seconds → "31:07" or "1:02:11". */
export function formatDuration(seconds: number): string {
  if (!seconds) return "—";
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  const pad = (n: number) => String(n).padStart(2, "0");
  return hours > 0
    ? `${hours}:${pad(minutes)}:${pad(secs)}`
    : `${minutes}:${pad(secs)}`;
}

/** ISO timestamp → "4 Aug 2026, 18:42" in the viewer's locale. */
export function formatDateTime(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/** Large counts → "94,213". */
export function formatCount(value: number): string {
  return value.toLocaleString();
}

export const STATUS_LABELS: Record<VideoStatus, string> = {
  queued: "Queued",
  processing: "Processing",
  complete: "Complete",
  failed: "Failed",
};
```

### File: `frontend\lib\mocks\events.mock.json`

```json
{
  "videos": [
    {
      "id": "vid_01hq8kx2m4",
      "user_id": "mock-user",
      "name": "north-gate-2026-08-04.mp4",
      "status": "complete",
      "created_at": "2026-08-04T18:42:11.000Z",
      "duration_seconds": 1847,
      "size_bytes": 412839221,
      "storage_key": "mock-user/vid_01hq8kx2m4/north-gate-2026-08-04.mp4",
      "event_count": 6,
      "thumbnail_url": null,
      "error_message": null
    },
    {
      "id": "vid_01hq8kx2m5",
      "user_id": "mock-user",
      "name": "loading-bay-overnight.mov",
      "status": "complete",
      "created_at": "2026-08-03T23:05:40.000Z",
      "duration_seconds": 3612,
      "size_bytes": 289471003,
      "storage_key": "mock-user/vid_01hq8kx2m5/loading-bay-overnight.mov",
      "event_count": 4,
      "thumbnail_url": null,
      "error_message": null
    },
    {
      "id": "vid_01hq8kx2m6",
      "user_id": "mock-user",
      "name": "lobby-cam-3-morning.mp4",
      "status": "processing",
      "created_at": "2026-08-05T07:18:02.000Z",
      "duration_seconds": 921,
      "size_bytes": 104857600,
      "storage_key": "mock-user/vid_01hq8kx2m6/lobby-cam-3-morning.mp4",
      "event_count": 0,
      "thumbnail_url": null,
      "error_message": null
    },
    {
      "id": "vid_01hq8kx2m7",
      "user_id": "mock-user",
      "name": "parking-level-b2.avi",
      "status": "queued",
      "created_at": "2026-08-05T07:44:55.000Z",
      "duration_seconds": 0,
      "size_bytes": 51380224,
      "storage_key": "mock-user/vid_01hq8kx2m7/parking-level-b2.avi",
      "event_count": 0,
      "thumbnail_url": null,
      "error_message": null
    },
    {
      "id": "vid_01hq8kx2m8",
      "user_id": "mock-user",
      "name": "service-corridor-west.mp4",
      "status": "failed",
      "created_at": "2026-08-02T14:12:30.000Z",
      "duration_seconds": 0,
      "size_bytes": 8388608,
      "storage_key": "mock-user/vid_01hq8kx2m8/service-corridor-west.mp4",
      "event_count": 0,
      "thumbnail_url": null,
      "error_message": "The file ended earlier than its header said it would, so it could not be decoded. Re-export the clip and upload it again."
    }
  ],
  "events": [
    {
      "id": "evt_7f1a20",
      "video_id": "vid_01hq8kx2m4",
      "user_id": "mock-user",
      "timestamp_seconds": 42,
      "object_class": "person",
      "confidence": 0.94,
      "severity": "safe",
      "label": "Resident entered through the north gate",
      "frame_url": null,
      "bbox": [0.31, 0.22, 0.14, 0.46]
    },
    {
      "id": "evt_7f1a21",
      "video_id": "vid_01hq8kx2m4",
      "user_id": "mock-user",
      "timestamp_seconds": 318,
      "object_class": "vehicle",
      "confidence": 0.89,
      "severity": "safe",
      "label": "Delivery van parked in the visitor bay",
      "frame_url": null,
      "bbox": [0.08, 0.41, 0.37, 0.33]
    },
    {
      "id": "evt_7f1a22",
      "video_id": "vid_01hq8kx2m4",
      "user_id": "mock-user",
      "timestamp_seconds": 604,
      "object_class": "package",
      "confidence": 0.77,
      "severity": "warning",
      "label": "Package left unattended by the gate for 9 minutes",
      "frame_url": null,
      "bbox": [0.52, 0.68, 0.09, 0.11]
    },
    {
      "id": "evt_7f1a23",
      "video_id": "vid_01hq8kx2m4",
      "user_id": "mock-user",
      "timestamp_seconds": 1122,
      "object_class": "person",
      "confidence": 0.91,
      "severity": "threat",
      "label": "Person climbed the perimeter fence",
      "frame_url": null,
      "bbox": [0.61, 0.14, 0.12, 0.52]
    },
    {
      "id": "evt_7f1a24",
      "video_id": "vid_01hq8kx2m4",
      "user_id": "mock-user",
      "timestamp_seconds": 1290,
      "object_class": "person",
      "confidence": 0.68,
      "severity": "warning",
      "label": "Loitering near the mailbox cluster",
      "frame_url": null,
      "bbox": [0.44, 0.29, 0.11, 0.44]
    },
    {
      "id": "evt_7f1a25",
      "video_id": "vid_01hq8kx2m4",
      "user_id": "mock-user",
      "timestamp_seconds": 1701,
      "object_class": "vehicle",
      "confidence": 0.96,
      "severity": "safe",
      "label": "Resident vehicle exited the north gate",
      "frame_url": null,
      "bbox": [0.12, 0.38, 0.41, 0.36]
    },
    {
      "id": "evt_7f1a26",
      "video_id": "vid_01hq8kx2m5",
      "user_id": "mock-user",
      "timestamp_seconds": 187,
      "object_class": "person",
      "confidence": 0.83,
      "severity": "safe",
      "label": "Night porter completed a walk-through",
      "frame_url": null,
      "bbox": [0.27, 0.31, 0.13, 0.42]
    },
    {
      "id": "evt_7f1a27",
      "video_id": "vid_01hq8kx2m5",
      "user_id": "mock-user",
      "timestamp_seconds": 1455,
      "object_class": "animal",
      "confidence": 0.62,
      "severity": "safe",
      "label": "Stray cat crossed the loading bay",
      "frame_url": null,
      "bbox": [0.71, 0.79, 0.07, 0.06]
    },
    {
      "id": "evt_7f1a28",
      "video_id": "vid_01hq8kx2m5",
      "user_id": "mock-user",
      "timestamp_seconds": 2604,
      "object_class": "vehicle",
      "confidence": 0.88,
      "severity": "warning",
      "label": "Unregistered vehicle idled at the bay door for 14 minutes",
      "frame_url": null,
      "bbox": [0.19, 0.44, 0.39, 0.31]
    },
    {
      "id": "evt_7f1a29",
      "video_id": "vid_01hq8kx2m5",
      "user_id": "mock-user",
      "timestamp_seconds": 3301,
      "object_class": "person",
      "confidence": 0.79,
      "severity": "threat",
      "label": "Forced entry attempt on the bay shutter",
      "frame_url": null,
      "bbox": [0.55, 0.26, 0.15, 0.49]
    }
  ]
}

```

### File: `frontend\lib\mocks\fixture.test.ts`

```typescript
import { describe, expect, it } from "vitest";

import mockData from "@/lib/mocks/events.mock.json";
import type { DetectionEvent, Video } from "@/lib/types/event";

/**
 * The fixture is what the whole app renders in mock mode, and its shape is also
 * the contract the Python worker writes to Firestore. If the two drift, mock
 * mode keeps working while production renders blanks — so the fields are
 * asserted here rather than trusted.
 *
 * Field names mirror worker/pipeline/event_builder.py::build_events and
 * frontend/app/actions/register-video.ts.
 */

const videos = mockData.videos as Video[];
const events = mockData.events as DetectionEvent[];

const VIDEO_STATUSES = ["queued", "processing", "complete", "failed"];
const SEVERITIES = ["safe", "warning", "threat"];

describe("mock fixture: videos", () => {
  it("is non-empty", () => {
    expect(videos.length).toBeGreaterThan(0);
  });

  it("carries every field the dashboard reads", () => {
    for (const video of videos) {
      expect(typeof video.id).toBe("string");
      expect(typeof video.user_id).toBe("string");
      expect(typeof video.name).toBe("string");
      expect(typeof video.storage_key).toBe("string");
      expect(typeof video.size_bytes).toBe("number");
      expect(typeof video.duration_seconds).toBe("number");
      expect(typeof video.event_count).toBe("number");
      expect(VIDEO_STATUSES).toContain(video.status);
    }
  });

  it("uses parseable ISO timestamps", () => {
    // The dashboard sorts on Date.parse(created_at); NaN silently breaks order.
    for (const video of videos) {
      expect(Number.isNaN(Date.parse(video.created_at))).toBe(false);
    }
  });

  it("has unique ids", () => {
    expect(new Set(videos.map((v) => v.id)).size).toBe(videos.length);
  });

  it("only carries an error message on failed videos", () => {
    for (const video of videos) {
      if (video.status !== "failed") {
        expect(video.error_message).toBeNull();
      }
    }
  });
});

describe("mock fixture: events", () => {
  it("is non-empty", () => {
    expect(events.length).toBeGreaterThan(0);
  });

  it("matches the schema the worker writes", () => {
    for (const event of events) {
      expect(typeof event.id).toBe("string");
      expect(typeof event.video_id).toBe("string");
      expect(typeof event.user_id).toBe("string");
      expect(typeof event.timestamp_seconds).toBe("number");
      expect(typeof event.object_class).toBe("string");
      expect(typeof event.label).toBe("string");
      expect(SEVERITIES).toContain(event.severity);
    }
  });

  it("keeps confidence in the 0–1 range the UI formats as a percentage", () => {
    for (const event of events) {
      expect(event.confidence).toBeGreaterThanOrEqual(0);
      expect(event.confidence).toBeLessThanOrEqual(1);
    }
  });

  it("uses a 4-element bbox or null", () => {
    for (const event of events) {
      if (event.bbox !== null) {
        expect(event.bbox).toHaveLength(4);
      }
    }
  });

  it("has unique ids", () => {
    expect(new Set(events.map((e) => e.id)).size).toBe(events.length);
  });

  it("references a video that exists", () => {
    // An orphaned event is dropped by the reports join and silently vanishes.
    const ids = new Set(videos.map((v) => v.id));
    for (const event of events) {
      expect(ids.has(event.video_id)).toBe(true);
    }
  });

  it("agrees with each video's denormalised event_count", () => {
    // The dashboard trusts event_count instead of counting; drift shows wrong
    // numbers with no error anywhere.
    for (const video of videos.filter((v) => v.status === "complete")) {
      const actual = events.filter((e) => e.video_id === video.id).length;
      expect(actual).toBe(video.event_count);
    }
  });

  it("never places an event past the end of its video", () => {
    const byId = new Map(videos.map((v) => [v.id, v]));
    for (const event of events) {
      const video = byId.get(event.video_id);
      if (video && video.duration_seconds > 0) {
        expect(event.timestamp_seconds).toBeLessThanOrEqual(video.duration_seconds);
      }
    }
  });
});

```

### File: `frontend\lib\store\reportsStore.ts`

```typescript
import { create } from "zustand";

import {
  fetchReportOptions,
  fetchReportPage,
  toUserMessage,
} from "@/lib/api/client";
import type {
  ReportFilters,
  ReportOptions,
  ReportRow,
} from "@/lib/types/event";

const EMPTY_FILTERS: ReportFilters = {
  dateFrom: null,
  dateTo: null,
  videoIds: [],
  objectClasses: [],
};

interface ReportsState {
  filters: ReportFilters;

  /** Accumulated preview rows across every page loaded so far. */
  rows: ReportRow[];
  /** Cursor for the next page; null once everything is loaded. */
  cursor: string | null;
  totalEvents: number;
  matchingVideos: number;

  options: ReportOptions;

  loading: boolean;
  loadingMore: boolean;
  error: string | null;
  /** False until the first page has settled, so empty ≠ not-yet-loaded. */
  loaded: boolean;

  loadOptions: () => Promise<void>;
  load: () => Promise<void>;
  loadMore: () => Promise<void>;
  setFilters: (patch: Partial<ReportFilters>) => Promise<void>;
  clearFilters: () => Promise<void>;
  reset: () => void;
}

/** True when at least one filter would narrow the result set. */
export function hasActiveFilters(filters: ReportFilters): boolean {
  return Boolean(
    filters.dateFrom ||
      filters.dateTo ||
      filters.videoIds.length ||
      filters.objectClasses.length
  );
}

export const useReportsStore = create<ReportsState>((set, get) => ({
  filters: EMPTY_FILTERS,
  rows: [],
  cursor: null,
  totalEvents: 0,
  matchingVideos: 0,
  options: { videos: [], objectClasses: [] },
  // Starts true: the page mounts before its first fetch effect runs, and a
  // false here renders neither skeleton nor results — a blank panel.
  loading: true,
  loadingMore: false,
  error: null,
  loaded: false,

  loadOptions: async () => {
    try {
      set({ options: await fetchReportOptions() });
    } catch {
      // Non-fatal: the filter bar degrades to empty menus, and the error from
      // the main query already tells the user something is wrong.
    }
  },

  load: async () => {
    set({ loading: true, error: null });
    try {
      const page = await fetchReportPage(get().filters, null);
      set({
        rows: page.rows,
        cursor: page.nextCursor,
        totalEvents: page.totalEvents,
        matchingVideos: page.matchingVideos,
        loading: false,
        loaded: true,
      });
    } catch (error) {
      set({
        rows: [],
        cursor: null,
        totalEvents: 0,
        matchingVideos: 0,
        loading: false,
        loaded: true,
        error: toUserMessage(error, "We couldn't build your report."),
      });
    }
  },

  loadMore: async () => {
    const { cursor, loadingMore, loading } = get();
    if (!cursor || loadingMore || loading) return;

    set({ loadingMore: true });
    try {
      const page = await fetchReportPage(get().filters, cursor);
      set((state) => ({
        rows: [...state.rows, ...page.rows],
        cursor: page.nextCursor,
        totalEvents: page.totalEvents,
        matchingVideos: page.matchingVideos,
        loadingMore: false,
      }));
    } catch (error) {
      set({
        loadingMore: false,
        error: toUserMessage(error, "We couldn't load more results."),
      });
    }
  },

  // Filters apply immediately — there is no separate Apply button.
  setFilters: async (patch) => {
    set((state) => ({ filters: { ...state.filters, ...patch } }));
    await get().load();
  },

  clearFilters: async () => {
    set({ filters: EMPTY_FILTERS });
    await get().load();
  },

  reset: () =>
    set({
      filters: EMPTY_FILTERS,
      rows: [],
      cursor: null,
      totalEvents: 0,
      matchingVideos: 0,
      loading: true,
      loadingMore: false,
      error: null,
      loaded: false,
    }),
}));

```

### File: `frontend\lib\store\uiStore.ts`

```typescript
import { create } from "zustand";

interface ConfirmationRequest {
  title: string;
  description: string;
  /** Label for the confirming action. Defaults to "Confirm". */
  confirmLabel?: string;
  /** Renders the confirm button in red. */
  destructive?: boolean;
  onConfirm: () => void | Promise<void>;
}

interface UiState {
  /** Mobile only — the sidebar is permanently expanded on desktop. */
  sidebarOpen: boolean;
  openSidebar: () => void;
  closeSidebar: () => void;
  toggleSidebar: () => void;

  confirmation: ConfirmationRequest | null;
  /** True while an async onConfirm is in flight; disables both modal buttons. */
  confirming: boolean;
  requestConfirmation: (request: ConfirmationRequest) => void;
  resolveConfirmation: () => Promise<void>;
  dismissConfirmation: () => void;
}

export const useUiStore = create<UiState>((set, get) => ({
  sidebarOpen: false,
  openSidebar: () => set({ sidebarOpen: true }),
  closeSidebar: () => set({ sidebarOpen: false }),
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),

  confirmation: null,
  confirming: false,
  requestConfirmation: (confirmation) => set({ confirmation, confirming: false }),

  resolveConfirmation: async () => {
    const { confirmation, confirming } = get();
    if (!confirmation || confirming) return;

    set({ confirming: true });
    try {
      await confirmation.onConfirm();
      set({ confirmation: null });
    } finally {
      // On failure the modal stays open so the caller's toast has context.
      set({ confirming: false });
    }
  },

  dismissConfirmation: () => {
    if (get().confirming) return;
    set({ confirmation: null });
  },
}));

```

### File: `frontend\lib\store\uploadStore.ts`

```typescript
import { create } from "zustand";

import { getStorageUrl } from "@/app/actions/get-storage-url";
import { registerVideo } from "@/app/actions/register-video";
import { startProcessing } from "@/app/actions/start-processing";
import { USE_MOCKS } from "@/lib/api/client";
import { getIdToken } from "@/lib/firebase/client";

export const MAX_UPLOAD_BYTES = 500 * 1024 * 1024; // 500 MB

export const ACCEPTED_EXTENSIONS = [".mp4", ".mov", ".avi"] as const;
export const ACCEPTED_MIME_TYPES = [
  "video/mp4",
  "video/quicktime",
  "video/x-msvideo",
  "video/avi",
] as const;

export type UploadStatus =
  | "idle" // nothing picked
  | "ready" // file picked, not started
  | "uploading"
  | "success"
  | "error";

interface UploadState {
  file: File | null;
  status: UploadStatus;
  /** 0–100. */
  progress: number;
  error: string | null;
  /**
   * Non-fatal problem after a successful upload — currently, the worker
   * handoff failing. The file is stored; only analysis didn't start.
   */
  warning: string | null;
  /** Set once the upload succeeds; the page redirects to this video. */
  videoId: string | null;

  selectFile: (file: File) => void;
  clearFile: () => void;
  startUpload: () => Promise<void>;
  cancelUpload: () => void;
  reset: () => void;
}

/** Kept outside the store: an XHR is not serialisable state. */
let activeRequest: XMLHttpRequest | null = null;
/** Set while a mock transfer is in flight; calling it aborts that transfer. */
let abortMockUpload: (() => void) | null = null;

function formatMb(bytes: number): string {
  return `${Math.round(bytes / (1024 * 1024))} MB`;
}

/** Returns a plain-language reason the file is unusable, or null if it's fine. */
export function validateFile(file: File): string | null {
  const extension = file.name.slice(file.name.lastIndexOf(".")).toLowerCase();
  const extensionOk = (ACCEPTED_EXTENSIONS as readonly string[]).includes(extension);
  // Some browsers report an empty type for .avi, so the extension is decisive.
  const mimeOk =
    !file.type || (ACCEPTED_MIME_TYPES as readonly string[]).includes(file.type);

  if (!extensionOk || !mimeOk) {
    return "That file type isn't supported. Upload an MP4, MOV or AVI.";
  }
  if (file.size === 0) {
    return "That file is empty. Pick the original recording and try again.";
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    return `That file is ${formatMb(file.size)}. The limit is 500 MB — split the recording and upload it in parts.`;
  }
  return null;
}

function cancelInFlight() {
  activeRequest?.abort();
  activeRequest = null;
  abortMockUpload?.();
  abortMockUpload = null;
}

export const useUploadStore = create<UploadState>((set, get) => ({
  file: null,
  status: "idle",
  progress: 0,
  error: null,
  videoId: null,
  warning: null,

  selectFile: (file) => {
    const problem = validateFile(file);
    if (problem) {
      set({
        file: null,
        status: "error",
        progress: 0,
        error: problem,
        warning: null,
        videoId: null,
      });
      return;
    }
    set({
      file,
      status: "ready",
      progress: 0,
      error: null,
      warning: null,
      videoId: null,
    });
  },

  clearFile: () => {
    get().cancelUpload();
    set({
      file: null,
      status: "idle",
      progress: 0,
      error: null,
      warning: null,
      videoId: null,
    });
  },

  startUpload: async () => {
    const { file, status } = get();
    if (!file || status === "uploading") return;

    set({
      status: "uploading",
      progress: 0,
      error: null,
      warning: null,
      videoId: null,
    });

    try {
      const idToken = (await getIdToken()) ?? "";

      const registration = await registerVideo({
        idToken,
        name: file.name,
        sizeBytes: file.size,
        contentType: file.type || "application/octet-stream",
      });
      if (!registration.ok) {
        set({ status: "error", error: registration.message });
        return;
      }

      const presigned = await getStorageUrl({
        idToken,
        storageKey: registration.video.storage_key,
        contentType: file.type || "application/octet-stream",
      });
      if (!presigned.ok) {
        set({ status: "error", error: presigned.message });
        return;
      }

      if (USE_MOCKS) {
        await new Promise<void>((resolve, reject) => {
          const timer = setInterval(() => {
            const next = Math.min(get().progress + 7, 100);
            set({ progress: next });
            if (next >= 100) {
              abortMockUpload = null;
              clearInterval(timer);
              resolve();
            }
          }, 120);

          abortMockUpload = () => {
            clearInterval(timer);
            reject(new DOMException("Aborted", "AbortError"));
          };
        });
        set({
          status: "success",
          progress: 100,
          videoId: registration.video.id,
          warning: null,
        });
        return;
      }

      // --- Network Resiliency: Retry Loop ---
      let uploadedSuccessfully = false;
      let attempt = 0;
      const maxAttempts = 3;

      while (attempt < maxAttempts && !uploadedSuccessfully) {
        attempt++;
        try {
          await new Promise<void>((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            activeRequest = xhr;

            xhr.open("PUT", presigned.url, true);
            xhr.setRequestHeader(
              "Content-Type",
              file.type || "application/octet-stream"
            );

            xhr.upload.onprogress = (event) => {
              if (!event.lengthComputable) return;
              set({ progress: Math.round((event.loaded / event.total) * 100) });
            };

            xhr.onload = () => {
              // A 403 here usually means CORS blocked the request
              if (xhr.status >= 200 && xhr.status < 300) {
                resolve();
              } else if (xhr.status === 403) {
                reject(new Error("Storage permission denied. Cloudflare CORS policy might still be updating."));
              } else {
                reject(new Error(`Storage rejected the file (Status ${xhr.status}).`));
              }
            };

            // Network drops and preflight CORS failures trigger this
            xhr.onerror = () => reject(new Error("NETWORK_ERROR"));
            xhr.onabort = () => reject(new DOMException("Aborted", "AbortError"));

            xhr.send(file);
          });

          uploadedSuccessfully = true;
        } catch (error) {
          if (error instanceof Error && error.message === "NETWORK_ERROR") {
            if (attempt >= maxAttempts) {
              throw new Error("The connection dropped multiple times. Please check your internet and try again.");
            }
            // Reset progress and wait 2 seconds before retrying
            set({ progress: 0 });
            await new Promise((r) => setTimeout(r, 2000));
          } else {
            throw error; // Fail immediately for non-network errors (like 403 CORS)
          }
        }
      }

      activeRequest = null;

      const handoff = await startProcessing({
        idToken,
        videoId: registration.video.id,
      });

      set({
        status: "success",
        progress: 100,
        videoId: registration.video.id,
        warning: handoff.ok ? null : handoff.message,
      });
    } catch (error) {
      activeRequest = null;
      abortMockUpload = null;

      if (error instanceof DOMException && error.name === "AbortError") return;

      set({
        status: "error",
        error:
          error instanceof Error
            ? error.message
            : "Something went wrong during the upload.",
      });
    }
  },

  cancelUpload: () => {
    if (get().status !== "uploading") return;
    cancelInFlight();
    set({ status: "ready", progress: 0, error: null });
  },

  reset: () => {
    cancelInFlight();
    set({
      file: null,
      status: "idle",
      progress: 0,
      error: null,
      warning: null,
      videoId: null,
    });
  },
}));
```

### File: `frontend\lib\store\videoDetailStore.ts`

```typescript
import { create } from "zustand";

import {
  fetchEventsForVideo,
  fetchVideo,
  toUserMessage,
} from "@/lib/api/client";
import { deleteVideo as deleteVideoAction } from "@/app/actions/delete-video";
import { startProcessing } from "@/app/actions/start-processing";
import { getIdToken } from "@/lib/firebase/client";
import type { DetectionEvent, EventSeverity, Video } from "@/lib/types/event";

interface VideoDetailState {
  video: Video | null;
  events: DetectionEvent[];
  loading: boolean;
  error: string | null;
  loadedId: string | null;

  severityFilter: EventSeverity | "all";
  classFilter: string | "all";
  flaggedOnly: boolean;
  flaggedIds: string[];

  deleting: boolean;
  retrying: boolean;
  
  pollInterval: ReturnType<typeof setInterval> | null;

  load: (id: string) => Promise<void>;
  setSeverityFilter: (severity: EventSeverity | "all") => void;
  setClassFilter: (objectClass: string | "all") => void;
  setFlaggedOnly: (flaggedOnly: boolean) => void;
  clearFilters: () => void;
  toggleFlag: (eventId: string) => void;
  removeVideo: (id: string) => Promise<void>;
  retryProcessing: (id: string) => Promise<void>;
  reset: () => void;
}

const INITIAL_FILTERS = {
  severityFilter: "all",
  classFilter: "all",
  flaggedOnly: false,
} satisfies Pick<
  VideoDetailState,
  "severityFilter" | "classFilter" | "flaggedOnly"
>;

export const useVideoDetailStore = create<VideoDetailState>((set, get) => ({
  video: null,
  events: [],
  loading: false,
  error: null,
  loadedId: null,
  ...INITIAL_FILTERS,
  flaggedIds: [],
  deleting: false,
  retrying: false,
  pollInterval: null,

  load: async (id) => {
    const { pollInterval: existingPoll } = get();
    if (existingPoll) clearInterval(existingPoll);

    set({ loading: true, error: null });

    const loadData = async () => {
      try {
        const video = await fetchVideo(id);

        if (!video) {
          set({
            video: null,
            events: [],
            loading: false,
            error: "That video isn't in your library.",
            loadedId: id,
          });
          return false; 
        }

        const events =
          video.status === "complete" ? await fetchEventsForVideo(id) : [];

        set({ video, events, loading: false, error: null, loadedId: id });

        return video.status === "processing" || video.status === "queued";
      } catch (error) {
        set({
          loading: false,
          error: toUserMessage(error, "We couldn't load this video."),
          loadedId: id,
        });
        return false; 
      }
    };

    const keepPolling = await loadData();

    if (keepPolling) {
      const interval = setInterval(async () => {
        const shouldContinue = await loadData();
        if (!shouldContinue) {
          clearInterval(interval);
          set({ pollInterval: null });
        }
      }, 3000);
      
      set({ pollInterval: interval });
    }
  },

  setSeverityFilter: (severityFilter) => set({ severityFilter }),
  setClassFilter: (classFilter) => set({ classFilter }),
  setFlaggedOnly: (flaggedOnly) => set({ flaggedOnly }),
  clearFilters: () => set({ ...INITIAL_FILTERS }),

  toggleFlag: (eventId) =>
    set((state) => ({
      flaggedIds: state.flaggedIds.includes(eventId)
        ? state.flaggedIds.filter((id) => id !== eventId)
        : [...state.flaggedIds, eventId],
    })),

  removeVideo: async (id) => {
    if (get().deleting) return;
    set({ deleting: true });
    try {
      const idToken = await getIdToken();
      const result = await deleteVideoAction({ idToken: idToken ?? "", videoId: id });
      if (!result.ok) {
        throw new Error(result.message);
      }
    } finally {
      set({ deleting: false });
    }
  },

  retryProcessing: async (id) => {
    if (get().retrying) return;
    set({ retrying: true });
    try {
      const idToken = await getIdToken();
      const result = await startProcessing({ idToken: idToken ?? "", videoId: id });
      if (!result.ok) {
        throw new Error(result.message);
      }
      // Re-trigger the load to pick up the new "processing" status and start polling
      await get().load(id);
    } finally {
      set({ retrying: false });
    }
  },

  reset: () => {
    const { pollInterval } = get();
    if (pollInterval) clearInterval(pollInterval);

    set({
      video: null,
      events: [],
      loading: false,
      error: null,
      loadedId: null,
      ...INITIAL_FILTERS,
      flaggedIds: [],
      deleting: false,
      retrying: false,
      pollInterval: null,
    });
  },
}));

export function filterEvents({
  events,
  severityFilter,
  classFilter,
  flaggedOnly,
  flaggedIds,
}: Pick<
  VideoDetailState,
  "events" | "severityFilter" | "classFilter" | "flaggedOnly" | "flaggedIds"
>): DetectionEvent[] {
  return events.filter((event) => {
    if (severityFilter !== "all" && event.severity !== severityFilter) {
      return false;
    }
    if (classFilter !== "all" && event.object_class !== classFilter) {
      return false;
    }
    if (flaggedOnly && !flaggedIds.includes(event.id)) return false;
    return true;
  });
}
```

### File: `frontend\lib\types\event.ts`

```typescript
/**
 * Frozen data schema shared by the Firestore collections and the mock fixture.
 * `lib/mocks/events.mock.json` must always satisfy these types.
 */

export type VideoStatus = "queued" | "processing" | "complete" | "failed";

/** Severity drives colour everywhere: cyan = safe, amber = warning, red = threat. */
export type EventSeverity = "safe" | "warning" | "threat";

export interface Video {
  id: string;
  user_id: string;
  /** Original filename shown to the user. */
  name: string;
  status: VideoStatus;
  /** ISO-8601 UTC. */
  created_at: string;
  duration_seconds: number;
  size_bytes: number;
  /** Object key in the storage bucket. */
  storage_key: string;
  /** Denormalised count so the dashboard avoids a second round-trip. */
  event_count: number;
  thumbnail_url: string | null;
  /** Plain-language reason, present only when status === "failed". */
  error_message: string | null;
}

export interface DetectionEvent {
  id: string;
  video_id: string;
  user_id: string;
  /** Offset into the video, in seconds. */
  timestamp_seconds: number;
  /** Detector class, e.g. "person", "vehicle", "package". */
  object_class: string;
  /** 0–1. */
  confidence: number;
  severity: EventSeverity;
  /** Human-readable summary of what happened. */
  label: string;
  frame_url: string | null;
  /** [x, y, width, height] normalised 0–1, null when the detector had no box. */
  bbox: [number, number, number, number] | null;
}

/** Aggregate powering the /dashboard executive summary. */
export interface DashboardSummary {
  total_videos: number;
  total_events: number;
  /** Highest-count classes first. */
  top_object_classes: { object_class: string; count: number }[];
  /** Most recent first, already trimmed to a display-sized page. */
  recent_uploads: Video[];
}

/** Shape returned by the register-video Server Action. */
export interface RegisteredVideo {
  id: string;
  storage_key: string;
}

/** Cross-video export filters. All fields combine with AND. */
export interface ReportFilters {
  /** Inclusive `yyyy-mm-dd` bounds on the source video's upload date. */
  dateFrom: string | null;
  dateTo: string | null;
  /** Source recordings to include. Empty means "all". */
  videoIds: string[];
  /** Detector classes to include. Empty means "all". */
  objectClasses: string[];
}

/** One aggregated preview row: how many detections of a class on a date. */
export interface ReportRow {
  date: string;
  object_class: string;
  count: number;
}

export interface ReportPage {
  rows: ReportRow[];
  /** Opaque cursor for the next page, or null when the last page is loaded. */
  nextCursor: string | null;
  /** Totals across the whole filtered set, not just the loaded pages. */
  totalEvents: number;
  matchingVideos: number;
}

/** Options that populate the filter bar's multi-selects. */
export interface ReportOptions {
  videos: { id: string; name: string }[];
  objectClasses: string[];
}

/** A single flattened row in a CSV/JSON export. */
export interface ReportExportRow {
  video: string;
  uploaded_at: string;
  timestamp: string;
  object_class: string;
  severity: EventSeverity;
  confidence: number;
  detection: string;
}

```

### File: `frontend\lib\utils.ts`

```typescript
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

```

### File: `frontend\next-env.d.ts`

```typescript
/// <reference types="next" />
/// <reference types="next/image-types/global" />
import "./.next/dev/types/routes.d.ts";

// NOTE: This file should not be edited
// see https://nextjs.org/docs/app/api-reference/config/typescript for more information.

```

### File: `frontend\next.config.ts`

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Google account avatars served for Firebase OAuth users.
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
    ],
  },

  // Turbopack configuration (top-level, not experimental)
  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;
```

### File: `frontend\package.json`

```json
{
  "name": "frontend",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev -p 3100",
    "build": "next build",
    "start": "next start -p 3100",
    "lint": "eslint",
    "typecheck": "tsc --noEmit",
    "test": "vitest run",
    "test:watch": "vitest"
  },
  "dependencies": {
    "@aws-sdk/client-s3": "^3.1100.0",
    "@aws-sdk/s3-request-presigner": "^3.1100.0",
    "@base-ui/react": "^1.6.0",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "firebase": "^12.17.0",
    "firebase-admin": "^14.2.0",
    "lucide-react": "^1.28.0",
    "next": "16.2.12",
    "papaparse": "^5.5.4",
    "react": "19.2.4",
    "react-dom": "19.2.4",
    "react-dropzone": "^19.1.1",
    "recharts": "^3.10.1",
    "shadcn": "^4.16.0",
    "sonner": "^2.0.7",
    "tailwind-merge": "^3.6.0",
    "tw-animate-css": "^1.4.0",
    "zustand": "^5.0.14"
  },
  "devDependencies": {
    "@tailwindcss/postcss": "^4",
    "@types/node": "^20",
    "@types/papaparse": "^5.5.2",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "eslint": "^9",
    "eslint-config-next": "16.2.12",
    "playwright": "^1.62.1",
    "tailwindcss": "^4",
    "typescript": "^5",
    "vitest": "^3.2.4"
  },
  "overrides": {
    "jose": "4.15.5"
  }
}
```

### File: `frontend\postcss.config.mjs`

```
const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};

export default config;

```

### File: `frontend\providers\auth-provider.tsx`

```tsx
"use client";

import { onAuthStateChanged, signOut } from "firebase/auth";
import { usePathname, useRouter } from "next/navigation";
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { USE_MOCKS } from "@/lib/api/client";
import { firebaseAuth, isFirebaseConfigured } from "@/lib/firebase/client";

/** The slice of the Firebase user the UI actually renders. */
export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

interface AuthContextValue {
  user: AuthUser | null;
  /** True until Firebase has reported the initial auth state. */
  loading: boolean;
  /**
   * True when the signed-in user is the mock stand-in rather than a real
   * Firebase session. /login uses this to stay reachable in demo mode.
   */
  isMockSession: boolean;
  signOutUser: () => Promise<void>;
  /**
   * Demo-mode only: re-establishes the stand-in session after a logout, so the
   * login page can hand off to /dashboard without a Firebase project.
   */
  signInAsMockUser: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

/** Routes that require a signed-in user. */
const PROTECTED_PREFIXES = ["/dashboard"];

/** Stand-in identity so the whole product is walkable with NEXT_PUBLIC_USE_MOCKS=true. */
const MOCK_USER: AuthUser = {
  uid: "mock-user",
  email: "manager@estatevision.demo",
  displayName: "Demo Manager",
  photoURL: null,
};

function isProtected(pathname: string): boolean {
  return PROTECTED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  // Mock mode without a Firebase project starts signed in, so no page ever
  // dead-ends on an auth redirect that can't be satisfied.
  const mockAuth = USE_MOCKS && !isFirebaseConfigured;

  const [user, setUser] = useState<AuthUser | null>(mockAuth ? MOCK_USER : null);
  const [loading, setLoading] = useState(!mockAuth);

  useEffect(() => {
    if (mockAuth || !firebaseAuth) return;

    return onAuthStateChanged(firebaseAuth, (firebaseUser) => {
      setUser(
        firebaseUser
          ? {
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              displayName: firebaseUser.displayName,
              photoURL: firebaseUser.photoURL,
            }
          : null
      );
      setLoading(false);
    });
  }, [mockAuth]);

  useEffect(() => {
    if (loading || user || !isProtected(pathname)) return;
    router.replace("/login");
  }, [loading, user, pathname, router]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      isMockSession: mockAuth,
      signOutUser: async () => {
        if (firebaseAuth) await signOut(firebaseAuth);
        setUser(null);
        router.replace("/login");
      },
      signInAsMockUser: () => {
        if (mockAuth) setUser(MOCK_USER);
      },
    }),
    [user, loading, mockAuth, router]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside <AuthProvider>.");
  }
  return context;
}

/** "Demo Manager" → "DM"; falls back to the email's first letter. */
export function initialsFor(user: AuthUser | null): string {
  const source = user?.displayName?.trim() || user?.email?.trim();
  if (!source) return "?";

  const words = source.split(/[\s@._-]+/).filter(Boolean);
  return words
    .slice(0, 2)
    .map((word) => word[0]!.toUpperCase())
    .join("");
}

```

### File: `frontend\README.md`

```markdown
This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

```

### File: `frontend\tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "react-jsx",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": [
    "next-env.d.ts",
    "**/*.ts",
    "**/*.tsx",
    ".next/types/**/*.ts",
    ".next/dev/types/**/*.ts",
    "**/*.mts"
  ],
  "exclude": ["node_modules"]
}

```

### File: `frontend\vitest.config.mts`

```
import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

export default defineConfig({
  resolve: {
    alias: { "@": fileURLToPath(new URL("./", import.meta.url)) },
  },
  test: {
    environment: "node",
    include: ["lib/**/*.test.ts"],
  },
});

```

