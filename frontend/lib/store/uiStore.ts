import { create } from "zustand";

interface ConfirmationRequest {
  title: string;
  description: string;
  /** Label for the confirming action. Defaults to "Confirm". */
  confirmLabel?: string;
  /** Renders the confirm button in red. */
  destructive?: boolean;
  onConfirm: () => void | Promise<void>;
}

interface UiState {
  /** Mobile only — the sidebar is permanently expanded on desktop. */
  sidebarOpen: boolean;
  openSidebar: () => void;
  closeSidebar: () => void;
  toggleSidebar: () => void;

  confirmation: ConfirmationRequest | null;
  /** True while an async onConfirm is in flight; disables both modal buttons. */
  confirming: boolean;
  requestConfirmation: (request: ConfirmationRequest) => void;
  resolveConfirmation: () => Promise<void>;
  dismissConfirmation: () => void;
}

export const useUiStore = create<UiState>((set, get) => ({
  sidebarOpen: false,
  openSidebar: () => set({ sidebarOpen: true }),
  closeSidebar: () => set({ sidebarOpen: false }),
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),

  confirmation: null,
  confirming: false,
  requestConfirmation: (confirmation) => set({ confirmation, confirming: false }),

  resolveConfirmation: async () => {
    const { confirmation, confirming } = get();
    if (!confirmation || confirming) return;

    set({ confirming: true });
    try {
      await confirmation.onConfirm();
      set({ confirmation: null });
    } finally {
      // On failure the modal stays open so the caller's toast has context.
      set({ confirming: false });
    }
  },

  dismissConfirmation: () => {
    if (get().confirming) return;
    set({ confirmation: null });
  },
}));
