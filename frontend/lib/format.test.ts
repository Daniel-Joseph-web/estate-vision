import { describe, expect, it } from "vitest";

import { formatBytes, formatCount, formatDateTime, formatDuration } from "@/lib/format";

describe("formatBytes", () => {
  it("scales to a sensible unit", () => {
    expect(formatBytes(1024)).toBe("1 KB");
    expect(formatBytes(1024 * 1024)).toBe("1 MB");
    expect(formatBytes(1.5 * 1024 * 1024 * 1024)).toBe("1.5 GB");
  });

  it("handles the zero and negative cases without NaN", () => {
    // Math.log(0) is -Infinity, which would index sizes[] out of bounds.
    expect(formatBytes(0)).toBe("0 MB");
    expect(formatBytes(-5)).toBe("0 MB");
  });
});

describe("formatDuration", () => {
  it("omits the hour segment under an hour", () => {
    expect(formatDuration(1867)).toBe("31:07");
  });

  it("includes hours when present", () => {
    expect(formatDuration(3731)).toBe("1:02:11");
  });

  it("formats zero seconds as 0:00 for initial timeline events", () => {
    expect(formatDuration(0)).toBe("0:00");
  });

  it("shows a dash for a video with missing or invalid duration", () => {
    expect(formatDuration(NaN)).toBe("—");
  });
});

describe("formatDateTime", () => {
  it("renders a valid ISO timestamp", () => {
    expect(formatDateTime("2026-08-04T18:42:00.000Z")).not.toBe("—");
  });

  it("degrades to a dash rather than 'Invalid Date'", () => {
    expect(formatDateTime("not-a-date")).toBe("—");
    expect(formatDateTime("")).toBe("—");
  });
});

describe("formatCount", () => {
  it("groups thousands", () => {
    expect(formatCount(94213)).toBe(new Intl.NumberFormat().format(94213));
  });
});