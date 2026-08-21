"use client";

import Image from "next/image";
import Link from "next/link";
import { 
  BotIcon, 
  FileTextIcon, 
  SearchIcon, 
  ShieldAlertIcon, 
  VideoIcon, 
  ZapIcon 
} from "lucide-react";

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
    title: "Live Threat Detection",
    description: "Connect existing CCTV feeds to our Vision Worker. The AI analyzes frames in real-time, highlighting unauthorized personnel and vehicles instantly.",
    icon: ShieldAlertIcon,
  },
  {
    title: "Forensic AI Chat",
    description: "Stop scrubbing through endless footage. Ask the AI 'What time did the red truck leave?' and instantly jump to the exact timestamp.",
    icon: BotIcon,
  },
  {
    title: "Automated Incident Reports",
    description: "Turn raw video into structured intelligence. Generate and export detailed audit logs for property owners, insurers, or law enforcement in seconds.",
    icon: FileTextIcon,
  }
];

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
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-500" />
              {stat.hint}
            </p>
          </div>
        ))}
      </div>
      <div className="absolute inset-0 bg-zinc-950 [mask-image:radial-gradient(ellipse_at_center,transparent_10%,black_70%)]" />
    </div>
  );
}

function BackgroundVideo() {
  return (
    <div aria-hidden="true" className="fixed inset-0 -z-10 overflow-hidden bg-black">
      <video
        autoPlay
        muted
        loop
        playsInline
        className="h-full w-full object-cover opacity-60"
      >
        <source src="/background.mp4" type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/80 via-zinc-950/60 to-zinc-950" />
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
              className="h-7 w-auto sm:h-8"
            />
          </Link>

          <Link
            href="/login"
            className="ml-auto inline-flex h-8 items-center justify-center rounded-md bg-red-600 px-4 text-xs font-medium text-white transition-colors hover:bg-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 sm:h-9 sm:px-5 sm:text-sm"
          >
            Command Center Login
          </Link>
        </div>
      </header>

      <main className="relative flex flex-col items-center">
        {/* HERO SECTION */}
        <section className="relative flex min-h-[calc(100vh-4rem)] w-full flex-col items-center justify-center px-6 py-24">
          <TeaserWall />

          <div className="relative z-10 flex max-w-3xl flex-col items-center text-center">
            <span className="flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/80 px-4 py-1.5 text-sm font-medium text-zinc-300 backdrop-blur-md">
              <span className="h-2 w-2 animate-pulse rounded-full bg-red-500" />
              Next-Gen Property Intelligence
            </span>

            <h1 className="mt-8 text-4xl font-extrabold tracking-tight text-zinc-50 sm:text-6xl">
              Turn CCTV Footage into Structured Intelligence
            </h1>

            <p className="mt-6 max-w-xl text-lg text-zinc-400">
              Deploy AI vision agents to monitor your properties, extract forensic evidence, and generate automated audit reports in minutes, not hours.
            </p>

            <Link
              href="/login"
              className="mt-10 inline-flex h-12 items-center justify-center rounded-md border border-zinc-700 bg-zinc-900 px-8 text-sm font-medium text-zinc-100 transition-colors hover:border-red-500/50 hover:bg-zinc-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
            >
              <ZapIcon className="mr-2 size-4 text-red-500" />
              Initialize System
            </Link>
          </div>
        </section>

        {/* CAPABILITIES SECTION */}
        <section className="w-full max-w-6xl px-6 py-24 pb-32">
          <div className="mb-16 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-zinc-100 sm:text-4xl">
              Engineered for Modern Security
            </h2>
            <p className="mt-4 text-zinc-400">
              Everything you need to automate video auditing without upgrading your hardware.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {FEATURES.map((feature) => (
              <div 
                key={feature.title} 
                className="group relative flex flex-col items-start rounded-2xl border border-zinc-800 bg-zinc-900/50 p-8 transition-colors hover:border-red-500/30 hover:bg-zinc-900/80"
              >
                <div className="mb-6 rounded-lg bg-zinc-950 p-3 ring-1 ring-zinc-800 group-hover:ring-red-500/50 transition-colors">
                  <feature.icon className="size-6 text-red-500" />
                </div>
                <h3 className="mb-3 text-lg font-semibold text-zinc-100">
                  {feature.title}
                </h3>
                <p className="text-sm leading-relaxed text-zinc-400">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}