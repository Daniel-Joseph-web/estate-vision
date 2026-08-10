/**
 * Frozen data schema shared by the Firestore collections and the mock fixture.
 * `lib/mocks/events.mock.json` must always satisfy these types.
 */

export type VideoStatus = "queued" | "processing" | "complete" | "failed";

/** Severity drives colour everywhere: cyan = safe, amber = warning, red = threat. */
export type EventSeverity = "safe" | "warning" | "threat";

export interface Video {
  id: string;
  user_id: string;
  /** Original filename shown to the user. */
  name: string;
  status: VideoStatus;
  /** ISO-8601 UTC. */
  created_at: string;
  duration_seconds: number;
  size_bytes: number;
  /** Object key in the storage bucket. */
  storage_key: string;
  /** Denormalised count so the dashboard avoids a second round-trip. */
  event_count: number;
  thumbnail_url: string | null;
  /** Plain-language reason, present only when status === "failed". */
  error_message: string | null;
}

export interface DetectionEvent {
  id: string;
  video_id: string;
  user_id: string;
  /** Offset into the video, in seconds. */
  timestamp_seconds: number;
  /** Detector class, e.g. "person", "vehicle", "package". */
  object_class: string;
  /** 0–1. */
  confidence: number;
  severity: EventSeverity;
  /** Human-readable summary of what happened. */
  label: string;
  frame_url: string | null;
  /** [x, y, width, height] normalised 0–1, null when the detector had no box. */
  bbox: [number, number, number, number] | null;
}

/** Aggregate powering the /dashboard executive summary. */
export interface DashboardSummary {
  total_videos: number;
  total_events: number;
  /** Highest-count classes first. */
  top_object_classes: { object_class: string; count: number }[];
  /** Most recent first, already trimmed to a display-sized page. */
  recent_uploads: Video[];
}

/** Shape returned by the register-video Server Action. */
export interface RegisteredVideo {
  id: string;
  storage_key: string;
}

/** Cross-video export filters. All fields combine with AND. */
export interface ReportFilters {
  /** Inclusive `yyyy-mm-dd` bounds on the source video's upload date. */
  dateFrom: string | null;
  dateTo: string | null;
  /** Source recordings to include. Empty means "all". */
  videoIds: string[];
  /** Detector classes to include. Empty means "all". */
  objectClasses: string[];
}

/** One aggregated preview row: how many detections of a class on a date. */
export interface ReportRow {
  date: string;
  object_class: string;
  count: number;
}

export interface ReportPage {
  rows: ReportRow[];
  /** Opaque cursor for the next page, or null when the last page is loaded. */
  nextCursor: string | null;
  /** Totals across the whole filtered set, not just the loaded pages. */
  totalEvents: number;
  matchingVideos: number;
}

/** Options that populate the filter bar's multi-selects. */
export interface ReportOptions {
  videos: { id: string; name: string }[];
  objectClasses: string[];
}

/** A single flattened row in a CSV/JSON export. */
export interface ReportExportRow {
  video: string;
  uploaded_at: string;
  timestamp: string;
  object_class: string;
  severity: EventSeverity;
  confidence: number;
  detection: string;
}
