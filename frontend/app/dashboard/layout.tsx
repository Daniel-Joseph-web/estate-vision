"use client";

import { Loader2Icon, LayoutDashboardIcon, UploadIcon, FileTextIcon, UserCheckIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import { Sidebar } from "@/components/Sidebar";
import { TopBar } from "@/components/TopBar";
import { useAuth } from "@/providers/auth-provider";
import { cn } from "@/lib/utils";

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
      <main className="px-4 pb-24 pt-20 md:pl-64 md:pr-6">{children}</main>
      <MobileNav />
    </div>
  );
}

function MobileNav() {
  const pathname = usePathname();

  const links = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboardIcon },
    { href: "/dashboard/upload", label: "Upload", icon: UploadIcon },
    { href: "/dashboard/reports", label: "Reports", icon: FileTextIcon },
    { href: "/dashboard/watchlist", label: "Watchlist", icon: UserCheckIcon },
  ];

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 flex h-16 items-center justify-around border-t border-neutral-800 bg-[#0A0A0A]/80 backdrop-blur-xl md:hidden pb-safe">
      {links.map((link) => {
        const active =
          link.href === "/dashboard"
            ? pathname === link.href
            : pathname.startsWith(link.href);

        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "flex w-full flex-col items-center justify-center gap-1.5 transition-colors",
              active ? "text-red-500" : "text-neutral-500 hover:text-neutral-300"
            )}
          >
            <link.icon className="size-5" />
            <span className="text-[10px] font-medium tracking-wide">
              {link.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}