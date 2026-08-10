import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  getDoc,
  query,
  where,
  orderBy,
  type QueryConstraint,
} from "firebase/firestore";

import { currentUid, getDb } from "@/lib/firebase/client";
import mockData from "@/lib/mocks/events.mock.json";
import type {
  DashboardSummary,
  DetectionEvent,
  ReportExportRow,
  ReportFilters,
  ReportOptions,
  ReportPage,
  ReportRow,
  Video,
} from "@/lib/types/event";

/**
 * The single data gateway for the app. Every page and store reads through
 * these functions so the whole product runs on the frozen mock fixture when
 * NEXT_PUBLIC_USE_MOCKS=true — no Firebase project required.
 */
export const USE_MOCKS = process.env.NEXT_PUBLIC_USE_MOCKS === "true";

/** Error carrying a message that is safe to show a property manager verbatim. */
export class ApiError extends Error {
  constructor(message: string, readonly cause?: unknown) {
    super(message);
    this.name = "ApiError";
  }
}

/**
 * Session-local copies of the fixture. A mock delete mutates these so the
 * change is reflected across the dashboard and reports the way the real
 * backend would behave; a page reload restores the frozen data.
 */
let mockVideos = [...(mockData.videos as Video[])];
let mockEvents = [...(mockData.events as DetectionEvent[])];

/** Small delay so loading states are actually exercised in mock mode. */
function settle<T>(value: T): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), 350));
}

function summarise(videos: Video[], events: DetectionEvent[]): DashboardSummary {
  const counts = new Map<string, number>();
  for (const event of events) {
    counts.set(event.object_class, (counts.get(event.object_class) ?? 0) + 1);
  }

  return {
    total_videos: videos.length,
    total_events: events.length,
    top_object_classes: [...counts.entries()]
      .map(([object_class, count]) => ({ object_class, count }))
      .sort((a, b) => b.count - a.count || a.object_class.localeCompare(b.object_class))
      .slice(0, 5),
    recent_uploads: [...videos]
      .sort((a, b) => Date.parse(b.created_at) - Date.parse(a.created_at))
      .slice(0, 6),
  };
}

/**
 * Runs a scoped Firestore query and returns the documents as plain objects.
 *
 * Every query is forced through here so the mandatory `user_id` filter can
 * never be forgotten: Firestore rules reject a query they can't prove is safe,
 * so an unscoped read fails wholesale rather than returning a filtered subset
 * the way Postgres RLS did.
 */
async function fetchScoped<T>(
  collectionName: "videos" | "events",
  ...constraints: QueryConstraint[]
): Promise<T[]> {
  const snapshot = await getDocs(
    query(
      collection(getDb(), collectionName),
      where("user_id", "==", currentUid()),
      ...constraints
    )
  );

  return snapshot.docs.map((document) => ({
    id: document.id,
    ...document.data(),
  })) as T[];
}

export async function fetchDashboardSummary(): Promise<DashboardSummary> {
  if (USE_MOCKS) return settle(summarise(mockVideos, mockEvents));

  const [videos, events] = await Promise.all([
    fetchScoped<Video>("videos", orderBy("created_at", "desc")),
    fetchScoped<DetectionEvent>("events"),
  ]);

  return summarise(videos, events);
}

export async function fetchVideos(): Promise<Video[]> {
  if (USE_MOCKS) {
    return settle(
      [...mockVideos].sort(
        (a, b) => Date.parse(b.created_at) - Date.parse(a.created_at)
      )
    );
  }

  return fetchScoped<Video>("videos", orderBy("created_at", "desc"));
}

export async function fetchVideo(id: string): Promise<Video | null> {
  if (USE_MOCKS) return settle(mockVideos.find((v) => v.id === id) ?? null);

  const snapshot = await getDoc(doc(getDb(), "videos", id));
  if (!snapshot.exists()) return null;

  const video = { id: snapshot.id, ...snapshot.data() } as Video;

  // A direct document read bypasses the collection query's user_id filter, so
  // ownership is checked here. Reads for someone else's video are rejected by
  // the security rules too; this keeps the client honest either way.
  if (video.user_id !== currentUid()) return null;

  return video;
}

export async function fetchEventsForVideo(
  videoId: string
): Promise<DetectionEvent[]> {
  if (USE_MOCKS) {
    return settle(
      mockEvents
        .filter((e) => e.video_id === videoId)
        .sort((a, b) => a.timestamp_seconds - b.timestamp_seconds)
    );
  }

  return fetchScoped<DetectionEvent>(
    "events",
    where("video_id", "==", videoId),
    orderBy("timestamp_seconds", "asc")
  );
}

export async function fetchAllEvents(): Promise<DetectionEvent[]> {
  if (USE_MOCKS) return settle([...mockEvents]);

  return fetchScoped<DetectionEvent>("events");
}

/**
 * deleteVideo moved to app/actions/delete-video.ts as a Server Action.
 * Firestore has no DELETE WHERE, so deleting hundreds of event docs from the
 * browser is slow and partially fails. The Admin SDK's BulkWriter handles
 * batching and retries.
 */

/** Normalises anything thrown into a message worth showing the user. */
export function toUserMessage(error: unknown, fallback: string): string {
  if (error instanceof ApiError) return error.message;
  if (error instanceof Error && error.message) return error.message;
  return fallback;
}

// --- Reports -------------------------------------------------------------

const REPORT_PAGE_SIZE = 10;

/** Populates the filter bar's multi-selects. */
export async function fetchReportOptions(): Promise<ReportOptions> {
  const [videos, events] = await Promise.all([fetchVideos(), fetchAllEvents()]);

  return {
    videos: videos.map(({ id, name }) => ({ id, name })),
    objectClasses: [...new Set(events.map((e) => e.object_class))].sort(),
  };
}

/**
 * Joins events to their source video, then applies every filter with AND.
 * Kept in one place so the preview and the export can never disagree.
 */
function matchingPairs(
  videos: Video[],
  events: DetectionEvent[],
  filters: ReportFilters
): { video: Video; event: DetectionEvent }[] {
  const byId = new Map(videos.map((video) => [video.id, video]));

  return events.flatMap((event) => {
    const video = byId.get(event.video_id);
    if (!video) return [];

    // Dates compare as `yyyy-mm-dd` strings, which sort correctly.
    const day = video.created_at.slice(0, 10);
    if (filters.dateFrom && day < filters.dateFrom) return [];
    if (filters.dateTo && day > filters.dateTo) return [];
    if (filters.videoIds.length && !filters.videoIds.includes(video.id)) return [];
    if (
      filters.objectClasses.length &&
      !filters.objectClasses.includes(event.object_class)
    ) {
      return [];
    }

    return [{ video, event }];
  });
}

async function loadFilterable(): Promise<{
  videos: Video[];
  events: DetectionEvent[];
}> {
  const [videos, events] = await Promise.all([fetchVideos(), fetchAllEvents()]);
  return { videos, events };
}

/**
 * One page of the aggregated preview.
 *
 * Aggregation runs here rather than in the database: the counts are grouped
 * from a filtered fetch. Firestore has no GROUP BY, so at portfolio scale this
 * should move to a Cloud Function maintaining a rollup collection, or to
 * aggregation queries; the return shape is already the same.
 */
export async function fetchReportPage(
  filters: ReportFilters,
  cursor: string | null = null
): Promise<ReportPage> {
  const { videos, events } = await loadFilterable();
  const pairs = matchingPairs(videos, events, filters);

  const counts = new Map<string, ReportRow>();
  for (const { video, event } of pairs) {
    const date = video.created_at.slice(0, 10);
    const key = `${date}::${event.object_class}`;
    const existing = counts.get(key);
    if (existing) {
      existing.count += 1;
    } else {
      counts.set(key, { date, object_class: event.object_class, count: 1 });
    }
  }

  const allRows = [...counts.values()].sort(
    (a, b) =>
      b.date.localeCompare(a.date) ||
      b.count - a.count ||
      a.object_class.localeCompare(b.object_class)
  );

  const offset = cursor ? Number.parseInt(cursor, 10) || 0 : 0;
  const rows = allRows.slice(offset, offset + REPORT_PAGE_SIZE);
  const nextOffset = offset + rows.length;

  return {
    rows,
    nextCursor: nextOffset < allRows.length ? String(nextOffset) : null,
    totalEvents: pairs.length,
    matchingVideos: new Set(pairs.map(({ video }) => video.id)).size,
  };
}

/** The full filtered detection list, flattened for CSV/JSON export. */
export async function fetchReportExport(
  filters: ReportFilters
): Promise<ReportExportRow[]> {
  const { videos, events } = await loadFilterable();

  return matchingPairs(videos, events, filters)
    .sort(
      (a, b) =>
        Date.parse(b.video.created_at) - Date.parse(a.video.created_at) ||
        a.event.timestamp_seconds - b.event.timestamp_seconds
    )
    .map(({ video, event }) => ({
      video: video.name,
      uploaded_at: video.created_at,
      timestamp: formatClock(event.timestamp_seconds),
      object_class: event.object_class,
      severity: event.severity,
      confidence: Number(event.confidence.toFixed(2)),
      detection: event.label,
    }));
}

/** Seconds → `hh:mm:ss`, the stable form for an exported timestamp. */
function formatClock(seconds: number): string {
  const pad = (n: number) => String(Math.floor(n)).padStart(2, "0");
  return `${pad(seconds / 3600)}:${pad((seconds % 3600) / 60)}:${pad(seconds % 60)}`;
}
