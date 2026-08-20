"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { ActivityIcon } from "lucide-react";
import type { DetectionEvent } from "@/lib/types/event";

interface ActivityHeatmapProps {
  events: DetectionEvent[];
  posterUrl: string | null;
}

export function ActivityHeatmap({ events, posterUrl }: ActivityHeatmapProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear previous renders
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Filter events that actually have bounding boxes
    const validEvents = events.filter((e) => e.bbox !== null);
    if (validEvents.length === 0) return;

    // Draw the heatmap spots
    validEvents.forEach((event) => {
      const [x, y, width, height] = event.bbox!;
      
      // Calculate the center of the bounding box
      const centerX = (x + width / 2) * canvas.width;
      const centerY = (y + height / 2) * canvas.height;
      
      // Radius based on the size of the detected object
      const radius = Math.max((width * canvas.width) / 2, 20);

      // Create a radial gradient for a "heat" glow effect
      const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
      
      // Assign colors based on severity for extra points
      if (event.severity === "threat") {
        gradient.addColorStop(0, "rgba(255, 51, 51, 0.6)"); // Red core
        gradient.addColorStop(1, "rgba(255, 51, 51, 0)");
      } else if (event.severity === "warning") {
        gradient.addColorStop(0, "rgba(245, 158, 11, 0.4)"); // Amber core
        gradient.addColorStop(1, "rgba(245, 158, 11, 0)");
      } else {
        gradient.addColorStop(0, "rgba(0, 240, 255, 0.3)"); // Cyan core
        gradient.addColorStop(1, "rgba(0, 240, 255, 0)");
      }

      ctx.globalCompositeOperation = "screen"; // Blends colors together nicely
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.fill();
    });
  }, [events]);

  return (
    <div className="overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900/70 p-5 backdrop-blur-md">
      <div className="mb-4 flex items-center gap-2">
        <ActivityIcon className="size-4 text-emerald-400" />
        <h3 className="text-sm font-semibold text-neutral-100">Spatial Activity Heatmap</h3>
      </div>
      
      <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-black border border-neutral-800">
        {/* Background Reference Image */}
        {posterUrl ? (
          <Image 
            src={posterUrl} 
            alt="Reference Frame" 
            fill 
            className="object-cover opacity-50 grayscale" 
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-xs text-neutral-600">
            No reference frame available
          </div>
        )}
        
        {/* Heatmap Overlay */}
        <canvas
          ref={canvasRef}
          width={800}
          height={450}
          className="absolute inset-0 h-full w-full object-fill mix-blend-screen"
        />
      </div>
      <p className="mt-3 text-xs text-neutral-400">
        Aggregated spatial density across {events.length} tracked events.
      </p>
    </div>
  );
}