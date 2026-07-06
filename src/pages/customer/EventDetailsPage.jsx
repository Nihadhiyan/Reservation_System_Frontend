import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { eventService } from "@/services/eventService";
import { Loader } from "@/components/feedback/Loader";
import { FloorPlanCanvas } from "@/components/map/FloorPlanCanvas";
import { MapToolbar } from "@/components/map/MapToolbar";
import { useMapControls } from "@/hooks/useMapControls";
import { useMapStore } from "@/store/mapStore";
import { formatCurrency, formatDateTime } from "@/utils/formatters";

export default function EventDetailsPage() {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [eventStalls, setEventStalls] = useState(null);
  const selectedStall = useMapStore((s) => s.selectedStall);
  const selectStall = useMapStore((s) => s.selectStall);
  const { transformRef, zoomIn, zoomOut, resetView, centerView } = useMapControls();

  useEffect(() => {
    eventService.getById(eventId).then(setEvent);
    eventService.getStalls(eventId).then(setEventStalls);
  }, [eventId]);

  if (!event || !eventStalls) return <Loader label="Loading event..." />;

  // EventStallResponse is flat: { id, eventId, stallId, stallName, hallName,
  // basePrice, manualOverridePrice, status, layout } - there is no nested `stall`.
  // An event can span multiple Halls, and this endpoint doesn't return Hall
  // dimensions, so the viewBox is derived from the stalls' own bounding boxes
  // rather than a fixed Hall width/height.
  const stalls = eventStalls.map((es) => ({
    id: es.stallId,
    name: es.stallName,
    status: es.status,
    layout: es.layout,
    basePrice: es.basePrice,
  }));

  const bounds = stalls.reduce(
    (acc, s) =>
      s.layout
        ? {
            width: Math.max(acc.width, s.layout.xCoord + s.layout.width),
            height: Math.max(acc.height, s.layout.yCoord + s.layout.height),
          }
        : acc,
    { width: 100, height: 100 }
  );

  return (
    <div className="mx-auto max-w-6xl px-6 py-8 grid gap-6 lg:grid-cols-[2fr_1fr]">
      <div>
        <h1 className="text-2xl font-semibold">{event.name}</h1>
        <p className="text-sm text-[var(--muted-foreground)] mb-4">
          {formatDateTime(event.startDateTime)}
        </p>
        <div className="relative h-[500px] rounded-lg border border-[var(--border)] overflow-hidden">
          <FloorPlanCanvas
            hallWidth={bounds.width}
            hallHeight={bounds.height}
            stalls={stalls}
            selectedStallId={selectedStall?.id}
            onSelectStall={selectStall}
            transformRef={transformRef}
          />
          <MapToolbar onZoomIn={zoomIn} onZoomOut={zoomOut} onReset={resetView} onCenter={centerView} />
        </div>
      </div>
      <aside className="rounded-lg border border-[var(--border)] p-4 h-fit">
        {selectedStall ? (
          <div className="space-y-2">
            <h2 className="font-medium">Stall {selectedStall.name}</h2>
            <p className="text-sm text-[var(--muted-foreground)]">
              Status: {selectedStall.status}
            </p>
            {selectedStall.basePrice != null && (
              <p className="text-sm">{formatCurrency(selectedStall.basePrice)}</p>
            )}
          </div>
        ) : (
          <p className="text-sm text-[var(--muted-foreground)]">
            Select a stall on the floor plan to view details.
          </p>
        )}
      </aside>
    </div>
  );
}
