import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { userService } from "@/services/userService";
import { Loader } from "@/components/feedback/Loader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/feedback/Toast";
import { User, Mail, Phone, MapPin, Shield, Building, Calendar, ArrowRight, Save, LayoutDashboard, Sparkles } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export default function ProfilePage() {
  const { portalRoles } = useAuth();
  const [user, setUser] = useState(null);
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);

  function load() {
    userService.getMe().then((u) => {
      setUser(u);
      setForm({
        username: u.username || "",
        email: u.email || "",
        contactNumber: u.contactNumber ?? "",
        address: u.address ?? "",
      });
    });
  }

  useEffect(load, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      const updated = await userService.updateMe(form);
      setUser(updated);
      toast.success("Profile updated successfully.");
    } catch (err) {
      toast.error(err.response?.data?.message ?? "Failed to update profile.");
    } finally {
      setSaving(false);
    }
  }

  if (!user || !form) return <Loader label="Loading executive profile..." />;

  const initials = (user.name?.[0] || user.username?.[0] || "U").toUpperCase();

  return (
    <div className="mx-auto max-w-4xl px-6 py-10 space-y-8">
      {/* Profile Header Card */}
      <div className="relative overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)]/80 backdrop-blur-md p-6 md:p-8 shadow-lg">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 size-48 rounded-full bg-gradient-to-br from-[var(--primary)]/10 to-[var(--ring)]/10 blur-2xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-5">
            <div className="flex size-20 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--primary)] to-[var(--ring)] text-3xl font-extrabold text-[var(--primary-foreground)] shadow-xl shrink-0">
              {initials}
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight">{user.username}</h1>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--primary)]/10 border border-[var(--primary)]/30 px-3 py-1 text-xs font-semibold text-[var(--primary)]">
                  <Shield className="size-3.5" />
                  {user.role || "CUSTOMER"}
                </span>
              </div>
              <p className="text-sm text-[var(--muted-foreground)] flex items-center gap-1.5">
                <Mail className="size-3.5" />
                {user.email}
              </p>
            </div>
          </div>

          {portalRoles && portalRoles.length > 0 && (
            <Button asChild className="rounded-xl shadow-md bg-gradient-to-r from-[var(--primary)] to-[var(--ring)] text-[var(--primary-foreground)] hover:opacity-95 shrink-0">
              <Link to="/portal" className="flex items-center gap-2">
                <LayoutDashboard className="size-4" />
                <span>Launch Portal</span>
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          )}
        </div>

        {/* Organizations Section */}
        {user.organization && (
          <div className="mt-6 pt-6 border-t border-[var(--border)]/60 flex items-center gap-3">
            <Building className="size-4 text-[var(--ring)] shrink-0" />
            <span className="text-xs font-medium text-[var(--muted-foreground)]">Affiliated Organization:</span>
            <span className="rounded-lg bg-[var(--accent)] px-3 py-1 text-xs font-bold text-[var(--foreground)] border border-[var(--border)]">
              {user.organization.name}
            </span>
          </div>
        )}
      </div>

      {/* Grid Layout for Form and Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Form Column */}
        <div className="md:col-span-2 rounded-2xl border border-[var(--border)] bg-[var(--card)]/80 backdrop-blur-md p-6 md:p-8 shadow-sm space-y-6">
          <div className="flex items-center gap-2 border-b border-[var(--border)] pb-4">
            <User className="size-5 text-[var(--primary)]" />
            <h2 className="text-lg font-semibold">Account Information</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wider">
                  Username
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-[var(--muted-foreground)]" />
                  <Input
                    required
                    value={form.username}
                    onChange={(e) => setForm((f) => ({ ...f, username: e.target.value }))}
                    className="glass-input h-10 pl-10 rounded-xl text-sm"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wider">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-[var(--muted-foreground)]" />
                  <Input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                    className="glass-input h-10 pl-10 rounded-xl text-sm"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wider">
                  Contact Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-[var(--muted-foreground)]" />
                  <Input
                    required
                    value={form.contactNumber}
                    onChange={(e) => setForm((f) => ({ ...f, contactNumber: e.target.value }))}
                    placeholder="+1 (555) 000-0000"
                    className="glass-input h-10 pl-10 rounded-xl text-sm"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wider">
                  Physical Address
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-[var(--muted-foreground)]" />
                  <Input
                    required
                    value={form.address}
                    onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
                    placeholder="123 Executive Way, Suite 400"
                    className="glass-input h-10 pl-10 rounded-xl text-sm"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <Button type="submit" disabled={saving} className="rounded-xl shadow-md h-10 px-6 gap-2 bg-[var(--primary)] text-[var(--primary-foreground)] hover:opacity-90">
                <Save className="size-4" />
                <span>{saving ? "Saving Changes..." : "Save Changes"}</span>
              </Button>
            </div>
          </form>
        </div>

        {/* Quick Links Column */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)]/80 backdrop-blur-md p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--muted-foreground)]">
              Quick Shortcuts
            </h3>
            <div className="space-y-2.5">
              <Link
                to="/reservations"
                className="flex items-center justify-between rounded-xl border border-[var(--border)]/60 bg-[var(--muted)]/40 p-3.5 text-sm font-medium hover:bg-[var(--accent)] hover:border-[var(--ring)]/50 transition-all group"
              >
                <span className="flex items-center gap-2.5">
                  <Calendar className="size-4 text-[var(--primary)]" />
                  My Reservations
                </span>
                <ArrowRight className="size-4 text-[var(--muted-foreground)] group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                to="/events"
                className="flex items-center justify-between rounded-xl border border-[var(--border)]/60 bg-[var(--muted)]/40 p-3.5 text-sm font-medium hover:bg-[var(--accent)] hover:border-[var(--ring)]/50 transition-all group"
              >
                <span className="flex items-center gap-2.5">
                  <Sparkles className="size-4 text-[var(--ring)]" />
                  Browse Events
                </span>
                <ArrowRight className="size-4 text-[var(--muted-foreground)] group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          <div className="rounded-2xl border border-[var(--border)] bg-gradient-to-br from-[var(--primary)]/10 to-[var(--ring)]/10 p-6 shadow-sm space-y-2">
            <h4 className="text-sm font-bold text-[var(--foreground)]">Security & Privacy</h4>
            <p className="text-xs text-[var(--muted-foreground)] leading-relaxed">
              Your account is protected by industry-standard JWT encryption and role-based access checkpoints.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
