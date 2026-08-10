import { describe, expect, it } from "vitest";

import mockData from "@/lib/mocks/events.mock.json";
import type { DetectionEvent, Video } from "@/lib/types/event";

/**
 * The fixture is what the whole app renders in mock mode, and its shape is also
 * the contract the Python worker writes to Firestore. If the two drift, mock
 * mode keeps working while production renders blanks — so the fields are
 * asserted here rather than trusted.
 *
 * Field names mirror worker/pipeline/event_builder.py::build_events and
 * frontend/app/actions/register-video.ts.
 */

const videos = mockData.videos as Video[];
const events = mockData.events as DetectionEvent[];

const VIDEO_STATUSES = ["queued", "processing", "complete", "failed"];
const SEVERITIES = ["safe", "warning", "threat"];

describe("mock fixture: videos", () => {
  it("is non-empty", () => {
    expect(videos.length).toBeGreaterThan(0);
  });

  it("carries every field the dashboard reads", () => {
    for (const video of videos) {
      expect(typeof video.id).toBe("string");
      expect(typeof video.user_id).toBe("string");
      expect(typeof video.name).toBe("string");
      expect(typeof video.storage_key).toBe("string");
      expect(typeof video.size_bytes).toBe("number");
      expect(typeof video.duration_seconds).toBe("number");
      expect(typeof video.event_count).toBe("number");
      expect(VIDEO_STATUSES).toContain(video.status);
    }
  });

  it("uses parseable ISO timestamps", () => {
    // The dashboard sorts on Date.parse(created_at); NaN silently breaks order.
    for (const video of videos) {
      expect(Number.isNaN(Date.parse(video.created_at))).toBe(false);
    }
  });

  it("has unique ids", () => {
    expect(new Set(videos.map((v) => v.id)).size).toBe(videos.length);
  });

  it("only carries an error message on failed videos", () => {
    for (const video of videos) {
      if (video.status !== "failed") {
        expect(video.error_message).toBeNull();
      }
    }
  });
});

describe("mock fixture: events", () => {
  it("is non-empty", () => {
    expect(events.length).toBeGreaterThan(0);
  });

  it("matches the schema the worker writes", () => {
    for (const event of events) {
      expect(typeof event.id).toBe("string");
      expect(typeof event.video_id).toBe("string");
      expect(typeof event.user_id).toBe("string");
      expect(typeof event.timestamp_seconds).toBe("number");
      expect(typeof event.object_class).toBe("string");
      expect(typeof event.label).toBe("string");
      expect(SEVERITIES).toContain(event.severity);
    }
  });

  it("keeps confidence in the 0–1 range the UI formats as a percentage", () => {
    for (const event of events) {
      expect(event.confidence).toBeGreaterThanOrEqual(0);
      expect(event.confidence).toBeLessThanOrEqual(1);
    }
  });

  it("uses a 4-element bbox or null", () => {
    for (const event of events) {
      if (event.bbox !== null) {
        expect(event.bbox).toHaveLength(4);
      }
    }
  });

  it("has unique ids", () => {
    expect(new Set(events.map((e) => e.id)).size).toBe(events.length);
  });

  it("references a video that exists", () => {
    // An orphaned event is dropped by the reports join and silently vanishes.
    const ids = new Set(videos.map((v) => v.id));
    for (const event of events) {
      expect(ids.has(event.video_id)).toBe(true);
    }
  });

  it("agrees with each video's denormalised event_count", () => {
    // The dashboard trusts event_count instead of counting; drift shows wrong
    // numbers with no error anywhere.
    for (const video of videos.filter((v) => v.status === "complete")) {
      const actual = events.filter((e) => e.video_id === video.id).length;
      expect(actual).toBe(video.event_count);
    }
  });

  it("never places an event past the end of its video", () => {
    const byId = new Map(videos.map((v) => [v.id, v]));
    for (const event of events) {
      const video = byId.get(event.video_id);
      if (video && video.duration_seconds > 0) {
        expect(event.timestamp_seconds).toBeLessThanOrEqual(video.duration_seconds);
      }
    }
  });
});
