import { create } from "zustand";
import { CheckCircle2, XCircle, Info, X } from "lucide-react";
import { cn } from "@/lib/utils";

const useToastStore = create((set) => ({
  toasts: [],
  push: (toast) =>
    set((s) => ({ toasts: [...s.toasts, { id: crypto.randomUUID(), ...toast }] })),
  dismiss: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}));

export const toast = {
  success: (message) => useToastStore.getState().push({ type: "success", message }),
  error: (message) => useToastStore.getState().push({ type: "error", message }),
  info: (message) => useToastStore.getState().push({ type: "info", message }),
};

const ICONS = { success: CheckCircle2, error: XCircle, info: Info };

export function Toaster() {
  const toasts = useToastStore((s) => s.toasts);
  const dismiss = useToastStore((s) => s.dismiss);

  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2">
      {toasts.map((t) => {
        const Icon = ICONS[t.type] ?? Info;
        return (
          <div
            key={t.id}
            className={cn(
              "flex items-center gap-2 rounded-md border border-[var(--border)] bg-[var(--card)] px-4 py-3 text-sm shadow-lg min-w-[280px]",
              t.type === "success" && "text-green-600",
              t.type === "error" && "text-[var(--destructive)]"
            )}
          >
            <Icon className="size-4 shrink-0" />
            <span className="flex-1 text-[var(--card-foreground)]">{t.message}</span>
            <button onClick={() => dismiss(t.id)} className="opacity-60 hover:opacity-100">
              <X className="size-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
