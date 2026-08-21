"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Big_Shoulders_Display, IBM_Plex_Mono } from "next/font/google";
import {
  BotIcon,
  FileTextIcon,
  RadarIcon,
  ShieldAlertIcon,
  ZapIcon,
} from "lucide-react";

// ── Design tokens ────────────────────────────────────────────────
// Base   #0A0D0F  panel #12171A  hairline #23292D
// Accent amber #F4A825 (detection / focus)   cyan #6FD3E0 (live / system)
// Red is reserved ONLY for genuine threat states — never decorative.

const display = Big_Shoulders_Display({
  subsets: ["latin"],
  weight: ["700", "800"],
  variable: "--font-display",
});
const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
});

const TEASER_STATS = [
  { label: "Hours reviewed", value: "12,480", hint: "across 38 properties" },
  { label: "Events extracted", value: "94,213", hint: "person · vehicle · package" },
  { label: "Avg. audit time", value: "4m 12s", hint: "down from 3h 40m" },
  { label: "Threats flagged", value: "1,206", hint: "escalated same day" },
  { label: "Exports generated", value: "7,845", hint: "CSV · PDF" },
  { label: "Cameras connected", value: "512", hint: "live ingest" },
] as const;

const FEATURES = [
  {
    tag: "DETECT",
    title: "Live Threat Detection",
    description:
      "Connect your existing CCTV feeds to the Vision Worker. Every frame is analyzed in real time, and unauthorized personnel or vehicles are flagged the instant they appear.",
    icon: ShieldAlertIcon,
  },
  {
    tag: "RETRIEVE",
    title: "Forensic AI Chat",
    description:
      "Stop scrubbing through hours of footage. Ask, \u201cwhat time did the red truck leave?\u201d and the player jumps straight to that second.",
    icon: BotIcon,
  },
  {
    tag: "REPORT",
    title: "Automated Incident Reports",
    description:
      "Every flag and query becomes structured intelligence — exportable audit logs ready for owners, insurers, or law enforcement in seconds.",
    icon: FileTextIcon,
  },
] as const;

/** Four corner brackets — the product's own detection frame, reused as a motif. */
function CornerBrackets({ className = "", color = "border-[#F4A825]" }: { className?: string; color?: string }) {
  const base = `absolute h-5 w-5 border-0 ${color} transition-all duration-300`;
  return (
    <div aria-hidden="true" className={`pointer-events-none absolute inset-0 ${className}`}>
      <span className={`${base} left-0 top-0 border-l-2 border-t-2`} />
      <span className={`${base} right-0 top-0 border-r-2 border-t-2`} />
      <span className={`${base} bottom-0 left-0 border-b-2 border-l-2`} />
      <span className={`${base} bottom-0 right-0 border-b-2 border-r-2`} />
    </div>
  );
}

function LiveClock() {
  const [now, setNow] = useState<string | null>(null);
  useEffect(() => {
    const tick = () =>
      setNow(
        new Date().toLocaleTimeString("en-US", {
          hour12: false,
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return <span className="tabular-nums">{now ?? "--:--:--"}</span>;
}

function TeaserWall() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="mx-auto grid h-full max-w-6xl grid-cols-2 gap-4 p-6 opacity-30 md:grid-cols-3">
        {TEASER_STATS.map((stat, i) => (
          <div
            key={stat.label}
            className="rounded-sm border border-[#23292D] bg-[#12171A]/60 p-5 backdrop-blur-sm"
            style={{ animationDelay: `${i * 90}ms` }}
          >
            <p className={`${mono.variable} font-[family:var(--font-mono)] text-[11px] uppercase tracking-widest text-zinc-500`}>
              {stat.label}
            </p>
            <p className={`${mono.variable} mt-2 font-[family:var(--font-mono)] text-2xl font-medium text-zinc-100`}>
              {stat.value}
            </p>
            <p className="mt-2 flex items-center gap-2 text-[11px] text-zinc-600">
              <span className="h-1 w-1 rounded-full bg-[#F4A825]" />
              {stat.hint}
            </p>
          </div>
        ))}
      </div>
      <div className="absolute inset-0 bg-[#0A0D0F] [mask-image:radial-gradient(ellipse_at_center,transparent_5%,black_75%)]" />
    </div>
  );
}

function BackgroundVideo() {
  return (
    <div aria-hidden="true" className="fixed inset-0 -z-10 overflow-hidden bg-[#050607]">
      <video autoPlay muted loop playsInline className="h-full w-full object-cover opacity-50">
        <source src="/background.mp4" type="video/mp4" />
      </video>
      {/* scanline texture — subtle CRT / monitor-wall feel */}
      <div
        className="absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, rgba(255,255,255,0.6) 0px, transparent 1px, transparent 3px)",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#0A0D0F]/85 via-[#0A0D0F]/70 to-[#0A0D0F]" />
    </div>
  );
}

export default function Home() {
  return (
    <div className={`${display.variable} ${mono.variable} relative flex min-h-screen flex-1 flex-col text-zinc-50`}>
      <BackgroundVideo />

      <header className="sticky top-0 z-50 border-b border-[#23292D] bg-[#0A0D0F]/85 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center px-6">
          <Link href="/" className="flex items-center">
            <Image
              src="/estate-logo-v2.png"
              alt="EstateVision"
              width={449}
              height={109}
              priority
              className="h-7 w-auto sm:h-8"
            />
          </Link>

          <div className="ml-auto flex items-center gap-6">
            <span className="hidden items-center gap-2 font-[family:var(--font-mono)] text-[11px] uppercase tracking-widest text-zinc-500 sm:flex">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#6FD3E0]" />
              All systems operational · <LiveClock />
            </span>
            <Link
              href="/login"
              className="inline-flex h-8 items-center justify-center rounded-sm bg-[#F4A825] px-4 text-xs font-semibold text-[#0A0D0F] transition-colors hover:bg-[#ffc257] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F4A825] sm:h-9 sm:px-5 sm:text-sm"
            >
              Command Center Login
            </Link>
          </div>
        </div>
      </header>

      <main className="relative flex flex-col items-center">
        {/* HERO — framed like the product's own viewfinder */}
        <section className="relative flex min-h-[calc(100vh-4rem)] w-full flex-col items-center justify-center px-6 py-24">
          <TeaserWall />

          <div className="relative z-10 mx-auto w-full max-w-3xl">
            <div className="relative border border-[#23292D]/0 px-4 py-10 sm:px-10">
              <CornerBrackets className="opacity-70" />

              <div className="mb-8 flex items-center justify-center gap-3 font-[family:var(--font-mono)] text-[11px] uppercase tracking-[0.2em] text-zinc-400">
                <span className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#F4A825]" /> REC
                </span>
                <span className="text-zinc-700">/</span>
                <span>CAM-04 · NORTH LOT</span>
                <span className="text-zinc-700">/</span>
                <span className="tabular-nums">
                  <LiveClock />
                </span>
              </div>

              <h1 className="text-center font-[family:var(--font-display)] text-5xl font-extrabold uppercase leading-[0.95] tracking-tight text-zinc-50 sm:text-7xl">
                Ask Your Cameras
                <br />
                <span className="text-[#F4A825]">What Happened.</span>
              </h1>

              <p className="mx-auto mt-8 max-w-xl text-center text-lg text-zinc-400">
                EstateVision watches every feed continuously, flags what matters instantly,
                and answers in plain language — down to the exact second.
              </p>

              <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Link
                  href="/login"
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-sm bg-[#F4A825] px-8 text-sm font-semibold text-[#0A0D0F] transition-colors hover:bg-[#ffc257] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F4A825]"
                >
                  <ZapIcon className="size-4" />
                  Initialize System
                </Link>
                <Link
                  href="#capabilities"
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-sm border border-[#23292D] px-8 text-sm font-medium text-zinc-300 transition-colors hover:border-[#F4A825]/50 hover:text-zinc-100"
                >
                  <RadarIcon className="size-4 text-[#6FD3E0]" />
                  See How It Watches
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* CAPABILITIES — cards get a detection bracket on hover */}
        <section id="capabilities" className="w-full max-w-6xl px-6 py-24 pb-32">
          <div className="mb-16 text-center">
            <p className="font-[family:var(--font-mono)] text-[11px] uppercase tracking-[0.2em] text-[#F4A825]">
              Engineered for modern security
            </p>
            <h2 className="mt-3 font-[family:var(--font-display)] text-4xl font-extrabold uppercase tracking-tight text-zinc-100 sm:text-5xl">
              Three Ways It Watches For You
            </h2>
            <p className="mt-4 text-zinc-400">
              No new hardware. Just the cameras you already own, finally able to think.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {FEATURES.map((feature) => (
              <div
                key={feature.title}
                className="group relative flex flex-col items-start rounded-sm border border-[#23292D] bg-[#12171A]/60 p-8 transition-colors hover:bg-[#12171A]"
              >
                <CornerBrackets className="opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                <span className="font-[family:var(--font-mono)] text-[11px] tracking-[0.2em] text-[#F4A825]">
                  [ {feature.tag} ]
                </span>

                <div className="my-5 rounded-sm bg-[#0A0D0F] p-3 ring-1 ring-[#23292D] transition-colors group-hover:ring-[#F4A825]/40">
                  <feature.icon className="size-6 text-[#F4A825]" />
                </div>

                <h3 className="mb-3 font-[family:var(--font-display)] text-xl font-bold uppercase tracking-tight text-zinc-100">
                  {feature.title}
                </h3>
                <p className="text-sm leading-relaxed text-zinc-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}