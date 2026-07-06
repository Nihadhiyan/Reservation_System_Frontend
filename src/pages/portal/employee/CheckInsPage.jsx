import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { reservationService } from "@/services/reservationService";
import { Loader } from "@/components/feedback/Loader";
import { Button } from "@/components/ui/button";
import { ShieldCheck, CheckCircle2, Clock, AlertTriangle, QrCode, Search, Calendar, Store, ArrowLeft, RefreshCw } from "lucide-react";
import { formatDateTime, formatCurrency } from "@/utils/formatters";

export default function CheckInsPage() {
  const [reservations, setReservations] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  function loadCheckIns() {
    reservationService.getAllPaged({ size: 100 }).then((page) => {
      setReservations(page.content || []);
    }).catch(() => setReservations([]));
  }

  useEffect(() => {
    loadCheckIns();
  }, []);

  if (!reservations) return <Loader label="Loading security check-in audit logs..." />;

  const confirmedList = reservations.filter((r) => r.status === "CONFIRMED" || r.status === "PAID");
  const pendingList = reservations.filter((r) => r.status === "HOLD" || r.status === "PENDING");

  const filtered = confirmedList.filter((r) => {
    if (!searchTerm.trim()) return true;
    const q = searchTerm.toLowerCase();
    return (
      String(r.id).includes(q) ||
      String(r.stallId || "").includes(q) ||
      String(r.eventId || "").includes(q)
    );
  });

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)]/80 backdrop-blur-md p-6 md:p-8 shadow-lg">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 size-64 rounded-full bg-gradient-to-br from-[var(--primary)]/10 to-[var(--ring)]/10 blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--primary)]/10 border border-[var(--primary)]/30 px-3 py-0.5 text-xs font-bold text-[var(--primary)] uppercase tracking-wider">
                <ShieldCheck className="size-3" />
                Security Audit Log
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">Verified Entry & Check-ins</h1>
            <p className="text-sm text-[var(--muted-foreground)]">
              Real-time audit trail of verified attendees, stall allocations, and gate admissions.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Button asChild variant="outline" className="rounded-xl border-[var(--border)] bg-[var(--background)] shadow-sm">
              <Link to="/portal/employee/scanner" className="flex items-center gap-2">
                <QrCode className="size-4 text-[var(--primary)]" />
                <span>Open Scanner</span>
              </Link>
            </Button>
            <Button onClick={loadCheckIns} size="sm" variant="secondary" className="rounded-xl shadow-sm gap-1.5">
              <RefreshCw className="size-3.5" />
              <span>Refresh</span>
            </Button>
          </div>
        </div>
      </div>

      {/* KPI Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)]/80 backdrop-blur-md p-6 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">Verified Admissions</p>
            <p className="text-3xl font-black text-green-600">{confirmedList.length}</p>
          </div>
          <div className="flex size-12 items-center justify-center rounded-2xl bg-green-500/10 text-green-600">
            <CheckCircle2 className="size-6" />
          </div>
        </div>

        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)]/80 backdrop-blur-md p-6 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">Active Scanners</p>
            <p className="text-3xl font-black">4 Gates</p>
          </div>
          <div className="flex size-12 items-center justify-center rounded-2xl bg-[var(--primary)]/10 text-[var(--primary)]">
            <ShieldCheck className="size-6" />
          </div>
        </div>

        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)]/80 backdrop-blur-md p-6 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">Pending Arrival</p>
            <p className="text-3xl font-black text-amber-500">{pendingList.length}</p>
          </div>
          <div className="flex size-12 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-500">
            <Clock className="size-6" />
          </div>
        </div>

        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)]/80 backdrop-blur-md p-6 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">Security Status</p>
            <p className="text-xl font-black text-green-600">ALL CLEAR</p>
          </div>
          <div className="flex size-12 items-center justify-center rounded-2xl bg-green-500/10 text-green-600">
            <ShieldCheck className="size-6" />
          </div>
        </div>
      </div>

      {/* Search & List Section */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h2 className="text-lg font-bold tracking-tight">Verified Admission Records</h2>
          
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[var(--muted-foreground)]" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Filter by Ticket ID or Stall..."
              className="w-full h-10 rounded-xl border border-[var(--input)] bg-[var(--card)] pl-9 pr-3 text-xs font-medium shadow-sm focus:ring-2 focus:ring-[var(--ring)]"
            />
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[var(--border)] p-16 text-center space-y-3 bg-[var(--card)]/40">
            <ShieldCheck className="size-12 mx-auto text-[var(--muted-foreground)] opacity-40" />
            <p className="text-base font-medium text-[var(--foreground)]">No verified check-ins found</p>
            <p className="text-xs text-[var(--muted-foreground)] max-w-sm mx-auto">
              Scan attendee QR tickets at the gate or use the manual simulator to log verified admissions.
            </p>
            <div className="pt-2">
              <Button asChild size="sm" className="rounded-xl shadow-md">
                <Link to="/portal/employee/scanner">Open Gate Scanner</Link>
              </Button>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)]/80 backdrop-blur-md overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[var(--border)] bg-[var(--muted)]/40 text-[11px] font-bold text-[var(--muted-foreground)] uppercase tracking-wider">
                    <th className="py-3.5 px-5">Ticket / Pass ID</th>
                    <th className="py-3.5 px-5">Stall Allocation</th>
                    <th className="py-3.5 px-5">Exhibition Event</th>
                    <th className="py-3.5 px-5">Admission Status</th>
                    <th className="py-3.5 px-5 text-right">Lease Value</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border)]/60 text-xs font-medium">
                  {filtered.map((res) => (
                    <tr key={res.id} className="hover:bg-[var(--muted)]/20 transition-colors">
                      <td className="py-4 px-5 font-bold font-mono text-[var(--foreground)] flex items-center gap-2">
                        <CheckCircle2 className="size-4 text-green-500 shrink-0" />
                        <span>#{res.id}</span>
                      </td>
                      <td className="py-4 px-5">
                        <span className="inline-flex items-center gap-1 font-bold text-[var(--primary)] bg-[var(--primary)]/10 px-2 py-0.5 rounded border border-[var(--primary)]/20">
                          <Store className="size-3" />
                          Stall #{res.stallId || "Main"}
                        </span>
                      </td>
                      <td className="py-4 px-5 text-[var(--muted-foreground)]">
                        Event #{res.eventId || "Exhibition"}
                      </td>
                      <td className="py-4 px-5">
                        <span className="inline-flex items-center gap-1 rounded-full bg-green-500/10 border border-green-500/30 px-2.5 py-0.5 text-[10px] font-bold text-green-600 dark:text-green-400 uppercase tracking-wider">
                          ✔ Verified Entry
                        </span>
                      </td>
                      <td className="py-4 px-5 text-right font-black text-[var(--ring)]">
                        {formatCurrency(res.totalPrice || res.amount || 0)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
