import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { venueService } from "@/services/venueService";
import { Loader } from "@/components/feedback/Loader";
import { Button } from "@/components/ui/button";
import { Building2, Map, Maximize, TrendingUp, Plus, ArrowRight, Sparkles, MapPin } from "lucide-react";
import { formatNumber } from "@/utils/formatters";

export default function OwnerOverviewPage() {
  const [venues, setVenues] = useState(null);

  useEffect(() => {
    venueService.getAllPaged({ size: 20 }).then((page) => setVenues(page.content));
  }, []);

  if (!venues) return <Loader label="Loading executive owner metrics..." />;

  const totalFootage = venues.reduce((acc, v) => acc + (v.totalSquareFootage || 0), 0);
  const activeBlueprints = venues.filter((v) => v.blueprintImageUrl).length;

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
                Venue Owner Portal
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">Executive Venue Overview</h1>
            <p className="text-sm text-[var(--muted-foreground)]">
              Monitor real-estate capacity, architectural blueprints, and exhibition hall occupancy.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Button asChild variant="outline" className="rounded-xl border-[var(--border)] bg-[var(--background)] shadow-sm">
              <Link to="/portal/owner/blueprint" className="flex items-center gap-2">
                <Map className="size-4 text-[var(--ring)]" />
                <span>Blueprint Editor</span>
              </Link>
            </Button>
            <Button asChild className="rounded-xl bg-gradient-to-r from-[var(--primary)] to-[var(--ring)] text-[var(--primary-foreground)] shadow-md">
              <Link to="/portal/owner/venues" className="flex items-center gap-2">
                <Plus className="size-4" />
                <span>Manage Venues</span>
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* KPI Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)]/80 backdrop-blur-md p-6 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">Total Venues</p>
            <p className="text-3xl font-black">{venues.length}</p>
          </div>
          <div className="flex size-12 items-center justify-center rounded-2xl bg-[var(--primary)]/10 text-[var(--primary)]">
            <Building2 className="size-6" />
          </div>
        </div>

        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)]/80 backdrop-blur-md p-6 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">Total Floor Space</p>
            <p className="text-2xl font-black">{formatNumber(totalFootage)} <span className="text-xs font-normal text-[var(--muted-foreground)]">sq. ft</span></p>
          </div>
          <div className="flex size-12 items-center justify-center rounded-2xl bg-[var(--ring)]/10 text-[var(--ring)]">
            <Maximize className="size-6" />
          </div>
        </div>

        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)]/80 backdrop-blur-md p-6 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">Active Blueprints</p>
            <p className="text-3xl font-black">{activeBlueprints}</p>
          </div>
          <div className="flex size-12 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-500">
            <Map className="size-6" />
          </div>
        </div>

        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)]/80 backdrop-blur-md p-6 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">Occupancy Index</p>
            <p className="text-3xl font-black text-green-600">94.2%</p>
          </div>
          <div className="flex size-12 items-center justify-center rounded-2xl bg-green-500/10 text-green-600">
            <TrendingUp className="size-6" />
          </div>
        </div>
      </div>

      {/* Owned Venues Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold tracking-tight">Your Real Estate Portfolio</h2>
          <Link to="/portal/owner/venues" className="text-xs font-semibold text-[var(--primary)] hover:underline flex items-center gap-1">
            <span>View All</span>
            <ArrowRight className="size-3.5" />
          </Link>
        </div>

        {venues.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[var(--border)] p-12 text-center space-y-3 bg-[var(--card)]/40">
            <Building2 className="size-10 mx-auto text-[var(--muted-foreground)] opacity-50" />
            <p className="text-sm font-medium text-[var(--muted-foreground)]">No venues listed in your portfolio yet.</p>
            <Button asChild size="sm" className="rounded-xl">
              <Link to="/portal/owner/venues">Add First Venue</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {venues.slice(0, 6).map((venue) => (
              <div key={venue.id} className="group rounded-2xl border border-[var(--border)] bg-[var(--card)]/80 backdrop-blur-md p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-bold text-base group-hover:text-[var(--primary)] transition-colors line-clamp-1">{venue.name}</h3>
                    <span className="shrink-0 rounded-md bg-[var(--accent)] px-2 py-0.5 text-[10px] font-bold text-[var(--accent-foreground)] border border-[var(--border)]">
                      {venue.city || "Global"}
                    </span>
                  </div>
                  <p className="text-xs text-[var(--muted-foreground)] line-clamp-2 leading-relaxed">{venue.description || "No description provided."}</p>
                </div>

                <div className="pt-3 border-t border-[var(--border)]/60 flex items-center justify-between text-xs text-[var(--muted-foreground)]">
                  <span className="flex items-center gap-1">
                    <Maximize className="size-3.5 text-[var(--ring)]" />
                    {formatNumber(venue.totalSquareFootage || 0)} sq ft
                  </span>
                  <Link
                    to="/portal/owner/blueprint"
                    className="font-semibold text-[var(--primary)] hover:underline flex items-center gap-1"
                  >
                    <span>Blueprint</span>
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
