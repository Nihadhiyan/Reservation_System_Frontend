import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { venueService } from "@/services/venueService";
import { organizationService } from "@/services/organizationService";
import { Loader } from "@/components/feedback/Loader";
import { useMapStore } from "@/store/mapStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Plus, Building2, MapPin, Maximize, Map, ArrowRight, Car, Utensils, Globe, Sparkles } from "lucide-react";
import { toast } from "@/components/feedback/Toast";
import { formatNumber } from "@/utils/formatters";

export default function VenuesPage() {
  const [venues, setVenues] = useState(null);
  const [organizations, setOrganizations] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const setActiveVenue = useMapStore((s) => s.setActiveVenue);

  function loadVenues() {
    venueService.getAllPaged({ size: 100 }).then((page) => setVenues(page.content));
  }

  useEffect(() => {
    loadVenues();
    organizationService
      .getMine()
      .then(setOrganizations)
      .catch(() => setOrganizations([]));
  }, []);

  if (!venues) return <Loader label="Loading executive venues..." />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border)] pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Venue Portfolio</h1>
          <p className="text-sm text-[var(--muted-foreground)]">
            Manage exhibition halls, floor footage, and architectural blueprints.
          </p>
        </div>
        <Button size="sm" onClick={() => setDialogOpen(true)} className="rounded-xl shadow-md h-10 px-4 gap-2 bg-gradient-to-r from-[var(--primary)] to-[var(--ring)] text-[var(--primary-foreground)]">
          <Plus className="size-4" />
          <span>New Venue</span>
        </Button>
      </div>

      {venues.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[var(--border)] p-16 text-center space-y-3 bg-[var(--card)]/40">
          <Building2 className="size-12 mx-auto text-[var(--muted-foreground)] opacity-40" />
          <p className="text-base font-medium text-[var(--foreground)]">No venues in your portfolio</p>
          <p className="text-xs text-[var(--muted-foreground)] max-w-sm mx-auto">
            Create your first exhibition venue or convention center to begin mapping floor plans and reserving stalls.
          </p>
          <div className="pt-2">
            <Button onClick={() => setDialogOpen(true)} className="rounded-xl shadow-md">
              <Plus className="size-4 mr-1.5" />
              Add First Venue
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {venues.map((venue) => (
            <div key={venue.id} className="group rounded-2xl border border-[var(--border)] bg-[var(--card)]/80 backdrop-blur-md overflow-hidden shadow-sm hover:shadow-lg transition-all flex flex-col justify-between">
              <div className="p-6 space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-[var(--ring)]">
                      <MapPin className="size-3" />
                      {venue.city || "Global"}, {venue.country || ""}
                    </span>
                    <h3 className="font-bold text-lg group-hover:text-[var(--primary)] transition-colors leading-tight">
                      {venue.name}
                    </h3>
                  </div>
                  <div className="flex size-10 items-center justify-center rounded-xl bg-[var(--primary)]/10 text-[var(--primary)] shrink-0">
                    <Building2 className="size-5" />
                  </div>
                </div>

                <p className="text-xs text-[var(--muted-foreground)] line-clamp-2 leading-relaxed">
                  {venue.description || "No description provided."}
                </p>

                <div className="flex flex-wrap gap-2 pt-1">
                  {venue.parkingAvailable && (
                    <span className="inline-flex items-center gap-1 rounded-md bg-[var(--muted)] px-2 py-1 text-[10px] font-semibold text-[var(--muted-foreground)] border border-[var(--border)]">
                      <Car className="size-3 text-blue-500" /> Parking
                    </span>
                  )}
                  {venue.foodCourtAvailable && (
                    <span className="inline-flex items-center gap-1 rounded-md bg-[var(--muted)] px-2 py-1 text-[10px] font-semibold text-[var(--muted-foreground)] border border-[var(--border)]">
                      <Utensils className="size-3 text-amber-500" /> Food Court
                    </span>
                  )}
                  <span className="inline-flex items-center gap-1 rounded-md bg-[var(--muted)] px-2 py-1 text-[10px] font-semibold text-[var(--muted-foreground)] border border-[var(--border)]">
                    <Maximize className="size-3 text-[var(--ring)]" /> {formatNumber(venue.totalSquareFootage || 0)} sq ft
                  </span>
                </div>
              </div>

              <div className="px-6 py-3.5 bg-[var(--muted)]/30 border-t border-[var(--border)] flex items-center justify-between">
                <Link
                  to="/portal/owner/blueprint"
                  onClick={() => setActiveVenue(venue)}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--primary)] hover:underline"
                >
                  <Map className="size-3.5" />
                  <span>Configure Blueprint</span>
                </Link>

                <Link
                  to={`/venues/${venue.id}`}
                  className="text-xs font-semibold text-[var(--muted-foreground)] hover:text-[var(--foreground)] flex items-center gap-1 transition-colors"
                >
                  <span>Public View</span>
                  <ArrowRight className="size-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {dialogOpen && (
        <CreateVenueDialog
          organizations={organizations ?? []}
          onClose={() => setDialogOpen(false)}
          onCreated={() => {
            loadVenues();
            setDialogOpen(false);
          }}
        />
      )}
    </div>
  );
}

function CreateVenueDialog({ organizations, onClose, onCreated }) {
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: "",
    description: "",
    address: "",
    city: "",
    country: "",
    postalCode: "",
    contactNumber: "",
    email: "",
    website: "",
    latitude: "0",
    longitude: "0",
    googlePlaceId: "ChIJN1t_tDeuEmsRUsoyG83frY4",
    mapImageUrl: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80",
    blueprintImageUrl: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=80",
    totalSquareFootage: "25000",
    parkingAvailable: true,
    foodCourtAvailable: true,
    ownerOrganizationId: organizations[0]?.id ?? "",
  });

  function set(field) {
    return (e) =>
      setForm((f) => ({
        ...f,
        [field]: e.target.type === "checkbox" ? e.target.checked : e.target.value,
      }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await venueService.create({
        ...form,
        latitude: Number(form.latitude) || 0,
        longitude: Number(form.longitude) || 0,
        totalSquareFootage: Number(form.totalSquareFootage) || 10000,
      });
      toast.success("Venue successfully registered in your portfolio.");
      onCreated();
    } catch (err) {
      toast.error(err.response?.data?.message ?? "Failed to register venue.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[85vh] overflow-y-auto max-w-2xl rounded-2xl p-6">
        <DialogHeader className="border-b border-[var(--border)] pb-4 mb-4">
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <Building2 className="size-5 text-[var(--primary)]" />
            <span>Register New Exhibition Venue</span>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          {organizations.length === 0 && (
            <div className="rounded-xl bg-destructive/10 border border-destructive/30 p-3 text-xs text-destructive font-medium">
              You aren't a member of any organization yet, so you cannot register a commercial venue. Ask an org admin to add you.
            </div>
          )}

          {/* Section 1: General Info */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--ring)] flex items-center gap-1.5">
              <Sparkles className="size-3.5" />
              1. General Information
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <F label="Venue Name *">
                <Input required value={form.name} onChange={set("name")} placeholder="e.g., Grand Metro Convention Center" className="glass-input rounded-xl text-sm" />
              </F>
              <F label="Owner Organization *">
                <select
                  required
                  className="w-full h-10 rounded-xl border border-[var(--input)] bg-[var(--background)] px-3 text-sm focus:ring-2 focus:ring-[var(--ring)]"
                  value={form.ownerOrganizationId}
                  onChange={set("ownerOrganizationId")}
                >
                  <option value="">Select Organization...</option>
                  {organizations.map((org) => (
                    <option key={org.id} value={org.id}>
                      {org.name}
                    </option>
                  ))}
                </select>
              </F>
            </div>
            <F label="Description *">
              <Input required value={form.description} onChange={set("description")} placeholder="Brief overview of the exhibition halls and facilities..." className="glass-input rounded-xl text-sm" />
            </F>
          </div>

          {/* Section 2: Location */}
          <div className="space-y-3 pt-2 border-t border-[var(--border)]">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--primary)] flex items-center gap-1.5">
              <MapPin className="size-3.5" />
              2. Location & Contact
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <F label="Address *">
                <Input required value={form.address} onChange={set("address")} placeholder="100 Exhibition Blvd" className="glass-input rounded-xl text-sm" />
              </F>
              <F label="City *">
                <Input required value={form.city} onChange={set("city")} placeholder="New York" className="glass-input rounded-xl text-sm" />
              </F>
              <F label="Country *">
                <Input required value={form.country} onChange={set("country")} placeholder="USA" className="glass-input rounded-xl text-sm" />
              </F>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <F label="Contact Phone *">
                <Input required value={form.contactNumber} onChange={set("contactNumber")} placeholder="+1 (555) 123-4567" className="glass-input rounded-xl text-sm" />
              </F>
              <F label="Email Address *">
                <Input type="email" required value={form.email} onChange={set("email")} placeholder="events@grandmetro.com" className="glass-input rounded-xl text-sm" />
              </F>
            </div>
          </div>

          {/* Section 3: Dimensions & Assets */}
          <div className="space-y-3 pt-2 border-t border-[var(--border)]">
            <h4 className="text-xs font-bold uppercase tracking-wider text-blue-500 flex items-center gap-1.5">
              <Maximize className="size-3.5" />
              3. Dimensions & Assets
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <F label="Total Sq. Footage *">
                <Input type="number" min="0" required value={form.totalSquareFootage} onChange={set("totalSquareFootage")} className="glass-input rounded-xl text-sm" />
              </F>
              <F label="Map Image URL *">
                <Input required value={form.mapImageUrl} onChange={set("mapImageUrl")} className="glass-input rounded-xl text-sm" />
              </F>
              <F label="Blueprint Image URL *">
                <Input required value={form.blueprintImageUrl} onChange={set("blueprintImageUrl")} className="glass-input rounded-xl text-sm" />
              </F>
            </div>

            <div className="flex items-center gap-6 pt-2">
              <label className="flex items-center gap-2 text-sm font-medium cursor-pointer">
                <input type="checkbox" checked={form.parkingAvailable} onChange={set("parkingAvailable")} className="rounded size-4 accent-[var(--primary)]" />
                <span>On-site Parking Available</span>
              </label>
              <label className="flex items-center gap-2 text-sm font-medium cursor-pointer">
                <input type="checkbox" checked={form.foodCourtAvailable} onChange={set("foodCourtAvailable")} className="rounded size-4 accent-[var(--primary)]" />
                <span>Food Court Available</span>
              </label>
            </div>
          </div>

          <DialogFooter className="pt-4 border-t border-[var(--border)] flex items-center justify-end gap-3">
            <Button type="button" variant="outline" onClick={onClose} className="rounded-xl">
              Cancel
            </Button>
            <Button type="submit" disabled={submitting || organizations.length === 0} className="rounded-xl shadow-md bg-gradient-to-r from-[var(--primary)] to-[var(--ring)] text-[var(--primary-foreground)]">
              {submitting ? "Registering Venue..." : "Register Venue"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function F({ label, children }) {
  return (
    <div className="space-y-1">
      <label className="text-xs font-semibold text-[var(--muted-foreground)]">{label}</label>
      {children}
    </div>
  );
}
