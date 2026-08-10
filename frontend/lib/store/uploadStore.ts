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