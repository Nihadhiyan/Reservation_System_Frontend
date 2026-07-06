import api, { unwrap } from "./api";

// CreateOrganizationRequest / UpdateOrganizationRequest (identical shape):
// { name, contactNumber, contactEmail, billingAddress, capabilities: Set<string> }
// capabilities enum values: OWNS_VENUES, ORGANIZES_EVENTS, OPERATES_STALLS
export const organizationService = {
  getMine: () => api.get("/organizations/me").then(unwrap),
  getAllPaged: (params) => api.get("/organizations", { params }).then(unwrap),
  getById: (id) => api.get(`/organizations/${id}`).then(unwrap),
  create: (payload) => api.post("/organizations", payload).then(unwrap),
  update: (id, payload) => api.put(`/organizations/${id}`, payload).then(unwrap),
  remove: (id) => api.delete(`/organizations/${id}`).then(unwrap),
};

export const ORGANIZATION_CAPABILITIES = ["OWNS_VENUES", "ORGANIZES_EVENTS", "OPERATES_STALLS"];
