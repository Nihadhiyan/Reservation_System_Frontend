import { useEffect, useState } from "react";
import { organizationService, ORGANIZATION_CAPABILITIES } from "@/services/organizationService";
import { Loader } from "@/components/feedback/Loader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { toast } from "@/components/feedback/Toast";

export default function TenantsPage() {
  const [organizations, setOrganizations] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  function load() {
    organizationService.getAllPaged({ size: 50 }).then((page) => setOrganizations(page.content));
  }

  useEffect(load, []);

  async function handleDeactivate(org) {
    if (!window.confirm(`Deactivate organization "${org.name}"?`)) return;
    try {
      await organizationService.remove(org.id);
      toast.success("Organization deactivated.");
      load();
    } catch (err) {
      toast.error(err.response?.data?.message ?? "Failed to deactivate organization.");
    }
  }

  if (!organizations) return <Loader label="Loading organizations..." />;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-semibold">Tenants</h1>
        <Button size="sm" onClick={() => setDialogOpen(true)}>
          <Plus className="size-4" />
          New Organization
        </Button>
      </div>
      <div className="rounded-lg border border-[var(--border)] divide-y divide-[var(--border)]">
        {organizations.map((org) => (
          <div key={org.id} className="flex items-center justify-between px-4 py-3 text-sm">
            <div>
              <p className="font-medium">{org.name}</p>
              <p className="text-[var(--muted-foreground)]">
                {(org.capabilities ?? []).join(", ") || "No capabilities"}
              </p>
            </div>
            <button
              onClick={() => handleDeactivate(org)}
              className="text-[var(--destructive)] hover:underline"
            >
              Deactivate
            </button>
          </div>
        ))}
        {organizations.length === 0 && (
          <p className="px-4 py-3 text-sm text-[var(--muted-foreground)]">No organizations yet.</p>
        )}
      </div>

      {dialogOpen && (
        <CreateOrganizationDialog
          onClose={() => setDialogOpen(false)}
          onCreated={() => {
            load();
            setDialogOpen(false);
          }}
        />
      )}
    </div>
  );
}

function CreateOrganizationDialog({ onClose, onCreated }) {
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: "",
    contactNumber: "",
    contactEmail: "",
    billingAddress: "",
    capabilities: [],
  });

  function toggleCapability(cap) {
    setForm((f) => ({
      ...f,
      capabilities: f.capabilities.includes(cap)
        ? f.capabilities.filter((c) => c !== cap)
        : [...f.capabilities, cap],
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await organizationService.create(form);
      toast.success("Organization created.");
      onCreated();
    } catch (err) {
      toast.error(err.response?.data?.message ?? "Failed to create organization.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Organization</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="text-xs font-medium text-[var(--muted-foreground)] mb-1 block">
              Name
            </label>
            <Input
              required
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            />
          </div>
          <div>
            <label className="text-xs font-medium text-[var(--muted-foreground)] mb-1 block">
              Contact number
            </label>
            <Input
              required
              value={form.contactNumber}
              onChange={(e) => setForm((f) => ({ ...f, contactNumber: e.target.value }))}
              placeholder="+15551234567"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-[var(--muted-foreground)] mb-1 block">
              Contact email
            </label>
            <Input
              type="email"
              required
              value={form.contactEmail}
              onChange={(e) => setForm((f) => ({ ...f, contactEmail: e.target.value }))}
            />
          </div>
          <div>
            <label className="text-xs font-medium text-[var(--muted-foreground)] mb-1 block">
              Billing address
            </label>
            <Input
              required
              value={form.billingAddress}
              onChange={(e) => setForm((f) => ({ ...f, billingAddress: e.target.value }))}
            />
          </div>
          <div>
            <p className="text-xs font-medium text-[var(--muted-foreground)] mb-1">Capabilities</p>
            <div className="space-y-1">
              {ORGANIZATION_CAPABILITIES.map((cap) => (
                <label key={cap} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={form.capabilities.includes(cap)}
                    onChange={() => toggleCapability(cap)}
                  />
                  {cap}
                </label>
              ))}
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={submitting || form.capabilities.length === 0}>
              {submitting ? "Creating..." : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
