import { useEffect, useState } from "react";
import { eventService } from "@/services/eventService";
import { reservationService } from "@/services/reservationService";
import { organizationService } from "@/services/organizationService";
import { genreService } from "@/services/genreService";
import { useMapStore } from "@/store/mapStore";
import { FloorPlanCanvas } from "@/components/map/FloorPlanCanvas";
import { MapToolbar } from "@/components/map/MapToolbar";
import { useMapControls } from "@/hooks/useMapControls";
import { Loader } from "@/components/feedback/Loader";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Store, ShoppingBag, CalendarDays, AlertCircle, Sparkles, Filter, CheckCircle2 } from "lucide-react";
import { toast } from "@/components/feedback/Toast";
import { formatCurrency, formatDateTime } from "@/utils/formatters";

export default function DiscoverStallsPage() {
  const [events, setEvents] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [eventStalls, setEventStalls] = useState(null);
  const [dialogStall, setDialogStall] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [genres, setGenres] = useState(null);
  const [organizations, setOrganizations] = useState(null);
  const [form, setForm] = useState({ genreId: "", organizationId: "" });

  const selectedStall = useMapStore((s) => s.selectedStall);
  const selectStall = useMapStore((s) => s.selectStall);
  const { transformRef, zoomIn, zoomOut, resetView, centerView } = useMapControls();

  useEffect(() => {
    eventService.getUpcoming().then((data) => {
      const list = Array.isArray(data) ? data : data?.content || [];
      setEvents(list);
      if (list.length > 0) setSelectedEvent(list[0]);
    }).catch(() => setEvents([]));
    genreService.getAll().then(setGenres).catch(() => setGenres([]));
    organizationService
      .getMine()
      .then(setOrganizations)
      .catch(() => setOrganizations([]));
  }, []);

  useEffect(() => {
    selectStall(null);
    if (selectedEvent) {
      eventService.getStalls(selectedEvent.id).then(setEventStalls).catch(() => setEventStalls([]));
    } else {
      setEventStalls(null);
    }
  }, [selectedEvent, selectStall]);

  if (!events) return <Loader label="Loading exhibition events..." />;

  const stalls = (eventStalls ?? []).map((es) => ({
    id: es.stallId || es.id,
    name: es.stallName || es.stallNumber || `#${es.stallId || es.id}`,
    status: es.status || "AVAILABLE",
    layout: es.layout,
    basePrice: es.basePrice || es.price || 500,
  }));

  const bounds = stalls.reduce(
    (acc, s) =>
      s.layout
        ? {
            width: Math.max(acc.width, s.layout.xCoord + s.layout.width + 50),
            height: Math.max(acc.height, s.layout.yCoord + s.layout.height + 50),
          }
        : acc,
    { width: 800, height: 600 }
  );

  function handleSelectStall(stall) {
    if (stall.status !== "AVAILABLE") {
      toast.error(`Stall ${stall.name} is currently ${stall.status.toLowerCase()}, not available for reservation.`);
      return;
    }
    selectStall(stall);
    setDialogStall(stall);
    setForm({
      genreId: genres?.[0]?.id ?? "",
      organizationId: organizations?.[0]?.id ?? "",
    });
  }

  async function handleReserve(e) {
    e.preventDefault();
    if (!form.organizationId) {
      toast.error("Please select a vendor organization.");
      return;
    }
    setSubmitting(true);
    try {
      const start = selectedEvent.startDateTime || new Date().toISOString();
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
      await reservationService.create({
        eventId: selectedEvent.id,
        stallIds: [dialogStall.id],
        reservationStartDateTime: start,
        expiresAt,
        genreId: form.genreId || undefined,
        organizationId: form.organizationId,
      });
      toast.success(`Reservation hold successfully placed on Stall ${dialogStall.name}!`);
      setDialogStall(null);
      eventService.getStalls(selectedEvent.id).then(setEventStalls);
    } catch (err) {
      toast.error(err.response?.data?.message ?? "Failed to reserve stall.");
    } finally {
      setSubmitting(false);
    }
  }

  const noOrganizations = organizations != null && organizations.length === 0;

  return (
    <div className="space-y-6">
      {/* Header & Event Selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[var(--border)] pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Interactive Stall Discovery</h1>
          <p className="text-sm text-[var(--muted-foreground)]">
            Explore exhibition floor blueprints, check real-time availability, and secure commercial spaces.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <label className="text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)] shrink-0">
            Select Exhibition:
          </label>
          <select
            value={selectedEvent?.id ?? ""}
            onChange={(e) => setSelectedEvent(events.find((ev) => String(ev.id) === e.target.value) ?? null)}
            className="h-10 rounded-xl border border-[var(--input)] bg-[var(--card)] px-3.5 text-sm font-semibold shadow-sm focus:ring-2 focus:ring-[var(--ring)]"
          >
            <option value="">Select Exhibition...</option>
            {events.map((ev) => (
              <option key={ev.id} value={ev.id}>
                {ev.name} ({formatDateTime(ev.startDateTime).split(",")[0]})
              </option>
            ))}
          </select>
        </div>
      </div>

      {noOrganizations && (
        <div className="rounded-2xl bg-destructive/10 border border-destructive/30 p-4 text-xs text-destructive font-medium flex items-center gap-2">
          <AlertCircle className="size-4 shrink-0" />
          <span>You are not currently associated with a commercial vendor organization. Please register or join an organization account to lease stalls.</span>
        </div>
      )}

      {/* Floor Plan Legend & Controls Bar */}
      {selectedEvent && (
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)]/80 backdrop-blur-md p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-md bg-[var(--primary)]/15 px-2.5 py-0.5 text-xs font-bold text-[var(--primary)] border border-[var(--primary)]/30">
              <Sparkles className="size-3" />
              {selectedEvent.name}
            </span>
          </div>

          <div className="flex items-center gap-6 text-xs font-semibold">
            <div className="flex items-center gap-2">
              <span className="size-3 rounded-full bg-green-500 shadow-sm animate-pulse" />
              <span>Available</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="size-3 rounded-full bg-amber-500 shadow-sm" />
              <span>On Hold</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="size-3 rounded-full bg-destructive shadow-sm" />
              <span>Reserved</span>
            </div>
          </div>
        </div>
      )}

      {/* Interactive Canvas Viewport */}
      {!selectedEvent ? (
        <div className="rounded-2xl border border-dashed border-[var(--border)] p-16 text-center space-y-3 bg-[var(--card)]/40">
          <Store className="size-12 mx-auto text-[var(--muted-foreground)] opacity-40" />
          <p className="text-base font-medium text-[var(--foreground)]">No exhibition selected</p>
          <p className="text-xs text-[var(--muted-foreground)] max-w-sm mx-auto">
            Choose an upcoming exhibition or book fair from the dropdown above to load the interactive floor blueprint.
          </p>
        </div>
      ) : !eventStalls ? (
        <Loader label="Loading interactive floor plan & stall coordinates..." />
      ) : (
        <div className="relative h-[580px] rounded-2xl border border-[var(--border)] bg-[var(--card)]/60 backdrop-blur-md overflow-hidden shadow-lg">
          <FloorPlanCanvas
            hallWidth={bounds.width}
            hallHeight={bounds.height}
            stalls={stalls}
            selectedStallId={selectedStall?.id}
            onSelectStall={handleSelectStall}
            transformRef={transformRef}
          />
          <MapToolbar onZoomIn={zoomIn} onZoomOut={zoomOut} onReset={resetView} onCenter={centerView} />
          <div className="absolute bottom-4 left-4 bg-[var(--background)]/80 backdrop-blur-md border border-[var(--border)] rounded-xl px-3 py-1.5 text-[11px] font-medium text-[var(--muted-foreground)] shadow-sm pointer-events-none">
            Click any green available stall on the floor plan to secure a reservation hold.
          </div>
        </div>
      )}

      {/* Reservation Hold Modal */}
      <Dialog open={Boolean(dialogStall)} onOpenChange={(open) => !open && setDialogStall(null)}>
        <DialogContent className="max-w-lg rounded-2xl p-0 overflow-hidden bg-[var(--card)] border border-[var(--border)] shadow-2xl">
          <div className="bg-gradient-to-r from-[var(--primary)] to-[var(--ring)] p-6 text-[var(--primary-foreground)] flex items-center justify-between">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-0.5 text-[11px] font-bold uppercase tracking-wider mb-1">
                <Sparkles className="size-3" />
                Exhibition Space Allocation
              </span>
              <DialogTitle className="text-2xl font-extrabold tracking-tight">
                Secure Exhibition Stall {dialogStall?.name}
              </DialogTitle>
              <p className="text-xs opacity-90 mt-0.5">
                Place a 24-hour commercial reservation hold for your corporate showcase.
              </p>
            </div>
          </div>

          {dialogStall && (
            <form onSubmit={handleReserve} className="p-6 space-y-5">
              <div className="rounded-xl bg-[var(--muted)]/50 border border-[var(--border)] p-4 space-y-2.5 text-xs">
                <div className="flex justify-between items-center text-sm font-bold border-b border-[var(--border)]/60 pb-2">
                  <span className="text-[var(--muted-foreground)]">Selected Stall:</span>
                  <span className="text-[var(--primary)] text-base">{dialogStall.name}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[var(--muted-foreground)]">Exhibition Event:</span>
                  <span className="font-semibold">{selectedEvent?.name}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[var(--muted-foreground)]">Stall Base Price:</span>
                  <span className="font-semibold">{formatCurrency(dialogStall.basePrice || 500)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[var(--muted-foreground)]">Processing & VAT (10%):</span>
                  <span className="font-semibold">{formatCurrency((dialogStall.basePrice || 500) * 0.1)}</span>
                </div>
                <div className="pt-2 border-t border-[var(--border)] flex justify-between items-center text-sm font-extrabold text-[var(--ring)]">
                  <span>Total Lease Investment:</span>
                  <span className="text-lg">{formatCurrency((dialogStall.basePrice || 500) * 1.1)}</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wider">
                  Literary / Exhibition Genre
                </label>
                <select
                  className="w-full h-10 rounded-xl border border-[var(--input)] bg-[var(--background)] px-3 text-sm focus:ring-2 focus:ring-[var(--ring)]"
                  value={form.genreId}
                  onChange={(e) => setForm((f) => ({ ...f, genreId: e.target.value }))}
                >
                  <option value="">Select Genre (Optional)...</option>
                  {(genres ?? []).map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wider">
                  Vendor Organization *
                </label>
                <select
                  required
                  className="w-full h-10 rounded-xl border border-[var(--input)] bg-[var(--background)] px-3 text-sm focus:ring-2 focus:ring-[var(--ring)]"
                  value={form.organizationId}
                  onChange={(e) => setForm((f) => ({ ...f, organizationId: e.target.value }))}
                >
                  <option value="">Select Vendor Organization...</option>
                  {(organizations ?? []).map((org) => (
                    <option key={org.id} value={org.id}>
                      {org.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="rounded-xl bg-amber-500/10 border border-amber-500/30 p-3 text-[11px] text-amber-600 leading-relaxed flex items-start gap-2">
                <AlertCircle className="size-4 shrink-0 mt-0.5" />
                <div>
                  <strong>24-Hour Hold Policy:</strong> Securing this hold blocks the stall for 24 hours. After submitting, navigate to <strong>My Reservations</strong> to complete corporate invoice or card checkout to finalize your lease.
                </div>
              </div>

              <DialogFooter className="pt-3 border-t border-[var(--border)] flex items-center justify-end gap-3">
                <Button type="button" variant="outline" onClick={() => setDialogStall(null)} className="rounded-xl">
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={submitting || noOrganizations || !form.organizationId}
                  className="rounded-xl shadow-md bg-gradient-to-r from-[var(--primary)] to-[var(--ring)] text-[var(--primary-foreground)] font-bold px-6 h-11"
                >
                  {submitting ? "Securing Hold..." : "Confirm Reservation Hold"}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
