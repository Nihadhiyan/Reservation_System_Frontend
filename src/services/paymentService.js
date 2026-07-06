import api, { unwrap } from "./api";

export const paymentService = {
  initialize: (payload) => api.post("/payments/initialize", payload).then(unwrap),
  getStatus: (transactionId) => api.get(`/payments/${transactionId}/status`).then(unwrap),
};
