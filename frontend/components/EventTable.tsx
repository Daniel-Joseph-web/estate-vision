"use client";

import { FlagIcon } from "lucide-react";
import Image from "next/image";

import { SeverityBadge } from "@/components/SeverityBadge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDuration } from "@/lib/format";
import type { DetectionEvent } from "@/lib/types/event";
import { cn } from "@/lib/utils";

interface EventTableProps {
  events: DetectionEvent[];
  flaggedIds: string[];
  onSeek: (seconds: number) => void;
  onToggleFlag: (eventId: string) => void;
  disabled?: boolean;
}

export function EventTable({
  events,
  flaggedIds,
  onSeek,
  onToggleFlag,
  disabled = false,
}: EventTableProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900/70 backdrop-blur-md">
      <Table>
        <TableHeader>
          <TableRow className="border-neutral-800 hover:bg-transparent">
            <TableHead className="ev-label px-4 text-neutral-400">Time</TableHead>
            <TableHead className="ev-label px-4 text-neutral-400">Image</TableHead>
            <TableHead className="ev-label px-4 text-neutral-400">Class</TableHead>
            <TableHead className="ev-label px-4 text-neutral-400">Severity</TableHead>
            <TableHead className="ev-label px-4 text-neutral-400">Detection</TableHead>
            <TableHead className="ev-label px-4 text-right text-neutral-400">Conf.</TableHead>
            <TableHead className="ev-label px-4 text-right text-neutral-400">Flag</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {events.map((event) => {
            const flagged = flaggedIds.includes(event.id);

            return (
              <TableRow
                key={event.id}
                className="border-neutral-800 hover:bg-neutral-800/40"
              >
                <TableCell className="px-4">
                  <Button
                    variant="ghost"
                    size="xs"
                    disabled={disabled}
                    onClick={() => onSeek(event.timestamp_seconds)}
                    className="font-mono text-red-500 tabular-nums hover:bg-red-500/10"
                  >
                    {formatDuration(event.timestamp_seconds)}
                    <span className="sr-only"> — jump to this moment</span>
                  </Button>
                </TableCell>

                <TableCell className="px-4">
                  {event.frame_url ? (
                    <Dialog>
                      <DialogTrigger className="overflow-hidden rounded-md border border-neutral-700 transition-transform hover:scale-105 hover:border-red-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500">
                        <Image
                          src={event.frame_url}
                          alt={event.object_class}
                          width={40}
                          height={40}
                          className="size-10 object-cover"
                        />
                      </DialogTrigger>
                      <DialogContent className="max-w-md border-neutral-800 bg-neutral-950 p-2">
                        <DialogTitle className="sr-only">Event Frame</DialogTitle>
                        <div className="relative h-64 w-full">
                          <Image
                            src={event.frame_url}
                            alt={event.label}
                            fill
                            className="rounded-lg object-contain"
                          />
                        </div>
                        <p className="mt-2 px-2 text-center text-sm text-neutral-300">
                          {event.label}
                        </p>
                      </DialogContent>
                    </Dialog>
                  ) : (
                    <div className="flex size-10 items-center justify-center rounded-md border border-neutral-800 bg-neutral-900/50 text-xs text-neutral-600">
                      —
                    </div>
                  )}
                </TableCell>

                <TableCell className="px-4 text-neutral-300">
                  {event.object_class}
                </TableCell>

                <TableCell className="px-4">
                  <SeverityBadge severity={event.severity} />
                </TableCell>

                <TableCell className="max-w-xs truncate px-4 text-neutral-300">
                  {event.label}
                </TableCell>

                <TableCell className="px-4 text-right font-mono text-neutral-500 tabular-nums">
                  {Math.round(event.confidence * 100)}%
                </TableCell>

                <TableCell className="px-4 text-right">
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    disabled={disabled}
                    aria-pressed={flagged}
                    aria-label={
                      flagged
                        ? `Remove flag from detection at ${formatDuration(event.timestamp_seconds)}`
                        : `Flag detection at ${formatDuration(event.timestamp_seconds)} for follow-up`
                    }
                    onClick={() => onToggleFlag(event.id)}
                  >
                    <FlagIcon
                      className={cn(
                        flagged ? "fill-red-500 text-red-500" : "text-neutral-600 hover:text-neutral-300"
                      )}
                    />
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}