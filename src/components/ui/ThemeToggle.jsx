import React from "react";
import { Sun, Moon, Sparkles } from "lucide-react";
import { useTheme } from "@/store/themeStore";
import { Button } from "@/components/ui/button";

export function ThemeToggle({ className = "", size = "default" }) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <Button
      variant="outline"
      size={size === "sm" ? "sm" : "default"}
      onClick={toggleTheme}
      title={`Switch to ${isDark ? "Light" : "Dark"} Cyber Theme`}
      className={`relative overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--card)]/80 backdrop-blur-md px-3 py-2 text-xs font-bold transition-all duration-300 hover:border-[var(--ring)] hover:shadow-glow-yellow group ${className}`}
    >
      <div className="flex items-center gap-2">
        <div className="relative flex size-5 items-center justify-center">
          <Sun
            className={`absolute size-4 text-amber-500 transition-all duration-300 ${
              isDark ? "scale-0 rotate-90 opacity-0" : "scale-100 rotate-0 opacity-100"
            }`}
          />
          <Moon
            className={`absolute size-4 text-blue-400 transition-all duration-300 ${
              isDark ? "scale-100 rotate-0 opacity-100" : "scale-0 -rotate-90 opacity-0"
            }`}
          />
        </div>
        <span className="font-mono text-[11px] uppercase tracking-wider text-[var(--foreground)] group-hover:text-[var(--ring)] transition-colors">
          {isDark ? "Cyber Dark" : "Cyber Light"}
        </span>
        <Sparkles className="size-3 text-[var(--ring)] animate-pulse" />
      </div>
    </Button>
  );
}
