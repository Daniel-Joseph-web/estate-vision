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
