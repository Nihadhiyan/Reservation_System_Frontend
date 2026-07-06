import { Outlet, NavLink } from "react-router-dom";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Bottom-nav shell for Security/Vendor-staff roles who mostly work on
 * phones/tablets at the venue floor (QR scanner, POS views).
 */
export function MobileLayout({ navItems = [] }) {
  return (
    <div className="flex min-h-screen flex-col bg-[var(--background)] text-[var(--foreground)]">
      <header className="sticky top-0 z-40 flex items-center justify-between border-b border-[var(--border)] bg-[var(--card)]/80 px-4 py-3 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <div className="flex size-7 items-center justify-center rounded-lg bg-gradient-to-br from-[var(--primary)] to-[var(--ring)] text-[var(--primary-foreground)]">
            <Sparkles className="size-3.5" />
          </div>
          <span className="font-bold text-sm">Clausis Mobile</span>
        </div>
        <ThemeToggle size="sm" />
      </header>
      <main className="flex-1 overflow-auto pb-16">
        <Outlet />
      </main>
      <nav className="fixed bottom-0 inset-x-0 flex border-t border-[var(--border)] bg-[var(--card)]">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              cn(
                "flex flex-1 flex-col items-center gap-0.5 py-2 text-xs text-[var(--muted-foreground)]",
                isActive && "text-[var(--foreground)] font-medium"
              )
            }
          >
            {item.icon && <item.icon className="size-5" />}
            {item.label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
