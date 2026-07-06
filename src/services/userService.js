import api, { unwrap } from "./api";

// UserResponse: { id, username, email, role, contactNumber, address, organization }
export const userService = {
  getMe: () => api.get("/users/me").then(unwrap),
  updateMe: (payload) => api.put("/users/me", payload).then(unwrap),
  deleteMe: () => api.delete("/users/me").then(unwrap),
  getMyReservations: () => api.get("/users/me/reservations").then(unwrap),

  // Admin-only (role: ADMIN)
  getAllPaged: (params) => api.get("/users", { params }).then(unwrap),
  getById: (id) => api.get(`/users/${id}`).then(unwrap),
  updateRole: (id, role) => api.patch(`/users/${id}/role`, { role }).then(unwrap),
  remove: (id) => api.delete(`/users/${id}`).then(unwrap),
  getReservations: (id) => api.get(`/users/${id}/reservations`).then(unwrap),
};
