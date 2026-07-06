import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore, derivePortalRoles } from "@/store/authStore";
import { authService } from "@/services/authService";
import { organizationService } from "@/services/organizationService";

export function useAuth() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const accessToken = useAuthStore((s) => s.accessToken);
  const portalRoles = useAuthStore((s) => s.portalRoles);
  const setSession = useAuthStore((s) => s.setSession);
  const setPortalRoles = useAuthStore((s) => s.setPortalRoles);
  const logoutStore = useAuthStore((s) => s.logout);
  const hasRole = useAuthStore((s) => s.hasRole);

  const login = useCallback(
    async (credentials) => {
      const data = await authService.login(credentials);
      setSession({
        user: data.user,
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
      });
      // Portal access (Owner/Organizer/Vendor) is derived from organization
      // capabilities, not the user's SystemRole - fetch it once right after
      // login so ProtectedRoute/DashboardGateway have it immediately.
      let derivedRoles = [];
      try {
        const organizations = await organizationService.getMine();
        derivedRoles = derivePortalRoles(data.user, organizations);
        setPortalRoles(derivedRoles);
      } catch {
        derivedRoles = derivePortalRoles(data.user, []);
        setPortalRoles(derivedRoles);
      }
      return { user: data.user, portalRoles: derivedRoles };
    },
    [setSession, setPortalRoles]
  );

  const register = useCallback(
    async (payload) => {
      const data = await authService.register(payload);
      setSession({
        user: data.user,
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
      });
      let derivedRoles = [];
      try {
        const organizations = await organizationService.getMine();
        derivedRoles = derivePortalRoles(data.user, organizations);
        setPortalRoles(derivedRoles);
      } catch {
        derivedRoles = derivePortalRoles(data.user, []);
        setPortalRoles(derivedRoles);
      }
      return { user: data.user, portalRoles: derivedRoles };
    },
    [setSession, setPortalRoles]
  );

  const logout = useCallback(() => {
    logoutStore();
    navigate("/login");
  }, [logoutStore, navigate]);

  return {
    user,
    isAuthenticated: Boolean(accessToken),
    portalRoles,
    hasRole,
    login,
    register,
    logout,
  };
}
