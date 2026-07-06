import { Outlet, NavLink, Link } from "react-router-dom";
import { LogOut, User, LayoutGrid, Sparkles } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { cn } from "@/lib/utils";

/**
 * Sidebar shell for Admins/Owners/Organizers. `navItems` is supplied per-portal
 * (superadmin/owner/organizer) so this one layout serves all three roles.
 */
export function AdminLayout({ navItems = [], title = "Dashboard" }) {
  const { user, logout, portalRoles } = useAuth();

  return (
    <div className="flex min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <aside className="w-64 shrink-0 border-r border-[var(--border)] bg-[var(--card)]/80 backdrop-blur-md flex flex-col shadow-sm">
        <div className="px-5 py-5 border-b border-[var(--border)] flex flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-[var(--primary)] to-[var(--ring)] text-[var(--primary-foreground)] shadow-md">
              <Sparkles className="size-4" />
            </div>
            <div>
              <Link to="/" className="font-bold text-sm tracking-tight hover:opacity-80 transition-opacity">
                Clausis Reserve
              </Link>
              <span className="block text-[10px] font-semibold uppercase tracking-wider text-[var(--ring)]">
                {title} Portal
              </span>
            </div>
          </div>
          {user && (
            <div className="mt-2 rounded-lg bg-[var(--muted)]/60 px-3 py-2 border border-[var(--border)]/50">
              <p className="text-xs font-medium truncate">{user.name || user.username}</p>
              <p className="text-[11px] text-[var(--muted-foreground)] truncate">{user.email}</p>
            </div>
          )}
        </div>
        
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          <p className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
            Navigation
          </p>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to.split("/").length <= 3}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-gradient-to-r from-[var(--primary)]/90 to-[var(--primary)] text-[var(--primary-foreground)] shadow-sm"
                    : "text-[var(--muted-foreground)] hover:bg-[var(--accent)] hover:text-[var(--foreground)]"
                )
              }
            >
              {item.icon && <item.icon className="size-4 shrink-0" />}
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="p-3 border-t border-[var(--border)] space-y-2 bg-[var(--muted)]/20">
          <ThemeToggle className="w-full justify-center" />
          <NavLink
            to="/profile"
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-xl px-3.5 py-2 text-sm font-medium transition-all",
                isActive
                  ? "bg-[var(--accent)] text-[var(--foreground)] font-semibold"
                  : "text-[var(--muted-foreground)] hover:bg-[var(--accent)] hover:text-[var(--foreground)]"
              )
            }
          >
            <User className="size-4 shrink-0" />
            My Profile
          </NavLink>
          {portalRoles && portalRoles.length > 1 && (
            <Link
              to="/portal"
              className="flex items-center gap-3 rounded-xl px-3.5 py-2 text-sm font-medium text-[var(--muted-foreground)] hover:bg-[var(--accent)] hover:text-[var(--foreground)] transition-all"
            >
              <LayoutGrid className="size-4 shrink-0" />
              Switch Portal
            </Link>
          )}
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 rounded-xl px-3.5 py-2 text-sm font-medium text-destructive hover:bg-destructive/10 hover:text-destructive transition-all"
            onClick={logout}
          >
            <LogOut className="size-4 shrink-0" />
            Log out
          </Button>
        </div>
      </aside>
      <main className="flex-1 overflow-auto bg-mesh-gradient">
        <div className="mx-auto max-w-7xl p-6 md:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
