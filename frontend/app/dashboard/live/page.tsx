"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Download, Play, Square, ActivityIcon, AlertTriangleIcon, CameraIcon, Terminal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { analyzeFrame } from "@/app/actions/analyze-frame";

const CAMERAS = [
  { id: "cam-01", name: "CAM_01: North Gate", src: "/cctv-feed.mp4" },
  { id: "cam-02", name: "CAM_02: Perimeter Fence", src: "/cctv-feed.mp4" },
  { id: "cam-03", name: "CAM_03: Loading Bay", src: "/cctv-feed.mp4" },
];

// How often to grab a frame and send it to Gemini while detection is on.
const ANALYSIS_INTERVAL_MS = 4000;

export default function LiveOperationsPage() {
  const [activeCam, setActiveCam] = useState(CAMERAS[0]);
  const [isDetecting, setIsDetecting] = useState(true);
  const [typewriterText, setTypewriterText] = useState("");
  const [logs, setLogs] = useState([
    { time: new Date().toLocaleTimeString(), text: "System initialized. Live feed active." }
  ]);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const logContainerRef = useRef<HTMLDivElement>(null);
  const isAnalyzingRef = useRef(false); // guards against overlapping requests

  // Mirrors isDetecting so an in-flight analyzeFrame call can check the
  // *current* state when it resolves, not the stale state it was fired with.
  const isDetectingRef = useRef(isDetecting);
  useEffect(() => {
    isDetectingRef.current = isDetecting;
  }, [isDetecting]);

  // Grab the current video frame as a base64 JPEG data URL
  const captureFrame = useCallback((): string | null => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas || video.readyState < 2) return null;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL("image/jpeg", 0.7); // 0.7 quality keeps payload small
  }, []);

  // Fake-type out a string into typewriterText, then push it to the log
  const typeAndLog = useCallback((text: string) => {
    let charIndex = 0;
    setTypewriterText("");

    const typeInterval = setInterval(() => {
      if (charIndex < text.length) {
        setTypewriterText((prev) => prev + text.charAt(charIndex));
        charIndex++;
      } else {
        clearInterval(typeInterval);
        setLogs((prev) => [...prev, { time: new Date().toLocaleTimeString(), text }]);
      }
    }, 25);
  }, []);

  // Capture a frame, send it to the analyzeFrame Server Action, type out the result
  const runAnalysis = useCallback(async () => {
    if (isAnalyzingRef.current) return; // don't overlap requests
    const frame = captureFrame();
    if (!frame) return;

    isAnalyzingRef.current = true;
    try {
      const result = await analyzeFrame({ image: frame, cameraName: activeCam.name });

      // Detection may have been stopped while this request was in flight —
      // drop the result instead of overwriting the "paused" state.
      if (!isDetectingRef.current) return;

      if (!result.ok) throw new Error(result.message || "Analysis failed");
      typeAndLog(result.text ?? "No response from model.");
    } catch (err) {
      if (!isDetectingRef.current) return; // same guard on the error path
      const message = err instanceof Error ? err.message : "Unknown error";
      typeAndLog(`WARNING: Analysis error — ${message}`);
    } finally {
      isAnalyzingRef.current = false;
    }
  }, [activeCam, captureFrame, typeAndLog]);

  // Poll while detection is on
  useEffect(() => {
    if (!isDetecting) {
      setTypewriterText("SYSTEM PAUSED - DETECTION OFFLINE");
      return;
    }

    runAnalysis(); // fire immediately on start/resume
    const interval = setInterval(runAnalysis, ANALYSIS_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [isDetecting, runAnalysis]);

  // Auto-scroll logs to bottom
  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTo({
        top: logContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [logs]);

  // Only stops analysis — the camera feed stays live regardless,
  // exactly like a real CCTV/security system: the camera never stops,
  // only the detection layer on top of it does.
  const toggleDetection = () => {
    setIsDetecting((prev) => !prev);
  };

  const exportLogs = () => {
    const reportContent = `ESTATEVISION LIVE AUDIT REPORT\nCamera: ${activeCam.name}\nDate: ${new Date().toLocaleDateString()}\n\n-- SESSION LOGS --\n` +
      logs.map(l => `[${l.time}] ${l.text}`).join('\n');

    const blob = new Blob([reportContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `EstateVision_Audit_${activeCam.id}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="mx-auto w-full max-w-[1800px]">
      <header className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-neutral-50 flex items-center gap-3">
            Command Center
            <span className="flex items-center gap-1.5 rounded-full border border-red-500/30 bg-red-500/10 px-2 py-0.5 text-xs text-red-400 animate-pulse">
              <div className="size-1.5 rounded-full bg-red-500" /> LIVE
            </span>
          </h1>
        </div>
        <div className="flex gap-2">
          {CAMERAS.map((cam) => (
            <Button
              key={cam.id}
              onClick={() => setActiveCam(cam)}
              variant={activeCam.id === cam.id ? "default" : "outline"}
              className={activeCam.id === cam.id ? "bg-red-600 hover:bg-red-700" : "bg-neutral-800 text-white"}
            >
              <CameraIcon className="size-4 mr-2" /> {cam.name.split(':')[0]}
            </Button>
          ))}
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Camera Feed */}
        <div className="lg:col-span-2 space-y-4">
          <div className="relative aspect-video overflow-hidden rounded-2xl border border-neutral-800 bg-black shadow-2xl">
            <video
              ref={videoRef}
              autoPlay
              muted
              loop
              playsInline
              crossOrigin="anonymous"
              src={activeCam.src}
              className="w-full h-full object-cover"
            />
            {/* Hidden canvas used only to grab frames — never rendered */}
            <canvas ref={canvasRef} className="hidden" />

            {/* Detection offline overlay — dims the feed without pausing it */}
            {!isDetecting && (
              <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px] flex items-center justify-center transition-opacity duration-500">
                <span className="flex items-center gap-2 rounded-full border border-amber-500/40 bg-black/70 px-4 py-1.5 font-mono text-xs text-amber-400">
                  <AlertTriangleIcon className="size-3.5" /> DETECTION OFFLINE — FEED STILL LIVE
                </span>
              </div>
            )}

            {/* Auto-Typing AI HUD */}
            <div className="absolute bottom-4 left-4 right-4 bg-black/70 backdrop-blur-md border border-red-500/30 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <Terminal className="size-4 text-red-400" />
                <span className="text-xs font-mono text-red-400">GEMINI VISION WORKER</span>
              </div>
              <p className="font-mono text-sm text-neutral-100">
                &gt; {typewriterText}
                <span className="animate-pulse ml-1 inline-block w-2 h-4 bg-red-500 align-middle"></span>
              </p>
            </div>

            <div className="absolute top-4 left-4">
              <span className="rounded bg-black/60 px-2 py-1 font-mono text-xs text-white backdrop-blur-md border border-white/10">
                {activeCam.name}
              </span>
            </div>
          </div>

          <div className="flex gap-3">
            <Button onClick={toggleDetection} className={isDetecting ? "bg-amber-600 hover:bg-amber-700" : "bg-emerald-600 hover:bg-emerald-700"}>
              {isDetecting ? <Square className="size-4 mr-2" /> : <Play className="size-4 mr-2" />}
              {isDetecting ? "Stop Detection" : "Resume Analysis"}
            </Button>
            <Button onClick={exportLogs} variant="outline" className="bg-neutral-800 text-white hover:bg-neutral-700 border-neutral-700">
              <Download className="size-4 mr-2" /> Export Audit Report
            </Button>
          </div>
        </div>

        {/* Live Event Ticker */}
        <div className="flex flex-col overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900/70 backdrop-blur-md h-[calc(100vh-14rem)]">
          <div className="border-b border-neutral-800 p-4">
            <h3 className="text-sm font-semibold text-neutral-100 flex items-center gap-2">
              <ActivityIcon className="size-4 text-emerald-400" /> Live Threat Logs
            </h3>
          </div>
          <div ref={logContainerRef} className="flex-1 overflow-y-auto p-4 space-y-3 font-mono scroll-smooth">
             {logs.map((log, i) => (
               <div key={i} className="flex flex-col gap-1 border-l-2 border-neutral-700 pl-3 opacity-90 animate-in fade-in slide-in-from-bottom-4">
                 <span className="text-[10px] text-neutral-500">{log.time}</span>
                 <span className={`text-xs ${log.text.includes('WARNING') ? 'text-red-400 font-bold' : 'text-neutral-300'}`}>
                   {log.text}
                 </span>
               </div>
             ))}
          </div>
        </div>
      </div>
    </div>
  );
}