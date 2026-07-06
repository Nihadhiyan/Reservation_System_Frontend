import api, { unwrap } from "./api";

// EventResponse has no nested venue/address - only `venueId`; fetch the Venue
// separately via venueService if you need address/geo. EventStallResponse is
// flat: { id, eventId, stallId, stallName, hallName, basePrice,
// manualOverridePrice, status, layout }, there is no nested `stall` object.
export const eventService = {
  getUpcoming: () => api.get("/events/upcoming").then(unwrap),
  // GET /events is Pageable -> Page<EventResponse>; read `.content` for a flat list.
  getAllPaged: (params) => api.get("/events", { params }).then(unwrap),
  getById: (id) => api.get(`/events/${id}`).then(unwrap),
  create: (payload) => api.post("/events", payload).then(unwrap),
  update: (id, payload) => api.put(`/events/${id}`, payload).then(unwrap),
  remove: (id) => api.delete(`/events/${id}`).then(unwrap),
  setStatus: (eventId, status) =>
    api.patch(`/events/${eventId}/status`, null, { params: { status } }).then(unwrap),

  getStalls: (eventId) => api.get(`/events/${eventId}/stalls`).then(unwrap),
  assignStall: (payload) => api.post("/event-stalls", payload).then(unwrap),
  updateEventStall: (id, payload) => api.put(`/event-stalls/${id}`, payload).then(unwrap),
  removeEventStall: (id) => api.delete(`/event-stalls/${id}`).then(unwrap),
};
