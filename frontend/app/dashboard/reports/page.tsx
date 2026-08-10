"use client";

import {
  AlertTriangleIcon,
  CalendarIcon,
  ChevronDownIcon,
  DownloadIcon,
  Loader2Icon,
  SearchXIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { EmptyState } from "@/components/EmptyState";
import { MultiSelectFilter } from "@/components/MultiSelectFilter";
import { SkeletonRows } from "@/components/SkeletonLoader";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { fetchReportExport, toUserMessage } from "@/lib/api/client";
import { exportAsCsv, exportAsJson } from "@/lib/export";
import { formatCount } from "@/lib/format";
import { hasActiveFilters, useReportsStore } from "@/lib/store/reportsStore";

export default function ReportsPage() {
  const filters = useReportsStore((s) => s.filters);
  const rows = useReportsStore((s) => s.rows);
  const cursor = useReportsStore((s) => s.cursor);
  const totalEvents = useReportsStore((s) => s.totalEvents);
  const matchingVideos = useReportsStore((s) => s.matchingVideos);
  const options = useReportsStore((s) => s.options);
  const loading = useReportsStore((s) => s.loading);
  const loadingMore = useReportsStore((s) => s.loadingMore);
  const error = useReportsStore((s) => s.error);
  const loaded = useReportsStore((s) => s.loaded);
  const load = useReportsStore((s) => s.load);
  const loadMore = useReportsStore((s) => s.loadMore);
  const loadOptions = useReportsStore((s) => s.loadOptions);
  const setFilters = useReportsStore((s) => s.setFilters);
  const clearFilters = useReportsStore((s) => s.clearFilters);
  const reset = useReportsStore((s) => s.reset);

  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    void loadOptions();
    void load();
    return reset;
  }, [loadOptions, load, reset]);

  const filtersActive = hasActiveFilters(filters);

  async function runExport(format: "csv" | "json") {
    if (exporting) return;
    setExporting(true);
    try {
      const data = await fetchReportExport(filters);
      if (data.length === 0) {
        toast.error("Nothing to export — no detections match these filters.");
        return;
      }
      if (format === "csv") exportAsCsv(data);
      else exportAsJson(data);
      toast.success(
        `Exported ${formatCount(data.length)} detection${data.length === 1 ? "" : "s"} as ${format.toUpperCase()}`
      );
    } catch (caught) {
      toast.error(toUserMessage(caught, "We couldn't generate your export."));
    } finally {
      setExporting(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-6xl">
      <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="ev-label text-neutral-400">Export zone</p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-neutral-50">
            Reports
          </h1>
        </div>

        {/* Split button: CSV is the default action, JSON lives under the caret. */}
        <div className="flex">
          <Button
            size="lg"
            disabled={exporting || loading}
            onClick={() => void runExport("csv")}
            className="h-10 rounded-r-none bg-red-600 px-5 font-semibold text-white hover:bg-red-700"
          >
            {exporting ? (
              <Loader2Icon aria-hidden="true" className="animate-spin" />
            ) : (
              <DownloadIcon aria-hidden="true" />
            )}
            Export to CSV
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger
              aria-label="More export formats"
              disabled={exporting || loading}
              render={
                <Button
                  size="lg"
                  className="h-10 rounded-l-none border-l border-red-700 bg-red-600 px-2 text-white hover:bg-red-700"
                />
              }
            >
              <ChevronDownIcon aria-hidden="true" />
            </DropdownMenuTrigger>

            <DropdownMenuContent 
              align="end" 
              className="w-48 border-neutral-800 bg-neutral-900 text-neutral-200"
            >
              <DropdownMenuItem 
                onClick={() => void runExport("json")}
                className="cursor-pointer focus:bg-neutral-800 focus:text-neutral-50"
              >
                Export as JSON
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Filter bar — every change applies immediately, no Apply button. */}
      <div className="mb-6 flex flex-wrap items-center gap-3 rounded-2xl border border-neutral-800 bg-neutral-900/70 p-4 backdrop-blur-md">
        <DropdownMenu>
          <DropdownMenuTrigger
            render={<Button variant="outline" size="lg" className="h-9 border-neutral-700 text-neutral-200 hover:bg-neutral-800" />}
          >
            <CalendarIcon aria-hidden="true" />
            <span className="ev-label text-neutral-400">Date range</span>
            <span className="text-neutral-200">
              {filters.dateFrom || filters.dateTo
                ? `${filters.dateFrom ?? "Any"} → ${filters.dateTo ?? "Any"}`
                : "All time"}
            </span>
            <ChevronDownIcon aria-hidden="true" />
          </DropdownMenuTrigger>

          <DropdownMenuContent 
            align="start" 
            className="w-72 p-3 border-neutral-800 bg-neutral-900 text-neutral-200"
          >
            <div className="space-y-3">
              <div className="space-y-1.5">
                <label htmlFor="date-from" className="ev-label block text-neutral-400">
                  From
                </label>
                <Input
                  id="date-from"
                  type="date"
                  className="border-neutral-800 bg-neutral-950 text-neutral-200 focus-visible:ring-red-500"
                  value={filters.dateFrom ?? ""}
                  max={filters.dateTo ?? undefined}
                  onChange={(event) =>
                    void setFilters({ dateFrom: event.target.value || null })
                  }
                />
              </div>
              <div className="space-y-1.5">
                <label htmlFor="date-to" className="ev-label block text-neutral-400">
                  To
                </label>
                <Input
                  id="date-to"
                  type="date"
                  className="border-neutral-800 bg-neutral-950 text-neutral-200 focus-visible:ring-red-500"
                  value={filters.dateTo ?? ""}
                  min={filters.dateFrom ?? undefined}
                  onChange={(event) =>
                    void setFilters({ dateTo: event.target.value || null })
                  }
                />
              </div>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        <MultiSelectFilter
          label="Property"
          options={options.videos.map(({ id, name }) => ({
            value: id,
            label: name,
          }))}
          selected={filters.videoIds}
          onChange={(videoIds) => void setFilters({ videoIds })}
        />

        <MultiSelectFilter
          label="Event type"
          options={options.objectClasses.map((value) => ({
            value,
            label: value,
          }))}
          selected={filters.objectClasses}
          onChange={(objectClasses) => void setFilters({ objectClasses })}
        />

        <Button
          variant="ghost"
          size="sm"
          className="ml-auto text-neutral-300 hover:text-white hover:bg-neutral-800"
          disabled={!filtersActive || loading}
          onClick={() => void clearFilters()}
        >
          Clear Filters
        </Button>
      </div>

      {loading && <SkeletonRows rows={6} />}

      {!loading && error && (
        <div
          role="alert"
          className="flex flex-col items-center rounded-2xl border border-[#ff3333]/30 bg-neutral-900/70 px-6 py-14 text-center backdrop-blur-md"
        >
          <AlertTriangleIcon aria-hidden="true" className="size-6 text-[#ff3333]" />
          <h2 className="mt-4 text-base font-semibold text-neutral-50">
            We couldn&apos;t build your report
          </h2>
          <p className="mt-2 max-w-sm text-sm text-neutral-400">{error}</p>
          <Button
            size="lg"
            variant="outline"
            className="mt-6 border-neutral-700 text-neutral-200 hover:bg-neutral-800"
            onClick={() => void load()}
          >
            Try again
          </Button>
        </div>
      )}

      {!loading && !error && loaded && rows.length === 0 && (
        <EmptyState
          icon={SearchXIcon}
          title="No matches"
          description={
            filtersActive
              ? "No detections match these filters. Widen the date range or clear the filters to see more."
              : "There are no detections to report on yet. Upload a recording to get started."
          }
          action={
            filtersActive ? (
              <Button
                variant="outline"
                size="lg"
                className="border-neutral-700 text-neutral-200 hover:bg-neutral-800"
                onClick={() => void clearFilters()}
              >
                Clear Filters
              </Button>
            ) : undefined
          }
        />
      )}

      {!loading && !error && rows.length > 0 && (
        <>
          <div className="mb-3 flex flex-wrap items-center gap-x-4 gap-y-1">
            <p className="text-sm text-neutral-300">
              Matching videos:{" "}
              <span className="font-mono text-neutral-50">
                {formatCount(matchingVideos)}
              </span>
            </p>
            <p className="text-sm text-neutral-400">
              Detections:{" "}
              <span className="font-mono text-neutral-200">
                {formatCount(totalEvents)}
              </span>
            </p>
          </div>

          <div className="overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900/70 backdrop-blur-md">
            <Table>
              <TableHeader>
                <TableRow className="border-neutral-800 hover:bg-transparent">
                  <TableHead className="ev-label px-4 text-neutral-400">Date</TableHead>
                  <TableHead className="ev-label px-4 text-neutral-400">Event type</TableHead>
                  <TableHead className="ev-label px-4 text-right text-neutral-400">
                    Detections
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((row) => (
                  <TableRow
                    key={`${row.date}-${row.object_class}`}
                    className="border-neutral-800 hover:bg-neutral-800/40"
                  >
                    <TableCell className="px-4 font-mono text-neutral-300">
                      {row.date}
                    </TableCell>
                    <TableCell className="px-4 text-neutral-300">
                      {row.object_class}
                    </TableCell>
                    <TableCell className="px-4 text-right font-mono text-neutral-50 tabular-nums">
                      {formatCount(row.count)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Hidden once the last page is in. */}
          {cursor && (
            <div className="mt-4 flex justify-center">
              <Button
                variant="outline"
                size="lg"
                className="border-neutral-700 text-neutral-200 hover:bg-neutral-800"
                disabled={loadingMore}
                onClick={() => void loadMore()}
              >
                {loadingMore && (
                  <Loader2Icon aria-hidden="true" className="animate-spin" />
                )}
                Load More
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}