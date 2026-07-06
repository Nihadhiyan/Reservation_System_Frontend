import { Navigate, Link } from "react-router-dom";
import { useAuthStore, ROLES } from "@/store/authStore";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { Sparkles } from "lucide-react";

const ROLE_HOME = {
  [ROLES.SUPER_ADMIN]: "/portal/superadmin",
  [ROLES.OWNER]: "/portal/owner",
  [ROLES.ORGANIZER]: "/portal/organizer",
  [ROLES.VENDOR]: "/portal/vendor",
  [ROLES.EMPLOYEE]: "/portal/employee",
};

const ROLE_LABEL = {
  [ROLES.SUPER_ADMIN]: "Super Admin",
  [ROLES.OWNER]: "Owner",
  [ROLES.ORGANIZER]: "Organizer",
  [ROLES.VENDOR]: "Vendor",
  [ROLES.EMPLOYEE]: "Employee",
};

/**
 * Single entry point (`/portal`). A user can hold multiple portal roles at
 * once (e.g. an org with both OWNS_VENUES and OPERATES_STALLS capabilities
 * makes its members both Owner and Vendor) - if there's exactly one, redirect
 * straight there; otherwise show a chooser rather than guessing.
 */
export default function DashboardGateway() {
  const portalRoles = useAuthStore((s) => s.portalRoles);
  const eligible = portalRoles.filter((r) => ROLE_HOME[r]);

  if (eligible.length === 0) {
    return <Navigate to="/" replace />;
  }

  if (eligible.length === 1) {
    return <Navigate to={ROLE_HOME[eligible[0]]} replace />;
  }

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center gap-6 p-6 bg-mesh-gradient">
      <div className="absolute top-6 right-6">
        <ThemeToggle />
      </div>
      <div className="w-full max-w-md rounded-2xl border border-[var(--border)] bg-[var(--card)]/90 p-8 shadow-2xl backdrop-blur-xl text-center space-y-6">
        <div className="space-y-2">
          <div className="mx-auto flex size-12 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--primary)] to-[var(--ring)] text-[var(--primary-foreground)] shadow-glow-yellow">
            <Sparkles className="size-6" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--foreground)]">Select Your Portal</h1>
          <p className="text-sm text-[var(--muted-foreground)]">
            Choose which commercial workspace you would like to access today.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-3.5">
          {eligible.map((role) => (
            <Link
              key={role}
              to={ROLE_HOME[role]}
              className="flex items-center justify-between rounded-xl border border-[var(--border)] bg-[var(--background)]/60 px-5 py-4 text-base font-semibold transition-all duration-200 hover:border-[var(--ring)] hover:bg-[var(--accent)] hover:shadow-md group"
            >
              <span>{ROLE_LABEL[role]} Portal</span>
              <span className="text-xs font-bold uppercase tracking-wider text-[var(--ring)] group-hover:translate-x-1 transition-transform">
                Enter →
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
