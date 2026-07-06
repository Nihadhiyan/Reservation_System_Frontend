import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { eventService } from "@/services/eventService";
import { venueService } from "@/services/venueService";
import { organizationService } from "@/services/organizationService";
import { Loader } from "@/components/feedback/Loader";
import { useMapStore } from "@/store/mapStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Plus, CalendarDays, MapPin, DollarSign, ArrowRight, Clock, Sparkles, Building } from "lucide-react";
import { toast } from "@/components/feedback/Toast";
import { formatDateTime } from "@/utils/formatters";

export default function ManageEventsPage() {
  const [events, setEvents] = useState(null);
  const [venues, setVenues] = useState(null);
  const [organizations, setOrganizations] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const setActiveEvent = useMapStore((s) => s.setActiveEvent);
  const setActiveVenue = useMapStore((s) => s.setActiveVenue);

  function loadAll() {
    eventService.getAllPaged({ size: 100 }).then((page) => setEvents(page.content));
    venueService.getAllPaged({ size: 100 }).then((page) => setVenues(page.content));
  }

  useEffect(() => {
    loadAll();
    organizationService
      .getMine()
      .then(setOrganizations)
      .catch(() => setOrganizations([]));
  }, []);

  if (!events || !venues) return <Loader label="Loading executive events..." />;

  function handleSelectForPricing(event) {
    setActiveEvent(event);
    const v = venues.find((x) => x.id === event.venueId);
    if (v) setActiveVenue(v);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border)] pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Exhibitions & Events</h1>
          <p className="text-sm text-[var(--muted-foreground)]">
            Schedule book fairs, configure stall pricing tiers, and manage floor zoning.
          </p>
        </div>
        <Button size="sm" onClick={() => setDialogOpen(true)} className="rounded-xl shadow-md h-10 px-4 gap-2 bg-gradient-to-r from-[var(--primary)] to-[var(--ring)] text-[var(--primary-foreground)]">
          <Plus className="size-4" />
          <span>New Event</span>
        </Button>
      </div>

      {events.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[var(--border)] p-16 text-center space-y-3 bg-[var(--card)]/40">
          <CalendarDays className="size-12 mx-auto text-[var(--muted-foreground)] opacity-40" />
          <p className="text-base font-medium text-[var(--foreground)]">No events scheduled</p>
          <p className="text-xs text-[var(--muted-foreground)] max-w-sm mx-auto">
            Schedule your first exhibition or trade show to start assigning stalls to commercial vendors.
          </p>
          <div className="pt-2">
            <Button onClick={() => setDialogOpen(true)} className="rounded-xl shadow-md">
              <Plus className="size-4 mr-1.5" />
              Schedule First Event
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => {
            const venue = venues.find((v) => v.id === event.venueId);
            return (
              <div key={event.id} className="group rounded-2xl border border-[var(--border)] bg-[var(--card)]/80 backdrop-blur-md overflow-hidden shadow-sm hover:shadow-lg transition-all flex flex-col justify-between">
                <div className="p-6 space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <span className="inline-flex items-center gap-1 rounded-md bg-[var(--primary)]/15 px-2.5 py-0.5 text-[10px] font-bold text-[var(--primary)] border border-[var(--primary)]/30">
                        {event.eventType || "EXHIBITION"}
                      </span>
                      <h3 className="font-bold text-lg group-hover:text-[var(--primary)] transition-colors leading-tight">
                        {event.name}
                      </h3>
                    </div>
                    <div className="flex size-10 items-center justify-center rounded-xl bg-[var(--ring)]/10 text-[var(--ring)] shrink-0">
                      <CalendarDays className="size-5" />
                    </div>
                  </div>

                  <p className="text-xs text-[var(--muted-foreground)] line-clamp-2 leading-relaxed">
                    {event.description || "No description provided."}
                  </p>

                  <div className="space-y-1.5 pt-2 border-t border-[var(--border)]/60 text-xs text-[var(--muted-foreground)]">
                    <div className="flex items-center gap-2">
                      <Building className="size-3.5 text-[var(--primary)] shrink-0" />
                      <span className="font-medium text-[var(--foreground)] truncate">{venue ? venue.name : `Venue #${event.venueId}`}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="size-3.5 text-[var(--ring)] shrink-0" />
                      <span>Starts: {formatDateTime(event.startDateTime).split(",")[0]}</span>
                    </div>
                  </div>
                </div>

                <div className="px-6 py-3.5 bg-[var(--muted)]/30 border-t border-[var(--border)] flex items-center justify-between">
                  <Link
                    to="/portal/organizer/pricing"
                    onClick={() => handleSelectForPricing(event)}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--primary)] hover:underline"
                  >
                    <DollarSign className="size-3.5" />
                    <span>Pricing & Zoning</span>
                  </Link>

                  <Link
                    to={`/events/${event.id}`}
                    className="text-xs font-semibold text-[var(--muted-foreground)] hover:text-[var(--foreground)] flex items-center gap-1 transition-colors"
                  >
                    <span>Public View</span>
                    <ArrowRight className="size-3" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {dialogOpen && (
        <CreateEventDialog
          venues={venues}
          organizations={organizations ?? []}
          onClose={() => setDialogOpen(false)}
          onCreated={() => {
            loadAll();
            setDialogOpen(false);
          }}
        />
      )}
    </div>
  );
}

function CreateEventDialog({ venues, organizations, onClose, onCreated }) {
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: "",
    description: "",
    eventType: "BOOK_FAIR",
    startDateTime: "2026-08-01T09:00",
    endDateTime: "2026-08-05T18:00",
    venueId: venues[0]?.id ?? "",
    organizerOrganizationId: organizations[0]?.id ?? "",
  });

  function set(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    try {
      const formatToISO = (dt) => {
        if (!dt) return new Date().toISOString();
        const dateObj = new Date(dt);
        return isNaN(dateObj.getTime()) ? new Date().toISOString() : dateObj.toISOString();
      };

      await eventService.create({
        name: form.name,
        description: form.description,
        eventType: form.eventType,
        venueId: form.venueId,
        organizerId: form.organizerOrganizationId,
        startDateTime: formatToISO(form.startDateTime),
        endDateTime: formatToISO(form.endDateTime),
        status: "UPCOMING",
        partnerIds: [],
      });
      toast.success("Exhibition event successfully scheduled.");
      onCreated();
    } catch (err) {
      toast.error(err.response?.data?.message ?? "Failed to schedule event.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-xl rounded-2xl p-6">
        <DialogHeader className="border-b border-[var(--border)] pb-4 mb-4">
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <CalendarDays className="size-5 text-[var(--primary)]" />
            <span>Schedule New Exhibition Event</span>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {organizations.length === 0 && (
            <div className="rounded-xl bg-destructive/10 border border-destructive/30 p-3 text-xs text-destructive font-medium">
              You aren't a member of any organization yet, so you cannot schedule a commercial event. Ask an org admin to add you.
            </div>
          )}
          {venues.length === 0 && (
            <div className="rounded-xl bg-amber-500/10 border border-amber-500/30 p-3 text-xs text-amber-500 font-medium">
              No exhibition venues are currently registered in the system. A venue is required to host an event.
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <F label="Event Name *">
              <Input required value={form.name} onChange={set("name")} placeholder="e.g., International Book Fair 2026" className="glass-input rounded-xl text-sm" />
            </F>
            <F label="Event Category *">
              <select
                className="w-full h-10 rounded-xl border border-[var(--input)] bg-[var(--background)] px-3 text-sm focus:ring-2 focus:ring-[var(--ring)]"
                value={form.eventType}
                onChange={set("eventType")}
              >
                <option value="BOOK_FAIR">Book Fair</option>
                <option value="TRADE_SHOW">Trade Show</option>
                <option value="EXHIBITION">General Exhibition</option>
                <option value="CONFERENCE">Conference</option>
              </select>
            </F>
          </div>

          <F label="Description *">
            <Input required value={form.description} onChange={set("description")} placeholder="Overview of the exhibition theme and target attendees..." className="glass-input rounded-xl text-sm" />
          </F>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <F label="Host Venue *">
              <select
                required
                className="w-full h-10 rounded-xl border border-[var(--input)] bg-[var(--background)] px-3 text-sm focus:ring-2 focus:ring-[var(--ring)]"
                value={form.venueId}
                onChange={set("venueId")}
              >
                <option value="">Select Venue...</option>
                {venues.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.name} ({v.city || "Global"})
                  </option>
                ))}
              </select>
            </F>
            <F label="Organizer Organization *">
              <select
                required
                className="w-full h-10 rounded-xl border border-[var(--input)] bg-[var(--background)] px-3 text-sm focus:ring-2 focus:ring-[var(--ring)]"
                value={form.organizerOrganizationId}
                onChange={set("organizerOrganizationId")}
              >
                <option value="">Select Organization...</option>
                {organizations.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.name}
                  </option>
                ))}
              </select>
            </F>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-[var(--border)]">
            <F label="Start Date & Time *">
              <Input type="datetime-local" required value={form.startDateTime} onChange={set("startDateTime")} className="glass-input rounded-xl text-sm" />
            </F>
            <F label="End Date & Time *">
              <Input type="datetime-local" required value={form.endDateTime} onChange={set("endDateTime")} className="glass-input rounded-xl text-sm" />
            </F>
          </div>

          <DialogFooter className="pt-4 border-t border-[var(--border)] flex items-center justify-end gap-3">
            <Button type="button" variant="outline" onClick={onClose} className="rounded-xl">
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={submitting || organizations.length === 0 || venues.length === 0}
              className="rounded-xl shadow-md bg-gradient-to-r from-[var(--primary)] to-[var(--ring)] text-[var(--primary-foreground)]"
            >
              {submitting ? "Scheduling..." : "Schedule Event"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function F({ label, children }) {
  return (
    <div className="space-y-1">
      <label className="text-xs font-semibold text-[var(--muted-foreground)]">{label}</label>
      {children}
    </div>
  );
}
