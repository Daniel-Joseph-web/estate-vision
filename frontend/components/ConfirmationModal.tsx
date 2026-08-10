"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useUiStore } from "@/lib/store/uiStore";
import { cn } from "@/lib/utils";

/**
 * Single app-wide confirmation dialog, driven by `uiStore.requestConfirmation`.
 * Both buttons disable while an async confirm handler is in flight.
 */
export function ConfirmationModal() {
  const confirmation = useUiStore((s) => s.confirmation);
  const confirming = useUiStore((s) => s.confirming);
  const resolveConfirmation = useUiStore((s) => s.resolveConfirmation);
  const dismissConfirmation = useUiStore((s) => s.dismissConfirmation);

  return (
    <Dialog
      open={Boolean(confirmation)}
      onOpenChange={(open) => {
        if (!open) dismissConfirmation();
      }}
    >
      {confirmation && (
        <DialogContent
          showCloseButton={false}
          className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 backdrop-blur-md"
        >
          <DialogHeader>
            <DialogTitle className="text-base text-slate-50">
              {confirmation.title}
            </DialogTitle>
            <DialogDescription className="text-slate-400">
              {confirmation.description}
            </DialogDescription>
          </DialogHeader>

          <div className="mt-2 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button
              variant="outline"
              size="lg"
              disabled={confirming}
              onClick={dismissConfirmation}
            >
              Cancel
            </Button>
            <Button
              size="lg"
              disabled={confirming}
              onClick={() => void resolveConfirmation()}
              className={cn(
                "font-semibold",
                confirmation.destructive
                  ? "bg-[#ff3333] text-slate-50 hover:bg-[#ff3333]/85"
                  : "bg-[#00f0ff] text-[#04141a] hover:bg-[#00f0ff]/85"
              )}
            >
              {confirming
                ? "Working…"
                : (confirmation.confirmLabel ?? "Confirm")}
            </Button>
          </div>
        </DialogContent>
      )}
    </Dialog>
  );
}
