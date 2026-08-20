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

  // ADD THIS LINE:
  console.log("FIREBASE KEY VISIBLE:", process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? "YES!" : "NO :(");

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
            {/* Added real logo for mobile/smaller screens */}
            <div className="mb-6 flex justify-center lg:hidden">
              <Image
                src="/estate-logo-v2.png"
                alt="estateVision"
                width={449}
                height={109}
                priority
                className="h-8 w-auto"
              />
            </div>
            
            <h1 className="text-xl font-semibold text-slate-50">
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