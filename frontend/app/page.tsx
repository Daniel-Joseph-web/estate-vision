import Image from "next/image";
import Link from "next/link";

const TEASER_STATS = [
  { label: "Hours reviewed", value: "12,480", hint: "across 38 properties" },
  { label: "Events extracted", value: "94,213", hint: "person · vehicle · package" },
  { label: "Avg. audit time", value: "4m 12s", hint: "down from 3h 40m" },
  { label: "Threats flagged", value: "1,206", hint: "escalated same day" },
  { label: "Exports generated", value: "7,845", hint: "CSV · PDF" },
  { label: "Cameras connected", value: "512", hint: "live ingest" },
] as const;

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
              {/* Vibrant red pulse to match the 100Pay primary color */}
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-500" />
              {stat.hint}
            </p>
          </div>
        ))}
      </div>
      {/* Uses a radial mask to fade the wall out towards the center, ensuring text readability */}
      <div className="absolute inset-0 bg-zinc-950 [mask-image:radial-gradient(ellipse_at_center,transparent_10%,black_70%)]" />
    </div>
  );
}

function BackgroundVideo() {
  return (
    <div aria-hidden="true" className="fixed inset-0 -z-10 overflow-hidden">
      <video
        autoPlay
        muted
        loop
        playsInline
        className="h-full w-full object-cover"
      >
        <source src="/background.mp4" type="video/mp4" />
      </video>
      {/* Dark overlay so text stays readable over the footage */}
      <div className="absolute inset-0 bg-zinc-950/80" />
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
              className="h-14 w-auto sm:h-16"
            />
          </Link>

          <Link
            href="/login"
            className="ml-auto inline-flex h-9 items-center justify-center rounded-md bg-red-600 px-5 text-sm font-medium text-white transition-colors hover:bg-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
          >
            Login
          </Link>
        </div>
      </header>

      <main className="relative flex flex-1 items-center justify-center px-6 py-24">
        <TeaserWall />

        <div className="relative z-10 flex max-w-3xl flex-col items-center text-center">
          <span className="flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/80 px-4 py-1.5 text-sm font-medium text-zinc-300 backdrop-blur-md">
            <span className="h-2 w-2 animate-pulse rounded-full bg-red-500" />
            Live property intelligence
          </span>

          <h1 className="mt-8 text-4xl font-extrabold tracking-tight text-zinc-50 sm:text-6xl">
            Turn CCTV Footage into Structured Intelligence
          </h1>

          <p className="mt-6 max-w-xl text-lg text-zinc-400">
            Save hours. Export proof. Run your property smarter.
          </p>

          <Link
            href="/login"
            className="mt-10 inline-flex h-12 items-center justify-center rounded-md border border-zinc-700 bg-zinc-900 px-8 text-sm font-medium text-zinc-100 transition-colors hover:border-red-500/50 hover:bg-zinc-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
          >
            Start Auditing
          </Link>
        </div>
      </main>
    </div>
  );
}