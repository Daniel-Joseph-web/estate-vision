import { create } from "zustand";

import {
  fetchEventsForVideo,
  fetchVideo,
  toUserMessage,
} from "@/lib/api/client";
import { deleteVideo as deleteVideoAction } from "@/app/actions/delete-video";
import { startProcessing } from "@/app/actions/start-processing";
import { getIdToken } from "@/lib/firebase/client";
import type { DetectionEvent, EventSeverity, Video } from "@/lib/types/event";

interface VideoDetailState {
  video: Video | null;
  events: DetectionEvent[];
  loading: boolean;
  error: string | null;
  loadedId: string | null;

  severityFilter: EventSeverity | "all";
  classFilter: string | "all";
  flaggedOnly: boolean;
  searchQuery: string;
  flaggedIds: string[];

  deleting: boolean;
  retrying: boolean;
  
  pollInterval: ReturnType<typeof setInterval> | null;

  load: (id: string) => Promise<void>;
  setSeverityFilter: (severity: EventSeverity | "all") => void;
  setClassFilter: (objectClass: string | "all") => void;
  setFlaggedOnly: (flaggedOnly: boolean) => void;
  setSearchQuery: (query: string) => void;
  clearFilters: () => void;
  toggleFlag: (eventId: string) => void;
  removeVideo: (id: string) => Promise<void>;
  retryProcessing: (id: string) => Promise<void>;
  reset: () => void;
}

const INITIAL_FILTERS = {
  severityFilter: "all",
  classFilter: "all",
  flaggedOnly: false,
  searchQuery: "",
} satisfies Pick<
  VideoDetailState,
  "severityFilter" | "classFilter" | "flaggedOnly" | "searchQuery"
>;

export const useVideoDetailStore = create<VideoDetailState>((set, get) => ({
  video: null,
  events: [],
  loading: false,
  error: null,
  loadedId: null,
  ...INITIAL_FILTERS,
  flaggedIds: [],
  deleting: false,
  retrying: false,
  pollInterval: null,

  load: async (id) => {
    const { pollInterval: existingPoll } = get();
    if (existingPoll) clearInterval(existingPoll);

    set({ loading: true, error: null });

    const loadData = async () => {
      try {
        const video = await fetchVideo(id);

        if (!video) {
          set({
            video: null,
            events: [],
            loading: false,
            error: "That video isn't in your library.",
            loadedId: id,
          });
          return false; 
        }

        const events =
          video.status === "complete" ? await fetchEventsForVideo(id) : [];

        set({ video, events, loading: false, error: null, loadedId: id });

        return video.status === "processing" || video.status === "queued";
      } catch (error) {
        set({
          loading: false,
          error: toUserMessage(error, "We couldn't load this video."),
          loadedId: id,
        });
        return false; 
      }
    };

    const keepPolling = await loadData();

    if (keepPolling) {
      const interval = setInterval(async () => {
        const shouldContinue = await loadData();
        if (!shouldContinue) {
          clearInterval(interval);
          set({ pollInterval: null });
        }
      }, 3000);
      
      set({ pollInterval: interval });
    }
  },

  setSeverityFilter: (severityFilter) => set({ severityFilter }),
  setClassFilter: (classFilter) => set({ classFilter }),
  setFlaggedOnly: (flaggedOnly) => set({ flaggedOnly }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  clearFilters: () => set({ ...INITIAL_FILTERS }),

  toggleFlag: (eventId) =>
    set((state) => ({
      flaggedIds: state.flaggedIds.includes(eventId)
        ? state.flaggedIds.filter((id) => id !== eventId)
        : [...state.flaggedIds, eventId],
    })),

  removeVideo: async (id) => {
    if (get().deleting) return;
    set({ deleting: true });
    try {
      const idToken = await getIdToken();
      const result = await deleteVideoAction({ idToken: idToken ?? "", videoId: id });
      if (!result.ok) {
        throw new Error(result.message);
      }
    } finally {
      set({ deleting: false });
    }
  },

  retryProcessing: async (id) => {
    if (get().retrying) return;
    set({ retrying: true });
    try {
      const idToken = await getIdToken();
      const result = await startProcessing({ idToken: idToken ?? "", videoId: id });
      if (!result.ok) {
        throw new Error(result.message);
      }
      // Re-trigger the load to pick up the new "processing" status and start polling
      await get().load(id);
    } finally {
      set({ retrying: false });
    }
  },

  reset: () => {
    const { pollInterval } = get();
    if (pollInterval) clearInterval(pollInterval);

    set({
      video: null,
      events: [],
      loading: false,
      error: null,
      loadedId: null,
      ...INITIAL_FILTERS,
      flaggedIds: [],
      deleting: false,
      retrying: false,
      pollInterval: null,
    });
  },
}));

export function filterEvents({
  events,
  severityFilter,
  classFilter,
  flaggedOnly,
  flaggedIds,
  searchQuery,
}: Pick<
  VideoDetailState,
  "events" | "severityFilter" | "classFilter" | "flaggedOnly" | "flaggedIds" | "searchQuery"
>): DetectionEvent[] {
  return events.filter((event) => {
    if (severityFilter !== "all" && event.severity !== severityFilter) {
      return false;
    }
    if (classFilter !== "all" && event.object_class !== classFilter) {
      return false;
    }
    if (flaggedOnly && !flaggedIds.includes(event.id)) return false;
    
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      if (
        !event.label.toLowerCase().includes(q) &&
        !event.object_class.toLowerCase().includes(q)
      ) {
        return false;
      }
    }
    
    return true;
  });
}