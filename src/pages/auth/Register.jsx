import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/feedback/Toast";
import { 
  User, Mail, Lock, Phone, MapPin, Building2, Store, 
  Calendar, CheckCircle2, ArrowRight, Sparkles, AlertCircle, Eye, EyeOff 
} from "lucide-react";

const ROLE_OPTIONS = [
  {
    id: "PUBLIC",
    title: "Public Customer",
    description: "Browse events, reserve exhibition stalls, and book tickets.",
    icon: User,
    isOrg: false,
    capabilities: [],
  },
  {
    id: "VENDOR",
    title: "Stall Vendor",
    description: "Register your commercial entity to reserve and operate exhibition stalls.",
    icon: Store,
    isOrg: true,
    capabilities: ["OPERATES_STALLS"],
  },
  {
    id: "ORGANIZER",
    title: "Event Organizer",
    description: "Host book fairs, trade shows, manage floor zoning and stall pricing.",
    icon: Calendar,
    isOrg: true,
    capabilities: ["ORGANIZES_EVENTS"],
  },
  {
    id: "OWNER",
    title: "Venue Owner",
    description: "List convention centers, manage floor layouts and architectural blueprints.",
    icon: Building2,
    isOrg: true,
    capabilities: ["OWNS_VENUES"],
  },
];

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  
  const [selectedRoleType, setSelectedRoleType] = useState("PUBLIC");
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    contactNumber: "",
    address: "",
    organizationName: "",
    organizationCapabilities: [],
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  function handleRoleSelect(roleId) {
    setSelectedRoleType(roleId);
    const roleConfig = ROLE_OPTIONS.find((r) => r.id === roleId);
    if (roleConfig) {
      setForm((f) => ({
        ...f,
        registerAsOrgAdmin: roleConfig.isOrg,
        organizationCapabilities: roleConfig.capabilities,
        organizationName: roleConfig.isOrg ? f.organizationName : "",
      }));
    }
  }

  function toggleCapability(cap) {
    setForm((f) => ({
      ...f,
      organizationCapabilities: f.organizationCapabilities.includes(cap)
        ? f.organizationCapabilities.filter((c) => c !== cap)
        : [...f.organizationCapabilities, cap],
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    // Validation
    if (!form.username || !form.email || !form.password || !form.contactNumber || !form.address) {
      setError("Please fill out all required personal information fields.");
      return;
    }
    if (form.password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (form.registerAsOrgAdmin && !form.organizationName.trim()) {
      setError("Organization name is required for commercial/business accounts.");
      return;
    }
    if (form.registerAsOrgAdmin && form.organizationCapabilities.length === 0) {
      setError("Please select at least one operational capability for your organization.");
      return;
    }

    setSubmitting(true);
    try {
      // Prepare payload matching Spring Boot DTO
      const payload = {
        username: form.username.trim(),
        email: form.email.trim(),
        password: form.password,
        contactNumber: form.contactNumber.trim(),
        address: form.address.trim(),
        registerAsOrgAdmin: form.registerAsOrgAdmin || false,
        organizationName: form.registerAsOrgAdmin ? form.organizationName.trim() : null,
        organizationCapabilities: form.registerAsOrgAdmin ? form.organizationCapabilities : [],
      };

      const { user, portalRoles } = await register(payload);
      toast.success(`Welcome to Clausis Reserve, ${user?.name || user?.username || "Commander"}!`);
      if (portalRoles && portalRoles.length > 0) {
        navigate("/portal", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    } catch (err) {
      const msg = err.response?.data?.message || "Registration failed. Please verify your details.";
      setError(msg);
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  }

  const isOrgSelected = selectedRoleType !== "PUBLIC";

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[var(--background)] bg-mesh-gradient p-6 py-12 text-[var(--foreground)]">
      {/* Glow effects */}
      <div className="pointer-events-none absolute -top-40 -right-40 size-96 rounded-full bg-primary/5 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-40 -left-40 size-96 rounded-full bg-blue-500/5 blur-[120px]" />

      <div className="relative w-full max-w-2xl animate-in fade-in zoom-in-95 duration-300">
        {/* Top badge */}
        <div className="mb-6 flex justify-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/80 px-3.5 py-1 text-xs font-medium text-muted-foreground shadow-sm backdrop-blur-md">
            <Sparkles className="size-3.5 text-primary" />
            <span>Account Registration</span>
          </div>
        </div>

        {/* Glass Card */}
        <div className="glass-card rounded-2xl p-8 transition-all duration-300">
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-bold tracking-tight">Create your account</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Select your role and enter your details to get started
            </p>
          </div>

          {error && (
            <div className="mb-6 flex items-start gap-3 rounded-xl border border-destructive/30 bg-destructive/10 p-3.5 text-xs text-destructive">
              <AlertCircle className="size-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Step 1: Role Selection */}
            <div className="space-y-3">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                1. Select your role
              </label>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {ROLE_OPTIONS.map((role) => {
                  const Icon = role.icon;
                  const isSelected = selectedRoleType === role.id;
                  return (
                    <div
                      key={role.id}
                      onClick={() => handleRoleSelect(role.id)}
                      className={`group relative flex cursor-pointer flex-col rounded-xl border p-4 transition-all duration-200 ${
                        isSelected
                          ? "border-primary bg-primary/5 shadow-sm"
                          : "border-border bg-card hover:border-muted-foreground/30"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className={`flex size-9 items-center justify-center rounded-lg ${
                          isSelected ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground group-hover:text-foreground"
                        }`}>
                          <Icon className="size-5" />
                        </div>
                        <CheckCircle2 className={`size-5 transition-opacity ${
                          isSelected ? "text-primary opacity-100" : "text-muted-foreground opacity-0 group-hover:opacity-40"
                        }`} />
                      </div>
                      <h3 className="text-sm font-bold">{role.title}</h3>
                      <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                        {role.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Organization Details (If Commercial / Business Role Selected) */}
            {isOrgSelected && (
              <div className="space-y-4 rounded-xl border border-border bg-card p-5 shadow-sm animate-in fade-in slide-in-from-top-3 duration-300">
                <div className="flex items-center gap-2 border-b border-border pb-3">
                  <Building2 className="size-4 text-primary" />
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground">
                    Organization Details
                  </h3>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">
                    Organization / Company Name <span className="text-destructive">*</span>
                  </label>
                  <Input
                    placeholder="e.g. Clausis Exhibitions Ltd."
                    required={isOrgSelected}
                    value={form.organizationName}
                    onChange={(e) => setForm((f) => ({ ...f, organizationName: e.target.value }))}
                    className="glass-input h-10 w-full rounded-lg px-3 text-sm"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-medium text-muted-foreground">
                    Capabilities (You can select multiple)
                  </label>
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                    {[
                      { id: "OPERATES_STALLS", label: "Stall Vendor", icon: Store },
                      { id: "ORGANIZES_EVENTS", label: "Event Organizer", icon: Calendar },
                      { id: "OWNS_VENUES", label: "Venue Owner", icon: Building2 },
                    ].map((cap) => {
                      const CapIcon = cap.icon;
                      const active = form.organizationCapabilities.includes(cap.id);
                      return (
                        <div
                          key={cap.id}
                          onClick={() => toggleCapability(cap.id)}
                          className={`flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-xs font-medium transition-all ${
                            active
                              ? "border-primary bg-primary/10 text-primary"
                              : "border-border bg-background text-muted-foreground hover:border-muted-foreground/40"
                          }`}
                        >
                          <CapIcon className={`size-3.5 shrink-0 ${active ? "text-primary" : "text-muted-foreground"}`} />
                          <span className="truncate">{cap.label}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Personal Credentials */}
            <div className="space-y-4 pt-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {isOrgSelected ? "3" : "2"}. Personal Information
              </label>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">
                    Username <span className="text-destructive">*</span>
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="johndoe"
                      required
                      value={form.username}
                      onChange={(e) => setForm((f) => ({ ...f, username: e.target.value }))}
                      className="glass-input h-10 w-full rounded-lg pl-9 pr-3 text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">
                    Email Address <span className="text-destructive">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      type="email"
                      placeholder="john@example.com"
                      required
                      value={form.email}
                      onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                      className="glass-input h-10 w-full rounded-lg pl-9 pr-3 text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">
                    Contact Number <span className="text-destructive">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="+1 (555) 000-0000"
                      required
                      value={form.contactNumber}
                      onChange={(e) => setForm((f) => ({ ...f, contactNumber: e.target.value }))}
                      className="glass-input h-10 w-full rounded-lg pl-9 pr-3 text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">
                    Physical Address <span className="text-destructive">*</span>
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="123 Tech Blvd, Suite 400"
                      required
                      value={form.address}
                      onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
                      className="glass-input h-10 w-full rounded-lg pl-9 pr-3 text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">
                    Password (Min. 8 chars) <span className="text-destructive">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••••••"
                      required
                      minLength={8}
                      value={form.password}
                      onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                      className="glass-input h-10 w-full rounded-lg pl-9 pr-9 text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none"
                    >
                      {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">
                    Confirm Password <span className="text-destructive">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="••••••••••••"
                      required
                      minLength={8}
                      value={form.confirmPassword}
                      onChange={(e) => setForm((f) => ({ ...f, confirmPassword: e.target.value }))}
                      className="glass-input h-10 w-full rounded-lg pl-9 pr-9 text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword((prev) => !prev)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none"
                    >
                      {showConfirmPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <Button
              type="submit"
              disabled={submitting}
              className="group relative mt-4 h-11 w-full overflow-hidden rounded-xl bg-primary font-medium text-primary-foreground shadow-sm transition-all duration-200 hover:opacity-90 active:scale-[0.98]"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {submitting ? "Creating account..." : "Create account"}
                {!submitting && <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />}
              </span>
            </Button>
          </form>

          <div className="mt-8 border-t border-border pt-6 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="font-semibold text-primary transition-colors hover:underline">
              Sign in
            </Link>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          Clausis Reserve • Enterprise Reservation Platform
        </p>
      </div>
    </div>
  );
}
