import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { reservationService } from "@/services/reservationService";
import { Loader } from "@/components/feedback/Loader";
import { Button } from "@/components/ui/button";
import { Store, Clock, CheckCircle2, DollarSign, Plus, ArrowRight, Sparkles, ClipboardList, Calendar } from "lucide-react";
import { formatCurrency, formatDateTime } from "@/utils/formatters";

export default function VendorOverviewPage() {
  const [reservations, setReservations] = useState(null);

  useEffect(() => {
    reservationService.getMy().then((data) => {
      setReservations(Array.isArray(data) ? data : data?.content || []);
    }).catch(() => setReservations([]));
  }, []);

  if (!reservations) return <Loader label="Loading executive vendor metrics..." />;

  const activeHolds = reservations.filter((r) => r.status === "HOLD" || r.status === "PENDING").length;
  const confirmedStalls = reservations.filter((r) => r.status === "CONFIRMED" || r.status === "PAID").length;
  const totalSpent = reservations.reduce((acc, r) => acc + (r.totalPrice || r.amount || 0), 0);

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
                Stall Vendor Portal
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">Executive Vendor Dashboard</h1>
            <p className="text-sm text-[var(--muted-foreground)]">
              Lease exhibition stalls, monitor reservation countdowns, and manage commercial showcases.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Button asChild variant="outline" className="rounded-xl border-[var(--border)] bg-[var(--background)] shadow-sm">
              <Link to="/portal/vendor/reservations" className="flex items-center gap-2">
                <ClipboardList className="size-4 text-[var(--ring)]" />
                <span>My Reservations</span>
              </Link>
            </Button>
            <Button asChild className="rounded-xl bg-gradient-to-r from-[var(--primary)] to-[var(--ring)] text-[var(--primary-foreground)] shadow-md">
              <Link to="/portal/vendor/discover" className="flex items-center gap-2">
                <Store className="size-4" />
                <span>Discover Stalls</span>
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* KPI Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)]/80 backdrop-blur-md p-6 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">Total Bookings</p>
            <p className="text-3xl font-black">{reservations.length}</p>
          </div>
          <div className="flex size-12 items-center justify-center rounded-2xl bg-[var(--primary)]/10 text-[var(--primary)]">
            <Store className="size-6" />
          </div>
        </div>

        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)]/80 backdrop-blur-md p-6 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">Confirmed Stalls</p>
            <p className="text-3xl font-black text-green-600">{confirmedStalls}</p>
          </div>
          <div className="flex size-12 items-center justify-center rounded-2xl bg-green-500/10 text-green-600">
            <CheckCircle2 className="size-6" />
          </div>
        </div>

        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)]/80 backdrop-blur-md p-6 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">Active Holds</p>
            <p className="text-3xl font-black text-amber-500">{activeHolds}</p>
          </div>
          <div className="flex size-12 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-500">
            <Clock className="size-6" />
          </div>
        </div>

        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)]/80 backdrop-blur-md p-6 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">Total Expenditure</p>
            <p className="text-2xl font-black text-[var(--ring)]">{formatCurrency(totalSpent)}</p>
          </div>
          <div className="flex size-12 items-center justify-center rounded-2xl bg-[var(--ring)]/10 text-[var(--ring)]">
            <DollarSign className="size-6" />
          </div>
        </div>
      </div>

      {/* Active Reservations Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold tracking-tight">Your Stall Showcase Portfolio</h2>
          <Link to="/portal/vendor/reservations" className="text-xs font-semibold text-[var(--primary)] hover:underline flex items-center gap-1">
            <span>View All</span>
            <ArrowRight className="size-3.5" />
          </Link>
        </div>

        {reservations.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[var(--border)] p-12 text-center space-y-3 bg-[var(--card)]/40">
            <Store className="size-10 mx-auto text-[var(--muted-foreground)] opacity-50" />
            <p className="text-sm font-medium text-[var(--muted-foreground)]">No exhibition stalls leased or reserved yet.</p>
            <Button asChild size="sm" className="rounded-xl">
              <Link to="/portal/vendor/discover">Browse Available Stalls</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reservations.slice(0, 6).map((res) => (
              <div key={res.id} className="group rounded-2xl border border-[var(--border)] bg-[var(--card)]/80 backdrop-blur-md p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-bold text-base group-hover:text-[var(--primary)] transition-colors line-clamp-1">
                      Stall #{res.stallId || res.id}
                    </h3>
                    <span className={`shrink-0 rounded-md px-2 py-0.5 text-[10px] font-bold border ${
                      res.status === "CONFIRMED" || res.status === "PAID"
                        ? "bg-green-500/10 text-green-600 border-green-500/30"
                        : res.status === "HOLD" || res.status === "PENDING"
                        ? "bg-amber-500/10 text-amber-500 border-amber-500/30"
                        : "bg-[var(--muted)] text-[var(--muted-foreground)] border-[var(--border)]"
                    }`}>
                      {res.status || "CONFIRMED"}
                    </span>
                  </div>
                  <p className="text-xs text-[var(--muted-foreground)] flex items-center gap-1.5">
                    <Calendar className="size-3.5 text-[var(--ring)]" />
                    Event ID: #{res.eventId || "Exhibition"}
                  </p>
                </div>

                <div className="pt-3 border-t border-[var(--border)]/60 flex items-center justify-between text-xs">
                  <span className="font-bold text-[var(--foreground)]">
                    {formatCurrency(res.totalPrice || res.amount || 0)}
                  </span>
                  <Link
                    to="/portal/vendor/reservations"
                    className="font-semibold text-[var(--primary)] hover:underline flex items-center gap-1"
                  >
                    <span>Manage</span>
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
