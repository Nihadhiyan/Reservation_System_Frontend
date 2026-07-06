import api, { unwrap } from "./api";

// Returns AuthResponse: { accessToken, refreshToken, tokenType, expiresIn, user }
export const authService = {
  login: (credentials) => api.post("/auth/login", credentials).then(unwrap),
  register: (payload) => api.post("/auth/register", payload).then(unwrap),
  logout: () => api.post("/auth/logout").then(unwrap),

  // email is a query param, not a JSON body
  forgotPassword: (email) =>
    api.post("/auth/forgot-password", null, { params: { email } }).then(unwrap),
  // ResetPasswordRequest: { resetToken, newPassword }
  resetPassword: (payload) => api.post("/auth/reset-password", payload).then(unwrap),
};
