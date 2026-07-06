import api, { unwrap } from "./api";

// CreateReservationRequest: { eventId, stallIds[], reservationStartDateTime,
// expiresAt, genreId, organizationId }. ReservationResponse: { id, user, event,
// date, reservationStartDateTime, expiresAt, time, status, genreId,
// qrCodePayload, organizationId, organizationName, ... }.
export const reservationService = {
  getMine: () => api.get("/reservations/me").then(unwrap),
  getById: (id) => api.get(`/reservations/${id}`).then(unwrap),
  getDetails: (id) => api.get(`/reservations/${id}/details`).then(unwrap),
  create: (payload) => api.post("/reservations", payload).then(unwrap),
  cancel: (id) => api.post(`/reservations/${id}/cancel`).then(unwrap),
  // There is no dedicated QR check-in endpoint on the backend yet; the closest
  // real action is staff confirming a reservation. The QR payload encodes the
  // reservationId, which is all `confirm` needs.
  confirm: (reservationId) => api.post(`/reservations/${reservationId}/confirm`).then(unwrap),
};
