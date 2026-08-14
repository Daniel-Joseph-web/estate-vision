"use client";

import { LayoutDashboardIcon, UploadIcon } from "lucide-react";
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