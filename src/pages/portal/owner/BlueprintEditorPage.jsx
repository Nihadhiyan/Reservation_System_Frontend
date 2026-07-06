import { useEffect, useState } from "react";
import { venueService } from "@/services/venueService";
import { layoutService } from "@/services/layoutService";
import { useMapStore } from "@/store/mapStore";
import { FloorPlanCanvas } from "@/components/map/FloorPlanCanvas";
import { MapToolbar } from "@/components/map/MapToolbar";
import { useMapControls } from "@/hooks/useMapControls";
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
import { Plus, Grid3x3, Pencil, Trash2 } from "lucide-react";
import { toast } from "@/components/feedback/Toast";

const BUILDING_TYPES = ["INDOOR", "OUTDOOR", "HYBRID"];
const SPACE_CATEGORIES = ["INDOOR", "OUTDOOR"];
const HALL_TYPES = [
  "STANDARD",
  "PREMIUM",
  "FOOD_COURT",
  "CHILDREN",
  "VIP",
  "SPONSOR",
  "EXHIBITION",
  "GENERAL",
];

/**
 * Drills Venue -> Building -> Floor -> Hall via the shared mapStore hierarchy
 * selection, then renders the active Hall's stall grid for editing. Each level
 * supports create, edit, and delete, backed by the matching Create/Update/Delete
 * endpoints on the backend.
 */
export default function BlueprintEditorPage() {
  const activeVenue = useMapStore((s) => s.activeVenue);
  const activeBuilding = useMapStore((s) => s.activeBuilding);
  const activeFloor = useMapStore((s) => s.activeFloor);
  const activeHall = useMapStore((s) => s.activeHall);
  const setActiveBuilding = useMapStore((s) => s.setActiveBuilding);
  const setActiveFloor = useMapStore((s) => s.setActiveFloor);
  const setActiveHall = useMapStore((s) => s.setActiveHall);
  const selectedStall = useMapStore((s) => s.selectedStall);
  const selectStall = useMapStore((s) => s.selectStall);

  const [buildings, setBuildings] = useState([]);
  const [floors, setFloors] = useState([]);
  const [halls, setHalls] = useState([]);
  const [stalls, setStalls] = useState(null);
  // { type: "building"|"floor"|"hall"|"grid", mode: "create"|"edit", item? }
  const [dialog, setDialog] = useState(null);
  const { transformRef, zoomIn, zoomOut, resetView, centerView } = useMapControls();

  function loadBuildings() {
    if (activeVenue) venueService.getBuildings(activeVenue.id).then(setBuildings);
  }
  function loadFloors() {
    if (activeBuilding) venueService.getFloorsByBuilding(activeBuilding.id).then(setFloors);
  }
  function loadHalls() {
    if (activeFloor) venueService.getHallsByFloor(activeFloor.id).then(setHalls);
  }
  function loadStalls() {
    if (activeHall) venueService.getStallsByHall(activeHall.id).then(setStalls);
  }

  useEffect(loadBuildings, [activeVenue]);
  useEffect(loadFloors, [activeBuilding]);
  useEffect(loadHalls, [activeFloor]);
  useEffect(() => {
    setStalls(null);
    loadStalls();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeHall]);

  async function handleMoveStall(stall, newLayout) {
    const previousStalls = stalls;
    // Optimistic update so the drag feels immediate; rolled back on failure.
    setStalls((prev) =>
      prev.map((s) => (s.id === stall.id ? { ...s, layout: newLayout } : s))
    );
    try {
      await layoutService.updateStallCoordinates(stall.id, newLayout);
    } catch (err) {
      setStalls(previousStalls);
      toast.error(err.response?.data?.message ?? `Failed to move stall ${stall.name}.`);
    }
  }

  async function handleDeleteBuilding(building) {
    if (!window.confirm(`Deactivate building "${building.name}"?`)) return;
    try {
      await venueService.deleteBuilding(building.id);
      toast.success("Building deactivated.");
      if (activeBuilding?.id === building.id) setActiveBuilding(null);
      loadBuildings();
    } catch (err) {
      toast.error(err.response?.data?.message ?? "Failed to deactivate building.");
    }
  }

  async function handleDeleteFloor(floor) {
    if (!window.confirm(`Deactivate floor "${floor.levelName}"?`)) return;
    try {
      await venueService.deleteFloor(floor.id);
      toast.success("Floor deactivated.");
      if (activeFloor?.id === floor.id) setActiveFloor(null);
      loadFloors();
    } catch (err) {
      toast.error(err.response?.data?.message ?? "Failed to deactivate floor.");
    }
  }

  async function handleDeleteHall(hall) {
    if (!window.confirm(`Deactivate hall "${hall.name}"?`)) return;
    try {
      await venueService.deleteHall(hall.id);
      toast.success("Hall deactivated.");
      if (activeHall?.id === hall.id) setActiveHall(null);
      loadHalls();
    } catch (err) {
      toast.error(err.response?.data?.message ?? "Failed to deactivate hall.");
    }
  }

  if (!activeVenue) {
    return <p className="text-sm text-[var(--muted-foreground)]">Select a venue from "Venues" first.</p>;
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[260px_1fr]">
      <aside className="space-y-4">
        <Selector
          label="Building"
          items={buildings}
          onSelect={setActiveBuilding}
          active={activeBuilding}
          onCreate={() => setDialog({ type: "building", mode: "create" })}
          onEdit={(item) => setDialog({ type: "building", mode: "edit", item })}
          onDelete={handleDeleteBuilding}
        />
        <Selector
          label="Floor"
          items={floors}
          labelKey="levelName"
          onSelect={setActiveFloor}
          active={activeFloor}
          onCreate={activeBuilding ? () => setDialog({ type: "floor", mode: "create" }) : null}
          onEdit={(item) => setDialog({ type: "floor", mode: "edit", item })}
          onDelete={handleDeleteFloor}
        />
        <Selector
          label="Hall"
          items={halls}
          onSelect={setActiveHall}
          active={activeHall}
          onCreate={activeFloor ? () => setDialog({ type: "hall", mode: "create" }) : null}
          onEdit={(item) => setDialog({ type: "hall", mode: "edit", item })}
          onDelete={handleDeleteHall}
        />
        {activeHall && (
          <Button
            size="sm"
            variant="outline"
            className="w-full"
            onClick={() => setDialog({ type: "grid" })}
          >
            <Grid3x3 className="size-4" />
            Generate stall grid
          </Button>
        )}
      </aside>

      <section className="relative h-[600px] rounded-lg border border-[var(--border)] overflow-hidden">
        {!activeHall ? (
          <div className="flex h-full items-center justify-center text-sm text-[var(--muted-foreground)]">
            Select a Hall to edit its stall layout.
          </div>
        ) : stalls === null ? (
          <Loader label="Loading layout..." />
        ) : stalls.length === 0 ? (
          <div className="flex h-full items-center justify-center text-sm text-[var(--muted-foreground)]">
            This Hall has no stalls yet. Use "Generate stall grid" to add some.
          </div>
        ) : (
          <>
            <FloorPlanCanvas
              hallWidth={activeHall.layout?.width ?? 1000}
              hallHeight={activeHall.layout?.height ?? 700}
              stalls={stalls}
              selectedStallId={selectedStall?.id}
              onSelectStall={selectStall}
              transformRef={transformRef}
              editable
              onMoveStall={handleMoveStall}
            />
            <MapToolbar onZoomIn={zoomIn} onZoomOut={zoomOut} onReset={resetView} onCenter={centerView} />
          </>
        )}
      </section>

      {dialog?.type === "building" && (
        <BuildingFormDialog
          venueId={activeVenue.id}
          initial={dialog.mode === "edit" ? dialog.item : null}
          onClose={() => setDialog(null)}
          onSaved={() => {
            loadBuildings();
            setDialog(null);
          }}
        />
      )}
      {dialog?.type === "floor" && (
        <FloorFormDialog
          buildingId={activeBuilding.id}
          initial={dialog.mode === "edit" ? dialog.item : null}
          onClose={() => setDialog(null)}
          onSaved={() => {
            loadFloors();
            setDialog(null);
          }}
        />
      )}
      {dialog?.type === "hall" && (
        <HallFormDialog
          floorId={activeFloor.id}
          initial={dialog.mode === "edit" ? dialog.item : null}
          onClose={() => setDialog(null)}
          onSaved={() => {
            loadHalls();
            setDialog(null);
          }}
        />
      )}
      {dialog?.type === "grid" && (
        <GenerateGridDialog
          hallId={activeHall.id}
          onClose={() => setDialog(null)}
          onGenerated={() => {
            loadStalls();
            setDialog(null);
          }}
        />
      )}
    </div>
  );
}

function Selector({ label, items, labelKey = "name", onSelect, active, onCreate, onEdit, onDelete }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <p className="text-xs font-medium text-[var(--muted-foreground)]">{label}</p>
        {onCreate && (
          <button onClick={onCreate} className="text-[var(--muted-foreground)] hover:text-[var(--foreground)]">
            <Plus className="size-3.5" />
          </button>
        )}
      </div>
      <div className="space-y-1">
        {items.map((item) => (
          <div
            key={item.id}
            className={
              "group flex items-center rounded-md hover:bg-[var(--accent)] " +
              (active?.id === item.id ? "bg-[var(--accent)]" : "")
            }
          >
            <button
              onClick={() => onSelect(item)}
              className={
                "flex-1 text-left px-2 py-1.5 text-sm truncate " +
                (active?.id === item.id ? "font-medium" : "")
              }
            >
              {item[labelKey]}
            </button>
            <button
              onClick={() => onEdit(item)}
              className="opacity-0 group-hover:opacity-100 px-1 text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
              aria-label={`Edit ${item[labelKey]}`}
            >
              <Pencil className="size-3.5" />
            </button>
            <button
              onClick={() => onDelete(item)}
              className="opacity-0 group-hover:opacity-100 px-1 pr-2 text-[var(--muted-foreground)] hover:text-[var(--destructive)]"
              aria-label={`Deactivate ${item[labelKey]}`}
            >
              <Trash2 className="size-3.5" />
            </button>
          </div>
        ))}
        {items.length === 0 && (
          <p className="text-xs text-[var(--muted-foreground)]">None yet.</p>
        )}
      </div>
    </div>
  );
}

function DialogShell({ title, onClose, onSubmit, submitting, submitLabel = "Save", children }) {
  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-3">
          {children}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? "Saving..." : submitLabel}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label className="text-xs font-medium text-[var(--muted-foreground)] mb-1 block">{label}</label>
      {children}
    </div>
  );
}

function Select({ value, onChange, options, required = true }) {
  return (
    <select
      required={required}
      className="w-full h-9 rounded-md border border-[var(--input)] bg-[var(--background)] px-3 text-sm"
      value={value}
      onChange={onChange}
    >
      <option value="">Select...</option>
      {options.map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>
  );
}

function BuildingFormDialog({ venueId, initial, onClose, onSaved }) {
  const isEdit = Boolean(initial);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: initial?.name ?? "",
    type: initial?.type ?? "",
    squareFootage: initial?.squareFootage ?? "",
    width: initial?.layoutPosition?.width ?? "",
    height: initial?.layoutPosition?.height ?? "",
    active: initial?.active ?? true,
  });

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    const layout = { xCoord: 0, yCoord: 0, width: Number(form.width), height: Number(form.height) };
    try {
      if (isEdit) {
        await venueService.updateBuilding(initial.id, {
          venueId,
          name: form.name,
          type: form.type,
          squareFootage: Number(form.squareFootage),
          layoutPosition: layout,
          active: form.active,
        });
        toast.success("Building updated.");
      } else {
        await venueService.createBuilding({
          venueId,
          name: form.name,
          type: form.type,
          squareFootage: Number(form.squareFootage),
          layout,
        });
        toast.success("Building created.");
      }
      onSaved();
    } catch (err) {
      toast.error(err.response?.data?.message ?? "Failed to save building.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <DialogShell
      title={isEdit ? "Edit Building" : "New Building"}
      onClose={onClose}
      onSubmit={handleSubmit}
      submitting={submitting}
      submitLabel={isEdit ? "Save changes" : "Create"}
    >
      <Field label="Name">
        <Input required value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
      </Field>
      <Field label="Type">
        <Select
          value={form.type}
          onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
          options={BUILDING_TYPES}
        />
      </Field>
      <Field label="Square footage">
        <Input
          type="number"
          min="0"
          required
          value={form.squareFootage}
          onChange={(e) => setForm((f) => ({ ...f, squareFootage: e.target.value }))}
        />
      </Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Layout width">
          <Input
            type="number"
            min="1"
            required
            value={form.width}
            onChange={(e) => setForm((f) => ({ ...f, width: e.target.value }))}
          />
        </Field>
        <Field label="Layout height">
          <Input
            type="number"
            min="1"
            required
            value={form.height}
            onChange={(e) => setForm((f) => ({ ...f, height: e.target.value }))}
          />
        </Field>
      </div>
      {isEdit && (
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.active}
            onChange={(e) => setForm((f) => ({ ...f, active: e.target.checked }))}
          />
          Active
        </label>
      )}
    </DialogShell>
  );
}

function FloorFormDialog({ buildingId, initial, onClose, onSaved }) {
  const isEdit = Boolean(initial);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    levelName: initial?.levelName ?? "",
    levelNumber: initial?.levelNumber ?? "",
  });

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    const payload = {
      buildingId,
      levelName: form.levelName,
      levelNumber: Number(form.levelNumber),
    };
    try {
      if (isEdit) {
        await venueService.updateFloor(initial.id, payload);
        toast.success("Floor updated.");
      } else {
        await venueService.createFloor(payload);
        toast.success("Floor created.");
      }
      onSaved();
    } catch (err) {
      toast.error(err.response?.data?.message ?? "Failed to save floor.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <DialogShell
      title={isEdit ? "Edit Floor" : "New Floor"}
      onClose={onClose}
      onSubmit={handleSubmit}
      submitting={submitting}
      submitLabel={isEdit ? "Save changes" : "Create"}
    >
      <Field label="Level name">
        <Input
          required
          value={form.levelName}
          onChange={(e) => setForm((f) => ({ ...f, levelName: e.target.value }))}
          placeholder="Ground Floor"
        />
      </Field>
      <Field label="Level number">
        <Input
          type="number"
          required
          value={form.levelNumber}
          onChange={(e) => setForm((f) => ({ ...f, levelNumber: e.target.value }))}
        />
      </Field>
    </DialogShell>
  );
}

function HallFormDialog({ floorId, initial, onClose, onSaved }) {
  const isEdit = Boolean(initial);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: initial?.name ?? "",
    spaceCategory: initial?.spaceCategory ?? "",
    hallType: initial?.hallType ?? "",
    squareFootage: initial?.squareFootage ?? "",
    maxStalls: initial?.maxStalls ?? "",
    width: initial?.layout?.width ?? "",
    height: initial?.layout?.height ?? "",
    blueprintImageUrl: initial?.blueprintImageUrl ?? "",
    wifiAvailable: initial?.wifiAvailable ?? false,
    airConditioned: initial?.airConditioned ?? false,
    active: initial?.active ?? true,
  });

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    const layout = { xCoord: 0, yCoord: 0, width: Number(form.width), height: Number(form.height) };
    const base = {
      floorId,
      name: form.name,
      spaceCategory: form.spaceCategory,
      hallType: form.hallType,
      squareFootage: Number(form.squareFootage),
      maxStalls: Number(form.maxStalls),
      blueprintImageUrl: form.blueprintImageUrl || "https://placehold.co/600x400",
      wifiAvailable: form.wifiAvailable,
      airConditioned: form.airConditioned,
      layout,
    };
    try {
      if (isEdit) {
        await venueService.updateHall(initial.id, { ...base, active: form.active });
        toast.success("Hall updated.");
      } else {
        await venueService.createHall(base);
        toast.success("Hall created.");
      }
      onSaved();
    } catch (err) {
      toast.error(err.response?.data?.message ?? "Failed to save hall.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <DialogShell
      title={isEdit ? "Edit Hall" : "New Hall"}
      onClose={onClose}
      onSubmit={handleSubmit}
      submitting={submitting}
      submitLabel={isEdit ? "Save changes" : "Create"}
    >
      <Field label="Name">
        <Input required value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
      </Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Space category">
          <Select
            value={form.spaceCategory}
            onChange={(e) => setForm((f) => ({ ...f, spaceCategory: e.target.value }))}
            options={SPACE_CATEGORIES}
          />
        </Field>
        <Field label="Hall type">
          <Select
            value={form.hallType}
            onChange={(e) => setForm((f) => ({ ...f, hallType: e.target.value }))}
            options={HALL_TYPES}
          />
        </Field>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Square footage">
          <Input
            type="number"
            min="0"
            required
            value={form.squareFootage}
            onChange={(e) => setForm((f) => ({ ...f, squareFootage: e.target.value }))}
          />
        </Field>
        <Field label="Max stalls">
          <Input
            type="number"
            min="1"
            required
            value={form.maxStalls}
            onChange={(e) => setForm((f) => ({ ...f, maxStalls: e.target.value }))}
          />
        </Field>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Layout width">
          <Input
            type="number"
            min="1"
            required
            value={form.width}
            onChange={(e) => setForm((f) => ({ ...f, width: e.target.value }))}
          />
        </Field>
        <Field label="Layout height">
          <Input
            type="number"
            min="1"
            required
            value={form.height}
            onChange={(e) => setForm((f) => ({ ...f, height: e.target.value }))}
          />
        </Field>
      </div>
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={form.wifiAvailable}
          onChange={(e) => setForm((f) => ({ ...f, wifiAvailable: e.target.checked }))}
        />
        Wifi available
      </label>
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={form.airConditioned}
          onChange={(e) => setForm((f) => ({ ...f, airConditioned: e.target.checked }))}
        />
        Air conditioned
      </label>
      {isEdit && (
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.active}
            onChange={(e) => setForm((f) => ({ ...f, active: e.target.checked }))}
          />
          Active
        </label>
      )}
    </DialogShell>
  );
}

function GenerateGridDialog({ hallId, onClose, onGenerated }) {
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    rows: "",
    columns: "",
    stallWidth: "",
    stallLength: "",
    aisleWidth: "0",
    startX: "0",
    startY: "0",
  });

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await venueService.generateStallGrid(hallId, {
        rows: Number(form.rows),
        columns: Number(form.columns),
        stallWidth: Number(form.stallWidth),
        stallLength: Number(form.stallLength),
        aisleWidth: Number(form.aisleWidth),
        startX: Number(form.startX),
        startY: Number(form.startY),
      });
      toast.success("Stall grid generated.");
      onGenerated();
    } catch (err) {
      toast.error(err.response?.data?.message ?? "Failed to generate stall grid.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <DialogShell
      title="Generate stall grid"
      onClose={onClose}
      onSubmit={handleSubmit}
      submitting={submitting}
    >
      <div className="grid grid-cols-2 gap-3">
        <Field label="Rows">
          <Input
            type="number"
            min="1"
            required
            value={form.rows}
            onChange={(e) => setForm((f) => ({ ...f, rows: e.target.value }))}
          />
        </Field>
        <Field label="Columns">
          <Input
            type="number"
            min="1"
            required
            value={form.columns}
            onChange={(e) => setForm((f) => ({ ...f, columns: e.target.value }))}
          />
        </Field>
        <Field label="Stall width">
          <Input
            type="number"
            min="1"
            required
            value={form.stallWidth}
            onChange={(e) => setForm((f) => ({ ...f, stallWidth: e.target.value }))}
          />
        </Field>
        <Field label="Stall length">
          <Input
            type="number"
            min="1"
            required
            value={form.stallLength}
            onChange={(e) => setForm((f) => ({ ...f, stallLength: e.target.value }))}
          />
        </Field>
        <Field label="Aisle width">
          <Input
            type="number"
            min="0"
            required
            value={form.aisleWidth}
            onChange={(e) => setForm((f) => ({ ...f, aisleWidth: e.target.value }))}
          />
        </Field>
        <Field label="Start X">
          <Input
            type="number"
            min="0"
            required
            value={form.startX}
            onChange={(e) => setForm((f) => ({ ...f, startX: e.target.value }))}
          />
        </Field>
        <Field label="Start Y">
          <Input
            type="number"
            min="0"
            required
            value={form.startY}
            onChange={(e) => setForm((f) => ({ ...f, startY: e.target.value }))}
          />
        </Field>
      </div>
    </DialogShell>
  );
}
