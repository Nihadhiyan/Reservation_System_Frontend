import { Outlet, Link, NavLink } from "react-router-dom";
import { User, LogIn, Sparkles, LayoutDashboard, Calendar, Building } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { cn } from "@/lib/utils";

export function CustomerLayout() {
  const { user, isAuthenticated, portalRoles } = useAuth();

  return (
    <div className="flex min-h-screen flex-col bg-[var(--background)] text-[var(--foreground)] bg-mesh-gradient">
      <header className="sticky top-0 z-50 flex items-center justify-between border-b border-[var(--border)] bg-[var(--card)]/80 px-6 py-3.5 backdrop-blur-md shadow-sm">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="flex size-8 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--primary)] to-[var(--ring)] text-[var(--primary-foreground)] shadow-md group-hover:scale-105 transition-transform">
            <Sparkles className="size-4" />
          </div>
          <span className="font-bold text-base tracking-tight group-hover:text-[var(--primary)] transition-colors">
            Clausis Reserve
          </span>
        </Link>

        <nav className="flex items-center gap-6 text-sm font-medium">
          <NavLink
            to="/events"
            className={({ isActive }) =>
              cn(
                "flex items-center gap-1.5 transition-colors hover:text-[var(--primary)]",
                isActive ? "text-[var(--primary)] font-semibold" : "text-[var(--muted-foreground)]"
              )
            }
          >
            <Calendar className="size-4" />
            Events
          </NavLink>
          <NavLink
            to="/venues"
            className={({ isActive }) =>
              cn(
                "flex items-center gap-1.5 transition-colors hover:text-[var(--primary)]",
                isActive ? "text-[var(--primary)] font-semibold" : "text-[var(--muted-foreground)]"
              )
            }
          >
            <Building className="size-4" />
            Venues
          </NavLink>

          <div className="flex items-center gap-3 pl-2 border-l border-[var(--border)]">
            <ThemeToggle size="sm" />

            {isAuthenticated ? (
              <>
                {portalRoles && portalRoles.length > 0 && (
                  <Button asChild variant="outline" size="sm" className="rounded-xl gap-1.5 h-9 border-[var(--ring)]/40 hover:bg-[var(--ring)]/10 text-[var(--foreground)]">
                    <Link to="/portal">
                      <LayoutDashboard className="size-3.5 text-[var(--ring)]" />
                      <span>Portal</span>
                    </Link>
                  </Button>
                )}
                <Link
                  to="/profile"
                  className="flex items-center gap-2 rounded-xl bg-[var(--muted)]/80 px-3 py-1.5 text-xs font-semibold hover:bg-[var(--muted)] transition-all border border-[var(--border)]/50 shadow-sm"
                >
                  <div className="flex size-6 items-center justify-center rounded-full bg-[var(--primary)] text-[var(--primary-foreground)] text-[10px]">
                    {(user?.name?.[0] || user?.username?.[0] || "U").toUpperCase()}
                  </div>
                  <span className="max-w-[100px] truncate">{user?.name || user?.username || "Profile"}</span>
                </Link>
              </>
            ) : (
              <Button asChild size="sm" className="rounded-xl shadow-md h-9 px-4">
                <Link to="/login" className="flex items-center gap-1.5">
                  <LogIn className="size-4" />
                  <span>Log in</span>
                </Link>
              </Button>
            )}
          </div>
        </nav>
      </header>
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}
