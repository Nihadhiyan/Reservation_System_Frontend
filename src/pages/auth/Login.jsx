import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/feedback/Toast";
import { Lock, User, ArrowRight, ShieldCheck, Sparkles, AlertCircle, Eye, EyeOff } from "lucide-react";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [form, setForm] = useState({ username: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!form.username.trim() || !form.password.trim()) {
      setError("Please enter both username and password.");
      return;
    }

    setSubmitting(true);
    try {
      const { user, portalRoles } = await login(form);
      toast.success(`Welcome back, ${user?.name || user?.username || "Commander"}!`);
      
      // Automatic route redirection based on derived portal roles
      if (location.state?.from?.pathname) {
        navigate(location.state.from.pathname, { replace: true });
        return;
      }

      if (portalRoles.includes("VENDOR")) {
        navigate("/portal/vendor", { replace: true });
      } else if (portalRoles.includes("ORGANIZER")) {
        navigate("/portal/organizer", { replace: true });
      } else if (portalRoles.includes("OWNER")) {
        navigate("/portal/owner", { replace: true });
      } else if (portalRoles.includes("SUPER_ADMIN") || user?.role === "SUPER_ADMIN") {
        navigate("/portal/superadmin", { replace: true });
      } else if (portalRoles.length === 1) {
        navigate(`/portal/${portalRoles[0].toLowerCase()}`, { replace: true });
      } else if (portalRoles.length > 1) {
        navigate("/portal", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    } catch (err) {
      const msg = err.response?.data?.message || "Authentication failed. Check your credentials.";
      setError(msg);
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[var(--background)] bg-mesh-gradient p-6 text-[var(--foreground)]">
      {/* Subtle background ambient glow */}
      <div className="pointer-events-none absolute -top-40 -left-40 size-96 rounded-full bg-primary/5 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-40 -right-40 size-96 rounded-full bg-blue-500/5 blur-[120px]" />

      <div className="relative w-full max-w-md animate-in fade-in zoom-in-95 duration-300">
        {/* Decorative top badge */}
        <div className="mb-6 flex justify-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/80 px-3.5 py-1 text-xs font-medium text-muted-foreground shadow-sm backdrop-blur-md">
            <Sparkles className="size-3.5 text-primary" />
            <span>Enterprise Reservation Portal</span>
          </div>
        </div>

        {/* Floating Glass Card */}
        <div className="glass-card rounded-2xl p-8 transition-all duration-300">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary shadow-sm">
              <ShieldCheck className="size-6" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight">Welcome back</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Sign in to your Clausis Reserve account
            </p>
          </div>

          {error && (
            <div className="mb-6 flex items-start gap-3 rounded-xl border border-destructive/30 bg-destructive/10 p-3.5 text-xs text-destructive">
              <AlertCircle className="size-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Username or Email
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Enter your username or email"
                  required
                  value={form.username}
                  onChange={(e) => setForm((f) => ({ ...f, username: e.target.value }))}
                  className="glass-input h-11 w-full rounded-xl pl-10 pr-4 text-sm placeholder:text-muted-foreground/60"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-xs font-medium text-primary transition-colors hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••••••"
                  required
                  value={form.password}
                  onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                  className="glass-input h-11 w-full rounded-xl pl-10 pr-10 text-sm placeholder:text-muted-foreground/60"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none"
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={submitting}
              className="group relative h-11 w-full overflow-hidden rounded-xl bg-primary font-medium text-primary-foreground shadow-sm transition-all duration-200 hover:opacity-90 active:scale-[0.98]"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {submitting ? "Signing in..." : "Sign in"}
                {!submitting && <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />}
              </span>
            </Button>
          </form>

          <div className="mt-8 border-t border-border pt-6 text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link to="/register" className="font-semibold text-primary transition-colors hover:underline">
              Create an account
            </Link>
          </div>
        </div>

        {/* Footer info */}
        <p className="mt-6 text-center text-xs text-muted-foreground">
          Clausis Reserve • Enterprise Reservation Platform
        </p>
      </div>
    </div>
  );
}
