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
    if (mockAuth) return;

    // THE FIX: If Firebase fails to load, stop the spinner!
    if (!firebaseAuth) {
      setLoading(false);
      return;
    }

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