import { create } from "zustand";

/**
 * Holds the currently selected node at each level of the spatial hierarchy
 * (Venue -> Building -> Floor -> Hall -> Stall) plus pan/zoom transform state
 * for the active SVG floor plan. Kept out of React context so drilling into
 * a stall doesn't re-render unrelated parts of the app (e.g. auth-gated nav).
 */
export const useMapStore = create((set) => ({
  activeVenue: null,
  activeBuilding: null,
  activeFloor: null,
  activeHall: null,
  selectedStall: null,

  transform: { scale: 1, positionX: 0, positionY: 0 },

  setActiveVenue: (venue) =>
    set({
      activeVenue: venue,
      activeBuilding: null,
      activeFloor: null,
      activeHall: null,
      selectedStall: null,
    }),

  setActiveBuilding: (building) =>
    set({ activeBuilding: building, activeFloor: null, activeHall: null, selectedStall: null }),

  setActiveFloor: (floor) =>
    set({ activeFloor: floor, activeHall: null, selectedStall: null }),

  setActiveHall: (hall) => set({ activeHall: hall, selectedStall: null }),

  selectStall: (stall) => set({ selectedStall: stall }),

  clearSelection: () => set({ selectedStall: null }),

  setTransform: (transform) => set({ transform }),

  resetHierarchy: () =>
    set({
      activeVenue: null,
      activeBuilding: null,
      activeFloor: null,
      activeHall: null,
      selectedStall: null,
    }),
}));
