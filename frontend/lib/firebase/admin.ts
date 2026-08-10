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
