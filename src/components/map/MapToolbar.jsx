import { ZoomIn, ZoomOut, Maximize2, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

export function MapToolbar({ onZoomIn, onZoomOut, onReset, onCenter }) {
  return (
    <div className="absolute bottom-4 right-4 flex gap-1 rounded-md border border-[var(--border)] bg-[var(--card)] p-1 shadow-md">
      <Button size="icon" variant="ghost" onClick={onZoomIn} aria-label="Zoom in">
        <ZoomIn className="size-4" />
      </Button>
      <Button size="icon" variant="ghost" onClick={onZoomOut} aria-label="Zoom out">
        <ZoomOut className="size-4" />
      </Button>
      <Button size="icon" variant="ghost" onClick={onCenter} aria-label="Center view">
        <Maximize2 className="size-4" />
      </Button>
      <Button size="icon" variant="ghost" onClick={onReset} aria-label="Reset view">
        <RotateCcw className="size-4" />
      </Button>
    </div>
  );
}
