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