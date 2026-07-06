import api, { unwrap } from "./api";

// Response shapes (see backend dto/venue, dto/building, dto/floor, dto/hall, dto/stall):
// VenueResponse, VenueMapResponse, BuildingResponse, FloorResponse, HallResponse,
// HallLayoutResponse ({..., markers, stalls}), StallResponse, LayoutMarkerDto.
export const venueService = {
  // GET /venues is Pageable -> Page<VenueResponse>; callers that want a flat list
  // should read `.content` off the result.
  getAllPaged: (params) => api.get("/venues", { params }).then(unwrap),
  getById: (id) => api.get(`/venues/${id}`).then(unwrap),
  getMap: (id) => api.get(`/venues/${id}/map`).then(unwrap),
  getBuildings: (venueId) => api.get(`/venues/${venueId}/buildings`).then(unwrap),
  getMarkers: (venueId) => api.get(`/venues/${venueId}/markers`).then(unwrap),
  create: (payload) => api.post("/venues", payload).then(unwrap),
  update: (id, payload) => api.put(`/venues/${id}`, payload).then(unwrap),
  remove: (id) => api.delete(`/venues/${id}`).then(unwrap),

  getFloorsByBuilding: (buildingId) =>
    api.get(`/buildings/${buildingId}/floors`).then(unwrap),
  getHallsByFloor: (floorId) => api.get(`/floors/${floorId}/halls`).then(unwrap),
  getStallsByHall: (hallId) => api.get(`/halls/${hallId}/stalls`).then(unwrap),
  // HallLayoutResponse: includes both stalls AND layout markers for the Hall.
  getHallLayout: (hallId) => api.get(`/halls/${hallId}/layout`).then(unwrap),

  // CreateBuildingRequest: { venueId, name, layout: LayoutPositionDto, squareFootage,
  // type: "INDOOR"|"OUTDOOR"|"HYBRID" (plain string) }
  // UpdateBuildingRequest: same fields but the layout key is `layoutPosition`
  // (not `layout`) and it additionally requires `active`.
  createBuilding: (payload) => api.post("/buildings", payload).then(unwrap),
  updateBuilding: (id, payload) => api.put(`/buildings/${id}`, payload).then(unwrap),
  deleteBuilding: (id) => api.delete(`/buildings/${id}`).then(unwrap),

  // CreateFloorRequest / UpdateFloorRequest: { buildingId, levelName, levelNumber } (identical shape)
  createFloor: (payload) => api.post("/floors", payload).then(unwrap),
  updateFloor: (id, payload) => api.put(`/floors/${id}`, payload).then(unwrap),
  deleteFloor: (id) => api.delete(`/floors/${id}`).then(unwrap),

  // CreateHallRequest: { floorId, name, spaceCategory: "INDOOR"|"OUTDOOR",
  // hallType, layout: LayoutPositionDto, blueprintImageUrl, squareFootage,
  // maxStalls, wifiAvailable, airConditioned }
  // UpdateHallRequest: same fields plus `active`; floorId must always be resent.
  createHall: (payload) => api.post("/halls", payload).then(unwrap),
  updateHall: (id, payload) => api.put(`/halls/${id}`, payload).then(unwrap),
  deleteHall: (id) => api.delete(`/halls/${id}`).then(unwrap),

  // GenerateStallGridRequest: { rows, columns, stallWidth, stallLength, aisleWidth, startX, startY }
  generateStallGrid: (hallId, payload) =>
    api.post(`/halls/${hallId}/generate`, payload).then(unwrap),
};
