import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";

/**
 * Gate for role-restricted route trees. Pass `roles` to restrict to specific
 * ROLES values; omit it to only require authentication. Checks against
 * `portalRoles`, the client-derived set (SystemRole + organization
 * capabilities) computed at login - see authStore.derivePortalRoles.
 */
export function ProtectedRoute({ roles }) {
  const location = useLocation();
  const accessToken = useAuthStore((s) => s.accessToken);
  const portalRoles = useAuthStore((s) => s.portalRoles);

  if (!accessToken) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (roles && !roles.some((r) => portalRoles.includes(r))) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
