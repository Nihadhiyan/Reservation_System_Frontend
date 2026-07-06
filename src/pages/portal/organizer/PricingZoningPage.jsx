import { useEffect, useState } from "react";
import { eventService } from "@/services/eventService";
import { Loader } from "@/components/feedback/Loader";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/feedback/Toast";
import { formatCurrency, formatDateTime } from "@/utils/formatters";

/**
 * Per-stall pricing editor for an event: pick an event, then edit each
 * assigned stall's basePrice/manualOverridePrice via PUT /event-stalls/{id}.
 * "Zoning" (genre/category restrictions per stall) has no backing endpoint
 * on the backend yet - only pricing is wired here.
 */
export default function PricingZoningPage() {
  const [events, setEvents] = useState(null);
  const [selectedEventId, setSelectedEventId] = useState("");
  const [eventStalls, setEventStalls] = useState(null);
  const [edits, setEdits] = useState({});
  const [savingId, setSavingId] = useState(null);

  useEffect(() => {
    eventService.getAllPaged({ size: 100 }).then((page) => setEvents(page.content));
  }, []);

  useEffect(() => {
    setEventStalls(null);
    setEdits({});
    if (selectedEventId) {
      eventService.getStalls(selectedEventId).then(setEventStalls);
    }
  }, [selectedEventId]);

  if (!events) return <Loader label="Loading events..." />;

  function fieldValue(es, field) {
    return edits[es.id]?.[field] ?? es[field] ?? "";
  }

  function setField(es, field, value) {
    setEdits((prev) => ({ ...prev, [es.id]: { ...prev[es.id], [field]: value } }));
  }

  async function handleSave(es) {
    setSavingId(es.id);
    try {
      await eventService.updateEventStall(es.id, {
        eventId: selectedEventId,
        stallId: es.stallId,
        basePrice: Number(fieldValue(es, "basePrice")),
        manualOverridePrice:
          fieldValue(es, "manualOverridePrice") === ""
            ? null
            : Number(fieldValue(es, "manualOverridePrice")),
        status: es.status,
      });
      toast.success(`Updated pricing for ${es.stallName}.`);
      eventService.getStalls(selectedEventId).then(setEventStalls);
    } catch (err) {
      toast.error(err.response?.data?.message ?? "Failed to update pricing.");
    } finally {
      setSavingId(null);
    }
  }

  return (
    <div>
      <h1 className="text-xl font-semibold mb-4">Pricing & Zoning</h1>

      <div className="mb-4 max-w-sm">
        <label className="text-xs font-medium text-[var(--muted-foreground)] mb-1 block">
          Event
        </label>
        <select
          className="w-full h-9 rounded-md border border-[var(--input)] bg-[var(--background)] px-3 text-sm"
          value={selectedEventId}
          onChange={(e) => setSelectedEventId(e.target.value)}
        >
          <option value="">Select an event...</option>
          {events.map((ev) => (
            <option key={ev.id} value={ev.id}>
              {ev.name} - {formatDateTime(ev.startDateTime)}
            </option>
          ))}
        </select>
      </div>

      {!selectedEventId ? (
        <p className="text-sm text-[var(--muted-foreground)]">
          Choose an event above to edit its stall pricing.
        </p>
      ) : eventStalls === null ? (
        <Loader label="Loading stalls..." />
      ) : (
        <div className="rounded-lg border border-[var(--border)] overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-[var(--muted)] text-left">
              <tr>
                <th className="px-3 py-2 font-medium">Stall</th>
                <th className="px-3 py-2 font-medium">Hall</th>
                <th className="px-3 py-2 font-medium">Status</th>
                <th className="px-3 py-2 font-medium">Base price</th>
                <th className="px-3 py-2 font-medium">Override price</th>
                <th className="px-3 py-2 font-medium"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {eventStalls.map((es) => (
                <tr key={es.id}>
                  <td className="px-3 py-2">{es.stallName}</td>
                  <td className="px-3 py-2 text-[var(--muted-foreground)]">{es.hallName}</td>
                  <td className="px-3 py-2 text-[var(--muted-foreground)]">{es.status}</td>
                  <td className="px-3 py-2">
                    <Input
                      type="number"
                      min="0"
                      className="w-28 h-8"
                      value={fieldValue(es, "basePrice")}
                      onChange={(e) => setField(es, "basePrice", e.target.value)}
                    />
                  </td>
                  <td className="px-3 py-2">
                    <Input
                      type="number"
                      min="0"
                      className="w-28 h-8"
                      value={fieldValue(es, "manualOverridePrice")}
                      onChange={(e) => setField(es, "manualOverridePrice", e.target.value)}
                    />
                  </td>
                  <td className="px-3 py-2 text-right">
                    <Button size="sm" onClick={() => handleSave(es)} disabled={savingId === es.id}>
                      {savingId === es.id ? "Saving..." : "Save"}
                    </Button>
                  </td>
                </tr>
              ))}
              {eventStalls.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-3 py-3 text-center text-[var(--muted-foreground)]">
                    No stalls assigned to this event yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {eventStalls?.length > 0 && (
        <p className="mt-4 text-xs text-[var(--muted-foreground)]">
          Example current price:{" "}
          {formatCurrency(eventStalls[0].manualOverridePrice ?? eventStalls[0].basePrice)}
        </p>
      )}
    </div>
  );
}
