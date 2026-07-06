import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function Loader({ className, label = "Loading..." }) {
  return (
    <div className={cn("flex items-center justify-center gap-2 p-6 text-[var(--muted-foreground)]", className)}>
      <Loader2 className="size-5 animate-spin" />
      <span className="text-sm">{label}</span>
    </div>
  );
}
