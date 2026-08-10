import { create } from "zustand";

import {
  fetchReportOptions,
  fetchReportPage,
  toUserMessage,
} from "@/lib/api/client";
import type {
  ReportFilters,
  ReportOptions,
  ReportRow,
} from "@/lib/types/event";

const EMPTY_FILTERS: ReportFilters = {
  dateFrom: null,
  dateTo: null,
  videoIds: [],
  objectClasses: [],
};

interface ReportsState {
  filters: ReportFilters;

  /** Accumulated preview rows across every page loaded so far. */
  rows: ReportRow[];
  /** Cursor for the next page; null once everything is loaded. */
  cursor: string | null;
  totalEvents: number;
  matchingVideos: number;

  options: ReportOptions;

  loading: boolean;
  loadingMore: boolean;
  error: string | null;
  /** False until the first page has settled, so empty ≠ not-yet-loaded. */
  loaded: boolean;

  loadOptions: () => Promise<void>;
  load: () => Promise<void>;
  loadMore: () => Promise<void>;
  setFilters: (patch: Partial<ReportFilters>) => Promise<void>;
  clearFilters: () => Promise<void>;
  reset: () => void;
}

/** True when at least one filter would narrow the result set. */
export function hasActiveFilters(filters: ReportFilters): boolean {
  return Boolean(
    filters.dateFrom ||
      filters.dateTo ||
      filters.videoIds.length ||
      filters.objectClasses.length
  );
}

export const useReportsStore = create<ReportsState>((set, get) => ({
  filters: EMPTY_FILTERS,
  rows: [],
  cursor: null,
  totalEvents: 0,
  matchingVideos: 0,
  options: { videos: [], objectClasses: [] },
  // Starts true: the page mounts before its first fetch effect runs, and a
  // false here renders neither skeleton nor results — a blank panel.
  loading: true,
  loadingMore: false,
  error: null,
  loaded: false,

  loadOptions: async () => {
    try {
      set({ options: await fetchReportOptions() });
    } catch {
      // Non-fatal: the filter bar degrades to empty menus, and the error from
      // the main query already tells the user something is wrong.
    }
  },

  load: async () => {
    set({ loading: true, error: null });
    try {
      const page = await fetchReportPage(get().filters, null);
      set({
        rows: page.rows,
        cursor: page.nextCursor,
        totalEvents: page.totalEvents,
        matchingVideos: page.matchingVideos,
        loading: false,
        loaded: true,
      });
    } catch (error) {
      set({
        rows: [],
        cursor: null,
        totalEvents: 0,
        matchingVideos: 0,
        loading: false,
        loaded: true,
        error: toUserMessage(error, "We couldn't build your report."),
      });
    }
  },

  loadMore: async () => {
    const { cursor, loadingMore, loading } = get();
    if (!cursor || loadingMore || loading) return;

    set({ loadingMore: true });
    try {
      const page = await fetchReportPage(get().filters, cursor);
      set((state) => ({
        rows: [...state.rows, ...page.rows],
        cursor: page.nextCursor,
        totalEvents: page.totalEvents,
        matchingVideos: page.matchingVideos,
        loadingMore: false,
      }));
    } catch (error) {
      set({
        loadingMore: false,
        error: toUserMessage(error, "We couldn't load more results."),
      });
    }
  },

  // Filters apply immediately — there is no separate Apply button.
  setFilters: async (patch) => {
    set((state) => ({ filters: { ...state.filters, ...patch } }));
    await get().load();
  },

  clearFilters: async () => {
    set({ filters: EMPTY_FILTERS });
    await get().load();
  },

  reset: () =>
    set({
      filters: EMPTY_FILTERS,
      rows: [],
      cursor: null,
      totalEvents: 0,
      matchingVideos: 0,
      loading: true,
      loadingMore: false,
      error: null,
      loaded: false,
    }),
}));
