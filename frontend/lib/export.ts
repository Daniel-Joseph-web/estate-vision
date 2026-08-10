import Papa from "papaparse";

import type { ReportExportRow } from "@/lib/types/event";

/** Triggers a browser download for generated file contents. */
function download(filename: string, mimeType: string, contents: string) {
  const url = URL.createObjectURL(new Blob([contents], { type: mimeType }));
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  // Revoking immediately can cancel the download in some browsers.
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/** `estatevision-report-2026-08-06.csv` */
function filename(extension: string): string {
  return `estatevision-report-${new Date().toISOString().slice(0, 10)}.${extension}`;
}

export function exportAsCsv(rows: ReportExportRow[]) {
  download(filename("csv"), "text/csv;charset=utf-8", Papa.unparse(rows));
}

export function exportAsJson(rows: ReportExportRow[]) {
  download(
    filename("json"),
    "application/json",
    JSON.stringify(rows, null, 2)
  );
}
