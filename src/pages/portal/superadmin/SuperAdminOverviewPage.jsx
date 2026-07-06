import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { organizationService } from "@/services/organizationService";
import { userService } from "@/services/userService";
import { Loader } from "@/components/feedback/Loader";
import { Button } from "@/components/ui/button";
import { Building2, Users, ShieldCheck, Activity, Plus, ArrowRight, Sparkles, Server, Cpu, Globe } from "lucide-react";

export default function SuperAdminOverviewPage() {
  const [organizations, setOrganizations] = useState(null);
  const [users, setUsers] = useState(null);

  useEffect(() => {
    organizationService.getAllPaged({ size: 20 }).then((page) => setOrganizations(page.content || []));
    userService.getAllPaged({ size: 20 }).then((page) => setUsers(page.content || [])).catch(() => setUsers([]));
  }, []);

  if (!organizations || !users) return <Loader label="Loading system governance analytics..." />;

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
                Global System Governance
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">Super Admin Command Center</h1>
            <p className="text-sm text-[var(--muted-foreground)]">
              Monitor multi-tenant organizations, configure platform capabilities, and oversee user role security.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Button asChild variant="outline" className="rounded-xl border-[var(--border)] bg-[var(--background)] shadow-sm">
              <Link to="/portal/superadmin/users" className="flex items-center gap-2">
                <Users className="size-4 text-[var(--ring)]" />
                <span>User Governance</span>
              </Link>
            </Button>
            <Button asChild className="rounded-xl bg-gradient-to-r from-[var(--primary)] to-[var(--ring)] text-[var(--primary-foreground)] shadow-md">
              <Link to="/portal/superadmin/tenants" className="flex items-center gap-2">
                <Plus className="size-4" />
                <span>Manage Tenants</span>
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* KPI Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)]/80 backdrop-blur-md p-6 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">Platform Tenants</p>
            <p className="text-3xl font-black">{organizations.length}</p>
          </div>
          <div className="flex size-12 items-center justify-center rounded-2xl bg-[var(--primary)]/10 text-[var(--primary)]">
            <Building2 className="size-6" />
          </div>
        </div>

        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)]/80 backdrop-blur-md p-6 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">Total Accounts</p>
            <p className="text-3xl font-black">{users.length}</p>
          </div>
          <div className="flex size-12 items-center justify-center rounded-2xl bg-[var(--ring)]/10 text-[var(--ring)]">
            <Users className="size-6" />
          </div>
        </div>

        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)]/80 backdrop-blur-md p-6 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">System Uptime</p>
            <p className="text-3xl font-black text-green-600">99.98%</p>
          </div>
          <div className="flex size-12 items-center justify-center rounded-2xl bg-green-500/10 text-green-600">
            <Activity className="size-6" />
          </div>
        </div>

        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)]/80 backdrop-blur-md p-6 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">Server Nodes</p>
            <p className="text-3xl font-black text-blue-500">Active</p>
          </div>
          <div className="flex size-12 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-500">
            <Server className="size-6" />
          </div>
        </div>
      </div>

      {/* Tenant Directory Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold tracking-tight">Active Platform Tenants & Organizations</h2>
          <Link to="/portal/superadmin/tenants" className="text-xs font-semibold text-[var(--primary)] hover:underline flex items-center gap-1">
            <span>View All Tenants</span>
            <ArrowRight className="size-3.5" />
          </Link>
        </div>

        {organizations.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[var(--border)] p-12 text-center space-y-3 bg-[var(--card)]/40">
            <Building2 className="size-10 mx-auto text-[var(--muted-foreground)] opacity-50" />
            <p className="text-sm font-medium text-[var(--muted-foreground)]">No tenant organizations registered yet.</p>
            <Button asChild size="sm" className="rounded-xl">
              <Link to="/portal/superadmin/tenants">Create First Organization</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {organizations.slice(0, 6).map((org) => (
              <div key={org.id} className="group rounded-2xl border border-[var(--border)] bg-[var(--card)]/80 backdrop-blur-md p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-bold text-base group-hover:text-[var(--primary)] transition-colors line-clamp-1">{org.name}</h3>
                    <span className="shrink-0 rounded-md bg-green-500/10 px-2 py-0.5 text-[10px] font-bold text-green-600 dark:text-green-400 border border-green-500/30">
                      ACTIVE
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1 pt-1">
                    {(org.capabilities ?? []).map((cap) => (
                      <span key={cap} className="rounded bg-[var(--primary)]/10 px-1.5 py-0.5 text-[10px] font-semibold text-[var(--primary)]">
                        {cap.replace("CAN_", "")}
                      </span>
                    ))}
                    {(org.capabilities ?? []).length === 0 && (
                      <span className="text-[11px] text-[var(--muted-foreground)] italic">No assigned capabilities</span>
                    )}
                  </div>
                </div>

                <div className="pt-3 border-t border-[var(--border)]/60 flex items-center justify-between text-xs text-[var(--muted-foreground)]">
                  <span className="flex items-center gap-1.5 font-mono">
                    <Globe className="size-3.5 text-[var(--ring)]" />
                    ID: #{org.id}
                  </span>
                  <Link
                    to="/portal/superadmin/tenants"
                    className="font-semibold text-[var(--primary)] hover:underline flex items-center gap-1"
                  >
                    <span>Configure</span>
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
