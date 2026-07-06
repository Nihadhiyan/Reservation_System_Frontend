import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { eventService } from "@/services/eventService";
import { Loader } from "@/components/feedback/Loader";
import { Button } from "@/components/ui/button";
import { CalendarDays, DollarSign, LayoutGrid, TrendingUp, Plus, ArrowRight, Sparkles, Clock } from "lucide-react";
import { formatDateTime } from "@/utils/formatters";

export default function OrganizerOverviewPage() {
  const [events, setEvents] = useState(null);

  useEffect(() => {
    eventService.getAllPaged({ size: 20 }).then((page) => setEvents(page.content));
  }, []);

  if (!events) return <Loader label="Loading executive organizer metrics..." />;

  const activeEvents = events.filter((e) => e.status === "ACTIVE" || !e.status || e.status === "SCHEDULED").length;

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)]/80 backdrop-blur-md p-6 md:p-8 shadow-lg">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 size-64 rounded-full bg-gradient-to-br from-[var(--primary)]/10 to-[var(--ring)]/10 blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--primary)]/10 border border-[var(--primary)]/30 px-3 py-0.5 text-xs font-bold text-[var(--primary)] uppercase tracking-wider">
                <Sparkles className="size-3" />
                Event Organizer Portal
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">Executive Event Overview</h1>
            <p className="text-sm text-[var(--muted-foreground)]">
              Orchestrate book fairs, trade exhibitions, floor zoning, and stall pricing tiers.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Button asChild variant="outline" className="rounded-xl border-[var(--border)] bg-[var(--background)] shadow-sm">
              <Link to="/portal/organizer/pricing" className="flex items-center gap-2">
                <DollarSign className="size-4 text-[var(--ring)]" />
                <span>Pricing & Zoning</span>
              </Link>
            </Button>
            <Button asChild className="rounded-xl bg-gradient-to-r from-[var(--primary)] to-[var(--ring)] text-[var(--primary-foreground)] shadow-md">
              <Link to="/portal/organizer/events" className="flex items-center gap-2">
                <Plus className="size-4" />
                <span>Manage Events</span>
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* KPI Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)]/80 backdrop-blur-md p-6 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">Total Events</p>
            <p className="text-3xl font-black">{events.length}</p>
          </div>
          <div className="flex size-12 items-center justify-center rounded-2xl bg-[var(--primary)]/10 text-[var(--primary)]">
            <CalendarDays className="size-6" />
          </div>
        </div>

        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)]/80 backdrop-blur-md p-6 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">Active Fairs</p>
            <p className="text-3xl font-black">{activeEvents}</p>
          </div>
          <div className="flex size-12 items-center justify-center rounded-2xl bg-[var(--ring)]/10 text-[var(--ring)]">
            <Sparkles className="size-6" />
          </div>
        </div>

        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)]/80 backdrop-blur-md p-6 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">Zoned Stalls</p>
            <p className="text-3xl font-black">128</p>
          </div>
          <div className="flex size-12 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-500">
            <LayoutGrid className="size-6" />
          </div>
        </div>

        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)]/80 backdrop-blur-md p-6 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">Revenue Index</p>
            <p className="text-3xl font-black text-green-600">+$48.5k</p>
          </div>
          <div className="flex size-12 items-center justify-center rounded-2xl bg-green-500/10 text-green-600">
            <TrendingUp className="size-6" />
          </div>
        </div>
      </div>

      {/* Managed Events Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold tracking-tight">Upcoming & Active Exhibitions</h2>
          <Link to="/portal/organizer/events" className="text-xs font-semibold text-[var(--primary)] hover:underline flex items-center gap-1">
            <span>View All</span>
            <ArrowRight className="size-3.5" />
          </Link>
        </div>

        {events.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[var(--border)] p-12 text-center space-y-3 bg-[var(--card)]/40">
            <CalendarDays className="size-10 mx-auto text-[var(--muted-foreground)] opacity-50" />
            <p className="text-sm font-medium text-[var(--muted-foreground)]">No exhibitions or book fairs scheduled yet.</p>
            <Button asChild size="sm" className="rounded-xl">
              <Link to="/portal/organizer/events">Schedule First Event</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.slice(0, 6).map((event) => (
              <div key={event.id} className="group rounded-2xl border border-[var(--border)] bg-[var(--card)]/80 backdrop-blur-md p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-bold text-base group-hover:text-[var(--primary)] transition-colors line-clamp-1">{event.name}</h3>
                    <span className="shrink-0 rounded-md bg-[var(--primary)]/15 px-2 py-0.5 text-[10px] font-bold text-[var(--primary)] border border-[var(--primary)]/30">
                      {event.eventType || "EXHIBITION"}
                    </span>
                  </div>
                  <p className="text-xs text-[var(--muted-foreground)] line-clamp-2 leading-relaxed">{event.description || "No description provided."}</p>
                </div>

                <div className="pt-3 border-t border-[var(--border)]/60 flex items-center justify-between text-xs text-[var(--muted-foreground)]">
                  <span className="flex items-center gap-1.5">
                    <Clock className="size-3.5 text-[var(--ring)]" />
                    {formatDateTime(event.startDateTime).split(",")[0]}
                  </span>
                  <Link
                    to="/portal/organizer/pricing"
                    className="font-semibold text-[var(--primary)] hover:underline flex items-center gap-1"
                  >
                    <span>Pricing</span>
                    <ArrowRight className="size-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
